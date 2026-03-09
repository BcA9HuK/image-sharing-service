import { NextRequest, NextResponse } from 'next/server';
import { getPublicImages } from '@/app/actions/image';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const sortBy = (searchParams.get('sortBy') || 'recent') as 'recent' | 'popular' | 'title';

    const images = await getPublicImages(limit, offset, sortBy);

    return NextResponse.json({ images });
  } catch (error: any) {
    console.error('Failed to fetch images:', error);
    return NextResponse.json(
      { error: { message: error.message || 'Failed to fetch images' } },
      { status: 500 }
    );
  }
}
