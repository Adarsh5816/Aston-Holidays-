"use client";

import React, { useState, useEffect } from "react";
import { Search, MapPin, Home, Users, DollarSign, Filter, Sparkles, Calendar, Layers, Bed, Baby, RefreshCw } from "lucide-react";
import { FilterParams } from "@/lib/types";

interface FilterBarProps {
  onFilterChange: (filters: FilterParams) => void;
  initialFilters?: FilterParams;
}

export default function FilterBar({ onFilterChange, initialFilters = {} }: FilterBarProps) {
  // 9 Core Dimensions State
  const [accommodationType, setAccommodationType] = useState(initialFilters.accommodationType || "all");
  const [stayPreference, setStayPreference] = useState(initialFilters.stayPreference || "all");
  const [location, setLocation] = useState(initialFilters.location || initialFilters.destination || "all");
  const [budgetMax, setBudgetMax] = useState<number>(initialFilters.budgetMax || 0);
  const [ambience, setAmbience] = useState(initialFilters.ambience || "all");
  const [adults, setAdults] = useState<number>(initialFilters.adults || 0);
  const [children, setChildren] = useState<number>(initialFilters.children || 0);
  const [rooms, setRooms] = useState<number>(initialFilters.rooms || initialFilters.bedrooms || 0);
  const [checkIn, setCheckIn] = useState(initialFilters.checkIn || "");
  const [checkOut, setCheckOut] = useState(initialFilters.checkOut || "");
  const [query, setQuery] = useState(initialFilters.query || "");

  const [expandedAdvanced, setExpandedAdvanced] = useState(false);
  const [taxonomies, setTaxonomies] = useState<any>(null);

  useEffect(() => {
    if (initialFilters.accommodationType || initialFilters.category) {
      setAccommodationType(initialFilters.accommodationType || initialFilters.category || "all");
    }
    if (initialFilters.stayPreference) {
      setStayPreference(initialFilters.stayPreference);
    }
    if (initialFilters.location || initialFilters.destination) {
      setLocation(initialFilters.location || initialFilters.destination || "all");
    }
    if (initialFilters.budgetMax !== undefined) {
      setBudgetMax(initialFilters.budgetMax);
    }
    if (initialFilters.ambience) {
      setAmbience(initialFilters.ambience);
    }
    if (initialFilters.rooms !== undefined || initialFilters.bedrooms !== undefined) {
      setRooms(initialFilters.rooms || initialFilters.bedrooms || 0);
    }
    if (initialFilters.adults !== undefined) {
      setAdults(initialFilters.adults);
    }
    if (initialFilters.query !== undefined) {
      setQuery(initialFilters.query);
    }
  }, [initialFilters]);

  useEffect(() => {
    fetch("/api/v1/taxonomies")
      .then((r) => r.json())
      .then((d) => setTaxonomies(d))
      .catch(() => null);
  }, []);

  const handleApply = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onFilterChange({
      collection: initialFilters.collection,
      accommodationType: accommodationType === "all" ? undefined : accommodationType,
      stayPreference: stayPreference === "all" ? undefined : stayPreference,
      location: location === "all" ? undefined : location,
      budgetMax: budgetMax > 0 ? budgetMax : undefined,
      ambience: ambience === "all" ? undefined : ambience,
      adults: adults > 0 ? adults : undefined,
      children: children > 0 ? children : undefined,
      rooms: rooms > 0 ? rooms : undefined,
      checkIn: checkIn || undefined,
      checkOut: checkOut || undefined,
      query: query.trim() || undefined
    });
  };

  const handleReset = () => {
    setAccommodationType("all");
    setStayPreference("all");
    setLocation("all");
    setBudgetMax(0);
    setAmbience("all");
    setAdults(0);
    setChildren(0);
    setRooms(0);
    setCheckIn("");
    setCheckOut("");
    setQuery("");
    onFilterChange({});
  };

  return (
    <form onSubmit={handleApply} className="bg-white p-6 rounded-3xl shadow-md border border-stone-200">
      
      {/* Search Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900">Custom Stay Finder (9-Stage Filter)</h3>
            <p className="text-[11px] text-stone-500">Fine-tune your stay by villa type, ambience, group preference & dates</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setExpandedAdvanced(!expandedAdvanced)}
          className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition"
        >
          {expandedAdvanced ? "Hide More Options ▲" : "Show All 9 Filters ▼"}
        </button>
      </div>

      {/* Row 1: Primary Filters (Type, Location, Budget, Rooms) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Type */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5 text-emerald-700" /> 1. Type
          </label>
          <select
            value={accommodationType}
            onChange={(e) => setAccommodationType(e.target.value)}
            className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 bg-white"
          >
            <option value="all">All Types</option>
            {(taxonomies?.resortFilters?.accommodationTypes || [
              "Private Pool Villa",
              "Family resort",
              "Group"
            ]).map((t: string) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* 2. Location */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-700" /> 2. Location
          </label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 bg-white"
          >
            <option value="all">All Locations</option>
            {(taxonomies?.resortFilters?.destinations || [
              "Sulthan Bathery",
              "Kalpetta",
              "Mananthavady"
            ]).map((d: string) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* 3. Budget Max */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-700" /> 3. Price Range / Budget
          </label>
          <select
            value={budgetMax}
            onChange={(e) => setBudgetMax(Number(e.target.value))}
            className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 bg-white"
          >
            <option value={0}>Any Budget</option>
            <option value={5000}>₹2,000 - ₹5,000 /night</option>
            <option value={10000}>₹5,000 - ₹10,000 /night</option>
            <option value={50000}>₹10,000 Plus /night</option>
          </select>
        </div>

        {/* 4. Rooms Required */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
            <Bed className="w-3.5 h-3.5 text-emerald-700" /> 4. Rooms (Bedrooms)
          </label>
          <select
            value={rooms}
            onChange={(e) => setRooms(Number(e.target.value))}
            className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 bg-white"
          >
            <option value={0}>Any Number of Rooms</option>
            <option value={1}>1 Room</option>
            <option value={2}>2 Rooms</option>
            <option value={3}>3 Rooms</option>
            <option value={4}>4 Rooms</option>
            <option value={5}>5 Rooms</option>
            <option value={6}>6 Rooms</option>
            <option value={7}>7+ Rooms</option>
          </select>
        </div>

      </div>

      {/* Row 2: Advanced Dimensions (Room Type, Ambience, Adults, Kids, Travel Dates) */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-4 pt-4 border-t border-stone-100 ${expandedAdvanced ? "block" : "hidden sm:grid"}`}>
        
        {/* 5. Room Type */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-700" /> 5. Room Type
          </label>
          <select
            value={stayPreference}
            onChange={(e) => setStayPreference(e.target.value)}
            className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 bg-white"
          >
            <option value="all">Any Room Type</option>
            {(taxonomies?.resortFilters?.stayPreferences || [
              "Independent cottage",
              "twin cottage",
              "multi cottage"
            ]).map((p: string) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* 6. Ambience */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" /> 6. Ambiance
          </label>
          <select
            value={ambience}
            onChange={(e) => setAmbience(e.target.value)}
            className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 bg-white"
          >
            <option value="all">Any Ambiance</option>
            <option value="Forest/Plantation">Forest / Plantation</option>
            <option value="Mountain/Hill top">Mountain / Hill top</option>
            <option value="Water Frontage">Water Frontage</option>
          </select>
        </div>

        {/* 7. Adults */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-emerald-700" /> 7. Adults
          </label>
          <select
            value={adults}
            onChange={(e) => setAdults(Number(e.target.value))}
            className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 bg-white"
          >
            <option value={0}>Any Number</option>
            <option value={2}>2 Adults</option>
            <option value={4}>4 Adults</option>
            <option value={6}>6 Adults</option>
            <option value={8}>8+ Adults</option>
            <option value={12}>12+ Adults</option>
          </select>
        </div>

        {/* 8. Children */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
            <Baby className="w-3.5 h-3.5 text-emerald-700" /> 8. Children
          </label>
          <select
            value={children}
            onChange={(e) => setChildren(Number(e.target.value))}
            className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 bg-white"
          >
            <option value={0}>0 Children</option>
            <option value={1}>1 Child</option>
            <option value={2}>2 Children</option>
            <option value={3}>3+ Children</option>
          </select>
        </div>

        {/* 9. Travel Dates (Check-In) */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-700" /> 9. Travel Dates
          </label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
          />
        </div>

      </div>

      {/* Bottom Bar Actions */}
      <div className="mt-5 pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Search className="w-3.5 h-3.5 text-stone-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search code (AH-121) or keyword..."
            className="text-xs font-medium px-3 py-1.5 rounded-lg border border-stone-200 w-52 sm:w-64 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-stone-800 px-3 py-2 rounded-xl hover:bg-stone-100 transition"
          >
            <RefreshCw className="w-3 h-3" /> Reset
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#2E4F28] hover:bg-[#233D1F] px-6 py-2.5 rounded-xl transition shadow"
          >
            <Filter className="w-3.5 h-3.5" /> Filter Properties
          </button>
        </div>
      </div>

    </form>
  );
}
