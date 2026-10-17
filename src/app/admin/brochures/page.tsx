"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import Image from "next/image";
import Link from "next/link";
import {
  FileText,
  Sparkles,
  Check,
  Save,
  Download,
  Eye,
  Plus,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  Copy,
  ExternalLink,
  Layers,
  ArrowRight
} from "lucide-react";
import { Resort } from "@/lib/types";

// Standard 29 brochure photos extracted from Aston Holidays
const stockBrochurePhotos = Array.from({ length: 29 }, (_, i) => `/brochure-assets/extracted_img_${i + 1}.jpg`);

export default function BrochureStudioPage() {
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [selectedResort, setSelectedResort] = useState<Resort | null>(null);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [coverPhoto, setCoverPhoto] = useState<string>("");
  const [customPhotoUrl, setCustomPhotoUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    fetchResorts();
  }, []);

  const fetchResorts = async () => {
    try {
      const res = await fetch("/api/v1/resorts");
      const data = await res.json();
      if (data.resorts && data.resorts.length > 0) {
        setResorts(data.resorts);
        handleSelectResort(data.resorts[0]);
      }
    } catch (e) {
      console.error("Error loading resorts:", e);
    }
  };

  const handleSelectResort = (resort: Resort) => {
    setSelectedResort(resort);
    setCoverPhoto(resort.coverImage || stockBrochurePhotos[0]);
    setSelectedPhotos(resort.photos && resort.photos.length > 0 ? resort.photos : stockBrochurePhotos.slice(0, 5));
    setSaveSuccess(false);
  };

  const handleTogglePhoto = (photo: string) => {
    if (selectedPhotos.includes(photo)) {
      if (selectedPhotos.length <= 1) {
        alert("A brochure needs at least 1 photo.");
        return;
      }
      setSelectedPhotos(selectedPhotos.filter((p) => p !== photo));
      if (coverPhoto === photo) {
        const remaining = selectedPhotos.filter((p) => p !== photo);
        setCoverPhoto(remaining[0]);
      }
    } else {
      setSelectedPhotos([...selectedPhotos, photo]);
    }
  };

  const handleSetCover = (photo: string) => {
    setCoverPhoto(photo);
    if (!selectedPhotos.includes(photo)) {
      setSelectedPhotos([photo, ...selectedPhotos]);
    }
  };

  const handleAddCustomPhoto = () => {
    if (!customPhotoUrl.trim()) return;
    setSelectedPhotos([...selectedPhotos, customPhotoUrl.trim()]);
    setCustomPhotoUrl("");
  };

  const handleSaveAndGenerateBrochure = async () => {
    if (!selectedResort) return;
    try {
      setSaving(true);
      const updatedResort: Resort = {
        ...selectedResort,
        coverImage: coverPhoto,
        photos: selectedPhotos
      };

      const res = await fetch("/api/v1/resorts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedResort)
      });

      if (res.ok) {
        setSaveSuccess(true);
        // update local list
        setResorts(resorts.map((r) => (r.id === updatedResort.id ? updatedResort : r)));
        setSelectedResort(updatedResort);
        setTimeout(() => setSaveSuccess(false), 3500);
      }
    } catch (e) {
      alert("Failed to save brochure: " + (e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleCopyBrochureLink = () => {
    if (!selectedResort) return;
    const url = `${window.location.origin}/brochure/${selectedResort.code}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between pb-6 border-b border-stone-200 gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200/60">
                <FileText className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-2xl font-black text-stone-900 tracking-tight flex items-center gap-3">
                  Brochure &amp; PDF Studio
                  <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100/80 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-300">
                    Standard 12-Page Generator
                  </span>
                </h1>
                <p className="text-xs text-stone-500 mt-0.5">
                  Select resort photos and automatically compile the official Aston Holidays 12-page PDF brochure.
                </p>
              </div>
            </div>
          </div>

          {selectedResort && (
            <div className="flex items-center gap-3">
              <Link
                href={`/brochure/${selectedResort.code}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 px-3.5 py-2 rounded-xl transition shadow-sm"
              >
                <Eye className="w-4 h-4 text-emerald-700" /> Preview 12-Page Brochure
              </Link>

              <Link
                href={`/brochure/${selectedResort.code}?print=true`}
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 px-3.5 py-2 rounded-xl transition shadow-sm"
              >
                <Download className="w-4 h-4 text-emerald-700" /> Export PDF
              </Link>

              <button
                type="button"
                onClick={handleSaveAndGenerateBrochure}
                disabled={saving}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#2E4F28] hover:bg-[#233D1F] px-4 py-2 rounded-xl transition shadow-sm disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? "Generating & Saving..." : "Save Standard Brochure"}
              </button>
            </div>
          )}
        </div>

        {/* Success Alert */}
        {saveSuccess && (
          <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              <div>
                <p className="text-xs font-bold">Standard 12-Page PDF Brochure compiled and saved!</p>
                <p className="text-[11px] opacity-80">
                  Resort {selectedResort?.code} is now updated in Supabase. Customers on WhatsApp will receive this brochure.
                </p>
              </div>
            </div>
            <button
              onClick={handleCopyBrochureLink}
              className="text-xs font-bold text-emerald-800 underline flex items-center gap-1"
            >
              {copiedLink ? "Copied Link!" : "Copy WhatsApp Brochure Link"}
            </button>
          </div>
        )}

        {/* Main Grid: Resort Selector & Photo Studio */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Resort Selector */}
          <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-sm h-fit">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
              1. Select Resort ({resorts.length} Properties)
            </h3>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {resorts.map((r) => {
                const isSelected = selectedResort?.id === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => handleSelectResort(r)}
                    className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
                      isSelected
                        ? "bg-emerald-50 border-emerald-300 text-emerald-950 font-bold shadow-sm"
                        : "bg-white border-stone-200/70 hover:bg-stone-50 text-stone-700"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] bg-stone-900 text-white px-1.5 py-0.5 rounded">
                          {r.code}
                        </span>
                        <span className="text-xs truncate max-w-[150px]">{r.name}</span>
                      </div>
                      <p className="text-[10px] text-stone-500 mt-1">
                        📍 {r.destination} • ₹{r.pricePerNight?.toLocaleString("en-IN")}/night
                      </p>
                    </div>

                    <div className="text-right text-[10px] text-stone-400">
                      {r.photos?.length || 0} photos
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Resort Studio & Photo Picker */}
          <div className="lg:col-span-2 space-y-6">
            {selectedResort ? (
              <>
                {/* Active Resort Banner */}
                <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded">
                      Editing Brochure: {selectedResort.code}
                    </span>
                    <h2 className="text-lg font-black text-stone-900 mt-1">{selectedResort.name}</h2>
                    <p className="text-xs text-stone-500">
                      {selectedResort.destination} • {selectedResort.accommodationType} ({selectedResort.bedrooms} BHK)
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyBrochureLink}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 bg-stone-50 border border-stone-200 px-3.5 py-2 rounded-xl hover:bg-stone-100 transition"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedLink ? "Link Copied!" : "Copy Public Brochure Link"}
                    </button>
                  </div>
                </div>

                {/* Selected Photos Reel */}
                <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
                    <div>
                      <h3 className="text-sm font-bold text-stone-900">
                        2. Brochure Photo Sequence ({selectedPhotos.length} Assigned)
                      </h3>
                      <p className="text-xs text-stone-500">
                        The first image is your <strong>Cover Photo</strong>. The rest form the 12-page interior photo galleries.
                      </p>
                    </div>

                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                      Cover: Page 1
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {selectedPhotos.map((photo, index) => {
                      const isCover = photo === coverPhoto;
                      return (
                        <div
                          key={photo + index}
                          className={`relative rounded-xl overflow-hidden border-2 h-36 group ${
                            isCover ? "border-emerald-600 shadow-md ring-2 ring-emerald-500/20" : "border-stone-200"
                          }`}
                        >
                          <Image src={photo} alt={`Photo ${index + 1}`} fill className="object-cover" />

                          {isCover ? (
                            <div className="absolute top-2 left-2 bg-emerald-800 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded shadow">
                              Cover Photo
                            </div>
                          ) : (
                            <button
                              onClick={() => handleSetCover(photo)}
                              className="absolute top-2 left-2 bg-stone-900/80 hover:bg-stone-900 text-white text-[9px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition"
                            >
                              Set as Cover
                            </button>
                          )}

                          <button
                            onClick={() => handleTogglePhoto(photo)}
                            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition hover:bg-red-700"
                            title="Remove photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          <div className="absolute bottom-2 left-2 bg-stone-900/70 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                            Page {index + 1}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Add Custom Image URL input */}
                  <div className="mt-5 pt-4 border-t border-stone-100 flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Or paste an image URL to add to this brochure (https://...)"
                      value={customPhotoUrl}
                      onChange={(e) => setCustomPhotoUrl(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-600"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomPhoto}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 px-4 py-2 rounded-xl transition"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add URL
                    </button>
                  </div>
                </div>

                {/* Stock Brochure Assets Library */}
                <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
                    <div>
                      <h3 className="text-sm font-bold text-stone-900">
                        3. Aston Holidays Verified Photo Bank ({stockBrochurePhotos.length} Available)
                      </h3>
                      <p className="text-xs text-stone-500">
                        Click any photo below to toggle it into this resort&apos;s 12-page brochure.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 max-h-72 overflow-y-auto pr-1">
                    {stockBrochurePhotos.map((photo, i) => {
                      const isSelected = selectedPhotos.includes(photo);
                      return (
                        <div
                          key={photo}
                          onClick={() => handleTogglePhoto(photo)}
                          className={`relative rounded-xl overflow-hidden cursor-pointer h-24 border-2 transition ${
                            isSelected
                              ? "border-emerald-600 shadow-md ring-2 ring-emerald-500/20"
                              : "border-stone-200 hover:border-stone-400 opacity-60 hover:opacity-100"
                          }`}
                        >
                          <Image src={photo} alt={`Asset ${i + 1}`} fill className="object-cover" />
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 bg-emerald-700 text-white p-0.5 rounded-full shadow">
                              <Check className="w-3 h-3" />
                            </div>
                          )}
                          <div className="absolute bottom-1 left-1 bg-stone-900/80 text-white text-[8px] px-1 rounded font-mono">
                            #{i + 1}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-400 text-xs">
                Select a resort from the left to configure its brochure photos and generate its standard PDF.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
