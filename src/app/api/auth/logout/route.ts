import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const cookieStore = cookies();
  const allCookies = cookieStore.getAll();
  const response = NextResponse.redirect(new URL("/login", request.url));

  // Explicitly clear smart_sarabun session and role cookies
  response.cookies.set("smart_sarabun_session", "", { maxAge: 0, path: "/", expires: new Date(0) });
  response.cookies.set("smart_sarabun_role", "", { maxAge: 0, path: "/", expires: new Date(0) });

  allCookies.forEach((c) => {
    response.cookies.delete(c.name);
    response.cookies.set(c.name, "", { maxAge: 0, path: "/", expires: new Date(0) });
  });

  return response;
}

export async function POST(request: Request) {
  return GET(request);
}
