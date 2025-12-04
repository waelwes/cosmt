import { useLanguage } from '@/contexts/UnifiedLanguageContext';

/**
 * Hook to get the appropriate product name based on current language
 * Usage: const displayName = useProductLanguage(product);
 */
export function useProductLanguage() {
  const { currentLanguage } = useLanguage();
  
  return {
    getProductName: (product: any) => {
      if (currentLanguage === 'ar') {
        return product.name; // Arabic name (stored in 'name' column)
      }
      return product.name_en || product.name; // English name, fallback to Arabic if not available
    },
    
    getProductDescription: (product: any) => {
      if (currentLanguage === 'ar') {
        return product.description || '';
      }
      return product.description_en || product.description || '';
    },
    
    currentLanguage
  };
}

/**
 * Component wrapper to display product with correct language
 */
export interface BilingualProduct {
  id: number;
  name: string;           // Arabic name
  name_en?: string;       // English name
  description?: string;   // Arabic description
  description_en?: string; // English description
  image: string;
  price: number;
  brand?: string;
  category_id?: number | null;
  status: string;
  [key: string]: any;
}

export function ProductLanguageHelper {
  static getName(product: BilingualProduct, language: 'ar' | 'en') {
    return language === 'ar' ? product.name : (product.name_en || product.name);
  }
  
  static getDescription(product: BilingualProduct, language: 'ar' | 'en') {
    return language === 'ar' 
      ? (product.description || '')
      : (product.description_en || product.description || '');
  }
}

/**
 * Higher-order component to inject language-aware product props
 */
export function withBilingualProducts<P extends { product: BilingualProduct; locale?: string }>(
  Component: React.ComponentType<P>
) {
  return function BilingualProductComponent(props: Omit<P, 'product'> & { product: BilingualProduct }) {
    const { getProductName, getProductDescription, currentLanguage } = useProductLanguage();
    
    return (
      <Component
        {...(props as P)}
        product={{
          ...props.product,
          displayName: getProductName(props.product),
          displayDescription: getProductDescription(props.product),
          locale: currentLanguage
        }}
      />
    );
  };
}

/**
 * Example usage in a product card component:
 * 
 * export function ProductCard({ product }: { product: BilingualProduct }) {
 *   const { getProductName } = useProductLanguage();
 *   
 *   return (
 *     <div>
 *       <h3>{getProductName(product)}</h3>
 *       <img src={product.image} alt={getProductName(product)} />
 *       <p>${product.price}</p>
 *     </div>
 *   );
 * }
 */
