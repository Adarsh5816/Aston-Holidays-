"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin, MessageCircle, Heart, ShieldCheck, ArrowRight } from "lucide-react";
import { SiteSettings, getBrandLogoFilterClass } from "@/lib/types";

export default function LuxuryFooter({
  onOpenEnquiry,
  settings
}: {
  onOpenEnquiry: () => void;
  settings?: SiteSettings;
}) {
  const [logoTheme, setLogoTheme] = useState<string>(settings?.footerLogoColor || "white");

  useEffect(() => {
    try {
      const cached = localStorage.getItem("aston_typography_cache");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.footerLogoColor) {
          setLogoTheme(parsed.footerLogoColor);
        }
      }
    } catch {}

    const handleUpdate = (e: any) => {
      if (e.detail?.footerLogoColor) {
        setLogoTheme(e.detail.footerLogoColor);
      }
    };

    window.addEventListener("aston_typography_updated" as any, handleUpdate);
    return () => {
      window.removeEventListener("aston_typography_updated" as any, handleUpdate);
    };
  }, []);

  useEffect(() => {
    if (settings?.footerLogoColor) {
      setLogoTheme(settings.footerLogoColor);
    }
  }, [settings?.footerLogoColor]);

  return (
    <footer className="bg-[#0B120B] text-stone-300 pt-20 pb-12 border-t border-white/10 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Editorial Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          
          {/* Brand & Manifesto */}
          <div className="lg:col-span-5 space-y-5">
            <Link href="/" className="inline-block">
              <div className="relative w-48 h-14">
                <Image
                  src="/brand/logo.png"
                  alt="Aston Holidays"
                  fill
                  className={`object-contain object-left ${getBrandLogoFilterClass(logoTheme)}`}
                />
              </div>
            </Link>
            
            <p className="text-xs sm:text-sm text-stone-400 font-light leading-relaxed max-w-md">
              Bespoke travel planners crafting extraordinary Wayanad holidays. Personalised itineraries, private infinity pool villas, glass canopy treehouses, and zero planning surcharges.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 text-[11px] text-emerald-300 bg-emerald-950/80 border border-emerald-500/30 px-3 py-1.5 rounded-full font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Approved Kerala DMC Operator
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] text-stone-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                37+ Verified Properties
              </span>
            </div>
          </div>

          {/* Curated Portfolios */}
          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-bold uppercase tracking-luxury text-white mb-5">
              Sanctuaries
            </h4>
            <ul className="space-y-3 text-xs text-stone-400 font-light">
              <li>
                <Link href="/resorts?category=Pool+Villa" className="hover:text-emerald-300 transition">
                  Private Pool Villas
                </Link>
              </li>
              <li>
                <Link href="/resorts?category=Tree+House" className="hover:text-emerald-300 transition">
                  Canopy Treehouses
                </Link>
              </li>
              <li>
                <Link href="/resorts?category=Plantation+Stay" className="hover:text-emerald-300 transition">
                  Heritage Coffee Plantations
                </Link>
              </li>
              <li>
                <Link href="/brochure/AH-121" className="hover:text-emerald-300 transition text-emerald-400 font-medium">
                  Featured: AH-121 3BHK Villa
                </Link>
              </li>
              <li>
                <Link href="/resorts" className="hover:text-emerald-300 transition">
                  All 37 Verified Stays
                </Link>
              </li>
            </ul>
          </div>

          {/* Destinations */}
          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-bold uppercase tracking-luxury text-white mb-5">
              Destinations
            </h4>
            <ul className="space-y-3 text-xs text-stone-400 font-light">
              <li>
                <Link href="/resorts?destination=Padinjarathara" className="hover:text-emerald-300 transition">
                  Padinjarathara (Banasura)
                </Link>
              </li>
              <li>
                <Link href="/resorts?destination=Vythiri" className="hover:text-emerald-300 transition">
                  Vythiri (Rainforest Canopies)
                </Link>
              </li>
              <li>
                <Link href="/resorts?destination=Meppadi" className="hover:text-emerald-300 transition">
                  Meppadi (Chembra Peak)
                </Link>
              </li>
              <li>
                <Link href="/resorts?destination=Sulthan+Bathery" className="hover:text-emerald-300 transition">
                  Sulthan Bathery (Edakkal)
                </Link>
              </li>
              <li>
                <Link href="/resorts?destination=Kalpetta" className="hover:text-emerald-300 transition">
                  Kalpetta (Spice Trails)
                </Link>
              </li>
            </ul>
          </div>

          {/* Concierge Desk */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-[11px] font-bold uppercase tracking-luxury text-white mb-5">
              Wayanad Concierge Desk
            </h4>
            
            <p className="text-xs text-stone-400 font-light">
              Have questions about your dates or private villa availability? Our specialists are available 7 days a week.
            </p>

            <div className="space-y-2 pt-1 text-xs">
              <a
                href="tel:+919744900414"
                className="flex items-center gap-2 text-white hover:text-emerald-300 transition font-semibold"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>+91 97449 00414</span>
              </a>

              <a
                href="mailto:info@astonholidays.com"
                className="flex items-center gap-2 text-stone-300 hover:text-white transition"
              >
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>info@astonholidays.com</span>
              </a>

              <p className="flex items-start gap-2 text-stone-400 text-[11px] pt-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Kolagappara, Sulthan Bathery, Wayanad - 673592, Kerala</span>
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenEnquiry}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#2E4F28] hover:bg-[#233D1F] text-white text-xs font-semibold tracking-luxury uppercase transition shadow-lg border border-emerald-400/30"
              >
                <span>Plan Your Journey</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Credits & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} Aston Holidays. Curated Bespoke Wayanad Escapes. All rights reserved.</p>
          
          <div className="flex items-center gap-6">
            <Link href="/admin" className="hover:text-stone-300 transition">
              Staff Portal
            </Link>
            <Link href="/#philosophy" className="hover:text-stone-300 transition">
              Philosophy
            </Link>
            <Link href="/resorts" className="hover:text-stone-300 transition">
              Verified Stays
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
