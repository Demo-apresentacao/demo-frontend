import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Simulação de login (por enquanto)
  const isLogged = request.cookies.get('logged')?.value;
  const role = request.cookies.get('role')?.value; // 'admin' | 'user'

  // Protege tudo que estiver dentro de (dashboard)
  if (pathname.startsWith('/admin') || pathname.startsWith('/user')) {
    if (!isLogged) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Proteção por tipo de usuário
    if (pathname.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (pathname.startsWith('/user') && role !== 'user') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/user/:path*'],
};
