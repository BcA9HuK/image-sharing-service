import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { sanityClient } from '@/lib/sanity/client';
import { queries } from '@/lib/sanity/queries';
import { validateUsername } from '@/lib/validation';
import { SanityUser } from '@/lib/sanity/types';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: { message: 'Не авторизован' } },
        { status: 401 }
      );
    }

    const { username } = await request.json();

    // Validate username
    if (!validateUsername(username)) {
      return NextResponse.json(
        {
          error: {
            message: 'Неверное имя пользователя',
            details: {
              errors: ['Имя пользователя должно содержать 3-30 буквенно-цифровых символов'],
            },
          },
        },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUser = await sanityClient.fetch<SanityUser>(
      queries.getUserByUsername,
      { username }
    );

    if (existingUser) {
      return NextResponse.json(
        {
          error: {
            message: 'Имя пользователя уже занято',
            details: { errors: ['Это имя пользователя уже используется'] },
          },
        },
        { status: 400 }
      );
    }

    // Create user in Sanity
    const newUser = await sanityClient.create({
      _type: 'user',
      username,
      email: session.user.email,
      passwordHash: '', // No password for OAuth users
      avatar: session.user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ user: newUser });
  } catch (error: any) {
    console.error('Setup username error:', error);
    return NextResponse.json(
      { error: { message: 'Ошибка создания пользователя' } },
      { status: 500 }
    );
  }
}
