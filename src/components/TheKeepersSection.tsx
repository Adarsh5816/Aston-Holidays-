"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Heart, Compass } from "lucide-react";

export default function TheKeepersSection({ onOpenEnquiry }: { onOpenEnquiry: () => void }) {
  const keepers = [
    {
      role: "The Rainforest Naturalist",
      name: "Manoj & The Chembra Scouts",
      story: "Guiding travelers through secluded river crossings, secret Meenmutty pools, and ancient spice groves that guidebooks never mention.",
      image: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
      vibe: "Canopy & Wilderness Treks"
    },
    {
      role: "The Coffee Master & Heritage Host",
      name: "Father & Son Plantation Curators",
      story: "Third-generation planters in Vythiri sharing estate-roasted peaberry Arabica, colonial bungalows, and slow veranda storytelling.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
      vibe: "Private Heritage Estates"
    },
    {
      role: "The Private Villa Chef",
      name: "Master Chefs of Malabar Flavours",
      story: "Crafting bespoke 5-course romantic poolside candlelight feasts, appams with fresh coconut milk, and earthen clay-pot delicacies.",
      image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80",
      vibe: "Candlelight Pool Feasts"
    }
  ];

  return (
    <section className="py-24 sm:py-32 bg-[#121A13] text-white relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-950/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold tracking-luxury uppercase mb-4">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Meet the Keepers of Wayanad
            </div>
            <h2 className="text-3xl sm:text-5xl font-editorial font-normal tracking-tight text-white leading-tight">
              Extraordinary People Behind Extraordinary Journeys
            </h2>
            <p className="mt-4 text-stone-300 text-sm sm:text-base font-light leading-relaxed">
              True luxury is not just linen and private infinity pools. It is the wisdom of the local naturalists, estate keepers, and chefs who welcome you as an honoured friend.
            </p>
          </div>

          <button
            onClick={onOpenEnquiry}
            className="inline-flex items-center gap-2 bg-[#2E4F28] hover:bg-[#233D1F] text-white text-xs font-semibold tracking-luxury uppercase px-7 py-3.5 rounded-full transition shadow-xl border border-emerald-400/30 w-fit shrink-0"
          >
            <span>Plan with a Curator</span>
            <ArrowRight className="w-4 h-4 text-emerald-300" />
          </button>
        </div>

        {/* The Keepers Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {keepers.map((k) => (
            <div
              key={k.role}
              className="group bg-white/5 border border-white/10 hover:border-emerald-500/40 rounded-3xl overflow-hidden p-6 sm:p-8 transition-all duration-500 hover:shadow-2xl flex flex-col justify-between"
            >
              <div>
                {/* Photo Portrait */}
                <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden mb-6 bg-stone-900">
                  <Image
                    src={k.image}
                    alt={k.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-3 left-3 z-10">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-400 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                      {k.vibe}
                    </span>
                  </div>
                </div>

                <span className="text-[11px] font-bold uppercase tracking-luxury text-emerald-400 block mb-1">
                  {k.role}
                </span>
                <h3 className="text-xl font-editorial font-normal text-white">
                  {k.name}
                </h3>
                <p className="mt-3 text-xs text-stone-300 font-light leading-relaxed">
                  {k.story}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-[11px] text-stone-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Exclusive to Aston Guests
                </span>
                <span className="text-emerald-300 font-semibold group-hover:translate-x-1 transition-transform">
                  Included →
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
