import { auth } from './auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth;
  const needsUsername = req.auth?.user?.needsUsername;

  // Redirect to username setup if needed (except for setup page itself and auth routes)
  if (
    isAuthenticated &&
    needsUsername &&
    pathname !== '/auth/setup-username' &&
    !pathname.startsWith('/api/auth')
  ) {
    return NextResponse.redirect(new URL('/auth/setup-username', req.url));
  }

  // Prevent accessing setup page if username is already set
  if (pathname === '/auth/setup-username' && isAuthenticated && !needsUsername) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Protected routes that require authentication
  const protectedRoutes = ['/upload', '/profile'];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Redirect to login if accessing protected route without auth
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to home if accessing auth pages while authenticated (and username is set)
  const authPages = ['/login', '/signup'];
  if (authPages.includes(pathname) && isAuthenticated && !needsUsername) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
