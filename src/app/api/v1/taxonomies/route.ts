import { NextResponse } from "next/server";
import { Store } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const taxonomies = Store.getTaxonomies();
    return NextResponse.json(taxonomies);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
