"use client";

import React from "react";
import AdminSidebar from "@/components/AdminSidebar";
import Link from "next/link";
import {
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Zap,
  Lock,
  MessageSquare,
  FileText,
  MapPin,
  ExternalLink
} from "lucide-react";

export default function IntegrationHelpPage() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F7F8FA]">
      <AdminSidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-5xl w-full">
        {/* Header */}
        <div className="pb-6 border-b border-stone-200">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200/60">
              <HelpCircle className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-2xl font-black text-stone-900 tracking-tight">
                Aston Holidays & WhatsApp App Connection Guide
              </h1>
              <p className="text-xs text-stone-500 mt-0.5">
                A simple, non-technical walkthrough for linking your WhatsApp bot with Aston Holidays.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Summary Card */}
        <div className="mt-6 p-6 bg-gradient-to-r from-emerald-900 to-[#1B3518] text-white rounded-3xl shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-800/60 px-3 py-1 rounded-full inline-block mb-3">
            How It Works in 30 Seconds
          </span>
          <h2 className="text-xl font-black leading-snug">
            Your WhatsApp Bot handles customer conversations. Aston Holidays acts as the smart resort brain and booking engine.
          </h2>
          <p className="text-xs text-emerald-100/90 mt-2 leading-relaxed">
            When a traveler asks your WhatsApp bot for a private pool villa or treehouse in Wayanad, your bot asks Aston Holidays for the best options. Aston instantly filters all resorts, creates 12-page photo brochures, and logs the customer inquiry directly into your team&apos;s CRM.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <Link
              href="/admin/dev"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-900 bg-white hover:bg-emerald-50 px-4 py-2.5 rounded-xl transition shadow"
            >
              <Terminal className="w-4 h-4 text-emerald-800" /> Open Developer Tab
            </Link>
          </div>
        </div>

        {/* The 3 Streams Explained */}
        <div className="mt-8 space-y-6">
          <h2 className="text-base font-black text-stone-900">
            The Two-Way Connection Streams (In Plain English)
          </h2>

          {/* Stream 1 */}
          <div className="p-6 bg-white rounded-2xl border border-stone-200/80 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-sm">
                1
              </span>
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  Stream 1: Inbound Recommendation Stream (WhatsApp → Aston)
                </h3>
                <span className="text-[11px] text-stone-500">
                  Customer Inquiry to Matching Stays & CRM Lead
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-600 mt-3 leading-relaxed">
              When a guest sends a WhatsApp message saying &quot;Looking for a 3BHK pool villa in Padinjarathara for 4 adults with lake view under ₹15,000&quot;, the WhatsApp app gathers their 9 criteria and calls:
            </p>
            <div className="mt-2 p-3 bg-stone-900 text-emerald-400 font-mono text-[11px] rounded-xl">
              POST http://localhost:3000/api/v1/recommend
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60">
                <span className="font-bold text-stone-800 block mb-1">What Aston Returns to WhatsApp:</span>
                <ul className="space-y-1 text-stone-600 list-disc list-inside text-[11px]">
                  <li>List of verified resorts matching all 9 criteria</li>
                  <li>Clickable link to authentic 12-page web brochure</li>
                  <li>One-click printable PDF brochure download link</li>
                  <li>Pre-formatted WhatsApp bubble text with prices & room details</li>
                </ul>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60">
                <span className="font-bold text-stone-800 block mb-1">Automatic Aston Side-Effect:</span>
                <ul className="space-y-1 text-stone-600 list-disc list-inside text-[11px]">
                  <li>Creates a new lead in your Leads CRM (`/admin/leads`)</li>
                  <li>Records guest phone number & travel dates</li>
                  <li>Allows staff to follow up instantly</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Stream 2 */}
          <div className="p-6 bg-white rounded-2xl border border-stone-200/80 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center font-bold text-sm">
                2
              </span>
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  Stream 2: Outbound Voucher Stream (Aston → WhatsApp)
                </h3>
                <span className="text-[11px] text-stone-500">
                  Staff Booking Confirmation to WhatsApp Stay Voucher
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-600 mt-3 leading-relaxed">
              When a guest pays the advance and Aston staff marks the reservation confirmed in `/admin/invoices`:
            </p>
            <div className="mt-2 p-3 bg-stone-900 text-blue-300 font-mono text-[11px] rounded-xl">
              POST https://&lt;your-whatsapp-domain&gt;/api/send-message
            </div>

            <div className="mt-4 p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-900">
              <span className="font-bold block mb-1">What Gets Sent Directly to the Customer&apos;s WhatsApp:</span>
              <p className="text-[11px] text-blue-800 leading-relaxed">
                🎉 Official Stay Voucher number, Check-in/Check-out timings, Advance paid & balance due at arrival, Google Maps driving link directly to the resort, and a curated list of nearby Wayanad attractions with approximate driving distances!
              </p>
            </div>
          </div>

          {/* Stream 3 */}
          <div className="p-6 bg-white rounded-2xl border border-stone-200/80 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center font-bold text-sm">
                3
              </span>
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  Stream 3: Real-Time Diagnostic Health Probe (Ping)
                </h3>
                <span className="text-[11px] text-stone-500">
                  One-Click Connectivity & Latency Verification
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-600 mt-3 leading-relaxed">
              Whenever you want to confirm that both applications are communicating smoothly, click <strong>&quot;Test Connection (Ping)&quot;</strong> in either portal. A lightweight ping verifies security tokens, measures round-trip speed in milliseconds (e.g. 28ms), and confirms zero firewall blockages without cluttering your CRM.
            </p>
          </div>
        </div>

        {/* Step by Step Non-Techie Setup */}
        <div className="mt-8 p-6 bg-white rounded-2xl border border-stone-200/80 shadow-sm">
          <h2 className="text-base font-black text-stone-900 pb-3 border-b border-stone-100">
            Step-by-Step: How to Connect Both Apps in 4 Easy Steps
          </h2>

          <div className="mt-5 space-y-4 text-xs">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                1
              </div>
              <div>
                <h4 className="font-bold text-stone-900">Open the Aston Developer Tab</h4>
                <p className="text-stone-500 mt-0.5">
                  Click <strong>&quot;Developer Hub&quot;</strong> in the sidebar (or navigate to `/admin/dev`).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                2
              </div>
              <div>
                <h4 className="font-bold text-stone-900">Copy the Inbound API Key</h4>
                <p className="text-stone-500 mt-0.5">
                  Click the copy button next to <strong>&quot;Aston Inbound API Key&quot;</strong> (e.g., `aston_sec_live_...`).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                3
              </div>
              <div>
                <h4 className="font-bold text-stone-900">Paste Into Your WhatsApp App Dev Portal</h4>
                <p className="text-stone-500 mt-0.5">
                  Open your WhatsApp App&apos;s Dev Tab (`/dev`), select the Aston Holidays card, enter your Aston Base URL (e.g. `http://localhost:3000`), and paste the API key into the API Key field.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                4
              </div>
              <div>
                <h4 className="font-bold text-stone-900">Click &quot;Test Connection (Ping)&quot;</h4>
                <p className="text-stone-500 mt-0.5">
                  Click the green Test Ping button. When you see the green <strong>&quot;Connection Verified (28ms)&quot;</strong> badge, your two systems are live and ready to serve travelers!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Cyber Threat Protections Explained */}
        <div className="mt-8 p-6 bg-white rounded-2xl border border-stone-200/80 shadow-sm">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <h2 className="text-base font-black text-stone-900">
              Built-In Cyber Threat Protections (How We Keep You Safe)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60">
              <span className="font-bold text-stone-900 block mb-1">🛡️ Anti-DDoS &amp; Rate Limiter</span>
              <p className="text-stone-500 text-[11px]">
                Stops malicious bots from spamming your website by capping queries to 120 requests/minute per caller.
              </p>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60">
              <span className="font-bold text-stone-900 block mb-1">⏱️ Timing-Safe Authentication</span>
              <p className="text-stone-500 text-[11px]">
                Uses cryptographic constant-time comparison (`crypto.timingSafeEqual`) to prevent hackers from cracking your keys via side-channel analysis.
              </p>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60">
              <span className="font-bold text-stone-900 block mb-1">🧼 Deep Input Sanitization</span>
              <p className="text-stone-500 text-[11px]">
                Filters out malicious script tags, SQL injection characters, and prototype pollution keywords from user messages before touching the database.
              </p>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60">
              <span className="font-bold text-stone-900 block mb-1">📋 Live Security Audit Log</span>
              <p className="text-stone-500 text-[11px]">
                Every single query is timestamped and recorded with client IP and response time so your team has complete transparency.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
