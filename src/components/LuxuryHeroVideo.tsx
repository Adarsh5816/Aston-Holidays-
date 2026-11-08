"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
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
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Iconic Mulli/Wayanad-inspired atmospheric slides
  const slides = [
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
    },
    {
      eyebrow: "ABOVE CLOUDS & CANOPIES",
      line1: "Stillness",
      accent: "amidst the mist",
      line2: "and quiet peaks.",
      sub1: "Private infinity pool estates and glass canopy treehouses.",
      sub2: "Crafted exclusively around your personal pace."
    }
  ];

  const primaryVideoSource = settings.heroVideoUrl || "/videos/wayanad-hero.mp4";

  // WhatsApp Concierge direct link
  const rawPhone = settings.whatsappNumber || "+919744900414";
  const whatsappDigits = rawPhone.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(
    "Hello Aston Holidays, I would like to plan a bespoke luxury holiday to Wayanad."
  )}`;

  // Autoplay handler
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.defaultMuted = true;
    video.muted = true;

    const attemptAutoplay = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setVideoLoaded(true);
          })
          .catch(() => {
            // Video autoplay paused, static majestic background remains fully visible
          });
      }
    };

    attemptAutoplay();
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

  // Cycle through atmospheric phrases every 9 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 9000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const currentSlide = slides[activeSlide];

  return (
    <section className="relative w-full h-screen min-h-[100dvh] flex items-center justify-between overflow-hidden bg-[#0A130B] select-none">
      
      {/* ================= 1. HIGH-DEFINITION NATURE BACKDROP (DEEP GREEN MISTY WAYANAD) ================= */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* High-res pristine landscape matching the exact reference composition (winding road through misty rainforest & tea estates) */}
        <Image
          src="/brand/hero-wayanad-deep-green.jpg"
          alt="Go where the green gets deep - Wayanad Kerala"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center transform scale-[1.02] transition-transform duration-[10000ms] ease-out"
        />

        {/* Ambient Video Layer (Blends smoothly if video plays) */}
        {primaryVideoSource && (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            preload="auto"
            src={primaryVideoSource}
            onLoadedData={() => setVideoLoaded(true)}
            onCanPlay={() => setVideoLoaded(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              videoLoaded && isPlaying ? "opacity-40 mix-blend-screen" : "opacity-0"
            }`}
          >
            <source src={primaryVideoSource} type="video/mp4" />
          </video>
        )}

        {/* Atmospheric Lighting Overlays: Soft moody left shadow for high typography contrast + golden dusk horizon glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#070E08]/85 via-[#070E08]/45 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070E08]/90 via-transparent to-black/30 pointer-events-none" />
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-amber-600/10 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* ================= 2. SIGNATURE EDITORIAL HERO CONTENT ================= */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-24 sm:py-28 flex flex-col justify-center items-start text-left h-full pointer-events-none">
        
        <div className="max-w-2xl lg:max-w-3xl pointer-events-auto">
          
          {/* Eyebrow with Leading Dash Line */}
          <div className="flex items-center gap-3 text-[#D48D6C] text-[11px] sm:text-xs font-semibold tracking-[0.28em] uppercase mb-5 sm:mb-7 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            <span className="w-8 sm:w-10 h-[1.5px] bg-[#D48D6C]" />
            <span>{currentSlide.eyebrow}</span>
          </div>

          {/* Signature 3-Line Headline with Terracotta Italic Accent */}
          <h1
            className="text-5xl sm:text-7xl lg:text-[5.5rem] xl:text-[6.2rem] font-editorial font-normal text-[#F6F4EE] tracking-[-0.025em] leading-[1.04] antialiased drop-shadow-[0_4px_30px_rgba(0,0,0,0.7)] transition-all duration-700"
          >
            {currentSlide.line1} <br />
            <span className="italic font-normal text-[#D48D6C] font-editorial drop-shadow-[0_4px_30px_rgba(0,0,0,0.7)]">
              {currentSlide.accent}
            </span>{" "}
            <br />
            {currentSlide.line2}
          </h1>

          {/* Bottom Narrative + Circular "Explore journeys" CTA */}
          <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10">
            
            {/* 2-Line Subtext */}
            <div className="text-xs sm:text-[13px] text-[#E5E0D8]/90 font-light leading-relaxed font-sans max-w-xs drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
              <p>{currentSlide.sub1}</p>
              <p className="mt-0.5">{currentSlide.sub2}</p>
            </div>

            {/* The Iconic Minimalist Circular "Explore journeys ↓" CTA */}
            <a
              href="#feelings-engine"
              className="group relative w-20 h-20 sm:w-22 sm:h-22 rounded-full border border-white/35 hover:border-[#D48D6C] bg-black/25 hover:bg-black/50 backdrop-blur-md flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-105 shrink-0 shadow-2xl"
            >
              <span className="text-[10px] sm:text-[11px] font-sans font-medium uppercase tracking-widest text-[#F6F4EE] leading-tight">
                Explore<br />journeys
              </span>
              <span className="mt-1 text-xs text-[#D48D6C] group-hover:translate-y-1 transition-transform">↓</span>
            </a>

            {/* Direct Concierge Link & WhatsApp Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={onOpenEnquiry}
                className="group inline-flex items-center gap-2.5 text-[11px] font-sans font-semibold uppercase tracking-[0.2em] text-[#F6F4EE] hover:text-[#D48D6C] py-2.5 px-5 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 hover:border-[#D48D6C]/60 backdrop-blur-sm transition-all shadow-xl"
              >
                <span>Plan Journey</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D48D6C] group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/25 border border-white/25 text-[#D48D6C] hover:text-white backdrop-blur-sm transition-all shadow-xl"
                title="Chat with Concierge on WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>

          </div>

          {/* Luxury Travel Assurances Frosted Capsule */}
          <div className="mt-6 sm:mt-8 inline-flex flex-wrap items-center gap-2 sm:gap-5 text-[11px] text-[#E5E0D8]/80 font-medium tracking-wider bg-black/40 backdrop-blur-md px-4 sm:px-5 py-2 rounded-full border border-white/15 shadow-2xl">
            <span className="flex items-center gap-1.5 text-[#F6F4EE]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D48D6C] shrink-0" />
              Dedicated Travel Architect
            </span>
            <span className="text-white/25 hidden sm:inline">•</span>
            <span>Tailor-Made Itineraries</span>
            <span className="text-white/25 hidden sm:inline">•</span>
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
        <p className="text-[9px] font-sans tracking-[0.22em] text-[#D48D6C] uppercase mt-1 font-semibold">
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
              <Volume2 className="w-3.5 h-3.5 text-[#D48D6C] animate-pulse" />
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#D48D6C] hidden sm:inline">Sound On</span>
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
        <div className="animate-bounce text-[#D48D6C] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          <ChevronDown className="w-5 h-5 opacity-70" />
        </div>
      </div>

    </section>
  );
}
