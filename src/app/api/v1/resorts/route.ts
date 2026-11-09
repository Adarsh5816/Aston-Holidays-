import { NextRequest, NextResponse } from "next/server";
import { Store } from "@/lib/store";
import { Resort } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  // 9 Dimensions Query + Curated Collections
  const collection = url.searchParams.get("collection") || url.searchParams.get("curatedCollection") || undefined;
  const accommodationType = url.searchParams.get("accommodationType") || url.searchParams.get("category") || undefined;
  const stayPreference = url.searchParams.get("stayPreference") || undefined;
  const location = url.searchParams.get("location") || url.searchParams.get("destination") || undefined;
  const budgetMin = url.searchParams.get("budgetMin") ? Number(url.searchParams.get("budgetMin")) : undefined;
  const budgetMax = url.searchParams.get("budgetMax") ? Number(url.searchParams.get("budgetMax")) : undefined;
  const ambience = url.searchParams.get("ambience") || undefined;
  const adults = url.searchParams.get("adults") ? Number(url.searchParams.get("adults")) : undefined;
  const children = url.searchParams.get("children") ? Number(url.searchParams.get("children")) : undefined;
  const rooms = url.searchParams.get("rooms") || url.searchParams.get("bedrooms") ? Number(url.searchParams.get("rooms") || url.searchParams.get("bedrooms")) : undefined;
  const query = url.searchParams.get("q") || undefined;

  // Always fetch live resorts state from Supabase Dual-Vault
  const resorts = await Store.getResortsLive({
    collection,
    accommodationType,
    stayPreference,
    location,
    budgetMin,
    budgetMax,
    ambience,
    adults,
    children,
    rooms,
    query
  });

  if (code) {
    const cleanCode = code.toUpperCase().trim();
    const resort = resorts.find(
      (r) => r.code.toUpperCase() === cleanCode || r.id === code || r.slug === code.toLowerCase()
    );
    if (!resort) return NextResponse.json({ error: "Resort not found" }, { status: 404 });
    return NextResponse.json(resort);
  }

  return NextResponse.json(resorts);
}

export async function POST(req: NextRequest) {
  try {
    const body: Resort = await req.json();
    if (!body.code || !body.name) {
      return NextResponse.json({ error: "Code and Name are required" }, { status: 400 });
    }
    const saved = await Store.saveResort(body);
    return NextResponse.json(saved, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
