import { NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL!;

// Signup returns only a verification token — no auth tokens.
// The user must verify their email before logging in.
// No cookies are set here.
export async function POST(request: Request) {
  const body = await request.json();

  const res = await fetch(`${BACKEND}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const json = await res.json();
  return NextResponse.json(json, { status: res.status });
}
