"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Printer,
  Search,
  Upload,
  Image as ImageIcon,
  Bot,
  MapPin,
  Camera,
  Star
} from "lucide-react";
import { Resort } from "@/lib/types";

// Stock brochure photo library from Aston Holidays assets
const stockBrochurePhotos = Array.from({ length: 29 }, (_, i) => `/brochure-assets/extracted_img_${i + 1}.jpg`);

export default function BrochureStudioPage() {
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [selectedResort, setSelectedResort] = useState<Resort | null>(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [coverPhoto, setCoverPhoto] = useState<string>("");
  const [customPhotoUrl, setCustomPhotoUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // AI / Gemini content state
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
      if (res.ok) {
        const data = await res.json();
        const list: Resort[] = Array.isArray(data) ? data : (data.resorts || []);
        setResorts(list);
        if (list.length > 0) {
          handleSelectResort(list[0]);
        }
      }
    } catch (e) {
      console.error("Error loading resorts:", e);
    }
  };

  const handleSelectResort = (resort: Resort) => {
    setSelectedResort(resort);
    setCoverPhoto(resort.coverImage || "");
    setSelectedPhotos(resort.photos || []);
    setOverview(resort.overview || "");
    setSpecialities(resort.specialities || []);
    setAmenities(resort.amenities || []);
    setNearbyAttractions(resort.nearbyAttractions || []);
    setSaveSuccess(false);
    setAiEnhancedSuccess(false);
  };

  // Upload Photos from Computer
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          setSelectedPhotos((prev) => {
            const updated = [...prev, result];
            if (!coverPhoto && updated.length > 0) {
              setCoverPhoto(updated[0]);
            }
            return updated;
          });
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input so same file can be uploaded again if needed
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAddCustomPhoto = () => {
    if (!customPhotoUrl.trim()) return;
    const url = customPhotoUrl.trim();
    setSelectedPhotos((prev) => {
      const updated = [...prev, url];
      if (!coverPhoto) setCoverPhoto(url);
      return updated;
    });
    setCustomPhotoUrl("");
  };

  const handleRemovePhoto = (photoToRemove: string) => {
    const updated = selectedPhotos.filter((p) => p !== photoToRemove);
    setSelectedPhotos(updated);
    if (coverPhoto === photoToRemove) {
      setCoverPhoto(updated.length > 0 ? updated[0] : "");
    }
  };

  const handleSetCover = (photo: string) => {
    setCoverPhoto(photo);
    if (!selectedPhotos.includes(photo)) {
      setSelectedPhotos([photo, ...selectedPhotos]);
    }
  };

  const handleToggleStockPhoto = (photo: string) => {
    if (selectedPhotos.includes(photo)) {
      handleRemovePhoto(photo);
    } else {
      setSelectedPhotos((prev) => {
        const updated = [...prev, photo];
        if (!coverPhoto) setCoverPhoto(photo);
        return updated;
      });
    }
  };

  // Google Gemini AI Brochure Content Generator
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
        coverImage: coverPhoto || (selectedPhotos.length > 0 ? selectedPhotos[0] : ""),
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
        setResorts((prev) => prev.map((r) => (r.id === updatedResort.id ? updatedResort : r)));
        setSelectedResort(updatedResort);
        setTimeout(() => setSaveSuccess(false), 3500);
      } else {
        alert("Failed to save resort updates.");
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

  // Filter resorts based on search query
  const filteredResorts = resorts.filter((r) => {
    const q = searchFilter.toLowerCase();
    return (
      r.code.toLowerCase().includes(q) ||
      r.name.toLowerCase().includes(q) ||
      r.destination.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F7F8FA]">
      <AdminSidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto w-full">
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
                    100% High-Definition Vector Output
                  </span>
                </h1>
                <p className="text-xs text-stone-500 mt-0.5">
                  Select any resort, upload real high-res photos, generate luxury Wayanad descriptions with Gemini AI, and save the standard PDF.
                </p>
              </div>
            </div>
          </div>

          {selectedResort && (
            <div className="flex items-center gap-3 flex-wrap">
              <Link
                href={`/brochure/${selectedResort.code}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 px-3.5 py-2.5 rounded-xl transition shadow-sm"
              >
                <Eye className="w-4 h-4 text-emerald-700" /> Preview Brochure
              </Link>

              <Link
                href={`/brochure/${selectedResort.code}?print=true`}
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-900 bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 px-4 py-2.5 rounded-xl transition shadow-sm"
              >
                <Printer className="w-4 h-4 text-emerald-800" /> Download HD PDF
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
                <p className="text-xs font-bold">Standard PDF Brochure updated and synced with Cloud Database!</p>
                <p className="text-[11px] opacity-80">
                  Resort {selectedResort?.code} is ready. WhatsApp tourists will receive this exact verified brochure.
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
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                1. Select Resort ({filteredResorts.length} of {resorts.length})
              </h3>
            </div>

            {/* Search Box */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by code, name, location..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>

            <div className="space-y-1.5 max-h-[640px] overflow-y-auto pr-1">
              {filteredResorts.map((r) => {
                const isSelected = selectedResort?.id === r.id;
                const photoCount = r.photos?.length || 0;
                return (
                  <button
                    key={r.id}
                    onClick={() => handleSelectResort(r)}
                    className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
                      isSelected
                        ? "bg-emerald-50 border-emerald-400 text-emerald-950 font-bold shadow-sm ring-2 ring-emerald-500/20"
                        : "bg-white border-stone-200/70 hover:bg-stone-50 text-stone-700"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] bg-stone-900 text-white px-1.5 py-0.5 rounded font-bold">
                          {r.code}
                        </span>
                        <span className="text-xs truncate max-w-[150px] font-semibold">{r.name}</span>
                      </div>
                      <p className="text-[10px] text-stone-500 mt-1">
                        📍 {r.destination} • ₹{r.pricePerNight?.toLocaleString("en-IN")}/night
                      </p>
                    </div>

                    <div className="text-right">
                      {photoCount > 0 ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                          {photoCount} photos
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full">
                          Pending Photos
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}

              {filteredResorts.length === 0 && (
                <div className="text-center py-8 text-xs text-stone-400">
                  No resorts match &quot;{searchFilter}&quot;
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Selected Resort Studio & Photo Manager */}
          <div className="lg:col-span-2 space-y-6">
            {selectedResort ? (
              <>
                {/* Active Resort Banner with AI Enhancer Action */}
                <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded">
                      Editing Property: {selectedResort.code}
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
                        <strong>Gemini AI Generated Ultra-HD Copy!</strong> Poetic overview, signature specialities, and accurate Wayanad distances populated below. Click <strong>&quot;Save Standard Brochure&quot;</strong> to apply.
                      </span>
                    </div>
                  </div>
                )}

                {/* 2. Photo Sequence & Upload Manager */}
                <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-stone-100">
                    <div>
                      <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                        <Camera className="w-4 h-4 text-emerald-700" />
                        2. Resort Photos ({selectedPhotos.length} Assigned)
                      </h3>
                      <p className="text-xs text-stone-500">
                        Upload real photos for this resort. The cover photo appears on Page 1; remaining photos fill the brochure pages.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 px-3.5 py-2 rounded-xl transition shadow-sm"
                      >
                        <Upload className="w-3.5 h-3.5" /> Upload from Computer
                      </button>
                    </div>
                  </div>

                  {/* Photos Grid or Empty State */}
                  {selectedPhotos.length > 0 ? (
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
                              <div className="absolute top-2 left-2 bg-emerald-800 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded shadow flex items-center gap-1">
                                <Star className="w-3 h-3 fill-current" /> Cover Photo
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
                              onClick={() => handleRemovePhoto(photo)}
                              className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition hover:bg-red-700 shadow"
                              title="Delete photo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            <div className="absolute bottom-2 left-2 bg-stone-900/70 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                              Photo #{index + 1}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-12 border-2 border-dashed border-stone-200 rounded-2xl text-center bg-stone-50/50">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-stone-800">No photos added yet for {selectedResort.name}</h4>
                      <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                        Default images have been removed. Upload the resort&apos;s real photos using the button below or paste an image link.
                      </p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 px-4 py-2 rounded-xl transition shadow-sm"
                      >
                        <Upload className="w-3.5 h-3.5" /> Upload Photos Now
                      </button>
                    </div>
                  )}

                  {/* Add Custom Image URL */}
                  <div className="mt-5 pt-4 border-t border-stone-100 flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Or paste property image URL (https://...)"
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

                {/* 3. AI / Gemini Generated Overview & Details */}
                <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <div>
                      <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                        <Bot className="w-4 h-4 text-emerald-700" />
                        3. AI-Enhanced Luxury Brochure Text
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
                      placeholder="Click 'Google Gemini: Generate Ultra-HD Copy' above to auto-generate..."
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
                      placeholder="e.g. Private temperature-controlled infinity pool overlooking mist-laden tea slopes"
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-600 leading-relaxed font-medium"
                    />
                  </div>

                  {/* Nearby Attractions Preview */}
                  {nearbyAttractions.length > 0 && (
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Nearby Attractions &amp; Distances (Included in Brochure)
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

                {/* 4. Optional Asset Library */}
                <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
                    <div>
                      <h3 className="text-sm font-bold text-stone-900">
                        4. Optional Sample Photo Library ({stockBrochurePhotos.length} Stock Photos)
                      </h3>
                      <p className="text-xs text-stone-500">
                        Click any image if you wish to add sample photos to this resort. Otherwise leave empty until real photos are uploaded.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 max-h-56 overflow-y-auto pr-1">
                    {stockBrochurePhotos.map((photo, i) => {
                      const isSelected = selectedPhotos.includes(photo);
                      return (
                        <div
                          key={photo}
                          onClick={() => handleToggleStockPhoto(photo)}
                          className={`relative rounded-xl overflow-hidden cursor-pointer h-20 border-2 transition ${
                            isSelected
                              ? "border-emerald-600 shadow-md ring-2 ring-emerald-500/20"
                              : "border-stone-200 hover:border-stone-400 opacity-60 hover:opacity-100"
                          }`}
                        >
                          <Image src={photo} alt={`Asset ${i + 1}`} fill className="object-cover" />
                          {isSelected && (
                            <div className="absolute top-1 right-1 bg-emerald-700 text-white p-0.5 rounded-full shadow">
                              <Check className="w-3 h-3" />
                            </div>
                          )}
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
