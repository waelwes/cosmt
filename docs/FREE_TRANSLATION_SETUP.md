# Free Translation Setup Guide

This guide shows you how to set up **completely free** translation services for your e-commerce website.

## 🆓 Free Translation Services

### 1. LibreTranslate (Recommended - 100% Free)
- **Cost**: Completely free
- **Limits**: None (self-hosted)
- **Languages**: 100+ languages
- **Setup**: No API key required

#### Option A: Use Public Instance (Easiest)
```typescript
// Already configured in freeTranslationService.ts
// Uses: https://libretranslate.com
// No setup required!
```

#### Option B: Self-Host (Most Control)
```bash
# Install LibreTranslate
pip install libretranslate

# Start server
libretranslate --host 0.0.0.0 --port 5000

# Update baseUrl in freeTranslationService.ts
this.baseUrl = 'http://your-server:5000';
```

### 2. MyMemory API (Free Tier)
- **Cost**: Free
- **Limits**: 1,000 requests/day
- **Languages**: 100+ languages
- **Setup**: No API key required

```typescript
// Already configured in freeTranslationService.ts
// Uses: https://api.mymemory.translated.net
// No setup required!
```

### 3. Google Translate (Optional - Free Tier)
- **Cost**: Free for 500,000 characters/month
- **Limits**: 500k characters/month
- **Languages**: 100+ languages
- **Setup**: Requires API key

#### Setup Google Translate (Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Cloud Translation API"
4. Create credentials (API Key)
5. Add to your `.env.local`:

```bash
GOOGLE_TRANSLATE_API_KEY=your_api_key_here
```

## 🚀 How It Works

The system automatically tries multiple free services in order:

1. **Static Translations** (from your database/hardcoded)
2. **LibreTranslate** (100% free, no limits)
3. **MyMemory** (1,000 requests/day free)
4. **Google Translate** (500k chars/month free, if API key provided)

## 📊 Usage Examples

### Basic Translation
```typescript
import { freeTranslationService } from '@/lib/freeTranslationService';

// Translate single text
const result = await freeTranslationService.translateText(
  'Hydrating Face Serum', 
  'ar' // Arabic
);
console.log(result.text); // "مصل ترطيب الوجه"
```

### Batch Translation
```typescript
// Translate multiple texts
const texts = ['Face Cream', 'Hair Shampoo', 'Body Lotion'];
const results = await freeTranslationService.translateBatch(
  texts, 
  'tr' // Turkish
);
```

### Check Service Status
```typescript
// Test if services are working
const isLibreTranslateWorking = await freeTranslationService.testService('libretranslate');
const isMyMemoryWorking = await freeTranslationService.testService('mymemory');

console.log('Available services:', freeTranslationService.getAvailableServices());
```

## 🔧 Configuration

### Environment Variables (Optional)
```bash
# .env.local
GOOGLE_TRANSLATE_API_KEY=your_google_api_key_here
LIBRETRANSLATE_URL=https://your-libretranslate-server.com
```

### Custom Service Configuration
```typescript
// lib/freeTranslationService.ts
private initializeServices() {
  // Add your custom free translation service
  this.services.push({
    name: 'custom',
    translate: this.translateWithCustomService.bind(this),
    priority: 1 // Higher priority = tried first
  });
}
```

## 📈 Performance Tips

### 1. Caching
```typescript
// The service automatically caches translations
// Cache is stored in memory and persists during the session
```

### 2. Rate Limiting
```typescript
// Built-in delays prevent rate limiting
// 100ms delay between requests
```

### 3. Fallback Strategy
```typescript
// If all services fail, returns original text
// No broken translations!
```

## 🛠 Troubleshooting

### Common Issues

1. **LibreTranslate not working**
   - Check if https://libretranslate.com is accessible
   - Try self-hosting if public instance is down

2. **MyMemory rate limited**
   - Wait 24 hours for reset
   - Or use other services

3. **Google Translate not working**
   - Check API key in environment variables
   - Verify billing is enabled (even for free tier)

### Debug Mode
```typescript
// Enable debug logging
console.log('Translation result:', await freeTranslationService.translateText('test', 'es'));
```

## 💡 Pro Tips

1. **Start with LibreTranslate** - It's completely free with no limits
2. **Add Google Translate** - For better quality (if you have API key)
3. **Use MyMemory as backup** - When other services fail
4. **Cache translations** - Store in database to avoid repeated API calls
5. **Monitor usage** - Track which services are being used most

## 🎯 Expected Results

With this setup, you'll get:
- ✅ **100% free translations** for all products
- ✅ **Automatic fallbacks** if one service fails
- ✅ **No API limits** (with LibreTranslate)
- ✅ **100+ languages** supported
- ✅ **Easy setup** - no complex configuration needed

Your products will automatically translate to any language your users select, completely free!
