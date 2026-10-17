import { NextRequest, NextResponse } from "next/server";
import { Store } from "@/lib/store";
import { HolidayPackage } from "@/lib/types";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const category = url.searchParams.get("category") || undefined;
  const packages = Store.getPackages(category);
  return NextResponse.json(packages);
}

export async function POST(req: NextRequest) {
  try {
    const body: HolidayPackage = await req.json();
    if (!body.title || !body.category) {
      return NextResponse.json({ error: "Title and Category are required" }, { status: 400 });
    }
    const saved = Store.savePackage(body);
    return NextResponse.json(saved, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  const ok = Store.deletePackage(id);
  return NextResponse.json({ success: ok });
}
