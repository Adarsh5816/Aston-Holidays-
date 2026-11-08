"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Menu, X, Sparkles, ChevronDown, Compass, Heart, ShieldCheck, MapPin } from "lucide-react";
import { SiteSettings, getBrandLogoFilterClass } from "@/lib/types";

interface LuxuryNavbarProps {
  onOpenEnquiry: () => void;
  settings?: SiteSettings;
}

export default function LuxuryNavbar({ onOpenEnquiry, settings }: LuxuryNavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [destinationsOpen, setDestinationsOpen] = useState(false);
  const [sanctuariesOpen, setSanctuariesOpen] = useState(false);
  const [logoTheme, setLogoTheme] = useState<string>(settings?.footerLogoColor || "white");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync with live typography / brand logo updates
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

  // Keep in sync if settings prop changes
  useEffect(() => {
    if (settings?.footerLogoColor) {
      setLogoTheme(settings.footerLogoColor);
    }
  }, [settings?.footerLogoColor]);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 border-b border-white/15 ${
          scrolled
            ? "bg-[#09120A]/95 backdrop-blur-md text-white shadow-2xl py-3"
            : "bg-gradient-to-b from-black/85 via-black/40 to-transparent text-white py-4 sm:py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Brand Logo & Editorial Location Subtitle (Matches Reference "mulli / WAYANAD, KERALA") */}
            <Link href="/" className="flex flex-col items-start shrink-0 group">
              <div className="relative w-36 sm:w-44 h-10 sm:h-11">
                <Image
                  src="/brand/logo.png"
                  alt="Aston Holidays"
                  fill
                  className={`object-contain object-left ${getBrandLogoFilterClass(logoTheme)}`}
                  priority
                />
              </div>
              <span className="text-[8px] sm:text-[9px] font-mono tracking-[0.28em] text-[#D48D6C] uppercase font-semibold pl-0.5 mt-0.5">
                WAYANAD, KERALA
              </span>
            </Link>

            {/* Desktop Navigation Links (Clean Spaced Uppercase Typography) */}
            <nav className="hidden lg:flex items-center gap-8 text-[11px] font-semibold tracking-[0.22em] uppercase text-stone-200">
              
              <Link href="/resorts" className="hover:text-[#D48D6C] transition">
                Journeys
              </Link>

              {/* Sanctuaries Dropdown */}
              <div
                className="relative py-2"
                onMouseEnter={() => setSanctuariesOpen(true)}
                onMouseLeave={() => setSanctuariesOpen(false)}
              >
                <button className="flex items-center gap-1 hover:text-[#D48D6C] transition">
                  <span>The Sanctuaries</span>
                  <ChevronDown className="w-3 h-3 opacity-60 text-[#D48D6C]" />
                </button>

                {sanctuariesOpen && (
                  <div className="absolute top-full left-0 w-64 bg-[#0A130B]/95 border border-white/15 rounded-2xl p-3 shadow-2xl space-y-1 backdrop-blur-xl animate-in fade-in duration-200">
                    <Link
                      href="/resorts?category=Pool+Villa"
                      className="block p-2.5 rounded-xl hover:bg-white/10 text-xs font-medium text-stone-200 hover:text-white transition"
                    >
                      Private Pool Villas
                    </Link>
                    <Link
                      href="/resorts?category=Tree+House"
                      className="block p-2.5 rounded-xl hover:bg-white/10 text-xs font-medium text-stone-200 hover:text-white transition"
                    >
                      Glass Canopy Treehouses
                    </Link>
                    <Link
                      href="/resorts?category=Plantation+Stay"
                      className="block p-2.5 rounded-xl hover:bg-white/10 text-xs font-medium text-stone-200 hover:text-white transition"
                    >
                      Heritage Plantation Estates
                    </Link>
                    <Link
                      href="/resorts"
                      className="block p-2.5 rounded-xl bg-white/5 text-xs font-bold text-[#D48D6C] hover:bg-white/10 transition mt-1"
                    >
                      Explore All 37 Verified Stays →
                    </Link>
                  </div>
                )}
              </div>

              {/* Destinations Dropdown */}
              <div
                className="relative py-2"
                onMouseEnter={() => setDestinationsOpen(true)}
                onMouseLeave={() => setDestinationsOpen(false)}
              >
                <button className="flex items-center gap-1 hover:text-[#D48D6C] transition">
                  <span>The Place</span>
                  <ChevronDown className="w-3 h-3 opacity-60 text-[#D48D6C]" />
                </button>

                {destinationsOpen && (
                  <div className="absolute top-full left-0 w-64 bg-[#0A130B]/95 border border-white/15 rounded-2xl p-3 shadow-2xl space-y-1 backdrop-blur-xl animate-in fade-in duration-200">
                    <Link
                      href="/resorts?destination=Padinjarathara"
                      className="block p-2.5 rounded-xl hover:bg-white/10 text-xs font-medium text-stone-200 hover:text-white transition"
                    >
                      Padinjarathara (Banasura Lake)
                    </Link>
                    <Link
                      href="/resorts?destination=Vythiri"
                      className="block p-2.5 rounded-xl hover:bg-white/10 text-xs font-medium text-stone-200 hover:text-white transition"
                    >
                      Vythiri (Rainforest Canopies)
                    </Link>
                    <Link
                      href="/resorts?destination=Meppadi"
                      className="block p-2.5 rounded-xl hover:bg-white/10 text-xs font-medium text-stone-200 hover:text-white transition"
                    >
                      Meppadi (Chembra Peaks)
                    </Link>
                    <Link
                      href="/destinations"
                      className="block p-2.5 rounded-xl bg-white/5 text-xs font-bold text-[#D48D6C] hover:bg-white/10 transition mt-1"
                    >
                      All Wayanad Destinations →
                    </Link>
                  </div>
                )}
              </div>

              <a href="#philosophy" className="hover:text-[#D48D6C] transition">
                Journal
              </a>

            </nav>

            {/* Right Action: Menu Trigger & Bespoke Enquiry Pill */}
            <div className="flex items-center gap-3">
              
              {/* Phone Desk */}
              <a
                href="tel:+919744900414"
                className="hidden xl:flex items-center gap-2 text-xs font-semibold text-stone-300 hover:text-white transition mr-1"
              >
                <span className="w-2 h-2 rounded-full bg-[#D48D6C] animate-pulse" />
                <span>+91 97449 00414</span>
              </a>

              {/* Minimal Menu Pill (Matches Reference "MENU" with hamburger) */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="flex items-center gap-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.22em] text-stone-200 hover:text-[#D48D6C] transition py-1.5 px-3.5 rounded-full border border-white/20 hover:border-[#D48D6C]/50 bg-black/20 hover:bg-black/40 backdrop-blur-sm"
              >
                {mobileOpen ? <X className="w-3.5 h-3.5 text-[#D48D6C]" /> : <Menu className="w-3.5 h-3.5 text-[#D48D6C]" />}
                <span>Menu</span>
              </button>

              {/* Terracotta Plan Journey Button */}
              <button
                onClick={onOpenEnquiry}
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#D48D6C] hover:bg-[#C47D5C] text-[#0A130B] text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] transition-all shadow-lg hover:shadow-[#D48D6C]/30"
              >
                <span>Enquire</span>
              </button>

            </div>

          </div>
        </div>

        {/* ================= MOBILE MENU DRAWER ================= */}
        {mobileOpen && (
          <div className="lg:hidden bg-[#0A110A] border-b border-white/15 px-6 py-8 space-y-6 animate-in slide-in-from-top duration-300 shadow-2xl">
            <nav className="space-y-4 text-xs font-bold uppercase tracking-luxury text-stone-200">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="block hover:text-emerald-300 transition"
              >
                Home
              </Link>
              <Link
                href="/resorts"
                onClick={() => setMobileOpen(false)}
                className="block hover:text-emerald-300 transition"
              >
                Explore Curated Stays (37 Stays)
              </Link>
              <Link
                href="/resorts?category=Pool+Villa"
                onClick={() => setMobileOpen(false)}
                className="block hover:text-emerald-300 transition text-emerald-400"
              >
                Private Pool Villas
              </Link>
              <Link
                href="/resorts?category=Tree+House"
                onClick={() => setMobileOpen(false)}
                className="block hover:text-emerald-300 transition text-emerald-400"
              >
                Glass Canopy Treehouses
              </Link>
              <a
                href="#feelings-engine"
                onClick={() => setMobileOpen(false)}
                className="block hover:text-emerald-300 transition"
              >
                The Feelings Engine
              </a>
              <a
                href="#philosophy"
                onClick={() => setMobileOpen(false)}
                className="block hover:text-emerald-300 transition"
              >
                Our Philosophy
              </a>
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="block text-stone-400 hover:text-white transition"
              >
                Admin / Staff Login
              </Link>
            </nav>

            <div className="pt-4 border-t border-white/10 space-y-3">
              <a
                href="tel:+919744900414"
                className="flex items-center gap-2 text-xs font-bold text-[#D48D6C]"
              >
                <Phone className="w-3.5 h-3.5 text-[#D48D6C]" />
                <span>Concierge Desk: +91 97449 00414</span>
              </a>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onOpenEnquiry();
                }}
                className="w-full py-3 rounded-full bg-[#D48D6C] hover:bg-[#C47D5C] text-[#0A130B] text-xs font-bold uppercase tracking-[0.2em] transition shadow-lg"
              >
                Plan My Journey
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
