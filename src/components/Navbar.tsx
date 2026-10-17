"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MessageCircle,
  Menu,
  X,
  Phone,
  Compass,
  Mail,
  MapPin,
  ChevronDown,
  Sparkles,
  Heart,
  Trees,
  Users,
  ShieldCheck
} from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [holidaysOpen, setHolidaysOpen] = useState(false);
  const [resortsOpen, setResortsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200/80 transition-all shadow-sm">
      {/* Top Notification / Info Bar (Like astonholidays.com) */}
      <div className="bg-[#121D10] text-stone-300 text-[11px] py-1.5 px-4 hidden sm:block border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              Kolagappara, Sulthan Bathery, Wayanad - 673592
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              info@astonholidays.com
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-300 font-bold">
              <Phone className="w-3 h-3 text-emerald-400" />
              +91 97449 00414
            </span>
            <span className="text-stone-500">|</span>
            <Link href="/login" className="text-stone-300 hover:text-white transition font-medium">
              Admin / Staff Login
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-40 sm:w-48 h-14">
              <Image
                src="/brand/logo.png"
                alt="Aston Holidays"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-stone-700">
            <Link href="/" className="hover:text-emerald-800 transition">
              Home
            </Link>

            {/* Holidays Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setHolidaysOpen(true)}
              onMouseLeave={() => setHolidaysOpen(false)}
            >
              <button className="flex items-center gap-1 hover:text-emerald-800 transition py-2">
                <span>Holidays</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {holidaysOpen && (
                <div className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-xl border border-stone-200/90 p-3 space-y-1 z-50">
                  <Link
                    href="/#packages"
                    onClick={() => setHolidaysOpen(false)}
                    className="block p-2.5 rounded-xl hover:bg-emerald-50 text-xs font-bold text-stone-800 hover:text-emerald-900 transition"
                  >
                    💖 Wayanad Honeymoon Packages
                  </Link>
                  <Link
                    href="/#packages"
                    onClick={() => setHolidaysOpen(false)}
                    className="block p-2.5 rounded-xl hover:bg-emerald-50 text-xs font-bold text-stone-800 hover:text-emerald-900 transition"
                  >
                    ✨ Wayanad 3D/2N Best Holiday
                  </Link>
                  <Link
                    href="/#packages"
                    onClick={() => setHolidaysOpen(false)}
                    className="block p-2.5 rounded-xl hover:bg-emerald-50 text-xs font-bold text-stone-800 hover:text-emerald-900 transition"
                  >
                    🌴 Group Packages &amp; Safaris
                  </Link>
                  <Link
                    href="/#packages"
                    onClick={() => setHolidaysOpen(false)}
                    className="block p-2.5 rounded-xl hover:bg-emerald-50 text-xs font-bold text-stone-800 hover:text-emerald-900 transition"
                  >
                    💍 Destination Events &amp; Weddings
                  </Link>
                </div>
              )}
            </div>

            {/* Resorts Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setResortsOpen(true)}
              onMouseLeave={() => setResortsOpen(false)}
            >
              <button className="flex items-center gap-1 hover:text-emerald-800 transition py-2">
                <span>Resorts</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {resortsOpen && (
                <div className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-xl border border-stone-200/90 p-3 space-y-1 z-50">
                  <Link
                    href="/resorts?accommodationType=Private+Pool+Villa"
                    onClick={() => setResortsOpen(false)}
                    className="block p-2.5 rounded-xl hover:bg-emerald-50 text-xs font-bold text-stone-800 hover:text-emerald-900 transition"
                  >
                    🏊 Premium Pool Villas
                  </Link>
                  <Link
                    href="/resorts?accommodationType=Tree+House"
                    onClick={() => setResortsOpen(false)}
                    className="block p-2.5 rounded-xl hover:bg-emerald-50 text-xs font-bold text-stone-800 hover:text-emerald-900 transition"
                  >
                    🌳 Treehouse Retreats
                  </Link>
                  <Link
                    href="/resorts?stayPreference=Family+Gathering"
                    onClick={() => setResortsOpen(false)}
                    className="block p-2.5 rounded-xl hover:bg-emerald-50 text-xs font-bold text-stone-800 hover:text-emerald-900 transition"
                  >
                    👨‍👩‍👧‍👦 Family Friendly Resorts
                  </Link>
                  <Link
                    href="/resorts?stayPreference=Group+/+Bachelor+Friendly"
                    onClick={() => setResortsOpen(false)}
                    className="block p-2.5 rounded-xl hover:bg-emerald-50 text-xs font-bold text-stone-800 hover:text-emerald-900 transition"
                  >
                    🏕️ Bachelor Friendly Stays
                  </Link>
                  <Link
                    href="/resorts"
                    onClick={() => setResortsOpen(false)}
                    className="block p-2.5 rounded-xl bg-emerald-50 text-xs font-bold text-emerald-900 transition border border-emerald-200"
                  >
                    🔍 View All Verified Stays
                  </Link>
                </div>
              )}
            </div>

            <Link href="/#whispering-towns" className="hover:text-emerald-800 transition">
              Whispering Towns
            </Link>

            <Link href="/#blogs" className="hover:text-emerald-800 transition">
              Blogs &amp; News
            </Link>

            <Link href="/contact" className="hover:text-emerald-800 transition">
              Contact Us
            </Link>

            <Link
              href="/admin/dev"
              className="text-xs bg-stone-100 text-stone-700 hover:bg-stone-200 px-3 py-1.5 rounded-lg font-bold transition"
            >
              Dev Hub
            </Link>
          </nav>

          {/* WhatsApp CTA Action */}
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/919744900414?text=Hi%20Aston%20Holidays,%20I%20am%20looking%20for%20resort%20and%20package%20options%20in%20Wayanad"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#2E4F28] hover:bg-[#233D1F] text-white text-xs font-bold px-4 sm:px-5 py-2.5 rounded-full shadow-sm hover:shadow transition"
            >
              <MessageCircle className="w-4 h-4 text-emerald-300" />
              <span>Book on WhatsApp</span>
            </a>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-5 pt-3 pb-6 space-y-3 shadow-lg">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-bold text-stone-800 rounded-lg hover:bg-stone-50"
          >
            Home
          </Link>
          <Link
            href="/resorts"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-bold text-stone-800 rounded-lg hover:bg-stone-50"
          >
            Verified Stays &amp; Villas (Code-Protected)
          </Link>
          <Link
            href="/#packages"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-bold text-emerald-800 rounded-lg hover:bg-emerald-50"
          >
            Curated Holiday Packages (Honeymoon, Events, Group)
          </Link>
          <Link
            href="/#whispering-towns"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-bold text-stone-800 rounded-lg hover:bg-stone-50"
          >
            Whispering Towns
          </Link>
          <Link
            href="/#blogs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-bold text-stone-800 rounded-lg hover:bg-stone-50"
          >
            Blogs &amp; News
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-bold text-stone-800 rounded-lg hover:bg-stone-50"
          >
            Contact Us
          </Link>
          <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-bold text-[#2E4F28] hover:underline"
            >
              Admin / Staff Login ➔
            </Link>
            <Link
              href="/admin/dev"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-bold text-stone-500 hover:underline"
            >
              Dev Hub ➔
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
