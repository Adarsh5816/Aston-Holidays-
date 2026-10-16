import { NextRequest, NextResponse } from "next/server";
import { Store } from "@/lib/store";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const resort = Store.getResortByCode(code);

  if (!resort) {
    return NextResponse.json({ error: "Resort brochure not found" }, { status: 404 });
  }

  const host = req.headers.get("host") || "localhost:3000";
  const proto = req.headers.get("x-forwarded-proto") || "http";
  const targetUrl = `${proto}://${host}/brochure/${encodeURIComponent(resort.code)}?print=true`;

  // Redirect client directly to the high-res 12-page printable PDF brochure
  return NextResponse.redirect(targetUrl, 302);
}
