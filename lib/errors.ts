// Error handling utilities

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function createErrorResponse(
  statusCode: number,
  code: string,
  message: string,
  details?: any
): ErrorResponse {
  return {
    error: {
      code,
      message,
      details,
    },
  };
}

// Predefined error creators
export const errors = {
  unauthorized: (message = 'Authentication required') =>
    new AppError(401, 'UNAUTHORIZED', message),

  forbidden: (message = 'Insufficient permissions') =>
    new AppError(403, 'FORBIDDEN', message),

  notFound: (resource = 'Resource', message?: string) =>
    new AppError(404, 'NOT_FOUND', message || `${resource} not found`),

  badRequest: (message: string, details?: any) =>
    new AppError(400, 'BAD_REQUEST', message, details),

  serverError: (message = 'Internal server error') =>
    new AppError(500, 'SERVER_ERROR', message),

  validationError: (errors: string[]) =>
    new AppError(400, 'VALIDATION_ERROR', 'Validation failed', { errors }),
};

// Handle Sanity errors
export function handleSanityError(error: any): AppError {
  console.error('Sanity error:', error);

  if (error.statusCode === 404) {
    return errors.notFound('Resource');
  }

  if (error.statusCode === 401) {
    return errors.unauthorized('Invalid Sanity credentials');
  }

  return errors.serverError('Database operation failed');
}
