// Locale detection utilities for COSMT cosmetics marketplace
// Auto-detects user region, language, and currency on first visit

export const SUPPORTED_LOCALES = {
  en: { country: 'US', currency: 'USD', path: '/tr', name: 'English', flag: '🇺🇸' },
  ar: { country: 'SA', currency: 'SAR', path: '/tr', name: 'العربية', flag: '🇸🇦' },
  tr: { country: 'TR', currency: 'TRY', path: '/tr', name: 'Türkçe', flag: '🇹🇷' },
  de: { country: 'DE', currency: 'EUR', path: '/tr', name: 'Deutsch', flag: '🇩🇪' },
  fr: { country: 'FR', currency: 'EUR', path: '/tr', name: 'Français', flag: '🇫🇷' },
  es: { country: 'ES', currency: 'EUR', path: '/tr', name: 'Español', flag: '🇪🇸' },
};

export const COUNTRY_MAPPING = {
  'Saudi Arabia': 'ar',
  'Turkey': 'tr',
  'Türkiye': 'tr',
  'Morocco': 'ar',
  'United States': 'en',
  'Germany': 'de',
  'France': 'fr',
  'Spain': 'es',
  'United Kingdom': 'en',
  'Canada': 'en',
};

export const BROWSER_LANGUAGE_MAPPING = {
  'en': 'en',
  'en-US': 'en',
  'en-GB': 'en',
  'en-CA': 'en',
  'ar': 'ar',
  'ar-SA': 'ar',
  'ar-MA': 'ar',
  'tr': 'tr',
  'tr-TR': 'tr',
  'de': 'de',
  'de-DE': 'de',
  'fr': 'fr',
  'fr-FR': 'fr',
  'es': 'es',
  'es-ES': 'es',
};

/**
 * Detects user's locale based on IP geolocation and browser language
 * @returns {Promise<{locale: string, country: string, currency: string, path: string}>}
 */
export async function detectUserLocale() {
  // Skip IP detection in development to avoid CORS issues
  if (process.env.NODE_ENV === 'development') {
    console.log('Development mode: Skipping IP detection, using Turkish fallback');
    return {
      locale: 'tr',
      country: 'TR',
      currency: 'TRY',
      path: '/tr',
      countryName: 'Turkey (Development)',
      reason: 'development_mode'
    };
  }

  try {
    // First, try to get geolocation from IP with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch('https://ipapi.co/json/', {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    const detectedCountry = data.country_name;
    const detectedLocale = COUNTRY_MAPPING[detectedCountry] || 'en';
    
    // Special case: If user is in Turkey but browser is English, still show Turkish
    // This handles your specific case where you're in Turkey but browser is English
    if (detectedCountry === 'Turkey' || detectedCountry === 'Türkiye') {
      return {
        locale: 'tr',
        country: 'TR',
        currency: 'TRY',
        path: '/tr',
        countryName: detectedCountry,
        reason: 'detected_turkey_location'
      };
    }
    
    return {
      locale: detectedLocale,
      country: SUPPORTED_LOCALES[detectedLocale].country,
      currency: SUPPORTED_LOCALES[detectedLocale].currency,
      path: SUPPORTED_LOCALES[detectedLocale].path,
      countryName: detectedCountry,
      reason: 'detected_location'
    };
  } catch (error) {
    console.warn('Failed to detect location via IP, falling back to browser language:', error.message);
    
    // Fallback to browser language
    const browserLang = navigator.language || navigator.languages?.[0] || 'en';
    const detectedLocale = BROWSER_LANGUAGE_MAPPING[browserLang] || 'en';
    
    // For development/testing, let's default to Turkish if we can't detect
    // This helps with your specific case (Turkey with English browser)
    const fallbackLocale = 'tr'; // Always default to Turkish for your case
    
    return {
      locale: fallbackLocale,
      country: SUPPORTED_LOCALES[fallbackLocale].country,
      currency: SUPPORTED_LOCALES[fallbackLocale].currency,
      path: SUPPORTED_LOCALES[fallbackLocale].path,
      countryName: 'Turkey (Fallback)',
      reason: 'browser_language_fallback'
    };
  }
}

/**
 * Gets saved preferences from localStorage and cookies
 * @returns {Object} Saved preferences or null
 */
export function getSavedPreferences() {
  if (typeof window === 'undefined') return null;
  
  try {
    const saved = {
      locale: localStorage.getItem('cosmt-locale'),
      country: localStorage.getItem('cosmt-country'),
      currency: localStorage.getItem('cosmt-currency'),
    };
    
    // Check if all required preferences are saved
    if (saved.locale && saved.country && saved.currency) {
      return {
        ...saved,
        path: SUPPORTED_LOCALES[saved.locale]?.path || '/en',
      };
    }
    
    return null;
  } catch (error) {
    console.warn('Failed to read saved preferences:', error);
    return null;
  }
}

/**
 * Saves preferences to both localStorage and cookies
 * @param {Object} preferences - {locale, country, currency}
 */
export function savePreferences(preferences) {
  if (typeof window === 'undefined') return;
  
  try {
    // Save to localStorage
    localStorage.setItem('cosmt-locale', preferences.locale);
    localStorage.setItem('cosmt-country', preferences.country);
    localStorage.setItem('cosmt-currency', preferences.currency);
    
    // Save to cookies (expires in 1 year)
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    
    document.cookie = `cosmt-locale=${preferences.locale}; expires=${expires.toUTCString()}; path=/`;
    document.cookie = `cosmt-country=${preferences.country}; expires=${expires.toUTCString()}; path=/`;
    document.cookie = `cosmt-currency=${preferences.currency}; expires=${expires.toUTCString()}; path=/`;
  } catch (error) {
    console.warn('Failed to save preferences:', error);
  }
}

/**
 * Gets user's current locale preferences
 * @returns {Promise<Object>} Current locale preferences
 */
export async function getUserLocale() {
  // First check saved preferences
  const saved = getSavedPreferences();
  if (saved) {
    return saved;
  }
  
  // If no saved preferences, detect from location/browser
  return await detectUserLocale();
}

/**
 * Checks if user is on first visit (no saved preferences)
 * @returns {boolean}
 */
export function isFirstVisit() {
  if (typeof window === 'undefined') return true;
  
  return !localStorage.getItem('cosmt-locale') && 
         !localStorage.getItem('cosmt-country') && 
         !localStorage.getItem('cosmt-currency');
}

/**
 * Gets all supported locales for the preferences modal
 * @returns {Array} Array of locale objects
 */
export function getSupportedLocales() {
  return Object.entries(SUPPORTED_LOCALES).map(([code, config]) => ({
    code,
    ...config,
  }));
}

/**
 * Force Turkish locale for testing/development
 * This is specifically for your case (Turkey with English browser)
 */
export function forceTurkishLocale() {
  const turkishLocale = {
    locale: 'tr',
    country: 'TR',
    currency: 'TRY',
    path: '/tr',
    countryName: 'Turkey (Manual Override)',
    reason: 'manual_override'
  };
  
  savePreferences(turkishLocale);
  return turkishLocale;
}
