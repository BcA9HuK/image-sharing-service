// Authorization utilities

import { SanityImage } from './sanity/types';

export function isAuthenticated(userId: string | null | undefined): boolean {
  return !!userId;
}

export function canViewImage(
  image: SanityImage | any,
  userId: string | null | undefined
): boolean {
  // Public images are accessible to everyone
  if (image.isPublic) {
    return true;
  }

  // Private images are only accessible to the author
  // Handle both reference format (_ref) and populated format (_id)
  const authorId = image.author._ref || image.author._id;
  return authorId === userId;
}

export function canEditImage(
  image: SanityImage | any,
  userId: string | null | undefined
): boolean {
  if (!userId) {
    return false;
  }

  // Only the author can edit
  // Handle both reference format (_ref) and populated format (_id)
  const authorId = image.author._ref || image.author._id;
  return authorId === userId;
}

export function canDeleteImage(
  image: SanityImage | any,
  userId: string | null | undefined
): boolean {
  if (!userId) {
    return false;
  }

  // Only the author can delete
  // Handle both reference format (_ref) and populated format (_id)
  const authorId = image.author._ref || image.author._id;
  return authorId === userId;
}
