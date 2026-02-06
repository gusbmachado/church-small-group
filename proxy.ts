import { NextResponse, type NextRequest } from "next/server"

export async function proxy(request: NextRequest) {
  // Firebase Auth uses client-side tokens stored in cookies
  // Read the auth token from cookies if you need server-side auth checks
  const authToken = request.cookies.get("firebase-auth-token")

  // Protect management routes - redirect to login if not authenticated
  if (request.nextUrl.pathname.startsWith("/management") && !authToken) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
