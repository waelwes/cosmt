import { Metadata } from 'next';
import { Category, Subcategory } from '../types/Category';

interface CategoryMetadataOptions {
  title: string;
  description: string;
  category: Category;
  subcategory?: Subcategory;
}

export function generateCategoryMetadata(options: CategoryMetadataOptions): Metadata {
  const { title, description, category, subcategory } = options;
  
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const url = subcategory 
    ? `${baseUrl}/categories/${category.slug}/${subcategory.slug}`
    : `${baseUrl}/categories/${category.slug}`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description: description,
    url: url,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: []
    }
  };

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: url,
      siteName: 'Cosmat',
      images: [
        {
          url: category.image || '/images/category-placeholder.jpg',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: [category.image || '/images/category-placeholder.jpg'],
    },
    alternates: {
      canonical: url,
    },
    other: {
      'application/ld+json': JSON.stringify(structuredData),
    },
  };
}
