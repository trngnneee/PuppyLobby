import { NextResponse } from "next/server";

const createIsPublic = (exact = [], wildcard = []) => (pathname) => {
  if (exact.includes(pathname)) return true;
  if (wildcard.some(prefix => pathname.startsWith(prefix))) return true;
  return false;
};

export function middleware(req) {
  const { pathname } = req.nextUrl;

  const employeeToken = req.cookies.get("employeeToken")?.value;
  const customerToken = req.cookies.get("customerToken")?.value;

  // ================= EMPLOYEE =================
  if (pathname.startsWith("/employee")) {

    // Customer không được vào employee
    if (customerToken) {
      return NextResponse.redirect(
        new URL("/", req.url)
      );
    }

    const exactPublic = [
      "/employee/auth/signin",
    ];

    const isPublic = createIsPublic(exactPublic);

    if (employeeToken && isPublic(pathname)) {
      return NextResponse.redirect(
        new URL("/employee/manage", req.url)
      );
    }

    if (!employeeToken && !isPublic(pathname)) {
      return NextResponse.redirect(
        new URL("/employee/auth/signin", req.url)
      );
    }

    return NextResponse.next();
  }

  // ================= CUSTOMER (/me) =================
  if (pathname.startsWith("/me")) {

    // Employee không được vào customer
    if (employeeToken) {
      return NextResponse.redirect(
        new URL("/employee/manage", req.url)
      );
    }

    const exactPublic = [
      "/me/auth/signin",
      "/me/auth/signup",
    ];

    const isPublic = createIsPublic(exactPublic);

    if (customerToken && isPublic(pathname)) {
      return NextResponse.redirect(
        new URL("/", req.url)
      );
    }

    if (!customerToken && !isPublic(pathname)) {
      return NextResponse.redirect(
        new URL("/me/auth/signin", req.url)
      );
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/employee/:path*",
    "/me/:path*",
  ],
};
