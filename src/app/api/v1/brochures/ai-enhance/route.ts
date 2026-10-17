import { NextRequest, NextResponse } from "next/server";

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

    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || "gemini-3.8-flash";

    // 1. Attempt Gemini 3.8 Flash Ultra-HD generation if key is configured
    if (apiKey) {
      try {
        const prompt = `You are an elite luxury travel curator for Aston Holidays, crafting a bespoke high-end holiday brochure for a luxury resort in Wayanad, Kerala.
Resort Code: ${code}
Resort Name: ${name}
Location / Region: ${destClean}
Accommodation Type: ${typeClean}
Bedrooms: ${rooms}
Notes / Features: ${notes || "None"}

Generate strict JSON with the following exact keys:
- "overview": 2-3 poetic, evocative, ultra-luxury sentences highlighting the secluded setting, misty mountain landscapes, architectural charm, and signature hospitality.
- "specialities": Array of 5 unique property highlights (e.g., infinity pool overlooking valleys, private tea trails, chef barbecue, stargazing deck).
- "amenities": Array of 6 to 7 premier amenities.
- "nearbyAttractions": Array of 5 authentic Wayanad sightseeing attractions with realistic driving distances from ${destClean} (each object must have "name" and "distance").
- "inclusions": Array of 4 to 5 stay inclusions (e.g. welcome plantation high tea, exclusive villa access).
- "exclusions": Array of 3 exclusions (e.g. wildlife safari permits, airport transfers).`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.7
              }
            })
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(rawText);
            return NextResponse.json({
              success: true,
              source: "gemini-3.8-flash",
              enhanced: {
                code,
                name,
                destination: destClean,
                overview: parsed.overview || "",
                specialities: parsed.specialities || [],
                amenities: parsed.amenities || [],
                nearbyAttractions: parsed.nearbyAttractions || [],
                inclusions: parsed.inclusions || [],
                exclusions: parsed.exclusions || []
              }
            });
          }
        }
      } catch (geminiErr) {
        console.warn("Gemini call encountered error, falling back to geographic engine:", geminiErr);
      }
    }

    // 2. Fallback to Wayanad Geographic Intelligence Engine
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
      source: "geographic-engine",
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
