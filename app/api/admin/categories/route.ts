import { NextRequest, NextResponse } from 'next/server';
import { ServiceContainer } from '@/lib/di/ServiceContainer';
import { ICategoryService } from '@/lib/factories/interfaces/ICategoryService';

// GET /api/admin/categories - Get all categories
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API: /api/admin/categories - Starting...');
    
    // Check if environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log('❌ API: Supabase environment variables not found');
      return NextResponse.json({
        success: false,
        error: 'Database not configured. Please set up Supabase environment variables.'
      }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level'); // 1 for main categories, 2 for subcategories
    const parentId = searchParams.get('parentId');

    console.log('🔍 API: Parameters:', { level, parentId });

    // Get category service from container
    const categoryService: ICategoryService = ServiceContainer
      .getInstance()
      .getServiceFactory()
      .createCategoryService();

    console.log('🔍 API: Category service created, fetching categories...');
    const fetchStartTime = Date.now();
    
    let categories = [];
    
    // Determine what to fetch based on level parameter
    if (level === '2') {
      // Fetch subcategories (child categories)
      if (parentId) {
        categories = await categoryService.getSubcategoriesByCategory(parseInt(parentId));
      } else {
        categories = await categoryService.getSubcategories();
      }
    } else {
      // Fetch main categories (parent categories)
      categories = await categoryService.getCategories();
    }
    
    const fetchEndTime = Date.now();
    console.log(`🔍 API: Categories fetched in ${fetchEndTime - fetchStartTime}ms`);
    console.log('🔍 API: Sample category:', categories[0]);
    
    // No additional filtering needed since we fetch the right data based on level
    let filteredCategories = categories;

    console.log('🔍 API Response Debug:');
    console.log('categories count:', filteredCategories.length);

    return NextResponse.json({
      success: true,
      data: filteredCategories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Database error - Unable to fetch categories'
    }, { status: 500 });
  }
}
