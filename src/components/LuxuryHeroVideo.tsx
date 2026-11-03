"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Volume2, VolumeX, Play, Pause, Compass, Sparkles, ChevronDown, ArrowRight, ShieldCheck } from "lucide-react";
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

  // Slides showcasing Wayanad feelings
  const slides = [
    {
      kicker: "BESPOKE WAYANAD JOURNEYS • EST. ASTON",
      title: "The luxury travel experts for Wayanad",
      subtitle: "Tailor-made itineraries, private pool villas, glass canopy treehouses, and untouched rainforest estates. Designed around how you want to feel.",
      label: "Misty Rainforests"
    },
    {
      kicker: "SECLUDED SANCTUARIES • PRIVATE POOLS",
      title: "Every journey begins with a feeling",
      subtitle: "Wake up to mist dancing over Banasura Dam waters, fresh estate coffee, and five-star quietude away from tourist trails.",
      label: "Banasura Waters"
    },
    {
      kicker: "CANOPY LIVING • CHEMBRA PEAKS",
      title: "Rare escapes crafted around you",
      subtitle: "Exclusive glass-fronted treehouses nestled high in the Western Ghats canopies. Slow, purposeful, and deeply restorative.",
      label: "Canopy Treehouses"
    }
  ];

  // Primary video URL: user custom setting -> local public video -> cloud pristine nature loop
  const primaryVideoSource = settings.heroVideoUrl || "/videos/wayanad-hero.mp4";
  const fallbackCdnVideo = "https://assets.mixkit.co/videos/preview/mixkit-clouds-and-mist-rolling-over-the-mountain-peaks-42797-large.mp4";

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
            // It will remain ready to play on first user interaction
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
    <section className="relative w-full h-[92vh] min-h-[640px] max-h-[960px] flex items-center justify-center overflow-hidden bg-[#0A1009] select-none">
      
      {/* ================= BACKGROUND VIDEO & POSTER ================= */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Underneath Poster Image: Always available immediately so background is never blank */}
        <div className="absolute inset-0 z-0">
          <Image
            src={settings.heroBannerImage || "/brand/wayanad-backcover.jpg"}
            alt="Misty Wayanad Mountains"
            fill
            priority
            className="object-cover opacity-60"
          />
        </div>

        {/* Video Element: Sits on top of poster, smooth fades in upon first frame */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="auto"
          onLoadedData={() => setVideoLoaded(true)}
          onCanPlay={() => setVideoLoaded(true)}
          onPlay={() => {
            setVideoLoaded(true);
            setIsPlaying(true);
          }}
          className={`relative z-10 w-full h-full object-cover scale-105 transition-opacity duration-1000 ease-out ${
            videoLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          {primaryVideoSource && <source src={primaryVideoSource} type="video/mp4" />}
          <source src="/videos/wayanad-hero.mp4" type="video/mp4" />
          <source src="/videos/wayanad-hero.mp4.mp4" type="video/mp4" />
          <source src={fallbackCdnVideo} type="video/mp4" />
        </video>

        {/* Black Tomato Multi-Layer Dark Gradient Vignettes */}
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#0A1009] via-[#0A1009]/40 to-[#0A1009]/70 pointer-events-none" />
        <div className="absolute inset-0 z-20 bg-gradient-to-r from-[#0A1009]/80 via-transparent to-[#0A1009]/80 pointer-events-none" />
        {/* Subtle cinematic grain */}
        <div className="absolute inset-0 z-20 bg-black/20 mix-blend-overlay pointer-events-none" />
      </div>

      {/* Subtle Wayanad Mist Animation Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 w-[160%] h-[160%] bg-gradient-to-r from-emerald-950/20 via-white/5 to-emerald-900/15 blur-3xl animate-mist" />
      </div>

      {/* ================= HERO CONTENT (Black Tomato Editorial Style) ================= */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center justify-center h-full">
        
        {/* Kicker Tagline with Elegant Spacing */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 text-[11px] font-bold tracking-luxury uppercase mb-6 shadow-xl animate-float">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>{slides[activeSlide].kicker}</span>
        </div>

        {/* Grand Headline (Didot / Cormorant Garamond feel) */}
        <h1 className="text-3xl sm:text-5xl lg:text-7xl font-editorial font-normal text-white tracking-tight leading-[1.12] max-w-4xl mx-auto drop-shadow-md transition-all duration-700">
          {slides[activeSlide].title}
        </h1>

        {/* Subtitle with High-End Understated Refinement */}
        <p className="mt-5 sm:mt-6 text-sm sm:text-lg text-stone-200/90 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-sm font-sans-luxury">
          {slides[activeSlide].subtitle}
        </p>

        {/* Black Tomato Dual Action CTAs */}
        <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4">
          {/* Primary Bespoke Planner Button */}
          <button
            onClick={onOpenEnquiry}
            className="group inline-flex items-center gap-2.5 bg-[#2E4F28] hover:bg-[#233D1F] text-white text-xs sm:text-sm font-semibold tracking-luxury uppercase px-8 py-4 rounded-full shadow-2xl hover:shadow-emerald-900/50 transition-all transform hover:-translate-y-0.5 active:translate-y-0 border border-emerald-400/30"
          >
            <span>Plan My Journey</span>
            <ArrowRight className="w-4 h-4 text-emerald-300 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Secondary Ghost Button */}
          <Link
            href="/resorts"
            className="inline-flex items-center gap-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-xs sm:text-sm font-semibold tracking-luxury uppercase px-8 py-4 rounded-full transition-all border border-white/30 hover:border-white shadow-lg"
          >
            <Compass className="w-4 h-4 text-stone-300" />
            <span>Explore Curated Stays</span>
          </Link>
        </div>

        {/* Trust Endorsement Pill */}
        <div className="mt-10 hidden sm:flex items-center gap-6 text-[11px] text-stone-300 font-light tracking-wider">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Direct Property Rates
          </span>
          <span className="text-stone-500">•</span>
          <span>Zero Planning Surcharges</span>
          <span className="text-stone-500">•</span>
          <span>100% Curated Kerala Stays</span>
        </div>

      </div>

      {/* ================= CONTROLS & CAROUSEL INDICATORS ================= */}
      
      {/* Left: Video Sound & Play Controls */}
      <div className="absolute bottom-6 left-6 z-20 flex items-center gap-2">
        <button
          onClick={toggleSound}
          aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          className="flex items-center gap-2 bg-black/40 hover:bg-black/70 backdrop-blur-md text-stone-300 hover:text-white px-3 py-1.5 rounded-full border border-white/15 text-xs transition shadow-lg"
        >
          {isMuted ? (
            <>
              <VolumeX className="w-3.5 h-3.5 text-stone-400" />
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
          className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-stone-300 hover:text-white flex items-center justify-center border border-white/15 transition shadow-lg"
        >
          {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
        </button>
      </div>

      {/* Right: Black Tomato Slide Tabs Indicator */}
      <div className="absolute bottom-6 right-6 z-20 hidden md:flex items-center gap-3">
        {slides.map((s, idx) => (
          <button
            key={s.label}
            onClick={() => setActiveSlide(idx)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wider transition-all duration-300 border ${
              activeSlide === idx
                ? "bg-white/20 border-white text-white backdrop-blur-md shadow-lg"
                : "bg-black/30 border-white/10 text-stone-400 hover:text-white hover:border-white/30"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${activeSlide === idx ? "bg-emerald-400" : "bg-stone-500"}`} />
            <span>0{idx + 1} / {s.label}</span>
          </button>
        ))}
      </div>

      {/* Down Scroll Arrow */}
      <div className="absolute bottom-2 inset-x-0 z-10 flex justify-center pointer-events-none">
        <div className="animate-bounce text-stone-400 opacity-60">
          <ChevronDown className="w-5 h-5" />
        </div>
      </div>

    </section>
  );
}
