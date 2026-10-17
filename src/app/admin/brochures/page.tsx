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
  CheckCircle2,
  Copy,
  ExternalLink,
  Bot,
  Wand2,
  Printer,
  ShieldCheck,
  MapPin,
  ListPlus
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
  
  // AI/GPT content state
  const [overview, setOverview] = useState("");
  const [specialities, setSpecialities] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [nearbyAttractions, setNearbyAttractions] = useState<{ name: string; distance: string }[]>([]);
  const [isAiEnhancing, setIsAiEnhancing] = useState(false);
  const [aiEnhancedSuccess, setAiEnhancedSuccess] = useState(false);

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
    setOverview(resort.overview || "");
    setSpecialities(resort.specialities || []);
    setAmenities(resort.amenities || []);
    setNearbyAttractions(resort.nearbyAttractions || []);
    setSaveSuccess(false);
    setAiEnhancedSuccess(false);
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

  // AI / GPT Brochure Content Generator
  const handleAiEnhanceCopy = async () => {
    if (!selectedResort) return;
    try {
      setIsAiEnhancing(true);
      setAiEnhancedSuccess(false);
      const res = await fetch("/api/v1/brochures/ai-enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: selectedResort.code,
          name: selectedResort.name,
          destination: selectedResort.destination,
          accommodationType: selectedResort.accommodationType,
          bedrooms: selectedResort.bedrooms,
          pricePerNight: selectedResort.pricePerNight,
          notes: selectedResort.specialities?.join(", ")
        })
      });

      const data = await res.json();
      if (data.success && data.enhanced) {
        setOverview(data.enhanced.overview);
        setSpecialities(data.enhanced.specialities);
        setAmenities(data.enhanced.amenities);
        setNearbyAttractions(data.enhanced.nearbyAttractions);
        setAiEnhancedSuccess(true);
      }
    } catch (e) {
      alert("AI Generation failed: " + (e as Error).message);
    } finally {
      setIsAiEnhancing(false);
    }
  };

  const handleSaveAndGenerateBrochure = async () => {
    if (!selectedResort) return;
    try {
      setSaving(true);
      const updatedResort: Resort = {
        ...selectedResort,
        coverImage: coverPhoto,
        photos: selectedPhotos,
        overview,
        specialities,
        amenities,
        nearbyAttractions
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
                  Brochure &amp; PDF Studio with AI/GPT
                  <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100/80 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-300">
                    100% High-Definition Vector Output
                  </span>
                </h1>
                <p className="text-xs text-stone-500 mt-0.5">
                  Select photos, generate luxury Wayanad descriptions with AI/GPT, and compile the official 12-page PDF brochure.
                </p>
              </div>
            </div>
          </div>

          {selectedResort && (
            <div className="flex items-center gap-3">
              <Link
                href={`/brochure/${selectedResort.code}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 px-3.5 py-2.5 rounded-xl transition shadow-sm"
              >
                <Eye className="w-4 h-4 text-emerald-700" /> Preview 12-Page Brochure
              </Link>

              <Link
                href={`/brochure/${selectedResort.code}?print=true`}
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-900 bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 px-4 py-2.5 rounded-xl transition shadow-sm"
              >
                <Printer className="w-4 h-4 text-emerald-800" /> Download 100% HD Vector PDF
              </Link>

              <button
                type="button"
                onClick={handleSaveAndGenerateBrochure}
                disabled={saving}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#2E4F28] hover:bg-[#233D1F] px-5 py-2.5 rounded-xl transition shadow-sm disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : "Save Standard Brochure"}
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
                <p className="text-xs font-bold">Standard 12-Page PDF Brochure saved and synced with Supabase!</p>
                <p className="text-[11px] opacity-80">
                  Resort {selectedResort?.code} is live. WhatsApp customers will receive this brochure in 100% High Definition.
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
              1. Select Resort ({resorts.length} Properties from Sheet)
            </h3>

            <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
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

          {/* Right Column: Selected Resort Studio & AI Generator */}
          <div className="lg:col-span-2 space-y-6">
            {selectedResort ? (
              <>
                {/* Active Resort Banner with AI Enhancer Action */}
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
                      onClick={handleAiEnhanceCopy}
                      disabled={isAiEnhancing}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-800 to-[#121D10] hover:from-emerald-900 hover:to-black px-4 py-2.5 rounded-xl shadow-md transition disabled:opacity-50"
                    >
                      <Sparkles className={`w-4 h-4 text-amber-300 ${isAiEnhancing ? "animate-spin" : ""}`} />
                      {isAiEnhancing ? "Gemini Enhancing..." : "✨ Google Gemini: Generate Ultra-HD Copy"}
                    </button>
                  </div>
                </div>

                {/* AI Notification Banner */}
                {aiEnhancedSuccess && (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-700" />
                      <span>
                        <strong>AI/GPT Generated Luxury Copy!</strong> High-converting overview, 5 specialities, and nearby attractions populated below. Click <strong>&quot;Save Standard Brochure&quot;</strong> to apply.
                      </span>
                    </div>
                  </div>
                )}

                {/* High-Definition 12-Page Photo Sequence Manager */}
                <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
                    <div>
                      <h3 className="text-sm font-bold text-stone-900">
                        2. 100% High-Definition Photo Sequence ({selectedPhotos.length} Assigned)
                      </h3>
                      <p className="text-xs text-stone-500">
                        The first image is your <strong>Cover Photo</strong> (Page 1). The rest populate the 12-page interior photo galleries.
                      </p>
                    </div>

                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      Lossless 300 DPI Vector Quality
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

                  {/* Add Custom Image URL */}
                  <div className="mt-5 pt-4 border-t border-stone-100 flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Paste any custom property image URL (https://...)"
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

                {/* AI / GPT Generated Overview & Details */}
                <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <div>
                      <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                        <Bot className="w-4 h-4 text-emerald-700" />
                        3. AI-Enhanced Luxury Brochure Text (Page 2 &amp; 3)
                      </h3>
                      <p className="text-xs text-stone-500">
                        Tailored specifically to Wayanad tourism to maximize booking conversions.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Property Overview &amp; Experience Story
                    </label>
                    <textarea
                      rows={4}
                      value={overview}
                      onChange={(e) => setOverview(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-600 leading-relaxed font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Signature Specialities (One per line)
                    </label>
                    <textarea
                      rows={3}
                      value={specialities.join("\n")}
                      onChange={(e) => setSpecialities(e.target.value.split("\n").filter(Boolean))}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-600 leading-relaxed font-medium"
                    />
                  </div>

                  {/* Nearby Attractions Preview */}
                  {nearbyAttractions.length > 0 && (
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Nearby Attractions &amp; Distances (Included on Page 10)
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {nearbyAttractions.map((att, i) => (
                          <div key={i} className="p-2 bg-stone-50 border border-stone-200/80 rounded-lg text-[11px] flex items-center justify-between">
                            <span className="font-semibold text-stone-800 truncate">{att.name}</span>
                            <span className="font-mono text-emerald-800 font-bold ml-1">{att.distance}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Stock Brochure Assets Bank */}
                <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
                    <div>
                      <h3 className="text-sm font-bold text-stone-900">
                        4. Aston Holidays Verified Photo Bank ({stockBrochurePhotos.length} Available)
                      </h3>
                      <p className="text-xs text-stone-500">
                        Click any photo below to toggle it into this resort&apos;s brochure.
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
