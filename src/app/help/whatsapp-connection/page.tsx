import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, ArrowRight, HelpCircle, Terminal, CheckCircle2 } from "lucide-react";

export default function PublicHelpPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 flex flex-col justify-between font-sans">
      {/* Navigation */}
      <header className="border-b border-stone-200 bg-white/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="relative w-44 h-12 block">
            <Image
              src="/brand/logo.png"
              alt="Aston Holidays"
              fill
              className="object-contain object-left"
              priority
            />
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/admin/dev"
              className="text-xs font-bold text-white bg-[#2E4F28] hover:bg-[#233D1F] px-4 py-2 rounded-xl transition shadow-sm flex items-center gap-1.5"
            >
              <Terminal className="w-3.5 h-3.5" /> Backoffice Dev Tab
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 flex-1">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Integration &amp; Architecture Reference
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight mt-4">
            Connecting Aston Holidays with your WhatsApp Meta API App
          </h1>
          <p className="text-sm text-stone-600 mt-2">
            A complete guide explaining the two-way connection streams, cyber defense protocols, and live diagnostic monitoring.
          </p>
        </div>

        {/* 3 Streams Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-sm mb-4">
              S1
            </div>
            <h3 className="text-sm font-bold text-stone-900">1. Inbound Recommendations</h3>
            <p className="text-xs text-stone-500 mt-2 leading-relaxed">
              WhatsApp bot sends 9 guest criteria (`POST /api/v1/recommend`). Aston filters resorts, responds with 12-page PDF brochure links and ready-to-send WhatsApp options, and records a lead in CRM.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center font-bold text-sm mb-4">
              S2
            </div>
            <h3 className="text-sm font-bold text-stone-900">2. Outbound Stay Vouchers</h3>
            <p className="text-xs text-stone-500 mt-2 leading-relaxed">
              When booking is confirmed, Aston calls the WhatsApp webhook (`POST /api/send-message`) with the official stay voucher, Google Maps driving link, and nearby Wayanad attractions.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center font-bold text-sm mb-4">
              S3
            </div>
            <h3 className="text-sm font-bold text-stone-900">3. Diagnostic Health Probe</h3>
            <p className="text-xs text-stone-500 mt-2 leading-relaxed">
              One-click diagnostic ping probe checks roundtrip latency (ms), verifies security credentials, and ensures both apps are in sync without creating test leads.
            </p>
          </div>
        </div>

        {/* Cyber Defense Shield */}
        <div className="mt-12 p-8 bg-stone-900 text-white rounded-3xl">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h2 className="text-lg font-black tracking-tight">
              Enterprise Cyber Threat Protections
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 text-xs text-stone-300">
            <div>
              <strong className="text-white block mb-1">Timing-Safe API Key Authentication:</strong>
              Prevents side-channel timing analysis attacks using constant-time byte comparisons (`crypto.timingSafeEqual`).
            </div>
            <div>
              <strong className="text-white block mb-1">Sliding-Window Rate Limiter:</strong>
              Defends against DDoS and automated brute-force attacks by throttling unauthorized high-volume callers.
            </div>
            <div>
              <strong className="text-white block mb-1">Strict Anti-Injection &amp; Sanitization:</strong>
              Cleanses HTML, script tags, and prototype pollution keywords from user inputs before persistence.
            </div>
            <div>
              <strong className="text-white block mb-1">Complete Real-Time Audit Log:</strong>
              Every request is timestamped with client IP, status code, and latency in `/admin/dev`.
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-6 text-center text-xs text-stone-500">
        Aston Holidays • Historic Footprints of Wayanad • Backoffice System
      </footer>
    </div>
  );
}
