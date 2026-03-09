'use server';

import bcrypt from 'bcryptjs';
import { sanityWriteClient, sanityClient } from '@/lib/sanity/client';
import { queries } from '@/lib/sanity/queries';
import { SanityUser, SanityImage } from '@/lib/sanity/types';
import { errors, handleSanityError } from '@/lib/errors';
import { auth } from '@/auth';

const SALT_ROUNDS = 10;

export async function createUser(
  username: string,
  email: string,
  password: string
): Promise<SanityUser> {
  try {
    // Check if username already exists
    const existingUsername = await sanityClient.fetch<SanityUser>(
      queries.getUserByUsername,
      { username }
    );

    if (existingUsername) {
      throw errors.badRequest('Username already taken');
    }

    // Check if email already exists
    const existingEmail = await sanityClient.fetch<SanityUser>(
      queries.getUserByEmail,
      { email }
    );

    if (existingEmail) {
      throw errors.badRequest('Email already registered');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user document
    const user = await sanityWriteClient.create<SanityUser>({
      _type: 'user',
      username,
      email,
      passwordHash,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      createdAt: new Date().toISOString(),
    });

    return user;
  } catch (error: any) {
    if (error.name === 'AppError') {
      throw error;
    }
    throw handleSanityError(error);
  }
}

export async function getUserById(userId: string): Promise<SanityUser | null> {
  try {
    const user = await sanityClient.fetch<SanityUser>(queries.getUserById, {
      userId,
    });
    return user;
  } catch (error) {
    throw handleSanityError(error);
  }
}

export async function getUserByEmail(
  email: string
): Promise<SanityUser | null> {
  try {
    const user = await sanityClient.fetch<SanityUser>(queries.getUserByEmail, {
      email,
    });
    return user;
  } catch (error) {
    throw handleSanityError(error);
  }
}

export async function getUserByUsername(
  username: string
): Promise<SanityUser | null> {
  try {
    const user = await sanityClient.fetch<SanityUser>(
      queries.getUserByUsername,
      { username }
    );
    return user;
  } catch (error) {
    throw handleSanityError(error);
  }
}

export async function updateAvatar(
  userId: string,
  avatarUrl: string
): Promise<SanityUser> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw errors.unauthorized();
    }

    if (session.user.id !== userId) {
      throw errors.forbidden('Cannot update another user\'s avatar');
    }

    const updatedUser = await sanityWriteClient
      .patch(userId)
      .set({ avatar: avatarUrl })
      .commit();

    return updatedUser as SanityUser;
  } catch (error: any) {
    if (error.name === 'AppError') {
      throw error;
    }
    throw handleSanityError(error);
  }
}

export async function getUserImages(
  userId: string,
  includePrivate: boolean = false
): Promise<SanityImage[]> {
  try {
    const session = await auth();
    const isOwnProfile = session?.user?.id === userId;

    // If requesting private images, must be own profile
    if (includePrivate && !isOwnProfile) {
      throw errors.forbidden('Cannot view private images of other users');
    }

    const query = includePrivate
      ? queries.getUserImages
      : queries.getUserPublicImages;

    const images = await sanityClient.fetch<SanityImage[]>(query, { userId });
    return images;
  } catch (error: any) {
    if (error.name === 'AppError') {
      throw error;
    }
    throw handleSanityError(error);
  }
}
