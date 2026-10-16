import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Compass, Star, ShieldCheck, MapPin, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ResortCard from "@/components/ResortCard";
import { Store } from "@/lib/store";
import { destinations } from "@/data/destinations";

export default function HomePage() {
  const settings = Store.getSettings();
  const featuredResorts = Store.getResorts().slice(0, 4);
  const featuredAh121 = Store.getResortByCode("AH-121");

  return (
    <>
      <Navbar />

      <main className="flex-1">
        {/* ================= HERO SECTION (Customizable via /admin/customizer) ================= */}
        <section className="relative min-h-[620px] flex items-center justify-center overflow-hidden bg-[#1A2218]">
          {/* Background Panorama */}
          <div className="absolute inset-0 z-0">
            <Image
              src={settings.heroBannerImage || "/brand/wayanad-backcover.jpg"}
              alt="Wayanad Hills and Lakes"
              fill
              className="object-cover opacity-35 scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A2218] via-[#1A2218]/50 to-transparent" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{settings.announcementText || "Historic Footprints of Wayanad & Curated Escapes"}</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
              {settings.heroTitle}
            </h1>

            <p className="mt-5 text-base sm:text-lg text-stone-300 max-w-2xl mx-auto font-normal leading-relaxed">
              {settings.heroSubtitle}
            </p>

            {/* Quick Actions */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/resorts"
                className="inline-flex items-center gap-2 bg-[#2E4F28] hover:bg-[#244020] text-white text-sm font-semibold px-7 py-3.5 rounded-full shadow-lg hover:shadow-xl transition"
              >
                <Compass className="w-4 h-4" /> Browse Stays & Villas
              </Link>

              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, "")}?text=Hi%20Aston%20Holidays,%20please%20suggest%20the%20best%20pool%20villa%20in%20Wayanad`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-7 py-3.5 rounded-full shadow-lg hover:shadow-xl transition"
              >
                <MessageCircle className="w-4 h-4" /> Inquire on WhatsApp
              </a>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-stone-300">
              <div className="flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% Verified Villas
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Instant PDF Brochures
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Local Wayanad Experts
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Best Price Guarantee
              </div>
            </div>
          </div>
        </section>

        {/* ================= SPOTLIGHT FEATURE: AH-121 ================= */}
        {featuredAh121 && (
          <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-md flex flex-col lg:flex-row items-center gap-10">
              {/* Left Photo Grid */}
              <div className="w-full lg:w-1/2 grid grid-cols-2 gap-3 h-80 sm:h-96">
                <div className="relative rounded-2xl overflow-hidden shadow">
                  <Image
                    src="/brochure-assets/extracted_img_2.jpg"
                    alt="AH-121 Infinity Pool"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-[#1A2218] text-white text-xs font-mono font-bold px-2.5 py-1 rounded">
                    AH-121
                  </div>
                </div>
                <div className="grid grid-rows-2 gap-3">
                  <div className="relative rounded-2xl overflow-hidden shadow">
                    <Image
                      src="/brochure-assets/extracted_img_3.jpg"
                      alt="AH-121 Teak Bedroom"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative rounded-2xl overflow-hidden shadow">
                    <Image
                      src="/brochure-assets/extracted_img_7.jpg"
                      alt="AH-121 Mountain View"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Right Content */}
              <div className="w-full lg:w-1/2 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2E4F28] bg-emerald-50 px-3 py-1 rounded-full">
                  Featured Property Spotlight
                </span>
                <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight">
                  [AH-121] 3BHK-Private Pool Villa
                </h2>
                <p className="text-sm text-stone-500 font-medium flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-700" /> Padinjarathara (Near Banasura Dam), Wayanad
                </p>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Perched on a serene hillock overlooking the Banasura hills and waters. Complete with a private cliffside infinity swimming pool, teak master suites, sunset verandas, and high-speed Wi-Fi.
                </p>

                <div className="grid grid-cols-2 gap-3 text-xs text-stone-700 pt-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" /> Private Infinity Pool
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" /> Banasura Hill & Sunset View
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" /> Up to 12 Guests Capacity
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" /> Candle Dinner & Campfire
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <Link
                    href="/brochure/AH-121"
                    className="inline-flex items-center gap-2 bg-[#1A2218] hover:bg-black text-white text-xs font-bold px-6 py-3 rounded-xl transition shadow"
                  >
                    View Official 12-Page Brochure <ArrowRight className="w-4 h-4" />
                  </Link>

                  <a
                    href="https://wa.me/919744900414?text=Hi%20Aston%20Holidays,%20I%20am%20interested%20in%20booking%20AH-121%203BHK%20Pool%20Villa%20in%20Padinjarathara"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-3 rounded-xl transition shadow"
                  >
                    <MessageCircle className="w-4 h-4" /> WhatsApp Reservation
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================= FEATURED RESORTS COLLECTION ================= */}
        <section className="py-16 bg-stone-50 border-y border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Aston Holidays Signature Collection
                </span>
                <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
                  Handpicked Stays & Rainforest Escapes
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 mt-1">
                  Each property comes with verified photos, amenities list, and instant PDF brochures.
                </p>
              </div>

              <Link
                href="/resorts"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition"
              >
                View all properties ({Store.getResorts().length}) <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredResorts.map((resort) => (
                <ResortCard key={resort.id} resort={resort} />
              ))}
            </div>
          </div>
        </section>

        {/* ================= HISTORIC FOOTPRINTS STORY (Customizable) ================= */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Historic Footprint Graphic */}
            <div className="relative rounded-3xl overflow-hidden bg-white p-6 shadow-xl border border-stone-200">
              <div className="relative w-full h-[400px] rounded-2xl overflow-hidden bg-stone-50">
                <Image
                  src={settings.heritageImage || "/brand/edakkal-footprint.jpg"}
                  alt="Historic Footprints of Wayanad"
                  fill
                  className="object-contain p-4"
                />
              </div>
              <div className="mt-4 text-center">
                <span className="text-xs font-semibold text-stone-500">
                  Inspired by the prehistoric rock petroglyphs at Edakkal Caves, Wayanad
                </span>
              </div>
            </div>

            {/* Story Content */}
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100/60 px-3 py-1 rounded-full">
                The Heritage of Wayanad
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight leading-snug">
                {settings.heritageStoryTitle}
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-wrap">
                {settings.heritageStoryText}
              </p>

              <div className="pt-2 flex items-center gap-4">
                <div className="p-3 bg-stone-100 rounded-xl text-center min-w-[100px]">
                  <p className="text-2xl font-black text-stone-900">{Store.getResorts().length}</p>
                  <p className="text-[11px] font-medium text-stone-500">Curated Stays</p>
                </div>
                <div className="p-3 bg-stone-100 rounded-xl text-center min-w-[100px]">
                  <p className="text-2xl font-black text-stone-900">10</p>
                  <p className="text-[11px] font-medium text-stone-500">Destinations</p>
                </div>
                <div className="p-3 bg-stone-100 rounded-xl text-center min-w-[100px]">
                  <p className="text-2xl font-black text-stone-900">100%</p>
                  <p className="text-[11px] font-medium text-stone-500">WhatsApp Verified</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= WAYANAD DESTINATIONS GRID ================= */}
        <section className="py-16 bg-white border-t border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Explore Destinations
              </span>
              <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
                Discover the Diverse Landscapes of Wayanad
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-2">
                From high-altitude mist ghats to serene lake reservoirs and wildlife sanctuaries.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations.slice(0, 6).map((dest) => (
                <Link
                  key={dest.slug}
                  href={`/resorts?destination=${encodeURIComponent(dest.name)}`}
                  className="group relative h-64 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <Image
                    src={dest.image}
                    alt={dest.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                      {dest.resortCount} Stays Available
                    </span>
                    <h3 className="text-xl font-bold mt-0.5">{dest.name}</h3>
                    <p className="text-xs text-stone-300 line-clamp-1 mt-0.5 font-light">
                      {dest.tagline}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ================= WHATSAPP CALLOUT BANNER ================= */}
        <section className="py-16 bg-[#2E4F28] text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-semibold">
              <MessageCircle className="w-4 h-4 text-emerald-300" /> Fast Response Within Minutes
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Looking for a Custom Resort Itinerary or Pool Villa?
            </h2>
            <p className="text-sm sm:text-base text-emerald-100 max-w-xl mx-auto">
              Message our travel specialists on WhatsApp. Tell us your dates, group size, and budget, and we’ll send the best options straight to your phone.
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, "")}?text=Hi%20Aston%20Holidays,%20I%20am%20looking%20for%20resort%20options%20in%20Wayanad`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-[#2E4F28] hover:bg-stone-100 text-sm font-bold px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl transition"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" /> Chat with Aston Holidays Desk
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
