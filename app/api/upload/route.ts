import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { sanityWriteClient } from '@/lib/sanity/client';
import { SanityImage } from '@/lib/sanity/types';
import { errors, createErrorResponse } from '@/lib/errors';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        createErrorResponse(401, 'UNAUTHORIZED', 'Must be logged in to upload images'),
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('image') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const isPublic = formData.get('isPublic') === 'true';

    if (!file || !title) {
      return NextResponse.json(
        createErrorResponse(400, 'BAD_REQUEST', 'Image file and title are required'),
        { status: 400 }
      );
    }

    // Upload image asset to Sanity
    const asset = await sanityWriteClient.assets.upload('image', file, {
      filename: file.name,
    });

    // Create image document
    const image = await sanityWriteClient.create<SanityImage>({
      _type: 'imagePost',
      title,
      description: description || '',
      image: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: asset._id,
        },
      },
      author: {
        _type: 'reference',
        _ref: session.user.id,
      },
      isPublic,
      createdAt: new Date().toISOString(),
      views: 0,
    });

    return NextResponse.json({ success: true, image }, { status: 201 });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      createErrorResponse(500, 'SERVER_ERROR', error.message || 'Upload failed'),
      { status: 500 }
    );
  }
}

// Increase body size limit for this route
export const maxDuration = 60;
