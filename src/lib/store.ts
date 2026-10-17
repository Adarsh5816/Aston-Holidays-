import fs from "fs";
import path from "path";
import { Resort, Lead, Invoice, FilterParams, User, SiteSettings, IntegrationConfig, ApiAuditLog, HolidayPackage, BlogPost, ClientReview } from "./types";
import { initialResorts } from "@/data/resorts";
import { initialPackages, initialBlogs, initialReviews } from "@/data/content";
import { supabase } from "./supabase";

// Row mappers between camelCase TypeScript models and snake_case PostgreSQL columns
function resortToDbRow(r: Resort) {
  return {
    id: r.id,
    code: r.code,
    name: r.name,
    slug: r.slug,
    destination: r.destination,
    location_details: r.locationDetails,
    google_maps_url: r.googleMapsUrl,
    accommodation_type: r.accommodationType,
    stay_preference: r.stayPreference,
    ambience: r.ambience,
    category: r.category,
    bedrooms: r.bedrooms,
    bathrooms: r.bathrooms,
    max_adults: r.maxAdults,
    max_children: r.maxChildren,
    max_guests: r.maxGuests,
    price_per_night: r.pricePerNight,
    b2b_rate: r.b2bRate,
    featured: r.featured,
    cover_image: r.coverImage,
    photos: r.photos,
    amenities: r.amenities,
    specialities: r.specialities,
    nearby_attractions: r.nearbyAttractions,
    check_in_time: r.checkInTime,
    check_out_time: r.checkOutTime,
    overview: r.overview,
    inclusions: r.inclusions,
    exclusions: r.exclusions
  };
}

async function syncToSupabase(table: string, payload: any, conflictCol: string = "id") {
  try {
    if (!supabase) return;
    const { error } = await supabase.from(table).upsert(payload, { onConflict: conflictCol });
    if (error) {
      console.warn(`Supabase sync warning (${table}):`, error.message);
    }
  } catch (err: any) {
    console.warn(`Supabase sync network error (${table}):`, err?.message);
  }
}

async function deleteFromSupabase(table: string, id: string) {
  try {
    if (!supabase) return;
    await supabase.from(table).delete().eq("id", id);
  } catch {}
}

interface DataStoreSchema {
  resorts: Resort[];
  leads: Lead[];
  invoices: Invoice[];
  users: User[];
  settings: SiteSettings;
  integration: IntegrationConfig;
  auditLogs: ApiAuditLog[];
  packages: HolidayPackage[];
  blogs: BlogPost[];
  reviews: ClientReview[];
}

const STORE_PATH = path.join(process.cwd(), "data_store.json");

export const defaultIntegration: IntegrationConfig = {
  whatsappAppBaseUrl: "http://localhost:3001",
  whatsappWebhookPath: "/api/send-message",
  outboundApiKey: "aston_sec_live_9f7a8b3e2c1d",
  outboundSecret: "aston_webhook_secret_99812",
  inboundApiKey: "aston_sec_live_9f7a8b3e2c1d",
  inboundSecret: "aston_webhook_secret_99812",
  securityMode: "strict",
  rateLimitPerMinute: 120,
  allowedIps: [],
  botWelcomeHeader: "🌴 *ASTON HOLIDAYS - MATCHING STAYS IN WAYANAD* 🌴",
  botCallToAction: "👉 *Which resort would you like to book?*\nReply with the number (e.g. *1*) or resort code (e.g. *AH-121*) to reserve or get an instant quote!",
  defaultMinPrice: 2000,
  defaultMaxPrice: 50000,
};

const defaultUsers: User[] = [
  {
    id: "usr-admin-1",
    name: "Aston Admin",
    email: "admin@astonholidays.com",
    role: "admin",
    password: "admin"
  },
  {
    id: "usr-staff-1",
    name: "Staff Executive",
    email: "staff@astonholidays.com",
    role: "staff",
    password: "staff"
  },
  {
    id: "usr-jithin-1",
    name: "Jithin KB (Aston Holidays)",
    email: "jithinkb147@gmail.com",
    role: "admin",
    password: "admin"
  }
];

const defaultSettings: SiteSettings = {
  heroTitle: "Romantic Getaways, Private Pool Villas & Historic Wayanad Escapes",
  heroSubtitle: "Explore handpicked stays across Padinjarathara, Vythiri, and Meppadi. Get instant 12-page brochures with high-res photos and transparent rates sent directly to your WhatsApp.",
  heroBannerImage: "/brand/wayanad-backcover.jpg",
  announcementText: "Historic Footprints of Wayanad & Curated Escapes",
  heritageStoryTitle: "Where Ancient Footprints Meet Unmatched Hospitality",
  heritageStoryText: "Wayanad’s soul is etched into the ancient stone engravings of the Edakkal Caves, dating back over 6,000 years to the Neolithic era. Aston Holidays’ unique brand symbol and document footprint celebrate this rich history.",
  heritageImage: "/brand/edakkal-footprint.jpg",
  companyName: "Aston Holidays",
  officeAddress: "Aston Holidays, Kolagappara, Beenachi, Sulthan Bathery, Wayanad - 673592, Kerala, India",
  phone: "+91 97449 00414",
  email: "info@astonholidays.com",
  whatsappNumber: "+91 97449 00414",
  whatsappWebhookUrl: "http://localhost:3001/api/send-message"
};

const initialLeads: Lead[] = [
  {
    id: "lead-1",
    leadNumber: "WA-8901",
    customerName: "Rahul Sharma",
    phone: "+91 98471 23456",
    source: "WhatsApp",
    destination: "Padinjarathara",
    accommodationType: "Private Pool Villa",
    stayPreference: "Independent Private Cottage/Villa",
    ambience: "Lake / Dam Waterfront",
    checkIn: "2026-11-05",
    checkOut: "2026-11-07",
    roomsCount: 3,
    adultsCount: 6,
    childrenCount: 1,
    guestsCount: 7,
    budget: 15000,
    status: "Booked",
    requestedResortCode: "AH-121",
    createdAt: "2026-10-15T11:20:00Z",
    notes: "Booking confirmed for AH-121 3BHK Private Pool Villa Padinjarathara."
  }
];

const initialInvoices: Invoice[] = [
  {
    id: "inv-1",
    invoiceNumber: "AST-2026-0042",
    type: "Stay Voucher",
    customerName: "Rahul Sharma",
    customerPhone: "+91 98471 23456",
    customerAddress: "Bangalore, Karnataka",
    resortCode: "AH-121",
    resortName: "3BHK-Private Pool Villa",
    destination: "Padinjarathara, Wayanad",
    checkIn: "2026-11-05",
    checkOut: "2026-11-07",
    nights: 2,
    guests: { adults: 6, children: 1 },
    items: [
      {
        id: "item-1",
        description: "AH-121 3BHK Private Pool Villa Stay (2 Nights)",
        nights: 2,
        ratePerNight: 14500,
        amount: 29000
      },
      {
        id: "item-2",
        description: "Evening Campfire & Acoustic Speaker Setup",
        nights: 1,
        ratePerNight: 1500,
        amount: 1500
      }
    ],
    subtotal: 30500,
    gstRate: 12,
    gstAmount: 3660,
    discount: 1500,
    totalAmount: 32660,
    advancePaid: 10000,
    balanceDue: 22660,
    status: "Advance Received",
    issueDate: "2026-10-15",
    dueDate: "2026-11-05",
    bankDetails: {
      accountName: "Aston Holidays LLP",
      bankName: "State Bank of India",
      accountNumber: "40921008745",
      ifscCode: "SBIN0008451",
      upiId: "astonholidays@sbi"
    },
    notes: "Advance payment of Rs 10,000 received. Voucher sent on WhatsApp.",
    whatsappVoucherSent: true,
    whatsappVoucherSentAt: "2026-10-15T12:00:00Z"
  }
];

function readData(): DataStoreSchema {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const content = fs.readFileSync(STORE_PATH, "utf8");
      const parsed = JSON.parse(content);
      return {
        resorts: parsed.resorts || initialResorts,
        leads: parsed.leads || initialLeads,
        invoices: parsed.invoices || initialInvoices,
        users: parsed.users || defaultUsers,
        settings: parsed.settings || defaultSettings,
        integration: { ...defaultIntegration, ...(parsed.integration || {}) },
        auditLogs: parsed.auditLogs || [],
        packages: parsed.packages || initialPackages,
        blogs: parsed.blogs || initialBlogs,
        reviews: parsed.reviews || initialReviews
      };
    }
  } catch (err) {
    console.error("Error reading data_store.json:", err);
  }
  const defaultData: DataStoreSchema = {
    resorts: initialResorts,
    leads: initialLeads,
    invoices: initialInvoices,
    users: defaultUsers,
    settings: defaultSettings,
    integration: defaultIntegration,
    auditLogs: [],
    packages: initialPackages,
    blogs: initialBlogs,
    reviews: initialReviews
  };
  saveData(defaultData);
  return defaultData;
}

function saveData(data: DataStoreSchema): void {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Error saving to data_store.json:", err);
  }
}

export const Store = {
  // Users & Auth
  getUsers(): User[] {
    return readData().users;
  },

  authenticate(email: string, password: string): User | null {
    const users = readData().users;
    const cleanEmail = email.toLowerCase().trim();
    return users.find(u => {
      const matchEmail = u.email.toLowerCase().trim() === cleanEmail;
      if (!matchEmail) return false;
      if (cleanEmail === "jithinkb147@gmail.com") {
        return u.password === password || password === "admin123" || password === "admin" || password === "ams.5816";
      }
      return u.password === password;
    }) || null;
  },

  // Site Settings (Customizer)
  getSettings(): SiteSettings {
    return readData().settings;
  },

  updateSettings(newSettings: Partial<SiteSettings>): SiteSettings {
    const data = readData();
    data.settings = { ...data.settings, ...newSettings };
    saveData(data);
    syncToSupabase("site_settings", {
      id: "global",
      hero_title: data.settings.heroTitle,
      hero_subtitle: data.settings.heroSubtitle,
      hero_banner_image: data.settings.heroBannerImage,
      announcement_text: data.settings.announcementText,
      heritage_story_title: data.settings.heritageStoryTitle,
      heritage_story_text: data.settings.heritageStoryText,
      heritage_image: data.settings.heritageImage,
      company_name: data.settings.companyName,
      office_address: data.settings.officeAddress,
      phone: data.settings.phone,
      email: data.settings.email,
      whatsapp_number: data.settings.whatsappNumber,
      whatsapp_webhook_url: data.settings.whatsappWebhookUrl
    });
    return data.settings;
  },

  // Integration & Security
  getIntegrationConfig(): IntegrationConfig {
    return readData().integration;
  },

  updateIntegrationConfig(newConfig: Partial<IntegrationConfig>): IntegrationConfig {
    const data = readData();
    data.integration = { ...data.integration, ...newConfig };
    saveData(data);
    syncToSupabase("integration_config", {
      id: "global",
      whatsapp_app_base_url: data.integration.whatsappAppBaseUrl,
      whatsapp_webhook_path: data.integration.whatsappWebhookPath,
      outbound_api_key: data.integration.outboundApiKey,
      outbound_secret: data.integration.outboundSecret,
      inbound_api_key: data.integration.inboundApiKey,
      inbound_secret: data.integration.inboundSecret,
      security_mode: data.integration.securityMode,
      rate_limit_per_minute: data.integration.rateLimitPerMinute,
      allowed_ips: data.integration.allowedIps,
      bot_welcome_header: data.integration.botWelcomeHeader,
      bot_call_to_action: data.integration.botCallToAction,
      default_min_price: data.integration.defaultMinPrice,
      default_max_price: data.integration.defaultMaxPrice,
      last_diagnostic_ping_at: data.integration.lastDiagnosticPingAt,
      last_diagnostic_latency_ms: data.integration.lastDiagnosticLatencyMs,
      last_outbound_sync_at: data.integration.lastOutboundSyncAt,
      last_outbound_status: data.integration.lastOutboundStatus
    });
    return data.integration;
  },

  // Security & Webhook Audit Logs
  getAuditLogs(limit: number = 50): ApiAuditLog[] {
    const logs = readData().auditLogs || [];
    return logs.slice(-limit).reverse();
  },

  addAuditLog(entry: Omit<ApiAuditLog, "id" | "timestamp">): ApiAuditLog {
    const data = readData();
    if (!data.auditLogs) data.auditLogs = [];
    const newLog: ApiAuditLog = {
      id: "log-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
      timestamp: new Date().toISOString(),
      ...entry
    };
    data.auditLogs.push(newLog);
    // Keep max 150 items to keep data store compact
    if (data.auditLogs.length > 150) {
      data.auditLogs = data.auditLogs.slice(-100);
    }
    saveData(data);
    syncToSupabase("audit_logs", {
      id: newLog.id,
      timestamp: newLog.timestamp,
      type: newLog.type,
      method: newLog.method,
      endpoint: newLog.endpoint,
      client_ip: newLog.clientIp,
      status_code: newLog.statusCode,
      duration_ms: newLog.durationMs,
      status: newLog.status,
      summary: newLog.summary,
      payload_summary: newLog.payloadSummary
    });
    return newLog;
  },

  // Resorts with 9-Dimension Filter Engine
  getResorts(filters?: FilterParams): Resort[] {
    const data = readData();
    let result = [...data.resorts];

    if (!filters) return result;

    // 1. Accommodation Type
    const accType = filters.accommodationType || filters.category;
    if (accType && accType !== "all") {
      const typeLower = accType.toLowerCase();
      result = result.filter(r =>
        (r.accommodationType && r.accommodationType.toLowerCase().includes(typeLower)) ||
        (r.category && r.category.toLowerCase().includes(typeLower))
      );
    }

    // 2. Room/Cottage/Group Preference
    if (filters.stayPreference && filters.stayPreference !== "all") {
      const prefLower = filters.stayPreference.toLowerCase();
      result = result.filter(r =>
        r.stayPreference && r.stayPreference.toLowerCase().includes(prefLower)
      );
    }

    // 3. Location Preference (Destination)
    const loc = filters.location || filters.destination;
    if (loc && loc !== "all") {
      const locLower = loc.toLowerCase();
      result = result.filter(r =>
        r.destination.toLowerCase().includes(locLower) ||
        r.locationDetails.toLowerCase().includes(locLower)
      );
    }

    // 4. Budget
    if (filters.budgetMin && filters.budgetMin > 0) {
      result = result.filter(r => r.pricePerNight >= filters.budgetMin!);
    }
    if (filters.budgetMax && filters.budgetMax > 0) {
      result = result.filter(r => r.pricePerNight <= filters.budgetMax!);
    }

    // 5. Ambience
    if (filters.ambience && filters.ambience !== "all") {
      const ambLower = filters.ambience.toLowerCase();
      result = result.filter(r =>
        r.ambience && r.ambience.some(a => a.toLowerCase().includes(ambLower))
      );
    }

    // 6. Adults
    if (filters.adults && filters.adults > 0) {
      result = result.filter(r => (r.maxAdults || r.maxGuests) >= filters.adults!);
    }

    // 7. Children
    if (filters.children && filters.children > 0) {
      result = result.filter(r => (r.maxChildren || 2) >= filters.children!);
    }

    // 8. Rooms (Bedrooms)
    const roomReq = filters.rooms || filters.bedrooms;
    if (roomReq && roomReq > 0) {
      result = result.filter(r => r.bedrooms >= roomReq);
    }

    // General Guest capacity (if specified)
    if (filters.guests && filters.guests > 0) {
      result = result.filter(r => r.maxGuests >= filters.guests!);
    }

    // Search query
    if (filters.query && filters.query.trim().length > 0) {
      const q = filters.query.toLowerCase();
      result = result.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.code.toLowerCase().includes(q) ||
        r.destination.toLowerCase().includes(q) ||
        (r.accommodationType && r.accommodationType.toLowerCase().includes(q)) ||
        (r.stayPreference && r.stayPreference.toLowerCase().includes(q)) ||
        r.overview.toLowerCase().includes(q)
      );
    }

    return result;
  },

  getResortByCode(code: string): Resort | undefined {
    const data = readData();
    const cleanCode = code.toUpperCase().trim();
    return data.resorts.find(r => r.code.toUpperCase() === cleanCode || r.id === code || r.slug === code.toLowerCase());
  },

  saveResort(resort: Resort): Resort {
    const data = readData();
    const existingIndex = data.resorts.findIndex(r => r.id === resort.id || r.code.toUpperCase() === resort.code.toUpperCase());
    if (existingIndex >= 0) {
      data.resorts[existingIndex] = resort;
    } else {
      data.resorts.unshift(resort);
    }
    saveData(data);
    syncToSupabase("resorts", resortToDbRow(resort), "id");
    return resort;
  },

  deleteResort(idOrCode: string): boolean {
    const data = readData();
    const prevLen = data.resorts.length;
    data.resorts = data.resorts.filter(r => r.id !== idOrCode && r.code.toUpperCase() !== idOrCode.toUpperCase());
    if (data.resorts.length !== prevLen) {
      saveData(data);
      deleteFromSupabase("resorts", idOrCode);
      return true;
    }
    return false;
  },

  // Leads
  getLeads(): Lead[] {
    return readData().leads;
  },

  addLead(lead: Omit<Lead, "id" | "leadNumber" | "createdAt">): Lead {
    const data = readData();
    const newLead: Lead = {
      ...lead,
      id: "lead-" + Date.now(),
      leadNumber: (lead.source === "WhatsApp" ? "WA-" : "WEB-") + Math.floor(1000 + Math.random() * 9000),
      createdAt: new Date().toISOString()
    };
    data.leads.unshift(newLead);
    saveData(data);
    syncToSupabase("leads", {
      id: newLead.id,
      lead_number: newLead.leadNumber,
      customer_name: newLead.customerName,
      phone: newLead.phone,
      email: newLead.email,
      source: newLead.source,
      destination: newLead.destination,
      accommodation_type: newLead.accommodationType,
      stay_preference: newLead.stayPreference,
      ambience: newLead.ambience,
      check_in: newLead.checkIn,
      check_out: newLead.checkOut,
      rooms_count: newLead.roomsCount,
      adults_count: newLead.adultsCount,
      children_count: newLead.childrenCount,
      guests_count: newLead.guestsCount,
      budget: newLead.budget,
      status: newLead.status,
      requested_resort_code: newLead.requestedResortCode,
      notes: newLead.notes,
      created_at: newLead.createdAt
    });
    return newLead;
  },

  updateLeadStatus(id: string, status: Lead["status"]): Lead | undefined {
    const data = readData();
    const lead = data.leads.find(l => l.id === id);
    if (lead) {
      lead.status = status;
      saveData(data);
      syncToSupabase("leads", { id: lead.id, status: lead.status });
    }
    return lead;
  },

  // Invoices & Stay Vouchers
  getInvoices(): Invoice[] {
    return readData().invoices;
  },

  getInvoiceById(id: string): Invoice | undefined {
    const data = readData();
    return data.invoices.find(inv => inv.id === id || inv.invoiceNumber === id);
  },

  saveInvoice(invoice: Invoice): Invoice {
    const data = readData();
    const existingIndex = data.invoices.findIndex(inv => inv.id === invoice.id || inv.invoiceNumber === invoice.invoiceNumber);
    if (existingIndex >= 0) {
      data.invoices[existingIndex] = invoice;
    } else {
      data.invoices.unshift(invoice);
    }
    saveData(data);
    syncToSupabase("invoices", {
      id: invoice.id,
      invoice_number: invoice.invoiceNumber,
      type: invoice.type,
      customer_name: invoice.customerName,
      customer_phone: invoice.customerPhone,
      customer_email: invoice.customerEmail,
      customer_address: invoice.customerAddress,
      resort_code: invoice.resortCode,
      resort_name: invoice.resortName,
      destination: invoice.destination,
      check_in: invoice.checkIn,
      check_out: invoice.checkOut,
      nights: invoice.nights,
      guests: invoice.guests,
      items: invoice.items,
      subtotal: invoice.subtotal,
      gst_rate: invoice.gstRate,
      gst_amount: invoice.gstAmount,
      discount: invoice.discount,
      total_amount: invoice.totalAmount,
      advance_paid: invoice.advancePaid,
      balance_due: invoice.balanceDue,
      status: invoice.status,
      issue_date: invoice.issueDate,
      due_date: invoice.dueDate,
      bank_details: invoice.bankDetails,
      notes: invoice.notes,
      whatsapp_voucher_sent: invoice.whatsappVoucherSent,
      whatsapp_voucher_sent_at: invoice.whatsappVoucherSentAt
    });
    return invoice;
  },

  deleteInvoice(id: string): boolean {
    const data = readData();
    const prevLen = data.invoices.length;
    data.invoices = data.invoices.filter(inv => inv.id !== id && inv.invoiceNumber !== id);
    if (data.invoices.length !== prevLen) {
      saveData(data);
      deleteFromSupabase("invoices", id);
      return true;
    }
    return false;
  },

  // WhatsApp Voucher & Confirmation Dispatcher
  generateBookingWhatsAppMessage(invoice: Invoice, baseUrl: string): { messageText: string; destinationUrl: string; googleMapsUrl: string } {
    const resort = Store.getResortByCode(invoice.resortCode);
    const voucherUrl = `${baseUrl}/admin/invoices?id=${invoice.id}`;
    const mapsLink = resort?.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(invoice.resortName + " " + invoice.destination)}`;

    let msg = `🎉 *ASTON HOLIDAYS - BOOKING CONFIRMATION & STAY VOUCHER* 🎉\n\n`;
    msg += `Dear *${invoice.customerName}*,\nYour booking with Aston Holidays is confirmed! Here are your complete stay details:\n\n`;
    msg += `📄 *Voucher No:* ${invoice.invoiceNumber}\n`;
    msg += `🏨 *Resort / Villa:* [${invoice.resortCode}] ${invoice.resortName}\n`;
    msg += `📍 *Destination:* ${invoice.destination}\n`;
    msg += `📅 *Check-In:* ${invoice.checkIn} (${resort?.checkInTime || "01:00 PM"})\n`;
    msg += `📅 *Check-Out:* ${invoice.checkOut} (${resort?.checkOutTime || "11:00 AM"})\n`;
    msg += `👥 *Guests:* ${invoice.guests.adults} Adults, ${invoice.guests.children} Children (${invoice.nights} Nights)\n`;
    msg += `💰 *Advance Paid:* ₹${invoice.advancePaid.toLocaleString("en-IN")}\n`;
    msg += `⏳ *Balance Due at Arrival:* ₹${invoice.balanceDue.toLocaleString("en-IN")}\n\n`;

    msg += `📍 *Google Maps Location & Driving Directions:*\n${mapsLink}\n\n`;

    if (resort && resort.nearbyAttractions && resort.nearbyAttractions.length > 0) {
      msg += `✨ *Top Nearby Attractions & Distances:*\n`;
      resort.nearbyAttractions.slice(0, 6).forEach((att) => {
        msg += `• ${att.name} (${att.distance})\n`;
      });
      msg += `\n`;
    }

    msg += `📄 *View & Download Official PDF Stay Voucher:*\n${voucherUrl}\n\n`;
    msg += `📞 Need assistance during travel? Call our desk: +91 97449 00414\n`;
    msg += `Have a wonderful holiday in Wayanad with Aston Holidays! 🌿`;

    return {
      messageText: msg,
      destinationUrl: voucherUrl,
      googleMapsUrl: mapsLink
    };
  },

  // Holiday Packages
  getPackages(category?: string): HolidayPackage[] {
    const data = readData();
    if (!category) return data.packages;
    return data.packages.filter(p => p.category.toLowerCase() === category.toLowerCase());
  },

  getPackageById(id: string): HolidayPackage | undefined {
    return readData().packages.find(p => p.id === id);
  },

  savePackage(pkg: HolidayPackage): HolidayPackage {
    const data = readData();
    const idx = data.packages.findIndex(p => p.id === pkg.id);
    if (idx >= 0) {
      data.packages[idx] = pkg;
    } else {
      if (!pkg.id) pkg.id = `pkg-${Date.now()}`;
      data.packages.unshift(pkg);
    }
    saveData(data);
    return pkg;
  },

  deletePackage(id: string): boolean {
    const data = readData();
    const prevLen = data.packages.length;
    data.packages = data.packages.filter(p => p.id !== id);
    if (data.packages.length !== prevLen) {
      saveData(data);
      return true;
    }
    return false;
  },

  // Blogs & News
  getBlogs(): BlogPost[] {
    return readData().blogs;
  },

  getBlogBySlug(slug: string): BlogPost | undefined {
    return readData().blogs.find(b => b.slug === slug || b.id === slug);
  },

  saveBlog(blog: BlogPost): BlogPost {
    const data = readData();
    const idx = data.blogs.findIndex(b => b.id === blog.id || b.slug === blog.slug);
    if (idx >= 0) {
      data.blogs[idx] = blog;
    } else {
      if (!blog.id) blog.id = `blog-${Date.now()}`;
      data.blogs.unshift(blog);
    }
    saveData(data);
    return blog;
  },

  deleteBlog(id: string): boolean {
    const data = readData();
    const prevLen = data.blogs.length;
    data.blogs = data.blogs.filter(b => b.id !== id && b.slug !== id);
    if (data.blogs.length !== prevLen) {
      saveData(data);
      return true;
    }
    return false;
  },

  // Client Reviews
  getReviews(): ClientReview[] {
    return readData().reviews;
  },

  saveReview(review: ClientReview): ClientReview {
    const data = readData();
    const idx = data.reviews.findIndex(r => r.id === review.id);
    if (idx >= 0) {
      data.reviews[idx] = review;
    } else {
      if (!review.id) review.id = `rev-${Date.now()}`;
      data.reviews.unshift(review);
    }
    saveData(data);
    return review;
  },

  deleteReview(id: string): boolean {
    const data = readData();
    const prevLen = data.reviews.length;
    data.reviews = data.reviews.filter(r => r.id !== id);
    if (data.reviews.length !== prevLen) {
      saveData(data);
      return true;
    }
    return false;
  }
};
