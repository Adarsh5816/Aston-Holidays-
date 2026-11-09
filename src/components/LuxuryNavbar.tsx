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

  // Close menu on ESC and prevent background scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen]);

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
              
              <Link href="/resorts" className="hover:text-[#D48D6C] transition uppercase">
                JOURNEYS
              </Link>

              {/* Sanctuaries Dropdown */}
              <div
                className="relative py-2"
                onMouseEnter={() => setSanctuariesOpen(true)}
                onMouseLeave={() => setSanctuariesOpen(false)}
              >
                <button className="flex items-center gap-1 hover:text-[#D48D6C] transition uppercase tracking-[0.22em] text-[11px]">
                  <span>THE SANCTUARIES</span>
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
                <button className="flex items-center gap-1 hover:text-[#D48D6C] transition uppercase tracking-[0.22em] text-[11px]">
                  <span>THE PLACE</span>
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

              <a href="#philosophy" className="hover:text-[#D48D6C] transition uppercase">
                JOURNAL
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
                className="hidden sm:inline-flex items-center gap-2 px-5 py-1.5 rounded-full border border-[#D48D6C]/80 text-[#F6F4EE] hover:bg-[#D48D6C] hover:text-[#0A130B] text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] transition-all shadow-md"
              >
                <span>Enquire</span>
              </button>

            </div>

          </div>
        </div>

      </header>

      {/* ================= UNIVERSAL LUXURY MENU DRAWER (LAPTOP, DESKTOP & MOBILE) ================= */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-300">
          {/* Backdrop overlay */}
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
          />

          {/* Slide-over Drawer Panel */}
          <aside className="relative z-10 w-full sm:w-[460px] h-full bg-[#09120A] border-l border-white/15 shadow-2xl p-6 sm:p-10 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-6 border-b border-white/15">
              <div className="flex flex-col">
                <span className="text-xs font-editorial font-bold tracking-[0.25em] text-[#F6F4EE] uppercase">
                  Aston Holidays
                </span>
                <span className="text-[9px] font-mono tracking-[0.28em] text-[#D48D6C] uppercase font-semibold mt-0.5">
                  Wayanad, Kerala
                </span>
              </div>

              <button
                onClick={() => setMobileOpen(false)}
                className="group flex items-center gap-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-stone-300 hover:text-[#D48D6C] py-1.5 px-3 rounded-full border border-white/20 hover:border-[#D48D6C]/50 transition"
                aria-label="Close Menu"
              >
                <span>Close</span>
                <X className="w-4 h-4 text-[#D48D6C] group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            {/* Navigation Links with Editorial Numbering & Hover Accents */}
            <nav className="py-8 space-y-5 text-sm sm:text-base font-editorial font-normal tracking-wide text-stone-200">
              {[
                { label: "Home", href: "/" },
                { label: "Curated Stays & Journeys", href: "/resorts", badge: "37 Stays" },
                { label: "Private Pool Villas", href: "/resorts?category=Pool+Villa" },
                { label: "Glass Canopy Treehouses", href: "/resorts?category=Tree+House" },
                { label: "Wayanad Destinations", href: "/destinations" },
                { label: "The Feelings Engine", href: "/#feelings-engine" },
                { label: "Our Philosophy", href: "/#philosophy" },
                { label: "Staff & Admin Portal", href: "/admin", isMuted: true }
              ].map((item, idx) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`group flex items-center justify-between py-1 transition-all ${
                    item.isMuted
                      ? "text-stone-400 hover:text-stone-200 text-xs font-sans uppercase tracking-[0.2em]"
                      : "text-stone-100 hover:text-[#D48D6C]"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-[#D48D6C]/70">0{idx + 1}</span>
                    <span className="group-hover:translate-x-1.5 transition-transform">{item.label}</span>
                  </span>
                  {item.badge && (
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#D48D6C] bg-[#D48D6C]/10 px-2 py-0.5 rounded-full border border-[#D48D6C]/30">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            {/* Drawer Footer: Concierge Desk & Actions */}
            <div className="pt-6 border-t border-white/15 space-y-4">
              <a
                href="tel:+919744900414"
                className="flex items-center gap-2.5 text-xs font-semibold text-stone-300 hover:text-[#D48D6C] transition"
              >
                <Phone className="w-3.5 h-3.5 text-[#D48D6C]" />
                <span>Concierge Desk: +91 97449 00414</span>
              </a>

              <button
                onClick={() => {
                  setMobileOpen(false);
                  onOpenEnquiry();
                }}
                className="w-full py-3.5 rounded-full bg-[#D48D6C] hover:bg-[#C47D5C] text-[#0A130B] text-xs font-bold uppercase tracking-[0.22em] transition-all shadow-xl hover:shadow-[#D48D6C]/40"
              >
                Plan My Journey
              </button>

              <div className="pt-2 flex items-center justify-between text-[10px] font-mono tracking-widest text-stone-500 uppercase">
                <span>11° 41&apos; N • 76° 07&apos; E</span>
                <span>Wayanad, Kerala</span>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
