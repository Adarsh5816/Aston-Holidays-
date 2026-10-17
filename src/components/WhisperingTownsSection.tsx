"use client";

import React, { useState } from "react";
import Link from "next/link";
import { whisperingTownsData } from "@/data/content";
import {
  Compass,
  MapPin,
  Sparkles,
  ArrowRight,
  Navigation,
  Eye,
  Check
} from "lucide-react";

export default function WhisperingTownsSection() {
  const [selectedTown, setSelectedTown] = useState<string | null>(null);

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold px-3.5 py-1 rounded-full mb-3">
              <Compass className="w-3.5 h-3.5 text-emerald-700" />
              Go &amp; Discover Wayanad
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight">
              Whispering Towns of Wayanad
            </h2>
            <p className="mt-2 text-stone-500 text-sm max-w-xl leading-relaxed">
              Every town in Wayanad tells a different folklore—from 6,000-year-old petroglyphs in Sulthan Bathery to the misty rainforest gate of Vythiri.
            </p>
          </div>

          <Link
            href="/resorts"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#2E4F28] hover:text-[#1B2F18] border-b-2 border-[#2E4F28] pb-1 w-fit transition"
          >
            <span>Browse All 37 Verified Stays</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Whispering Towns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whisperingTownsData.map((town) => {
            const isSelected = selectedTown === town.name;
            return (
              <div
                key={town.name}
                onClick={() => setSelectedTown(isSelected ? null : town.name)}
                className={`cursor-pointer rounded-3xl p-6 sm:p-7 border transition-all duration-300 card-hover-elevation flex flex-col justify-between ${
                  isSelected
                    ? "bg-gradient-to-br from-emerald-900 to-[#121E11] text-white border-emerald-700 shadow-xl scale-[1.02]"
                    : "bg-[#FBFBFC] hover:bg-white text-stone-900 border-stone-200/80 hover:border-emerald-600/40 shadow-sm"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{town.icon}</span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full ${
                        isSelected
                          ? "bg-white/10 text-emerald-300 border border-white/10"
                          : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      }`}
                    >
                      {town.distanceFromCalicut} from Calicut
                    </span>
                  </div>

                  <h3
                    className={`text-2xl font-black tracking-tight ${
                      isSelected ? "text-white" : "text-stone-900"
                    }`}
                  >
                    {town.name}
                  </h3>
                  <p
                    className={`text-xs font-bold mt-1 ${
                      isSelected ? "text-emerald-300" : "text-emerald-800"
                    }`}
                  >
                    {town.tagline}
                  </p>

                  <p
                    className={`text-xs mt-3 leading-relaxed font-serif ${
                      isSelected ? "text-stone-300" : "text-stone-600"
                    }`}
                  >
                    {town.description}
                  </p>

                  {/* Key Attractions */}
                  <div className="mt-5 pt-4 border-t border-stone-200/40">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider block mb-2 ${
                        isSelected ? "text-emerald-400" : "text-stone-400"
                      }`}
                    >
                      Iconic Sightseeing Landmarks
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {town.keyAttractions.map((att, i) => (
                        <div
                          key={i}
                          className={`text-[11px] flex items-center gap-1.5 truncate ${
                            isSelected ? "text-stone-200" : "text-stone-700"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                              isSelected ? "bg-emerald-400" : "bg-emerald-600"
                            }`}
                          />
                          <span className="truncate">{att}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Explore Button */}
                <div className="mt-6 pt-4 border-t border-stone-200/40 flex items-center justify-between">
                  <Link
                    href={`/resorts?location=${encodeURIComponent(town.name)}`}
                    onClick={(e) => e.stopPropagation()}
                    className={`inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm ${
                      isSelected
                        ? "bg-white text-emerald-950 hover:bg-stone-100"
                        : "bg-[#2E4F28] text-white hover:bg-[#1E361A]"
                    }`}
                  >
                    <Navigation className="w-3.5 h-3.5" /> Explore {town.name} Stays
                  </Link>

                  <span
                    className={`text-[11px] font-medium ${
                      isSelected ? "text-stone-400" : "text-stone-400"
                    }`}
                  >
                    Code-Protected Stays
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
