"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HolidayPackage } from "@/lib/types";
import {
  Sparkles,
  Heart,
  Calendar,
  Users,
  Compass,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  Clock,
  ChevronRight,
  Flame
} from "lucide-react";

interface InteractivePackagesProps {
  packages: HolidayPackage[];
  whatsappNumber: string;
}

export default function InteractivePackagesSection({ packages, whatsappNumber }: InteractivePackagesProps) {
  const [activeTab, setActiveTab] = useState<
    "All" | "Honey Moon Package" | "Destination events" | "Group Packages" | "Best Holiday Package"
  >("Honey Moon Package");

  const categories = [
    { key: "Honey Moon Package", label: "💖 Honeymoon Packages", icon: Heart },
    { key: "Destination events", label: "💍 Destination Events", icon: Calendar },
    { key: "Group Packages", label: "🌴 Group Packages", icon: Users },
    { key: "Best Holiday Package", label: "✨ Best Holiday Packages", icon: Compass },
    { key: "All", label: "🌟 All Curated Packages", icon: Sparkles }
  ] as const;

  const filteredPackages =
    activeTab === "All"
      ? packages
      : packages.filter((p) => p.category === activeTab);

  // Continuous scrolling marquee list (duplicated for infinite seamless loop)
  const marqueePackages = [...packages, ...packages];

  return (
    <section className="py-20 bg-gradient-to-b from-stone-50 via-white to-stone-50 relative overflow-hidden">
      {/* Background Ambience Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#2E4F28_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-100/70 border border-emerald-300 text-emerald-900 text-xs font-bold px-3.5 py-1 rounded-full mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            Aston Holidays Signature Escapes
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight">
            Curated Wayanad Holiday Experiences
          </h2>
          <p className="mt-3 text-sm sm:text-base text-stone-600 leading-relaxed">
            From secluded romantic honeymoons in mist-laden private pool villas to royal plantation weddings and adventure group safaris.
          </p>
        </div>

        {/* ================= CONTINUOUS INFINITE LIVE SCROLLING TICKER ================= */}
        {/* "Best Holiday Package keep scrolling" */}
        <div className="mb-14 relative">
          <div className="flex items-center justify-between mb-3 px-2">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-emerald-900">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping" />
              <span>Aston Holidays • Best Holiday Packages (Live Showcase)</span>
            </div>
            <span className="text-[11px] font-medium text-stone-400 hidden sm:inline">
              Hover over any card to pause scroll
            </span>
          </div>

          {/* Marquee Wrapper with Edge Fade Gradients */}
          <div className="relative overflow-hidden py-3">
            <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-stone-50 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-stone-50 to-transparent z-10 pointer-events-none" />

            <div className="animate-marquee gap-5">
              {marqueePackages.map((pkg, idx) => {
                const bookWaUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=Hi%20Aston%20Holidays,%20I%20am%20inquiring%20about%20*${encodeURIComponent(pkg.title)}*%20(${encodeURIComponent(pkg.duration)}).%20Please%20share%20package%20details!`;
                return (
                  <div
                    key={`${pkg.id}-${idx}`}
                    className="w-80 sm:w-96 flex-shrink-0 bg-white rounded-2xl p-5 border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 card-hover-elevation flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {pkg.category}
                        </span>
                        <span className="text-[11px] font-medium text-stone-500 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-stone-400" /> {pkg.duration}
                        </span>
                      </div>

                      <h4 className="text-base font-extrabold text-stone-900 line-clamp-1">{pkg.title}</h4>
                      <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">{pkg.tagline}</p>

                      <div className="mt-3 pt-3 border-t border-stone-100 space-y-1">
                        {pkg.inclusions.slice(0, 2).map((inc, i) => (
                          <div key={i} className="text-[11px] text-stone-600 flex items-center gap-1.5 truncate">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                            <span className="truncate">{inc}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-stone-400 block uppercase font-semibold">Package Starts At</span>
                        <span className="text-base font-extrabold text-[#2E4F28]">
                          ₹{pkg.price.toLocaleString("en-IN")}
                        </span>
                      </div>

                      <a
                        href={bookWaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 px-3.5 py-2 rounded-xl transition shadow-sm"
                      >
                        <MessageCircle className="w-3.5 h-3.5" /> Book on WhatsApp
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ================= INTERACTIVE TAB SWITCHER ================= */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-10">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeTab === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveTab(cat.key as any)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-sm ${
                  isSelected
                    ? "bg-[#2E4F28] text-white shadow-md scale-105"
                    : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-amber-300" : "text-stone-500"}`} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* ================= FILTERED PACKAGES GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPackages.map((pkg) => {
            const bookWaUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=Hi%20Aston%20Holidays,%20I%20am%20interested%20in%20reserving%20the%20*${encodeURIComponent(pkg.title)}*%20(${encodeURIComponent(pkg.duration)}).%20Please%20send%20availability%20and%20itinerary!`;

            return (
              <div
                key={pkg.id}
                className="group bg-white rounded-3xl overflow-hidden border border-stone-200/90 hover:border-emerald-700/50 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image & Header */}
                <div>
                  <div className="relative w-full h-56 overflow-hidden bg-gradient-to-br from-stone-900 via-[#1B281A] to-stone-900 p-6 flex flex-col justify-between text-white">
                    <div className="flex items-center justify-between z-10">
                      <span className="text-[10px] font-mono font-bold bg-white/20 backdrop-blur px-2.5 py-1 rounded-md text-emerald-200">
                        {pkg.category}
                      </span>
                      <span className="text-xs font-bold bg-[#2E4F28]/90 text-white px-3 py-1 rounded-full border border-emerald-400/40 shadow">
                        {pkg.duration}
                      </span>
                    </div>

                    <div className="z-10 mt-auto">
                      <span className="text-xs text-amber-300 font-semibold flex items-center gap-1 mb-1">
                        <Flame className="w-3.5 h-3.5" /> High Demand Experience
                      </span>
                      <h3 className="text-xl font-black text-white tracking-tight leading-tight group-hover:text-emerald-300 transition">
                        {pkg.title}
                      </h3>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    <p className="text-xs font-semibold text-emerald-800 leading-snug">
                      {pkg.tagline}
                    </p>

                    <p className="text-xs text-stone-600 leading-relaxed font-serif">
                      {pkg.description}
                    </p>

                    {/* Inclusions Checklist */}
                    <div className="pt-3 border-t border-stone-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-2">
                        What&apos;s Included in this Package
                      </span>
                      <div className="space-y-1.5">
                        {pkg.inclusions.map((inc, i) => (
                          <div key={i} className="text-xs text-stone-700 flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span>{inc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Pricing & Actions */}
                <div className="p-6 pt-4 bg-stone-50/80 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-medium block">All-Inclusive Rate</span>
                    <span className="text-xl font-black text-[#2E4F28]">
                      ₹{pkg.price.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <a
                    href={bookWaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 px-4 py-2.5 rounded-xl transition shadow-md"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> Book via WhatsApp
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
