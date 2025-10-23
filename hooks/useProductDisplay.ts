'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/UnifiedLanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useLocale } from '@/contexts/LocaleProvider';
import { getProductTranslation, getTranslatedProductName, getTranslatedProductDescription, getTranslatedBrand } from '@/lib/productTranslations';
import { freeTranslationService } from '@/lib/freeTranslationService';
import { formatPrice } from '@/utils/currency';

export interface DisplayProduct {
  id: number;
  name: string;
  description?: string;
  brand?: string;
  price: string;
  originalPrice?: string;
  image?: string;
  images?: string[];
  categoryId: number;
  subcategoryId?: number;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  isOnSale: boolean;
  tags?: string[];
  specifications?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  categories?: {
    id: number;
    name: string;
    slug: string;
  };
  subcategories?: {
    id: number;
    name: string;
    slug: string;
  };
}

export function useProductDisplay() {
  const { currentLanguage } = useLanguage();
  const { currentCurrency } = useCurrency();
  const localeContext = useLocale();
  
  // Get current currency from locale context if available
  const currency = localeContext?.currency || currentCurrency || 'USD';
  const language = currentLanguage || 'en';

  // Function to convert a product to display format with translations and currency
  const convertProductForDisplay = async (product: any): Promise<DisplayProduct> => {
    // Try to get translation from static translations first
    let translatedName = getTranslatedProductName(product.id, language);
    let translatedDescription = getTranslatedProductDescription(product.id, language);
    let translatedBrand = getTranslatedBrand(product.id, language);

    // If no static translation found, try free translation service
    if (translatedName === `Product ${product.id}` || translatedName === product.name) {
      try {
        const nameResult = await freeTranslationService.translateText(product.name, language);
        translatedName = nameResult.text;
      } catch (error) {
        console.warn('Free translation failed for product name:', error);
      }
    }

    if (!translatedDescription || translatedDescription === 'Product description not available') {
      try {
        const descResult = await freeTranslationService.translateText(product.description || '', language);
        translatedDescription = descResult.text;
      } catch (error) {
        console.warn('Free translation failed for product description:', error);
      }
    }

    if (!translatedBrand || translatedBrand === 'Cosmat') {
      try {
        const brandResult = await freeTranslationService.translateText(product.brand || 'Cosmat', language);
        translatedBrand = brandResult.text;
      } catch (error) {
        console.warn('Free translation failed for product brand:', error);
      }
    }
    
    // Format prices with current currency
    const formattedPrice = formatPrice(product.price, currency, 'USD');
    const formattedOriginalPrice = product.originalPrice 
      ? formatPrice(product.originalPrice, currency, 'USD')
      : undefined;

    return {
      ...product,
      name: translatedName,
      description: translatedDescription,
      brand: translatedBrand,
      price: formattedPrice,
      originalPrice: formattedOriginalPrice,
    };
  };

  // Function to convert multiple products (async version)
  const convertProductsForDisplay = async (products: any[]): Promise<DisplayProduct[]> => {
    const results = await Promise.all(products.map(convertProductForDisplay));
    return results;
  };

  // Function to convert multiple products (sync version for immediate use)
  const convertProductsForDisplaySync = (products: any[]): DisplayProduct[] => {
    return products.map(product => {
      // Use static translations first, fallback to original
      const translatedName = getTranslatedProductName(product.id, language);
      const translatedDescription = getTranslatedProductDescription(product.id, language);
      const translatedBrand = getTranslatedBrand(product.id, language);
      
      // Format prices with current currency
      const formattedPrice = formatPrice(product.price, currency, 'USD');
      const formattedOriginalPrice = product.originalPrice 
        ? formatPrice(product.originalPrice, currency, 'USD')
        : undefined;

      return {
        ...product,
        name: translatedName !== `Product ${product.id}` ? translatedName : product.name,
        description: translatedDescription !== 'Product description not available' ? translatedDescription : product.description,
        brand: translatedBrand !== 'Cosmat' ? translatedBrand : product.brand,
        price: formattedPrice,
        originalPrice: formattedOriginalPrice,
      };
    });
  };

  // Function to get just the translated name
  const getTranslatedName = (productId: number | string): string => {
    return getTranslatedProductName(productId, language);
  };

  // Function to get just the translated description
  const getTranslatedDescription = (productId: number | string): string => {
    return getTranslatedProductDescription(productId, language);
  };

  // Function to get just the translated brand
  const getTranslatedBrandName = (productId: number | string): string => {
    return getTranslatedBrand(productId, language);
  };

  // Function to format price only
  const formatProductPrice = (price: number, originalPrice?: number) => {
    return {
      price: formatPrice(price, currency, 'USD'),
      originalPrice: originalPrice ? formatPrice(originalPrice, currency, 'USD') : undefined
    };
  };

  return {
    convertProductForDisplay,
    convertProductsForDisplay,
    convertProductsForDisplaySync,
    getTranslatedName,
    getTranslatedDescription,
    getTranslatedBrandName,
    formatProductPrice,
    currentLanguage: language,
    currentCurrency: currency
  };
}
