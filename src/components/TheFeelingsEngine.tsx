"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Compass, ArrowRight, Heart, Trees, Waves, Moon, Sun, ShieldCheck, MapPin } from "lucide-react";
import { Resort } from "@/lib/types";

interface TheFeelingsEngineProps {
  resorts: Resort[];
  onOpenEnquiry: (feelingName?: string) => void;
}

export default function TheFeelingsEngine({ resorts, onOpenEnquiry }: TheFeelingsEngineProps) {
  const [selectedFeeling, setSelectedFeeling] = useState<string>("romantic");
  const [selectedSeason, setSelectedSeason] = useState<string>("winter");

  const feelingsData = [
    {
      id: "romantic",
      title: "Romantic Awe & Seclusion",
      kicker: "For Honeymoons & Anniversaries",
      quote: "Soft candle lanterns, rose petal pools, and crisp morning mist rising over Banasura Dam.",
      icon: Heart,
      accent: "from-rose-950/80 to-stone-900",
      filterCodes: ["AH-121", "AH-112", "AH-115"],
      tag: "Jacuzzi & Private Pools"
    },
    {
      id: "stillness",
      title: "Profound Stillness",
      kicker: "Pure Silence & Reconnection",
      quote: "No honking horns, no tourist crowds. Just emerald water ripples and the distant call of Malabar hornbills.",
      icon: Waves,
      accent: "from-emerald-950/80 to-stone-900",
      filterCodes: ["AH-121", "AH-111", "AH-114"],
      tag: "Lakeside & Mountain Solitude"
    },
    {
      id: "wild-wonder",
      title: "Wild Wonder & Canopy Adventure",
      kicker: "Rainforests & Untouched Peaks",
      quote: "Sleep among ninety-foot tree canopies with floor-to-ceiling glass looking out into primeval Wayanad wilderness.",
      icon: Trees,
      accent: "from-[#112411] to-stone-900",
      filterCodes: ["AH-113", "AH-116", "AH-118"],
      tag: "Glass Canopy Treehouses"
    },
    {
      id: "heritage",
      title: "Heritage & Slow Living",
      kicker: "Coffee & Spice Estates",
      quote: "Sip estate-roasted Arabica coffee on wide veranda porches under teak-wood ceilings, steps from Neolithic Edakkal caves.",
      icon: Sun,
      accent: "from-amber-950/80 to-stone-900",
      filterCodes: ["AH-117", "AH-119", "AH-120"],
      tag: "Plantation Bungalows"
    },
    {
      id: "family",
      title: "Family Togetherness",
      kicker: "Space & Multi-Generational Warmth",
      quote: "Spacious private multi-room villas with your own infinity pool, private chef catering, and campfire setups under stars.",
      icon: Compass,
      accent: "from-emerald-950 to-stone-900",
      filterCodes: ["AH-121", "AH-112", "AH-118"],
      tag: "3BHK & 4BHK Private Estates"
    }
  ];

  const currentFeeling = feelingsData.find((f) => f.id === selectedFeeling) || feelingsData[0];

  // Filter matched resorts
  const matchedResorts = resorts.filter((r) =>
    currentFeeling.filterCodes.includes(r.code) ||
    (selectedFeeling === "romantic" && (r.accommodationType.includes("Pool") || r.ambience.includes("Romantic / Honeymoon"))) ||
    (selectedFeeling === "stillness" && (r.ambience.includes("Lake / Dam Waterfront") || r.destination.includes("Padinjarathara"))) ||
    (selectedFeeling === "wild-wonder" && (r.accommodationType.includes("Tree") || r.destination.includes("Vythiri"))) ||
    (selectedFeeling === "heritage" && (r.accommodationType.includes("Plantation") || r.destination.includes("Bathery")))
  ).slice(0, 3);

  return (
    <section className="py-24 sm:py-32 bg-[#F6F4EE] border-t border-stone-200 relative overflow-hidden" id="feelings-engine">
      
      {/* Subtle Texture */}
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#C5A880_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1A2218] text-[#C5A880] text-[11px] font-bold tracking-luxury uppercase mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            The Feelings Engine • Black Tomato Aesthetic
          </div>
          <h2 className="text-3xl sm:text-5xl font-editorial font-normal text-stone-900 tracking-tight leading-tight">
            How do you want to feel?
          </h2>
          <p className="mt-3 text-stone-600 text-sm sm:text-base font-light max-w-xl mx-auto leading-relaxed">
            Most travel websites ask where you want to go. We ask how you want to feel. Select your mood, and discover our handpicked sanctuaries.
          </p>
        </div>

        {/* Feelings Mood Selector Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-14">
          {feelingsData.map((f) => {
            const Icon = f.icon;
            const isSelected = selectedFeeling === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setSelectedFeeling(f.id)}
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-semibold tracking-luxury uppercase transition-all duration-300 border ${
                  isSelected
                    ? "bg-[#1A2218] text-white border-[#1A2218] shadow-xl scale-105"
                    : "bg-white/80 hover:bg-white text-stone-700 border-stone-300 hover:border-stone-500 shadow-sm"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-emerald-400" : "text-stone-500"}`} />
                <span>{f.title.split("&")[0].trim()}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Feeling Spotlight Feature Banner */}
        <div className="bg-[#121A13] text-white rounded-3xl p-8 sm:p-12 mb-14 border border-emerald-900/40 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-900/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl relative z-10">
            <span className="text-[11px] uppercase tracking-luxury text-emerald-400 font-bold block mb-2">
              {currentFeeling.kicker}
            </span>
            <h3 className="text-2xl sm:text-4xl font-editorial font-normal tracking-tight text-white mb-4">
              "{currentFeeling.quote}"
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 font-light mb-6">
              Our travel specialists have spent decades scouting hidden corners of Wayanad to curate stays that deliver this exact feeling without compromise.
            </p>

            <button
              onClick={() => onOpenEnquiry(currentFeeling.title)}
              className="inline-flex items-center gap-2 bg-[#2E4F28] hover:bg-[#233D1F] text-white text-xs font-bold tracking-luxury uppercase px-6 py-3 rounded-full shadow-lg transition"
            >
              <span>Enquire for this Vibe</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Matched Curated Stays Grid */}
        <div>
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-stone-300/80">
            <h4 className="text-sm font-bold uppercase tracking-luxury text-stone-900">
              Curated Sanctuaries for {currentFeeling.title.split("&")[0].trim()}
            </h4>
            <Link
              href="/resorts"
              className="text-xs font-semibold text-emerald-900 hover:text-emerald-700 transition flex items-center gap-1"
            >
              <span>View All Verified Stays</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {matchedResorts.map((resort) => (
              <div
                key={resort.id}
                className="group bg-white rounded-3xl overflow-hidden border border-stone-200/90 hover:border-stone-400 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between"
              >
                <div>
                  {/* Photo Container with subtle zoom */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-900">
                    <Image
                      src={resort.coverImage || "/brand/wayanad-backcover.jpg"}
                      alt={resort.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                    
                    {/* Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-black/60 backdrop-blur-md text-emerald-300 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-white/10">
                        {resort.code}
                      </span>
                    </div>

                    <div className="absolute top-4 right-4 z-10">
                      <span className="bg-emerald-900/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                        ₹{resort.pricePerNight.toLocaleString("en-IN")}/night
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 z-10">
                      <p className="text-xs text-stone-300 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-400" />
                        {resort.destination}
                      </p>
                      <h4 className="text-lg font-editorial text-white font-normal mt-0.5 group-hover:text-emerald-200 transition">
                        {resort.name}
                      </h4>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="p-6">
                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {resort.overview}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {resort.amenities.slice(0, 3).map((a) => (
                        <span
                          key={a}
                          className="text-[10px] text-stone-600 bg-stone-100 px-2.5 py-1 rounded-md"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="px-6 pb-6 pt-2 border-t border-stone-100 flex items-center justify-between">
                  <Link
                    href={`/brochure/${resort.code}`}
                    className="text-xs font-semibold text-stone-700 hover:text-emerald-900 transition"
                  >
                    View Brochure
                  </Link>

                  <button
                    onClick={() => onOpenEnquiry(`${currentFeeling.title} at ${resort.name}`)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#1A2218] hover:bg-[#2E4F28] px-4 py-2 rounded-full transition shadow-sm"
                  >
                    <span>Enquire</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
