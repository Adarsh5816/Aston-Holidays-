"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { SiteSettings } from "@/lib/types";
import { Palette, Save, Check, ExternalLink, Image as ImageIcon, Sparkles, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function CustomizerPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/v1/settings")
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error(err));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/v1/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (!settings) {
    return (
      <div className="flex min-h-screen bg-[#F5F6F8]">
        <AdminSidebar />
        <main className="flex-1 p-8 text-center text-xs">Loading customizer...</main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F5F6F8]">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
          <div>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
              <Palette className="w-6 h-6 text-emerald-700" /> Front-End Website Customizer
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Easily customize the customer-facing website content, hero banners, headlines, and contact info in real-time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 px-3.5 py-2 rounded-xl transition shadow-sm"
            >
              <span>View Live Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
            </Link>
          </div>
        </div>

        {savedSuccess && (
          <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            Changes saved successfully! Your customer-facing website has been updated in real-time.
          </div>
        )}

        <form onSubmit={handleSave} className="mt-6 space-y-8 max-w-4xl">
          
          {/* Section 1: Hero Section */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2 border-b border-stone-100 pb-3">
              <Sparkles className="w-4 h-4 text-emerald-700" /> 1. Homepage Hero Banner & Headline
            </h2>

            <div className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-stone-700 mb-1">Top Announcement Badge</label>
                <input
                  type="text"
                  value={settings.announcementText}
                  onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                />
              </div>

              <div>
                <label className="block text-stone-700 mb-1">Main Hero Headline</label>
                <textarea
                  rows={2}
                  value={settings.heroTitle}
                  onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 font-semibold text-stone-900"
                />
              </div>

              <div>
                <label className="block text-stone-700 mb-1">Hero Subtitle & Description</label>
                <textarea
                  rows={3}
                  value={settings.heroSubtitle}
                  onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 text-stone-600"
                />
              </div>

              <div>
                <label className="block text-stone-700 mb-1">Hero Background Panorama Image</label>
                <input
                  type="text"
                  value={settings.heroBannerImage}
                  onChange={(e) => setSettings({ ...settings, heroBannerImage: e.target.value })}
                  placeholder="/brand/wayanad-backcover.jpg or https://..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 font-mono text-[11px]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Wayanad Historic Heritage Story */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2 border-b border-stone-100 pb-3">
              <ImageIcon className="w-4 h-4 text-emerald-700" /> 2. Wayanad Heritage & Historic Footprints Story
            </h2>

            <div className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-stone-700 mb-1">Story Headline</label>
                <input
                  type="text"
                  value={settings.heritageStoryTitle}
                  onChange={(e) => setSettings({ ...settings, heritageStoryTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 font-semibold"
                />
              </div>

              <div>
                <label className="block text-stone-700 mb-1">Story Narrative (Edakkal Caves & Culture)</label>
                <textarea
                  rows={4}
                  value={settings.heritageStoryText}
                  onChange={(e) => setSettings({ ...settings, heritageStoryText: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-stone-700 mb-1">Historic Footprint Art Image Path</label>
                <input
                  type="text"
                  value={settings.heritageImage}
                  onChange={(e) => setSettings({ ...settings, heritageImage: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 font-mono text-[11px]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Official Contact & WhatsApp Settings */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2 border-b border-stone-100 pb-3">
              <MessageSquare className="w-4 h-4 text-emerald-700" /> 3. Company Contacts & Automated WhatsApp Webhook
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
              <div>
                <label className="block text-stone-700 mb-1">Customer Care Phone</label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                />
              </div>

              <div>
                <label className="block text-stone-700 mb-1">Primary WhatsApp Number</label>
                <input
                  type="text"
                  value={settings.whatsappNumber}
                  onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-stone-700 mb-1">Support Email</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-stone-700 mb-1">Sulthan Bathery Office Address</label>
                <textarea
                  rows={2}
                  value={settings.officeAddress}
                  onChange={(e) => setSettings({ ...settings, officeAddress: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-stone-700 mb-1">
                  WhatsApp API Application Webhook URL (for Auto-Voucher Dispatch)
                </label>
                <input
                  type="url"
                  value={settings.whatsappWebhookUrl || ""}
                  onChange={(e) => setSettings({ ...settings, whatsappWebhookUrl: e.target.value })}
                  placeholder="https://whatsapp-cloud-api-platform-test.vercel.app/api/send-message"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 font-mono text-[11px]"
                />
                <span className="text-[11px] text-stone-400 mt-1 block">
                  When a booking is confirmed, Aston Holidays will POST the booking voucher & attractions payload to this URL.
                </span>
              </div>
            </div>
          </div>

          {/* Save Action Button */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 bg-[#2E4F28] hover:bg-[#233D1F] text-white font-bold px-8 py-3 rounded-xl transition shadow"
            >
              <Save className="w-4 h-4" />
              {saving ? "Publishing Changes..." : "Publish Front-End Changes"}
            </button>
          </div>

        </form>
      </main>
    </div>
  );
}
