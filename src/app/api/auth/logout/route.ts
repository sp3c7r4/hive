import { NextResponse } from "next/server";
import { getRefreshTokenCookie, clearAuthCookies } from "../cookies";

const BACKEND = process.env.NEXT_PUBLIC_API_URL!;

export async function POST() {
  const refreshToken = await getRefreshTokenCookie();

  if (refreshToken) {
    await fetch(`${BACKEND}/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    }).catch(() => {});
  }

  await clearAuthCookies();
  return NextResponse.json({ data: { success: true } });
}
