import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/app/actions/user';
import { validateRegistration } from '@/lib/validation';
import { errors, createErrorResponse } from '@/lib/errors';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password } = body;

    // Validate input
    const validation = validateRegistration(username, email, password);
    if (!validation.valid) {
      return NextResponse.json(
        createErrorResponse(400, 'VALIDATION_ERROR', 'Validation failed', {
          errors: validation.errors,
        }),
        { status: 400 }
      );
    }

    // Create user
    const user = await createUser(username, email, password);

    // Return success (without password hash)
    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          createdAt: user.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Signup error:', error);

    if (error.name === 'AppError') {
      return NextResponse.json(
        createErrorResponse(error.statusCode, error.code, error.message, error.details),
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      createErrorResponse(500, 'SERVER_ERROR', 'Registration failed'),
      { status: 500 }
    );
  }
}
