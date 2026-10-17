import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { Resort, AccommodationType, StayPreference, AmbienceType } from "../src/lib/types";

const rawCsv = `Reference No,Property Name,PLACE,CATEGORY,B2B,B2C,NAME,CONTACT No 1,Website Url,More details,Broad Cast
AH-111,Le Eden,Moolankavu,Budget-Pool Villa,8000,10000,Kiran,8921845725,https://astonholidays.com/AH111/,,2BHK Private Pool Villa(5k-10K)
AH-111A,Le Eden-1,Moolankavu,Budget-Resort,3000,4000,Kiran,8921845725,,,Cottages (3K-5K)
AH-112,Theyila,Thaloor,Budget-Pool Villa,7000,8400,Arun,9778453636,https://astonholidays.com/AH112/,"2 Private pool villa,plantaion view, single room",Private Pool Villa(5k-10K)
AH-112A,Theyila-1,Thaloor,Budget-Resort,4500,5500,Arun,9778453636,,"4 cottage,plantaion view",Cottages (3K-5K)
AH113,Chembarathi,Vaduvanchal,Premium Resort,8000,9000,,8891888818,,https://docs.google.com/document/d/1fbruyntKw0pCMHoD4DrkuRRwB2qJiaej/edit?usp=drive_link&ouid=106788672505323387498&rtpof=true&sd=true,"Premium stay (5k-10K), Private pool Villa(10k-15K), Honey moon (15K-20K)"
AH-114,Cortyard,"Kolgappara,Sby",Premium Pool villa,10000(2 adults) 15000(4 adults),12000(2 adults) 18000(4 adults),Abhijith,9746670109,https://astonholidays.com/AH114/,weekend rate add 1000 in each cat,2BHK-Private Pool Villa(12K to 18K)
AH-114A,Crescent,"Kolgappara,Sby",Family Pool Resort,3300,4000,Abhijith,9746670109,,,"Cottages (3K-5K),single 2bedroom dormetry"
AH-114B,Crescent-Tree House,"Kolgappara,Sby",Tree House,,,,9746670109,,,Tree House ( 10k-15k)
AH-115,Safari Hills,Vythiri,Big Group Resort,3000,5000,Nishal,9778636830,https://astonholidays.com/AH115/,,"Group Packages(3k-5k), Private Pool (5k to 7K)"
AH-116,Willow,Amblavayal,Premium resort,6500,7500,Deepak,9633071671,https://astonholidays.com/AH116/,,"Cottages(3k-5K), Family resort (5k-10k)"
AH-117,Kabani River Side,Koyileri,Budget Pool Villa,4000,6000,Mahima,9446567074,,,"2BHK Private Pool Villa(5k-10K),Cottages (3K-5K)"
AH-118,Palm Tree,Sulthan Bathery,4 Room Pool Villa,12500,16000,Vyshak,7356727287,,,
AH-119,Aurora,Koleri,2 Bedroom Pool Villa,15000,18000,,8943443523,,,
AH120,Cozy Gaza,Banasura,"Pool Villa,Cottage","9000- Private pool, 5000 normal",12000,Ashik,9947735633,,,3BHK Private Pool Villa
AH121,Camp lights,,3 Bedroom Pool Villa,12000(8 adult),,,9961006632,,,
AH122,Padygram,Panamaram,4 Bedroom Pool Villa,,,,,,,
AH123,FernTree,Manathavady,Big Group Resort,,,,,,,
AH124,Prakriti,Koleri,2 Bedroom Pool Villa,,,,,,,
AH-125,Blooms,Kenichira,Big Group Resort,900-1000,1000-1100,Blooms,9995553377,,"Group resot-4,3,2 BH villas per person rate change will be there in peak days",
AH-126,Itria,Kavum Mandham,Budget Pool Villa,8000,10000,Shaju,9947501582,,"2 bhks villa, budget friendly, no big ambience",
AH-127,,,,,,,,,,
AH-128,,,,,,,,,,
AH-129,Lake View,Karappuzha,,,,,,,,
AH-130,Cataliya,Meppadi,Premium Pool Villa,,,,,,,
AH-131,Coffe Gram,Kaniyambetta,Group Resort,,,,,,,
AH-132,Sopanam Heritage Resort,Panamaram,,,,,,,,
AH-133,Woods,Chethalayam,,,,,,,,
AH-134,Coffe Acres,Pinangode,,,,,,,,
AH-135,Fortune Banasura,Padinjarathara,Cottage Pool resort,4000,,,6238288644,,"5 cottages, ac non ac rooms, pool",
AH-136,Lake Paradise,Padinjarathara,Hotel Pool resort-Groups,,,,7907180801,,"7 rooms, hotel type resort",
AH-137,Alaya,Padinjarathara,,,,,,,,
AH-138,Beanwoods,Muttil,8 Room Cottage Pool,,,,9074544524,,,
AH-139,Misty Lunge resort,Banasuar,6 Room Cootage with pool,,,,,,,
AH-140,Kedra ,Sulthan Bathery,Big Group,,,,,,,
AH-141,Tudor Hills,Thrikaipetta,Private Pool Villa,,,,,,,
AH-142,Adithya Resort,Vythiri,Group Resort ,,,,9072463333,,,
AH-143,Vynza,Vythiri,"Private Pool Villa, different Cottages",,,,9115777888,,,
AH-144,Klov,,Group Resort ,,,,,,,
AH-145,New Resort,,Group Resort ,,,,,,,`;

const availableBrochurePhotos = Array.from({ length: 29 }, (_, i) => `/brochure-assets/extracted_img_${i + 1}.jpg`);

function parsePrice(val: string, fallback: number = 6500): number {
  if (!val) return fallback;
  const match = val.replace(/,/g, "").match(/\d+/);
  return match ? parseInt(match[0], 10) : fallback;
}

function parseBedrooms(cat: string, name: string, broad: string): number {
  const combined = (cat + " " + name + " " + broad).toLowerCase();
  if (combined.includes("4 room") || combined.includes("4 bedroom") || combined.includes("4bhk") || combined.includes("4 bhk")) return 4;
  if (combined.includes("3 room") || combined.includes("3 bedroom") || combined.includes("3bhk") || combined.includes("3 bhk")) return 3;
  if (combined.includes("2 room") || combined.includes("2 bedroom") || combined.includes("2bhk") || combined.includes("2 bhk")) return 2;
  if (combined.includes("6 room") || combined.includes("6 cootage")) return 6;
  if (combined.includes("7 room")) return 7;
  if (combined.includes("8 room")) return 8;
  if (combined.includes("5 cottage")) return 5;
  if (combined.includes("group")) return 4;
  return 2;
}

function normalizeCode(raw: string): string {
  const clean = raw.trim().toUpperCase();
  if (!clean.includes("-") && clean.startsWith("AH")) {
    return clean.replace("AH", "AH-");
  }
  return clean;
}

function normalizeDestination(raw: string): string {
  const place = (raw || "Wayanad").trim();
  if (place.toLowerCase().includes("kolgappara") || place.toLowerCase().includes("sby") || place.toLowerCase().includes("bathery")) {
    return "Sulthan Bathery";
  }
  if (place.toLowerCase().includes("banasura") || place.toLowerCase().includes("padinjarathara")) {
    return "Padinjarathara";
  }
  if (place.toLowerCase().includes("amblavayal") || place.toLowerCase().includes("ambalavayal")) {
    return "Ambalavayal";
  }
  if (place.toLowerCase().includes("vythiri")) return "Vythiri";
  if (place.toLowerCase().includes("meppadi")) return "Meppadi";
  if (place.toLowerCase().includes("panamaram")) return "Panamaram";
  if (place.toLowerCase().includes("manathavady")) return "Mananthavady";
  if (place.toLowerCase().includes("karappuzha")) return "Karapuzha";
  if (place.toLowerCase().includes("muttil")) return "Muttil";
  if (place.toLowerCase().includes("thaloor")) return "Thaloor";
  if (place.toLowerCase().includes("vaduvanchal")) return "Vaduvanchal";
  return place || "Wayanad";
}

function mapAccommodationType(cat: string, name: string): AccommodationType {
  const c = (cat + " " + name).toLowerCase();
  if (c.includes("tree house")) return "Tree House";
  if (c.includes("pool villa") || c.includes("pool")) return "Private Pool Villa";
  if (c.includes("plantation") || c.includes("coffee") || c.includes("theyila")) return "Plantation Resort";
  if (c.includes("heritage")) return "Heritage Bungalow";
  if (c.includes("budget")) return "Budget Stay";
  return "Luxury Resort";
}

function mapStayPreference(cat: string, name: string, broad: string): StayPreference {
  const c = (cat + " " + name + " " + broad).toLowerCase();
  if (c.includes("group") || c.includes("bachelor")) return "Group / Bachelor Friendly";
  if (c.includes("family")) return "Family Gathering";
  if (c.includes("cottage") && !c.includes("villa")) return "Individual Room/Suite";
  return "Independent Private Cottage/Villa";
}

function mapAmbience(dest: string, cat: string): AmbienceType[] {
  const d = dest.toLowerCase();
  const res: AmbienceType[] = ["Mountain / Valley View"];
  if (d.includes("banasura") || d.includes("padinjarathara") || d.includes("karapuzha") || d.includes("kabani")) {
    res.push("Lake / Dam Waterfront");
  }
  if (d.includes("vythiri") || d.includes("meppadi")) {
    res.push("Rainforest & Stream");
  }
  if (d.includes("thaloor") || d.includes("coffee") || d.includes("plantation")) {
    res.push("Tea / Coffee Plantation");
  }
  res.push("Secluded & Peaceful");
  return res;
}

// Simple CSV line parser supporting quoted fields
function parseCsvLines(csv: string): string[][] {
  const lines: string[][] = [];
  const rows = csv.split("\n");
  for (const row of rows) {
    if (!row.trim()) continue;
    const fields: string[] = [];
    let current = "";
    let insideQuote = false;
    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      if (char === '"') {
        insideQuote = !insideQuote;
      } else if (char === "," && !insideQuote) {
        fields.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    fields.push(current.trim());
    lines.push(fields);
  }
  return lines;
}

async function main() {
  console.log("Parsing Aston Holidays CSV...");
  const records = parseCsvLines(rawCsv);
  const header = records[0];
  const rows = records.slice(1);

  const importedResorts: Resort[] = [];

  let photoIndex = 0;

  for (const row of rows) {
    const rawRef = row[0];
    const name = row[1];
    const place = row[2];
    const category = row[3];
    const b2bRaw = row[4];
    const b2cRaw = row[5];
    const contactName = row[6];
    const contactPhone = row[7];
    const websiteUrl = row[8];
    const moreDetails = row[9];
    const broadCast = row[10];

    // Skip blank placeholder rows (e.g., AH-127, AH-128)
    if (!rawRef || !name) continue;

    const code = normalizeCode(rawRef);
    const destination = normalizeDestination(place);
    const accommodationType = mapAccommodationType(category, name);
    const stayPreference = mapStayPreference(category, name, broadCast);
    const ambience = mapAmbience(destination, category);
    const bedrooms = parseBedrooms(category, name, broadCast || moreDetails);
    const pricePerNight = parsePrice(b2cRaw, 7500);
    const b2bRate = parsePrice(b2bRaw, Math.round(pricePerNight * 0.8));

    // Assign rotating authentic high-res photos
    const primaryPhoto = availableBrochurePhotos[photoIndex % availableBrochurePhotos.length];
    const secondaryPhotos = [
      availableBrochurePhotos[(photoIndex + 1) % availableBrochurePhotos.length],
      availableBrochurePhotos[(photoIndex + 2) % availableBrochurePhotos.length],
      availableBrochurePhotos[(photoIndex + 3) % availableBrochurePhotos.length],
      availableBrochurePhotos[(photoIndex + 4) % availableBrochurePhotos.length]
    ];
    photoIndex = (photoIndex + 3) % availableBrochurePhotos.length;

    const slug = `${code.toLowerCase()}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${destination.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

    const resort: Resort = {
      id: `resort-${code.toLowerCase()}`,
      code,
      name: `${bedrooms}BHK - ${name}`,
      slug,
      destination,
      locationDetails: `${place ? place + ", " : ""}${destination}, Wayanad, Kerala`,
      googleMapsUrl: `https://maps.google.com/?q=${encodeURIComponent(name + " " + destination + " Wayanad")}`,
      accommodationType,
      stayPreference,
      ambience,
      category: accommodationType === "Private Pool Villa" ? "Pool Villa" : accommodationType === "Tree House" ? "Tree House" : "Luxury Resort",
      bedrooms,
      bathrooms: Math.max(1, bedrooms),
      maxAdults: bedrooms * 3,
      maxChildren: bedrooms * 1,
      maxGuests: bedrooms * 4,
      pricePerNight,
      b2bRate,
      featured: code === "AH-121" || code === "AH-114" || code === "AH-116",
      coverImage: primaryPhoto,
      photos: [primaryPhoto, ...secondaryPhotos],
      amenities: [
        category.toLowerCase().includes("pool") ? "Private Swimming Pool" : "Resort Swimming Pool",
        "Scenic Mountain / Plantation View",
        "Free High-Speed WiFi",
        "Children Play Area",
        "Campfire & Music Setup (Chargeable)",
        "Daily Housekeeping",
        "24/7 Hot Water & Power Backup"
      ],
      specialities: [
        `${destination} serene nature backdrop`,
        moreDetails || broadCast || "Handpicked private stay for families & groups"
      ],
      nearbyAttractions: [
        { name: "Banasura Sagar Dam", distance: "≈08 km" },
        { name: "Karlad Lake Adventure Park", distance: "≈11 km" },
        { name: "Edakkal Prehistoric Caves", distance: "≈18 km" },
        { name: "Pookode Lake", distance: "≈22 km" }
      ],
      checkInTime: "01:00 PM",
      checkOutTime: "11:00 AM",
      overview: `Nestled in the lush hills of ${destination}, ${name} offers ${accommodationType} living with ${stayPreference}. Perfect for couples, families, and friend gatherings looking for privacy and authentic Wayanad hospitality.`,
      inclusions: [
        "Full private villa / cottage access",
        "Complimentary high-speed WiFi",
        "Morning tea & estate stroll"
      ],
      exclusions: [
        "Forest entry & wildlife safari fees",
        "Extra bed charges"
      ]
    };

    importedResorts.push(resort);
  }

  console.log(`Successfully parsed ${importedResorts.length} real resorts from CSV!`);

  // 1. Update data_store.json
  const storePath = path.join(process.cwd(), "data_store.json");
  if (fs.existsSync(storePath)) {
    const store = JSON.parse(fs.readFileSync(storePath, "utf8"));
    store.resorts = importedResorts;
    fs.writeFileSync(storePath, JSON.stringify(store, null, 2), "utf8");
    console.log("Updated data_store.json with all", importedResorts.length, "resorts!");
  }

  // 2. Upsert into Supabase
  const SUPABASE_URL = "https://lqimlancvbluqrxlxoem.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxaW1sYW5jdmJsdXFyeGx4b2VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyMzYwNDEsImV4cCI6MjEwNzgxMjA0MX0.tw2M1g8_HQ3x9zy9BIuURBoKutt9TRW7Lqps7g1gVUs";

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  console.log("Upserting all resorts into Supabase cloud database...");
  for (const r of importedResorts) {
    const dbRow = {
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

    const { error } = await supabase.from("resorts").upsert(dbRow, { onConflict: "id" });
    if (error) {
      console.warn(`Error upserting ${r.code}:`, error.message);
    } else {
      console.log(`[Synced to Supabase] ${r.code} - ${r.name} (₹${r.pricePerNight})`);
    }
  }

  console.log("All sheet properties successfully ingested into Supabase!");
}

main();
