import { auth } from "./auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthPage = req.nextUrl.pathname.startsWith('/login');

  if (!isLoggedIn && !isAuthPage) {
    // Redirect unauthenticated users to login page
    return Response.redirect(new URL('/login', req.nextUrl));
  }
  
  if (isLoggedIn && isAuthPage) {
    // Redirect authenticated users away from login page
    return Response.redirect(new URL('/', req.nextUrl));
  }
})

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp)$).*)'],
}
