"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import InvoiceTemplate from "@/components/InvoiceTemplate";
import { Invoice, Resort } from "@/lib/types";
import { Plus, Search, ReceiptText, Printer, MessageCircle, X, Trash2, Eye, ShieldCheck, RotateCcw } from "lucide-react";

const DRAFT_STORAGE_KEY = "aston_wip_invoice_draft_v1";
const LOCAL_INVOICES_BACKUP_KEY = "aston_persistent_invoices_v1";

function InvoicesContent() {
  const searchParams = useSearchParams();
  const activeId = searchParams.get("id");

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [recoveredDraft, setRecoveredDraft] = useState<any | null>(null);

  // New Invoice Form State
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [type, setType] = useState<Invoice["type"]>("Tax Invoice");
  const [selectedResortCode, setSelectedResortCode] = useState("AH-121");
  const [checkIn, setCheckIn] = useState("2026-11-10");
  const [checkOut, setCheckOut] = useState("2026-11-12");
  const [nights, setNights] = useState(2);
  const [adults, setAdults] = useState(4);
  const [children, setChildren] = useState(1);
  const [nightRate, setNightRate] = useState(14500);
  const [extraItemDesc, setExtraItemDesc] = useState("Campfire & Music Setup");
  const [extraItemRate, setExtraItemRate] = useState(1500);
  const [gstRate, setGstRate] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [advancePaid, setAdvancePaid] = useState(5000);
  const [status, setStatus] = useState<Invoice["status"]>("Advance Received");

  // Check for recovered draft on mount
  useEffect(() => {
    try {
      const savedDraftStr = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (savedDraftStr) {
        const draft = JSON.parse(savedDraftStr);
        if (draft && (draft.customerName || draft.customerPhone)) {
          setRecoveredDraft(draft);
        }
      }
    } catch (e) {
      console.warn("Could not load invoice draft:", e);
    }
  }, []);

  // Exit guard: warn user if navigating away with invoice modal open
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isModalOpen) {
        e.preventDefault();
        e.returnValue = "You have an unsaved invoice in progress. All changes are saved as a local draft, but please confirm if you wish to close.";
        return e.returnValue;
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isModalOpen]);

  // Real-time auto-save whenever invoice modal is open
  useEffect(() => {
    if (!isModalOpen) return;
    const now = new Date().toISOString();
    const draftPayload = {
      customerName,
      customerPhone,
      customerEmail,
      customerAddress,
      type,
      selectedResortCode,
      checkIn,
      checkOut,
      nights,
      adults,
      children,
      nightRate,
      extraItemDesc,
      extraItemRate,
      gstRate,
      discount,
      advancePaid,
      status,
      savedAt: now
    };
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftPayload));
    } catch (e) {
      console.warn("Could not auto-save invoice draft:", e);
    }
  }, [
    isModalOpen,
    customerName,
    customerPhone,
    customerEmail,
    customerAddress,
    type,
    selectedResortCode,
    checkIn,
    checkOut,
    nights,
    adults,
    children,
    nightRate,
    extraItemDesc,
    extraItemRate,
    gstRate,
    discount,
    advancePaid,
    status
  ]);

  const applyRecoveredDraft = () => {
    if (!recoveredDraft) return;
    setCustomerName(recoveredDraft.customerName || "");
    setCustomerPhone(recoveredDraft.customerPhone || "");
    setCustomerEmail(recoveredDraft.customerEmail || "");
    setCustomerAddress(recoveredDraft.customerAddress || "");
    setType(recoveredDraft.type || "Tax Invoice");
    setSelectedResortCode(recoveredDraft.selectedResortCode || "AH-121");
    setCheckIn(recoveredDraft.checkIn || "2026-11-10");
    setCheckOut(recoveredDraft.checkOut || "2026-11-12");
    setNights(recoveredDraft.nights ?? 2);
    setAdults(recoveredDraft.adults ?? 4);
    setChildren(recoveredDraft.children ?? 1);
    setNightRate(recoveredDraft.nightRate ?? 14500);
    setExtraItemDesc(recoveredDraft.extraItemDesc || "Campfire & Music Setup");
    setExtraItemRate(recoveredDraft.extraItemRate ?? 1500);
    setGstRate(recoveredDraft.gstRate ?? 12);
    setDiscount(recoveredDraft.discount ?? 0);
    setAdvancePaid(recoveredDraft.advancePaid ?? 5000);
    setStatus(recoveredDraft.status || "Advance Received");
    setIsModalOpen(true);
    setRecoveredDraft(null);
  };

  const discardRecoveredDraft = () => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {}
    setRecoveredDraft(null);
  };

  const loadData = async () => {
    try {
      let localSaved: Invoice[] = [];
      try {
        const localStr = localStorage.getItem(LOCAL_INVOICES_BACKUP_KEY);
        if (localStr) localSaved = JSON.parse(localStr);
      } catch {}

      const [invRes, resRes] = await Promise.all([
        fetch("/api/v1/invoices"),
        fetch("/api/v1/resorts")
      ]);

      let serverInvoices: Invoice[] = [];
      if (invRes.ok) {
        serverInvoices = await invRes.json();
      }

      // Merge: Any invoice saved locally that is missing on server is preserved
      const mergedMap = new Map<string, Invoice>();
      serverInvoices.forEach(i => mergedMap.set(i.id, i));
      const missingOnServer: Invoice[] = [];
      localSaved.forEach(i => {
        if (!mergedMap.has(i.id)) {
          mergedMap.set(i.id, i);
          missingOnServer.push(i);
        }
      });

      const mergedList = Array.from(mergedMap.values());
      setInvoices(mergedList);

      try {
        localStorage.setItem(LOCAL_INVOICES_BACKUP_KEY, JSON.stringify(mergedList));
      } catch {}

      if (missingOnServer.length > 0) {
        console.log(`[Zero-Data-Loss] Syncing ${missingOnServer.length} local invoices to server...`);
        missingOnServer.forEach(i => {
          fetch("/api/v1/invoices", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(i)
          }).catch(err => console.warn("Background sync error:", err));
        });
      }

      if (activeId) {
        const found = mergedList.find((i: Invoice) => i.id === activeId || i.invoiceNumber === activeId);
        if (found) setSelectedInvoice(found);
      }

      if (resRes.ok) {
        const resData = await resRes.json();
        setResorts(resData);
      }
    } catch (e) {
      console.error("Error loading invoices:", e);
      try {
        const localStr = localStorage.getItem(LOCAL_INVOICES_BACKUP_KEY);
        if (localStr) setInvoices(JSON.parse(localStr));
      } catch {}
    }
  };

  useEffect(() => {
    loadData();
  }, [activeId]);

  // Update night rate when resort selection changes
  const handleResortChange = (code: string) => {
    setSelectedResortCode(code);
    const r = resorts.find(res => res.code === code);
    if (r) {
      setNightRate(r.pricePerNight);
    }
  };

  // Calculations for new invoice
  const staySubtotal = nights * nightRate;
  const extraSubtotal = extraItemRate > 0 ? extraItemRate : 0;
  const subtotal = staySubtotal + extraSubtotal;
  const taxableAmount = Math.max(0, subtotal - discount);
  const gstAmount = Math.round((taxableAmount * gstRate) / 100);
  const totalAmount = taxableAmount + gstAmount;
  const balanceDue = Math.max(0, totalAmount - advancePaid);

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    const resort = resorts.find(r => r.code === selectedResortCode);

    const newInvoice: Partial<Invoice> = {
      type,
      customerName,
      customerPhone,
      customerEmail: customerEmail || undefined,
      customerAddress: customerAddress || undefined,
      resortCode: selectedResortCode,
      resortName: resort ? resort.name : "Villa Stay",
      destination: resort ? `${resort.destination}, Wayanad` : "Wayanad",
      checkIn,
      checkOut,
      nights,
      guests: { adults, children },
      items: [
        {
          id: "item-1",
          description: `[${selectedResortCode}] ${resort?.name || "Stay"} (${nights} Night${nights > 1 ? "s" : ""})`,
          nights,
          ratePerNight: nightRate,
          amount: staySubtotal
        },
        ...(extraItemRate > 0
          ? [{
              id: "item-2",
              description: extraItemDesc,
              nights: 1,
              ratePerNight: extraItemRate,
              amount: extraItemRate
            }]
          : [])
      ],
      subtotal,
      gstRate,
      gstAmount,
      discount,
      totalAmount,
      advancePaid,
      balanceDue,
      status,
      issueDate: new Date().toISOString().split("T")[0],
      dueDate: checkIn,
      bankDetails: (() => {
        if (typeof window !== "undefined") {
          try {
            const saved = localStorage.getItem("aston_default_bank_details");
            if (saved) return JSON.parse(saved);
          } catch {}
        }
        return {
          accountName: "Aston Holidays",
          bankName: "State Bank of India",
          accountNumber: "40921008745",
          ifscCode: "SBIN0008451",
          upiId: "astonholidays@sbi"
        };
      })(),
      notes: `Advance payment of Rs ${advancePaid.toLocaleString("en-IN")} received. Balance of Rs ${balanceDue.toLocaleString("en-IN")} due on check-in arrival.`
    };

    const res = await fetch("/api/v1/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newInvoice)
    });

    if (res.ok) {
      const created = await res.json();
      const nextList = [created, ...invoices];
      setInvoices(nextList);
      try {
        localStorage.setItem(LOCAL_INVOICES_BACKUP_KEY, JSON.stringify(nextList));
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      } catch {}
      setRecoveredDraft(null);
      setSelectedInvoice(created);
      setIsModalOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this invoice?")) return;
    await fetch(`/api/v1/invoices?id=${id}`, { method: "DELETE" });
    const nextList = invoices.filter(i => i.id !== id);
    setInvoices(nextList);
    try {
      localStorage.setItem(LOCAL_INVOICES_BACKUP_KEY, JSON.stringify(nextList));
    } catch {}
    if (selectedInvoice?.id === id) setSelectedInvoice(null);
  };

  const handleUpdateStatus = async (newStatus: Invoice["status"]) => {
    if (!selectedInvoice) return;
    const updated = { ...selectedInvoice, status: newStatus };
    if (newStatus === "Fully Paid") {
      updated.advancePaid = updated.totalAmount;
      updated.balanceDue = 0;
    }
    await fetch("/api/v1/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated)
    });
    setSelectedInvoice(updated);
    const nextList = invoices.map(i => i.id === updated.id ? updated : i);
    setInvoices(nextList);
    try {
      localStorage.setItem(LOCAL_INVOICES_BACKUP_KEY, JSON.stringify(nextList));
    } catch {}
  };

  const handleShareWhatsApp = (inv: Invoice) => {
    let msg = `🌟 *ASTON HOLIDAYS - INVOICE & CONFIRMATION* 🌟\n\n`;
    msg += `Dear *${inv.customerName}*,\n`;
    msg += `Here is your booking invoice for Wayanad!\n\n`;
    msg += `📄 *Invoice #:* ${inv.invoiceNumber}\n`;
    msg += `🏨 *Resort:* [${inv.resortCode}] ${inv.resortName}\n`;
    msg += `📅 *Stay Dates:* ${inv.checkIn} to ${inv.checkOut} (${inv.nights} Nights)\n`;
    msg += `\n💰 *Total Amount:* ₹${inv.totalAmount.toLocaleString("en-IN")}\n`;
    msg += `💰 *Advance Paid:* ₹${inv.advancePaid.toLocaleString("en-IN")}\n`;
    msg += `💰 *Balance Due:* ₹${inv.balanceDue.toLocaleString("en-IN")}\n\n`;
    msg += `📞 Need any assistance? Call desk: +91 97449 00414\n`;
    msg += `🌿 *Aston Holidays - Curated Wayanad Escapes*`;

    const cleanPhone = inv.customerPhone.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  // If viewing single invoice template
  if (selectedInvoice) {
    return (
      <div className="relative">
        <InvoiceTemplate
          invoice={selectedInvoice}
          onUpdateStatus={handleUpdateStatus}
        />
        <div className="no-print fixed bottom-6 right-6">
          <button
            onClick={() => setSelectedInvoice(null)}
            className="bg-stone-900 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-lg hover:bg-black transition"
          >
            ← Back to All Invoices
          </button>
        </div>
      </div>
    );
  }

  const filteredInvoices = invoices.filter(inv =>
    inv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.resortCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F5F6F8]">
      <AdminSidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto w-full">
        {/* Unsaved Invoice Draft Banner */}
        {recoveredDraft && !isModalOpen && (
          <div className="mb-6 bg-gradient-to-r from-[#1A2E1A] to-[#253923] text-white p-4 sm:p-5 rounded-2xl shadow-xl border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top duration-300">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-black tracking-wider text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                    Draft Preserved
                  </span>
                  <span className="text-xs text-stone-300">
                    {recoveredDraft.savedAt ? `Auto-saved at ${new Date(recoveredDraft.savedAt).toLocaleTimeString()}` : "Protected from data loss"}
                  </span>
                </div>
                <p className="text-sm font-bold text-white mt-1">
                  Unsaved Invoice: <span className="text-emerald-300">{recoveredDraft.customerName ? `${recoveredDraft.customerName} • ` : ""}{recoveredDraft.type || "Invoice"} ({recoveredDraft.selectedResortCode})</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <button
                type="button"
                onClick={discardRecoveredDraft}
                className="px-3 py-1.5 text-xs font-semibold text-stone-300 hover:text-white hover:bg-white/10 rounded-lg transition"
              >
                Discard Draft
              </button>
              <button
                type="button"
                onClick={applyRecoveredDraft}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-stone-900 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition shadow active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Resume Editing & Save
              </button>
            </div>
          </div>
        )}

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
          <div>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">
              Invoices, Proformas & Stay Vouchers
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Create GST-compliant invoices and vouchers with Aston Holidays branding, instant PDF download, and WhatsApp share.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#2E4F28] hover:bg-[#233D1F] px-4 py-2.5 rounded-xl transition shadow-sm"
          >
            <Plus className="w-4 h-4" /> Create New Invoice
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer name, invoice #, or resort code..."
              className="w-full text-xs font-medium pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 bg-white"
            />
          </div>
          <span className="text-xs text-stone-500 font-medium">
            Showing {filteredInvoices.length} invoices
          </span>
        </div>

        {/* ================= MOBILE CARD VIEW (< md) ================= */}
        <div className="md:hidden space-y-3 mt-5">
          {filteredInvoices.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-xs text-stone-500">
              No invoices found matching your search.
            </div>
          ) : (
            filteredInvoices.map((inv) => (
              <div
                key={inv.id}
                className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-sm space-y-3 transition hover:shadow-md"
              >
                {/* Header: Invoice # + Status */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black bg-stone-100 text-stone-900 px-2 py-0.5 rounded-md">
                      {inv.invoiceNumber}
                    </span>
                    <span className="text-[11px] text-stone-500 font-medium">
                      {inv.type}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      inv.status === "Fully Paid"
                        ? "bg-emerald-100 text-emerald-800"
                        : inv.status === "Advance Received"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-stone-100 text-stone-700"
                    }`}
                  >
                    {inv.status}
                  </span>
                </div>

                {/* Guest & Resort Info */}
                <div>
                  <h4 className="text-sm font-bold text-stone-900 leading-snug">
                    {inv.customerName}
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5 font-mono">
                    {inv.customerPhone}
                  </p>
                  <p className="text-xs text-stone-700 font-semibold mt-1 flex items-center gap-1.5">
                    <span className="text-emerald-800 font-mono">[{inv.resortCode}]</span>
                    <span>{inv.resortName}</span>
                  </p>
                  <p className="text-[11px] text-stone-500">
                    {inv.checkIn} to {inv.checkOut} ({inv.nights} Nights)
                  </p>
                </div>

                {/* Financials Strip */}
                <div className="bg-stone-50 rounded-xl p-3 grid grid-cols-3 gap-2 text-xs border border-stone-100 text-center">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Total</span>
                    <span className="font-bold text-stone-900">₹{inv.totalAmount.toLocaleString("en-IN")}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Advance</span>
                    <span className="font-bold text-emerald-700">₹{inv.advancePaid.toLocaleString("en-IN")}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Balance</span>
                    <span className="font-bold text-amber-700">₹{inv.balanceDue.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-stone-100 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedInvoice(inv)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#2E4F28] hover:bg-[#233D1F] text-white text-xs font-bold py-2.5 px-3 rounded-xl shadow-sm transition active:scale-95"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View / PDF</span>
                  </button>
                  <button
                    onClick={() => handleShareWhatsApp(inv)}
                    className="inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-3.5 rounded-xl shadow-sm transition active:scale-95"
                    title="Share to WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    onClick={() => handleDelete(inv.id)}
                    className="p-2.5 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 transition"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ================= DESKTOP & TABLET TABLE (hidden md:block) ================= */}
        <div className="hidden md:block mt-6 bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-3.5 px-4">Invoice #</th>
                  <th className="py-3.5 px-4">Guest Name</th>
                  <th className="py-3.5 px-4">Resort & Dates</th>
                  <th className="py-3.5 px-4 text-right">Total Amount</th>
                  <th className="py-3.5 px-4 text-right">Advance Paid</th>
                  <th className="py-3.5 px-4 text-right">Balance Due</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-stone-50 transition">
                    <td className="py-4 px-4 font-mono font-bold text-stone-900">
                      {inv.invoiceNumber}
                      <span className="block text-[10px] font-normal text-stone-400">{inv.type}</span>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-bold text-stone-900">{inv.customerName}</p>
                      <p className="text-[11px] text-stone-500">{inv.customerPhone}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-semibold text-stone-800">[{inv.resortCode}] {inv.resortName}</p>
                      <p className="text-[11px] text-stone-500">{inv.checkIn} to {inv.checkOut} ({inv.nights}n)</p>
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-stone-900">
                      ₹{inv.totalAmount.toLocaleString("en-IN")}
                    </td>
                    <td className="py-4 px-4 text-right text-emerald-700 font-semibold">
                      ₹{inv.advancePaid.toLocaleString("en-IN")}
                    </td>
                    <td className="py-4 px-4 text-right text-amber-700 font-bold">
                      ₹{inv.balanceDue.toLocaleString("en-IN")}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        inv.status === "Fully Paid" ? "bg-emerald-100 text-emerald-800" :
                        inv.status === "Advance Received" ? "bg-amber-100 text-amber-800" :
                        "bg-stone-100 text-stone-700"
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleShareWhatsApp(inv)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-2.5 py-1.5 rounded-lg transition shadow-sm active:scale-95"
                          title="Share to WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </button>
                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg transition active:scale-95"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View / PDF</span>
                        </button>
                        <button
                          onClick={() => handleDelete(inv.id)}
                          className="text-stone-400 hover:text-red-600 p-1.5 transition rounded-lg hover:bg-red-50"
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
        </div>

        {/* CREATE INVOICE MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-stone-200 my-8">
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-xl font-bold text-stone-900">Create New Invoice / Stay Voucher</h2>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Auto-Saved Draft
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">Generates proforma, tax invoice, or confirmation voucher</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateInvoice} className="space-y-4 mt-6 text-xs font-medium">
                {/* Document Type */}
                <div className="grid grid-cols-3 gap-3">
                  {(["Tax Invoice", "Proforma Invoice", "Stay Voucher"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition ${
                        type === t ? "bg-[#2E4F28] text-white border-[#2E4F28]" : "bg-stone-50 text-stone-700 border-stone-200"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                {/* Guest Details */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-stone-700 mb-1">Customer Full Name *</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Anand Kumar"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 mb-1">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+91 98470 00000"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                    />
                  </div>
                </div>

                {/* Resort Selection */}
                <div>
                  <label className="block text-stone-700 mb-1">Select Resort / Villa *</label>
                  <select
                    value={selectedResortCode}
                    onChange={(e) => handleResortChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 bg-white"
                  >
                    {resorts.map((r) => (
                      <option key={r.code} value={r.code}>
                        [{r.code}] {r.name} - {r.destination} (₹{r.pricePerNight}/night)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dates & Nights */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-stone-700 mb-1">Check-In Date</label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 mb-1">Check-Out Date</label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 mb-1">Number of Nights</label>
                    <input
                      type="number"
                      min={1}
                      value={nights}
                      onChange={(e) => setNights(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200"
                    />
                  </div>
                </div>

                {/* Night Rate & Extras */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-700 mb-1">Rate Per Night (₹)</label>
                    <input
                      type="number"
                      value={nightRate}
                      onChange={(e) => setNightRate(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 mb-1">Extra Item (Campfire / BBQ / Bed)</label>
                    <input
                      type="number"
                      value={extraItemRate}
                      onChange={(e) => setExtraItemRate(Number(e.target.value))}
                      placeholder="₹ Amount"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200"
                    />
                  </div>
                </div>

                {/* GST, Discount & Advance Paid */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-stone-700 mb-1">GST Tax Rate</label>
                    <select
                      value={gstRate}
                      onChange={(e) => setGstRate(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                    >
                      <option value={0}>0% (Exempt)</option>
                      <option value={5}>5% GST</option>
                      <option value={12}>12% GST</option>
                      <option value={18}>18% GST</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-stone-700 mb-1">Discount (₹)</label>
                    <input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 mb-1">Advance Received (₹)</label>
                    <input
                      type="number"
                      value={advancePaid}
                      onChange={(e) => setAdvancePaid(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200"
                    />
                  </div>
                </div>

                {/* Calculation Preview Box */}
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Subtotal:</span>
                    <span className="font-semibold">₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">GST Amount ({gstRate}%):</span>
                    <span className="font-semibold">₹{gstAmount.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between font-bold text-stone-900 pt-1 border-t border-stone-200">
                    <span>Total Invoice Amount:</span>
                    <span>₹{totalAmount.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-amber-700 font-bold">
                    <span>Balance Due at Check-In:</span>
                    <span>₹{balanceDue.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-4 flex items-center justify-end gap-3">
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
                    Save & Generate PDF
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

export default function InvoicesPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm">Loading invoices...</div>}>
      <InvoicesContent />
    </Suspense>
  );
}
