import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Users, Bed, Sparkles, FileText, MessageCircle, Camera } from "lucide-react";
import { Resort } from "@/lib/types";

interface ResortCardProps {
  resort: Resort;
}

export default function ResortCard({ resort }: ResortCardProps) {
  const whatsAppInquiryUrl = `https://wa.me/919744900414?text=Hi%20Aston%20Holidays,%20I%20am%20interested%20in%20reserving%20*${resort.code}%20-%20${encodeURIComponent(resort.name)}*%20in%20${encodeURIComponent(resort.destination)}.%20Please%20share%20availability!`;
  const hasCoverImage = Boolean(resort.coverImage && resort.coverImage.trim().length > 0);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-stone-200/90 hover:border-emerald-700/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* Cover Image Container */}
      <div className="relative w-full h-64 overflow-hidden bg-stone-100">
        {hasCoverImage ? (
          <Image
            src={resort.coverImage}
            alt={resort.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#121A11] via-[#1B271A] to-[#0E150D] relative">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-2">
              <Camera className="w-6 h-6 text-emerald-400/80" />
            </div>
            <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-300">
              Photos Updating Soon
            </span>
            <span className="text-[10px] text-stone-400 mt-0.5">
              Verified Aston Holidays Property
            </span>
          </div>
        )}

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
          <span className="bg-[#1A2218] text-white text-xs font-mono font-bold px-2.5 py-1 rounded-md shadow-md">
            {resort.code}
          </span>
          <span className="bg-white/90 backdrop-blur-sm text-stone-800 text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-sm">
            {resort.category}
          </span>
        </div>

        {resort.featured && (
          <div className="absolute top-3 right-3 z-10">
            <span className="bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Featured
            </span>
          </div>
        )}

        {/* Subtle Bottom Gradient */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        <div className="absolute bottom-2.5 left-3 text-white text-xs font-medium flex items-center gap-1 z-10">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {resort.destination}, Wayanad
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-stone-900 group-hover:text-emerald-800 transition line-clamp-1">
            {resort.name}
          </h3>
          <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
            {resort.overview}
          </p>

          {/* Quick Specs */}
          <div className="flex items-center gap-4 text-xs font-medium text-stone-600 mt-3 pt-3 border-t border-stone-100">
            <span className="flex items-center gap-1">
              <Bed className="w-3.5 h-3.5 text-stone-400" /> {resort.bedrooms} Bedrooms
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-stone-400" /> Up to {resort.maxGuests} Guests
            </span>
          </div>

          {/* Amenities Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {resort.amenities.slice(0, 3).map((amenity, idx) => (
              <span
                key={idx}
                className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-medium"
              >
                {amenity}
              </span>
            ))}
            {resort.amenities.length > 3 && (
              <span className="text-[10px] bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded">
                +{resort.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Pricing and Action Buttons */}
        <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-stone-400 block font-medium uppercase tracking-wider">
              Starting From
            </span>
            <span className="text-base font-extrabold text-[#2E4F28]">
              ₹{resort.pricePerNight.toLocaleString("en-IN")}
              <span className="text-xs font-normal text-stone-500"> /night</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/brochure/${resort.code}`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-3 py-2 rounded-xl transition"
              title="View full 12-page PDF brochure"
            >
              <FileText className="w-3.5 h-3.5 text-stone-600" /> Brochure
            </Link>

            <a
              href={whatsAppInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-2 rounded-xl transition shadow-sm"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" /> Book
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
