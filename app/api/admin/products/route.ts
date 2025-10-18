import { NextRequest, NextResponse } from 'next/server';
import { supabaseDb } from '@/lib/supabase-database';

// Mock data for demo purposes when database is not available
const mockProducts = [
  {
    id: 1,
    name: 'Hair Mask - Deep Conditioning',
    brand: 'COSMT',
    category: 'Hair Care',
    price: 89.99,
    originalPrice: 119.99,
    stock: 45,
    status: 'active' as const,
    rating: 4.8,
    reviews: 124,
    image: '/api/placeholder/300/300',
    isBestSeller: true,
    isOnSale: true,
    description: 'Deep conditioning hair mask for all hair types',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 2,
    name: 'Vitamin C Serum',
    brand: 'COSMT',
    category: 'Skincare',
    price: 65.50,
    originalPrice: null,
    stock: 78,
    status: 'active' as const,
    rating: 4.6,
    reviews: 89,
    image: '/api/placeholder/300/300',
    isBestSeller: false,
    isOnSale: false,
    description: 'Brightening vitamin C serum for radiant skin',
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14')
  },
  {
    id: 3,
    name: 'Moisturizing Cream',
    brand: 'COSMT',
    category: 'Skincare',
    price: 42.00,
    originalPrice: 55.00,
    stock: 0,
    status: 'inactive' as const,
    rating: 4.2,
    reviews: 67,
    image: '/api/placeholder/300/300',
    isBestSeller: false,
    isOnSale: true,
    description: 'Hydrating moisturizer for dry skin',
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-13')
  }
];

// GET /api/admin/products - Get all products
export async function GET(request: NextRequest) {
  try {
    // Check if environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log('Supabase environment variables not found, returning mock data');
      return NextResponse.json({
        success: true,
        data: mockProducts,
        total: mockProducts.length,
        message: 'Demo mode - Using mock data. Please configure Supabase environment variables for real data.'
      });
    }

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
    
    // Return mock data as fallback
    return NextResponse.json({
      success: true,
      data: mockProducts,
      total: mockProducts.length,
      message: 'Database error - Using mock data as fallback'
    });
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
