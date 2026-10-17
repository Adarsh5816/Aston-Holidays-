import { NextRequest, NextResponse } from "next/server";
import { Store } from "@/lib/store";

interface AiEnhanceRequest {
  code: string;
  name: string;
  destination: string;
  accommodationType: string;
  bedrooms: number;
  pricePerNight?: number;
  notes?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: AiEnhanceRequest = await req.json();
    const { code, name, destination, accommodationType, bedrooms, pricePerNight, notes } = body;

    const destClean = destination || "Wayanad";
    const typeClean = accommodationType || "Private Pool Villa";
    const rooms = bedrooms || 2;

    // Geographic intelligence base for Wayanad attractions based on destination
    let attractions = [
      { name: "Banasura Sagar Dam", distance: "≈07 km" },
      { name: "Karlad Lake & Adventure Turf", distance: "≈09 km" },
      { name: "Edakkal Prehistoric Rock Caves", distance: "≈16 km" },
      { name: "Pookode Lake & Rainforest Trail", distance: "≈21 km" },
      { name: "Chembra Peak Heart-Shaped Lake", distance: "≈26 km" }
    ];

    const dLower = destClean.toLowerCase();
    if (dLower.includes("bathery") || dLower.includes("moolankavu") || dLower.includes("ambalavayal")) {
      attractions = [
        { name: "Edakkal Prehistoric Rock Caves", distance: "≈04 km" },
        { name: "Wayanad Heritage Museum", distance: "≈05 km" },
        { name: "Sulthan Bathery Jain Heritage Temple", distance: "≈06 km" },
        { name: "Muthanga Wildlife Elephant Safari", distance: "≈12 km" },
        { name: "Karapuzha Dam & Adventure Park", distance: "≈14 km" }
      ];
    } else if (dLower.includes("vythiri") || dLower.includes("meppadi")) {
      attractions = [
        { name: "Pookode Freshwater Lake", distance: "≈05 km" },
        { name: "Lakkidi Rainforest View Point", distance: "≈07 km" },
        { name: "En Ooru Tribal Heritage Village", distance: "≈08 km" },
        { name: "Chembra Peak Trek & Lake", distance: "≈15 km" },
        { name: "Soochipara Cascading Waterfalls", distance: "≈19 km" }
      ];
    } else if (dLower.includes("mananthavady") || dLower.includes("koyileri") || dLower.includes("panamaram")) {
      attractions = [
        { name: "Kuruva Evergreen Island & Rafting", distance: "≈09 km" },
        { name: "Thirunelli Maha Vishnu Temple", distance: "≈18 km" },
        { name: "Brahmagiri Wildlife Sanctuary", distance: "≈21 km" },
        { name: "Pazhassi Raja Tomb & Museum", distance: "≈06 km" },
        { name: "Banasura Sagar Dam", distance: "≈17 km" }
      ];
    }

    // AI Luxury Brochure Copy Generation
    let overview = "";
    if (typeClean.includes("Pool")) {
      overview = `Perched amidst the tranquil, mist-laden landscapes of ${destClean}, ${name} is an exclusive ${rooms}-bedroom sanctuary designed for ultimate seclusion and luxury. Featuring a private temperature-controlled infinity pool overlooking panoramic hills, hand-crafted teak woodwork, and open-air verandas, this property seamlessly fuses ancient Wayanadan architectural elegance with premier modern comforts.`;
    } else if (typeClean.includes("Tree House")) {
      overview = `Suspended gracefully within the lush rainforest canopies of ${destClean}, this authentic treehouse retreat offers an extraordinary elevated perspective of Wayanad's wild beauty. Wake up to the melodies of tropical birds, morning mountain mist, and organic cardamom aromas, all while enjoying modern en-suite amenities and bespoke estate hospitality.`;
    } else {
      overview = `Set amidst the whispering coffee and tea plantations of ${destClean}, ${name} is a curated ${rooms}-bedroom haven crafted for discerning families and groups. Unwind amidst sweeping valley vistas, private courtyard lawns, and the soothing sounds of pristine nature, complete with signature Aston Holidays hospitality.`;
    }

    if (notes && notes.length > 5) {
      overview += ` Special Highlight: ${notes}.`;
    }

    const specialities = [
      `Panoramic ${destClean} valley and mountain sunrise views`,
      typeClean.includes("Pool") ? "Total seclusion with exclusive private swimming pool" : "Authentic eco-luxury amidst rainforest foliage",
      "Near historical Wayanad heritage footprint landmarks",
      "Private lawn with stargazing deck and campfire setup",
      "Traditional Kerala Malabar cuisine on demand by private chef"
    ];

    const amenities = [
      typeClean.includes("Pool") ? "Private Infinity Swimming Pool" : "Resort Swimming Pool & Sun Deck",
      "High-Speed Fiber WiFi Across Villa",
      "24/7 Hot Water & Uninterrupted Power Backup",
      "Air-Conditioned Master Bedrooms with Hill Views",
      "Campfire with Acoustic Bluetooth Speaker Setup",
      "Daily Housekeeping & Dedicated Villa Caretaker",
      "Indoor Board Games & Children Play Turf"
    ];

    const inclusions = [
      `Exclusive access to entire ${rooms}BHK property`,
      typeClean.includes("Pool") ? "Private pool access (unlimited hours)" : "Nature estate trail with local naturalist",
      "Welcome plantation spiced tea & refreshments on arrival",
      "Complimentary high-speed WiFi and private parking",
      "Complimentary travel voucher & route map guide"
    ];

    const exclusions = [
      "Wildlife forest sanctuary jeep safari charges",
      "Chef barbecue & candle light dinner setups (Available on request)",
      "Sightseeing vehicle transfers"
    ];

    return NextResponse.json({
      success: true,
      enhanced: {
        code,
        name,
        destination: destClean,
        overview,
        specialities,
        amenities,
        nearbyAttractions: attractions,
        inclusions,
        exclusions
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
