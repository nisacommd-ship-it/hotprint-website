import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req: any) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }: any) => {
        const path = req?.nextUrl?.pathname ?? '';
        // Защищённые маршруты
        if (
          path?.startsWith?.('/dashboard') ||
          path?.startsWith?.('/admin') ||
          path?.startsWith?.('/api/orders') ||
          path?.startsWith?.('/api/user') ||
          path?.startsWith?.('/api/upload') ||
          path?.startsWith?.('/api/admin') ||
          (path?.startsWith?.('/api/reviews') && req?.method === 'POST')
        ) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/orders/:path*',
    '/api/user/:path*',
    '/api/upload/:path*',
    '/api/reviews',
  ],
};
