import { NextResponse } from "next/server";

const createIsPublic = (exact, wildcard) => (pathname) => {
  if (exact.includes(pathname)) return true;
  if (wildcard.some(prefix => pathname.startsWith(prefix))) return true;
  return false;
};

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // ----- EMPLOYEE -----
  if (pathname.startsWith("/employee")) {
    const token = req.cookies.get("employeeToken")?.value;

    const exactPublic = [
      "/employee/auth/signin",
    ];

    const isPublic = createIsPublic(exactPublic, []);

    if (token && isPublic(pathname)) {
      return NextResponse.redirect(new URL("/employee/manage", req.url));
    }

    if (!token && !isPublic(pathname)) {
      return NextResponse.redirect(new URL("/employee/auth/signin", req.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/employee/:path*",
  ],
};