"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FilterBar from "@/components/FilterBar";
import ResortCard from "@/components/ResortCard";
import { Resort, FilterParams } from "@/lib/types";
import { Sparkles, Compass } from "lucide-react";

function ResortsCatalogContent() {
  const searchParams = useSearchParams();
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize from URL query params
  const initialDestination = searchParams.get("destination") || searchParams.get("location") || undefined;
  const initialType = searchParams.get("accommodationType") || searchParams.get("category") || undefined;
  const initialPreference = searchParams.get("stayPreference") || undefined;
  const initialAmbience = searchParams.get("ambience") || undefined;
  const initialBudgetMax = searchParams.get("budgetMax") ? Number(searchParams.get("budgetMax")) : undefined;
  const initialRooms = searchParams.get("rooms") ? Number(searchParams.get("rooms")) : undefined;
  const initialAdults = searchParams.get("adults") ? Number(searchParams.get("adults")) : undefined;
  const initialQuery = searchParams.get("q") || undefined;

  const fetchResorts = async (filters: FilterParams = {}) => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (filters.accommodationType) query.set("accommodationType", filters.accommodationType);
      if (filters.stayPreference) query.set("stayPreference", filters.stayPreference);
      if (filters.location) query.set("location", filters.location);
      if (filters.ambience) query.set("ambience", filters.ambience);
      if (filters.budgetMax) query.set("budgetMax", String(filters.budgetMax));
      if (filters.rooms) query.set("rooms", String(filters.rooms));
      if (filters.adults) query.set("adults", String(filters.adults));
      if (filters.children) query.set("children", String(filters.children));
      if (filters.query) query.set("q", filters.query);

      const res = await fetch(`/api/v1/resorts?${query.toString()}`);
      if (res.ok) {
        const data: Resort[] = await res.json();
        setResorts(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResorts({
      location: initialDestination,
      accommodationType: initialType,
      stayPreference: initialPreference,
      ambience: initialAmbience,
      budgetMax: initialBudgetMax,
      rooms: initialRooms,
      adults: initialAdults,
      query: initialQuery
    });
  }, [initialDestination, initialType, initialPreference, initialAmbience, initialBudgetMax, initialRooms, initialAdults, initialQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
          <Compass className="w-4 h-4 text-emerald-700" /> Wayanad Collection
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mt-1">
          Explore Curated Resorts & Private Villas
        </h1>
        <p className="text-sm text-stone-500 mt-1 max-w-xl">
          Filtered by Accommodation Type, Stay Preference, Location, Budget, Ambience, Adults, Children, and Rooms.
        </p>
      </div>

      {/* Filter Component */}
      <div className="mb-10">
        <FilterBar
          onFilterChange={fetchResorts}
          initialFilters={{
            location: initialDestination,
            accommodationType: initialType,
            stayPreference: initialPreference,
            ambience: initialAmbience,
            budgetMax: initialBudgetMax,
            rooms: initialRooms,
            adults: initialAdults,
            query: initialQuery
          }}
        />
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs font-bold text-stone-700">
          Showing <span className="text-emerald-800">{resorts.length}</span> matching properties
        </p>
      </div>

      {/* Resorts Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-96 bg-stone-200 rounded-2xl" />
          ))}
        </div>
      ) : resorts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {resorts.map((resort) => (
            <ResortCard key={resort.id} resort={resort} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 p-8">
          <Sparkles className="w-10 h-10 text-stone-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-stone-800">No matching resorts found for these exact filters</h3>
          <p className="text-sm text-stone-500 mt-1 max-w-md mx-auto">
            Try loosening the budget or ambience filter, or message our travel desk on WhatsApp for offline villa options.
          </p>
          <button
            onClick={() => fetchResorts({})}
            className="mt-4 px-5 py-2.5 bg-[#2E4F28] text-white text-xs font-semibold rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default function ResortsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#FAF8F5]">
        <Suspense fallback={<div className="p-12 text-center text-sm">Loading stays...</div>}>
          <ResortsCatalogContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
