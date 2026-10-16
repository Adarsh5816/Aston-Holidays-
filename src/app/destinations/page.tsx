import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { destinations } from "@/data/destinations";
import { ArrowRight, MapPin } from "lucide-react";

export default function DestinationsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#FAF8F5] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Wayanad Region Guide
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mt-1">
              Destinations & Landscapes
            </h1>
            <p className="text-sm text-stone-500 mt-2">
              Every corner of Wayanad offers unique microclimates — from the misty waterfalls of Meppadi to the historic caves of Sulthan Bathery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((dest) => (
              <div
                key={dest.slug}
                className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-lg transition-all flex flex-col"
              >
                <div className="relative h-56 bg-stone-100">
                  <Image
                    src={dest.image}
                    alt={dest.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-[#1A2218] text-white text-xs font-bold px-2.5 py-1 rounded">
                    {dest.resortCount} Stays
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-stone-900 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-emerald-700" /> {dest.name}
                    </h2>
                    <p className="text-xs font-semibold text-emerald-800 mt-1">
                      {dest.tagline}
                    </p>
                    <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                      {dest.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-stone-100">
                    <Link
                      href={`/resorts?destination=${encodeURIComponent(dest.name)}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2E4F28] hover:text-[#1e341a]"
                    >
                      Browse Resorts in {dest.name} <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
