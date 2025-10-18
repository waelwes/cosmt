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

// GET /api/admin/products/[id] - Get single product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id);
    
    if (isNaN(productId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    // Check if environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log('Supabase environment variables not found, returning mock data');
      const product = mockProducts.find(p => p.id === productId);
      
      if (!product) {
        return NextResponse.json(
          { success: false, error: 'Product not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: product,
        message: 'Demo mode - Using mock data. Please configure Supabase environment variables for real data.'
      });
    }

    const product = await supabaseDb.getProduct(productId);

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    
    // Return mock data as fallback
    const product = mockProducts.find(p => p.id === parseInt(params.id));
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
      message: 'Database error - Using mock data as fallback'
    });
  }
}

// PUT /api/admin/products/[id] - Update product by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id);
    
    if (isNaN(productId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid product ID' },
        { status: 400 }
      );
    }

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

    // Check if environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log('Supabase environment variables not found, returning mock data');
      
      // Find and update mock product
      const productIndex = mockProducts.findIndex(p => p.id === productId);
      if (productIndex === -1) {
        return NextResponse.json(
          { success: false, error: 'Product not found' },
          { status: 404 }
        );
      }

      const updatedProduct = {
        ...mockProducts[productIndex],
        ...body,
        id: productId,
        updatedAt: new Date()
      };

      mockProducts[productIndex] = updatedProduct;

      return NextResponse.json({
        success: true,
        data: updatedProduct,
        message: 'Demo mode - Using mock data. Please configure Supabase environment variables for real data.'
      });
    }

    const product = await supabaseDb.updateProduct(productId, {
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

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/products/[id] - Delete product by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id);
    
    if (isNaN(productId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    // Check if environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log('Supabase environment variables not found, returning mock data');
      
      // Find and remove mock product
      const productIndex = mockProducts.findIndex(p => p.id === productId);
      if (productIndex === -1) {
        return NextResponse.json(
          { success: false, error: 'Product not found' },
          { status: 404 }
        );
      }

      mockProducts.splice(productIndex, 1);

      return NextResponse.json({
        success: true,
        message: 'Product deleted successfully (Demo mode - Using mock data)'
      });
    }

    const success = await supabaseDb.deleteProduct(productId);

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}