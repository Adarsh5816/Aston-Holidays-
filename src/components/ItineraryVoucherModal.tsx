"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import {
  X,
  Printer,
  MessageCircle,
  Share2,
  Calendar,
  MapPin,
  Car,
  BedDouble,
  Receipt,
  FileText,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
  Sparkles,
  Users,
  Compass,
  Edit3,
  Download,
  Loader2,
  CreditCard,
  Check
} from "lucide-react";
import { PackageItineraryBooking, BankDetails } from "@/lib/types";
import { printElementIsolated, downloadElementAsPdf } from "@/lib/printUtils";

interface ItineraryVoucherModalProps {
  booking: PackageItineraryBooking;
  onClose: () => void;
  onUpdateBooking?: (updated: PackageItineraryBooking) => void;
}

const defaultBankDetails: BankDetails = {
  accountName: "Aston Holidays",
  bankName: "State Bank of India",
  accountNumber: "40921008745",
  ifscCode: "SBIN0008451",
  upiId: "astonholidays@sbi",
  qrCodeCustomUrl: ""
};

export default function ItineraryVoucherModal({
  booking,
  onClose,
  onUpdateBooking
}: ItineraryVoucherModalProps) {
  const [activeTab, setActiveTab] = useState<"itinerary" | "rooms" | "vehicle" | "invoice" | "notepad">("itinerary");
  const [selectedRoomIdx, setSelectedRoomIdx] = useState(0);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editableNotes, setEditableNotes] = useState(booking.notepadNotes || "");
  const [copied, setCopied] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  // Bank & UPI payment details state (persisted per booking and in local storage)
  const [bankDetails, setBankDetails] = useState<BankDetails>(() => {
    if (booking.bankDetails && booking.bankDetails.accountName) return booking.bankDetails;
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("aston_default_bank_details");
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return defaultBankDetails;
  });

  const [isEditingBankDetails, setIsEditingBankDetails] = useState(false);
  const [bankForm, setBankForm] = useState<BankDetails>(bankDetails);

  useEffect(() => {
    if (booking.bankDetails && booking.bankDetails.accountName) {
      setBankDetails(booking.bankDetails);
      setBankForm(booking.bankDetails);
    }
  }, [booking.bankDetails]);

  const balanceAmount = Math.max(0, (booking.grossTotal - (booking.discount || 0)) - (booking.advancePaid || 0));

  useEffect(() => {
    // Generate UPI QR code for balance due
    const upiString = `upi://pay?pa=${bankDetails.upiId || "astonholidays@sbi"}&pn=${encodeURIComponent(bankDetails.accountName || "Aston Holidays")}&am=${balanceAmount}&cu=INR&tn=Booking%20${booking.bookingCode}`;
    QRCode.toDataURL(upiString, { width: 140, margin: 1 })
      .then(url => setQrCodeUrl(url))
      .catch(err => console.error(err));
  }, [booking.bookingCode, balanceAmount, bankDetails]);

  const handleSaveBankDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setBankDetails(bankForm);
    setIsEditingBankDetails(false);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("aston_default_bank_details", JSON.stringify(bankForm));
      } catch {}
    }
    const updated = { ...booking, bankDetails: bankForm };
    if (onUpdateBooking) {
      onUpdateBooking(updated);
    }
    try {
      await fetch("/api/v1/itineraries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      });
    } catch (e) {
      console.warn("Could not sync updated bank details to server", e);
    }
  };

  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    const docTitle =
      activeTab === "invoice" ? `Booking-Invoice-${booking.bookingCode}` :
      activeTab === "rooms" ? `Room-Voucher-${booking.bookingCode}` :
      activeTab === "vehicle" ? `Vehicle-Duty-Slip-${booking.bookingCode}` :
      activeTab === "notepad" ? `Booking-Notes-${booking.bookingCode}` :
      `Itinerary-Voucher-${booking.bookingCode}`;

    try {
      await downloadElementAsPdf("printable-voucher-sheet", `${docTitle}.pdf`);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handlePrint = () => {
    const docTitle =
      activeTab === "invoice" ? `Booking Invoice ${booking.bookingCode}` :
      activeTab === "rooms" ? `Room Stay Voucher ${booking.bookingCode}` :
      activeTab === "vehicle" ? `Vehicle Duty Slip ${booking.bookingCode}` :
      activeTab === "notepad" ? `Booking Notes ${booking.bookingCode}` :
      `Itinerary & Voucher ${booking.bookingCode}`;

    printElementIsolated("printable-voucher-sheet", `${docTitle} - Aston Holidays`);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
        e.preventDefault();
        handlePrint();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTab, selectedRoomIdx, qrCodeUrl]);

  const handleSaveNotes = async () => {
    const updated = { ...booking, notepadNotes: editableNotes };
    try {
      const res = await fetch("/api/v1/itineraries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        const saved = await res.json();
        if (onUpdateBooking) onUpdateBooking(saved);
        setIsEditingNotes(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // WhatsApp formatted messages
  const sendItineraryWhatsApp = () => {
    let msg = `🌟 *ASTON HOLIDAYS - TOUR ITINERARY & VOUCHER* 🌟\n\n`;
    msg += `Dear *${booking.customerName}*,\n`;
    msg += `Here is your confirmed itinerary & stay package for Wayanad!\n\n`;
    msg += `🔖 *Booking Code:* ${booking.bookingCode}\n`;
    msg += `📦 *Package:* ${booking.packageTitle}\n`;
    msg += `⏳ *Duration:* ${booking.duration} (${booking.startDate} to ${booking.endDate})\n`;
    msg += `👥 *Guests:* ${booking.totalGuests.adults} Adults, ${booking.totalGuests.children} Children\n\n`;

    msg += `🗓️ *DAY-BY-DAY ITINERARY:*\n`;
    booking.itineraryDays.forEach(day => {
      msg += `*Day ${day.dayNumber}: ${day.title}*\n`;
      msg += `• Activities: ${day.activities}\n`;
      if (day.sightseeing.length > 0) {
        msg += `• Sightseeing: ${day.sightseeing.join(", ")}\n`;
      }
      const meals = [
        day.mealsIncluded.breakfast && "Breakfast",
        day.mealsIncluded.lunch && "Lunch",
        day.mealsIncluded.dinner && "Dinner"
      ].filter(Boolean).join(", ");
      if (meals) msg += `• Meals Included: ${meals}\n`;
      msg += `\n`;
    });

    if (booking.rooms.length > 0) {
      msg += `🏨 *ACCOMMODATION DETAILS:*\n`;
      booking.rooms.forEach(r => {
        msg += `• [${r.resortCode}] ${r.roomType || r.resortName} in ${r.destination}\n`;
        msg += `  ${r.roomsCount} Room(s) | Meal Plan: ${r.mealPlan || "EP"}\n`;
        msg += `  Check-In: ${r.checkIn} | Check-Out: ${r.checkOut}\n`;
      });
      msg += `\n`;
    }

    if (booking.vehicle && booking.vehicle.enabled) {
      const v = booking.vehicle;
      msg += `🚗 *CAB / TRANSPORT:*\n`;
      msg += `• ${v.vehicleType} (${v.pickupLocation} to ${v.dropLocation})\n`;
      if (v.pricingModel === "per_km") {
        msg += `• Running KM: ${v.totalKmCovered || 0} KM @ ₹${v.ratePerKm || 0}/KM\n`;
      } else if (v.pricingModel === "package_km_extra") {
        msg += `• Package Base KM: ${v.baseKmIncluded || 0} KM | Extra KM Covered: ${v.extraKmCovered || 0} KM (@ ₹${v.extraKmRate || 0}/KM)\n`;
      }
      if (v.driverName) msg += `• Driver: ${v.driverName} (${v.driverPhone || "N/A"})\n`;
      if (v.vehicleNumber) msg += `• Vehicle No: ${v.vehicleNumber}\n`;
      msg += `\n`;
    }

    msg += `💰 *FINANCIAL SUMMARY:*\n`;
    msg += `• Total Package: ₹${booking.netPayable.toLocaleString("en-IN")}\n`;
    msg += `• Advance Paid: ₹${booking.advancePaid.toLocaleString("en-IN")}\n`;
    msg += `• Balance Due: ₹${booking.balanceDue.toLocaleString("en-IN")}\n\n`;

    msg += `📞 Need any assistance? Call our desk: +91 97449 00414\n`;
    msg += `🌿 *Aston Holidays - Curated Wayanad Escapes*`;

    const cleanPhone = booking.customerPhone.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const sendRoomVoucherWhatsApp = (room: typeof booking.rooms[0]) => {
    let msg = `🏨 *ASTON HOLIDAYS - ROOM STAY VOUCHER* 🏨\n\n`;
    msg += `Dear *${booking.customerName}*,\n`;
    msg += `Your room stay reservation is confirmed!\n\n`;
    msg += `📄 *Voucher Ref:* ${booking.bookingCode}-ROOM\n`;
    msg += `🏡 *Property:* [${room.resortCode}] ${room.roomType || room.resortName}\n`;
    msg += `📍 *Location:* ${room.destination}, Wayanad\n`;
    msg += `📅 *Check-In:* ${room.checkIn} (from 01:00 PM)\n`;
    msg += `📅 *Check-Out:* ${room.checkOut} (by 11:00 AM)\n`;
    msg += `🛏️ *Rooms:* ${room.roomsCount} Room(s) for ${room.nights} Night(s)\n`;
    msg += `🍽️ *Meal Plan:* ${room.mealPlan || "EP (Room Only)"}\n`;
    if (room.specialRequests) {
      msg += `✨ *Special Request:* ${room.specialRequests}\n`;
    }
    msg += `\n📞 Helpline: +91 97449 00414\nAston Holidays`;

    const cleanPhone = booking.customerPhone.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const sendVehicleVoucherWhatsApp = () => {
    if (!booking.vehicle || !booking.vehicle.enabled) return;
    const v = booking.vehicle;
    let msg = `🚗 *ASTON HOLIDAYS - VEHICLE DUTY SLIP* 🚗\n\n`;
    msg += `*Booking Ref:* ${booking.bookingCode}\n`;
    msg += `*Guest:* ${booking.customerName} (${booking.customerPhone})\n`;
    msg += `*Vehicle:* ${v.vehicleType} (${v.vehicleNumber || "Assigned on reporting"})\n`;
    msg += `*Driver:* ${v.driverName || "Chauffeur"} (${v.driverPhone || "N/A"})\n`;
    msg += `*Reporting Date:* ${v.pickupDate}\n`;
    msg += `*Pickup Location:* ${v.pickupLocation}\n`;
    msg += `*Drop Location:* ${v.dropLocation}\n`;
    msg += `*Total Duration:* ${v.totalDays} Days\n`;
    if (v.pricingModel === "per_km") {
      msg += `*Running KM Rate:* ₹${v.ratePerKm || 0}/KM (Total KM Covered: ${v.totalKmCovered || 0} KM)\n`;
    } else if (v.pricingModel === "package_km_extra") {
      msg += `*Base KM Included:* ${v.baseKmIncluded || 0} KM\n`;
      msg += `*Total KM Covered:* ${v.totalKmCovered || 0} KM\n`;
      msg += `*Extra KM Covered:* ${v.extraKmCovered || 0} KM (@ ₹${v.extraKmRate || 0}/KM = ₹${(v.extraKmAmount || 0).toLocaleString("en-IN")})\n`;
    }
    if (v.startKmReading || v.endKmReading) {
      msg += `*Odometer:* Start: ${v.startKmReading || "---"} KM | End: ${v.endKmReading || "---"} KM\n`;
    }
    if (v.dutyNotes) msg += `*Duty Notes:* ${v.dutyNotes}\n`;
    msg += `\nAston Holidays Logistics Desk: +91 97449 00414`;

    const cleanPhone = (v.driverPhone || booking.customerPhone).replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="voucher-modal-overlay fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:static print:inset-auto print:z-auto print:bg-white print:p-0 print:m-0 print:overflow-visible print:block print:w-full">
      <div className="voucher-modal-card bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-stone-200 overflow-hidden my-6 flex flex-col max-h-[92vh] print:max-w-none print:w-full print:shadow-none print:border-none print:rounded-none print:my-0 print:max-h-none print:overflow-visible print:block print:p-0">
        
        {/* Top Control Bar (Hidden on print) */}
        <div className="no-print print:hidden bg-[#1A2518] text-white px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="font-mono text-xs font-black bg-emerald-700/80 text-emerald-100 px-2.5 py-1 rounded-lg shrink-0">
                {booking.bookingCode}
              </span>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-bold text-white leading-tight truncate">
                  {booking.packageTitle}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-stone-300 truncate">
                  {booking.customerName} • {booking.duration}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="sm:hidden text-stone-300 hover:text-white p-1 rounded-lg transition shrink-0"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-2 flex-1 sm:flex-initial">
              <button
                onClick={sendItineraryWhatsApp}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 rounded-xl transition shadow active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Guest</span>
              </button>
              <button
                onClick={handleDownloadPdf}
                disabled={isDownloadingPdf}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 text-xs font-bold text-stone-900 bg-white hover:bg-stone-100 disabled:opacity-75 px-3.5 py-2 rounded-xl transition shadow active:scale-95"
              >
                {isDownloadingPdf ? (
                  <>
                    <Loader2 className="w-4 h-4 text-emerald-800 animate-spin" />
                    <span>Saving PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-emerald-800" />
                    <span>Download PDF</span>
                  </>
                )}
              </button>
              <button
                onClick={handlePrint}
                className="hidden sm:inline-flex items-center justify-center gap-1.5 text-xs font-bold text-stone-200 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl transition active:scale-95"
                title="Print Dialog"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="hidden sm:inline-flex text-stone-300 hover:text-white p-1.5 rounded-lg transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation (Hidden on print) */}
        <div className="no-print print:hidden bg-stone-50 border-b border-stone-200 px-4 sm:px-6 py-2.5 flex items-center gap-2 text-xs font-bold overflow-x-auto whitespace-nowrap">
          <button
            onClick={() => setActiveTab("itinerary")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              activeTab === "itinerary"
                ? "bg-[#2E4F28] text-white shadow-sm"
                : "text-stone-600 hover:bg-stone-200"
            }`}
          >
            <Compass className="w-3.5 h-3.5" /> Tour & Day-by-Day Itinerary
          </button>
          <button
            onClick={() => setActiveTab("rooms")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              activeTab === "rooms"
                ? "bg-[#2E4F28] text-white shadow-sm"
                : "text-stone-600 hover:bg-stone-200"
            }`}
          >
            <BedDouble className="w-3.5 h-3.5" /> Room Stay Vouchers ({booking.rooms.length})
          </button>
          {booking.vehicle && booking.vehicle.enabled && (
            <button
              onClick={() => setActiveTab("vehicle")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                activeTab === "vehicle"
                  ? "bg-[#2E4F28] text-white shadow-sm"
                  : "text-stone-600 hover:bg-stone-200"
              }`}
            >
              <Car className="w-3.5 h-3.5" /> Vehicle Duty Slip
            </button>
          )}
          <button
            onClick={() => setActiveTab("invoice")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              activeTab === "invoice"
                ? "bg-[#2E4F28] text-white shadow-sm"
                : "text-stone-600 hover:bg-stone-200"
            }`}
          >
            <Receipt className="w-3.5 h-3.5" /> Itemized Bill & Invoice
          </button>
          <button
            onClick={() => setActiveTab("notepad")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              activeTab === "notepad"
                ? "bg-[#2E4F28] text-white shadow-sm"
                : "text-stone-600 hover:bg-stone-200"
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" /> Interactive Notepad & Notes
          </button>
        </div>

        {/* MODAL BODY (PRINTABLE) */}
        <div id="printable-voucher-sheet" className="flex-1 overflow-y-auto p-6 sm:p-8 bg-white print:p-0 print:overflow-visible print:block print:w-full">

          {/* ================= 1. TOUR & ITINERARY VOUCHER ================= */}
          {activeTab === "itinerary" && (
            <div className="space-y-6">
              {/* Header Strip */}
              <div className="flex items-start justify-between pb-6 border-b-2 border-stone-900">
                <div>
                  <div className="relative w-40 h-14 mb-2">
                    <Image
                      src="/brand/logo.png"
                      alt="Aston Holidays"
                      fill
                      className="object-contain object-left"
                    />
                  </div>
                  <p className="text-xs font-bold text-stone-900 tracking-wide uppercase">
                    Aston Holidays Destination Management
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Kolagappara, Beenachi, Sulthan Bathery, Wayanad - 673592, Kerala
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Desk: +91 97449 00414 • info@astonholidays.com
                  </p>
                </div>

                <div className="text-right">
                  <span className="inline-block bg-[#2E4F28] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded">
                    Tour & Stay Voucher
                  </span>
                  <h2 className="text-xl font-black font-mono text-stone-900 mt-2">
                    {booking.bookingCode}
                  </h2>
                  <p className="text-xs text-stone-600 mt-1">
                    Dates: <span className="font-semibold">{booking.startDate}</span> to <span className="font-semibold">{booking.endDate}</span>
                  </p>
                  <p className="text-xs text-stone-600">
                    Duration: <span className="font-semibold">{booking.duration}</span>
                  </p>
                </div>
              </div>

              {/* Guest & Package Summary Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs">
                <div>
                  <p className="text-[10px] uppercase font-bold text-stone-400">Guest Information</p>
                  <p className="text-sm font-bold text-stone-900 mt-0.5">{booking.customerName}</p>
                  <p className="text-stone-600 mt-0.5">Phone: {booking.customerPhone}</p>
                  {booking.customerEmail && <p className="text-stone-600">Email: {booking.customerEmail}</p>}
                  {booking.customerAddress && <p className="text-stone-600">Address: {booking.customerAddress}</p>}
                  <p className="text-emerald-800 font-semibold mt-1">
                    Total Guests: {booking.totalGuests.adults} Adults, {booking.totalGuests.children} Children
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase font-bold text-stone-400">Package Summary</p>
                  <p className="text-sm font-bold text-[#2E4F28] mt-0.5">{booking.packageTitle}</p>
                  <p className="text-stone-600 mt-0.5">Category: {booking.category}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Payment: {booking.paymentStatus}
                    </span>
                    <span className="text-stone-500 text-[11px]">
                      Advance Paid: ₹{booking.advancePaid.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Day-by-Day Schedule */}
              <div>
                <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-700" /> Day-by-Day Itinerary Schedule
                </h4>

                <div className="space-y-4">
                  {booking.itineraryDays.map((day) => (
                    <div
                      key={day.dayNumber}
                      className="border border-stone-200 rounded-2xl p-4 bg-white relative pl-5 border-l-4 border-l-[#2E4F28]"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                        <h5 className="text-xs sm:text-sm font-bold text-stone-900">
                          Day {day.dayNumber}: {day.title}
                        </h5>
                        {day.stayResortCode && (
                          <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200 font-bold w-fit">
                            Stay: {day.stayResortCode} ({day.stayDestination})
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-stone-600 leading-relaxed font-serif">
                        {day.activities}
                      </p>

                      {day.sightseeing.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5 items-center">
                          <span className="text-[10px] font-bold uppercase text-stone-400 mr-1">Sightseeing:</span>
                          {day.sightseeing.map((sight, sIdx) => (
                            <span
                              key={sIdx}
                              className="text-[11px] bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded-full font-medium"
                            >
                              📍 {sight}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Meals */}
                      <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center gap-3 text-[11px] text-stone-500">
                        <span className="font-semibold text-stone-700">Meals Included:</span>
                        <span className={day.mealsIncluded.breakfast ? "text-emerald-700 font-bold" : "text-stone-300"}>
                          ✓ Breakfast
                        </span>
                        <span className={day.mealsIncluded.lunch ? "text-emerald-700 font-bold" : "text-stone-300"}>
                          ✓ Lunch
                        </span>
                        <span className={day.mealsIncluded.dinner ? "text-emerald-700 font-bold" : "text-stone-300"}>
                          ✓ Dinner
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Other Expenses & Special Perks Included */}
              {booking.otherExpenses.length > 0 && (
                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200">
                  <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-800" />
                    Special Experiences & Inclusions
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {booking.otherExpenses.map((exp) => (
                      <div key={exp.id} className="bg-white p-2.5 rounded-xl border border-emerald-100">
                        <p className="font-bold text-stone-800">{exp.title}</p>
                        <p className="text-[11px] text-emerald-800">{exp.category}</p>
                        {exp.notepadContent && (
                          <p className="text-[10px] text-stone-500 mt-1 italic">
                            Note: {exp.notepadContent}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Wayanad Travel Tips & Guidelines */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs space-y-1.5 text-stone-600">
                <p className="font-bold text-stone-900">Important Wayanad Travel Notes:</p>
                <p>• Standard resort check-in is 01:00 PM and check-out is 11:00 AM.</p>
                <p>• Government photo ID is required for all adult guests at the time of check-in.</p>
                <p>• Forest permits and trekking timings are subject to Kerala Forest Department weather regulations.</p>
              </div>
            </div>
          )}

          {/* ================= 2. ROOM STAY VOUCHERS ================= */}
          {activeTab === "rooms" && (
            <div className="space-y-6">
              {/* Room selector tabs if multiple rooms */}
              {booking.rooms.length > 1 && (
                <div className="no-print print:hidden flex gap-2 pb-3 border-b border-stone-200">
                  {booking.rooms.map((r, idx) => (
                    <button
                      key={r.id}
                      onClick={() => setSelectedRoomIdx(idx)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl transition ${
                        selectedRoomIdx === idx
                          ? "bg-[#2E4F28] text-white"
                          : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                      }`}
                    >
                      Room {idx + 1}: [{r.resortCode}]
                    </button>
                  ))}
                </div>
              )}

              {booking.rooms[selectedRoomIdx] ? (
                (() => {
                  const r = booking.rooms[selectedRoomIdx];
                  return (
                    <div className="border border-stone-200 rounded-3xl p-6 sm:p-8 bg-stone-50/50">
                      <div className="flex items-start justify-between pb-6 border-b border-stone-200">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
                            Official Room Stay Voucher
                          </span>
                          <h3 className="text-xl font-black text-stone-900 mt-2">
                            [{r.resortCode}] {r.roomType || r.resortName}
                          </h3>
                          <p className="text-xs text-stone-500 flex items-center gap-1 mt-1 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                            {r.destination}, Wayanad
                          </p>
                        </div>

                        <div className="text-right">
                          <button
                            onClick={() => sendRoomVoucherWhatsApp(r)}
                            className="no-print print:hidden inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-xl transition shadow"
                          >
                            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Room Voucher
                          </button>
                          <p className="text-xs text-stone-400 font-mono mt-2">
                            Ref: {booking.bookingCode}-R{selectedRoomIdx + 1}
                          </p>
                        </div>
                      </div>

                      {/* Room Breakdown Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 text-xs">
                        <div className="p-3 bg-white rounded-xl border border-stone-200">
                          <span className="text-stone-400 font-medium block">Check-In</span>
                          <span className="text-sm font-bold text-stone-900 mt-0.5 block">{r.checkIn}</span>
                          <span className="text-[10px] text-stone-500">From 01:00 PM</span>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-stone-200">
                          <span className="text-stone-400 font-medium block">Check-Out</span>
                          <span className="text-sm font-bold text-stone-900 mt-0.5 block">{r.checkOut}</span>
                          <span className="text-[10px] text-stone-500">By 11:00 AM</span>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-stone-200">
                          <span className="text-stone-400 font-medium block">Nights / Rooms</span>
                          <span className="text-sm font-bold text-stone-900 mt-0.5 block">
                            {r.nights} Night(s)
                          </span>
                          <span className="text-[10px] text-stone-500">{r.roomsCount} Room(s)</span>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-stone-200">
                          <span className="text-stone-400 font-medium block">Meal Plan</span>
                          <span className="text-sm font-bold text-emerald-800 mt-0.5 block">
                            {r.mealPlan || "EP (Room Only)"}
                          </span>
                          <span className="text-[10px] text-stone-500">Verified by Aston</span>
                        </div>
                      </div>

                      {/* Guest info & special requests */}
                      <div className="mt-6 p-4 bg-white rounded-2xl border border-stone-200 text-xs space-y-2">
                        <div className="flex justify-between">
                          <span className="text-stone-500">Registered Guest:</span>
                          <span className="font-bold text-stone-900">{booking.customerName} ({booking.customerPhone})</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-500">Occupancy:</span>
                          <span className="font-semibold text-stone-800">
                            {r.adultsCount} Adults, {r.childrenCount} Children
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-500">Rate per Night:</span>
                          <span className="font-semibold text-stone-800">₹{r.ratePerNight.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex justify-between font-bold text-[#2E4F28] pt-2 border-t border-stone-100">
                          <span>Room Total Tariff:</span>
                          <span>₹{r.totalAmount.toLocaleString("en-IN")}</span>
                        </div>
                        {r.specialRequests && (
                          <div className="pt-2 border-t border-stone-100">
                            <span className="text-stone-500 block mb-0.5">Special Requests:</span>
                            <span className="text-stone-800 italic">{r.specialRequests}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="p-8 text-center text-stone-400 text-xs">No rooms configured for this booking.</div>
              )}
            </div>
          )}

          {/* ================= 3. VEHICLE DUTY SLIP ================= */}
          {activeTab === "vehicle" && booking.vehicle && (
            <div className="space-y-6">
              <div className="border border-stone-200 rounded-3xl p-6 sm:p-8 bg-stone-50/50">
                <div className="flex items-start justify-between pb-6 border-b border-stone-200">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
                      Chauffeur & Cab Duty Slip
                    </span>
                    <h3 className="text-xl font-black text-stone-900 mt-2">
                      {booking.vehicle.vehicleType}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1">
                      {booking.vehicle.pickupLocation} ➔ {booking.vehicle.dropLocation}
                    </p>
                  </div>

                  <div className="text-right">
                    <button
                      onClick={sendVehicleVoucherWhatsApp}
                      className="no-print print:hidden inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-xl transition shadow"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Driver & Guest
                    </button>
                    <p className="text-xs text-stone-400 font-mono mt-2">
                      Ref: {booking.bookingCode}-CAB
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 text-xs">
                  <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-2">
                    <p className="text-[10px] uppercase font-bold text-stone-400">Chauffeur Details</p>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Driver Name:</span>
                      <span className="font-bold text-stone-900">{booking.vehicle.driverName || "To be assigned"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Driver Contact:</span>
                      <span className="font-mono font-bold text-emerald-800">{booking.vehicle.driverPhone || "Will be shared prior"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Vehicle Plate No:</span>
                      <span className="font-mono font-bold text-stone-900">{booking.vehicle.vehicleNumber || "Assigned on pickup"}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-2">
                    <p className="text-[10px] uppercase font-bold text-stone-400">Trip & Schedule</p>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Pickup Date:</span>
                      <span className="font-bold text-stone-900">{booking.vehicle.pickupDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Drop Date:</span>
                      <span className="font-bold text-stone-900">{booking.vehicle.dropDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Duty Duration:</span>
                      <span className="font-semibold text-stone-800">{booking.vehicle.totalDays} Days</span>
                    </div>
                    <div className="flex justify-between font-bold text-[#2E4F28] pt-1 border-t border-stone-100">
                      <span>Vehicle Tariff:</span>
                      <span>₹{booking.vehicle.totalAmount.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-2">
                    <p className="text-[10px] uppercase font-bold text-stone-400">KM Running & Tariff Model</p>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-500">Pricing Mode:</span>
                      <span className="font-bold text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {booking.vehicle.pricingModel === "per_km" ? "Running KM Rate" :
                         booking.vehicle.pricingModel === "package_km_extra" ? "Package KM + Extra" : "Daily Rate"}
                      </span>
                    </div>

                    {booking.vehicle.pricingModel === "per_km" && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-stone-500">Total KM Running:</span>
                          <span className="font-bold text-stone-900">{booking.vehicle.totalKmCovered || 0} KM</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-500">Rate per KM:</span>
                          <span className="font-semibold text-emerald-800">₹{booking.vehicle.ratePerKm || 0}/KM</span>
                        </div>
                      </>
                    )}

                    {booking.vehicle.pricingModel === "package_km_extra" && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-stone-500">Base KM in Package:</span>
                          <span className="font-semibold text-stone-800">{booking.vehicle.baseKmIncluded || 0} KM</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-500">Total KM Covered:</span>
                          <span className="font-bold text-stone-900">{booking.vehicle.totalKmCovered || 0} KM</span>
                        </div>
                        <div className="flex justify-between text-amber-800 font-semibold">
                          <span>Extra KM Covered:</span>
                          <span>{booking.vehicle.extraKmCovered || 0} KM (@ ₹{booking.vehicle.extraKmRate || 0}/km)</span>
                        </div>
                        <div className="flex justify-between text-amber-900 font-bold">
                          <span>Extra KM Charge:</span>
                          <span>₹{(booking.vehicle.extraKmAmount || 0).toLocaleString("en-IN")}</span>
                        </div>
                      </>
                    )}

                    {(booking.vehicle.startKmReading || booking.vehicle.endKmReading) && (
                      <div className="flex justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-100">
                        <span>Odometer:</span>
                        <span className="font-mono">{booking.vehicle.startKmReading || "---"} ➔ {booking.vehicle.endKmReading || "---"} KM</span>
                      </div>
                    )}
                  </div>
                </div>

                {booking.vehicle.dutyNotes && (
                  <div className="mt-4 p-4 bg-white rounded-2xl border border-stone-200 text-xs">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">Duty Instructions & Notes:</span>
                    <p className="text-stone-700 italic">{booking.vehicle.dutyNotes}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= 4. ITEMIZED BILL & BOOKING INVOICE ================= */}
          {activeTab === "invoice" && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between pb-6 border-b-2 border-stone-900">
                <div>
                  <div className="relative w-40 h-14 mb-2">
                    <Image
                      src="/brand/logo.png"
                      alt="Aston Holidays"
                      fill
                      className="object-contain object-left"
                    />
                  </div>
                  <p className="text-xs font-bold text-stone-900 tracking-wide uppercase">
                    Aston Holidays
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Kolagappara, Beenachi, Sulthan Bathery, Wayanad - 673592, Kerala
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Phone: +91 97449 00414 • info@astonholidays.com
                  </p>
                </div>

                <div className="text-right">
                  <span className="inline-block bg-[#2E4F28] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded">
                    Booking Invoice & Voucher
                  </span>
                  <h2 className="text-xl font-black font-mono text-stone-900 mt-2">
                    INV-{booking.bookingCode.replace("AST-PKG-", "PKG-")}
                  </h2>
                  <p className="text-xs text-stone-600 mt-1">
                    Date: {booking.createdAt.split("T")[0]}
                  </p>
                  <p className="text-xs text-stone-600">
                    Status: <span className="font-bold text-emerald-800">{booking.paymentStatus}</span>
                  </p>
                </div>
              </div>

              {/* Bill To */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Billed To</span>
                <p className="text-sm font-bold text-stone-900 mt-0.5">{booking.customerName}</p>
                <p className="text-stone-600">{booking.customerPhone}</p>
                {booking.customerEmail && <p className="text-stone-600">{booking.customerEmail}</p>}
                {booking.customerAddress && <p className="text-stone-600">{booking.customerAddress}</p>}
              </div>

              {/* Itemized Table */}
              <div className="border border-stone-200 rounded-2xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-wider border-b border-stone-200">
                    <tr>
                      <th className="py-3 px-4">Item / Description</th>
                      <th className="py-3 px-4 text-center">Qty / Days</th>
                      <th className="py-3 px-4 text-right">Rate (₹)</th>
                      <th className="py-3 px-4 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {/* Rooms */}
                    {booking.rooms.map((r, i) => (
                      <tr key={i} className="hover:bg-stone-50/50">
                        <td className="py-3 px-4">
                          <p className="font-bold text-stone-900">
                            [Room Stay] {r.resortCode} - {r.roomType || r.resortName}
                          </p>
                          <p className="text-[10px] text-stone-500">
                            {r.destination} • {r.roomsCount} Room(s) • Meal Plan: {r.mealPlan || "EP"}
                          </p>
                        </td>
                        <td className="py-3 px-4 text-center">{r.nights} N</td>
                        <td className="py-3 px-4 text-right">₹{r.ratePerNight.toLocaleString("en-IN")}</td>
                        <td className="py-3 px-4 text-right font-semibold">₹{r.totalAmount.toLocaleString("en-IN")}</td>
                      </tr>
                    ))}

                    {/* Vehicle */}
                    {booking.vehicle && booking.vehicle.enabled && (
                      <tr className="hover:bg-stone-50/50">
                        <td className="py-3 px-4">
                          <p className="font-bold text-stone-900">
                            [Vehicle Rental] {booking.vehicle.vehicleType}
                          </p>
                          <p className="text-[10px] text-stone-500">
                            {booking.vehicle.pickupLocation} to {booking.vehicle.dropLocation}
                          </p>
                          {booking.vehicle.pricingModel === "per_km" && (
                            <p className="text-[10px] text-emerald-800 font-semibold mt-0.5">
                              Running KM Billing: {booking.vehicle.totalKmCovered || 0} KM @ ₹{booking.vehicle.ratePerKm || 0}/KM + Driver Batta ₹{(booking.vehicle.driverBatta * (booking.vehicle.totalDays || 1)).toLocaleString("en-IN")}
                            </p>
                          )}
                          {booking.vehicle.pricingModel === "package_km_extra" && (
                            <p className="text-[10px] text-emerald-800 font-semibold mt-0.5">
                              Package Base: {booking.vehicle.baseKmIncluded || 0} KM | Extra KM Covered: {booking.vehicle.extraKmCovered || 0} KM @ ₹{booking.vehicle.extraKmRate || 0}/KM (Extra: ₹{(booking.vehicle.extraKmAmount || 0).toLocaleString("en-IN")})
                            </p>
                          )}
                          {booking.vehicle.pricingModel === "daily" && (
                            <p className="text-[10px] text-stone-600 mt-0.5">
                              Daily Rate: {booking.vehicle.totalDays} Days @ ₹{booking.vehicle.ratePerDay}/Day + Driver Batta
                            </p>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {booking.vehicle.pricingModel === "per_km"
                            ? `${booking.vehicle.totalKmCovered || 0} KM`
                            : booking.vehicle.pricingModel === "package_km_extra"
                            ? `${booking.vehicle.totalKmCovered || 0} KM (${booking.vehicle.extraKmCovered || 0} Ext)`
                            : `${booking.vehicle.totalDays} Days`}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {booking.vehicle.pricingModel === "per_km"
                            ? `₹${booking.vehicle.ratePerKm || 0}/km`
                            : booking.vehicle.pricingModel === "package_km_extra"
                            ? `Base + ₹${booking.vehicle.extraKmRate || 0}/km`
                            : `₹${booking.vehicle.ratePerDay.toLocaleString("en-IN")}/d`}
                        </td>
                        <td className="py-3 px-4 text-right font-semibold">
                          ₹{booking.vehicle.totalAmount.toLocaleString("en-IN")}
                        </td>
                      </tr>
                    )}

                    {/* Other Expenses */}
                    {booking.otherExpenses.map((exp, i) => (
                      <tr key={i} className="hover:bg-stone-50/50">
                        <td className="py-3 px-4">
                          <p className="font-bold text-stone-900">
                            [Other Expense] {exp.title}
                          </p>
                          <p className="text-[10px] text-stone-500">{exp.category}</p>
                          {exp.notepadContent && (
                            <p className="text-[10px] text-stone-400 italic">Note: {exp.notepadContent}</p>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">{exp.quantity}</td>
                        <td className="py-3 px-4 text-right">₹{exp.rate.toLocaleString("en-IN")}</td>
                        <td className="py-3 px-4 text-right font-semibold">₹{exp.totalAmount.toLocaleString("en-IN")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial Calculation & Bank / UPI details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                {/* Bank / UPI QR with Edit Payment Details Button */}
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs flex flex-col justify-between">
                  <div className="flex gap-4 items-center">
                    {qrCodeUrl && (
                      <div className="bg-white p-2 rounded-xl border border-stone-200 shadow-sm shrink-0">
                        <Image
                          src={bankDetails.qrCodeCustomUrl || qrCodeUrl}
                          alt="Scan UPI to Pay Balance"
                          width={90}
                          height={90}
                          className="object-contain"
                        />
                      </div>
                    )}
                    <div className="space-y-1 min-w-0">
                      <p className="font-bold text-stone-900">Scan UPI / Bank Transfer</p>
                      <p className="text-[11px] text-stone-600 truncate"><span className="font-semibold text-stone-500">Account:</span> {bankDetails.accountName}</p>
                      <p className="text-[11px] text-stone-600 truncate"><span className="font-semibold text-stone-500">Bank:</span> {bankDetails.bankName}</p>
                      <p className="text-[11px] text-stone-600 font-mono"><span className="font-semibold text-stone-500">A/C:</span> {bankDetails.accountNumber} • {bankDetails.ifscCode}</p>
                      <p className="text-[11px] text-emerald-800 font-mono font-bold"><span className="font-semibold text-stone-500">UPI:</span> {bankDetails.upiId}</p>
                    </div>
                  </div>

                  {/* Edit Payment Details trigger (hidden on print) */}
                  <div className="no-print pt-3 mt-3 border-t border-stone-200 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setBankForm(bankDetails);
                        setIsEditingBankDetails(true);
                      }}
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition active:scale-95"
                    >
                      <Edit3 className="w-3 h-3 text-emerald-700" />
                      <span>Update Account Details & QR</span>
                    </button>
                    <span className="text-[10px] text-stone-400">Live QR auto-syncs</span>
                  </div>
                </div>

                {/* Totals - Clean non-GST calculations */}
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Rooms Subtotal:</span>
                    <span className="font-semibold">₹{booking.roomsSubtotal.toLocaleString("en-IN")}</span>
                  </div>
                  {booking.vehicle && booking.vehicle.enabled && (
                    <div className="flex justify-between">
                      <span className="text-stone-500">Vehicle Subtotal:</span>
                      <span className="font-semibold">₹{booking.vehicleSubtotal.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  {booking.otherExpenses.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-stone-500">Other Expenses:</span>
                      <span className="font-semibold">₹{booking.otherExpensesSubtotal.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  {booking.discount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Discount:</span>
                      <span>-₹{booking.discount.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-black text-sm text-stone-900 pt-2 border-t border-stone-200">
                    <span>Total Amount Payable:</span>
                    <span>₹{(booking.grossTotal - (booking.discount || 0)).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-emerald-800 font-semibold">
                    <span>Advance Received:</span>
                    <span>₹{booking.advancePaid.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-amber-800 font-black text-sm pt-1 border-t border-stone-200">
                    <span>Balance Due on Arrival:</span>
                    <span>₹{balanceAmount.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              {/* Payment Details Quick-Editor Modal */}
              {isEditingBankDetails && (
                <div className="no-print fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-emerald-700" />
                        <h3 className="text-sm font-bold text-stone-900">Update Payment Details & QR</h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsEditingBankDetails(false)}
                        className="text-stone-400 hover:text-stone-700 p-1 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveBankDetails} className="space-y-3.5 mt-4 text-xs">
                      <div>
                        <label className="block text-stone-600 font-bold mb-1">Account Name</label>
                        <input
                          type="text"
                          value={bankForm.accountName}
                          onChange={(e) => setBankForm({ ...bankForm, accountName: e.target.value })}
                          className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                          placeholder="e.g. Aston Holidays"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-stone-600 font-bold mb-1">Bank Name</label>
                        <input
                          type="text"
                          value={bankForm.bankName}
                          onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
                          className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                          placeholder="e.g. State Bank of India"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-stone-600 font-bold mb-1">Account Number</label>
                          <input
                            type="text"
                            value={bankForm.accountNumber}
                            onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })}
                            className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700/20 font-mono"
                            placeholder="e.g. 40921008745"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-stone-600 font-bold mb-1">IFSC Code</label>
                          <input
                            type="text"
                            value={bankForm.ifscCode}
                            onChange={(e) => setBankForm({ ...bankForm, ifscCode: e.target.value.toUpperCase() })}
                            className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700/20 font-mono uppercase"
                            placeholder="e.g. SBIN0008451"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-stone-600 font-bold mb-1">UPI ID (Generates Dynamic QR)</label>
                        <input
                          type="text"
                          value={bankForm.upiId}
                          onChange={(e) => setBankForm({ ...bankForm, upiId: e.target.value })}
                          className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700/20 font-mono text-emerald-800"
                          placeholder="e.g. astonholidays@sbi"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-stone-600 font-bold mb-1">Custom QR Code Image URL (Optional)</label>
                        <input
                          type="text"
                          value={bankForm.qrCodeCustomUrl || ""}
                          onChange={(e) => setBankForm({ ...bankForm, qrCodeCustomUrl: e.target.value })}
                          className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                          placeholder="Leave blank to use live auto-generated UPI QR"
                        />
                        <p className="text-[10px] text-stone-400 mt-1">If empty, dynamic QR for ₹{balanceAmount.toLocaleString("en-IN")} is generated automatically.</p>
                      </div>

                      <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setIsEditingBankDetails(false)}
                          className="px-3 py-2 text-stone-600 font-semibold hover:bg-stone-100 rounded-xl transition"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-[#2E4F28] hover:bg-[#233D1F] text-white font-bold rounded-xl transition shadow active:scale-95 flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Save & Apply</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= 5. INTERACTIVE NOTEPAD & NOTES ================= */}
          {activeTab === "notepad" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <div>
                  <h3 className="text-lg font-bold text-stone-900">
                    Package & Expense Notepad
                  </h3>
                  <p className="text-xs text-stone-500">
                    Add custom notes, special client requests, dietary memos, or vendor phone numbers.
                  </p>
                </div>

                <div className="no-print print:hidden flex items-center gap-2">
                  {isEditingNotes ? (
                    <button
                      onClick={handleSaveNotes}
                      className="px-4 py-2 bg-[#2E4F28] hover:bg-[#233D1F] text-white text-xs font-bold rounded-xl transition"
                    >
                      Save Notes
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEditingNotes(true)}
                      className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition"
                    >
                      Edit Notepad
                    </button>
                  )}
                </div>
              </div>

              {/* Master Package Notes */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                <span className="text-xs font-bold text-stone-800 block mb-2">
                  General Package Instructions & Client Memos:
                </span>
                {isEditingNotes ? (
                  <textarea
                    rows={5}
                    value={editableNotes}
                    onChange={(e) => setEditableNotes(e.target.value)}
                    placeholder="Type client notes, food preferences, VIP instructions, or special timings..."
                    className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 bg-white"
                  />
                ) : (
                  <p className="text-xs text-stone-700 whitespace-pre-wrap font-serif leading-relaxed">
                    {booking.notepadNotes || "No specific package notes recorded yet. Click 'Edit Notepad' to add notes."}
                  </p>
                )}
              </div>

              {/* Itemized Other Expenses Notepads */}
              {booking.otherExpenses.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-3">
                    Other Expenses Itemization Notes:
                  </h4>
                  <div className="space-y-3">
                    {booking.otherExpenses.map((exp) => (
                      <div key={exp.id} className="p-4 bg-white rounded-2xl border border-stone-200 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-stone-900">{exp.title}</span>
                          <span className="text-[11px] font-semibold text-emerald-800">₹{exp.totalAmount.toLocaleString("en-IN")}</span>
                        </div>
                        <p className="text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-100 mt-2 font-mono text-[11px]">
                          {exp.notepadContent || "(No memo added for this expense)"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
