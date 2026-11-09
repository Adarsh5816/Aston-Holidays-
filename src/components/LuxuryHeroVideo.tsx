"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  ArrowRight,
  ShieldCheck,
  MessageCircle,
  ChevronDown
} from "lucide-react";
import { SiteSettings } from "@/lib/types";

interface LuxuryHeroVideoProps {
  settings: SiteSettings;
  onOpenEnquiry: () => void;
}

export default function LuxuryHeroVideo({ settings, onOpenEnquiry }: LuxuryHeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);

  // Atmospheric slides with terracotta accents
  const slides = [
    {
      eyebrow: "ABOVE CLOUDS & CANOPIES",
      line1: "Stillness",
      accent: "amidst the mist",
      line2: "and quiet peaks.",
      sub1: "Private infinity pool estates and glass canopy treehouses.",
      sub2: "Crafted exclusively around your personal pace."
    },
    {
      eyebrow: "A DIFFERENT KIND OF WILD",
      line1: "Go where",
      accent: "the green",
      line2: "gets deep.",
      sub1: "Small, considered journeys through Wayanad.",
      sub2: "Made slowly. Remembered forever."
    },
    {
      eyebrow: "BESPOKE PRIVATE ESCAPES",
      line1: "A journey",
      accent: "designed around",
      line2: "how you feel.",
      sub1: "Tailor-made itineraries across 37+ verified private sanctuaries.",
      sub2: "Zero middleman surcharges. 24/7 dedicated travel architect."
    }
  ];

  const primaryVideoSource = settings.heroVideoUrl || "/videos/wayanad-hero.mp4";

  // WhatsApp Concierge direct link
  const rawPhone = settings.whatsappNumber || "+919744900414";
  const whatsappDigits = rawPhone.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(
    "Hello Aston Holidays, I would like to plan a bespoke luxury holiday to Wayanad."
  )}`;

  // Autoplay video safely
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.defaultMuted = true;
    video.muted = true;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Autoplay was blocked, will resume upon gesture
        });
    }
  }, []);

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  // Cycle through atmospheric slides every 9 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 9000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const currentSlide = slides[activeSlide];

  return (
    <section className="relative w-full h-screen min-h-[100dvh] flex items-center justify-between overflow-hidden bg-[#0A130B] select-none">
      
      {/* ================= 1. PURE CLEAN VIDEO BACKGROUND (NO STATIC OVERLAPPING TEXT IMAGES) ================= */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-[#070E08]">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="auto"
          poster={settings.heroVideoPoster || "/brand/wayanad-backcover.jpg"}
          src={primaryVideoSource}
          className="absolute inset-0 w-full h-full object-cover"
        >
          {primaryVideoSource && <source src={primaryVideoSource} type="video/mp4" />}
          <source src="/videos/wayanad-hero.mp4" type="video/mp4" />
        </video>

        {/* Ambient atmospheric gradients for pure legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/35 pointer-events-none" />
      </div>

      {/* ================= 2. CLEAN EDITORIAL HERO CONTENT ================= */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-24 sm:py-28 flex flex-col justify-center items-start text-left h-full pointer-events-none">
        
        <div className="max-w-2xl lg:max-w-3xl pointer-events-auto">
          
          {/* Eyebrow with Leading Dash Line */}
          <div className="flex items-center gap-3 text-[#7eb840] text-[11px] sm:text-xs font-semibold tracking-[0.28em] uppercase mb-5 sm:mb-7 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            <span className="w-8 sm:w-10 h-[1.5px] bg-[#7eb840]" />
            <span>{currentSlide.eyebrow}</span>
          </div>

          {/* Signature 3-Line Headline with Terracotta Italic Accent */}
          <h1
            className="text-5xl sm:text-7xl lg:text-[5.5rem] xl:text-[6.2rem] font-editorial font-normal text-[#F6F4EE] tracking-[-0.025em] leading-[1.04] antialiased drop-shadow-[0_4px_30px_rgba(0,0,0,0.7)] transition-all duration-700"
          >
            {currentSlide.line1} <br />
            <span className="italic font-normal text-[#7eb840] font-editorial drop-shadow-[0_4px_30px_rgba(0,0,0,0.7)]">
              {currentSlide.accent}
            </span>{" "}
            <br />
            {currentSlide.line2}
          </h1>

          {/* Bottom Actions: Fully Transparent Words (No Circles, No Tile Highlighters) */}
          <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10">
            
            {/* 2-Line Narrative Subtext */}
            <div className="text-xs sm:text-[13px] text-[#E5E0D8]/90 font-light leading-relaxed font-sans max-w-xs drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
              <p>{currentSlide.sub1}</p>
              <p className="mt-0.5">{currentSlide.sub2}</p>
            </div>

            {/* Transparent "Explore Journeys" (No circle border, no circle background, just clean words) */}
            <a
              href="#feelings-engine"
              className="group inline-flex items-center gap-2 text-xs sm:text-sm font-sans font-semibold uppercase tracking-[0.22em] text-[#F6F4EE] hover:text-[#7eb840] transition-colors py-1 border-b border-white/20 hover:border-[#7eb840] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
            >
              <span>Explore Journeys</span>
              <span className="text-sm text-[#7eb840] group-hover:translate-y-1 transition-transform">↓</span>
            </a>

            {/* Transparent "Plan Journey" (No tile highlighter, no pill background, just clean words) */}
            <div className="flex items-center gap-6">
              <button
                onClick={onOpenEnquiry}
                className="group inline-flex items-center gap-2 text-xs sm:text-sm font-sans font-semibold uppercase tracking-[0.22em] text-[#F6F4EE] hover:text-[#7eb840] transition-colors py-1 border-b border-white/20 hover:border-[#7eb840] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
              >
                <span>Plan Journey</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#7eb840] group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-sans font-semibold uppercase tracking-[0.22em] text-[#F6F4EE]/90 hover:text-[#7eb840] transition-colors py-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
                title="Chat with Concierge on WhatsApp"
              >
                <MessageCircle className="w-4 h-4 text-[#7eb840]" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
            </div>

          </div>

          {/* Luxury Travel Assurances (Transparent, no heavy tile pill) */}
          <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-6 text-xs text-[#E5E0D8]/80 font-medium tracking-wider drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
            <span className="flex items-center gap-1.5 text-[#F6F4EE]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#7eb840] shrink-0" />
              Dedicated Travel Architect
            </span>
            <span className="text-white/30 hidden sm:inline">•</span>
            <span>Tailor-Made Itineraries</span>
            <span className="text-white/30 hidden sm:inline">•</span>
            <span>Seamless 24/7 Concierge</span>
          </div>

        </div>

      </div>

      {/* ================= 3. WAYANAD EXACT GPS COORDINATES (BOTTOM-RIGHT) ================= */}
      <div className="absolute bottom-8 right-6 sm:right-12 z-20 text-right pointer-events-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
        <p className="text-[10px] sm:text-[11px] font-mono tracking-[0.28em] text-[#F6F4EE]/75 uppercase">
          11° 41&apos; N
        </p>
        <p className="text-[10px] sm:text-[11px] font-mono tracking-[0.28em] text-[#F6F4EE]/75 uppercase mt-0.5">
          76° 07&apos; E
        </p>
        <p className="text-[9px] font-sans tracking-[0.22em] text-[#7eb840] uppercase mt-1 font-semibold">
          Wayanad, Kerala
        </p>
      </div>

      {/* ================= 4. SOUND & VIDEO CONTROLS (BOTTOM-LEFT) ================= */}
      <div className="absolute bottom-6 left-6 z-20 flex items-center gap-2">
        <button
          onClick={toggleSound}
          aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          className="flex items-center gap-2 bg-black/50 hover:bg-black/75 backdrop-blur-md text-stone-200 hover:text-white px-3.5 py-1.5 rounded-full border border-white/25 text-xs transition shadow-2xl"
        >
          {isMuted ? (
            <>
              <VolumeX className="w-3.5 h-3.5 text-stone-300" />
              <span className="text-[10px] uppercase font-bold tracking-wider hidden sm:inline">Muted</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-[#7eb840] animate-pulse" />
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#7eb840] hidden sm:inline">Sound On</span>
            </>
          )}
        </button>

        <button
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause video" : "Play video"}
          className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/75 backdrop-blur-md text-stone-200 hover:text-white flex items-center justify-center border border-white/25 transition shadow-2xl"
        >
          {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
        </button>
      </div>

      {/* Down Scroll Indicator */}
      <div className="absolute bottom-3 inset-x-0 z-20 flex justify-center pointer-events-none">
        <div className="animate-bounce text-[#7eb840] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          <ChevronDown className="w-5 h-5 opacity-70" />
        </div>
      </div>

    </section>
  );
}
