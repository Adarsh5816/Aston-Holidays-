"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";
import { Resort, NearbyAttraction, AccommodationType, StayPreference, AmbienceType } from "@/lib/types";
import { Building2, Search, Bed, Users, Plus, FileText, Check, X, MapPin, Trash2, Edit3, Navigation, Sparkles, Layers } from "lucide-react";

export default function ResortManagerPage() {
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResort, setEditingResort] = useState<Resort | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form State for 9 Dimensions
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [destination, setDestination] = useState("Padinjarathara");
  const [locationDetails, setLocationDetails] = useState("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [accommodationType, setAccommodationType] = useState<AccommodationType>("Private Pool Villa");
  const [stayPreference, setStayPreference] = useState<StayPreference>("Independent Private Cottage/Villa");
  const [ambienceStr, setAmbienceStr] = useState("Mountain / Valley View, Lake / Dam Waterfront");
  const [category, setCategory] = useState<Resort["category"]>("Pool Villa");
  const [bedrooms, setBedrooms] = useState(2);
  const [bathrooms, setBathrooms] = useState(2);
  const [maxAdults, setMaxAdults] = useState(6);
  const [maxChildren, setMaxChildren] = useState(2);
  const [maxGuests, setMaxGuests] = useState(8);
  const [pricePerNight, setPricePerNight] = useState(12000);
  const [b2bRate, setB2bRate] = useState(9000);
  const [coverImage, setCoverImage] = useState("");
  const [photosStr, setPhotosStr] = useState("");
  const [amenitiesStr, setAmenitiesStr] = useState("Infinity Swimming Pool, Kids Play area, Camp Fire (Chargeable), High Speed Wifi");
  const [specialitiesStr, setSpecialitiesStr] = useState("Banasura hill view, Hilltop sunset view");
  const [checkInTime, setCheckInTime] = useState("01:00 PM");
  const [checkOutTime, setCheckOutTime] = useState("11:00 AM");
  const [overview, setOverview] = useState("");
  const [nearbyAttractions, setNearbyAttractions] = useState<NearbyAttraction[]>([
    { name: "Banasura Sagar Dam", distance: "≈03 km" },
    { name: "Karlad Lake", distance: "≈05 km" },
    { name: "Meenmutty Waterfalls", distance: "≈06 km" }
  ]);

  const loadResorts = async () => {
    try {
      const res = await fetch("/api/v1/resorts");
      if (res.ok) {
        const data = await res.json();
        setResorts(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadResorts();
  }, []);

  const openCreateModal = () => {
    setEditingResort(null);
    setCode(`AH-${120 + resorts.length + 1}`);
    setName("");
    setDestination("Padinjarathara");
    setLocationDetails("Near Banasura Dam, Wayanad, Kerala");
    setGoogleMapsUrl("https://maps.google.com/?q=Banasura+Dam+Wayanad");
    setAccommodationType("Private Pool Villa");
    setStayPreference("Independent Private Cottage/Villa");
    setAmbienceStr("Mountain / Valley View, Lake / Dam Waterfront, Secluded & Peaceful");
    setCategory("Pool Villa");
    setBedrooms(2);
    setBathrooms(2);
    setMaxAdults(6);
    setMaxChildren(2);
    setMaxGuests(8);
    setPricePerNight(12000);
    setB2bRate(9000);
    setCoverImage("");
    setPhotosStr("");
    setAmenitiesStr("Infinity Swimming Pool, Mountain View Balcony, High Speed Wifi, Campfire Area");
    setSpecialitiesStr("Valley view, Peaceful privacy");
    setCheckInTime("01:00 PM");
    setCheckOutTime("11:00 AM");
    setOverview("Stunning luxury villa nestled in Wayanad with private pool and scenic hill views.");
    setNearbyAttractions([
      { name: "Banasura Sagar Dam", distance: "≈03 km" },
      { name: "Karlad Lake", distance: "≈05 km" }
    ]);
    setIsModalOpen(true);
  };

  const openEditModal = (resort: Resort) => {
    setEditingResort(resort);
    setCode(resort.code);
    setName(resort.name);
    setDestination(resort.destination);
    setLocationDetails(resort.locationDetails || "");
    setGoogleMapsUrl(resort.googleMapsUrl || "");
    setAccommodationType(resort.accommodationType || "Private Pool Villa");
    setStayPreference(resort.stayPreference || "Independent Private Cottage/Villa");
    setAmbienceStr(resort.ambience ? resort.ambience.join(", ") : "Mountain / Valley View");
    setCategory(resort.category);
    setBedrooms(resort.bedrooms);
    setBathrooms(resort.bathrooms);
    setMaxAdults(resort.maxAdults || resort.maxGuests);
    setMaxChildren(resort.maxChildren || 2);
    setMaxGuests(resort.maxGuests);
    setPricePerNight(resort.pricePerNight);
    setB2bRate(resort.b2bRate);
    setCoverImage(resort.coverImage);
    setPhotosStr(resort.photos.join(", "));
    setAmenitiesStr(resort.amenities.join(", "));
    setSpecialitiesStr(resort.specialities.join(", "));
    setCheckInTime(resort.checkInTime || "01:00 PM");
    setCheckOutTime(resort.checkOutTime || "11:00 AM");
    setOverview(resort.overview || "");
    setNearbyAttractions(resort.nearbyAttractions && resort.nearbyAttractions.length > 0 ? resort.nearbyAttractions : [
      { name: "Banasura Sagar Dam", distance: "≈03 km" }
    ]);
    setIsModalOpen(true);
  };

  const handleAddAttraction = () => {
    setNearbyAttractions([...nearbyAttractions, { name: "", distance: "≈05 km" }]);
  };

  const handleRemoveAttraction = (index: number) => {
    setNearbyAttractions(nearbyAttractions.filter((_, i) => i !== index));
  };

  const handleAttractionChange = (index: number, field: keyof NearbyAttraction, value: string) => {
    const updated = [...nearbyAttractions];
    updated[index][field] = value;
    setNearbyAttractions(updated);
  };

  const handleSaveResort = async (e: React.FormEvent) => {
    e.preventDefault();

    const photoList = photosStr
      .split(",")
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const amenityList = amenitiesStr
      .split(",")
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const specialityList = specialitiesStr
      .split(",")
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const ambienceList = ambienceStr
      .split(",")
      .map(s => s.trim())
      .filter(s => s.length > 0) as AmbienceType[];

    const resortObj: Resort = {
      id: editingResort ? editingResort.id : `resort-${code.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
      code: code.trim().toUpperCase(),
      name: name.trim(),
      slug: name.toLowerCase().replace(/[^a-z0-9]/g, "-") + "-" + destination.toLowerCase(),
      destination,
      locationDetails,
      googleMapsUrl: googleMapsUrl.trim() || undefined,
      accommodationType,
      stayPreference,
      ambience: ambienceList.length > 0 ? ambienceList : ["Mountain / Valley View"],
      category,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      maxAdults: Number(maxAdults),
      maxChildren: Number(maxChildren),
      maxGuests: Number(maxGuests),
      pricePerNight: Number(pricePerNight),
      b2bRate: Number(b2bRate),
      featured: editingResort ? editingResort.featured : true,
      coverImage: coverImage.trim() || photoList[0] || "",
      photos: photoList,
      amenities: amenityList,
      specialities: specialityList,
      nearbyAttractions: nearbyAttractions.filter(a => a.name.trim().length > 0),
      checkInTime,
      checkOutTime,
      overview,
      inclusions: [
        "Exclusive access to villa & private pool",
        "Welcome drink on arrival",
        "High-speed WiFi"
      ],
      exclusions: [
        "Chef-prepared BBQ and dinners",
        "Vehicle sightseeing"
      ]
    };

    const res = await fetch("/api/v1/resorts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(resortObj)
    });

    if (res.ok) {
      const saved = await res.json();
      if (editingResort) {
        setResorts(resorts.map(r => r.id === saved.id ? saved : r));
      } else {
        setResorts([saved, ...resorts]);
      }
      setIsModalOpen(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const filtered = resorts.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.code.toLowerCase().includes(search.toLowerCase()) ||
    r.destination.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#F5F6F8]">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
          <div>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">
              Resort & Villa Inventory Manager
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Add new properties with all 9 criteria (Accommodation Type, Stay Preference, Ambience, Adults, Children, Rooms, Attractions).
            </p>
          </div>

          <div className="flex items-center gap-3">
            {saveSuccess && (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Property Saved
              </span>
            )}
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#2E4F28] hover:bg-[#233D1F] px-4 py-2.5 rounded-xl transition shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add New Resort
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-6 max-w-md">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by code (AH-121), destination, or name..."
              className="w-full text-xs font-medium pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 bg-white"
            />
          </div>
        </div>

        {/* Resorts Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filtered.map((resort) => (
            <div
              key={resort.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 bg-stone-100">
                  <Image
                    src={resort.coverImage}
                    alt={resort.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-[#1A2218] text-white text-xs font-mono font-bold px-2.5 py-1 rounded shadow">
                    {resort.code}
                  </div>
                  <div className="absolute top-3 right-3 bg-white/95 text-stone-800 text-[10px] font-bold px-2 py-0.5 rounded shadow">
                    {resort.accommodationType || resort.category}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-stone-900 text-base">{resort.name}</h3>
                  <p className="text-xs text-stone-500 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" /> {resort.destination}, Wayanad
                  </p>

                  <div className="flex items-center gap-4 text-xs font-medium text-stone-600 mt-3 pt-3 border-t border-stone-100">
                    <span className="flex items-center gap-1">
                      <Bed className="w-3.5 h-3.5 text-stone-400" /> {resort.bedrooms} BHK
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-stone-400" /> {resort.maxAdults || resort.maxGuests} Adults, {resort.maxChildren || 2} Kids
                    </span>
                  </div>

                  {/* Ambience & Preference Tags */}
                  <div className="mt-2 flex flex-wrap gap-1">
                    <span className="text-[10px] bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                      {resort.stayPreference || "Private Villa"}
                    </span>
                    {resort.ambience && resort.ambience.slice(0, 1).map((amb, i) => (
                      <span key={i} className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
                        {amb}
                      </span>
                    ))}
                  </div>

                  {/* Pricing Box */}
                  <div className="mt-3 bg-stone-50 p-3 rounded-xl border border-stone-200/80 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-stone-400 block uppercase font-bold">Customer Rate</span>
                      <span className="text-sm font-extrabold text-[#2E4F28]">
                        ₹{resort.pricePerNight.toLocaleString("en-IN")}/n
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-stone-400 block uppercase font-bold">B2B Agent Rate</span>
                      <span className="text-sm font-bold text-stone-700">
                        ₹{resort.b2bRate.toLocaleString("en-IN")}/n
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0 flex items-center justify-between gap-2 border-t border-stone-100 mt-3 pt-3">
                <Link
                  href={`/brochure/${resort.code}`}
                  target="_blank"
                  className="inline-flex items-center gap-1 text-xs font-bold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-3 py-2 rounded-xl transition"
                >
                  <FileText className="w-3.5 h-3.5" /> 12-Page PDF
                </Link>

                <button
                  onClick={() => openEditModal(resort)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-xl transition"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ADD / EDIT RESORT MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-3xl w-full p-8 shadow-2xl border border-stone-200 my-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <div>
                  <h2 className="text-xl font-bold text-stone-900">
                    {editingResort ? `Edit Resort [${editingResort.code}]` : "Add New Resort / Villa"}
                  </h2>
                  <p className="text-xs text-stone-500">Configure all 9 criteria: Accommodation Type, Stay Preference, Ambience, Guests & Attractions</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveResort} className="space-y-4 mt-6 text-xs font-medium">
                
                {/* 1. Code, Name */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-stone-700 mb-1">Resort Code * (e.g. AH-122)</label>
                    <input
                      type="text"
                      required
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 font-mono font-bold"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-stone-700 mb-1">Property Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. 3BHK-Private Pool Villa"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 font-semibold"
                    />
                  </div>
                </div>

                {/* 2. Accommodation Type & Stay Preference */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-700 mb-1">1. Accommodation Type *</label>
                    <select
                      value={accommodationType}
                      onChange={(e) => {
                        setAccommodationType(e.target.value as AccommodationType);
                        if (e.target.value === "Private Pool Villa") setCategory("Pool Villa");
                        else if (e.target.value === "Tree House") setCategory("Tree House");
                        else if (e.target.value === "Budget Stay") setCategory("Budget Resort");
                        else setCategory("Luxury Resort");
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                    >
                      <option value="Private Pool Villa">Private Pool Villa</option>
                      <option value="Tree House">Canopy Tree House</option>
                      <option value="Luxury Resort">Luxury Resort</option>
                      <option value="Plantation Resort">Plantation Resort</option>
                      <option value="Heritage Bungalow">Heritage Bungalow</option>
                      <option value="Budget Stay">Budget Friendly Stay</option>
                      <option value="Glamping / Tent">Glamping / Tent</option>
                      <option value="Houseboat">Houseboat</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-stone-700 mb-1">2. Stay Preference *</label>
                    <select
                      value={stayPreference}
                      onChange={(e) => setStayPreference(e.target.value as StayPreference)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                    >
                      <option value="Independent Private Cottage/Villa">Independent Private Cottage / Villa</option>
                      <option value="Individual Room/Suite">Individual Room / Suite</option>
                      <option value="Group / Bachelor Friendly">Group / Bachelor Friendly</option>
                      <option value="Family Gathering">Family Gathering</option>
                    </select>
                  </div>
                </div>

                {/* 3. Destination & Ambience */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-700 mb-1">3. Location (Destination) *</label>
                    <select
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                    >
                      <option value="Padinjarathara">Padinjarathara (Banasura)</option>
                      <option value="Vythiri">Vythiri</option>
                      <option value="Meppadi">Meppadi (Chembra)</option>
                      <option value="Sulthan Bathery">Sulthan Bathery</option>
                      <option value="Kalpetta">Kalpetta</option>
                      <option value="Ambalavayal">Ambalavayal</option>
                      <option value="Muthanga">Muthanga & Tholpetty</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-stone-700 mb-1">4. Ambience / Vibe (Comma-separated)</label>
                    <input
                      type="text"
                      value={ambienceStr}
                      onChange={(e) => setAmbienceStr(e.target.value)}
                      placeholder="e.g. Mountain / Valley View, Lake / Dam Waterfront, Secluded"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200"
                    />
                  </div>
                </div>

                {/* 4. Google Maps & Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-700 mb-1">Address / Landmark</label>
                    <input
                      type="text"
                      value={locationDetails}
                      onChange={(e) => setLocationDetails(e.target.value)}
                      placeholder="Near Banasura Dam, Padinjarathara"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 mb-1">Google Maps Navigation URL</label>
                    <input
                      type="url"
                      value={googleMapsUrl}
                      onChange={(e) => setGoogleMapsUrl(e.target.value)}
                      placeholder="https://maps.google.com/?q=..."
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 font-mono text-[11px]"
                    />
                  </div>
                </div>

                {/* 5. Bedrooms, Adults, Children, Guests & Rates */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-stone-700 mb-1">Rooms (BHK)</label>
                    <input
                      type="number"
                      min={1}
                      value={bedrooms}
                      onChange={(e) => setBedrooms(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 mb-1">Max Adults</label>
                    <input
                      type="number"
                      min={1}
                      value={maxAdults}
                      onChange={(e) => setMaxAdults(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 mb-1">Max Kids</label>
                    <input
                      type="number"
                      min={0}
                      value={maxChildren}
                      onChange={(e) => setMaxChildren(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 mb-1">Rack Rate (₹)</label>
                    <input
                      type="number"
                      value={pricePerNight}
                      onChange={(e) => setPricePerNight(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 mb-1">B2B Rate (₹)</label>
                    <input
                      type="number"
                      value={b2bRate}
                      onChange={(e) => setB2bRate(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 font-bold text-stone-600"
                    />
                  </div>
                </div>

                {/* Photos */}
                <div>
                  <label className="block text-stone-700 mb-1">Cover Image Path / URL</label>
                  <input
                    type="text"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 mb-1">Photo Gallery (Comma-separated URLs/Paths)</label>
                  <textarea
                    rows={2}
                    value={photosStr}
                    onChange={(e) => setPhotosStr(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 font-mono text-[11px]"
                  />
                </div>

                {/* Amenities */}
                <div>
                  <label className="block text-stone-700 mb-1">Amenities (Comma-separated)</label>
                  <input
                    type="text"
                    value={amenitiesStr}
                    onChange={(e) => setAmenitiesStr(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200"
                  />
                </div>

                {/* Nearby Attractions */}
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-stone-900 text-xs">
                        Nearby Tourist Attractions & Distances
                      </h4>
                      <p className="text-[10px] text-stone-500">
                        These will automatically be sent in the WhatsApp confirmation message to the guest!
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddAttraction}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-white border border-stone-200 hover:bg-emerald-50 px-2.5 py-1 rounded-lg"
                    >
                      <Plus className="w-3 h-3" /> Add Attraction
                    </button>
                  </div>

                  <div className="space-y-2">
                    {nearbyAttractions.map((att, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={att.name}
                          onChange={(e) => handleAttractionChange(idx, "name", e.target.value)}
                          placeholder="Attraction name (e.g. Banasura Sagar Dam)"
                          className="flex-1 px-3 py-1.5 rounded-lg border border-stone-200 bg-white"
                        />
                        <input
                          type="text"
                          value={att.distance}
                          onChange={(e) => handleAttractionChange(idx, "distance", e.target.value)}
                          placeholder="Distance (e.g. ≈03 km)"
                          className="w-32 px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-center"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveAttraction(idx)}
                          className="text-stone-400 hover:text-red-600 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Check In / Out & Overview */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-700 mb-1">Check-in Time</label>
                    <input
                      type="text"
                      value={checkInTime}
                      onChange={(e) => setCheckInTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 mb-1">Check-out Time</label>
                    <input
                      type="text"
                      value={checkOutTime}
                      onChange={(e) => setCheckOutTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 mb-1">Property Overview</label>
                  <textarea
                    rows={3}
                    value={overview}
                    onChange={(e) => setOverview(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200"
                  />
                </div>

                {/* Submit */}
                <div className="pt-4 border-t border-stone-200 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-stone-600 font-semibold hover:bg-stone-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#2E4F28] hover:bg-[#233D1F] text-white font-bold rounded-xl shadow transition"
                  >
                    {editingResort ? "Save Changes" : "Create Resort & Brochure"}
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
