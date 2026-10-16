import { NextRequest, NextResponse } from "next/server";
import { Store } from "@/lib/store";

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    const { invoiceId, paymentStatus } = await req.json();
    if (!invoiceId) {
      return NextResponse.json({ error: "Invoice ID is required" }, { status: 400 });
    }

    const invoice = Store.getInvoiceById(invoiceId);
    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Update status
    if (paymentStatus) {
      invoice.status = paymentStatus;
      if (paymentStatus === "Fully Paid") {
        invoice.advancePaid = invoice.totalAmount;
        invoice.balanceDue = 0;
      }
    }
    invoice.whatsappVoucherSent = true;
    invoice.whatsappVoucherSentAt = new Date().toISOString();
    Store.saveInvoice(invoice);

    const host = req.headers.get("host") || "localhost:3000";
    const proto = req.headers.get("x-forwarded-proto") || "http";
    const baseUrl = `${proto}://${host}`;

    // Generate formatted WhatsApp confirmation message with map and attractions
    const { messageText, destinationUrl, googleMapsUrl } = Store.generateBookingWhatsAppMessage(invoice, baseUrl);

    // Stream 2: Outbound Voucher & Confirmation Stream (Aston App -> WhatsApp App)
    const config = Store.getIntegrationConfig();
    let webhookDispatched = false;
    let webhookResponseData: any = null;
    let webhookError: string | null = null;

    // Resolve target URL
    const targetUrl = config.whatsappAppBaseUrl
      ? `${config.whatsappAppBaseUrl.replace(/\/+$/, "")}${config.whatsappWebhookPath.startsWith("/") ? "" : "/"}${config.whatsappWebhookPath}`
      : Store.getSettings().whatsappWebhookUrl;

    if (targetUrl) {
      try {
        const cleanPhone = invoice.customerPhone.replace(/[^0-9]/g, "");
        const outboundPayload = {
          recipientPhone: cleanPhone,
          customerName: invoice.customerName,
          message: messageText,
          voucherUrl: destinationUrl,
          googleMapsUrl: googleMapsUrl,
          invoiceNumber: invoice.invoiceNumber
        };

        const headers: Record<string, string> = {
          "Content-Type": "application/json"
        };
        if (config.outboundApiKey) {
          headers["x-api-key"] = config.outboundApiKey;
        }
        if (config.outboundSecret) {
          headers["Authorization"] = `Bearer ${config.outboundSecret}`;
        }

        const res = await fetch(targetUrl, {
          method: "POST",
          headers,
          body: JSON.stringify(outboundPayload),
          signal: AbortSignal.timeout(4000)
        });

        webhookDispatched = res.ok;
        try {
          webhookResponseData = await res.json();
        } catch {
          webhookResponseData = { statusText: res.statusText, status: res.status };
        }

        Store.updateIntegrationConfig({
          lastOutboundSyncAt: new Date().toISOString(),
          lastOutboundStatus: res.ok ? "success" : "failed"
        });

        Store.addAuditLog({
          type: "outbound_voucher",
          method: "POST",
          endpoint: targetUrl,
          statusCode: res.status,
          durationMs: Date.now() - startTime,
          status: res.ok ? "success" : "error",
          summary: `Voucher dispatch for #${invoice.invoiceNumber} to ${cleanPhone} (${res.status} ${res.statusText})`,
          payloadSummary: JSON.stringify({ recipient: cleanPhone, invoiceNumber: invoice.invoiceNumber })
        });
      } catch (e: any) {
        webhookError = e.message || "Failed to reach WhatsApp App webhook";
        console.warn("Could not dispatch voucher to WhatsApp App webhook:", webhookError);

        Store.updateIntegrationConfig({
          lastOutboundSyncAt: new Date().toISOString(),
          lastOutboundStatus: "failed"
        });

        Store.addAuditLog({
          type: "outbound_voucher",
          method: "POST",
          endpoint: targetUrl,
          statusCode: 504,
          durationMs: Date.now() - startTime,
          status: "error",
          summary: `Voucher webhook call failed: ${webhookError}`
        });
      }
    }

    return NextResponse.json({
      success: true,
      invoice,
      messageText,
      voucherUrl: destinationUrl,
      googleMapsUrl,
      webhookDispatched,
      webhookResponseData,
      webhookError,
      directWhatsAppUrl: `https://wa.me/${invoice.customerPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(messageText)}`
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
