import { NextRequest, NextResponse } from "next/server";
import { Store } from "@/lib/store";

export async function GET() {
  const settings = Store.getSettings();
  return NextResponse.json(settings);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = Store.updateSettings(body);
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
