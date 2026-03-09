'use server';

import { sanityWriteClient, sanityClient } from '@/lib/sanity/client';
import { queries } from '@/lib/sanity/queries';
import { SanityImage } from '@/lib/sanity/types';
import { errors, handleSanityError } from '@/lib/errors';
import { canViewImage, canDeleteImage } from '@/lib/authorization';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function uploadImage(formData: FormData): Promise<SanityImage> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw errors.unauthorized('Must be logged in to upload images');
    }

    const file = formData.get('image') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const isPublic = formData.get('isPublic') === 'true';

    if (!file || !title) {
      throw errors.badRequest('Image file and title are required');
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

    revalidatePath('/');
    revalidatePath('/profile');

    return image;
  } catch (error: any) {
    if (error.name === 'AppError') {
      throw error;
    }
    throw handleSanityError(error);
  }
}

export async function getImageById(imageId: string): Promise<SanityImage | null> {
  try {
    const session = await auth();
    const image = await sanityClient.fetch<SanityImage>(queries.getImageById, {
      imageId,
    });

    if (!image) {
      return null;
    }

    // Check authorization
    if (!canViewImage(image, session?.user?.id)) {
      throw errors.forbidden('Cannot view this private image');
    }

    return image;
  } catch (error: any) {
    if (error.name === 'AppError') {
      throw error;
    }
    throw handleSanityError(error);
  }
}

export async function getPublicImages(
  limit: number = 20,
  offset: number = 0,
  sortBy: 'recent' | 'popular' | 'title' = 'recent'
): Promise<SanityImage[]> {
  try {
    let orderClause = 'createdAt desc';
    
    switch (sortBy) {
      case 'popular':
        orderClause = 'views desc';
        break;
      case 'title':
        orderClause = 'title asc';
        break;
      case 'recent':
      default:
        orderClause = 'createdAt desc';
        break;
    }

    const query = `*[_type == "imagePost" && isPublic == true] | order(${orderClause}) [$offset...$limit]{
      ...,
      author->
    }`;

    const images = await sanityClient.fetch<SanityImage[]>(query, { 
      limit: offset + limit, 
      offset 
    });
    return images;
  } catch (error) {
    throw handleSanityError(error);
  }
}

export async function updateImageVisibility(
  imageId: string,
  isPublic: boolean
): Promise<SanityImage> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw errors.unauthorized();
    }

    // Get image to check authorization
    const image = await sanityClient.fetch<SanityImage>(queries.getImageById, {
      imageId,
    });

    if (!image) {
      throw errors.notFound('Image');
    }

    if (image.author._ref !== session.user.id) {
      throw errors.forbidden('Cannot edit another user\'s image');
    }

    // Update visibility
    const updatedImage = await sanityWriteClient
      .patch(imageId)
      .set({ isPublic })
      .commit();

    revalidatePath('/');
    revalidatePath('/profile');
    revalidatePath(`/image/${imageId}`);

    return updatedImage as SanityImage;
  } catch (error: any) {
    if (error.name === 'AppError') {
      throw error;
    }
    throw handleSanityError(error);
  }
}

export async function incrementViewCount(imageId: string): Promise<void> {
  try {
    const image = await sanityClient.fetch<SanityImage>(queries.getImageById, {
      imageId,
    });

    if (!image) {
      throw errors.notFound('Image');
    }

    // Increment view count
    await sanityWriteClient
      .patch(imageId)
      .set({ views: image.views + 1 })
      .commit();

    // Don't revalidate during render - it will happen on next request
  } catch (error: any) {
    // Don't throw on view count errors, just log
    console.error('Failed to increment view count:', error);
  }
}

export async function deleteImage(imageId: string): Promise<void> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw errors.unauthorized();
    }

    // Get image to check authorization
    const image = await sanityClient.fetch<SanityImage>(queries.getImageById, {
      imageId,
    });

    if (!image) {
      throw errors.notFound('Image');
    }

    if (!canDeleteImage(image, session.user.id)) {
      throw errors.forbidden('Cannot delete another user\'s image');
    }

    // Get asset ID before deleting document
    const assetId = image.image?.asset?._ref || image.image?.asset?._id;

    // Delete image document FIRST (must delete before asset to avoid reference errors)
    await sanityWriteClient.delete(imageId);

    // Then delete image asset
    if (assetId) {
      await sanityWriteClient.delete(assetId);
    }

    revalidatePath('/');
    revalidatePath('/profile');
  } catch (error: any) {
    if (error.name === 'AppError') {
      throw error;
    }
    throw handleSanityError(error);
  }
}
