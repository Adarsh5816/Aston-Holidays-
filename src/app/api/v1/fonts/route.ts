import { NextRequest, NextResponse } from "next/server";
import { Store, defaultTypography } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const typography = Store.getTypography();
    return NextResponse.json(typography || defaultTypography, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120"
      }
    });
  } catch (err: any) {
    return NextResponse.json(defaultTypography, { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || !body.global) {
      return NextResponse.json({ error: "Invalid typography payload" }, { status: 400 });
    }

    const saved = await Store.saveTypography(body);
    return NextResponse.json({
      success: true,
      data: saved,
      message: "Typography configuration saved successfully."
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
