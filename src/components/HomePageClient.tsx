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
  Quote,
  Star,
  ExternalLink
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

  const googleMapsReviewsUrl = "https://www.google.com/maps/place/Aston+Holidays/@11.6562271,76.2258309,17z/data=!4m8!3m7!1s0x3ba6099dacee0a19:0x9c8165c6ee5ac6ae!8m2!3d11.6562271!4d76.2258309!9m1!1b1!16s%2Fg%2F11nqxw_7bz?entry=ttu";

  // Verified Google Reviews from Aston Holidays Wayanad
  const testimonials = [
    {
      quote: "Hands down the most wonderful luxury stay experience in Wayanad! The private infinity pool villa overlooking the valley was impeccably clean and peaceful. Aston Holidays curated every moment seamlessly.",
      author: "Dr. Siddharth & Family",
      location: "Bangalore",
      rating: 5,
      stayDetails: "Private Pool Villa Stay"
    },
    {
      quote: "We planned our honeymoon with Aston Holidays and it was sheer perfection. Romantic candlelight dinner by the pool, glass canopy treehouse stay, and 100% transparent rates. Highly recommended!",
      author: "Ananya & Rahul Verma",
      location: "Mumbai",
      rating: 5,
      stayDetails: "Honeymoon Experience"
    },
    {
      quote: "Booked an entire 4BHK estate for our group reunion. Having the entire property, private pool, and campfire exclusively to ourselves made it unforgettable. Zero middlemen, genuine local expertise.",
      author: "Karthik Menon & Friends",
      location: "Chennai",
      rating: 5,
      stayDetails: "Group Estate Stay"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F4EE] text-stone-900 font-sans selection:bg-[#7eb840] selection:text-[#0A130B]">
      
      {/* Luxury Navbar with transparent-to-frosted transition */}
      <LuxuryNavbar onOpenEnquiry={() => handleOpenEnquiry()} settings={settings} />

      <main className="flex-1">
        
        {/* ================= 1. BLACK TOMATO AMBIENT VIDEO HERO ================= */}
        <LuxuryHeroVideo
          settings={settings}
          onOpenEnquiry={() => handleOpenEnquiry()}
        />

        {/* ================= 2. THE PHILOSOPHY MANIFESTO (Black Tomato Signature Section) ================= */}
        <section className="py-24 sm:py-32 bg-[#F7F4EE] relative overflow-hidden" id="philosophy">
          
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
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#7eb840]/10 text-[#6da634] border border-[#7eb840]/30 text-[11px] font-bold tracking-[0.2em] uppercase mb-6">
              <Sparkles className="w-3.5 h-3.5 text-[#7eb840]" />
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
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#0A130B] hover:bg-[#7eb840] text-white hover:text-[#0A130B] text-xs font-semibold tracking-luxury uppercase transition-all shadow-xl hover:shadow-[#7eb840]/30"
              >
                <span>Get In Touch with our Concierge</span>
                <ArrowRight className="w-4 h-4 text-[#7eb840]" />
              </button>
            </div>

          </div>
        </section>

        {/* ================= 3. GOOGLE REVIEWS & DISCERNING TRAVELER WORDS ================= */}
        <section className="py-20 bg-white border-y border-stone-200" id="reviews">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Google Reviews Trust Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between pb-10 border-b border-stone-100 gap-4">
              <div className="flex items-center gap-3.5 text-center sm:text-left">
                {/* Official Google G Logo SVG */}
                <div className="w-10 h-10 rounded-2xl bg-white border border-stone-200/80 shadow-sm flex items-center justify-center p-2 shrink-0">
                  <svg className="w-full h-full" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-bold text-stone-900 font-sans tracking-tight">EXCELLENT</span>
                    <span className="text-sm font-extrabold text-[#7eb840]">5.0</span>
                    <div className="flex items-center text-amber-400 gap-0.5 ml-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] text-stone-500 font-medium">
                    Based on verified traveler reviews on Google Maps
                  </p>
                </div>
              </div>

              <a
                href={googleMapsReviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-stone-200 hover:border-[#7eb840] text-xs font-semibold text-stone-700 hover:text-[#7eb840] bg-stone-50/80 hover:bg-stone-100 transition shadow-sm"
              >
                <span>Read all Google Reviews</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Testimonials 3-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
              {testimonials.map((t, idx) => (
                <div
                  key={idx}
                  className="bg-[#FAF8F5] p-6 rounded-3xl border border-stone-200/70 flex flex-col justify-between space-y-4 hover:shadow-md transition"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-amber-400 gap-0.5">
                        {[...Array(t.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-700" /> Google Verified
                      </span>
                    </div>

                    <p className="text-sm sm:text-[14.5px] font-editorial italic font-normal text-stone-800 leading-relaxed">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-200/60 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-stone-900">{t.author}</p>
                      <p className="text-[11px] text-stone-500 font-light">{t.location} • {t.stayDetails}</p>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-white border border-stone-200 flex items-center justify-center font-bold text-[10px] text-stone-600">
                      {t.author.charAt(0)}
                    </div>
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
              <a
                href={googleMapsReviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#7eb840] transition flex items-center gap-1"
              >
                <span>5.0 Star Rated on Google Maps</span>
                <ExternalLink className="w-3 h-3 text-[#7eb840]" />
              </a>
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
