// COSMT Clean Categories Structure
// All categories and subcategories have been cleared
// Ready for new architecture

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  parentId?: string;
  children?: Category[];
  productCount: number;
}

// Empty categories array - ready for new architecture
export const categories: Category[] = [];

export const getCategoryBySlug = (slug: string): Category | undefined => {
  const findCategory = (categories: Category[]): Category | undefined => {
    for (const category of categories) {
      if (category.slug === slug) {
        return category;
      }
      if (category.children) {
        const found = findCategory(category.children);
        if (found) return found;
      }
    }
    return undefined;
  };
  
  return findCategory(categories);
};

export const getMainCategories = (): Category[] => {
  return categories.filter(category => !category.parentId);
};

export const getCategoryPath = (categorySlug: string): Category[] => {
  const findPath = (categories: Category[], slug: string, path: Category[] = []): Category[] | null => {
    for (const category of categories) {
      const currentPath = [...path, category];
      
      if (category.slug === slug) {
        return currentPath;
      }
      
      if (category.children) {
        const found = findPath(category.children, slug, currentPath);
        if (found) return found;
      }
    }
    return null;
  };
  
  return findPath(categories, categorySlug) || [];
};

export const getCategoryBreadcrumbs = (categorySlug: string): Array<{ name: string; href: string }> => {
  const path = getCategoryPath(categorySlug);
  return path.map((category, index) => ({
    name: category.name,
    href: `/categories/${category.slug}`,
  }));
};

export const searchCategories = (query: string): Category[] => {
  const searchInCategories = (categories: Category[]): Category[] => {
    const results: Category[] = [];
    
    for (const category of categories) {
      if (category.name.toLowerCase().includes(query.toLowerCase()) ||
          category.description.toLowerCase().includes(query.toLowerCase())) {
        results.push(category);
      }
      
      if (category.children) {
        results.push(...searchInCategories(category.children));
      }
    }
    
    return results;
  };
  
  return searchInCategories(categories);
};

export const getPopularCategories = (limit: number = 6): Category[] => {
  return categories
    .filter(category => !category.parentId)
    .sort((a, b) => b.productCount - a.productCount)
    .slice(0, limit);
};

export const getSubCategories = (parentId: string): Category[] => {
  const findSubCategories = (categories: Category[]): Category[] => {
    for (const category of categories) {
      if (category.id === parentId && category.children) {
        return category.children;
      }
      if (category.children) {
        const found = findSubCategories(category.children);
        if (found.length > 0) return found;
      }
    }
    return [];
  };
  
  return findSubCategories(categories);
};
