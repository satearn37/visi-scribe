import { NextResponse } from "next/server";

export async function GET() {
  const hasKey = typeof process.env.GEMINI_API_KEY === "string" && process.env.GEMINI_API_KEY.trim() !== "";
  return NextResponse.json({ hasKey });
}
