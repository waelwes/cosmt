import { NextRequest, NextResponse } from 'next/server';
import { ServiceContainer } from '@/lib/di/ServiceContainer';
import { IProductService } from '@/lib/factories/interfaces/IProductService';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { generateSlug } from '@/utils/slug';

// GET /api/admin/products - Get all products
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API: /api/admin/products - Starting...');
    
    // Check if environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log('❌ API: Supabase environment variables not found');
      return NextResponse.json({
        success: false,
        error: 'Database not configured. Please set up Supabase environment variables.'
      }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') || 'asc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    console.log('🔍 API: Parameters:', { search, category, status, sortBy, sortOrder, page, limit });

    // Get product service from container - uses real Supabase data
    const productService: IProductService = ServiceContainer
      .getInstance()
      .getServiceFactory()
      .createProductService();

    console.log('🔍 API: Product service created, fetching products...');
    const fetchStartTime = Date.now();
    
    // Get all products (we'll implement filtering later)
    const products = await productService.getProducts();
    
    const fetchEndTime = Date.now();
    console.log(`🔍 API: Products fetched in ${fetchEndTime - fetchStartTime}ms:`, products.length, 'products');
    console.log('🔍 API: Sample product:', products[0]);
    
    // Apply basic filtering
    const filterStartTime = Date.now();
    let filteredProducts = products;
    console.log('🔍 API: Before filtering:', filteredProducts.length, 'products');
    
    if (search) {
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.brand.toLowerCase().includes(search.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(search.toLowerCase()))
      );
      console.log('🔍 API: After search filter:', filteredProducts.length, 'products');
    }
    
    if (status && status !== 'all') {
      filteredProducts = filteredProducts.filter(product => product.status === status);
      console.log('🔍 API: After status filter:', filteredProducts.length, 'products');
    }
    
    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter(product => 
        product.category_id && product.category_id.toString() === category
      );
      console.log('🔍 API: After category filter:', filteredProducts.length, 'products');
    }
    
    // Apply sorting
    const sortStartTime = Date.now();
    filteredProducts.sort((a, b) => {
      const aValue = a[sortBy as keyof typeof a];
      const bValue = b[sortBy as keyof typeof b];
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    
    const sortEndTime = Date.now();
    console.log(`🔍 API: Sorting completed in ${sortEndTime - sortStartTime}ms`);
    
    // Apply pagination
    const paginationStartTime = Date.now();
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    const paginationEndTime = Date.now();
    console.log(`🔍 API: Pagination completed in ${paginationEndTime - paginationStartTime}ms`);
    
    const filterEndTime = Date.now();
    console.log(`🔍 API: Total filtering/sorting/pagination completed in ${filterEndTime - filterStartTime}ms`);
    
    const total = filteredProducts.length;
    const totalPages = Math.ceil(total / limit);

    console.log('🔍 API Response Debug:');
    console.log('products count:', paginatedProducts.length);
    console.log('total:', total);

    return NextResponse.json({
      success: true,
      data: paginatedProducts,
      total: total,
      page: page,
      totalPages: totalPages
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    
    // Return error instead of mock data
    return NextResponse.json({
      success: false,
      error: 'Database error - Unable to fetch products'
    }, { status: 500 });
  }
}

// POST /api/admin/products - Create new product
export async function POST(request: NextRequest) {
  try {
    // Check if environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({
        success: false,
        error: 'Database not configured. Please set up Supabase environment variables.'
      }, { status: 500 });
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.brand || !body.price) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: name, brand, price'
      }, { status: 400 });
    }

    // Use admin client for product creation (bypasses RLS)
    const supabase = supabaseAdmin;

    // Generate unique slug server-side
    const baseSlug: string = (typeof body.slug === 'string' && body.slug.trim()) || generateSlug(body.name);
    let finalSlug = baseSlug;
    let i = 1;
    while (true) {
      const { data: exists, error: existsErr } = await supabase
        .from('products')
        .select('id')
        .eq('slug', finalSlug)
        .limit(1);
      if (existsErr) break;
      if (!exists || exists.length === 0) break;
      i += 1;
      finalSlug = `${baseSlug}-${i}`;
    }

    // Transform the request body to match our database structure
    const productData = {
      name: body.name,
      brand: body.brand,
      price: parseFloat(body.price),
      original_price: body.originalPrice ? parseFloat(body.originalPrice) : null,
      description: body.description || null,
      image: body.image || '/api/placeholder/300/300',
      stock: parseInt(body.stock) || 0,
      status: body.status || 'active',
      category_id: body.category_id || null,
      is_best_seller: body.isBestSeller || false,
      is_on_sale: body.isOnSale || false,
      rating: body.rating || 0,
      reviews: body.reviews || 0,
      sku: body.sku || null,
      tags: body.tags || null,
      weight: body.weight || null,
      dimensions: body.dimensions || null,
      meta_title: body.metaTitle || null,
      meta_description: body.metaDescription || null,
      meta_keywords: body.metaKeywords || null,
      low_stock_threshold: body.lowStockThreshold || 10,
      manage_stock: body.manageStock !== false,
      enable_variants: body.enableVariants || false,
      variants: body.variants || null,
      related_products: body.relatedProducts || null,
      slug: finalSlug
    };

    const { data: product, error: insertErr } = await supabase
      .from('products')
      .insert(productData)
      .select('*')
      .single();
    if (insertErr) {
      return NextResponse.json({ success: false, error: insertErr.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: product,
      message: 'Product created successfully'
    });
  } catch (error) {
    console.error('Error creating product:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({
      success: false,
      error: `Failed to create product: ${errorMessage}`,
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}