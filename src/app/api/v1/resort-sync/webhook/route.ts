import { NextRequest, NextResponse } from "next/server";
import { Store } from "@/lib/store";
import { ResortSyncLog } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const resortCode = searchParams.get("resort") || "AH-GENERIC";
    const payload = await req.json();

    const now = new Date().toISOString();
    const log: ResortSyncLog = {
      id: `log-whk-${Date.now()}`,
      timestamp: now,
      resortCode,
      action: "WEBHOOK_INBOUND",
      status: "SUCCESS",
      latencyMs: 12,
      message: `Inbound webhook received from ${resortCode} PMS. Event: ${payload.event || payload.action || "INVENTORY_UPDATE"}.`,
      details: payload
    };

    const currentLogs = Store.getResortSyncLogs();
    Store.refreshLiveAvailability(resortCode);

    return NextResponse.json({
      received: true,
      resortCode,
      processedAt: now,
      status: "ACKNOWLEDGED"
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
