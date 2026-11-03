"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Compass, Users, Heart, Trees, Waves } from "lucide-react";

export default function StartYourJourneyTabs() {
  const [activeTab, setActiveTab] = useState<"traveller" | "experience" | "region">("traveller");

  const travellerTiles = [
    {
      title: "Honeymoon & Couples",
      tagline: "Intimate pool villas & candlelit rainforest dinners",
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=80",
      link: "/resorts?category=Pool+Villa"
    },
    {
      title: "Family Vacations",
      tagline: "Spacious private estates with lawns and safe shallow pools",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=900&q=80",
      link: "/resorts?accommodationType=Entire+Villa"
    },
    {
      title: "Private Groups",
      tagline: "3BHK & 4BHK villas with campfire setups & mountain grills",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80",
      link: "/resorts?accommodationType=Entire+Villa"
    },
    {
      title: "Multi-Generational",
      tagline: "Stepless garden access, plantation verandas & wheelchair ease",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
      link: "/resorts?stayPreference=Independent+Private+Cottage%2FVilla"
    },
    {
      title: "Solo Escapes",
      tagline: "Deep birdwatching, morning meditation & serene coffee estates",
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=900&q=80",
      link: "/resorts?category=Plantation+Stay"
    }
  ];

  const experienceTiles = [
    {
      title: "Private Pool Living",
      tagline: "Temperature-controlled infinity pools facing mist & reservoirs",
      image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=900&q=80",
      link: "/resorts?category=Pool+Villa"
    },
    {
      title: "Glass Treehouse Canopies",
      tagline: "Suspended 90 feet in the Western Ghats rainforest canopy",
      image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=80",
      link: "/resorts?category=Tree+House"
    },
    {
      title: "Heritage Coffee Estates",
      tagline: "Colonial British-era teakwood bungalows among pepper & coffee",
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80",
      link: "/resorts?category=Plantation+Stay"
    },
    {
      title: "Banasura Dam Waterfront",
      tagline: "Wake to water reflections and majestic Chembra silhouettes",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
      link: "/resorts?destination=Padinjarathara"
    },
    {
      title: "Wilderness Glamping",
      tagline: "Under-canvas luxury with warm showers and star-lit decks",
      image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=900&q=80",
      link: "/resorts?category=Budget+Resort"
    }
  ];

  const regionTiles = [
    {
      title: "Padinjarathara",
      tagline: "Home to Banasura Sagar earthen dam and calm waterside estates",
      image: "/brand/wayanad-backcover.jpg",
      link: "/resorts?destination=Padinjarathara"
    },
    {
      title: "Vythiri Rainforest",
      tagline: "The cloud gate of Wayanad with lush hanging mist and waterfalls",
      image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=80",
      link: "/resorts?destination=Vythiri"
    },
    {
      title: "Meppadi & Chembra",
      tagline: "Rolling tea carpet hills and the famous heart-shaped lake peak",
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80",
      link: "/resorts?destination=Meppadi"
    },
    {
      title: "Sulthan Bathery",
      tagline: "6,000-year-old Edakkal petroglyphs and Muthanga wildlife safaris",
      image: "/brand/edakkal-footprint.jpg",
      link: "/resorts?destination=Sulthan+Bathery"
    },
    {
      title: "Kalpetta Heartlands",
      tagline: "Central artisan spice bazaars, heritage temples and waterfalls",
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=80",
      link: "/resorts?destination=Kalpetta"
    }
  ];

  const tiles = activeTab === "traveller" ? travellerTiles : activeTab === "experience" ? experienceTiles : regionTiles;

  return (
    <section className="py-24 sm:py-32 bg-[#FAF8F5] border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-[11px] font-bold uppercase tracking-luxury text-emerald-800 mb-3">
            Bespoke Portfolios
          </p>
          <h2 className="text-3xl sm:text-5xl font-editorial font-normal text-stone-900 tracking-tight">
            Start Your Journey
          </h2>

          {/* Black Tomato Style Category Tabs */}
          <div className="flex items-center justify-center gap-2 mt-8 p-1.5 bg-stone-200/80 rounded-full w-fit mx-auto">
            <button
              onClick={() => setActiveTab("traveller")}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-luxury uppercase transition-all ${
                activeTab === "traveller"
                  ? "bg-[#1A2218] text-white shadow-md"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              By Traveller
            </button>
            <button
              onClick={() => setActiveTab("experience")}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-luxury uppercase transition-all ${
                activeTab === "experience"
                  ? "bg-[#1A2218] text-white shadow-md"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              By Experience
            </button>
            <button
              onClick={() => setActiveTab("region")}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-luxury uppercase transition-all ${
                activeTab === "region"
                  ? "bg-[#1A2218] text-white shadow-md"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              By Region
            </button>
          </div>
        </div>

        {/* Tall Editorial Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {tiles.map((tile) => (
            <Link
              key={tile.title}
              href={tile.link}
              className="group relative h-[440px] sm:h-[480px] rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 flex flex-col justify-end p-6 border border-stone-200/50"
            >
              {/* Background Image with Zoom */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={tile.image}
                  alt={tile.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                />
                {/* Black Tomato Multi-Stop Dark Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 group-hover:from-black/95 transition-colors" />
              </div>

              {/* Card Label & Content */}
              <div className="relative z-10 transform group-hover:-translate-y-1 transition-transform duration-300">
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 block mb-1">
                  Aston Curated
                </span>
                <h3 className="text-xl sm:text-2xl font-editorial font-normal text-white leading-tight">
                  {tile.title}
                </h3>
                <p className="text-xs text-stone-300 mt-2 line-clamp-2 opacity-90 group-hover:opacity-100 transition-opacity font-light">
                  {tile.tagline}
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-300 font-semibold tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Explore Portfolio</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <Link
            href="/resorts"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#1A2218] hover:bg-[#2E4F28] text-white text-xs font-semibold tracking-luxury uppercase transition shadow-lg"
          >
            <span>View All Curated Escapes</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
