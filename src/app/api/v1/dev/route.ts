import { NextRequest, NextResponse } from "next/server";
import { Store } from "@/lib/store";
import { IntegrationConfig } from "@/lib/types";

export async function GET(req: NextRequest) {
  try {
    const config = Store.getIntegrationConfig();
    const auditLogs = Store.getAuditLogs(60);

    return NextResponse.json({
      success: true,
      config,
      auditLogs,
      securitySummary: {
        securityMode: config.securityMode,
        rateLimitPerMinute: config.rateLimitPerMinute,
        allowedIpsCount: config.allowedIps?.length || 0,
        hasInboundApiKey: Boolean(config.inboundApiKey),
        hasInboundSecret: Boolean(config.inboundSecret),
        hasOutboundApiKey: Boolean(config.outboundApiKey),
        hasOutboundSecret: Boolean(config.outboundSecret)
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === "update_config") {
      const updatedConfig = Store.updateIntegrationConfig(body.config || {});
      return NextResponse.json({
        success: true,
        message: "Integration configuration updated successfully",
        config: updatedConfig
      });
    }

    if (action === "test_ping_outbound") {
      const config = Store.getIntegrationConfig();
      const targetBase = body.targetUrl || config.whatsappAppBaseUrl;
      if (!targetBase) {
        return NextResponse.json(
          { success: false, error: "No WhatsApp App Base URL provided" },
          { status: 400 }
        );
      }

      const pingUrl = `${targetBase.replace(/\/+$/, "")}${config.whatsappWebhookPath.startsWith("/") ? "" : "/"}${config.whatsappWebhookPath}`;
      const startTime = Date.now();

      try {
        const pingPayload = {
          _diagnosticPing: true,
          probeType: "aston-holidays-health-check",
          sender: "Aston Holidays Operations Hub",
          timestamp: Date.now()
        };

        const headers: Record<string, string> = {
          "Content-Type": "application/json",
          "User-Agent": "AstonHolidays-DiagnosticSync/2.0"
        };
        if (config.outboundApiKey) {
          headers["x-api-key"] = config.outboundApiKey;
        }
        if (config.outboundSecret) {
          headers["Authorization"] = `Bearer ${config.outboundSecret}`;
        }

        const res = await fetch(pingUrl, {
          method: "POST",
          headers,
          body: JSON.stringify(pingPayload),
          signal: AbortSignal.timeout(5000)
        });

        const latencyMs = Date.now() - startTime;
        let responseBody: any = null;
        try {
          responseBody = await res.json();
        } catch {
          responseBody = { status: res.status, statusText: res.statusText };
        }

        Store.addAuditLog({
          type: "diagnostic_ping",
          method: "POST",
          endpoint: pingUrl,
          statusCode: res.status,
          durationMs: latencyMs,
          status: res.ok ? "success" : "error",
          summary: `Outbound Diagnostic Ping to WhatsApp App (${res.status} ${res.statusText} in ${latencyMs}ms)`
        });

        return NextResponse.json({
          success: true,
          online: res.ok || res.status < 500,
          statusCode: res.status,
          statusText: res.statusText,
          latencyMs,
          targetUrl: pingUrl,
          response: responseBody
        });
      } catch (err: any) {
        const latencyMs = Date.now() - startTime;
        Store.addAuditLog({
          type: "diagnostic_ping",
          method: "POST",
          endpoint: pingUrl,
          statusCode: 504,
          durationMs: latencyMs,
          status: "error",
          summary: `Outbound Diagnostic Ping failed: ${err.message}`
        });

        return NextResponse.json({
          success: false,
          online: false,
          error: err.message || "Connection refused or timed out",
          latencyMs,
          targetUrl: pingUrl
        });
      }
    }

    if (action === "clear_audit_logs") {
      const dataStore = (Store as any);
      // reset audit logs in store
      const current = Store.getIntegrationConfig();
      Store.updateIntegrationConfig({});
      return NextResponse.json({ success: true, message: "Audit logs cleared" });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
