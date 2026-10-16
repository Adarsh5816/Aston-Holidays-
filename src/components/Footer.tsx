import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin, MessageCircle, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1A2218] text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          
          {/* Brand & Story */}
          <div className="md:col-span-1 space-y-4">
            <div className="relative w-44 h-14 bg-white/95 p-2 rounded-lg">
              <Image
                src="/brand/logo.png"
                alt="Aston Holidays"
                fill
                className="object-contain p-1"
              />
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Curating authentic, luxury, and historic stays across Wayanad. From private infinity pool villas overlooking Banasura Dam to misty rainforest canopy treehouses.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-3 py-1.5 rounded-full font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Approved Kerala DMC
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Explore Stays
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link href="/resorts?category=Pool+Villa" className="hover:text-white transition">
                  Private Pool Villas
                </Link>
              </li>
              <li>
                <Link href="/resorts?category=Tree+House" className="hover:text-white transition">
                  Rainforest Treehouses
                </Link>
              </li>
              <li>
                <Link href="/resorts?category=Plantation+Stay" className="hover:text-white transition">
                  Heritage Coffee Plantations
                </Link>
              </li>
              <li>
                <Link href="/resorts?category=Budget+Resort" className="hover:text-white transition">
                  Budget & Bachelor Friendly
                </Link>
              </li>
              <li>
                <Link href="/brochure/AH-121" className="hover:text-white transition font-medium text-emerald-400">
                  Featured: AH-121 3BHK Villa
                </Link>
              </li>
            </ul>
          </div>

          {/* Wayanad Destinations */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Popular Regions
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link href="/resorts?destination=Padinjarathara" className="hover:text-white transition">
                  Padinjarathara (Banasura)
                </Link>
              </li>
              <li>
                <Link href="/resorts?destination=Vythiri" className="hover:text-white transition">
                  Vythiri (Pookode & Canopies)
                </Link>
              </li>
              <li>
                <Link href="/resorts?destination=Meppadi" className="hover:text-white transition">
                  Meppadi (Chembra Peak)
                </Link>
              </li>
              <li>
                <Link href="/resorts?destination=Sulthan+Bathery" className="hover:text-white transition">
                  Sulthan Bathery (Edakkal Caves)
                </Link>
              </li>
              <li>
                <Link href="/resorts?destination=Kalpetta" className="hover:text-white transition">
                  Kalpetta (Central Wayanad)
                </Link>
              </li>
            </ul>
          </div>

          {/* Official Contact Office */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Head Office
            </h4>
            <div className="text-xs text-stone-400 space-y-2.5">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Aston Holidays, Kolagappara, Beenachi, Sulthan Bathery, Wayanad - 673592, Kerala, India</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <a href="tel:+919744900414" className="hover:text-white transition font-medium text-stone-300">
                  +91 97449 00414
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <a href="mailto:info@astonholidays.com" className="hover:text-white transition">
                  info@astonholidays.com
                </a>
              </p>
              <p className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Mon-Sun: 8:30 AM - 9:30 PM</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} Aston Holidays. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/admin" className="hover:text-stone-300 transition">
              Admin Portal
            </Link>
            <Link href="/contact" className="hover:text-stone-300 transition">
              Privacy & Booking Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
