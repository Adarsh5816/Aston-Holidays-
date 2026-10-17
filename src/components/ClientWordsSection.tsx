"use client";

import React, { useState } from "react";
import { ClientReview } from "@/lib/types";
import { Star, MessageSquareQuote, ShieldCheck, Heart, Users, CheckCircle2 } from "lucide-react";

interface ClientWordsProps {
  reviews: ClientReview[];
}

export default function ClientWordsSection({ reviews }: ClientWordsProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <section className="py-24 bg-[#F8F9FA] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-3.5 py-1 rounded-full mb-3 shadow-sm">
            <MessageSquareQuote className="w-3.5 h-3.5 text-emerald-700" />
            Verified Guest Impressions
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight">
            What&apos;s Our Client&apos;s Words
          </h2>
          <p className="mt-2 text-stone-500 text-xs sm:text-sm leading-relaxed">
            Real experiences from travelers who trusted Aston Holidays for their romantic getaways, family milestones, and group expeditions.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev, i) => (
            <div
              key={rev.id || i}
              className="bg-white rounded-3xl p-7 border border-stone-200/80 shadow-sm hover:shadow-xl transition-all duration-300 card-hover-elevation flex flex-col justify-between"
            >
              <div>
                {/* 5-Star Rating */}
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {Array.from({ length: rev.rating || 5 }).map((_, starIdx) => (
                    <Star key={starIdx} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                {/* Review Body */}
                <p className="text-xs text-stone-700 leading-relaxed font-serif italic mb-6">
                  &ldquo;{rev.review}&rdquo;
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-stone-900">{rev.name}</h4>
                  <p className="text-[10px] text-stone-500 flex items-center gap-1 mt-0.5">
                    📍 {rev.location} • {rev.date}
                  </p>
                  <span className="inline-block text-[9px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full mt-1.5 border border-emerald-200/60">
                    {rev.packageTaken}
                  </span>
                </div>

                <div className="w-9 h-9 rounded-full bg-[#2E4F28] text-white text-xs font-extrabold flex items-center justify-center flex-shrink-0 shadow-sm">
                  {rev.avatar || rev.name.charAt(0)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges Bar */}
        <div className="mt-16 bg-white rounded-2xl border border-stone-200/90 p-6 shadow-sm flex flex-wrap items-center justify-around gap-6 text-center">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div className="text-left">
              <p className="text-xs font-black text-stone-900">100% Verified Villas</p>
              <p className="text-[10px] text-stone-500">Every property physically inspected</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800">
              <CheckCircle2 className="w-5 h-5" />
            </span>
            <div className="text-left">
              <p className="text-xs font-black text-stone-900">Zero Hidden Charges</p>
              <p className="text-[10px] text-stone-500">Transparent PDF invoices &amp; vouchers</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800">
              <Heart className="w-5 h-5" />
            </span>
            <div className="text-left">
              <p className="text-xs font-black text-stone-900">24/7 Caretaker &amp; Desk</p>
              <p className="text-[10px] text-stone-500">Direct WhatsApp support during your stay</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
