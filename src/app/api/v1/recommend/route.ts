import { NextRequest, NextResponse } from "next/server";
import { Store } from "@/lib/store";
import { RecommendationRequest, RecommendationResponse } from "@/lib/types";
import {
  verifyInboundSecurity,
  checkRateLimit,
  getClientIp,
  sanitizeString,
  sanitizePhone,
  sanitizeNumber
} from "@/lib/security";

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const clientIp = getClientIp(req);
  const config = Store.getIntegrationConfig();

  // 1. Rate Limiting Protection (Anti-DDoS / Brute Force)
  const rateCheck = checkRateLimit(clientIp, config.rateLimitPerMinute);
  if (rateCheck.limited) {
    Store.addAuditLog({
      type: "inbound_recommend",
      method: "POST",
      endpoint: "/api/v1/recommend",
      clientIp,
      statusCode: 429,
      durationMs: Date.now() - startTime,
      status: "rate_limited",
      summary: `Rate limit exceeded (${rateCheck.currentCount} req/min > max ${config.rateLimitPerMinute})`
    });
    return NextResponse.json(
      {
        success: false,
        error: "Rate limit exceeded. Please throttle your requests.",
        retryAfter: rateCheck.retryAfterSeconds
      },
      {
        status: 429,
        headers: { "Retry-After": String(rateCheck.retryAfterSeconds) }
      }
    );
  }

  try {
    let body: RecommendationRequest = {};
    try {
      body = await req.json();
    } catch {
      // Empty or invalid JSON
    }

    // 2. Cyber Threat & Authentication Shield (Anti-Timing Attacks, Bearer & x-api-key)
    const auth = verifyInboundSecurity(req, body);
    if (!auth.authorized) {
      Store.addAuditLog({
        type: "inbound_recommend",
        method: "POST",
        endpoint: "/api/v1/recommend",
        clientIp,
        statusCode: 401,
        durationMs: Date.now() - startTime,
        status: "blocked",
        summary: auth.reason || "Unauthorized API request blocked",
        payloadSummary: JSON.stringify(body).slice(0, 200)
      });
      return NextResponse.json(
        {
          success: false,
          error: auth.reason || "Unauthorized access. Valid x-api-key or Bearer token required."
        },
        { status: 401 }
      );
    }

    // 3. Stream 3: Real-Time Diagnostic Health Probe (Ping) from WhatsApp Dev Portal
    if (auth.isDiagnosticPing) {
      const latencyMs = Date.now() - startTime;
      Store.updateIntegrationConfig({
        lastDiagnosticPingAt: new Date().toISOString(),
        lastDiagnosticLatencyMs: latencyMs
      });
      Store.addAuditLog({
        type: "diagnostic_ping",
        method: "POST",
        endpoint: "/api/v1/recommend",
        clientIp,
        statusCode: 200,
        durationMs: latencyMs,
        status: "success",
        summary: "Diagnostic Health Probe (Ping) from WhatsApp App Dev Portal - Connection Verified"
      });
      return NextResponse.json({
        success: true,
        diagnostic: true,
        message: "Aston Holidays API is online and authenticated",
        system: "Aston Holidays Operations Hub",
        version: "2.0.0",
        timestamp: Date.now(),
        latencyMs
      });
    }

    // 4. Input Sanitization & Anti-Injection Shield
    const customerName = sanitizeString(body.customerName, 80);
    const customerPhone = sanitizePhone(body.customerPhone);
    const accommodationType = sanitizeString(body.accommodationType || body.stayType, 60);
    const stayPreference = sanitizeString(body.stayPreference, 60);
    const location = sanitizeString(body.location || body.destination, 60);
    const ambience = sanitizeString(body.ambience, 60);
    const budgetMin = sanitizeNumber(body.budgetMin, 0, 10000000);
    const budgetMax = sanitizeNumber(body.budgetMax, 0, 10000000);
    const adults = sanitizeNumber(body.adults, 1, 100);
    const children = sanitizeNumber(body.children, 0, 50);
    const rooms = sanitizeNumber(body.rooms || body.bedrooms, 1, 50);
    const checkIn = sanitizeString(body.checkIn, 25);
    const checkOut = sanitizeString(body.checkOut, 25);

    const host = req.headers.get("host") || "localhost:3000";
    const proto = req.headers.get("x-forwarded-proto") || "http";
    const baseUrl = `${proto}://${host}`;

    // 5. Execute 9-Dimension Filter Query
    const matchedResorts = Store.getResorts({
      accommodationType,
      stayPreference,
      location,
      budgetMin,
      budgetMax,
      ambience,
      adults,
      children,
      rooms,
      checkIn,
      checkOut
    });

    // 6. Automatically Record Lead in CRM (Only for real inquiries, exclude test probe numbers)
    const isTestProbePhone = !customerPhone || customerPhone.includes("9999999999") || customerPhone.length < 8;
    if (!isTestProbePhone && (customerPhone || customerName)) {
      Store.addLead({
        customerName: customerName || "WhatsApp Guest",
        phone: customerPhone || "N/A",
        source: "WhatsApp",
        destination: location,
        accommodationType,
        stayPreference,
        ambience,
        checkIn,
        checkOut,
        adultsCount: adults,
        childrenCount: children,
        roomsCount: rooms,
        budget: budgetMax,
        status: matchedResorts.length > 0 ? "Brochure Sent" : "New",
        requestedResortCode: matchedResorts[0]?.code,
        notes: `WhatsApp Request: Type=[${accommodationType || "Any"}], Pref=[${stayPreference || "Any"}], Loc=[${location || "Any"}], Ambience=[${ambience || "Any"}], Guests=[${adults || 0}A, ${children || 0}C, ${rooms || 0}R]. Matches=${matchedResorts.length}`
      });
    }

    // 7. Format Result Resorts with Both WhatsApp App and Aston Schema
    const results = matchedResorts.map((r) => ({
      code: r.code,
      name: r.name,
      destination: r.destination,
      location: r.destination, // WhatsApp App alias
      locationDetails: r.locationDetails,
      accommodationType: r.accommodationType,
      stayPreference: r.stayPreference,
      ambience: r.ambience || [],
      bedrooms: r.bedrooms,
      maxAdults: r.maxAdults || r.maxGuests,
      maxChildren: r.maxChildren || 2,
      maxGuests: r.maxGuests,
      pricePerNight: r.pricePerNight,
      price: r.pricePerNight, // WhatsApp App alias
      coverPhoto: r.coverImage.startsWith("http") ? r.coverImage : `${baseUrl}${r.coverImage}`,
      photos: r.photos.map((p) => (p.startsWith("http") ? p : `${baseUrl}${p}`)),
      amenities: r.amenities,
      specialities: r.specialities,
      nearbyAttractions: r.nearbyAttractions,
      webBrochureUrl: `${baseUrl}/brochure/${r.code}`,
      directPdfUrl: `${baseUrl}/api/v1/brochures/${r.code}/pdf`,
      googleMapsUrl: r.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(r.name + " " + r.destination)}`
    }));

    // 8. Generate WhatsApp Formatted Message
    let whatsAppMessage = `${config.botWelcomeHeader || "🌴 *ASTON HOLIDAYS - MATCHING STAYS IN WAYANAD* 🌴"}\n\n`;

    // Customer Preference Summary
    whatsAppMessage += `📋 *Your Preferences:*\n`;
    if (accommodationType) whatsAppMessage += `• Type: ${accommodationType}\n`;
    if (stayPreference) whatsAppMessage += `• Preference: ${stayPreference}\n`;
    if (location) whatsAppMessage += `• Location: ${location}\n`;
    if (ambience) whatsAppMessage += `• Ambience: ${ambience}\n`;
    if (adults || children) whatsAppMessage += `• Guests: ${adults || 0} Adults${children ? `, ${children} Children` : ""}\n`;
    if (rooms) whatsAppMessage += `• Required Rooms: ${rooms} BHK\n`;
    if (checkIn && checkOut) whatsAppMessage += `• Dates: ${checkIn} to ${checkOut}\n`;
    if (budgetMax) whatsAppMessage += `• Budget Max: ₹${budgetMax.toLocaleString("en-IN")}/night\n`;

    whatsAppMessage += `\nWe found *${results.length} verified propert${results.length === 1 ? "y" : "ies"}* matching your request:\n\n`;

    if (results.length === 0) {
      whatsAppMessage = `🌴 *ASTON HOLIDAYS* 🌴\n\nWe couldn't find an exact match for those specific filters, but we have multiple private pool villas & treehouses across Wayanad!\n\n📞 Call our travel desk: +91 97449 00414\n🌐 Browse all stays online: ${baseUrl}/resorts`;
    } else {
      results.forEach((r, idx) => {
        whatsAppMessage += `*${idx + 1}. [${r.code}] ${r.name}*\n`;
        whatsAppMessage += `📍 Location: ${r.destination}\n`;
        whatsAppMessage += `🏡 Type: ${r.accommodationType} (${r.stayPreference})\n`;
        whatsAppMessage += `🛏️ Rooms: ${r.bedrooms} BHK (Max ${r.maxAdults} Adults, ${r.maxChildren} Kids)\n`;
        whatsAppMessage += `🌿 Ambience: ${r.ambience.slice(0, 2).join(", ")}\n`;
        whatsAppMessage += `💰 Rate: ₹${r.pricePerNight.toLocaleString("en-IN")}/night\n`;
        whatsAppMessage += `✨ Highlights: ${r.amenities.slice(0, 3).join(", ")}\n`;
        whatsAppMessage += `📄 *View 12-Page Brochure & Photos:* ${r.webBrochureUrl}\n\n`;
      });
      whatsAppMessage += config.botCallToAction || `👉 *Which resort would you like to book?*\nReply with the number (e.g. *1*) or resort code (*${results[0]?.code}*) to reserve or get an instant quote!`;
    }

    const durationMs = Date.now() - startTime;
    Store.addAuditLog({
      type: "inbound_recommend",
      method: "POST",
      endpoint: "/api/v1/recommend",
      clientIp,
      statusCode: 200,
      durationMs,
      status: "success",
      summary: `Recommendation query matched ${results.length} resorts for ${customerName || customerPhone || "Guest"}`
    });

    const response: RecommendationResponse = {
      success: true,
      matchedCount: results.length,
      filtersReceived: {
        accommodationType,
        stayPreference,
        location,
        budgetMax,
        ambience,
        adults,
        children,
        rooms,
        travelDates: checkIn && checkOut ? `${checkIn} to ${checkOut}` : undefined
      },
      resorts: results,
      whatsAppMessage,
      instructionsForBot: "Deliver the `whatsAppMessage` to the user, or render interactive selection list cards using the `resorts` array."
    };

    return NextResponse.json(response);
  } catch (error: any) {
    const durationMs = Date.now() - startTime;
    Store.addAuditLog({
      type: "inbound_recommend",
      method: "POST",
      endpoint: "/api/v1/recommend",
      clientIp,
      statusCode: 500,
      durationMs,
      status: "error",
      summary: `Internal error: ${error.message || "Unknown error"}`
    });
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const startTime = Date.now();
  const clientIp = getClientIp(req);
  const config = Store.getIntegrationConfig();

  // Rate Limiter
  const rateCheck = checkRateLimit(clientIp, config.rateLimitPerMinute);
  if (rateCheck.limited) {
    return NextResponse.json({ success: false, error: "Rate limit exceeded" }, { status: 429 });
  }

  // Security check for GET as well
  const auth = verifyInboundSecurity(req);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.reason }, { status: 401 });
  }

  const url = new URL(req.url);
  const accommodationType = sanitizeString(url.searchParams.get("accommodationType") || "");
  const stayPreference = sanitizeString(url.searchParams.get("stayPreference") || "");
  const location = sanitizeString(url.searchParams.get("location") || url.searchParams.get("destination") || "");
  const budgetMax = sanitizeNumber(url.searchParams.get("budgetMax"));
  const ambience = sanitizeString(url.searchParams.get("ambience") || "");
  const adults = sanitizeNumber(url.searchParams.get("adults"));
  const rooms = sanitizeNumber(url.searchParams.get("rooms"));

  const resorts = Store.getResorts({
    accommodationType: accommodationType || undefined,
    stayPreference: stayPreference || undefined,
    location: location || undefined,
    budgetMax,
    ambience: ambience || undefined,
    adults,
    rooms
  });

  return NextResponse.json({
    success: true,
    count: resorts.length,
    resorts: resorts.map((r) => ({
      code: r.code,
      name: r.name,
      destination: r.destination,
      location: r.destination,
      accommodationType: r.accommodationType,
      stayPreference: r.stayPreference,
      ambience: r.ambience,
      bedrooms: r.bedrooms,
      maxAdults: r.maxAdults,
      pricePerNight: r.pricePerNight,
      price: r.pricePerNight,
      coverImage: r.coverImage
    }))
  });
}
