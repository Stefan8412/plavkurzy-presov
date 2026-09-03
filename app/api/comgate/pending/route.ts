import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL("/moje-kurzy", request.url);
  url.searchParams.set("payment", "pending");

  return NextResponse.redirect(url);
}
