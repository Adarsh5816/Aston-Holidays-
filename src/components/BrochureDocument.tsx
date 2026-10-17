"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Phone, Globe, Mail, Download, Share2, MessageCircle, ArrowLeft, Printer, Check } from "lucide-react";
import Link from "next/link";
import QRCode from "qrcode";
import { Resort } from "@/lib/types";

interface BrochureDocumentProps {
  resort: Resort;
  autoPrint?: boolean;
}

export default function BrochureDocument({ resort, autoPrint = false }: BrochureDocumentProps) {
  const publicTitle = `${resort.code} • ${resort.bedrooms}BHK ${resort.accommodationType}`;
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const brochureRef = useRef<HTMLDivElement>(null);

  // Generate QR Code for WhatsApp / Resort link
  useEffect(() => {
    const currentUrl = typeof window !== "undefined" ? window.location.href.split("?")[0] : "";
    const waUrl = `https://wa.me/919744900414?text=Hi%20Aston%20Holidays,%20inquiring%20about%20${encodeURIComponent(publicTitle)}`;
    QRCode.toDataURL(waUrl, { width: 120, margin: 1 })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error(err));

    if (autoPrint) {
      setTimeout(() => {
        window.print();
      }, 800);
    }
  }, [resort, autoPrint, publicTitle]);

  // Use only actual resort photos; do not inject default images
  const photos = resort.photos || [];

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const whatsAppBookingUrl = `https://wa.me/919744900414?text=Hi%20Aston%20Holidays,%20I%20am%20viewing%20the%20brochure%20for%20*${encodeURIComponent(publicTitle)}*%20in%20${encodeURIComponent(resort.destination)}.%20Please%20share%20availability%20and%20rates!`;

  return (
    <div className="min-h-screen bg-stone-100 py-6 print:p-0 print:bg-white text-stone-900 font-sans">
      {/* Top Floating Control Bar (Hidden in Print) */}
      <header className="no-print max-w-4xl mx-auto mb-6 px-4 flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl shadow-sm border border-stone-200">
        <div className="flex items-center gap-3">
          <Link
            href="/resorts"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 px-3 py-1.5 rounded-lg hover:bg-stone-100 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Resorts
          </Link>
          <span className="text-xs bg-stone-900 text-white font-mono px-2.5 py-1 rounded-md font-semibold">
            {resort.code}
          </span>
          <span className="text-sm font-semibold text-stone-800 hidden sm:inline">
            {publicTitle} ({resort.destination})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 px-3 py-2 rounded-lg transition"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            {copiedLink ? "Link Copied!" : "Share Link"}
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 px-3.5 py-2 rounded-lg transition shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" /> Print / Save PDF
          </button>

          <a
            href={whatsAppBookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 rounded-lg transition shadow-sm"
          >
            <MessageCircle className="w-3.5 h-3.5" /> Book on WhatsApp
          </a>
        </div>
      </header>

      {/* THE 12-PAGE BROCHURE DOCUMENT CONTAINER */}
      <main ref={brochureRef} className="max-w-[794px] mx-auto print:max-w-none print:w-full space-y-8 print:space-y-0">

        {/* ================= PAGE 1: COVER PAGE ================= */}
        <div className="brochure-page relative bg-white shadow-xl print:shadow-none w-[794px] h-[1123px] print:w-full print:h-[100vh] mx-auto overflow-hidden flex flex-col justify-between p-12 print:p-10 page-break">
          {/* Authentic Historic Footprint / Edakkal Petroglyphs Watermark Background */}
          <div
            className="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-[0.22] pointer-events-none"
            style={{ backgroundImage: `url('/brand/edakkal-footprint.jpg')` }}
          />

          {/* Top Bar: Logo & Website */}
          <div className="relative z-10 flex items-start justify-between">
            <div className="relative w-36 h-14">
              <Image
                src="/brand/logo.png"
                alt="Aston Holidays"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
            <div className="text-stone-700 font-medium text-sm tracking-wide pt-2">
              astonholidays.com
            </div>
          </div>

          {/* Bottom Left Title Block */}
          <div className="relative z-10 pb-16 max-w-lg">
            <div className="inline-block bg-[#262B2F] text-white font-bold text-lg px-4 py-1.5 rounded-lg tracking-wider mb-4 shadow-sm">
              {resort.code}
            </div>
            <h1 className="text-4xl font-extrabold text-[#262B2F] tracking-tight leading-tight">
              {publicTitle}
            </h1>
            <p className="text-xl font-medium text-[#4A5568] mt-1.5">
              {resort.destination}
            </p>
            <div className="w-full h-[1.5px] bg-stone-400 mt-6" />
          </div>
        </div>

        {/* ================= PHOTO PAGES (PAGES 2+) ================= */}
        {photos.length > 0 ? (
          Array.from({ length: Math.ceil(photos.length / 3) }).map((_, pageIdx) => {
            const photoStart = pageIdx * 3;
            const pTop = photos[photoStart];
            const pBottomLeft = photos[photoStart + 1] || photos[photoStart];
            const pBottomRight = photos[photoStart + 2] || photos[photoStart + 1] || photos[photoStart];

            return (
              <div
                key={`page-${pageIdx + 2}`}
                className="brochure-page relative bg-white shadow-xl print:shadow-none w-[794px] h-[1123px] print:w-full print:h-[100vh] mx-auto overflow-hidden flex flex-col justify-between page-break"
              >
                {/* Left Subtle Sidebar Accent */}
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-[#EBECEE] print:bg-[#EBECEE]" />

                {/* Main Content Area */}
                <div className="pl-14 pr-8 pt-8 pb-6 flex-1 flex flex-col justify-between">
                  {/* Header: Logo Top Right */}
                  <div className="flex justify-end mb-4">
                    <div className="relative w-28 h-10">
                      <Image
                        src="/brand/logo.png"
                        alt="Aston Holidays"
                        fill
                        className="object-contain object-right"
                      />
                    </div>
                  </div>

                  {/* Photo Grid Layout */}
                  <div className="flex-1 flex flex-col gap-4 mb-4">
                    {/* Top Large Hero Image */}
                    <div className="relative w-full h-[520px] rounded-sm overflow-hidden bg-stone-100">
                      <Image
                        src={pTop}
                        alt={`${resort.name} view`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 794px) 100vw, 794px"
                      />
                    </div>

                    {/* Bottom Dual Images */}
                    <div className="grid grid-cols-2 gap-4 h-[380px]">
                      <div className="relative w-full h-full rounded-sm overflow-hidden bg-stone-100">
                        <Image
                          src={pBottomLeft}
                          alt={`${resort.name} detail`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 400px) 100vw, 400px"
                        />
                      </div>
                      <div className="relative w-full h-full rounded-sm overflow-hidden bg-stone-100">
                        <Image
                          src={pBottomRight}
                          alt={`${resort.name} interior`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 400px) 100vw, 400px"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Footer Bar */}
                  <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-xs text-stone-700 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>+91 9744 900 414</span>
                    </div>
                    <div className="tracking-wide">
                      astonholidays.com
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          /* When photos are not yet uploaded, show elegant portfolio page */
          <div className="brochure-page relative bg-white shadow-xl print:shadow-none w-[794px] h-[1123px] print:w-full print:h-[100vh] mx-auto overflow-hidden flex flex-col justify-between p-12 print:p-10 page-break">
            <div className="flex items-start justify-between">
              <div className="relative w-36 h-14">
                <Image src="/brand/logo.png" alt="Aston Holidays" fill className="object-contain object-left" priority />
              </div>
              <div className="text-right">
                <span className="font-mono text-xs bg-stone-900 text-white px-2.5 py-1 rounded font-bold">{resort.code}</span>
                <p className="text-xs text-stone-500 mt-1">Verified Portfolio</p>
              </div>
            </div>

            <div className="my-auto py-10 text-center max-w-xl mx-auto">
              <div className="w-20 h-20 rounded-3xl bg-stone-50 border border-stone-200 flex items-center justify-center mx-auto mb-6 shadow-sm">
                <span className="text-3xl">🌿</span>
              </div>
              <h2 className="text-2xl font-black text-stone-900 tracking-tight">{resort.name}</h2>
              <p className="text-sm font-semibold text-emerald-800 mt-1">{resort.destination}, Wayanad</p>
              <p className="text-xs text-stone-600 mt-4 leading-relaxed font-serif text-justify bg-stone-50 p-6 rounded-2xl border border-stone-200/80">
                {resort.overview || "An exclusive luxury retreat in Wayanad offering pristine nature views, authentic hospitality, and complete privacy."}
              </p>
              <div className="mt-6 inline-block bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold px-4 py-2 rounded-xl">
                📷 High-Definition Photography will appear here upon photo shoot upload
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600 font-medium">
              <div>astonholidays.com</div>
              <div>Direct Desk: +91 9744 900 414</div>
            </div>
          </div>
        )}

        {/* ================= PAGE 11: AMENITIES & ATTRACTIONS ================= */}
        <div className="brochure-page relative bg-white shadow-xl print:shadow-none w-[794px] h-[1123px] print:w-full print:h-[100vh] mx-auto overflow-hidden flex flex-row page-break">
          {/* Left Content Column */}
          <div className="flex-1 p-14 flex flex-col justify-between">
            <div>
              {/* Section 1: Amenities */}
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-[#355E3B] tracking-tight mb-5">
                  Amenities
                </h2>
                <ul className="space-y-2 text-stone-800 font-medium text-[15px]">
                  {resort.amenities.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#355E3B]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Section 2: Specialities */}
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-[#355E3B] tracking-tight mb-5">
                  Specialities
                </h2>
                <ul className="space-y-2 text-stone-800 font-medium text-[15px]">
                  {resort.specialities.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#355E3B]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Section 3: Near by Attractions */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-[#355E3B] tracking-tight mb-5">
                  Near by Attractions
                </h2>
                <div className="grid grid-cols-1 gap-2 text-stone-800 font-medium text-[14px]">
                  {resort.nearbyAttractions.map((att, idx) => (
                    <div key={idx} className="flex justify-between max-w-sm">
                      <span>{att.name}</span>
                      <span className="text-stone-500 font-normal">({att.distance})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 4: Notes */}
            <div className="pt-6 border-t border-stone-200">
              <h3 className="text-base font-bold text-stone-900 mb-2">Notes</h3>
              <div className="space-y-1 text-sm font-medium text-stone-700">
                <p>Check in time : {resort.checkInTime || "01:00 PM"}</p>
                <p>Check out time : {resort.checkOutTime || "11:00 AM"}</p>
              </div>
            </div>
          </div>

          {/* Right Neutral Architectural Bar */}
          <div className="w-28 bg-[#EBECEE] print:bg-[#EBECEE]" />
        </div>

        {/* ================= PAGE 12: BACK COVER ================= */}
        <div className="brochure-page relative bg-white shadow-xl print:shadow-none w-[794px] h-[1123px] print:w-full print:h-[100vh] mx-auto overflow-hidden flex flex-col justify-between page-break">
          {/* Top 78%: Breathtaking Wayanad Landscape Image */}
          <div className="relative w-full h-[880px] bg-stone-200">
            <Image
              src="/brand/wayanad-backcover.jpg"
              alt="Wayanad Panoramic Hills and Lake"
              fill
              className="object-cover object-center"
              priority
            />
          </div>

          {/* Bottom White Footer Strip */}
          <div className="h-[243px] px-12 py-8 bg-white flex items-center justify-between">
            {/* Logo */}
            <div className="relative w-40 h-16">
              <Image
                src="/brand/logo.png"
                alt="Aston Holidays"
                fill
                className="object-contain object-left"
              />
            </div>

            {/* Central Contact Info */}
            <div className="text-center space-y-1 text-stone-800">
              <p className="text-xl font-bold tracking-tight text-stone-900">
                +91 9744 900 414
              </p>
              <p className="text-sm font-medium text-stone-600">
                astonholidays.com
              </p>
              <p className="text-sm font-medium text-stone-600">
                info@astonholidays.com
              </p>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center">
              {qrDataUrl ? (
                <div className="border border-stone-200 p-1.5 rounded-lg bg-white shadow-sm">
                  <Image
                    src={qrDataUrl}
                    alt="Scan to Book"
                    width={88}
                    height={88}
                    className="block"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 bg-stone-100 rounded-lg animate-pulse" />
              )}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
