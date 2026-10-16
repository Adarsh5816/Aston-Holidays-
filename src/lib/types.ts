export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "staff";
  password?: string;
  avatar?: string;
}

export interface NearbyAttraction {
  name: string;
  distance: string;
}

export type AccommodationType =
  | "Private Pool Villa"
  | "Tree House"
  | "Luxury Resort"
  | "Plantation Resort"
  | "Budget Stay"
  | "Heritage Bungalow"
  | "Glamping / Tent"
  | "Houseboat";

export type StayPreference =
  | "Independent Private Cottage/Villa"
  | "Individual Room/Suite"
  | "Group / Bachelor Friendly"
  | "Family Gathering";

export type AmbienceType =
  | "Mountain / Valley View"
  | "Lake / Dam Waterfront"
  | "Rainforest & Stream"
  | "Tea / Coffee Plantation"
  | "Romantic / Honeymoon"
  | "Secluded & Peaceful"
  | "Adventure & Hilltop";

export interface Resort {
  id: string;
  code: string; // e.g., "AH-121"
  name: string; // e.g., "3BHK-Private Pool Villa"
  slug: string;
  destination: string; // e.g., "Padinjarathara"
  locationDetails: string;
  googleMapsUrl?: string;
  
  // 9 Core Dimensions:
  accommodationType: AccommodationType;
  stayPreference: StayPreference;
  ambience: AmbienceType[];
  bedrooms: number; // Number of rooms
  bathrooms: number;
  maxAdults: number;
  maxChildren: number;
  maxGuests: number;
  pricePerNight: number;
  b2bRate: number;
  
  // Legacy / convenience category
  category: "Pool Villa" | "Tree House" | "Luxury Resort" | "Budget Resort" | "Honeymoon Suite" | "Plantation Stay";

  featured: boolean;
  coverImage: string;
  photos: string[];
  amenities: string[];
  specialities: string[];
  nearbyAttractions: NearbyAttraction[];
  checkInTime: string;
  checkOutTime: string;
  overview: string;
  inclusions: string[];
  exclusions: string[];
}

export interface SiteSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroBannerImage: string;
  announcementText: string;
  heritageStoryTitle: string;
  heritageStoryText: string;
  heritageImage: string;
  companyName: string;
  officeAddress: string;
  phone: string;
  email: string;
  whatsappNumber: string;
  whatsappWebhookUrl?: string;
}

export interface Destination {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  image: string;
  resortCount: number;
}

// Complete 9-Dimension Filter Parameters
export interface FilterParams {
  accommodationType?: string; // 1. Accommodation Type
  category?: string;          // Legacy alias
  stayPreference?: string;    // 2. Room / Cottage / Group Preference
  location?: string;          // 3. Location Preference (Destination)
  destination?: string;       // Alias for location
  budgetMin?: number;         // 4. Budget Min
  budgetMax?: number;         // 4. Budget Max
  ambience?: string;          // 5. Ambience
  adults?: number;            // 6. Adults
  children?: number;          // 7. Children
  rooms?: number;             // 8. Rooms (bedrooms)
  bedrooms?: number;          // Alias for rooms
  guests?: number;            // Total guests
  checkIn?: string;           // 9. Travel Dates (Check-In)
  checkOut?: string;          // 9. Travel Dates (Check-Out)
  query?: string;
}

export interface Lead {
  id: string;
  leadNumber: string;
  customerName: string;
  phone: string;
  email?: string;
  source: "WhatsApp" | "Website" | "Direct Phone" | "Walk-in";
  destination?: string;
  accommodationType?: string;
  stayPreference?: string;
  ambience?: string;
  checkIn?: string;
  checkOut?: string;
  roomsCount?: number;
  adultsCount?: number;
  childrenCount?: number;
  guestsCount?: number;
  budget?: number;
  status: "New" | "Brochure Sent" | "Quoted" | "Booked" | "Closed";
  requestedResortCode?: string;
  createdAt: string;
  notes?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  nights: number;
  ratePerNight: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  type: "Proforma Invoice" | "Tax Invoice" | "Stay Voucher";
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerAddress?: string;
  resortCode: string;
  resortName: string;
  destination: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: {
    adults: number;
    children: number;
  };
  items: InvoiceItem[];
  subtotal: number;
  gstRate: number;
  gstAmount: number;
  discount: number;
  totalAmount: number;
  advancePaid: number;
  balanceDue: number;
  status: "Draft" | "Sent" | "Advance Received" | "Fully Paid" | "Cancelled";
  issueDate: string;
  dueDate: string;
  bankDetails?: {
    accountName: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    upiId: string;
  };
  notes?: string;
  whatsappVoucherSent?: boolean;
  whatsappVoucherSentAt?: string;
}

// 9-Dimension Request from WhatsApp API App
export interface RecommendationRequest {
  customerName?: string;
  customerPhone?: string;
  
  // 1. Accommodation Type
  accommodationType?: string;
  stayType?: string; // Alias
  
  // 2. Room/Cottage/Group Preference
  stayPreference?: string;
  
  // 3. Location Preference
  location?: string;
  destination?: string;
  
  // 4. Budget
  budgetMin?: number;
  budgetMax?: number;
  
  // 5. Ambience
  ambience?: string;
  
  // 6. Adults
  adults?: number;
  
  // 7. Children
  children?: number;
  
  // 8. Rooms
  rooms?: number;
  bedrooms?: number;
  
  // 9. Travel Dates
  checkIn?: string;
  checkOut?: string;
  nights?: number;

  // Diagnostic health probe
  _diagnosticPing?: boolean;
}

export interface RecommendationResponse {
  success: boolean;
  matchedCount: number;
  filtersReceived: {
    accommodationType?: string;
    stayPreference?: string;
    location?: string;
    budgetMax?: number;
    ambience?: string;
    adults?: number;
    children?: number;
    rooms?: number;
    travelDates?: string;
  };
  resorts: {
    code: string;
    name: string;
    destination: string;
    location?: string; // WhatsApp App Alias
    locationDetails: string;
    accommodationType: string;
    stayPreference: string;
    ambience: string[];
    bedrooms: number;
    maxAdults: number;
    maxChildren: number;
    maxGuests: number;
    pricePerNight: number;
    price?: number; // WhatsApp App Alias
    coverPhoto: string;
    photos: string[];
    amenities: string[];
    specialities: string[];
    nearbyAttractions: NearbyAttraction[];
    webBrochureUrl: string;
    directPdfUrl: string;
    googleMapsUrl?: string;
  }[];
  whatsAppMessage: string;
  instructionsForBot: string;
}

export interface ApiAuditLog {
  id: string;
  timestamp: string;
  type: "inbound_recommend" | "outbound_voucher" | "diagnostic_ping";
  method: string;
  endpoint: string;
  clientIp?: string;
  statusCode: number;
  durationMs: number;
  status: "success" | "blocked" | "rate_limited" | "error";
  summary: string;
  payloadSummary?: string;
}

export interface IntegrationConfig {
  // Outbound Stream 2 (Aston -> WhatsApp App)
  whatsappAppBaseUrl: string;
  whatsappWebhookPath: string;
  outboundApiKey: string;
  outboundSecret: string;
  
  // Inbound Stream 1 & 3 (WhatsApp App -> Aston)
  inboundApiKey: string;
  inboundSecret: string;
  securityMode: "strict" | "permissive";
  rateLimitPerMinute: number;
  allowedIps: string[];
  
  // Customization & defaults
  botWelcomeHeader: string;
  botCallToAction: string;
  defaultMinPrice: number;
  defaultMaxPrice: number;
  
  // Health & Diagnostic tracking
  lastDiagnosticPingAt?: string;
  lastDiagnosticLatencyMs?: number;
  lastOutboundSyncAt?: string;
  lastOutboundStatus?: "success" | "failed";
}

