import { createClient } from '@supabase/supabase-js';
import { ICategoryService } from '../interfaces/ICategoryService';
import { Category, Subcategory, CategoryWithSubcategories } from '../../types/Category';
import { requestDeduplicator } from '../../utils/requestDeduplication';

export class SupabaseCategoryService implements ICategoryService {
  private supabase;

  constructor() {
    // Check if environment variables are set
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('❌ Missing Supabase environment variables');
      console.error('Please run: node create-env-file.js');
      throw new Error('Missing Supabase environment variables');
    }

    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  }

  private checkSupabaseConnection(): void {
    if (!this.supabase) {
      throw new Error('Supabase client not initialized');
    }
  }

  // Method to get child subcategories in a single query
  async getChildSubcategoriesByParentIds(parentIds: number[]): Promise<Subcategory[]> {
    this.checkSupabaseConnection();
    
    try {
      const { data, error } = await this.supabase
        .from('categories')
        .select('*')
        .in('parent_id', parentIds)
        .eq('is_active', true)
        .order('sort_order, name');

      if (error) {
        console.error('❌ Error fetching child subcategories:', error);
        return [];
      }

      // Transform the data to match the expected Subcategory interface
      const transformedData = (data || []).map(subcategory => ({
        id: subcategory.id,
        name: subcategory.name,
        slug: subcategory.slug,
        description: subcategory.description || '',
        image: subcategory.image || '',
        categoryId: subcategory.parent_id,
        level: 3, // Child subcategories are level 3
        parentId: subcategory.parent_id,
        isActive: subcategory.is_active,
        sortOrder: subcategory.sort_order || 0,
        productCount: 0,
        createdAt: subcategory.created_at,
        updatedAt: subcategory.updated_at
      }));

      return transformedData;
    } catch (error) {
      console.error('❌ Exception in getChildSubcategoriesByParentIds:', error);
      return [];
    }
  }

  async getCategories(): Promise<Category[]> {
    this.checkSupabaseConnection();
    
    try {
      console.log('🔍 Fetching main categories (parent_id IS NULL)...');
      const { data, error } = await this.supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .is('parent_id', null)
        .order('sort_order');

      if (error) {
        console.error('❌ Error fetching categories:', {
          error,
          errorMessage: error.message,
          errorCode: error.code,
          errorDetails: error.details,
          errorHint: error.hint,
          fullError: JSON.stringify(error),
          errorStringified: JSON.stringify(error, null, 2)
        });
        return [];
      }

      console.log('✅ Main categories fetched successfully:', data?.length || 0);
      
      // Transform the data to match the expected Category interface
      const transformedData = (data || []).map(category => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        image: category.image || '',
        level: 1, // Main categories are level 1
        parentId: null,
        isActive: category.is_active,
        sortOrder: category.sort_order || 0,
        productCount: 0, // We'll calculate this separately if needed
        createdAt: category.created_at,
        updatedAt: category.updated_at
      }));

      return transformedData;
    } catch (error) {
      console.error('❌ Exception in getCategories:', error);
      return [];
    }
  }

  async getCategoryById(id: number): Promise<Category | null> {
    this.checkSupabaseConnection();
    
    try {
      const { data, error } = await this.supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('❌ Error fetching category by ID:', error);
        return null;
      }

      // Transform the data to match the expected Category interface
      const transformedData = {
        id: data.id,
        name: data.name,
        slug: data.slug,
        description: data.description || '',
        image: data.image || '',
        level: data.parent_id ? 2 : 1, // 2 for subcategories, 1 for main categories
        parentId: data.parent_id,
        isActive: data.is_active !== false, // Default to true if not set
        sortOrder: data.sort_order || 0,
        productCount: 0, // This would need a separate query if actual count is needed
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };

      return transformedData;
    } catch (error) {
      console.error('❌ Exception in getCategoryById:', error);
      return null;
    }
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    this.checkSupabaseConnection();
    
    try {
      const safeSlug = (slug ?? '').toString().trim();
      if (!safeSlug) {
        console.warn('⚠️ getCategoryBySlug called with empty slug');
        return null;
      }
      console.log('🔍 Searching for category with slug:', safeSlug);
      console.log('🔍 Slug type:', typeof safeSlug, 'Length:', safeSlug.length);

      // First check if categories table has data
      const { data: allCategories, error: allCategoriesError } = await this.supabase
        .from('categories')
        .select('id, name, slug')
        .limit(1);

      if (allCategoriesError) {
        console.error('❌ Error checking categories table:', allCategoriesError);
      } else {
        console.log('🔍 All categories check:', { hasData: allCategories && allCategories.length > 0, count: allCategories?.length });
      }

      // Try exact match first
      console.log('🔍 Attempting exact match for slug:', slug);
      const { data: exactMatch, error: exactError } = await this.supabase
        .from('categories')
        .select('*')
        .eq('slug', safeSlug)
        .eq('is_active', true)
        .maybeSingle();

      console.log('🔍 Exact match result:', { data: exactMatch, error: exactError });

      if (exactMatch && !exactError) {
        console.log('✅ Category found:', exactMatch);
        return exactMatch;
      }

      // Try case-insensitive match
      console.log('🔍 Trying case-insensitive match...');
      const { data: caseInsensitiveMatch, error: caseInsensitiveError } = await this.supabase
        .from('categories')
        .select('*')
        .ilike('slug', safeSlug)
        .eq('is_active', true)
        .maybeSingle();

      console.log('🔍 Case-insensitive result:', { data: caseInsensitiveMatch, error: caseInsensitiveError });

      if (caseInsensitiveMatch && !caseInsensitiveError) {
        console.log('✅ Category found (case-insensitive):', caseInsensitiveMatch);
        return caseInsensitiveMatch;
      }

      // Try name match as fallback
      console.log('🔍 Trying name match...');
      const { data: nameMatch, error: nameError } = await this.supabase
        .from('categories')
        .select('*')
        .ilike('name', safeSlug)
        .eq('is_active', true)
        .maybeSingle();

      console.log('🔍 Name match result:', { data: nameMatch, error: nameError });

      if (nameMatch && !nameError) {
        console.log('✅ Category found (name match):', nameMatch);
        return nameMatch;
      }

      // Final fallback: allow inactive records (diagnostic scenario)
      console.log('🔍 Final fallback: searching without is_active constraint...');
      const { data: anyMatch, error: anyError } = await this.supabase
        .from('categories')
        .select('*')
        .or(`slug.eq.${safeSlug},name.ilike.${safeSlug}`)
        .maybeSingle();
      if (anyMatch && !anyError) {
        console.log('✅ Category found (any status):', anyMatch);
        return anyMatch as any;
      }

      // If no match found, return null silently
      return null;
    } catch (error) {
      console.error('❌ Exception in getCategoryBySlug:', error);
      return null;
    }
  }

  async getSubcategories(): Promise<Subcategory[]> {
    this.checkSupabaseConnection();
    
    try {
      console.log('🔍 Fetching subcategories (parent_id IS NOT NULL)...');
      const { data, error } = await this.supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .not('parent_id', 'is', null)
        .order('sort_order');

      if (error) {
        console.error('❌ Error fetching subcategories:', error);
        return [];
      }

      console.log('✅ Subcategories fetched successfully:', data?.length || 0);

      // Transform the data to match the expected Subcategory interface
      const transformedData = (data || []).map(subcategory => ({
        id: subcategory.id,
        name: subcategory.name,
        slug: subcategory.slug,
        description: subcategory.description || '',
        image: subcategory.image || '',
        categoryId: subcategory.parent_id, // parent_id is now the category_id
        level: 2, // Subcategories are level 2
        parentId: subcategory.parent_id,
        isActive: subcategory.is_active,
        sortOrder: subcategory.sort_order || 0,
        productCount: 0, // We'll calculate this separately if needed
        createdAt: subcategory.created_at,
        updatedAt: subcategory.updated_at
      }));

      return transformedData;
    } catch (error) {
      console.error('❌ Exception in getSubcategories:', error);
      return [];
    }
  }

  async getSubcategoriesByCategory(categoryId: number): Promise<Subcategory[]> {
    this.checkSupabaseConnection();
    
    try {
      console.log(`🔍 Fetching subcategories for category ID: ${categoryId}...`);
      const { data, error } = await this.supabase
        .from('categories')
        .select('*')
        .eq('parent_id', categoryId)
        .eq('is_active', true)
        .order('sort_order');

      if (error) {
        console.error('❌ Error fetching subcategories by category:', error);
        return [];
      }

      console.log(`✅ Subcategories for category ${categoryId} fetched successfully:`, data?.length || 0);

      // Transform the data to match the expected Subcategory interface
      const transformedData = (data || []).map(subcategory => ({
        id: subcategory.id,
        name: subcategory.name,
        slug: subcategory.slug,
        description: subcategory.description || '',
        image: subcategory.image || '',
        categoryId: subcategory.parent_id, // parent_id is now the category_id
        level: 2, // Subcategories are level 2
        parentId: subcategory.parent_id,
        isActive: subcategory.is_active,
        sortOrder: subcategory.sort_order || 0,
        productCount: 0, // We'll calculate this separately if needed
        createdAt: subcategory.created_at,
        updatedAt: subcategory.updated_at
      }));

      return transformedData;
    } catch (error) {
      console.error('❌ Exception in getSubcategoriesByCategory:', error);
      return [];
    }
  }

  async getSubcategoryBySlug(slug: string): Promise<Subcategory | null> {
    this.checkSupabaseConnection();
    
    try {
      const { data, error } = await this.supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .not('parent_id', 'is', null)
        .single();

      if (error) {
        console.error('❌ Error fetching subcategory by slug:', error);
        return null;
      }

      // Transform the data to match the expected Subcategory interface
      return {
        id: data.id,
        name: data.name,
        slug: data.slug,
        description: data.description || '',
        image: data.image || '',
        categoryId: data.parent_id,
        level: 2,
        parentId: data.parent_id,
        isActive: data.is_active,
        sortOrder: data.sort_order || 0,
        productCount: 0,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (error) {
      console.error('❌ Exception in getSubcategoryBySlug:', error);
      return null;
    }
  }

  async getCategoriesWithSubcategories(): Promise<CategoryWithSubcategories[]> {
    this.checkSupabaseConnection();
    
    // Use request deduplication to prevent multiple simultaneous calls
    return await requestDeduplicator.deduplicate('getCategoriesWithSubcategories', async () => {
      try {
        console.log('🔍 getCategoriesWithSubcategories: Starting optimized fetch...');

      // Optimized query with proper filtering and limiting
      // Order by parent_id DESC to put null values (main categories) first
      const { data: allCategories, error: allCategoriesError } = await this.supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('parent_id', { ascending: false }) // null values first
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true })
        .limit(500); // Increased limit to fetch all categories and subcategories

      if (allCategoriesError) {
        console.error('❌ Error fetching all categories:', {
          error: allCategoriesError,
          message: allCategoriesError.message,
          code: allCategoriesError.code,
          details: allCategoriesError.details,
          hint: allCategoriesError.hint
        });
        return [];
      }

      const safeAllCategories = allCategories || [];
      console.log('🔍 getCategoriesWithSubcategories: Fetched all categories:', safeAllCategories.length);

      // Separate main categories, subcategories, and child categories
      const mainCategories = safeAllCategories.filter(cat => cat.parent_id === null);
      
      // Get main category IDs for filtering subcategories
      const mainCategoryIds = mainCategories.map(cat => cat.id);
      
      const subcategories = safeAllCategories.filter(cat => {
        // Subcategories are those whose parent is a main category
        return cat.parent_id !== null && mainCategoryIds.includes(cat.parent_id);
      });
      
      // Get subcategory IDs for filtering child categories
      const subcategoryIds = subcategories.map(sub => sub.id);
      const childCategories = safeAllCategories.filter(cat => {
        // Child categories are those whose parent is a subcategory
        return cat.parent_id !== null && subcategoryIds.includes(cat.parent_id);
      });

      console.log('🔍 Main categories:', mainCategories.length, 'Subcategories:', subcategories.length, 'Child categories:', childCategories.length);

      // Group subcategories by parent_id (main categories)
      const subcategoriesByParent = subcategories.reduce((acc, sub) => {
        const parentId = sub.parent_id;
        if (!acc[parentId]) {
          acc[parentId] = [];
        }
        acc[parentId].push(sub);
        return acc;
      }, {} as Record<number, any[]>);

      // Group child categories by parent_id (subcategories)
      const childCategoriesByParent = childCategories.reduce((acc, child) => {
        const parentId = child.parent_id;
        if (!acc[parentId]) {
          acc[parentId] = [];
        }
        acc[parentId].push(child);
        return acc;
      }, {} as Record<number, any[]>);


      // Build the final result
      const categoriesWithSubs = mainCategories.map(category => {
        const categorySubs = subcategoriesByParent[category.id] || [];
        
        // Transform subcategories to match the Subcategory interface
        const transformedSubcategories = categorySubs.map(sub => {
          const subChildren = childCategoriesByParent[sub.id] || [];
          
          // Transform child categories
          const transformedChildren = subChildren.map(child => ({
            id: child.id,
            name: child.name,
            slug: child.slug,
            description: child.description || '',
            image: child.image || '',
            categoryId: sub.id,
            level: 3,
            parentId: child.parent_id,
            isActive: child.is_active,
            sortOrder: child.sort_order || 0,
            productCount: 0,
            createdAt: child.created_at,
            updatedAt: child.updated_at
          }));

          return {
            id: sub.id,
            name: sub.name,
            slug: sub.slug,
            description: sub.description || '',
            image: sub.image || '',
            categoryId: category.id, // Use the parent category ID
            level: 2,
            parentId: sub.parent_id,
            isActive: sub.is_active,
            sortOrder: sub.sort_order || 0,
            productCount: 0,
            createdAt: sub.created_at,
            updatedAt: sub.updated_at,
            children: transformedChildren
          };
        });

        return {
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description || '',
          image: category.image || '',
          level: 1,
          parentId: null,
          isActive: category.is_active,
          sortOrder: category.sort_order || 0,
          productCount: 0,
          createdAt: category.created_at,
          updatedAt: category.updated_at,
          subcategories: transformedSubcategories
        } as CategoryWithSubcategories;
      });

      console.log('🔍 getCategoriesWithSubcategories: Final result count:', categoriesWithSubs.length);
      return categoriesWithSubs;
    } catch (error) {
      console.error('❌ Exception in getCategoriesWithSubcategories:', error);
      return [];
    }
    });
  }
}
