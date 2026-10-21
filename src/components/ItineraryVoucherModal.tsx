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
  Edit3
} from "lucide-react";
import { PackageItineraryBooking } from "@/lib/types";

interface ItineraryVoucherModalProps {
  booking: PackageItineraryBooking;
  onClose: () => void;
  onUpdateBooking?: (updated: PackageItineraryBooking) => void;
}

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

  useEffect(() => {
    // Generate UPI QR code for balance due
    const upiString = `upi://pay?pa=astonholidays@sbi&pn=Aston%20Holidays&am=${booking.balanceDue}&cu=INR&tn=Booking%20${booking.bookingCode}`;
    QRCode.toDataURL(upiString, { width: 140, margin: 1 })
      .then(url => setQrCodeUrl(url))
      .catch(err => console.error(err));
  }, [booking]);

  const handlePrint = () => {
    window.print();
  };

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
      msg += `🚗 *CAB / TRANSPORT:*\n`;
      msg += `• ${booking.vehicle.vehicleType} (${booking.vehicle.pickupLocation} to ${booking.vehicle.dropLocation})\n`;
      if (booking.vehicle.driverName) msg += `• Driver: ${booking.vehicle.driverName} (${booking.vehicle.driverPhone || "N/A"})\n`;
      if (booking.vehicle.vehicleNumber) msg += `• Vehicle No: ${booking.vehicle.vehicleNumber}\n`;
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
    if (v.dutyNotes) msg += `*Duty Notes:* ${v.dutyNotes}\n`;
    msg += `\nAston Holidays Logistics Desk: +91 97449 00414`;

    const cleanPhone = (v.driverPhone || booking.customerPhone).replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-stone-200 overflow-hidden my-6 flex flex-col max-h-[92vh]">
        
        {/* Top Control Bar (Hidden on print) */}
        <div className="no-print bg-[#1A2518] text-white px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-black bg-emerald-700/80 text-emerald-100 px-2.5 py-1 rounded-lg">
              {booking.bookingCode}
            </span>
            <div>
              <h3 className="text-sm font-bold text-white leading-tight">
                {booking.packageTitle}
              </h3>
              <p className="text-[11px] text-stone-300">
                {booking.customerName} • {booking.duration} • {booking.startDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={sendItineraryWhatsApp}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-xl transition shadow"
            >
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Guest
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-900 bg-white hover:bg-stone-100 px-3 py-1.5 rounded-xl transition shadow"
            >
              <Printer className="w-3.5 h-3.5" /> Print / PDF
            </button>
            <button
              onClick={onClose}
              className="text-stone-300 hover:text-white p-1 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation (Hidden on print) */}
        <div className="no-print bg-stone-50 border-b border-stone-200 px-6 py-2.5 flex flex-wrap items-center gap-2 text-xs font-bold">
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
            <Receipt className="w-3.5 h-3.5" /> Itemized Bill & Tax Invoice
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
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-white print:p-0">

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
                <div className="flex gap-2 pb-3 border-b border-stone-200">
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
                            className="no-print inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-xl transition shadow"
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
                      className="no-print inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-xl transition shadow"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Driver & Guest
                    </button>
                    <p className="text-xs text-stone-400 font-mono mt-2">
                      Ref: {booking.bookingCode}-CAB
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-xs">
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

          {/* ================= 4. ITEMIZED BILL & TAX INVOICE ================= */}
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
                    Aston Holidays LLP
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Kolagappara, Beenachi, Sulthan Bathery, Wayanad - 673592
                  </p>
                  <p className="text-[11px] text-stone-500">
                    GSTIN: 32AABCA1234F1Z5 • +91 97449 00414
                  </p>
                </div>

                <div className="text-right">
                  <span className="inline-block bg-[#2E4F28] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded">
                    Tax Invoice / Bill
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
                            [Vehicle Booking] {booking.vehicle.vehicleType}
                          </p>
                          <p className="text-[10px] text-stone-500">
                            {booking.vehicle.pickupLocation} to {booking.vehicle.dropLocation} (Chauffeur incl.)
                          </p>
                        </td>
                        <td className="py-3 px-4 text-center">{booking.vehicle.totalDays} Days</td>
                        <td className="py-3 px-4 text-right">₹{booking.vehicle.ratePerDay.toLocaleString("en-IN")}</td>
                        <td className="py-3 px-4 text-right font-semibold">₹{booking.vehicle.totalAmount.toLocaleString("en-IN")}</td>
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
                {/* Bank / UPI QR */}
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs flex gap-4 items-center">
                  {qrCodeUrl && (
                    <div className="bg-white p-2 rounded-xl border border-stone-200 shadow-sm shrink-0">
                      <Image
                        src={qrCodeUrl}
                        alt="Scan UPI to Pay Balance"
                        width={90}
                        height={90}
                        className="object-contain"
                      />
                    </div>
                  )}
                  <div className="space-y-1">
                    <p className="font-bold text-stone-900">Scan UPI / Bank Transfer</p>
                    <p className="text-[11px] text-stone-600">Account: Aston Holidays LLP</p>
                    <p className="text-[11px] text-stone-600 font-mono">A/C: 40921008745 • SBIN0008451</p>
                    <p className="text-[11px] text-emerald-800 font-mono font-bold">UPI: astonholidays@sbi</p>
                  </div>
                </div>

                {/* Totals */}
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
                  <div className="flex justify-between">
                    <span className="text-stone-500">GST ({booking.gstRate}%):</span>
                    <span className="font-semibold">₹{booking.gstAmount.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between font-black text-sm text-stone-900 pt-2 border-t border-stone-200">
                    <span>Net Amount Payable:</span>
                    <span>₹{booking.netPayable.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-emerald-800 font-semibold">
                    <span>Advance Received:</span>
                    <span>₹{booking.advancePaid.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-amber-800 font-black text-sm pt-1 border-t border-stone-200">
                    <span>Balance Due on Arrival:</span>
                    <span>₹{booking.balanceDue.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>
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

                <div className="no-print flex items-center gap-2">
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
