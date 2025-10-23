import { MetadataRoute } from 'next'
import { categories } from '../data/categories'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://cosmt.com'
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
  ]

  // Category pages
  const categoryPages = categories.map((category) => ({
    url: `${baseUrl}/category/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  // Sub-category pages
  const subCategoryPages = categories
    .flatMap((category) => 
      category.children?.map((subCategory) => ({
        url: `${baseUrl}/category/${subCategory.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })) || []
    )

  // Product pages - using hierarchical URLs
  const productPages: any[] = [] // Will be populated with real product data

  return [...staticPages, ...categoryPages, ...subCategoryPages, ...productPages]
}
