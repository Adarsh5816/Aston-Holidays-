"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Menu, X, Phone, Compass } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200/80 transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3">
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-700">
            <Link href="/" className="hover:text-emerald-800 transition">
              Home
            </Link>
            <Link href="/resorts" className="hover:text-emerald-800 transition flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-emerald-700" /> Stays & Villas
            </Link>
            <Link href="/destinations" className="hover:text-emerald-800 transition">
              Destinations
            </Link>
            <Link href="/contact" className="hover:text-emerald-800 transition">
              Contact Us
            </Link>
            <Link
              href="/admin"
              className="text-xs bg-stone-100 text-stone-700 hover:bg-stone-200 px-3 py-1.5 rounded-md font-semibold transition"
            >
              Operations CRM
            </Link>
          </nav>

          {/* WhatsApp CTA Action */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="https://wa.me/919744900414?text=Hi%20Aston%20Holidays,%20I%20am%20looking%20for%20resort%20options%20in%20Wayanad"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#2E4F28] hover:bg-[#233D1F] text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-sm hover:shadow transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
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

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-stone-800 rounded-md hover:bg-stone-50"
          >
            Home
          </Link>
          <Link
            href="/resorts"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-stone-800 rounded-md hover:bg-stone-50"
          >
            Stays & Villas
          </Link>
          <Link
            href="/destinations"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-stone-800 rounded-md hover:bg-stone-50"
          >
            Destinations
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-stone-800 rounded-md hover:bg-stone-50"
          >
            Contact
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium text-emerald-800 rounded-md bg-stone-100"
          >
            Operations & Invoicing Portal
          </Link>
          <div className="pt-2">
            <a
              href="https://wa.me/919744900414"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#2E4F28] text-white font-medium py-3 rounded-xl"
            >
              <MessageCircle className="w-4 h-4" /> Message on WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
