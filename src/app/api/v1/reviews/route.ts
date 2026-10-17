import { NextRequest, NextResponse } from "next/server";
import { Store } from "@/lib/store";
import { ClientReview } from "@/lib/types";

export async function GET() {
  const reviews = Store.getReviews();
  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  try {
    const body: ClientReview = await req.json();
    if (!body.name || !body.review) {
      return NextResponse.json({ error: "Name and Review are required" }, { status: 400 });
    }
    const saved = Store.saveReview(body);
    return NextResponse.json(saved, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  const ok = Store.deleteReview(id);
  return NextResponse.json({ success: ok });
}
