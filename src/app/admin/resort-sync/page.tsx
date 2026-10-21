"use client";

import React, { useState, useEffect, Suspense } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import {
  ResortApiConnection,
  LiveRoomAvailability,
  ResortBookingRequest,
  ResortSyncLog,
  Resort
} from "@/lib/types";
import {
  Network,
  RefreshCw,
  Send,
  Plus,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Calendar,
  BedDouble,
  Clock,
  Sparkles,
  Phone,
  MessageCircle,
  ShieldCheck,
  Search,
  X,
  ExternalLink,
  ChevronRight,
  Sliders,
  Check,
  Building2,
  Activity
} from "lucide-react";

function ResortSyncContent() {
  const [activeTab, setActiveTab] = useState<"availability" | "booking" | "connections" | "logs">("availability");
  const [connections, setConnections] = useState<ResortApiConnection[]>([]);
  const [availability, setAvailability] = useState<LiveRoomAvailability[]>([]);
  const [bookingRequests, setBookingRequests] = useState<ResortBookingRequest[]>([]);
  const [syncLogs, setSyncLogs] = useState<ResortSyncLog[]>([]);
  const [resorts, setResorts] = useState<Resort[]>([]);
  
  const [selectedResortFilter, setSelectedResortFilter] = useState("ALL");
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // New Booking Request Form State
  const [reqResortCode, setReqResortCode] = useState("AH-112");
  const [reqGuestName, setReqGuestName] = useState("");
  const [reqGuestPhone, setReqGuestPhone] = useState("");
  const [reqCheckIn, setReqCheckIn] = useState("2026-11-15");
  const [reqCheckOut, setReqCheckOut] = useState("2026-11-17");
  const [reqRoomsCount, setReqRoomsCount] = useState(1);
  const [reqRoomType, setReqRoomType] = useState("2BHK Private Pool Villa");
  const [reqMealPlan, setReqMealPlan] = useState("CP (Bed & Breakfast)");
  const [reqSpecialNotes, setReqSpecialNotes] = useState("");
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [bookingResponseAlert, setBookingResponseAlert] = useState<any | null>(null);

  // Connection Edit Modal
  const [isConnModalOpen, setIsConnModalOpen] = useState(false);
  const [editingConn, setEditingConn] = useState<ResortApiConnection | null>(null);
  const [connResortCode, setConnResortCode] = useState("AH-112");
  const [connProvider, setConnProvider] = useState<ResortApiConnection["pmsProvider"]>("Stayflexi");
  const [connEndpoint, setConnEndpoint] = useState("https://api.stayflexi.com/v2/partners/aston");
  const [connApiKey, setConnApiKey] = useState("sk_live_ah112_stayflexi_8391");
  const [connSyncFreq, setConnSyncFreq] = useState(5);
  const [connAutoConfirm, setConnAutoConfirm] = useState(true);
  const [testingConnId, setTestingConnId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<any | null>(null);

  const loadData = async () => {
    try {
      const [syncRes, resRes] = await Promise.all([
        fetch("/api/v1/resort-sync"),
        fetch("/api/v1/resorts")
      ]);
      if (syncRes.ok) {
        const data = await syncRes.json();
        setConnections(data.connections || []);
        setAvailability(data.availability || []);
        setBookingRequests(data.requests || []);
        setSyncLogs(data.logs || []);
      }
      if (resRes.ok) {
        setResorts(await resRes.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Trigger Live Refresh via API
  const handleRefreshAvailability = async () => {
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      const res = await fetch("/api/v1/resort-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "refresh", resortCode: selectedResortFilter })
      });
      const data = await res.json();
      if (res.ok) {
        setSyncMessage(`Live sync complete! ${data.updatedCount} room blocks updated across PMS in ${data.latencyMs}ms.`);
        loadData();
        setTimeout(() => setSyncMessage(null), 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  // Test PMS API Connection
  const handleTestConnection = async (conn: ResortApiConnection) => {
    setTestingConnId(conn.id);
    setTestResult(null);
    try {
      const res = await fetch("/api/v1/resort-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "test_connection",
          pmsProvider: conn.pmsProvider,
          endpoint: conn.apiEndpoint
        })
      });
      const data = await res.json();
      setTestResult({ id: conn.id, ...data });
      setTimeout(() => setTestResult(null), 5000);
    } catch (e) {
      console.error(e);
    } finally {
      setTestingConnId(null);
    }
  };

  // Submit Live Booking Request via API
  const handleSendBookingRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingBooking(true);
    setBookingResponseAlert(null);

    const resortObj = resorts.find(r => r.code === reqResortCode);
    const d1 = new Date(reqCheckIn);
    const d2 = new Date(reqCheckOut);
    const diffDays = Math.max(1, Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)));

    const payload = {
      action: "send_booking",
      bookingRequest: {
        resortCode: reqResortCode,
        resortName: resortObj ? resortObj.name : "Villa Stay",
        guestName: reqGuestName,
        guestPhone: reqGuestPhone,
        checkIn: reqCheckIn,
        checkOut: reqCheckOut,
        nights: diffDays,
        roomsCount: reqRoomsCount,
        roomType: reqRoomType,
        mealPlan: reqMealPlan,
        specialRequests: reqSpecialNotes
      }
    };

    try {
      const res = await fetch("/api/v1/resort-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setBookingResponseAlert(data);
        loadData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  // Save / Update Connection
  const handleSaveConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    const resortObj = resorts.find(r => r.code === connResortCode);
    const newConn: ResortApiConnection = {
      id: editingConn ? editingConn.id : `conn-${Date.now()}`,
      resortCode: connResortCode,
      resortName: resortObj ? resortObj.name : "Resort Stay",
      pmsProvider: connProvider,
      apiEndpoint: connEndpoint,
      apiKey: connApiKey,
      syncFrequencyMinutes: Number(connSyncFreq),
      status: "Connected",
      lastSyncAt: new Date().toISOString(),
      lastLatencyMs: Math.floor(35 + Math.random() * 40),
      autoConfirmRequests: connAutoConfirm,
      notes: `PMS connection for ${connResortCode} via ${connProvider}.`
    };

    const res = await fetch("/api/v1/resort-sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "save_connection", connection: newConn })
    });

    if (res.ok) {
      setIsConnModalOpen(false);
      setEditingConn(null);
      loadData();
    }
  };

  const filteredAvailability = availability.filter(a =>
    selectedResortFilter === "ALL" || a.resortCode.toLowerCase() === selectedResortFilter.toLowerCase()
  );

  return (
    <div className="flex min-h-screen bg-[#F5F6F8]">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                Live 2-Way API Channel
              </span>
              <span className="text-[10px] font-mono text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                PMS Sync Active
              </span>
            </div>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight mt-1">
              Resort PMS &amp; Live Booking Sync
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Connect directly via API to resort booking management apps to view real-time room availability, live rates, and dispatch instant booking requests.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefreshAvailability}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-800 bg-white hover:bg-stone-50 border border-stone-300 px-4 py-2.5 rounded-xl transition shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-700 ${isSyncing ? "animate-spin" : ""}`} />
              {isSyncing ? "Syncing Live Updates..." : "Sync Live Updates"}
            </button>

            <button
              onClick={() => setActiveTab("booking")}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#2E4F28] hover:bg-[#233D1F] px-4 py-2.5 rounded-xl transition shadow-sm"
            >
              <Send className="w-3.5 h-3.5" /> Dispatch Booking Request
            </button>
          </div>
        </div>

        {/* Sync Success Alert */}
        {syncMessage && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-2 text-xs font-bold animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{syncMessage}</span>
          </div>
        )}

        {/* Tab Selector */}
        <div className="mt-6 flex items-center gap-2 border-b border-stone-200 pb-3 text-xs font-bold">
          <button
            onClick={() => setActiveTab("availability")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition ${
              activeTab === "availability"
                ? "bg-[#2E4F28] text-white shadow-sm"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" /> Live Room Availability Grid ({filteredAvailability.length})
          </button>

          <button
            onClick={() => setActiveTab("booking")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition ${
              activeTab === "booking"
                ? "bg-[#2E4F28] text-white shadow-sm"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            <Send className="w-3.5 h-3.5" /> Dispatch Booking Request
          </button>

          <button
            onClick={() => setActiveTab("connections")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition ${
              activeTab === "connections"
                ? "bg-[#2E4F28] text-white shadow-sm"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            <Network className="w-3.5 h-3.5" /> Resort API Connections ({connections.length})
          </button>

          <button
            onClick={() => setActiveTab("logs")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition ${
              activeTab === "logs"
                ? "bg-[#2E4F28] text-white shadow-sm"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            <Activity className="w-3.5 h-3.5" /> Live Sync Logs ({syncLogs.length})
          </button>
        </div>

        {/* ================= TAB 1: LIVE ROOM AVAILABILITY GRID ================= */}
        {activeTab === "availability" && (
          <div className="mt-6 space-y-4">
            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-500 font-bold uppercase tracking-wider">
                  Filter Resort:
                </span>
                <div className="flex gap-1.5 flex-wrap">
                  <button
                    onClick={() => setSelectedResortFilter("ALL")}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${
                      selectedResortFilter === "ALL"
                        ? "bg-stone-900 text-white"
                        : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                    }`}
                  >
                    All Resorts
                  </button>
                  {connections.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedResortFilter(c.resortCode)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition font-mono ${
                        selectedResortFilter === c.resortCode
                          ? "bg-[#2E4F28] text-white"
                          : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                      }`}
                    >
                      {c.resortCode}
                    </button>
                  ))}
                </div>
              </div>

              <span className="text-xs text-stone-500">
                14-Day Live Room Window • Updates every 5 minutes
              </span>
            </div>

            {/* Availability Table */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-wider border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4">Resort &amp; Property</th>
                    <th className="py-3 px-4">Date &amp; Day</th>
                    <th className="py-3 px-4 text-center">Available / Total</th>
                    <th className="py-3 px-4 text-center">Inventory Status</th>
                    <th className="py-3 px-4 text-right">Live PMS Tariff</th>
                    <th className="py-3 px-4 text-right">B2B Aston Rate</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredAvailability.map((item, idx) => {
                    const dateObj = new Date(item.date);
                    const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });
                    return (
                      <tr key={idx} className="hover:bg-stone-50/50 transition">
                        <td className="py-3.5 px-4 font-bold text-stone-900">
                          <span className="font-mono bg-stone-100 text-stone-800 px-2 py-0.5 rounded text-[11px] mr-2">
                            {item.resortCode}
                          </span>
                          {item.resortName}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-stone-800">{item.date}</span>
                          <span className="text-[10px] text-stone-400 block font-normal">{dayName}</span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold">
                          <span className="text-stone-900">{item.availableRooms}</span>
                          <span className="text-stone-400 text-[10px] font-normal"> / {item.totalRooms} rooms</span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                              item.status === "Available"
                                ? "bg-emerald-100 text-emerald-800"
                                : item.status === "Fast Filling"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-stone-900">
                          ₹{item.liveTariff.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3.5 px-4 text-right font-semibold text-emerald-800">
                          ₹{item.b2bRate.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              setReqResortCode(item.resortCode);
                              setReqCheckIn(item.date);
                              const nextDay = new Date(item.date);
                              nextDay.setDate(nextDay.getDate() + 2);
                              setReqCheckOut(nextDay.toISOString().split("T")[0]);
                              setActiveTab("booking");
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-[#2E4F28] hover:bg-[#233D1F] px-2.5 py-1 rounded-lg transition"
                          >
                            <Send className="w-3 h-3" /> Book API
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 2: DISPATCH BOOKING REQUEST VIA API ================= */}
        {activeTab === "booking" && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Booking Form */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <div>
                  <h2 className="text-lg font-bold text-stone-900">
                    Send Live Booking Request to Resort PMS
                  </h2>
                  <p className="text-xs text-stone-500">
                    Directly transmits reservation payload via REST / Webhook to resort booking manager.
                  </p>
                </div>
                <span className="font-mono text-xs bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg font-bold">
                  API Connected
                </span>
              </div>

              {bookingResponseAlert && (
                <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-950 space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1.5 text-emerald-900">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      Booking Request Confirmed by Resort PMS!
                    </span>
                    <span className="font-mono bg-white px-2 py-0.5 rounded border border-emerald-300 font-bold">
                      PNR: {bookingResponseAlert.request.pmsConfirmationNumber}
                    </span>
                  </div>
                  <p className="text-emerald-800">
                    Resort <span className="font-bold">[{bookingResponseAlert.request.resortCode}]</span> accepted reservation for{" "}
                    <span className="font-bold">{bookingResponseAlert.request.guestName}</span>. API latency: {bookingResponseAlert.latencyMs}ms.
                  </p>
                </div>
              )}

              <form onSubmit={handleSendBookingRequest} className="mt-6 space-y-4 text-xs font-medium">
                <div>
                  <label className="block text-stone-700 mb-1">Target Resort &amp; PMS Endpoint *</label>
                  <select
                    value={reqResortCode}
                    onChange={(e) => {
                      setReqResortCode(e.target.value);
                      const resObj = resorts.find(r => r.code === e.target.value);
                      if (resObj) setReqRoomType(resObj.name);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white font-semibold"
                  >
                    {connections.map((c) => (
                      <option key={c.id} value={c.resortCode}>
                        [{c.resortCode}] {c.resortName} — PMS: {c.pmsProvider}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-700 mb-1">Guest Full Name *</label>
                    <input
                      type="text"
                      required
                      value={reqGuestName}
                      onChange={(e) => setReqGuestName(e.target.value)}
                      placeholder="e.g. Dr. Siddharth & Ananya"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 mb-1">Guest Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={reqGuestPhone}
                      onChange={(e) => setReqGuestPhone(e.target.value)}
                      placeholder="+91 98471 00000"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-stone-700 mb-1">Check-In Date *</label>
                    <input
                      type="date"
                      required
                      value={reqCheckIn}
                      onChange={(e) => setReqCheckIn(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 mb-1">Check-Out Date *</label>
                    <input
                      type="date"
                      required
                      value={reqCheckOut}
                      onChange={(e) => setReqCheckOut(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 mb-1">Rooms Count</label>
                    <input
                      type="number"
                      min={1}
                      value={reqRoomsCount}
                      onChange={(e) => setReqRoomsCount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-700 mb-1">Room Category / Villa Type</label>
                    <input
                      type="text"
                      value={reqRoomType}
                      onChange={(e) => setReqRoomType(e.target.value)}
                      placeholder="e.g. Luxury Private Pool Villa"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 mb-1">Meal Plan</label>
                    <select
                      value={reqMealPlan}
                      onChange={(e) => setReqMealPlan(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                    >
                      <option value="EP (Room Only)">EP (Room Only)</option>
                      <option value="CP (Bed & Breakfast)">CP (Bed & Breakfast)</option>
                      <option value="MAP (Breakfast & Dinner)">MAP (Breakfast & Dinner)</option>
                      <option value="AP (All Meals)">AP (All Meals)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 mb-1">Special Requests &amp; Notes</label>
                  <textarea
                    rows={2}
                    value={reqSpecialNotes}
                    onChange={(e) => setReqSpecialNotes(e.target.value)}
                    placeholder="e.g. Candlelight dinner setup, honeymoon bed decor, early check-in at 11 AM..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-200"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={isSubmittingBooking}
                    className="inline-flex items-center gap-2 text-xs font-bold text-white bg-[#2E4F28] hover:bg-[#233D1F] px-6 py-2.5 rounded-xl transition shadow"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {isSubmittingBooking ? "Transmitting to PMS..." : "Dispatch Live Booking Request"}
                  </button>
                </div>
              </form>
            </div>

            {/* Recent Booking Requests Side Feed */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Recent Dispatched Requests ({bookingRequests.length})
              </h3>
              <div className="space-y-3">
                {bookingRequests.map((req) => (
                  <div key={req.id} className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded text-[11px]">
                        {req.resortCode}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {req.status}
                      </span>
                    </div>

                    <p className="font-bold text-stone-900">{req.guestName}</p>
                    <p className="text-[11px] text-stone-500">
                      {req.checkIn} to {req.checkOut} ({req.nights}N) • {req.roomsCount} Room
                    </p>

                    {req.pmsConfirmationNumber && (
                      <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 font-mono flex items-center justify-between">
                        <span>PMS PNR:</span>
                        <span className="font-bold">{req.pmsConfirmationNumber}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: RESORT API CONNECTIONS ================= */}
        {activeTab === "connections" && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-stone-500">
                Configure real-time API keys and Webhook endpoints for resort Property Management Systems.
              </p>
              <button
                onClick={() => {
                  setEditingConn(null);
                  setIsConnModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#2E4F28] hover:bg-[#233D1F] px-4 py-2 rounded-xl transition shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" /> Connect New Resort PMS
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {connections.map((c) => (
                <div key={c.id} className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-3 text-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                          {c.resortCode}
                        </span>
                        <span className="text-xs font-bold text-stone-800">{c.resortName}</span>
                      </div>
                      <span className="text-[11px] text-emerald-800 font-semibold block mt-1">
                        PMS: {c.pmsProvider}
                      </span>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      {c.status} ({c.lastLatencyMs || 45}ms)
                    </span>
                  </div>

                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 font-mono text-[11px] space-y-1 text-stone-600">
                    <p className="truncate"><span className="text-stone-400">Endpoint:</span> {c.apiEndpoint}</p>
                    <p><span className="text-stone-400">API Key:</span> {c.apiKey.slice(0, 10)}••••••••</p>
                    <p><span className="text-stone-400">Sync:</span> Every {c.syncFrequencyMinutes} mins</p>
                  </div>

                  {c.notes && (
                    <p className="text-[11px] text-stone-500 italic">
                      {c.notes}
                    </p>
                  )}

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[10px] text-stone-400">
                      Last sync: {new Date(c.lastSyncAt || Date.now()).toLocaleTimeString()}
                    </span>

                    <button
                      onClick={() => handleTestConnection(c)}
                      disabled={testingConnId === c.id}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition"
                    >
                      <Activity className="w-3 h-3" />
                      {testingConnId === c.id ? "Probing..." : "Test Health"}
                    </button>
                  </div>

                  {testResult && testResult.id === c.id && (
                    <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 font-semibold animate-fadeIn">
                      {testResult.message} (Latency: {testResult.latencyMs}ms)
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 4: LIVE SYNC LOGS ================= */}
        {activeTab === "logs" && (
          <div className="mt-6 bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Resort</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Latency</th>
                  <th className="py-3 px-4">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {syncLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-stone-50/50">
                    <td className="py-3 px-4 font-mono text-[11px] text-stone-500">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-stone-900">
                      {log.resortCode}
                    </td>
                    <td className="py-3 px-4 font-semibold text-stone-800">
                      {log.action}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-stone-600">
                      {log.latencyMs}ms
                    </td>
                    <td className="py-3 px-4 text-stone-700">
                      {log.message}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ================= MODAL: ADD / EDIT CONNECTION ================= */}
        {isConnModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <h3 className="text-base font-bold text-stone-900">
                  Configure Resort PMS API Connection
                </h3>
                <button onClick={() => setIsConnModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveConnection} className="mt-4 space-y-3 text-xs font-medium">
                <div>
                  <label className="block text-stone-700 mb-1">Resort Code *</label>
                  <select
                    value={connResortCode}
                    onChange={(e) => setConnResortCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white font-semibold"
                  >
                    {resorts.map((r) => (
                      <option key={r.code} value={r.code}>
                        [{r.code}] {r.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 mb-1">PMS Provider System</label>
                  <select
                    value={connProvider}
                    onChange={(e: any) => setConnProvider(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                  >
                    <option value="Stayflexi">Stayflexi PMS</option>
                    <option value="eZee Absolute">eZee Absolute Channel Manager</option>
                    <option value="Custom REST API">Custom REST API</option>
                    <option value="Direct Webhook">Direct Webhook</option>
                    <option value="Cloudbeds">Cloudbeds</option>
                    <option value="Hotelogix">Hotelogix</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 mb-1">API Base URL / Endpoint *</label>
                  <input
                    type="url"
                    required
                    value={connEndpoint}
                    onChange={(e) => setConnEndpoint(e.target.value)}
                    placeholder="https://api.pms.com/v1"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 mb-1">API Secret / Bearer Token *</label>
                  <input
                    type="password"
                    required
                    value={connApiKey}
                    onChange={(e) => setConnApiKey(e.target.value)}
                    placeholder="sk_live_••••••••"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 font-mono text-[11px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 mb-1">Sync Frequency (Minutes)</label>
                    <input
                      type="number"
                      min={1}
                      value={connSyncFreq}
                      onChange={(e) => setConnSyncFreq(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 mb-1">Auto-Confirm Booking</label>
                    <select
                      value={connAutoConfirm ? "yes" : "no"}
                      onChange={(e) => setConnAutoConfirm(e.target.value === "yes")}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                    >
                      <option value="yes">Yes (Instant PNR)</option>
                      <option value="no">No (Manual Review)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setIsConnModalOpen(false)}
                    className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#2E4F28] hover:bg-[#233D1F] text-white font-bold rounded-xl shadow"
                  >
                    Save Connection
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

export default function ResortSyncPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm">Loading Resort PMS Sync Hub...</div>}>
      <ResortSyncContent />
    </Suspense>
  );
}
