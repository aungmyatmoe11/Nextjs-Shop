import { NextResponse } from "next/server"
import { authConfig } from "./auth.config"
import NextAuth from "next-auth"
import { routePermissions } from "./routes/routesPermissions"
import { hasPermission } from "./utils/helper"

const { auth } = NextAuth(authConfig)


export async function middleware(request) {
  const { nextUrl } = request
  const session = await auth()
  const isAuthenticated = !!session?.user
  const { pathname } = nextUrl
  console.log(isAuthenticated, pathname)

  const protectedRoutes = Object.keys(routePermissions) ?? []

  // ! 1. If not logged in and accessing protected routes, redirect to login
  const isProtectedRoute = protectedRoutes.some((route) => {
    const regex = new RegExp(`^${route.replace("[id]", "[^/]+")}$`) // Match dynamic routes like /products/[id]
    return regex.test(pathname)
  })

  if (!isAuthenticated && isProtectedRoute) {
    // return Response.redirect(new URL("/login", nextUrl))
    return NextResponse.redirect(new URL("/login", nextUrl))
  }

  // ! 2. If logged in and visiting login or register, redirect to the dashboard
  if (
    isAuthenticated &&
    (pathname.startsWith("/login") || pathname.startsWith("/register"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl))
  }

  // ! 3. If accessing a protected route, check for permissions
  if (isAuthenticated && isProtectedRoute) {
    const matchedRoute = Object.keys(routePermissions).find((route) => {
      const regex = new RegExp(`^${route.replace("[id]", "[^/]+")}$`)
      return regex.test(pathname)
    })

    if (matchedRoute) {
      const requiredPermissions = routePermissions[matchedRoute]
      // If no permissions are required (empty array), allow access
      if (requiredPermissions.length === 0) {
        return NextResponse.next() // Pass through without checking permissions
      }

      // Check if the user has the necessary permissions
      const userPermissions = auth?.user?.permissions || []
      if (!hasPermission(userPermissions, requiredPermissions)) {
        // If user lacks necessary permissions, redirect to unauthorized page
        return NextResponse.redirect(new URL("/unauthorized", nextUrl))
      }
    }
  }

  // return true
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
