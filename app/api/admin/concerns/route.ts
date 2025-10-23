import { NextRequest, NextResponse } from 'next/server';
import { ServiceContainer } from '@/lib/di/ServiceContainer';
import { IConcernService } from '@/lib/factories/interfaces/IConcernService';

// GET /api/admin/concerns - Get all concerns
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API: /api/admin/concerns - Starting...');
    
    // Check if environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.log('❌ API: Supabase environment variables not found');
      return NextResponse.json({
        success: false,
        error: 'Database not configured. Please set up Supabase environment variables.'
      }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // e.g., 'skin_concern', 'hair_concern'
    const productId = searchParams.get('productId'); // Get concerns for specific product

    console.log('🔍 API: Parameters:', { type, productId });

    // Get concern service from container
    const concernService: IConcernService = ServiceContainer
      .getInstance()
      .getServiceFactory()
      .createConcernService();

    console.log('🔍 API: Concern service created, fetching concerns...');
    const fetchStartTime = Date.now();
    
    let concerns;
    
    if (productId) {
      // Get concerns for a specific product
      concerns = await concernService.getConcernsByProduct(parseInt(productId));
    } else if (type) {
      // Get concerns by type
      concerns = await concernService.getConcernsByType(type);
    } else {
      // Get all concerns
      concerns = await concernService.getConcerns();
    }
    
    const fetchEndTime = Date.now();
    console.log(`🔍 API: Concerns fetched in ${fetchEndTime - fetchStartTime}ms`);
    console.log('🔍 API: Sample concern:', concerns[0]);
    
    console.log('🔍 API Response Debug:');
    console.log('concerns count:', concerns.length);

    return NextResponse.json({
      success: true,
      data: concerns
    });
  } catch (error) {
    console.error('Error fetching concerns:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Database error - Unable to fetch concerns'
    }, { status: 500 });
  }
}

// POST /api/admin/concerns - Create new concern
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
    if (!body.name || !body.slug) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: name, slug'
      }, { status: 400 });
    }

    // Get concern service from container
    const concernService: IConcernService = ServiceContainer
      .getInstance()
      .getServiceFactory()
      .createConcernService();

    const concern = await concernService.createConcern({
      name: body.name,
      slug: body.slug,
      description: body.description,
      type: body.type || 'skin_concern',
      is_active: body.is_active !== false
    });

    return NextResponse.json({
      success: true,
      data: concern,
      message: 'Concern created successfully'
    });
  } catch (error) {
    console.error('Error creating concern:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create concern'
    }, { status: 500 });
  }
}
