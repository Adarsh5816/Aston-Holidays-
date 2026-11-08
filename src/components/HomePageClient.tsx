"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Waves,
  FileText,
  Quote
} from "lucide-react";

import LuxuryNavbar from "@/components/LuxuryNavbar";
import LuxuryFooter from "@/components/LuxuryFooter";
import LuxuryHeroVideo from "@/components/LuxuryHeroVideo";
import BespokeEnquiryModal from "@/components/BespokeEnquiryModal";
import TheFeelingsEngine from "@/components/TheFeelingsEngine";
import StartYourJourneyTabs from "@/components/StartYourJourneyTabs";
import TheKeepersSection from "@/components/TheKeepersSection";
import WhisperingTownsSection from "@/components/WhisperingTownsSection";
import InteractivePackagesSection from "@/components/InteractivePackagesSection";
import LiveBlogTickerSection from "@/components/LiveBlogTickerSection";
import ResortCard from "@/components/ResortCard";
import { SiteSettings, Resort, HolidayPackage, BlogPost } from "@/lib/types";

interface HomePageClientProps {
  settings: SiteSettings;
  resorts: Resort[];
  packages: HolidayPackage[];
  blogs: BlogPost[];
}

export default function HomePageClient({
  settings,
  resorts,
  packages,
  blogs
}: HomePageClientProps) {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [enquiryFeeling, setEnquiryFeeling] = useState<string | undefined>(undefined);

  const featuredResorts = resorts.slice(0, 6);
  const featuredAh121 = resorts.find((r) => r.code === "AH-121") || resorts[0];

  const handleOpenEnquiry = (feelingName?: string) => {
    setEnquiryFeeling(feelingName);
    setIsEnquiryOpen(true);
  };

  // Black Tomato Style Editorial Testimonials
  const testimonials = [
    {
      quote: "Hands down it was the most amazing experience our family has ever done. Waking up to private pool views over the lake was unforgettable.",
      author: "Dr. Siddharth & Family",
      location: "Bangalore • Stayed at AH-121 3BHK Villa"
    },
    {
      quote: "We have explored some incredible luxury properties, but the silence, canopy treehouses, and candlelight dinners curated by Aston were sheer perfection.",
      author: "Ananya & Rahul Verma",
      location: "Mumbai • Honeymoon Package"
    },
    {
      quote: "Aston Holidays delivered a once-in-a-lifetime escape that my friends and I will forever cherish. No middlemen, transparent rates, pure hospitality.",
      author: "Karthik Menon & Group",
      location: "Chennai • Private Estate Stay"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 font-sans selection:bg-[#2E4F28] selection:text-white">
      
      {/* Luxury Navbar with transparent-to-frosted transition */}
      <LuxuryNavbar onOpenEnquiry={() => handleOpenEnquiry()} settings={settings} />

      <main className="flex-1">
        
        {/* ================= 1. BLACK TOMATO AMBIENT VIDEO HERO ================= */}
        <LuxuryHeroVideo
          settings={settings}
          onOpenEnquiry={() => handleOpenEnquiry()}
        />

        {/* ================= 2. THE PHILOSOPHY MANIFESTO (Black Tomato Signature Section) ================= */}
        <section className="py-24 sm:py-32 bg-[#FAF8F5] relative overflow-hidden" id="philosophy">
          
          {/* Subtle Watermark Emblem */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-[0.03] pointer-events-none">
            <Image
              src="/brand/emblem.png"
              alt="Edakkal Petroglyphs"
              fill
              className="object-contain"
            />
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/10 text-emerald-900 text-[11px] font-bold tracking-luxury uppercase mb-6">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              The Aston Philosophy
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-editorial font-normal text-stone-900 tracking-tight leading-[1.18] mb-8">
              Every journey starts with a feeling
            </h2>

            <div className="space-y-6 text-sm sm:text-base text-stone-700 font-light leading-relaxed max-w-3xl mx-auto font-sans-luxury">
              <p>
                The world is vast, full of wonders. But information engulfs us. See this, do that, don’t miss this. It seems the more choices there are, the more overwhelmed we feel. What’s more, you’re rarely asked <em className="font-editorial text-stone-900 font-normal">how you want to feel</em>.
              </p>
              
              <p>
                That’s not us. <strong className="text-stone-900 font-semibold">Aston Holidays</strong> is a tailor-made luxury travel house that designs personal escapes across Wayanad—not templates, not off-the-shelf tours. Whether you’re a couple seeking romantic stillness by a private infinity pool, a multi-generational family exploring together, or a solo traveler chasing misty mountain trails, we craft every detail around you.
              </p>
              
              <p>
                For over a decade, we have been recognized as Wayanad's dedicated luxury travel planners—trusted to deliver tailor-made journeys across 37+ verified private sanctuaries, with transparent direct rates and zero planning fees.
              </p>
              
              <p className="font-editorial text-lg sm:text-xl text-stone-900 pt-2">
                So let’s begin. Let’s do something remarkable.
              </p>
            </div>

            <div className="mt-10">
              <button
                onClick={() => handleOpenEnquiry()}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#1A2218] hover:bg-[#2E4F28] text-white text-xs font-semibold tracking-luxury uppercase transition-all shadow-xl hover:shadow-stone-900/40"
              >
                <span>Get In Touch with our Concierge</span>
                <ArrowRight className="w-4 h-4 text-emerald-300" />
              </button>
            </div>

          </div>
        </section>

        {/* ================= 3. DISCERNING TRAVELER WORDS (Black Tomato Testimonial Layout) ================= */}
        <section className="py-20 bg-white border-y border-stone-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {testimonials.map((t, idx) => (
                <div key={idx} className="flex flex-col justify-between text-center md:text-left space-y-4">
                  <div>
                    <Quote className="w-6 h-6 text-emerald-700/50 mb-3 mx-auto md:mx-0" />
                    <p className="text-sm sm:text-[15px] font-editorial italic font-normal text-stone-800 leading-relaxed">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </div>
                  <div className="pt-2">
                    <p className="text-xs font-semibold text-emerald-900">{t.author}</p>
                    <p className="text-[11px] text-stone-500 font-light">{t.location}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Approved Kerala Tourism Trust Badge */}
            <div className="mt-14 pt-8 border-t border-stone-100 flex flex-wrap items-center justify-center gap-8 text-[11px] text-stone-500 uppercase tracking-luxury font-semibold">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                Approved Kerala DMC Destination Expert
              </span>
              <span>•</span>
              <span>37+ Direct Verified Properties</span>
              <span>•</span>
              <span>100% WhatsApp Booking Assistance</span>
            </div>
          </div>
        </section>

        {/* ================= 4. THE FEELINGS ENGINE (Black Tomato Mood Finder) ================= */}
        <TheFeelingsEngine
          resorts={resorts}
          onOpenEnquiry={handleOpenEnquiry}
        />

        {/* ================= 5. START YOUR JOURNEY (Tall Editorial Cards) ================= */}
        <StartYourJourneyTabs />

        {/* ================= 6. MEET THE KEEPERS OF WAYANAD ================= */}
        <TheKeepersSection onOpenEnquiry={() => handleOpenEnquiry()} />

        {/* ================= 7. SPOTLIGHT SANCTUARY (AH-121 3BHK Private Pool Villa) ================= */}
        {featuredAh121 && (
          <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl p-6 sm:p-12 border border-stone-200/90 shadow-lg flex flex-col lg:flex-row items-center gap-12">
              
              {/* Left Photo Grid */}
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
                        <div className="absolute inset-0 bg-[#1A2218]/40 flex items-center justify-center text-white text-xs font-bold tracking-wider">
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
                      <h4 className="text-2xl font-editorial text-white">{featuredAh121.code} • {featuredAh121.bedrooms}BHK</h4>
                      <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto">
                        {featuredAh121.accommodationType} • {featuredAh121.destination}
                      </p>
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
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 text-xs font-bold tracking-luxury uppercase mb-3">
                  <Waves className="w-3.5 h-3.5 text-emerald-700" /> Signature Spotlight Sanctuary
                </div>
                
                <h2 className="text-3xl sm:text-4xl font-editorial font-normal text-stone-900 tracking-tight">
                  {featuredAh121.code} • {featuredAh121.bedrooms}BHK {featuredAh121.accommodationType}
                </h2>
                
                <p className="text-xs text-stone-500 flex items-center gap-1 mt-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  {featuredAh121.destination}, Wayanad
                </p>

                <p className="mt-4 text-xs sm:text-sm text-stone-600 leading-relaxed font-light font-sans-luxury">
                  {featuredAh121.overview}
                </p>

                {/* Amenities Badges */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {featuredAh121.amenities.slice(0, 4).map((amenity, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-stone-100 text-stone-700 px-3 py-1.5 rounded-lg font-medium flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                      {amenity}
                    </span>
                  ))}
                </div>

                {/* Price and Actions */}
                <div className="mt-8 pt-6 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-stone-400 uppercase tracking-wider block font-medium">Tariff from</span>
                    <p className="text-2xl font-bold text-[#2E4F28]">
                      ₹{featuredAh121.pricePerNight.toLocaleString("en-IN")}
                      <span className="text-xs font-normal text-stone-500"> /night</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      href={`/brochure/${featuredAh121.code}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 px-4 py-2.5 rounded-full transition"
                    >
                      <FileText className="w-3.5 h-3.5 text-emerald-800" /> 12-Page Brochure
                    </Link>

                    <button
                      onClick={() => handleOpenEnquiry(`Featured Sanctuary ${featuredAh121.code}`)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#1A2218] hover:bg-[#2E4F28] px-6 py-2.5 rounded-full transition shadow"
                    >
                      <span>Enquire</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </section>
        )}

        {/* ================= 8. GO & DISCOVER: WHISPERING TOWNS ================= */}
        <div id="whispering-towns">
          <WhisperingTownsSection />
        </div>

        {/* ================= 9. INTERACTIVE PACKAGES & MARQUEE TICKER ================= */}
        <div id="packages">
          <InteractivePackagesSection packages={packages} whatsappNumber={settings.whatsappNumber} />
        </div>

        {/* ================= 10. BLOG & NEWS (LIVE SCROLLING TICKER) ================= */}
        <div id="blogs">
          <LiveBlogTickerSection blogs={blogs} />
        </div>

        {/* ================= 11. ALL VERIFIED RESORTS CATALOG ================= */}
        <section className="py-24 bg-[#F4F5F7] border-y border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-luxury text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Curated Sanctuaries
                </span>
                <h2 className="text-3xl sm:text-4xl font-editorial font-normal text-stone-900 tracking-tight mt-3">
                  Verified Wayanad Stays
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 mt-1 font-light">
                  Private pool villas, romantic treehouses, and plantation stays across Wayanad.
                </p>
              </div>

              <Link
                href="/resorts"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#2E4F28] hover:text-emerald-950 uppercase tracking-luxury transition"
              >
                <span>View all {resorts.length} stays</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredResorts.map((resort) => (
                <div key={resort.id} className="card-hover-elevation">
                  <ResortCard resort={resort} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 12. HERITAGE & FOOTPRINT STORY ================= */}
        <section className="py-24 bg-[#121D10] text-white relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-96 h-96 opacity-10 pointer-events-none">
            <Image
              src="/brand/emblem.png"
              alt="Edakkal Footprint"
              fill
              className="object-contain"
            />
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center gap-14">
            <div className="w-full lg:w-1/2 relative h-80 sm:h-96 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <Image
                src={settings.heritageImage || "/brand/edakkal-footprint.jpg"}
                alt="Ancient Edakkal Caves Petroglyphs"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121D10] via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 text-xs font-mono">
                Prehistoric Wayanad Petroglyphs • 6,000 BCE
              </div>
            </div>

            <div className="w-full lg:w-1/2">
              <span className="text-[11px] font-bold uppercase tracking-luxury text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800">
                The Aston Holidays Heritage
              </span>
              <h2 className="text-3xl sm:text-5xl font-editorial font-normal text-white tracking-tight mt-4 leading-tight">
                {settings.heritageStoryTitle}
              </h2>
              <p className="mt-4 text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
                {settings.heritageStoryText}
              </p>
              <div className="mt-8 flex items-center gap-8">
                <div>
                  <p className="text-3xl font-editorial font-bold text-emerald-400">6,000+ BCE</p>
                  <p className="text-[11px] text-stone-400 uppercase tracking-luxury mt-1">Neolithic Petroglyphs</p>
                </div>
                <div className="h-10 w-px bg-white/20" />
                <div>
                  <p className="text-3xl font-editorial font-bold text-emerald-400">100%</p>
                  <p className="text-[11px] text-stone-400 uppercase tracking-luxury mt-1">Authentic Hospitality</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Luxury Footer */}
      <LuxuryFooter onOpenEnquiry={() => handleOpenEnquiry()} settings={settings} />

      {/* Interactive Bespoke Enquiry Modal */}
      <BespokeEnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        initialFeeling={enquiryFeeling}
      />

    </div>
  );
}
