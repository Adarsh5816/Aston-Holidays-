import { NextRequest, NextResponse } from "next/server";
import { Store } from "@/lib/store";
import { Invoice } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (id) {
    const inv = await Store.getInvoiceByIdLive(id);
    if (!inv) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    return NextResponse.json(inv);
  }
  const invoices = await Store.getInvoicesLive();
  return NextResponse.json(invoices);
}

export async function POST(req: NextRequest) {
  try {
    const body: Invoice = await req.json();
    if (!body.customerName || !body.resortCode) {
      return NextResponse.json({ error: "Customer name and resort code are required" }, { status: 400 });
    }
    if (!body.id) {
      body.id = "inv-" + Date.now();
    }
    if (!body.invoiceNumber) {
      body.invoiceNumber = `AST-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    }
    const saved = await Store.saveInvoice(body);
    return NextResponse.json(saved, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  const ok = await Store.deleteInvoice(id);
  return NextResponse.json({ success: ok });
}
