import { createClient } from "@supabase/supabase-js";
import { initialResorts } from "../src/data/resorts";
import fs from "fs";
import path from "path";

const SUPABASE_URL = "https://lqimlancvbluqrxlxoem.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxaW1sYW5jdmJsdXFyeGx4b2VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyMzYwNDEsImV4cCI6MjEwNzgxMjA0MX0.tw2M1g8_HQ3x9zy9BIuURBoKutt9TRW7Lqps7g1gVUs";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function seed() {
  console.log("Checking if Supabase tables exist...");

  // Check resorts table
  const { error: testErr } = await supabase.from("resorts").select("id").limit(1);
  if (testErr) {
    console.error("Table check failed:", testErr.message);
    console.log("\n--> PLEASE RUN `supabase_schema.sql` in your Supabase SQL Editor first:\nhttps://supabase.com/dashboard/project/lqimlancvbluqrxlxoem/sql/new\n");
    return;
  }

  console.log("Seeding resorts into Supabase...");
  for (const r of initialResorts) {
    const payload = {
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

    const { error } = await supabase.from("resorts").upsert(payload, { onConflict: "id" });
    if (error) {
      console.error(`Failed to seed resort ${r.code}:`, error.message);
    } else {
      console.log(`Seeded resort: [${r.code}] ${r.name}`);
    }
  }

  // Seed default site settings
  console.log("Seeding site settings...");
  await supabase.from("site_settings").upsert({
    id: "global",
    hero_title: "Romantic Getaways, Private Pool Villas & Historic Wayanad Escapes",
    hero_subtitle: "Explore handpicked stays across Padinjarathara, Vythiri, and Meppadi. Get instant 12-page brochures with high-res photos and transparent rates sent directly to your WhatsApp.",
    hero_banner_image: "/brand/wayanad-backcover.jpg",
    announcement_text: "Historic Footprints of Wayanad & Curated Escapes",
    heritage_story_title: "Where Ancient Footprints Meet Unmatched Hospitality",
    heritage_story_text: "Wayanad’s soul is etched into the ancient stone engravings of the Edakkal Caves, dating back over 6,000 years to the Neolithic era. Aston Holidays’ unique brand symbol and document footprint celebrate this rich history.",
    heritage_image: "/brand/edakkal-footprint.jpg",
    company_name: "Aston Holidays",
    office_address: "Aston Holidays, Kolagappara, Beenachi, Sulthan Bathery, Wayanad - 673592, Kerala, India",
    phone: "+91 97449 00414",
    email: "info@astonholidays.com",
    whatsapp_number: "+91 97449 00414",
    whatsapp_webhook_url: "http://localhost:3001/api/send-message"
  }, { onConflict: "id" });

  console.log("Seeding integration config...");
  await supabase.from("integration_config").upsert({
    id: "global",
    whatsapp_app_base_url: "http://localhost:3001",
    whatsapp_webhook_path: "/api/send-message",
    outbound_api_key: "aston_sec_live_9f7a8b3e2c1d",
    outbound_secret: "aston_webhook_secret_99812",
    inbound_api_key: "aston_sec_live_9f7a8b3e2c1d",
    inbound_secret: "aston_webhook_secret_99812",
    security_mode: "strict",
    rate_limit_per_minute: 120,
    bot_welcome_header: "🌴 *ASTON HOLIDAYS - MATCHING STAYS IN WAYANAD* 🌴",
    bot_call_to_action: "👉 *Which resort would you like to book?*\nReply with the number (e.g. *1*) or resort code (e.g. *AH-121*) to reserve or get an instant quote!",
    default_min_price: 2000,
    default_max_price: 50000
  }, { onConflict: "id" });

  console.log("Supabase database seeding completed successfully!");
}

seed();
