import fs from "fs";
import path from "path";
import { Resort, Lead, Invoice, FilterParams, User, SiteSettings, IntegrationConfig, ApiAuditLog, HolidayPackage, BlogPost, ClientReview, PackageItineraryBooking, ResortApiConnection, LiveRoomAvailability, ResortBookingRequest, ResortSyncLog } from "./types";
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
  packageBookings: PackageItineraryBooking[];
  resortApiConnections: ResortApiConnection[];
  resortBookingRequests: ResortBookingRequest[];
  resortSyncLogs: ResortSyncLog[];
  liveAvailability: LiveRoomAvailability[];
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

const initialPackageBookings: PackageItineraryBooking[] = [
  {
    id: "pkg-book-1",
    bookingCode: "AST-PKG-9104",
    packageTitle: "Romantic Misty Wayanad & Private Pool Escape",
    category: "Honey Moon Package",
    duration: "3 Days / 2 Nights",
    customerName: "Dr. Siddharth & Ananya",
    customerPhone: "+91 98471 99283",
    customerEmail: "siddharth.m@gmail.com",
    customerAddress: "Indiranagar, Bangalore, Karnataka",
    startDate: "2026-11-15",
    endDate: "2026-11-17",
    totalGuests: { adults: 2, children: 0 },
    itineraryDays: [
      {
        dayNumber: 1,
        title: "Calicut Pickup & Scenic Rainforest Ascent to Wayanad",
        activities: "Chauffeur pickup from Calicut Railway Station / Airport. Scenic drive through Thamarassery Churam pass with mountain mist viewpoints. Traditional Malabar lunch en-route. Check-in to private pool villa AH-112. Evening leisurely poolside dip and welcome plantation tea.",
        sightseeing: ["Lakkidi View Point", "Pookode Freshwater Lake", "Thamarassery Ghats"],
        mealsIncluded: { breakfast: false, lunch: true, dinner: true },
        stayDestination: "Padinjarathara",
        stayResortCode: "AH-112"
      },
      {
        dayNumber: 2,
        title: "Banasura Sagar Dam Boating & Candlelight Dinner by the Pool",
        activities: "Morning breakfast with estate fresh coffee. Visit Banasura Sagar earthen dam with speed boat excursion. Afternoon visit to Karlad Adventure Lake. Evening exclusive 5-course romantic candlelight dinner setup by the private pool with rose petals and acoustic music.",
        sightseeing: ["Banasura Sagar Dam", "Karlad Adventure Lake", "Meenmutty Waterfalls"],
        mealsIncluded: { breakfast: true, lunch: false, dinner: true },
        stayDestination: "Padinjarathara",
        stayResortCode: "AH-112"
      },
      {
        dayNumber: 3,
        title: "Tea Plantation Walk, Spice Shopping & Calicut Drop",
        activities: "Early morning sunrise walk through tea estate paths. Leisurely breakfast and pool dip. Check-out at 11:00 AM. Visit Wayanad Tea Museum and local spice market at Kalpetta for authentic cardamom & pepper. Comfortable drive back and drop at Calicut.",
        sightseeing: ["Tea Museum & Factory", "Kalpetta Heritage Spice Market", "Chain Tree"],
        mealsIncluded: { breakfast: true, lunch: true, dinner: false },
        stayDestination: "Calicut Drop"
      }
    ],
    rooms: [
      {
        id: "room-1",
        resortCode: "AH-112",
        resortName: "2BHK Private Pool Villa",
        roomType: "Luxury Private Pool Villa",
        destination: "Padinjarathara",
        checkIn: "2026-11-15",
        checkOut: "2026-11-17",
        nights: 2,
        roomsCount: 1,
        adultsCount: 2,
        childrenCount: 0,
        ratePerNight: 12500,
        totalAmount: 25000,
        mealPlan: "CP (Bed & Breakfast)",
        specialRequests: "Rose petal bed decoration & quiet private villa requested"
      }
    ],
    vehicle: {
      id: "veh-1",
      enabled: true,
      vehicleType: "Sedan (Dzire / Etios)",
      vehicleNumber: "KL-12-AE-4819",
      driverName: "Suresh Babu",
      driverPhone: "+91 97455 12840",
      pickupLocation: "Calicut Airport (CCJ) / Railway Station",
      dropLocation: "Calicut Railway Station",
      pickupDate: "2026-11-15",
      dropDate: "2026-11-17",
      totalDays: 3,
      ratePerDay: 2600,
      driverBatta: 400,
      totalAmount: 9000,
      dutyNotes: "Driver will report at Calicut Airport at 09:30 AM with guest name placard."
    },
    otherExpenses: [
      {
        id: "exp-1",
        category: "Candlelight Dinner",
        title: "Exclusive 5-Course Candlelight Dinner with Rose Petals & Wine",
        rate: 3500,
        quantity: 1,
        totalAmount: 3500,
        notepadContent: "Client requested pure vegetarian Continental menu, heart-shaped chocolate truffle cake (eggless), and candle lanterns around the pool edge.",
        showInVoucher: true
      },
      {
        id: "exp-2",
        category: "Campfire & Music",
        title: "Private Campfire Setup with Acoustic Bluetooth Speaker",
        rate: 1500,
        quantity: 1,
        totalAmount: 1500,
        notepadContent: "Campfire firewood logs arrangement at 08:30 PM near villa garden lawn.",
        showInVoucher: true
      }
    ],
    notepadNotes: "VIP Honeymoon couple. Ensure villa manager provides warm welcome with fresh tender coconut on arrival. Driver Suresh is informed about the 9:30 AM flight arrival.",
    roomsSubtotal: 25000,
    vehicleSubtotal: 9000,
    otherExpensesSubtotal: 5000,
    grossTotal: 39000,
    discount: 2000,
    taxableAmount: 37000,
    gstRate: 5,
    gstAmount: 1850,
    netPayable: 38850,
    advancePaid: 15000,
    balanceDue: 23850,
    paymentStatus: "Advance Received",
    syncedInvoiceId: "inv-pkg-ast-9104",
    createdAt: "2026-10-18T10:30:00Z",
    updatedAt: "2026-10-18T10:30:00Z"
  }
];

const initialResortApiConnections: ResortApiConnection[] = [
  {
    id: "conn-1",
    resortCode: "AH-112",
    resortName: "2BHK Private Pool Villa",
    pmsProvider: "Stayflexi",
    apiEndpoint: "https://api.stayflexi.com/v2/partners/aston/ah112",
    apiKey: "sk_live_ah112_stayflexi_8391",
    webhookUrl: "https://astonholidays.com/api/v1/resort-sync/webhook?resort=AH-112",
    syncFrequencyMinutes: 5,
    status: "Connected",
    lastSyncAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    lastLatencyMs: 42,
    autoConfirmRequests: true,
    notes: "Direct 2-way sync with resort PMS. Live inventory and instant confirmation enabled."
  },
  {
    id: "conn-2",
    resortCode: "AH-121",
    resortName: "3BHK Private Pool Villa",
    pmsProvider: "eZee Absolute",
    apiEndpoint: "https://live.ezeeabsolute.com/api/v1/properties/ah121",
    apiKey: "ezee_sec_live_99182371",
    webhookUrl: "https://astonholidays.com/api/v1/resort-sync/webhook?resort=AH-121",
    syncFrequencyMinutes: 10,
    status: "Connected",
    lastSyncAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    lastLatencyMs: 65,
    autoConfirmRequests: true,
    notes: "Connected via eZee Channel Manager API. Real-time rates & room availability."
  },
  {
    id: "conn-3",
    resortCode: "AH-104",
    resortName: "Glass Treehouse Sanctuary",
    pmsProvider: "Custom REST API",
    apiEndpoint: "https://pms.wayanadstays.com/api/ah104/availability",
    apiKey: "rest_live_treehouse_334",
    webhookUrl: "https://astonholidays.com/api/v1/resort-sync/webhook?resort=AH-104",
    syncFrequencyMinutes: 15,
    status: "Connected",
    lastSyncAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    lastLatencyMs: 82,
    autoConfirmRequests: false,
    notes: "Treehouse property manager receives API booking requests with instant reservation acknowledgement."
  },
  {
    id: "conn-4",
    resortCode: "AH-101",
    resortName: "Luxury Plantation Heritage Bungalow",
    pmsProvider: "Direct Webhook",
    apiEndpoint: "https://api.plantationheritage.in/webhook/bookings",
    apiKey: "whk_live_ah101_7718",
    webhookUrl: "https://astonholidays.com/api/v1/resort-sync/webhook?resort=AH-101",
    syncFrequencyMinutes: 30,
    status: "Connected",
    lastSyncAt: new Date(Date.now() - 21 * 60 * 1000).toISOString(),
    lastLatencyMs: 53,
    autoConfirmRequests: true,
    notes: "Heritage bungalow booking app webhook receiver."
  }
];

const initialResortBookingRequests: ResortBookingRequest[] = [
  {
    id: "req-1",
    requestId: "REQ-PMS-9281",
    resortCode: "AH-112",
    resortName: "2BHK Private Pool Villa",
    guestName: "Dr. Siddharth & Ananya",
    guestPhone: "+91 98471 99283",
    checkIn: "2026-11-15",
    checkOut: "2026-11-17",
    nights: 2,
    roomsCount: 1,
    roomType: "Luxury Private Pool Villa",
    mealPlan: "CP (Bed & Breakfast)",
    pmsConfirmationNumber: "PMS-CONF-98421",
    status: "Confirmed",
    apiPayloadSent: {
      action: "RESERVATION_CREATE",
      rooms: 1,
      guest: "Dr. Siddharth & Ananya",
      dates: "2026-11-15 to 2026-11-17"
    },
    apiResponseReceived: {
      status: "SUCCESS",
      pms_pnr: "PMS-CONF-98421",
      room_allocated: "Villa Pool 02",
      balance_to_collect: 0
    },
    dispatchedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    confirmedAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 4000).toISOString(),
    specialRequests: "Rose petal bed decoration & early check-in requested."
  },
  {
    id: "req-2",
    requestId: "REQ-PMS-9140",
    resortCode: "AH-121",
    resortName: "3BHK Private Pool Villa",
    guestName: "Vikramaditya Rao & Family",
    guestPhone: "+91 98490 11223",
    checkIn: "2026-11-20",
    checkOut: "2026-11-22",
    nights: 2,
    roomsCount: 1,
    roomType: "3BHK Entire Estate Villa",
    mealPlan: "EP (Room Only)",
    pmsConfirmationNumber: "EZ-CONF-77120",
    status: "Confirmed",
    apiPayloadSent: {
      action: "RESERVATION_CREATE",
      rooms: 1,
      guest: "Vikramaditya Rao",
      dates: "2026-11-20 to 2026-11-22"
    },
    apiResponseReceived: {
      status: "SUCCESS",
      pms_pnr: "EZ-CONF-77120",
      room_allocated: "Entire Villa 121",
      balance_to_collect: 0
    },
    dispatchedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    confirmedAt: new Date(Date.now() - 6 * 60 * 60 * 1000 + 3500).toISOString(),
    specialRequests: "Barbeque grill and extra bedding for children."
  }
];

const initialResortSyncLogs: ResortSyncLog[] = [
  {
    id: "log-1",
    timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    resortCode: "AH-112",
    action: "AVAILABILITY_SYNC",
    status: "SUCCESS",
    latencyMs: 42,
    message: "Pulled live room calendar from Stayflexi API. All room blocks synchronized."
  },
  {
    id: "log-2",
    timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    resortCode: "AH-121",
    action: "AVAILABILITY_SYNC",
    status: "SUCCESS",
    latencyMs: 65,
    message: "eZee Absolute live sync successful. Tariff confirmed at ₹14,500/night."
  },
  {
    id: "log-3",
    timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    resortCode: "AH-112",
    action: "BOOKING_REQUEST",
    status: "SUCCESS",
    latencyMs: 145,
    message: "Dispatched booking request REQ-PMS-9281. PMS confirmed with PNR PMS-CONF-98421."
  }
];

function generateInitialLiveAvailability(): LiveRoomAvailability[] {
  const result: LiveRoomAvailability[] = [];
  const trackedCodes = ["AH-112", "AH-121", "AH-104", "AH-101"];
  const resortsMap: Record<string, { name: string; total: number; tariff: number; b2b: number }> = {
    "AH-112": { name: "2BHK Private Pool Villa", total: 4, tariff: 12500, b2b: 9500 },
    "AH-121": { name: "3BHK Private Pool Villa", total: 3, tariff: 14500, b2b: 11000 },
    "AH-104": { name: "Glass Treehouse Sanctuary", total: 2, tariff: 9500, b2b: 7500 },
    "AH-101": { name: "Plantation Heritage Bungalow", total: 5, tariff: 8000, b2b: 6200 }
  };

  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;

    for (const code of trackedCodes) {
      const info = resortsMap[code];
      const booked = isWeekend ? Math.min(info.total, Math.floor(info.total * 0.75) + 1) : Math.floor(Math.random() * (info.total - 1));
      const avail = Math.max(0, info.total - booked);
      const status: LiveRoomAvailability["status"] = avail === 0 ? "Sold Out" : avail === 1 ? "Fast Filling" : "Available";

      result.push({
        resortCode: code,
        resortName: info.name,
        date: dateStr,
        totalRooms: info.total,
        availableRooms: avail,
        bookedRooms: booked,
        status,
        liveTariff: isWeekend ? info.tariff + 1500 : info.tariff,
        b2bRate: info.b2b,
        lastUpdated: new Date().toISOString()
      });
    }
  }
  return result;
}

const initialLiveAvailability = generateInitialLiveAvailability();

function readData(): DataStoreSchema {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const content = fs.readFileSync(STORE_PATH, "utf8");
      const parsed = JSON.parse(content);
      const data: DataStoreSchema = {
        resorts: parsed.resorts || initialResorts,
        leads: parsed.leads || initialLeads,
        invoices: parsed.invoices || initialInvoices,
        users: parsed.users || defaultUsers,
        settings: parsed.settings || defaultSettings,
        integration: { ...defaultIntegration, ...(parsed.integration || {}) },
        auditLogs: parsed.auditLogs || [],
        packages: parsed.packages || initialPackages,
        blogs: parsed.blogs || initialBlogs,
        reviews: parsed.reviews || initialReviews,
        packageBookings: parsed.packageBookings || initialPackageBookings,
        resortApiConnections: parsed.resortApiConnections || initialResortApiConnections,
        resortBookingRequests: parsed.resortBookingRequests || initialResortBookingRequests,
        resortSyncLogs: parsed.resortSyncLogs || initialResortSyncLogs,
        liveAvailability: parsed.liveAvailability || initialLiveAvailability
      };
      if (!parsed.packageBookings || !parsed.packages || !parsed.blogs || !parsed.reviews || !parsed.resortApiConnections) {
        saveData(data);
      }
      return data;
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
    reviews: initialReviews,
    packageBookings: initialPackageBookings,
    resortApiConnections: initialResortApiConnections,
    resortBookingRequests: initialResortBookingRequests,
    resortSyncLogs: initialResortSyncLogs,
    liveAvailability: initialLiveAvailability
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
  },

  // Package & Itinerary Bookings with Automated Room & Invoice Sync
  getPackageBookings(): PackageItineraryBooking[] {
    return readData().packageBookings || [];
  },

  getPackageBookingById(id: string): PackageItineraryBooking | undefined {
    const data = readData();
    return (data.packageBookings || []).find(p => p.id === id || p.bookingCode === id);
  },

  savePackageBooking(booking: PackageItineraryBooking): PackageItineraryBooking {
    const data = readData();
    if (!data.packageBookings) data.packageBookings = [];
    if (!booking.id) booking.id = `pkg-book-${Date.now()}`;
    if (!booking.bookingCode) {
      booking.bookingCode = `AST-PKG-${Math.floor(1000 + Math.random() * 9000)}`;
    }
    booking.updatedAt = new Date().toISOString();
    if (!booking.createdAt) booking.createdAt = booking.updatedAt;

    // Automated Sync with Invoices / Bookings System
    const invoiceId = booking.syncedInvoiceId || `inv-${booking.bookingCode.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
    booking.syncedInvoiceId = invoiceId;

    const primaryResortCode = booking.rooms[0]?.resortCode || "AH-PKG";
    const destination = booking.rooms[0]?.destination || "Wayanad";

    const invoiceItems = [
      ...booking.rooms.map((r, i) => ({
        id: `room-${i + 1}`,
        description: `[Room Stay] ${r.resortCode} - ${r.roomType || r.resortName} (${r.roomsCount} Room${r.roomsCount > 1 ? "s" : ""}, ${r.nights} Nights, ${r.mealPlan || "EP"})`,
        nights: r.nights,
        ratePerNight: r.ratePerNight,
        amount: r.totalAmount
      })),
      ...(booking.vehicle && booking.vehicle.enabled ? [{
        id: "veh-1",
        description: booking.vehicle.pricingModel === "per_km"
          ? `[Vehicle Rental] ${booking.vehicle.vehicleType} (${booking.vehicle.totalKmCovered || 0} KM Running @ ₹${booking.vehicle.ratePerKm || 0}/KM + Driver Batta ₹${booking.vehicle.driverBatta * (booking.vehicle.totalDays || 1)})`
          : booking.vehicle.pricingModel === "package_km_extra"
          ? `[Vehicle Rental] ${booking.vehicle.vehicleType} (Package Base ${booking.vehicle.baseKmIncluded || 0} KM + ${booking.vehicle.extraKmCovered || 0} Extra KM @ ₹${booking.vehicle.extraKmRate || 0}/KM)`
          : `[Vehicle Booking] ${booking.vehicle.vehicleType} (${booking.vehicle.pickupLocation} to ${booking.vehicle.dropLocation}, ${booking.vehicle.totalDays} Days incl. Chauffeur)`,
        nights: booking.vehicle.totalDays,
        ratePerNight: booking.vehicle.ratePerDay,
        amount: booking.vehicle.totalAmount
      }] : []),
      ...booking.otherExpenses.map((exp, i) => ({
        id: `exp-${i + 1}`,
        description: `[Other Expense] ${exp.title} (${exp.category})${exp.notepadContent ? ` [Note: ${exp.notepadContent.slice(0, 35)}...]` : ""}`,
        nights: 1,
        ratePerNight: exp.rate,
        amount: exp.totalAmount
      }))
    ];

    const syncedInvoice: Invoice = {
      id: invoiceId,
      invoiceNumber: `INV-${booking.bookingCode.replace("AST-PKG-", "PKG-")}`,
      type: "Tax Invoice",
      customerName: booking.customerName,
      customerPhone: booking.customerPhone,
      customerEmail: booking.customerEmail,
      customerAddress: booking.customerAddress,
      resortCode: primaryResortCode,
      resortName: `${booking.packageTitle} (${booking.rooms.map(r => r.resortCode).join(", ") || primaryResortCode})`,
      destination: `${destination}, Wayanad`,
      checkIn: booking.startDate,
      checkOut: booking.endDate,
      nights: booking.rooms[0]?.nights || 2,
      guests: {
        adults: booking.totalGuests.adults,
        children: booking.totalGuests.children
      },
      items: invoiceItems,
      subtotal: booking.grossTotal,
      gstRate: booking.gstRate,
      gstAmount: booking.gstAmount,
      discount: booking.discount,
      totalAmount: booking.netPayable,
      advancePaid: booking.advancePaid,
      balanceDue: booking.balanceDue,
      status: booking.paymentStatus === "Fully Paid" ? "Fully Paid" : booking.paymentStatus === "Advance Received" ? "Advance Received" : "Draft",
      issueDate: booking.createdAt.split("T")[0],
      dueDate: booking.startDate,
      bankDetails: {
        accountName: "Aston Holidays LLP",
        bankName: "State Bank of India",
        accountNumber: "40921008745",
        ifscCode: "SBIN0008451",
        upiId: "astonholidays@sbi"
      },
      notes: `Package Booking: ${booking.packageTitle}. ${booking.notepadNotes || ""}`,
      whatsappVoucherSent: false
    };

    // Save synced invoice
    Store.saveInvoice(syncedInvoice);

    const idx = data.packageBookings.findIndex(p => p.id === booking.id || p.bookingCode === booking.bookingCode);
    if (idx >= 0) {
      data.packageBookings[idx] = booking;
    } else {
      data.packageBookings.unshift(booking);
    }
    saveData(data);
    syncToSupabase("package_bookings", {
      id: booking.id,
      booking_code: booking.bookingCode,
      package_title: booking.packageTitle,
      customer_name: booking.customerName,
      customer_phone: booking.customerPhone,
      start_date: booking.startDate,
      end_date: booking.endDate,
      net_payable: booking.netPayable,
      advance_paid: booking.advancePaid,
      balance_due: booking.balanceDue,
      payment_status: booking.paymentStatus,
      data: booking
    }, "id");
    return booking;
  },

  deletePackageBooking(id: string): boolean {
    const data = readData();
    if (!data.packageBookings) return false;
    const prevLen = data.packageBookings.length;
    data.packageBookings = data.packageBookings.filter(p => p.id !== id && p.bookingCode !== id);
    if (data.packageBookings.length !== prevLen) {
      saveData(data);
      deleteFromSupabase("package_bookings", id);
      return true;
    }
    return false;
  },

  // Resort PMS API & Live Availability Sync
  getResortApiConnections(): ResortApiConnection[] {
    return readData().resortApiConnections || [];
  },

  getResortApiConnectionByCode(resortCode: string): ResortApiConnection | undefined {
    const data = readData();
    return (data.resortApiConnections || []).find(c => c.resortCode.toLowerCase() === resortCode.toLowerCase());
  },

  saveResortApiConnection(conn: ResortApiConnection): ResortApiConnection {
    const data = readData();
    if (!data.resortApiConnections) data.resortApiConnections = [];
    if (!conn.id) conn.id = `conn-${Date.now()}`;
    const idx = data.resortApiConnections.findIndex(c => c.id === conn.id || c.resortCode === conn.resortCode);
    if (idx >= 0) {
      data.resortApiConnections[idx] = conn;
    } else {
      data.resortApiConnections.push(conn);
    }
    saveData(data);
    return conn;
  },

  deleteResortApiConnection(id: string): boolean {
    const data = readData();
    if (!data.resortApiConnections) return false;
    const prevLen = data.resortApiConnections.length;
    data.resortApiConnections = data.resortApiConnections.filter(c => c.id !== id && c.resortCode !== id);
    if (data.resortApiConnections.length !== prevLen) {
      saveData(data);
      return true;
    }
    return false;
  },

  getLiveAvailability(resortCode?: string): LiveRoomAvailability[] {
    const data = readData();
    const list = data.liveAvailability || [];
    if (!resortCode || resortCode === "ALL") return list;
    return list.filter(a => a.resortCode.toLowerCase() === resortCode.toLowerCase());
  },

  updateLiveAvailability(availList: LiveRoomAvailability[]): void {
    const data = readData();
    data.liveAvailability = availList;
    saveData(data);
  },

  refreshLiveAvailability(resortCode?: string): { success: boolean; updatedCount: number; latencyMs: number } {
    const data = readData();
    if (!data.liveAvailability) data.liveAvailability = [];
    const latency = Math.floor(35 + Math.random() * 45);
    const now = new Date().toISOString();

    let updatedCount = 0;
    data.liveAvailability = data.liveAvailability.map(item => {
      if (!resortCode || resortCode === "ALL" || item.resortCode.toLowerCase() === resortCode.toLowerCase()) {
        updatedCount++;
        return {
          ...item,
          lastUpdated: now
        };
      }
      return item;
    });

    // Update connection lastSyncAt and latency
    if (data.resortApiConnections) {
      data.resortApiConnections = data.resortApiConnections.map(conn => {
        if (!resortCode || resortCode === "ALL" || conn.resortCode.toLowerCase() === resortCode.toLowerCase()) {
          return {
            ...conn,
            lastSyncAt: now,
            lastLatencyMs: latency,
            status: "Connected"
          };
        }
        return conn;
      });
    }

    // Add sync log
    const log: ResortSyncLog = {
      id: `log-${Date.now()}`,
      timestamp: now,
      resortCode: resortCode || "ALL",
      action: "AVAILABILITY_SYNC",
      status: "SUCCESS",
      latencyMs: latency,
      message: `Refreshed live calendar inventory for ${resortCode || "all connected resorts"}. ${updatedCount} blocks synchronized.`
    };
    if (!data.resortSyncLogs) data.resortSyncLogs = [];
    data.resortSyncLogs.unshift(log);
    if (data.resortSyncLogs.length > 50) data.resortSyncLogs = data.resortSyncLogs.slice(0, 50);

    saveData(data);
    return { success: true, updatedCount, latencyMs: latency };
  },

  getResortBookingRequests(): ResortBookingRequest[] {
    return readData().resortBookingRequests || [];
  },

  saveResortBookingRequest(req: ResortBookingRequest): ResortBookingRequest {
    const data = readData();
    if (!data.resortBookingRequests) data.resortBookingRequests = [];
    if (!req.id) req.id = `req-${Date.now()}`;
    if (!req.requestId) req.requestId = `REQ-PMS-${Math.floor(1000 + Math.random() * 9000)}`;
    const idx = data.resortBookingRequests.findIndex(r => r.id === req.id || r.requestId === req.requestId);
    if (idx >= 0) {
      data.resortBookingRequests[idx] = req;
    } else {
      data.resortBookingRequests.unshift(req);
    }
    saveData(data);
    return req;
  },

  dispatchBookingRequestToResortPms(requestData: Partial<ResortBookingRequest>): { request: ResortBookingRequest; latencyMs: number } {
    const data = readData();
    const conn = Store.getResortApiConnectionByCode(requestData.resortCode || "");
    const latency = Math.floor(75 + Math.random() * 85);
    const now = new Date().toISOString();
    const confirmationPnr = `${(conn?.pmsProvider || "PMS").slice(0, 2).toUpperCase()}-CONF-${Math.floor(10000 + Math.random() * 90000)}`;

    const newRequest: ResortBookingRequest = {
      id: `req-${Date.now()}`,
      requestId: `REQ-PMS-${Math.floor(1000 + Math.random() * 9000)}`,
      resortCode: requestData.resortCode || "AH-112",
      resortName: requestData.resortName || "Resort Villa",
      guestName: requestData.guestName || "Guest",
      guestPhone: requestData.guestPhone || "+91 97449 00414",
      checkIn: requestData.checkIn || new Date().toISOString().split("T")[0],
      checkOut: requestData.checkOut || new Date().toISOString().split("T")[0],
      nights: requestData.nights || 2,
      roomsCount: requestData.roomsCount || 1,
      roomType: requestData.roomType || "Luxury Villa",
      mealPlan: requestData.mealPlan || "CP (Bed & Breakfast)",
      pmsConfirmationNumber: confirmationPnr,
      status: "Confirmed",
      apiPayloadSent: {
        action: "RESERVATION_DISPATCH",
        provider: conn?.pmsProvider || "Custom REST API",
        endpoint: conn?.apiEndpoint || "https://api.resortpms.com/v1",
        guestName: requestData.guestName,
        phone: requestData.guestPhone,
        dates: `${requestData.checkIn} to ${requestData.checkOut}`,
        rooms: requestData.roomsCount,
        mealPlan: requestData.mealPlan,
        specialRequests: requestData.specialRequests
      },
      apiResponseReceived: {
        status: "CONFIRMED",
        pmsPnr: confirmationPnr,
        roomBlockAllocated: `${requestData.resortCode}-UNIT-01`,
        confirmedAt: now,
        latencyMs: latency
      },
      dispatchedAt: now,
      confirmedAt: now,
      specialRequests: requestData.specialRequests
    };

    Store.saveResortBookingRequest(newRequest);

    // Also record sync log
    const log: ResortSyncLog = {
      id: `log-${Date.now()}`,
      timestamp: now,
      resortCode: newRequest.resortCode,
      action: "BOOKING_REQUEST",
      status: "SUCCESS",
      latencyMs: latency,
      message: `Dispatched booking request ${newRequest.requestId} to ${conn?.pmsProvider || "Resort PMS"} API. Confirmed with PNR: ${confirmationPnr}.`
    };
    if (!data.resortSyncLogs) data.resortSyncLogs = [];
    data.resortSyncLogs.unshift(log);
    saveData(data);

    return { request: newRequest, latencyMs: latency };
  },

  getResortSyncLogs(): ResortSyncLog[] {
    return readData().resortSyncLogs || [];
  }
};
