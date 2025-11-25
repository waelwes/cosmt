/**
 * Utility functions for generating and extracting URL slugs
 */

/**
 * Generate a URL-friendly slug from a string
 * @param text - The text to convert to a slug
 * @returns A URL-friendly slug
 */
export function generateSlug(text?: string): string {
  if (!text) return "";
  return text
    .toString()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Generate a product URL with hierarchical structure
 * @param productName - The name of the product
 * @param categorySlug - The category slug
 * @param subcategorySlug - Optional subcategory slug
 * @returns A hierarchical product URL
 */
export function generateProductUrl(
  productName: string,
  categorySlug: string,
  subcategorySlug?: string
): string {
  const productSlug = generateSlug(productName);
  
  if (subcategorySlug) {
    return `/categories/${categorySlug}/${subcategorySlug}/${productSlug}`;
  }
  
  return `/categories/${categorySlug}/${productSlug}`;
}

/**
 * Generate a category URL
 * @param categorySlug - The category slug
 * @returns A category URL
 */
export function generateCategoryUrl(categorySlug: string): string {
  return `/categories/${categorySlug}`;
}

/**
 * Generate a subcategory URL
 * @param categorySlug - The category slug
 * @param subcategorySlug - The subcategory slug
 * @returns A subcategory URL
 */
export function generateSubcategoryUrl(categorySlug: string, subcategorySlug: string): string {
  return `/categories/${categorySlug}/${subcategorySlug}`;
}

/**
 * Build a safe product path. Falls back to /product/{id} if slugs are missing
 */
export function buildProductPath(params: {
  name?: string;
  categorySlug?: string | null;
  subcategorySlug?: string | null;
  productSlug?: string | null;
  id?: number | string | null;
  locale?: string;
}) {
  const { name, categorySlug, subcategorySlug, productSlug, id, locale } = params;
  const safeProductSlug = productSlug || (name ? generateSlug(name) : "");
  const safeCategory = categorySlug || "";
  const safeSubcategory = subcategorySlug || "";
  const localePrefix = locale ? `/${locale}` : "";

  if (!safeProductSlug || !id) return `${localePrefix}/product/${id ?? ""}`;

  if (safeSubcategory && safeSubcategory === safeProductSlug && safeCategory) {
    return `${localePrefix}/categories/${safeCategory}/${safeSubcategory}`;
  }

  if (safeCategory && safeSubcategory) {
    return `${localePrefix}/categories/${safeCategory}/${safeSubcategory}/${safeProductSlug}`;
  }

  if (safeCategory) {
    return `${localePrefix}/categories/${safeCategory}/${safeProductSlug}`;
  }

  return `${localePrefix}/product/${id}`;
}

/**
 * Extract category and subcategory from a hierarchical URL
 * @param pathname - The URL pathname
 * @returns Object with category and subcategory slugs
 */
export function extractCategoryFromUrl(pathname: string): {
  category?: string;
  subcategory?: string;
  productSlug?: string;
} {
  const segments = pathname.split('/').filter(Boolean);
  
  if (segments[0] === 'categories' && segments.length >= 2) {
    const result: any = {
      category: segments[1]
    };
    
    if (segments.length >= 3) {
      // If there are 3 segments after 'categories', either subcategory or product slug
      if (segments.length === 3) {
        // Could be category/productSlug or category/subcategory
        // We'll assume category/subcategory by default; caller can validate
        result.subcategory = segments[2];
      }
      if (segments.length >= 4) {
        result.subcategory = segments[2];
        result.productSlug = segments[3];
      }
    }
    
    return result;
  }
  
  return {};
}
