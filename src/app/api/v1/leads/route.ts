import { NextRequest, NextResponse } from "next/server";
import { Store } from "@/lib/store";

export async function GET() {
  const leads = Store.getLeads();
  return NextResponse.json(leads);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.customerName || !body.phone) {
      return NextResponse.json({ error: "Customer Name and Phone are required" }, { status: 400 });
    }
    const newLead = Store.addLead(body);
    return NextResponse.json(newLead, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id || !body.status) {
      return NextResponse.json({ error: "Lead id and status are required" }, { status: 400 });
    }
    const updated = Store.updateLeadStatus(body.id, body.status);
    if (!updated) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
