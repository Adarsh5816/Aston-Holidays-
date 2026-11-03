"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Menu, X, Sparkles, ChevronDown, Compass, Heart, ShieldCheck, MapPin } from "lucide-react";

interface LuxuryNavbarProps {
  onOpenEnquiry: () => void;
}

export default function LuxuryNavbar({ onOpenEnquiry }: LuxuryNavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [destinationsOpen, setDestinationsOpen] = useState(false);
  const [sanctuariesOpen, setSanctuariesOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ${
          scrolled
            ? "bg-[#0B120B]/95 backdrop-blur-md border-b border-white/10 text-white shadow-2xl py-3"
            : "bg-gradient-to-b from-black/80 via-black/40 to-transparent text-white py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <div className="relative w-36 sm:w-44 h-12">
                <Image
                  src="/brand/logo.png"
                  alt="Aston Holidays"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation Links (Black Tomato Letter-Spaced Typography) */}
            <nav className="hidden lg:flex items-center gap-8 text-[11px] font-semibold tracking-luxury uppercase text-stone-200">
              
              <Link href="/" className="hover:text-emerald-300 transition">
                Home
              </Link>

              {/* Destinations Dropdown */}
              <div
                className="relative py-2"
                onMouseEnter={() => setDestinationsOpen(true)}
                onMouseLeave={() => setDestinationsOpen(false)}
              >
                <button className="flex items-center gap-1 hover:text-emerald-300 transition">
                  <span>Destinations</span>
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </button>

                {destinationsOpen && (
                  <div className="absolute top-full left-0 w-64 bg-[#0F1710] border border-white/15 rounded-2xl p-3 shadow-2xl space-y-1 backdrop-blur-xl animate-in fade-in duration-200">
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
                      href="/resorts?destination=Sulthan+Bathery"
                      className="block p-2.5 rounded-xl hover:bg-white/10 text-xs font-medium text-stone-200 hover:text-white transition"
                    >
                      Sulthan Bathery (Edakkal Caves)
                    </Link>
                    <Link
                      href="/resorts"
                      className="block p-2.5 rounded-xl bg-white/5 text-xs font-bold text-emerald-400 hover:bg-white/10 transition mt-1"
                    >
                      Explore All 37 Verified Stays →
                    </Link>
                  </div>
                )}
              </div>

              {/* Sanctuaries Dropdown */}
              <div
                className="relative py-2"
                onMouseEnter={() => setSanctuariesOpen(true)}
                onMouseLeave={() => setSanctuariesOpen(false)}
              >
                <button className="flex items-center gap-1 hover:text-emerald-300 transition">
                  <span>Sanctuaries</span>
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </button>

                {sanctuariesOpen && (
                  <div className="absolute top-full left-0 w-64 bg-[#0F1710] border border-white/15 rounded-2xl p-3 shadow-2xl space-y-1 backdrop-blur-xl animate-in fade-in duration-200">
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
                      href="/brochure/AH-121"
                      className="block p-2.5 rounded-xl bg-white/5 text-xs font-bold text-emerald-400 hover:bg-white/10 transition mt-1"
                    >
                      Featured: AH-121 3BHK Villa →
                    </Link>
                  </div>
                )}
              </div>

              <a href="#feelings-engine" className="hover:text-emerald-300 transition">
                The Feelings Engine
              </a>

              <a href="#philosophy" className="hover:text-emerald-300 transition">
                Philosophy
              </a>

              <Link href="/admin" className="text-stone-400 hover:text-white transition text-[10px]">
                Staff Login
              </Link>

            </nav>

            {/* Right Action: Concierge Phone & Black Tomato Pill CTA */}
            <div className="flex items-center gap-4">
              
              {/* Phone Desk */}
              <a
                href="tel:+919744900414"
                className="hidden xl:flex items-center gap-2 text-xs font-semibold text-stone-300 hover:text-white transition"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>+91 97449 00414</span>
              </a>

              {/* Signature Black Tomato Rounded Pill CTA */}
              <button
                onClick={onOpenEnquiry}
                className="inline-flex items-center gap-2 px-6 sm:px-7 py-2.5 sm:py-3 rounded-full bg-[#2E4F28] hover:bg-[#233D1F] text-white text-[11px] sm:text-xs font-bold uppercase tracking-luxury transition-all shadow-xl hover:shadow-emerald-950/80 border border-emerald-400/30 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Enquire Now</span>
              </button>

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-full bg-white/10 text-stone-200 hover:text-white hover:bg-white/20 transition"
                aria-label="Toggle Navigation"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
                className="flex items-center gap-2 text-xs font-bold text-emerald-300"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Desk: +91 97449 00414</span>
              </a>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onOpenEnquiry();
                }}
                className="w-full py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-bold uppercase tracking-luxury transition shadow-lg"
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
