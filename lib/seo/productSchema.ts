import { Product } from '../types/Product';

interface ProductSchemaOptions {
  product: Product;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  subcategory?: {
    id: number;
    name: string;
    slug: string;
  };
  currency?: string;
}

export function generateProductSchema(options: ProductSchemaOptions) {
  const { product, category, subcategory, currency = 'USD' } = options;
  
  // Build product URL
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cosmt.com';
  let productUrl = `${baseUrl}/product/${product.id}`;
  
  if (category && subcategory && product.slug) {
    productUrl = `${baseUrl}/categories/${category.slug}/${subcategory.slug}/${product.slug}`;
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || `Buy ${product.name} from COSMAT - Premium Beauty Products`,
    image: product.images && product.images.length > 0 
      ? product.images 
      : (product.image ? [product.image] : []),
    sku: product.sku || product.id.toString(),
    brand: product.brand ? {
      '@type': 'Brand',
      name: product.brand
    } : {
      '@type': 'Brand',
      name: 'COSMAT'
    },
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: currency,
      price: product.price.toString(),
      availability: product.stock && product.stock > 0 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
      seller: {
        '@type': 'Organization',
        name: 'COSMAT'
      }
    },
    category: category?.name || 'Beauty Products',
    ...(product.is_on_sale ? {
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: product.price.toString(),
        priceCurrency: currency,
        referenceQuantity: {
          '@type': 'QuantitativeValue',
          unitCode: 'C62',
          value: 1
        }
      }
    } : {})
  };

  // Add rating if available
  if (product.rating) {
    schema['aggregateRating'] = {
      '@type': 'AggregateRating',
      ratingValue: product.rating.toString(),
      reviewCount: product.reviews ? product.reviews.toString() : '0',
      bestRating: '5',
      worstRating: '1'
    };
  }

  return schema;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

export function generateOrganizationSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cosmt.com';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'COSMAT',
    url: baseUrl,
    logo: `${baseUrl}/images/logos/logo.svg`,
    description: 'Premium Beauty & Hair Care Products',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: ['en', 'ar', 'tr', 'de', 'fr', 'es']
    },
    sameAs: [
      // Add social media URLs here when available
      // 'https://www.facebook.com/cosmat',
      // 'https://www.instagram.com/cosmat',
      // 'https://twitter.com/cosmat'
    ]
  };
}

