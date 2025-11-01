import { NextResponse } from "next/server";
import { auth } from "@/lib/auth"

    export const runtime = "nodejs"; // ✅ use Node runtime for Better Auth

export async function middleware(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });

  const url = new URL(req.url);
  const path = url.pathname;

  // Allow access only to these public routes
  const publicRoutes = ["/signin", "/signup", "/login", "/api/auth"];

  // Check if current path starts with a public route
  const isPublic = publicRoutes.some((r) => path.startsWith(r));

  // Block everything else if not logged in
  if (!session && !isPublic) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  return NextResponse.next();
}
