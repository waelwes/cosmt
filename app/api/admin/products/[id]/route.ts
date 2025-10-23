import { NextRequest, NextResponse } from 'next/server';
import { ServiceContainer } from '@/lib/di/ServiceContainer';
import { IProductService } from '@/lib/factories/interfaces/IProductService';

// GET /api/admin/products/[id] - Get single product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check if environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({
        success: false,
        error: 'Database not configured. Please set up Supabase environment variables.'
      }, { status: 500 });
    }

    const { id } = await params;
    const productId = parseInt(id);
    if (isNaN(productId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid product ID'
      }, { status: 400 });
    }

    // Get product service from container - uses real Supabase data
    const productService: IProductService = ServiceContainer
      .getInstance()
      .getServiceFactory()
      .createProductService();

    const product = await productService.getProductById(productId);
    
    if (!product) {
      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({
      success: false,
      error: 'Database error - Unable to fetch product'
    }, { status: 500 });
  }
}

// PUT /api/admin/products/[id] - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check if environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({
        success: false,
        error: 'Database not configured. Please set up Supabase environment variables.'
      }, { status: 500 });
    }

    const { id } = await params;
    const productId = parseInt(id);
    if (isNaN(productId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid product ID'
      }, { status: 400 });
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.brand || !body.category || !body.price) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: name, brand, category, price'
      }, { status: 400 });
    }

    // Get product service from container - uses real Supabase data
    const productService: IProductService = ServiceContainer
      .getInstance()
      .getServiceFactory()
      .createProductService();

    // Transform the request body to match our database structure
    const updateData = {
      name: body.name,
      brand: body.brand,
      price: parseFloat(body.price),
      original_price: body.originalPrice ? parseFloat(body.originalPrice) : null,
      description: body.description || null,
      image: body.image || '/api/placeholder/300/300',
      stock: parseInt(body.stock) || 0,
      status: body.status || 'active',
      category_id: body.category_id || null,
      subcategory_id: body.subcategory_id || null,
      child_category_id: body.child_category_id || null,
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
      related_products: body.relatedProducts || null
    };

    const product = await productService.updateProduct(productId, updateData);

    return NextResponse.json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update product'
    }, { status: 500 });
  }
}

// DELETE /api/admin/products/[id] - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check if environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({
        success: false,
        error: 'Database not configured. Please set up Supabase environment variables.'
      }, { status: 500 });
    }

    const { id } = await params;
    const productId = parseInt(id);
    if (isNaN(productId)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid product ID'
      }, { status: 400 });
    }

    // Get product service from container - uses real Supabase data
    const productService: IProductService = ServiceContainer
      .getInstance()
      .getServiceFactory()
      .createProductService();

    const success = await productService.deleteProduct(productId);
    
    if (!success) {
      return NextResponse.json({
        success: false,
        error: 'Failed to delete product'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete product'
    }, { status: 500 });
  }
}