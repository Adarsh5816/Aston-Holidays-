"use client";

import React, { useState, useEffect, Suspense } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import ItineraryVoucherModal from "@/components/ItineraryVoucherModal";
import { PackageItineraryBooking, Resort, ItineraryDay, RoomBookingItem, VehicleBookingItem, OtherExpenseItem } from "@/lib/types";
import {
  Compass,
  Plus,
  Search,
  BedDouble,
  Car,
  Receipt,
  Eye,
  Trash2,
  Calendar,
  X,
  Sparkles,
  Edit3,
  CheckCircle2,
  Phone,
  MessageCircle,
  Clock,
  MapPin,
  ChevronRight,
  FileText
} from "lucide-react";

function ItinerariesContent() {
  const [bookings, setBookings] = useState<PackageItineraryBooking[]>([]);
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<PackageItineraryBooking | null>(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [packageTitle, setPackageTitle] = useState("Romantic Misty Wayanad & Private Pool Escape");
  const [category, setCategory] = useState<PackageItineraryBooking["category"]>("Honey Moon Package");
  const [duration, setDuration] = useState("3 Days / 2 Nights");
  const [startDate, setStartDate] = useState("2026-11-15");
  const [endDate, setEndDate] = useState("2026-11-17");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  // Itinerary Days
  const [itineraryDays, setItineraryDays] = useState<ItineraryDay[]>([
    {
      dayNumber: 1,
      title: "Calicut Pickup & Scenic Rainforest Ascent to Wayanad",
      activities: "Chauffeur pickup from Calicut Railway Station / Airport. Scenic drive through Thamarassery Churam mountain pass with viewpoints. Check-in to private pool villa. Evening leisurely poolside dip and welcome plantation tea.",
      sightseeing: ["Lakkidi View Point", "Pookode Freshwater Lake", "Thamarassery Ghats"],
      mealsIncluded: { breakfast: false, lunch: true, dinner: true },
      stayDestination: "Padinjarathara",
      stayResortCode: "AH-112"
    },
    {
      dayNumber: 2,
      title: "Banasura Sagar Dam Boating & Candlelight Dinner by the Pool",
      activities: "Morning breakfast with estate fresh coffee. Visit Banasura Sagar earthen dam with speed boat excursion. Afternoon visit to Karlad Adventure Lake. Evening exclusive romantic candlelight dinner setup by the pool with rose petals.",
      sightseeing: ["Banasura Sagar Dam", "Karlad Adventure Lake", "Meenmutty Waterfalls"],
      mealsIncluded: { breakfast: true, lunch: false, dinner: true },
      stayDestination: "Padinjarathara",
      stayResortCode: "AH-112"
    },
    {
      dayNumber: 3,
      title: "Tea Plantation Walk, Spice Shopping & Calicut Drop",
      activities: "Early morning sunrise walk through tea estate paths. Leisurely breakfast and pool dip. Check-out at 11:00 AM. Visit Wayanad Tea Museum and local spice market at Kalpetta for authentic cardamom & pepper. Comfortable drive back and drop at Calicut.",
      sightseeing: ["Tea Museum & Factory", "Kalpetta Heritage Spice Market", "Chain Tree"],
      mealsIncluded: { breakfast: true, lunch: true, dinner: false },
      stayDestination: "Calicut Drop"
    }
  ]);

  // Rooms Booking (Auto-connected with resorts)
  const [rooms, setRooms] = useState<RoomBookingItem[]>([
    {
      id: "room-1",
      resortCode: "AH-112",
      resortName: "2BHK Private Pool Villa",
      roomType: "Luxury Private Pool Villa",
      destination: "Padinjarathara",
      checkIn: "2026-11-15",
      checkOut: "2026-11-17",
      nights: 2,
      roomsCount: 1,
      adultsCount: 2,
      childrenCount: 0,
      ratePerNight: 12500,
      totalAmount: 25000,
      mealPlan: "CP (Bed & Breakfast)",
      specialRequests: "Rose petal bed decoration"
    }
  ]);

  // Vehicle Booking
  const [vehicle, setVehicle] = useState<VehicleBookingItem>({
    id: "veh-1",
    enabled: true,
    vehicleType: "Sedan (Dzire / Etios)",
    vehicleNumber: "KL-12-AE-4819",
    driverName: "Suresh Babu",
    driverPhone: "+91 97455 12840",
    pickupLocation: "Calicut Airport / Railway Station",
    dropLocation: "Calicut Railway Station",
    pickupDate: "2026-11-15",
    dropDate: "2026-11-17",
    totalDays: 3,
    ratePerDay: 2600,
    driverBatta: 400,
    totalAmount: 9000,
    dutyNotes: "Driver will report at Calicut Airport at 09:30 AM with guest name placard."
  });

  // Other Expenses & Interactive Notepad
  const [otherExpenses, setOtherExpenses] = useState<OtherExpenseItem[]>([
    {
      id: "exp-1",
      category: "Candlelight Dinner",
      title: "5-Course Romantic Candlelight Dinner by the Pool",
      rate: 3500,
      quantity: 1,
      totalAmount: 3500,
      notepadContent: "Client requested pure vegetarian Continental menu, heart-shaped chocolate truffle cake (eggless), and candle lanterns around the pool edge.",
      showInVoucher: true
    }
  ]);

  const [notepadNotes, setNotepadNotes] = useState(
    "VIP Honeymoon couple. Ensure villa manager provides warm welcome with fresh tender coconut on arrival."
  );

  // Financials
  const [discount, setDiscount] = useState(0);
  const [gstRate, setGstRate] = useState(5);
  const [advancePaid, setAdvancePaid] = useState(10000);
  const [paymentStatus, setPaymentStatus] = useState<PackageItineraryBooking["paymentStatus"]>("Advance Received");

  // Load bookings and resorts
  const loadData = async () => {
    try {
      const [bRes, rRes] = await Promise.all([
        fetch("/api/v1/itineraries"),
        fetch("/api/v1/resorts")
      ]);
      if (bRes.ok) {
        const bData = await bRes.json();
        setBookings(bData);
      }
      if (rRes.ok) {
        const rData = await rRes.json();
        setResorts(rData);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Financial calculations
  const roomsSubtotal = rooms.reduce((acc, r) => acc + (r.totalAmount || 0), 0);
  const vehicleSubtotal = vehicle.enabled ? (vehicle.totalAmount || 0) : 0;
  const otherExpensesSubtotal = otherExpenses.reduce((acc, e) => acc + (e.totalAmount || 0), 0);
  const grossTotal = roomsSubtotal + vehicleSubtotal + otherExpensesSubtotal;
  const taxableAmount = Math.max(0, grossTotal - discount);
  const gstAmount = Math.round((taxableAmount * gstRate) / 100);
  const netPayable = taxableAmount + gstAmount;
  const balanceDue = Math.max(0, netPayable - advancePaid);

  // Add room
  const handleAddRoom = () => {
    const defaultResort = resorts[0] || { code: "AH-121", name: "3BHK Villa", destination: "Padinjarathara", pricePerNight: 14500 };
    const newRoom: RoomBookingItem = {
      id: `room-${Date.now()}`,
      resortCode: defaultResort.code,
      resortName: defaultResort.name,
      roomType: "Private Pool Villa",
      destination: defaultResort.destination,
      checkIn: startDate,
      checkOut: endDate,
      nights: 2,
      roomsCount: 1,
      adultsCount: adults,
      childrenCount: children,
      ratePerNight: defaultResort.pricePerNight,
      totalAmount: defaultResort.pricePerNight * 2,
      mealPlan: "CP (Bed & Breakfast)",
      specialRequests: ""
    };
    setRooms([...rooms, newRoom]);
  };

  const handleUpdateRoom = (idx: number, updates: Partial<RoomBookingItem>) => {
    const updated = [...rooms];
    const current = { ...updated[idx], ...updates };
    
    // Auto sync with resort details if resortCode changed
    if (updates.resortCode && updates.resortCode !== updated[idx].resortCode) {
      const found = resorts.find(r => r.code === updates.resortCode);
      if (found) {
        current.resortName = found.name;
        current.destination = found.destination;
        current.ratePerNight = found.pricePerNight;
      }
    }
    
    current.totalAmount = (current.ratePerNight || 0) * (current.nights || 1) * (current.roomsCount || 1);
    updated[idx] = current;
    setRooms(updated);
  };

  const handleRemoveRoom = (idx: number) => {
    setRooms(rooms.filter((_, i) => i !== idx));
  };

  // Add Day to Itinerary
  const handleAddDay = () => {
    const nextDayNum = itineraryDays.length + 1;
    const newDay: ItineraryDay = {
      dayNumber: nextDayNum,
      title: `Day ${nextDayNum} Sightseeing & Wayanad Exploration`,
      activities: "Breakfast at stay. Scenic morning excursion to local waterfalls and viewpoints. Afternoon traditional lunch. Evening leisure time.",
      sightseeing: ["Chembra Peak", "Soochipara Falls"],
      mealsIncluded: { breakfast: true, lunch: false, dinner: true },
      stayDestination: "Wayanad",
      stayResortCode: rooms[0]?.resortCode || "AH-112"
    };
    setItineraryDays([...itineraryDays, newDay]);
  };

  const handleUpdateDay = (idx: number, updates: Partial<ItineraryDay>) => {
    const updated = [...itineraryDays];
    updated[idx] = { ...updated[idx], ...updates };
    setItineraryDays(updated);
  };

  const handleRemoveDay = (idx: number) => {
    const updated = itineraryDays.filter((_, i) => i !== idx).map((day, i) => ({
      ...day,
      dayNumber: i + 1
    }));
    setItineraryDays(updated);
  };

  // Add Other Expense
  const handleAddOtherExpense = () => {
    const newExp: OtherExpenseItem = {
      id: `exp-${Date.now()}`,
      category: "Other Custom Expense",
      title: "Special Experience / Activity",
      rate: 1500,
      quantity: 1,
      totalAmount: 1500,
      notepadContent: "Client requested custom arrangement. Contact vendor directly prior to arrival.",
      showInVoucher: true
    };
    setOtherExpenses([...otherExpenses, newExp]);
  };

  const handleUpdateOtherExpense = (idx: number, updates: Partial<OtherExpenseItem>) => {
    const updated = [...otherExpenses];
    const current = { ...updated[idx], ...updates };
    current.totalAmount = (current.rate || 0) * (current.quantity || 1);
    updated[idx] = current;
    setOtherExpenses(updated);
  };

  const handleRemoveOtherExpense = (idx: number) => {
    setOtherExpenses(otherExpenses.filter((_, i) => i !== idx));
  };

  // Save Package & Auto-Sync with Invoice / Booking
  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Partial<PackageItineraryBooking> = {
      id: editingId || undefined,
      bookingCode: editingId ? (bookings.find(b => b.id === editingId)?.bookingCode || undefined) : undefined,
      packageTitle,
      category,
      duration,
      startDate,
      endDate,
      customerName,
      customerPhone,
      customerEmail: customerEmail || undefined,
      customerAddress: customerAddress || undefined,
      totalGuests: { adults, children },
      itineraryDays,
      rooms,
      vehicle,
      otherExpenses,
      notepadNotes,
      roomsSubtotal,
      vehicleSubtotal,
      otherExpensesSubtotal,
      grossTotal,
      discount,
      taxableAmount,
      gstRate,
      gstAmount,
      netPayable,
      advancePaid,
      balanceDue,
      paymentStatus
    };

    try {
      const res = await fetch("/api/v1/itineraries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const saved = await res.json();
        if (editingId) {
          setBookings(bookings.map(b => b.id === editingId ? saved : b));
        } else {
          setBookings([saved, ...bookings]);
        }
        setIsBuilderOpen(false);
        setEditingId(null);
        setSelectedBooking(saved);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleEdit = (b: PackageItineraryBooking) => {
    setEditingId(b.id);
    setPackageTitle(b.packageTitle);
    setCategory(b.category);
    setDuration(b.duration);
    setStartDate(b.startDate);
    setEndDate(b.endDate);
    setCustomerName(b.customerName);
    setCustomerPhone(b.customerPhone);
    setCustomerEmail(b.customerEmail || "");
    setCustomerAddress(b.customerAddress || "");
    setAdults(b.totalGuests.adults);
    setChildren(b.totalGuests.children);
    setItineraryDays(b.itineraryDays);
    setRooms(b.rooms);
    setVehicle(b.vehicle);
    setOtherExpenses(b.otherExpenses);
    setNotepadNotes(b.notepadNotes);
    setDiscount(b.discount);
    setGstRate(b.gstRate);
    setAdvancePaid(b.advancePaid);
    setPaymentStatus(b.paymentStatus);
    setIsBuilderOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this itinerary & package booking?")) return;
    await fetch(`/api/v1/itineraries?id=${id}`, { method: "DELETE" });
    setBookings(bookings.filter(b => b.id !== id));
    if (selectedBooking?.id === id) setSelectedBooking(null);
  };

  const filtered = bookings.filter(b =>
    b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.bookingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.packageTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#F5F6F8]">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
                Package & Itinerary Studio
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md">
                Auto-Synced with Bookings
              </span>
            </div>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight mt-1">
              Itinerary & Package Builder
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Create day-by-day itineraries, auto-connect room bookings from inventory, manage cabs & other expenses with interactive notepads, and generate individual vouchers & bills.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingId(null);
              setIsBuilderOpen(true);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#2E4F28] hover:bg-[#233D1F] px-4 py-2.5 rounded-xl transition shadow-sm"
          >
            <Plus className="w-4 h-4" /> Create New Itinerary & Package
          </button>
        </div>

        {/* Search Bar */}
        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer name, booking code, or package title..."
              className="w-full text-xs font-medium pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 bg-white"
            />
          </div>
          <span className="text-xs text-stone-500 font-medium">
            Showing {filtered.length} package bookings
          </span>
        </div>

        {/* Bookings Table */}
        <div className="mt-6 bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-wider border-b border-stone-200">
              <tr>
                <th className="py-3.5 px-4">Booking Code</th>
                <th className="py-3.5 px-4">Package & Guest</th>
                <th className="py-3.5 px-4">Rooms & Cab</th>
                <th className="py-3.5 px-4 text-right">Net Tariff</th>
                <th className="py-3.5 px-4 text-right">Advance Paid</th>
                <th className="py-3.5 px-4 text-right">Balance Due</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-stone-50 transition">
                  <td className="py-4 px-4 font-mono font-bold text-stone-900">
                    {b.bookingCode}
                    <span className="block text-[10px] font-normal text-stone-400">{b.duration}</span>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-bold text-stone-900">{b.packageTitle}</p>
                    <p className="text-[11px] text-stone-500">
                      Guest: <span className="font-medium text-stone-700">{b.customerName}</span> ({b.customerPhone})
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {b.rooms.map((r, i) => (
                        <span key={i} className="text-[10px] font-mono bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                          {r.resortCode} ({r.nights}N)
                        </span>
                      ))}
                      {b.vehicle && b.vehicle.enabled && (
                        <span className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
                          🚗 {b.vehicle.vehicleType.split(" ")[0]}
                        </span>
                      )}
                      {b.otherExpenses.length > 0 && (
                        <span className="text-[10px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded">
                          +{b.otherExpenses.length} Extras
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right font-bold text-stone-900">
                    ₹{b.netPayable.toLocaleString("en-IN")}
                  </td>
                  <td className="py-4 px-4 text-right text-emerald-700 font-semibold">
                    ₹{b.advancePaid.toLocaleString("en-IN")}
                  </td>
                  <td className="py-4 px-4 text-right text-amber-700 font-bold">
                    ₹{b.balanceDue.toLocaleString("en-IN")}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      b.paymentStatus === "Fully Paid" ? "bg-emerald-100 text-emerald-800" :
                      b.paymentStatus === "Advance Received" ? "bg-amber-100 text-amber-800" :
                      "bg-stone-100 text-stone-700"
                    }`}>
                      {b.paymentStatus}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg transition"
                      >
                        <Eye className="w-3.5 h-3.5" /> Vouchers & Bill
                      </button>
                      <button
                        onClick={() => handleEdit(b)}
                        className="text-stone-400 hover:text-stone-700 p-1.5 transition"
                        title="Edit"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(b.id)}
                        className="text-stone-400 hover:text-red-600 p-1.5 transition"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= BUILDER MODAL ================= */}
        {isBuilderOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 my-8 max-h-[90vh] overflow-y-auto">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <div>
                  <h2 className="text-xl font-bold text-stone-900">
                    {editingId ? "Edit Package & Itinerary" : "Create New Itinerary & Package"}
                  </h2>
                  <p className="text-xs text-stone-500">
                    Auto-connects room bookings, cabs, and other expenses with synchronized invoicing.
                  </p>
                </div>
                <button
                  onClick={() => setIsBuilderOpen(false)}
                  className="text-stone-400 hover:text-stone-700 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSavePackage} className="mt-6 space-y-8 text-xs font-medium">
                
                {/* 1. BASIC DETAILS */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                    <Compass className="w-4 h-4 text-emerald-700" /> 1. Package & Customer Details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-stone-700 mb-1">Package Title *</label>
                      <input
                        type="text"
                        required
                        value={packageTitle}
                        onChange={(e) => setPackageTitle(e.target.value)}
                        placeholder="e.g. Wayanad Honeymoon Private Pool Villa Special"
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 mb-1">Category</label>
                      <select
                        value={category}
                        onChange={(e: any) => setCategory(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                      >
                        <option value="Honey Moon Package">Honey Moon Package</option>
                        <option value="Destination events">Destination events</option>
                        <option value="Group Packages">Group Packages</option>
                        <option value="Best Holiday Package">Best Holiday Package</option>
                        <option value="Custom Family Tour">Custom Family Tour</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-stone-700 mb-1">Duration</label>
                      <input
                        type="text"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        placeholder="e.g. 3 Days / 2 Nights"
                        className="w-full px-3 py-2 rounded-xl border border-stone-200"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-200"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 mb-1">End Date</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-200"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-stone-700 mb-1">Adults</label>
                        <input
                          type="number"
                          min={1}
                          value={adults}
                          onChange={(e) => setAdults(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-stone-200"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-700 mb-1">Children</label>
                        <input
                          type="number"
                          min={0}
                          value={children}
                          onChange={(e) => setChildren(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-stone-200"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div>
                      <label className="block text-stone-700 mb-1">Customer Name *</label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Rajesh Nair"
                        className="w-full px-3 py-2 rounded-xl border border-stone-200"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 mb-1">Customer Phone / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="+91 98470 00000"
                        className="w-full px-3 py-2 rounded-xl border border-stone-200"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 mb-1">Email / City</label>
                      <input
                        type="text"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="e.g. rajesh@gmail.com"
                        className="w-full px-3 py-2 rounded-xl border border-stone-200"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. DAY-BY-DAY ITINERARY BUILDER */}
                <div className="space-y-4 pt-4 border-t border-stone-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-emerald-700" /> 2. Day-by-Day Itinerary ({itineraryDays.length} Days)
                    </h3>
                    <button
                      type="button"
                      onClick={handleAddDay}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Day
                    </button>
                  </div>

                  <div className="space-y-3">
                    {itineraryDays.map((day, idx) => (
                      <div key={idx} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-bold text-xs text-stone-900 bg-white px-2.5 py-1 rounded-lg border border-stone-200">
                            Day {day.dayNumber}
                          </span>
                          <input
                            type="text"
                            value={day.title}
                            onChange={(e) => handleUpdateDay(idx, { title: e.target.value })}
                            placeholder="Day Title e.g. Banasura Sagar Dam & Private Pool Leisure"
                            className="flex-1 px-3 py-1.5 rounded-xl border border-stone-200 bg-white font-semibold"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveDay(idx)}
                            className="text-stone-400 hover:text-red-600 p-1"
                            title="Remove Day"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div>
                          <label className="block text-stone-600 text-[11px] mb-1">Activities & Schedule</label>
                          <textarea
                            rows={2}
                            value={day.activities}
                            onChange={(e) => handleUpdateDay(idx, { activities: e.target.value })}
                            placeholder="Detailed activities, pickups, sightseeing timings, meal breaks..."
                            className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                          <div>
                            <label className="block text-stone-600 text-[11px] mb-1">Sightseeing Spots (Comma separated)</label>
                            <input
                              type="text"
                              value={day.sightseeing.join(", ")}
                              onChange={(e) => handleUpdateDay(idx, { sightseeing: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                              placeholder="e.g. Edakkal Caves, Phantom Rock, Heritage Museum"
                              className="w-full px-3 py-1.5 rounded-xl border border-stone-200 bg-white"
                            />
                          </div>

                          <div className="flex items-center gap-4 text-xs pt-3">
                            <span className="text-stone-600 font-semibold">Meals:</span>
                            <label className="flex items-center gap-1 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={day.mealsIncluded.breakfast}
                                onChange={(e) => handleUpdateDay(idx, { mealsIncluded: { ...day.mealsIncluded, breakfast: e.target.checked } })}
                              />
                              Breakfast
                            </label>
                            <label className="flex items-center gap-1 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={day.mealsIncluded.lunch}
                                onChange={(e) => handleUpdateDay(idx, { mealsIncluded: { ...day.mealsIncluded, lunch: e.target.checked } })}
                              />
                              Lunch
                            </label>
                            <label className="flex items-center gap-1 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={day.mealsIncluded.dinner}
                                onChange={(e) => handleUpdateDay(idx, { mealsIncluded: { ...day.mealsIncluded, dinner: e.target.checked } })}
                              />
                              Dinner
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. ROOM BOOKINGS (AUTO-CONNECTED WITH RESORT INVENTORY) */}
                <div className="space-y-4 pt-4 border-t border-stone-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                        <BedDouble className="w-4 h-4 text-emerald-700" /> 3. Room Bookings (Auto-Connected with Inventory)
                      </h3>
                      <p className="text-[11px] text-stone-500">
                        Select properties directly from inventory; rates and details auto-fill and synchronize.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddRoom}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Another Room / Villa
                    </button>
                  </div>

                  <div className="space-y-3">
                    {rooms.map((room, idx) => (
                      <div key={room.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-2">
                            <label className="block text-stone-700 text-[11px] mb-1">Select Resort / Stay from Inventory *</label>
                            <select
                              value={room.resortCode}
                              onChange={(e) => handleUpdateRoom(idx, { resortCode: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white font-semibold"
                            >
                              {resorts.map((r) => (
                                <option key={r.code} value={r.code}>
                                  [{r.code}] {r.name} • {r.destination} (₹{r.pricePerNight}/night)
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-stone-700 text-[11px] mb-1">Meal Plan</label>
                            <select
                              value={room.mealPlan || "EP (Room Only)"}
                              onChange={(e: any) => handleUpdateRoom(idx, { mealPlan: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                            >
                              <option value="EP (Room Only)">EP (Room Only)</option>
                              <option value="CP (Bed & Breakfast)">CP (Bed & Breakfast)</option>
                              <option value="MAP (Breakfast & Dinner)">MAP (Breakfast & Dinner)</option>
                              <option value="AP (All Meals)">AP (All Meals)</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                          <div>
                            <label className="block text-stone-700 text-[11px] mb-1">Check-In</label>
                            <input
                              type="date"
                              value={room.checkIn}
                              onChange={(e) => handleUpdateRoom(idx, { checkIn: e.target.value })}
                              className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-stone-700 text-[11px] mb-1">Check-Out</label>
                            <input
                              type="date"
                              value={room.checkOut}
                              onChange={(e) => handleUpdateRoom(idx, { checkOut: e.target.value })}
                              className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-stone-700 text-[11px] mb-1">Rooms Count</label>
                            <input
                              type="number"
                              min={1}
                              value={room.roomsCount}
                              onChange={(e) => handleUpdateRoom(idx, { roomsCount: Number(e.target.value) })}
                              className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-stone-700 text-[11px] mb-1">Rate / Night (₹)</label>
                            <input
                              type="number"
                              value={room.ratePerNight}
                              onChange={(e) => handleUpdateRoom(idx, { ratePerNight: Number(e.target.value) })}
                              className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-stone-700 text-[11px] mb-1">Total Room Tariff</label>
                            <div className="font-bold text-stone-900 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 text-center">
                              ₹{room.totalAmount.toLocaleString("en-IN")}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-3 pt-1">
                          <input
                            type="text"
                            value={room.specialRequests || ""}
                            onChange={(e) => handleUpdateRoom(idx, { specialRequests: e.target.value })}
                            placeholder="Special room requests (e.g. extra bed, high floor, honeymoon bed decor)..."
                            className="flex-1 px-3 py-1.5 rounded-xl border border-stone-200 bg-white text-[11px]"
                          />
                          {rooms.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveRoom(idx)}
                              className="text-stone-400 hover:text-red-600 p-1"
                              title="Remove Room"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. VEHICLE BOOKING & CHAUFFEUR */}
                <div className="space-y-4 pt-4 border-t border-stone-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                      <Car className="w-4 h-4 text-emerald-700" /> 4. Vehicle Booking & Chauffeur
                    </h3>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-700">
                      <input
                        type="checkbox"
                        checked={vehicle.enabled}
                        onChange={(e) => setVehicle({ ...vehicle, enabled: e.target.checked })}
                      />
                      Include Vehicle in Package
                    </label>
                  </div>

                  {vehicle.enabled && (
                    <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-stone-700 text-[11px] mb-1">Vehicle Type</label>
                          <select
                            value={vehicle.vehicleType}
                            onChange={(e: any) => setVehicle({ ...vehicle, vehicleType: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                          >
                            <option value="Sedan (Dzire / Etios)">Sedan (Dzire / Etios)</option>
                            <option value="SUV (Innova Crysta / Ertiga)">SUV (Innova Crysta / Ertiga)</option>
                            <option value="Tempo Traveller (12/17 Seater)">Tempo Traveller (12/17 Seater)</option>
                            <option value="4x4 Jeep Safari">4x4 Jeep Safari</option>
                            <option value="Custom Vehicle">Custom Vehicle</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-stone-700 text-[11px] mb-1">Pickup Location</label>
                          <input
                            type="text"
                            value={vehicle.pickupLocation}
                            onChange={(e) => setVehicle({ ...vehicle, pickupLocation: e.target.value })}
                            placeholder="e.g. Calicut Airport / Railway Station"
                            className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-stone-700 text-[11px] mb-1">Drop Location</label>
                          <input
                            type="text"
                            value={vehicle.dropLocation}
                            onChange={(e) => setVehicle({ ...vehicle, dropLocation: e.target.value })}
                            placeholder="e.g. Calicut Railway Station"
                            className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        <div>
                          <label className="block text-stone-700 text-[11px] mb-1">Total Days</label>
                          <input
                            type="number"
                            min={1}
                            value={vehicle.totalDays}
                            onChange={(e) => {
                              const days = Number(e.target.value);
                              const total = days * vehicle.ratePerDay + (days * vehicle.driverBatta);
                              setVehicle({ ...vehicle, totalDays: days, totalAmount: total });
                            }}
                            className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-stone-700 text-[11px] mb-1">Rate / Day (₹)</label>
                          <input
                            type="number"
                            value={vehicle.ratePerDay}
                            onChange={(e) => {
                              const rate = Number(e.target.value);
                              const total = vehicle.totalDays * rate + (vehicle.totalDays * vehicle.driverBatta);
                              setVehicle({ ...vehicle, ratePerDay: rate, totalAmount: total });
                            }}
                            className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-stone-700 text-[11px] mb-1">Driver Batta (₹/day)</label>
                          <input
                            type="number"
                            value={vehicle.driverBatta}
                            onChange={(e) => {
                              const batta = Number(e.target.value);
                              const total = vehicle.totalDays * vehicle.ratePerDay + (vehicle.totalDays * batta);
                              setVehicle({ ...vehicle, driverBatta: batta, totalAmount: total });
                            }}
                            className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-stone-700 text-[11px] mb-1">Driver Name</label>
                          <input
                            type="text"
                            value={vehicle.driverName || ""}
                            onChange={(e) => setVehicle({ ...vehicle, driverName: e.target.value })}
                            placeholder="e.g. Suresh Babu"
                            className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-stone-700 text-[11px] mb-1">Total Vehicle Cost</label>
                          <div className="font-bold text-stone-900 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 text-center">
                            ₹{vehicle.totalAmount.toLocaleString("en-IN")}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 5. OTHER EXPENSES & INTERACTIVE NOTEPAD */}
                <div className="space-y-4 pt-4 border-t border-stone-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-700" /> 5. Other Expenses & Interactive Notepad
                      </h3>
                      <p className="text-[11px] text-stone-500">
                        When other expenses are selected, an interactive notepad is available for instructions, diet preferences, and vendor memos.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddOtherExpense}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Other Expense
                    </button>
                  </div>

                  <div className="space-y-3">
                    {otherExpenses.map((exp, idx) => (
                      <div key={exp.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                          <div className="sm:col-span-2">
                            <label className="block text-stone-700 text-[11px] mb-1">Category & Expense Title</label>
                            <div className="flex gap-2">
                              <select
                                value={exp.category}
                                onChange={(e: any) => handleUpdateOtherExpense(idx, { category: e.target.value })}
                                className="px-2.5 py-1.5 rounded-xl border border-stone-200 bg-white text-[11px]"
                              >
                                <option value="Campfire & Music">Campfire & Music</option>
                                <option value="Candlelight Dinner">Candlelight Dinner</option>
                                <option value="Ayurvedic Spa & Massage">Ayurvedic Spa & Massage</option>
                                <option value="Wildlife Safari & Entry Permits">Wildlife Safari & Entry Permits</option>
                                <option value="Adventure Park & Glass Bridge">Adventure Park & Glass Bridge</option>
                                <option value="Barbeque / Special Chef">Barbeque / Special Chef</option>
                                <option value="Other Custom Expense">Other Custom Expense</option>
                              </select>
                              <input
                                type="text"
                                value={exp.title}
                                onChange={(e) => handleUpdateOtherExpense(idx, { title: e.target.value })}
                                placeholder="Expense Name"
                                className="flex-1 px-3 py-1.5 rounded-xl border border-stone-200 bg-white font-semibold"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-stone-700 text-[11px] mb-1">Rate (₹)</label>
                              <input
                                type="number"
                                value={exp.rate}
                                onChange={(e) => handleUpdateOtherExpense(idx, { rate: Number(e.target.value) })}
                                className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-stone-700 text-[11px] mb-1">Qty</label>
                              <input
                                type="number"
                                min={1}
                                value={exp.quantity}
                                onChange={(e) => handleUpdateOtherExpense(idx, { quantity: Number(e.target.value) })}
                                className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 bg-white"
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <label className="block text-stone-700 text-[11px] mb-1">Total</label>
                              <div className="font-bold text-stone-900 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                                ₹{exp.totalAmount.toLocaleString("en-IN")}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveOtherExpense(idx)}
                              className="text-stone-400 hover:text-red-600 p-1.5 mt-4"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Interactive Notepad for Other Expense */}
                        <div className="bg-white p-3 rounded-xl border border-stone-200">
                          <label className="block text-emerald-800 font-bold text-[11px] mb-1 flex items-center gap-1">
                            <Edit3 className="w-3.5 h-3.5" /> Interactive Notepad for &ldquo;{exp.title}&rdquo;:
                          </label>
                          <textarea
                            rows={2}
                            value={exp.notepadContent}
                            onChange={(e) => handleUpdateOtherExpense(idx, { notepadContent: e.target.value })}
                            placeholder="Add memo for this item (e.g. food requests, cake text, vendor phone number, booking slot)..."
                            className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-[11px] focus:outline-none focus:ring-1 focus:ring-emerald-700/20"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* General Master Notepad */}
                  <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-2">
                    <label className="block font-bold text-amber-950 text-xs flex items-center gap-1.5">
                      <Edit3 className="w-4 h-4 text-amber-800" /> Master Package Notepad (Overall Notes & Client Instructions)
                    </label>
                    <textarea
                      rows={3}
                      value={notepadNotes}
                      onChange={(e) => setNotepadNotes(e.target.value)}
                      placeholder="Type general internal memos, dietary restrictions, arrival instructions, or special requests..."
                      className="w-full px-3 py-2 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-700/20 bg-white"
                    />
                  </div>
                </div>

                {/* 6. FINANCIALS & AUTO-SYNC SUMMARY */}
                <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 space-y-4">
                  <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-emerald-700" /> 6. Bill Summary & Automatic Booking Sync
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-stone-700 mb-1">Discount (₹)</label>
                      <input
                        type="number"
                        value={discount}
                        onChange={(e) => setDiscount(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 mb-1">GST Tax Rate</label>
                      <select
                        value={gstRate}
                        onChange={(e) => setGstRate(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                      >
                        <option value={0}>0% (Exempt)</option>
                        <option value={5}>5% GST (Tours)</option>
                        <option value={12}>12% GST</option>
                        <option value={18}>18% GST</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-stone-700 mb-1">Advance Received (₹)</label>
                      <input
                        type="number"
                        value={advancePaid}
                        onChange={(e) => setAdvancePaid(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 mb-1">Payment Status</label>
                      <select
                        value={paymentStatus}
                        onChange={(e: any) => setPaymentStatus(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Advance Received">Advance Received</option>
                        <option value="Fully Paid">Fully Paid</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Rooms Stay Subtotal:</span>
                      <span className="font-semibold">₹{roomsSubtotal.toLocaleString("en-IN")}</span>
                    </div>
                    {vehicle.enabled && (
                      <div className="flex justify-between">
                        <span className="text-stone-500">Vehicle & Chauffeur Subtotal:</span>
                        <span className="font-semibold">₹{vehicleSubtotal.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    {otherExpenses.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-stone-500">Other Expenses Subtotal:</span>
                        <span className="font-semibold">₹{otherExpensesSubtotal.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-stone-500">GST Tax ({gstRate}%):</span>
                      <span className="font-semibold">₹{gstAmount.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between font-black text-sm text-stone-900 pt-2 border-t border-stone-200">
                      <span>Total Package Tariff:</span>
                      <span>₹{netPayable.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-amber-800 font-bold">
                      <span>Balance Due on Arrival:</span>
                      <span>₹{balanceDue.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setIsBuilderOpen(false)}
                    className="px-4 py-2 text-stone-600 font-semibold hover:bg-stone-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#2E4F28] hover:bg-[#233D1F] text-white font-bold rounded-xl shadow transition"
                  >
                    Save & Auto-Sync with Bookings
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= VOUCHER & BILL MODAL ================= */}
        {selectedBooking && (
          <ItineraryVoucherModal
            booking={selectedBooking}
            onClose={() => setSelectedBooking(null)}
            onUpdateBooking={(updated) => {
              setSelectedBooking(updated);
              setBookings(bookings.map(b => b.id === updated.id ? updated : b));
            }}
          />
        )}
      </main>
    </div>
  );
}

export default function ItinerariesPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm">Loading Package & Itinerary Studio...</div>}>
      <ItinerariesContent />
    </Suspense>
  );
}
