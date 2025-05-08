import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === "/login" || path === "/register" || path === "/forgot-password" || path === "/"

  // BYPASS: For testing purposes, allow access to all routes
  return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    // Apply to all paths except for API routes, static files, and _next
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
