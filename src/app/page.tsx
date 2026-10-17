import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MessageCircle,
  Compass,
  Star,
  ShieldCheck,
  MapPin,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Waves,
  Trees,
  Mountain,
  FileText
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ResortCard from "@/components/ResortCard";
import InteractivePackagesSection from "@/components/InteractivePackagesSection";
import WhisperingTownsSection from "@/components/WhisperingTownsSection";
import LiveBlogTickerSection from "@/components/LiveBlogTickerSection";
import ClientWordsSection from "@/components/ClientWordsSection";
import { Store } from "@/lib/store";
import { destinations } from "@/data/destinations";

export default function HomePage() {
  const settings = Store.getSettings();
  const allResorts = Store.getResorts();
  const featuredResorts = allResorts.slice(0, 6);
  const featuredAh121 = Store.getResortByCode("AH-121") || allResorts[0];

  // Dynamic Content for Live Sections
  const packages = Store.getPackages();
  const blogs = Store.getBlogs();
  const reviews = Store.getReviews();

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-stone-900 font-sans selection:bg-emerald-900 selection:text-white">
      <Navbar />

      <main className="flex-1">
        {/* ================= HERO SECTION (With Misty Wayanad Animations) ================= */}
        <section className="relative min-h-[680px] lg:min-h-[740px] flex items-center justify-center overflow-hidden bg-[#121D10]">
          {/* Background Panorama with Ken Burns subtle scale */}
          <div className="absolute inset-0 z-0">
            <Image
              src={settings.heroBannerImage || "/brand/wayanad-backcover.jpg"}
              alt="Misty Wayanad Mountains and Lakes"
              fill
              className="object-cover opacity-40 scale-105 transition-transform duration-1000 ease-out"
              priority
            />
            {/* Dark green gradient vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#121D10] via-[#121D10]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#121D10]/80 via-transparent to-[#121D10]/80" />
          </div>

          {/* Animated Wayanad Mountain Mist Layers */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-1/4 -left-1/4 w-[160%] h-[160%] bg-gradient-to-r from-emerald-950/20 via-white/5 to-emerald-900/20 blur-3xl animate-mist" />
            <div className="absolute -bottom-1/4 -right-1/4 w-[160%] h-[160%] bg-gradient-to-l from-emerald-950/25 via-emerald-800/10 to-transparent blur-3xl animate-mist-reverse" />
          </div>

          {/* Historic Edakkal Stone Engraving Watermark (Subtle rotation) */}
          <div className="absolute top-12 right-12 w-64 h-64 opacity-10 pointer-events-none hidden xl:block animate-rotate-slow">
            <Image
              src="/brand/emblem.png"
              alt="Edakkal Petroglyphs Footprint"
              fill
              className="object-contain"
            />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            {/* Top Pill with gentle float */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 shadow-sm animate-float">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{settings.announcementText || "Historic Footprints of Wayanad • Authentic Stays"}</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] max-w-4xl mx-auto drop-shadow-sm">
              {settings.heroTitle}
            </h1>

            <p className="mt-6 text-base sm:text-lg text-emerald-100/90 max-w-2xl mx-auto font-normal leading-relaxed drop-shadow-sm">
              {settings.heroSubtitle}
            </p>

            {/* Quick Actions */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/resorts"
                className="inline-flex items-center gap-2 bg-[#2E4F28] hover:bg-[#233D1F] text-white text-sm font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-2xl transition transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Compass className="w-4 h-4 text-emerald-300" /> Explore {allResorts.length}+ Verified Stays
              </Link>

              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, "")}?text=Hi%20Aston%20Holidays,%20please%20suggest%20the%20best%20private%20pool%20villa%20or%20treehouse%20in%20Wayanad`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-2xl transition transform hover:-translate-y-0.5"
              >
                <MessageCircle className="w-4 h-4" /> Instant WhatsApp Recommendations
              </a>
            </div>
          </div>
        </section>

        {/* ================= INTERACTIVE PACKAGES & MARQUEE TICKER ================= */}
        {/* Aston Holidays Best Holiday Package keep scrolling, Honeymoon, Destination Events, Group Packages */}
        <InteractivePackagesSection packages={packages} whatsappNumber={settings.whatsappNumber} />

        {/* ================= SPOTLIGHT VERIFIED VILLA (Code-Protected, No Vendor Name) ================= */}
        {featuredAh121 && (
          <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-md card-hover-elevation flex flex-col lg:flex-row items-center gap-10">
              {/* Left Photo Grid or Nature Preview */}
              <div className="w-full lg:w-1/2">
                {featuredAh121.photos && featuredAh121.photos.length >= 3 ? (
                  <div className="grid grid-cols-2 gap-3 h-80 sm:h-96">
                    <div className="relative rounded-2xl overflow-hidden shadow">
                      <Image
                        src={featuredAh121.photos[0]}
                        alt="Villa view"
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-3 left-3 bg-[#1A2218]/90 text-white text-xs font-mono font-bold px-2.5 py-1 rounded-md backdrop-blur">
                        {featuredAh121.code}
                      </div>
                    </div>

                    <div className="grid grid-rows-2 gap-3">
                      <div className="relative rounded-2xl overflow-hidden shadow">
                        <Image
                          src={featuredAh121.photos[1]}
                          alt="Interior"
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                      <div className="relative rounded-2xl overflow-hidden shadow">
                        <Image
                          src={featuredAh121.photos[2]}
                          alt="Bedroom"
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-[#1A2218]/40 flex items-center justify-center text-white text-xs font-bold">
                          +{featuredAh121.photos.length} High-Res Photos
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-80 sm:h-96 rounded-3xl bg-gradient-to-br from-[#121A11] via-[#1E2E1D] to-[#0E150D] p-8 flex flex-col justify-between text-white border border-emerald-900/40 shadow-inner relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="bg-white/10 backdrop-blur px-3 py-1 rounded-lg font-mono text-xs font-bold text-emerald-300">
                        {featuredAh121.code}
                      </span>
                      <span className="text-xs text-stone-300 font-medium">
                        {featuredAh121.destination}, Wayanad
                      </span>
                    </div>
                    <div className="my-auto text-center py-6">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3">
                        <Sparkles className="w-8 h-8 text-amber-300" />
                      </div>
                      <h4 className="text-xl font-black text-white">{featuredAh121.code} • {featuredAh121.bedrooms}BHK</h4>
                      <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto">
                        {featuredAh121.accommodationType} • {featuredAh121.destination}
                      </p>
                      <span className="inline-block mt-3 text-[11px] font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-full">
                        Photos updating after latest photo shoot
                      </span>
                    </div>
                    <div className="text-xs text-stone-400 flex items-center justify-between border-t border-white/10 pt-3">
                      <span>Aston Verified Luxury</span>
                      <span className="text-emerald-400 font-bold">₹{featuredAh121.pricePerNight.toLocaleString("en-IN")}/night</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Details */}
              <div className="w-full lg:w-1/2">
                <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mb-3">
                  <Waves className="w-3.5 h-3.5" /> Featured Spotlight Villa
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                  {featuredAh121.code} • {featuredAh121.bedrooms}BHK {featuredAh121.accommodationType}
                </h2>
                <p className="text-xs text-stone-500 flex items-center gap-1 mt-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  {featuredAh121.destination}, Wayanad
                </p>

                <p className="mt-4 text-xs sm:text-sm text-stone-600 leading-relaxed font-serif">
                  {featuredAh121.overview}
                </p>

                {/* Amenities Badges */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {featuredAh121.amenities.slice(0, 4).map((amenity, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-stone-100 text-stone-700 px-3 py-1 rounded-lg font-medium flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                      {amenity}
                    </span>
                  ))}
                </div>

                {/* Price and Actions */}
                <div className="mt-8 pt-6 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-stone-400 block font-medium">Tariff from</span>
                    <p className="text-2xl font-black text-[#2E4F28]">
                      ₹{featuredAh121.pricePerNight.toLocaleString("en-IN")}
                      <span className="text-xs font-normal text-stone-500"> /night</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      href={`/brochure/${featuredAh121.code}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 px-4 py-2.5 rounded-xl transition"
                    >
                      <FileText className="w-3.5 h-3.5 text-emerald-800" /> 12-Page Brochure
                    </Link>

                    <a
                      href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, "")}?text=Hi,%20I%20am%20interested%20in%20booking%20[${featuredAh121.code}]%20${featuredAh121.bedrooms}BHK%20${encodeURIComponent(featuredAh121.accommodationType)}%20in%20${encodeURIComponent(featuredAh121.destination)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#2E4F28] hover:bg-[#233D1F] px-5 py-2.5 rounded-xl transition shadow"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> Book on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ================= GO & DISCOVER: WHISPERING TOWNS ================= */}
        <WhisperingTownsSection />

        {/* ================= BLOG & NEWS (LIVE SCROLLING TICKER) ================= */}
        <LiveBlogTickerSection blogs={blogs} />

        {/* ================= WHAT'S OUR CLIENT'S WORDS ================= */}
        <ClientWordsSection reviews={reviews} />

        {/* ================= ALL VERIFIED RESORTS CATALOG ================= */}
        <section className="py-20 bg-[#F4F5F7] border-y border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
                  Handpicked Stays
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight mt-2">
                  Featured Wayanad Stays (Code-Protected)
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 mt-1">
                  Private pool villas, romantic treehouses, and plantation stays across Wayanad.
                </p>
              </div>

              <Link
                href="/resorts"
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition"
              >
                <span>View all {allResorts.length} stays</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredResorts.map((resort) => (
                <div key={resort.id} className="card-hover-elevation">
                  <ResortCard resort={resort} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= HERITAGE & FOOTPRINT STORY ================= */}
        <section className="py-20 bg-[#121D10] text-white relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-96 h-96 opacity-10 pointer-events-none">
            <Image
              src="/brand/emblem.png"
              alt="Edakkal Footprint"
              fill
              className="object-contain"
            />
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-1/2 relative h-80 sm:h-96 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <Image
                src={settings.heritageImage || "/brand/edakkal-footprint.jpg"}
                alt="Ancient Edakkal Caves Petroglyphs"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121D10] via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-xs font-mono">
                Prehistoric Wayanad Petroglyphs
              </div>
            </div>

            <div className="w-full lg:w-1/2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800">
                The Aston Holidays Heritage
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-3">
                {settings.heritageStoryTitle}
              </h2>
              <p className="mt-4 text-xs sm:text-sm text-stone-300 leading-relaxed font-normal">
                {settings.heritageStoryText}
              </p>
              <div className="mt-6 flex items-center gap-6">
                <div>
                  <p className="text-2xl font-black text-emerald-400">6,000+ BCE</p>
                  <p className="text-[11px] text-stone-400">Neolithic Footprints</p>
                </div>
                <div className="h-8 w-px bg-white/20" />
                <div>
                  <p className="text-2xl font-black text-emerald-400">100%</p>
                  <p className="text-[11px] text-stone-400">Authentic Hospitality</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
