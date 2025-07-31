import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_PATHS = ["/login", "/register", "/api/auth", "/favicon.ico", "/_next", "/public"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // Permitir rutas públicas
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }
  // Permitir archivos estáticos
  if (pathname.match(/\.(svg|png|jpg|css|js|ico)$/)) {
    return NextResponse.next();
  }
  // Verificar sesión
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|_next|favicon.ico|public|api/register).*)"],
};
