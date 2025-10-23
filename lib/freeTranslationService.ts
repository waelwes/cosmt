// Free translation service with multiple fallback strategies
export interface TranslationResult {
  text: string;
  source: string;
  confidence: number;
}

export class FreeTranslationService {
  private services: Array<{
    name: string;
    translate: (text: string, targetLang: string, sourceLang?: string) => Promise<string>;
    priority: number;
  }> = [];

  constructor() {
    this.initializeServices();
  }

  private initializeServices() {
    // 1. LibreTranslate (Free, self-hosted)
    this.services.push({
      name: 'libretranslate',
      translate: this.translateWithLibreTranslate.bind(this),
      priority: 1
    });

    // 2. MyMemory (Free, 1000 requests/day)
    this.services.push({
      name: 'mymemory',
      translate: this.translateWithMyMemory.bind(this),
      priority: 2
    });

    // 3. Google Translate (Free tier: 500k chars/month)
    if (process.env.GOOGLE_TRANSLATE_API_KEY) {
      this.services.push({
        name: 'google',
        translate: this.translateWithGoogle.bind(this),
        priority: 3
      });
    }

    // Sort by priority
    this.services.sort((a, b) => a.priority - b.priority);
  }

  // Main translation method with fallbacks
  async translateText(
    text: string,
    targetLanguage: string,
    sourceLanguage: string = 'en'
  ): Promise<TranslationResult> {
    // If same language, return original
    if (sourceLanguage === targetLanguage) {
      return {
        text,
        source: 'none',
        confidence: 1.0
      };
    }

    // Try each service in order
    for (const service of this.services) {
      try {
        console.log(`Trying ${service.name} for translation...`);
        const translatedText = await service.translate(text, targetLanguage, sourceLanguage);
        
        if (translatedText && translatedText !== text) {
          return {
            text: translatedText,
            source: service.name,
            confidence: 0.8 // Default confidence
          };
        }
      } catch (error) {
        console.warn(`${service.name} translation failed:`, error);
        continue;
      }
    }

    // If all services fail, return original text
    return {
      text,
      source: 'fallback',
      confidence: 0.0
    };
  }

  // LibreTranslate implementation
  private async translateWithLibreTranslate(
    text: string,
    targetLanguage: string,
    sourceLanguage: string = 'en'
  ): Promise<string> {
    const response = await fetch('https://libretranslate.com/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: sourceLanguage,
        target: targetLanguage,
        format: 'text'
      })
    });

    if (!response.ok) {
      throw new Error(`LibreTranslate error: ${response.status}`);
    }

    const data = await response.json();
    return data.translatedText || text;
  }

  // MyMemory implementation
  private async translateWithMyMemory(
    text: string,
    targetLanguage: string,
    sourceLanguage: string = 'en'
  ): Promise<string> {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLanguage}|${targetLanguage}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`MyMemory error: ${response.status}`);
    }

    const data = await response.json();
    return data.responseData?.translatedText || text;
  }

  // Google Translate implementation (if API key available)
  private async translateWithGoogle(
    text: string,
    targetLanguage: string,
    sourceLanguage: string = 'en'
  ): Promise<string> {
    if (!process.env.GOOGLE_TRANSLATE_API_KEY) {
      throw new Error('Google Translate API key not available');
    }

    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          target: targetLanguage,
          source: sourceLanguage,
          format: 'text'
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Google Translate error: ${response.status}`);
    }

    const data = await response.json();
    return data.data.translations[0].translatedText || text;
  }

  // Batch translation for multiple texts
  async translateBatch(
    texts: string[],
    targetLanguage: string,
    sourceLanguage: string = 'en'
  ): Promise<TranslationResult[]> {
    const results: TranslationResult[] = [];
    
    for (const text of texts) {
      const result = await this.translateText(text, targetLanguage, sourceLanguage);
      results.push(result);
      
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return results;
  }

  // Get available services
  getAvailableServices(): string[] {
    return this.services.map(service => service.name);
  }

  // Test service availability
  async testService(serviceName: string): Promise<boolean> {
    const service = this.services.find(s => s.name === serviceName);
    if (!service) return false;

    try {
      await service.translate('test', 'es', 'en');
      return true;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const freeTranslationService = new FreeTranslationService();
