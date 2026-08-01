import { NextResponse } from "next/server";
import { setAuthCookies } from "../cookies";

const BACKEND = process.env.NEXT_PUBLIC_API_URL!;

export async function POST(request: Request) {
  const body = await request.json();

  const res = await fetch(`${BACKEND}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, loginType: "password" }),
  });

  const json = await res.json();

  if (!res.ok) {
    return NextResponse.json(json, { status: res.status });
  }

  const { accessToken, refreshToken, user } = json.data;
  await setAuthCookies(accessToken, refreshToken);

  return NextResponse.json({ data: { accessToken, user } });
}
