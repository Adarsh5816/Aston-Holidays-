import { NextRequest, NextResponse } from "next/server";
import { Store } from "@/lib/store";
import { PackageItineraryBooking } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (id) {
      const booking = Store.getPackageBookingById(id);
      if (!booking) {
        return NextResponse.json({ error: "Package booking not found" }, { status: 404 });
      }
      return NextResponse.json(booking);
    }
    const bookings = Store.getPackageBookings();
    return NextResponse.json(bookings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: PackageItineraryBooking = await req.json();
    if (!body.packageTitle || !body.customerName || !body.customerPhone) {
      return NextResponse.json(
        { error: "packageTitle, customerName, and customerPhone are required" },
        { status: 400 }
      );
    }
    const saved = Store.savePackageBooking(body);
    return NextResponse.json(saved, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "id parameter is required" }, { status: 400 });
    }
    const deleted = Store.deletePackageBooking(id);
    return NextResponse.json({ success: deleted });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
