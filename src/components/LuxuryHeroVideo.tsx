"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
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
    <section className="relative w-full h-[92vh] min-h-[640px] max-h-[960px] flex items-center justify-between overflow-hidden bg-[#070D06] select-none">
      
      {/* ================= BACKGROUND VIDEO & POSTER (HIGHLIGHTED & VIVID) ================= */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Underneath Poster Image: Clean backdrop before first frame */}
        <div className="absolute inset-0 z-0">
          <Image
            src={settings.heroBannerImage || "/brand/wayanad-backcover.jpg"}
            alt="Misty Wayanad Mountains"
            fill
            priority
            className="object-cover opacity-80"
          />
        </div>

        {/* Video Element: 100% bright, crisp and vibrant without heavy darkening filters */}
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
          className={`relative z-10 w-full h-full object-cover transition-opacity duration-1000 ease-out ${
            videoLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          {primaryVideoSource && <source src={primaryVideoSource} type="video/mp4" />}
          <source src="/videos/wayanad-hero.mp4" type="video/mp4" />
          <source src="/videos/wayanad-hero.mp4.mp4" type="video/mp4" />
          <source src={fallbackCdnVideo} type="video/mp4" />
        </video>

        {/* Elegant Left-Edge Vignette: Gently shades the left third for razor-sharp typography readability, while leaving the center and right 65% of the video totally bright, vivid and clear */}
        <div className="absolute inset-0 z-20 bg-gradient-to-r from-black/85 via-black/45 via-45% to-transparent pointer-events-none" />
        
        {/* Subtle Bottom Fade: Smooth transition into the content section */}
        <div className="absolute bottom-0 inset-x-0 h-28 z-20 bg-gradient-to-t from-[#070D06] to-transparent pointer-events-none" />

        {/* Subtle Top Fade: Legibility for top navbar */}
        <div className="absolute top-0 inset-x-0 h-24 z-20 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
      </div>

      {/* ================= EDITORIAL CONTENT (SIDE-WISE / LEFT-ALIGNED LAYOUT) ================= */}
      <div className="relative z-30 w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-20 flex flex-col justify-center items-start text-left h-full pointer-events-none">
        
        <div className="max-w-xl lg:max-w-2xl pointer-events-auto">
          {/* Refined Kicker Tagline */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 text-[11px] font-bold tracking-luxury uppercase mb-6 shadow-xl animate-float">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>{slides[activeSlide].kicker}</span>
          </div>

          {/* Grand Headline (Didot / Cormorant Garamond feel, Left-aligned) */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-editorial font-normal text-white tracking-tight leading-[1.12] drop-shadow-lg transition-all duration-700">
            {slides[activeSlide].title}
          </h1>

          {/* Editorial Subtitle */}
          <p className="mt-5 sm:mt-6 text-sm sm:text-base lg:text-lg text-stone-200/90 font-light leading-relaxed drop-shadow-md font-sans-luxury">
            {slides[activeSlide].subtitle}
          </p>

          {/* Primary Action Buttons: Home & Bespoke Enquiry Focus */}
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4">
            {/* Primary Bespoke Planner Enquiry Button */}
            <button
              onClick={onOpenEnquiry}
              className="group inline-flex items-center gap-3 bg-[#2E4F28] hover:bg-[#233D1F] text-white text-xs sm:text-sm font-semibold tracking-luxury uppercase px-8 py-4 rounded-full shadow-2xl hover:shadow-emerald-950/60 transition-all transform hover:-translate-y-0.5 active:translate-y-0 border border-emerald-400/40"
            >
              <span>Plan Your Journey</span>
              <ArrowRight className="w-4 h-4 text-emerald-300 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Direct WhatsApp Concierge Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-xs sm:text-sm font-semibold tracking-luxury uppercase px-7 py-4 rounded-full transition-all border border-white/25 hover:border-white shadow-lg"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Concierge</span>
            </a>
          </div>

          {/* Luxury Travel Assurances (No pushy resort ads) */}
          <div className="mt-8 flex flex-wrap items-center gap-4 sm:gap-6 text-[11px] text-stone-300 font-light tracking-wider">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Dedicated Travel Architect
            </span>
            <span className="text-stone-500">•</span>
            <span>Tailor-Made Itineraries</span>
            <span className="text-stone-500">•</span>
            <span>Seamless 24/7 Concierge</span>
          </div>
        </div>

      </div>

      {/* ================= CONTROLS & CAROUSEL INDICATORS ================= */}
      
      {/* Left Bottom: Subtle Video Sound & Play Controls */}
      <div className="absolute bottom-6 left-6 z-30 flex items-center gap-2">
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

      {/* Right Bottom: Slide Tabs Indicator */}
      <div className="absolute bottom-6 right-6 z-30 hidden md:flex items-center gap-3">
        {slides.map((s, idx) => (
          <button
            key={s.label}
            onClick={() => setActiveSlide(idx)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-wider transition-all duration-300 border ${
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

      {/* Down Scroll Indicator */}
      <div className="absolute bottom-3 inset-x-0 z-20 flex justify-center pointer-events-none">
        <div className="animate-bounce text-stone-400/80">
          <ChevronDown className="w-5 h-5" />
        </div>
      </div>

    </section>
  );
}
