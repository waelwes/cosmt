import { NextRequest, NextResponse } from 'next/server';

// Simple test function for translation services
async function testLibreTranslate(text: string, targetLang: string): Promise<string> {
  try {
    const response = await fetch('https://libretranslate.com/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: 'en',
        target: targetLang,
        format: 'text'
      })
    });

    if (!response.ok) {
      throw new Error(`LibreTranslate error: ${response.status}`);
    }

    const data = await response.json();
    return data.translatedText || text;
  } catch (error) {
    throw new Error(`LibreTranslate failed: ${error}`);
  }
}

async function testMyMemory(text: string, targetLang: string): Promise<string> {
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`MyMemory error: ${response.status}`);
    }

    const data = await response.json();
    return data.responseData?.translatedText || text;
  } catch (error) {
    throw new Error(`MyMemory failed: ${error}`);
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get('text') || 'Hydrating Face Serum';
  const lang = searchParams.get('lang') || 'ar';

  console.log(`🧪 Testing translation: "${text}" to ${lang}`);

  const results = {
    original: text,
    targetLanguage: lang,
    services: {} as any,
    timestamp: new Date().toISOString()
  };

  // Test LibreTranslate
  try {
    console.log('Testing LibreTranslate...');
    const libreResult = await testLibreTranslate(text, lang);
    results.services.libretranslate = {
      success: true,
      translation: libreResult,
      source: 'libretranslate.com'
    };
    console.log('✅ LibreTranslate:', libreResult);
  } catch (error) {
    results.services.libretranslate = {
      success: false,
      error: error.message
    };
    console.log('❌ LibreTranslate failed:', error.message);
  }

  // Test MyMemory
  try {
    console.log('Testing MyMemory...');
    const memoryResult = await testMyMemory(text, lang);
    results.services.mymemory = {
      success: true,
      translation: memoryResult,
      source: 'mymemory.translated.net'
    };
    console.log('✅ MyMemory:', memoryResult);
  } catch (error) {
    results.services.mymemory = {
      success: false,
      error: error.message
    };
    console.log('❌ MyMemory failed:', error.message);
  }

  return NextResponse.json(results, { status: 200 });
}
