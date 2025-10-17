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

  // Product pages (mock - in real app, this would come from your database)
  const productPages = Array.from({ length: 50 }, (_, i) => ({
    url: `${baseUrl}/product/${i + 1}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...categoryPages, ...subCategoryPages, ...productPages]
}
