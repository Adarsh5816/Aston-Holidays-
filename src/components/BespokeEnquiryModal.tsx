"use client";

import React, { useState } from "react";
import { X, Sparkles, Send, Calendar, Users, Heart, Trees, Compass, ShieldCheck, CheckCircle2, Phone, MapPin } from "lucide-react";

interface BespokeEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFeeling?: string;
}

export default function BespokeEnquiryModal({
  isOpen,
  onClose,
  initialFeeling
}: BespokeEnquiryModalProps) {
  const [step, setStep] = useState(1);
  const [who, setWho] = useState("Couples / Honeymoon");
  const [feeling, setFeeling] = useState(initialFeeling || "Romantic Awe & Seclusion");
  const [stayPreference, setStayPreference] = useState("Private Infinity Pool Villa");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [specialWishes, setSpecialWishes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const feelingsList = [
    { title: "Romantic Awe & Seclusion", desc: "Private pool, candlelit dining, jacuzzi & misty solitude" },
    { title: "Profound Stillness", desc: "Untouched forest estates, bird songs, tranquil mountain waters" },
    { title: "Wild Wonder & Canopy Adventure", desc: "Rainforest glass treehouse, Chembra peak treks & jeep safaris" },
    { title: "Heritage & Slow Living", desc: "Colonial spice & coffee plantation bungalows, plantation walks" },
    { title: "Family Togetherness", desc: "Spacious private multi-room villas with lawns & bonfires" }
  ];

  const whoList = [
    "Couples / Honeymoon",
    "Family with Kids",
    "Multi-Generational Family",
    "Friends & Private Group",
    "Solo Traveler"
  ];

  const stayTypes = [
    "Private Infinity Pool Villa",
    "Glass Canopy Treehouse",
    "Heritage Plantation Estate",
    "Luxury Forest Villa / Cottage",
    "Entire Private 3BHK/4BHK Villa"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setIsSubmitting(true);

    const leadPayload = {
      customerName: name,
      phone,
      source: "Website",
      destination: "Wayanad (Bespoke)",
      accommodationType: stayPreference,
      ambience: feeling,
      checkIn: checkIn || "Upcoming",
      checkOut: checkOut || "Upcoming",
      adultsCount: adults,
      childrenCount: children,
      guestsCount: adults + children,
      notes: `[Black Tomato Style Bespoke Inquiry]\n• Traveller Type: ${who}\n• Feeling Desired: ${feeling}\n• Preferred Sanctuary: ${stayPreference}\n• Special Requests: ${specialWishes || "None specified"}`
    };

    try {
      // 1. Save lead to backend
      await fetch("/api/v1/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadPayload)
      });

      // 2. Format WhatsApp Message
      const waMsg = `*🌿 BESPOKE WAYANAD JOURNEY ENQUIRY*\n` +
        `_Aston Holidays Concierge Desk_\n\n` +
        `👤 *Guest Name:* ${name}\n` +
        `📞 *Contact:* ${phone}\n` +
        `👥 *Travellers:* ${who} (${adults} Adults, ${children} Children)\n` +
        `✨ *Desired Feeling:* ${feeling}\n` +
        `🏡 *Preferred Sanctuary:* ${stayPreference}\n` +
        `📅 *Dates:* ${checkIn ? `${checkIn} to ${checkOut}` : "Flexible / To be planned"}\n` +
        (specialWishes ? `💌 *Special Wishes:* ${specialWishes}\n\n` : `\n`) +
        `Please curate bespoke options and availability for us.`;

      const cleanPhone = "919744900414";
      const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMsg)}`;

      setIsSuccess(true);
      setTimeout(() => {
        window.open(waUrl, "_blank");
      }, 1200);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl bg-[#0F1710] text-stone-100 rounded-3xl border border-emerald-500/30 shadow-2xl overflow-hidden my-8">
        
        {/* Top Header Background Vignette */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-emerald-950/80 to-transparent pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white flex items-center justify-center transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative z-10 p-6 sm:p-10">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-[11px] font-semibold tracking-luxury uppercase mb-3">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              Bespoke Journey Architect
            </div>
            <h2 className="text-2xl sm:text-4xl font-editorial font-normal tracking-tight text-white">
              Every Journey Starts with a Feeling
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 mt-2 font-light max-w-lg mx-auto leading-relaxed">
              Tell our Wayanad curators what kind of feeling you are seeking, and we will architect an intimate, tailor-made escape just for you.
            </p>
          </div>

          {isSuccess ? (
            <div className="py-12 text-center space-y-4 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-editorial text-white">Your Escape is Being Curated</h3>
              <p className="text-xs text-stone-300 max-w-md mx-auto leading-relaxed">
                Thank you, <span className="text-emerald-300 font-semibold">{name}</span>. We have dispatched your request to our senior Wayanad concierge desk. Opening your direct WhatsApp consultation...
              </p>
              <button
                onClick={onClose}
                className="mt-6 px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold tracking-wider uppercase transition shadow-lg"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Step indicator */}
              <div className="flex items-center justify-center gap-2 mb-6">
                {[1, 2, 3].map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setStep(s)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      step === s ? "w-10 bg-emerald-400" : "w-3 bg-stone-700"
                    }`}
                  />
                ))}
              </div>

              {/* Step 1: Who & How Do You Want to Feel? */}
              {step === 1 && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  <div>
                    <label className="block text-xs font-semibold text-emerald-300 uppercase tracking-luxury mb-2.5">
                      1. Who is travelling?
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {whoList.map((item) => (
                        <button
                          type="button"
                          key={item}
                          onClick={() => setWho(item)}
                          className={`p-3 rounded-2xl text-xs text-left border transition ${
                            who === item
                              ? "bg-emerald-950/80 border-emerald-400 text-white shadow-lg shadow-emerald-950/50"
                              : "bg-white/5 border-white/10 text-stone-300 hover:bg-white/10"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-emerald-300 uppercase tracking-luxury mb-2.5">
                      2. How do you want to feel?
                    </label>
                    <div className="space-y-2">
                      {feelingsList.map((f) => (
                        <div
                          key={f.title}
                          onClick={() => setFeeling(f.title)}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                            feeling === f.title
                              ? "bg-gradient-to-r from-emerald-950 to-[#182B17] border-emerald-400 text-white shadow-md"
                              : "bg-white/5 border-white/10 text-stone-300 hover:bg-white/10"
                          }`}
                        >
                          <div>
                            <p className="text-xs font-bold text-white">{f.title}</p>
                            <p className="text-[11px] text-stone-400 mt-0.5">{f.desc}</p>
                          </div>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            feeling === f.title ? "border-emerald-400 bg-emerald-400" : "border-stone-500"
                          }`}>
                            {feeling === f.title && <div className="w-1.5 h-1.5 rounded-full bg-stone-900" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs uppercase tracking-luxury transition shadow-lg"
                    >
                      Continue to Sanctuary
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Preferred Sanctuary & Dates */}
              {step === 2 && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  <div>
                    <label className="block text-xs font-semibold text-emerald-300 uppercase tracking-luxury mb-2.5">
                      3. Preferred Sanctuary
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {stayTypes.map((st) => (
                        <button
                          type="button"
                          key={st}
                          onClick={() => setStayPreference(st)}
                          className={`p-3 rounded-2xl text-xs text-left border transition ${
                            stayPreference === st
                              ? "bg-emerald-950/80 border-emerald-400 text-white shadow-md"
                              : "bg-white/5 border-white/10 text-stone-300 hover:bg-white/10"
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-stone-400 uppercase tracking-wider mb-1">
                        Approx Check-In
                      </label>
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-stone-400 uppercase tracking-wider mb-1">
                        Approx Check-Out
                      </label>
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-stone-400 uppercase tracking-wider mb-1">Adults</label>
                      <input
                        type="number"
                        min={1}
                        value={adults}
                        onChange={(e) => setAdults(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-stone-400 uppercase tracking-wider mb-1">Children</label>
                      <input
                        type="number"
                        min={0}
                        value={children}
                        onChange={(e) => setChildren(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-5 py-2.5 rounded-full text-stone-400 hover:text-white text-xs font-semibold uppercase tracking-luxury transition"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs uppercase tracking-luxury transition shadow-lg"
                    >
                      Continue to Details
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Guest Details & Dispatch */}
              {step === 3 && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs space-y-1.5 text-stone-300">
                    <p className="font-semibold text-white">Summary of Your Escape:</p>
                    <p>• {who} seeking <span className="text-emerald-300 font-semibold">{feeling}</span></p>
                    <p>• Sanctuary: <span className="text-emerald-300 font-semibold">{stayPreference}</span></p>
                    {checkIn && <p>• Dates: {checkIn} to {checkOut || "Flexible"}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] text-stone-400 uppercase tracking-wider mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Dr. Siddharth Verma"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-stone-400 uppercase tracking-wider mb-1">WhatsApp / Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98471 23456"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-stone-400 uppercase tracking-wider mb-1">Any Special Desires or Anniversaries?</label>
                    <textarea
                      rows={2}
                      value={specialWishes}
                      onChange={(e) => setSpecialWishes(e.target.value)}
                      placeholder="e.g. Honeymoon poolside candlelight dinner, private airport chauffeur pickup from Calicut..."
                      className="w-full px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-5 py-2.5 rounded-full text-stone-400 hover:text-white text-xs font-semibold uppercase tracking-luxury transition"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !name || !phone}
                      className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 text-stone-950 font-black text-xs uppercase tracking-luxury transition shadow-xl disabled:opacity-50"
                    >
                      {isSubmitting ? "Dispatching..." : "Design My Trip with Concierge"}
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}

          {/* Bottom Trust Badge */}
          <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-stone-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Verified Private Estates • No Middlemen Planning Fees
            </span>
            <span className="flex items-center gap-1 text-emerald-300 font-semibold">
              <Phone className="w-3 h-3" />
              +91 97449 00414
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
