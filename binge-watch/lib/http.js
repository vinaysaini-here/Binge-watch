import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/session";

export function ok(data, init = {}) {
  return NextResponse.json(data, { status: 200, ...init });
}

export function created(data, init = {}) {
  return NextResponse.json(data, { status: 201, ...init });
}

export function fail(message, status = 400, details) {
  return NextResponse.json({ error: message, details }, { status });
}

export function attachSession(response, token) {
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return response;
}

export function clearSession(response) {
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });

  return response;
}
