import { NextRequest, NextResponse } from 'next/server';
import { supabaseDb } from '@/lib/supabase-database';

// GET /api/admin/products - Get all products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    const products = await supabaseDb.getProducts({
      search,
      category,
      status,
      sortBy,
      sortOrder: sortOrder as 'asc' | 'desc'
    });

    return NextResponse.json({
      success: true,
      data: products,
      total: products.length
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/admin/products - Create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'brand', 'category', 'price', 'stock', 'status'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const product = await supabaseDb.createProduct({
      name: body.name,
      brand: body.brand,
      category: body.category,
      price: parseFloat(body.price),
      originalPrice: body.originalPrice ? parseFloat(body.originalPrice) : null,
      stock: parseInt(body.stock),
      status: body.status,
      rating: body.rating || 0,
      reviews: body.reviews || 0,
      image: body.image || '/api/placeholder/300/300',
      isBestSeller: body.isBestSeller || false,
      isOnSale: body.isOnSale || false,
      description: body.description || ''
    });

    return NextResponse.json({
      success: true,
      data: product
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
