"use client";

import React, { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Play, Pause, Sparkles, ChevronDown, ArrowRight, ShieldCheck, MessageCircle } from "lucide-react";
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

  // Atmospheric slides focused on bespoke travel feeling (no resort advertising)
  const slides = [
    {
      kicker: "ASTON HOLIDAYS • WAYANAD",
      title: "A journey designed around how you want to feel.",
      subtitle: "Tailor-made itineraries, private escapes, and slow luxury crafted amidst the mist of the Western Ghats. Designed around your personal rhythm.",
      label: "The Experience"
    },
    {
      kicker: "BESPOKE PRIVATE ESCAPES",
      title: "Every journey begins with a feeling.",
      subtitle: "Wake up to mist dancing over calm waters, aromatic coffee estates, and secluded stillness away from crowded trails.",
      label: "The Escapes"
    },
    {
      kicker: "DEDICATED TRAVEL ARCHITECT",
      title: "Rare moments, crafted exclusively for you.",
      subtitle: "From romantic getaways to restorative multi-generational holidays. Tell us what you seek, and we will bring it to life.",
      label: "The Concierge"
    }
  ];

  // Primary video URL: user custom setting -> local public video -> cloud pristine nature loop
  const primaryVideoSource = settings.heroVideoUrl || "/videos/wayanad-hero.mp4";
  const fallbackCdnVideo = "https://assets.mixkit.co/videos/preview/mixkit-clouds-and-mist-rolling-over-the-mountain-peaks-42797-large.mp4";

  // WhatsApp Concierge direct link
  const rawPhone = settings.whatsappNumber || "+919744900414";
  const whatsappDigits = rawPhone.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(
    "Hello Aston Holidays, I would like to plan a bespoke luxury holiday to Wayanad."
  )}`;

  // Robust Autoplay Initializer for all modern mobile and desktop browsers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Direct DOM property setting bypasses browser autoplay restrictions
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
          .catch((err) => {
            console.log("Autoplay waiting for user gesture or muted unlock:", err);
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

  // Auto-cycle through slides every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative w-full h-screen min-h-[100dvh] flex items-center justify-between overflow-hidden bg-black select-none">
      
      {/* ================= RAW, 100% UNMASKED VIDEO (NO OLD BACKGROUND) ================= */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-black">
        {/* Video Element: 100% Pure, Untouched High-Definition Video — No overlays, no masks, no background image */}
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
          onPlay={() => {
            setVideoLoaded(true);
            setIsPlaying(true);
          }}
          className="relative z-10 w-full h-full object-cover"
        >
          {primaryVideoSource && <source src={primaryVideoSource} type="video/mp4" />}
          <source src="/videos/wayanad-hero.mp4" type="video/mp4" />
        </video>
      </div>

      {/* ================= EDITORIAL CONTENT (SIDE-WISE / FLOATING TYPOGRAPHY) ================= */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-20 flex flex-col justify-center items-start text-left h-full pointer-events-none">
        
        <div className="max-w-xl lg:max-w-3xl pointer-events-auto p-4 sm:p-8 -ml-4 sm:-ml-8 rounded-3xl bg-gradient-to-r from-black/50 via-black/20 to-transparent backdrop-blur-[1.5px]">
          {/* Black Tomato Style Floating Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/30 text-white text-[11px] font-bold tracking-luxury uppercase mb-6 shadow-2xl">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>{slides[activeSlide].kicker}</span>
          </div>

          {/* Grand Headline: Soft, cinematic, eye-pleasing depth without muddy text halos */}
          <h1
            className="text-3xl sm:text-5xl lg:text-6xl font-editorial font-normal text-white tracking-[-0.015em] leading-[1.14] transition-all duration-700 antialiased"
            style={{
              textShadow: "0 2px 25px rgba(0,0,0,0.55), 0 4px 50px rgba(0,0,0,0.35), 0 1px 3px rgba(0,0,0,0.7)"
            }}
          >
            {slides[activeSlide].title}
          </h1>

          {/* Editorial Subtitle with Soft Cinematic Shadow */}
          <p
            className="mt-5 sm:mt-6 text-sm sm:text-base lg:text-lg text-stone-100/95 font-light leading-relaxed font-sans-luxury max-w-xl"
            style={{
              textShadow: "0 2px 16px rgba(0,0,0,0.65), 0 1px 3px rgba(0,0,0,0.7)"
            }}
          >
            {slides[activeSlide].subtitle}
          </p>

          {/* Primary Action Tabs: Semi-Transparent Crystal Glassmorphic Tabs */}
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4">
            {/* Semi-Transparent Crystal Glass Tab: Plan Your Journey */}
            <button
              onClick={onOpenEnquiry}
              className="group relative inline-flex items-center gap-3.5 px-8 py-4 rounded-2xl overflow-hidden
                         bg-white/[0.08] hover:bg-white/[0.18]
                         backdrop-blur-md
                         border border-white/25 hover:border-white/60
                         shadow-[0_10px_35px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.5),inset_0_-1px_2px_rgba(0,0,0,0.2)]
                         hover:shadow-[0_14px_45px_rgba(0,0,0,0.5),0_0_20px_rgba(255,255,255,0.2),inset_0_1px_1.5px_rgba(255,255,255,0.7)]
                         text-white text-xs sm:text-sm font-semibold tracking-luxury uppercase
                         transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {/* Subtle top crystal prism highlight */}
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />
              {/* Delicate refraction shimmer on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
              
              <span className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">Plan Your Journey</span>
              <ArrowRight className="relative z-10 w-4 h-4 text-emerald-300 group-hover:translate-x-1 transition-transform drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]" />
            </button>

            {/* Semi-Transparent Crystal Glass Tab: WhatsApp Concierge */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-3.5 px-7 py-4 rounded-2xl overflow-hidden
                         bg-white/[0.06] hover:bg-white/[0.15]
                         backdrop-blur-md
                         border border-white/20 hover:border-white/50
                         shadow-[0_10px_35px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.4),inset_0_-1px_2px_rgba(0,0,0,0.2)]
                         hover:shadow-[0_14px_45px_rgba(0,0,0,0.5),0_0_20px_rgba(52,211,153,0.25),inset_0_1px_1.5px_rgba(255,255,255,0.6)]
                         text-white text-xs sm:text-sm font-semibold tracking-luxury uppercase
                         transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {/* Subtle top crystal prism highlight */}
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/70 to-transparent pointer-events-none" />
              {/* Delicate emerald shimmer on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-300/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
              
              <div className="relative z-10 p-1 rounded-lg bg-emerald-500/20 border border-emerald-400/30 backdrop-blur-sm">
                <MessageCircle className="w-4 h-4 text-emerald-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]" />
              </div>
              <span className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">WhatsApp Concierge</span>
            </a>
          </div>

          {/* Luxury Travel Assurances (Floating Frosted Capsule - Responsive Mobile & Desktop) */}
          <div className="mt-6 sm:mt-8 inline-flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6 text-[11px] text-stone-200 font-medium tracking-wider bg-black/45 backdrop-blur-md px-4 sm:px-6 py-3 sm:py-2.5 rounded-2xl sm:rounded-full border border-white/20 shadow-2xl max-w-full">
            <span className="flex items-center gap-2 text-white">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              Dedicated Travel Architect
            </span>
            <span className="hidden sm:inline text-white/30">•</span>
            <span className="flex items-center gap-2 sm:gap-0">
              <span className="sm:hidden text-emerald-400 font-bold">✓</span>
              Tailor-Made Itineraries
            </span>
            <span className="hidden sm:inline text-white/30">•</span>
            <span className="flex items-center gap-2 sm:gap-0">
              <span className="sm:hidden text-emerald-400 font-bold">✓</span>
              Seamless 24/7 Concierge
            </span>
          </div>
        </div>

      </div>

      {/* ================= CONTROLS & CAROUSEL INDICATORS ================= */}
      
      {/* Left Bottom: Video Sound & Play Controls */}
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
              <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300 hidden sm:inline">Sound On</span>
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

      {/* Right Bottom: Slide Tabs Indicator (Hidden) */}
      {/*
      <div className="absolute bottom-6 right-6 z-20 hidden md:flex items-center gap-3">
        {slides.map((s, idx) => (
          <button
            key={s.label}
            onClick={() => setActiveSlide(idx)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-wider transition-all duration-300 border ${
              activeSlide === idx
                ? "bg-white/25 border-white text-white backdrop-blur-md shadow-2xl"
                : "bg-black/45 border-white/15 text-stone-300 hover:text-white hover:border-white/35 backdrop-blur-sm"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${activeSlide === idx ? "bg-emerald-400" : "bg-stone-400"}`} />
            <span>0{idx + 1} / {s.label}</span>
          </button>
        ))}
      </div>
      */}

      {/* Down Scroll Indicator */}
      <div className="absolute bottom-3 inset-x-0 z-20 flex justify-center pointer-events-none">
        <div className="animate-bounce text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          <ChevronDown className="w-5 h-5" />
        </div>
      </div>

    </section>
  );
}
