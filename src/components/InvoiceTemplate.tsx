"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Printer, Share2, ArrowLeft, Check, Phone, Mail, Globe, MapPin, MessageCircle, Send, CheckCircle2, Navigation, Compass, Download, Loader2, CreditCard, Building2, QrCode, X } from "lucide-react";
import Link from "next/link";
import QRCode from "qrcode";
import { Invoice, BankDetails } from "@/lib/types";
import { printElementIsolated, downloadElementAsPdf } from "@/lib/printUtils";

interface InvoiceTemplateProps {
  invoice: Invoice;
  onUpdateStatus?: (newStatus: Invoice["status"]) => void;
}

export default function InvoiceTemplate({ invoice, onUpdateStatus }: InvoiceTemplateProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [dispatchedData, setDispatchedData] = useState<any>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  // Bank Details State with Dual-Vault Persistence
  const [bankDetails, setBankDetails] = useState<BankDetails>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("aston_default_bank_details");
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return invoice.bankDetails || {
      accountName: "Aston Holidays",
      bankName: "State Bank of India",
      accountNumber: "40921008745",
      ifscCode: "SBIN0008451",
      upiId: "astonholidays@sbi",
      qrCodeCustomUrl: ""
    };
  });
  const [isEditingBankDetails, setIsEditingBankDetails] = useState(false);
  const [bankForm, setBankForm] = useState<BankDetails>(bankDetails);

  // Sync bank details if saved in localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("aston_default_bank_details");
      if (saved) {
        const parsed = JSON.parse(saved);
        setBankDetails(parsed);
        setBankForm(parsed);
      }
    } catch {}
  }, []);

  // Strict Non-GST Calculations: No GST added
  const netAmount = Math.max(0, invoice.subtotal - (invoice.discount || 0));
  const cleanBalanceDue = Math.max(0, netAmount - (invoice.advancePaid || 0));

  useEffect(() => {
    if (bankDetails.qrCodeCustomUrl) {
      setQrCodeUrl(bankDetails.qrCodeCustomUrl);
      return;
    }
    // Generate UPI payment / invoice verification QR
    const upiString = `upi://pay?pa=${bankDetails.upiId || "astonholidays@sbi"}&pn=${encodeURIComponent(bankDetails.accountName || "Aston Holidays")}&am=${cleanBalanceDue}&cu=INR&tn=Invoice%20${invoice.invoiceNumber}`;
    QRCode.toDataURL(upiString, { width: 130, margin: 1 })
      .then(url => setQrCodeUrl(url))
      .catch(err => console.error(err));
  }, [invoice.invoiceNumber, cleanBalanceDue, bankDetails]);

  const handleSaveBankDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setBankDetails(bankForm);
    setIsEditingBankDetails(false);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("aston_default_bank_details", JSON.stringify(bankForm));
      } catch {}
    }
  };

  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    try {
      await downloadElementAsPdf("printable-standalone-invoice", `Invoice-${invoice.invoiceNumber}.pdf`);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handlePrint = () => {
    printElementIsolated("printable-standalone-invoice", `Invoice ${invoice.invoiceNumber} - Aston Holidays`);
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Automated Booking Confirmation & WhatsApp Dispatch Handler
  const handleConfirmAndSendWhatsApp = async () => {
    setIsConfirming(true);
    try {
      const res = await fetch("/api/v1/invoices/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId: invoice.id,
          paymentStatus: invoice.status === "Draft" ? "Advance Received" : invoice.status
        })
      });
      const data = await res.json();
      if (res.ok) {
        setDispatchedData(data);
        setConfirmModalOpen(true);
        if (onUpdateStatus) {
          onUpdateStatus(data.invoice.status);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 py-8 print:p-0 print:bg-white text-stone-900 font-sans">
      {/* Control Bar (Hidden when printing) */}
      <div className="no-print max-w-4xl mx-auto mb-6 px-4 flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl shadow-sm border border-stone-200">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/invoices"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 px-3 py-1.5 rounded-lg hover:bg-stone-100 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Invoices
          </Link>
          <span className="text-xs bg-stone-900 text-white font-mono px-2.5 py-1 rounded-md font-semibold">
            {invoice.invoiceNumber}
          </span>
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
            invoice.status === "Fully Paid" ? "bg-emerald-100 text-emerald-800" :
            invoice.status === "Advance Received" ? "bg-amber-100 text-amber-800" :
            "bg-stone-200 text-stone-800"
          }`}>
            {invoice.status}
          </span>
          {invoice.whatsappVoucherSent && (
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-200">
              <CheckCircle2 className="w-3 h-3" /> Voucher Dispatched on WhatsApp
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Main Booking Confirmation Trigger */}
          <button
            onClick={handleConfirmAndSendWhatsApp}
            disabled={isConfirming}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#2E4F28] hover:bg-[#233D1F] px-4 py-2 rounded-lg transition shadow-sm"
          >
            <Send className="w-3.5 h-3.5 text-emerald-300" />
            {isConfirming ? "Dispatching..." : "Confirm Booking & Send WhatsApp Voucher"}
          </button>

          {/* Update Payment Details & QR Button */}
          <button
            onClick={() => {
              setBankForm(bankDetails);
              setIsEditingBankDetails(true);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-3 py-2 rounded-lg transition shadow-sm"
          >
            <CreditCard className="w-3.5 h-3.5 text-amber-700" /> Update Account & QR
          </button>

          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 px-3 py-2 rounded-lg transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy Link"}
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isDownloadingPdf}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-75 px-3.5 py-2 rounded-lg transition shadow-sm active:scale-95"
          >
            {isDownloadingPdf ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving PDF...
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" /> Download PDF
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 px-3.5 py-2 rounded-lg transition shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" /> Print
          </button>
        </div>
      </div>

      {/* THE PRINTABLE INVOICE SHEET */}
      <div id="printable-standalone-invoice" className="max-w-[800px] mx-auto bg-white shadow-xl print:shadow-none p-10 print:p-8 rounded-xl print:rounded-none border border-stone-200 print:border-none">
        
        {/* Header Strip with Aston Holidays branding */}
        <div className="flex items-start justify-between pb-8 border-b-2 border-stone-900">
          <div>
            <div className="relative w-44 h-16 mb-2">
              <Image
                src="/brand/logo.png"
                alt="Aston Holidays"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
            <p className="text-xs font-bold text-stone-900 tracking-wide">
              ASTON HOLIDAYS
            </p>
            <p className="text-xs text-stone-600 mt-0.5">
              Kolagappara, Beenachi, Sulthan Bathery, Wayanad - 673592, Kerala
            </p>
            <p className="text-xs text-stone-600">
              Phone: +91 97449 00414 | info@astonholidays.com
            </p>
          </div>

          <div className="text-right">
            <span className="inline-block bg-[#2E4F28] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded">
              {invoice.type}
            </span>
            <h2 className="text-2xl font-bold font-mono text-stone-900 mt-2">
              {invoice.invoiceNumber}
            </h2>
            <div className="text-xs text-stone-600 mt-1 space-y-0.5">
              <p><span className="font-semibold text-stone-800">Issue Date:</span> {invoice.issueDate}</p>
              <p><span className="font-semibold text-stone-800">Due Date:</span> {invoice.dueDate}</p>
            </div>
          </div>
        </div>

        {/* Guest & Stay Details Grid */}
        <div className="grid grid-cols-2 gap-8 py-6 border-b border-stone-200">
          <div>
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
              Guest Information
            </h3>
            <p className="text-base font-bold text-stone-900">{invoice.customerName}</p>
            <p className="text-xs text-stone-700 mt-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-stone-400" /> {invoice.customerPhone}
            </p>
            {invoice.customerEmail && (
              <p className="text-xs text-stone-700 flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5 text-stone-400" /> {invoice.customerEmail}
              </p>
            )}
            {invoice.customerAddress && (
              <p className="text-xs text-stone-700 flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-stone-400" /> {invoice.customerAddress}
              </p>
            )}
          </div>

          <div className="bg-stone-50 p-4 rounded-lg border border-stone-200">
            <h3 className="text-xs font-bold text-[#2E4F28] uppercase tracking-wider mb-2">
              Booking Itinerary
            </h3>
            <p className="text-sm font-bold text-stone-900">
              [{invoice.resortCode}] {invoice.resortName}
            </p>
            <p className="text-xs text-stone-600">{invoice.destination}</p>
            <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs text-stone-700 pt-2 border-t border-stone-200">
              <div>
                <span className="text-stone-500 block">Check-In:</span>
                <span className="font-semibold">{invoice.checkIn} (01:00 PM)</span>
              </div>
              <div>
                <span className="text-stone-500 block">Check-Out:</span>
                <span className="font-semibold">{invoice.checkOut} (11:00 AM)</span>
              </div>
              <div>
                <span className="text-stone-500 block">Duration:</span>
                <span className="font-semibold">{invoice.nights} Night{invoice.nights > 1 ? "s" : ""}</span>
              </div>
              <div>
                <span className="text-stone-500 block">Occupancy:</span>
                <span className="font-semibold">{invoice.guests.adults} Adults, {invoice.guests.children} Children</span>
              </div>
            </div>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="py-6 border-b border-stone-200">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-300 text-stone-500 font-semibold uppercase tracking-wider">
                <th className="py-2.5">Item Description</th>
                <th className="py-2.5 text-center">Nights / Qty</th>
                <th className="py-2.5 text-right">Rate (₹)</th>
                <th className="py-2.5 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {invoice.items.map((item, idx) => (
                <tr key={idx} className="text-stone-800">
                  <td className="py-3 font-medium pr-4">{item.description}</td>
                  <td className="py-3 text-center">{item.nights}</td>
                  <td className="py-3 text-right">₹{item.ratePerNight.toLocaleString("en-IN")}</td>
                  <td className="py-3 text-right font-semibold">₹{item.amount.toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals & Calculations */}
        <div className="py-6 grid grid-cols-2 gap-8 border-b border-stone-200">
          {/* Payment QR and Bank Details */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Payment & Bank Details
              </h3>
              <button
                type="button"
                onClick={() => {
                  setBankForm(bankDetails);
                  setIsEditingBankDetails(true);
                }}
                className="no-print text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 underline flex items-center gap-1"
              >
                Edit Details
              </button>
            </div>
            <div className="flex gap-4 items-center bg-stone-50 p-3 rounded-lg border border-stone-200">
              {qrCodeUrl && (
                <div className="w-24 h-24 relative flex-shrink-0 bg-white p-1 rounded border border-stone-200">
                  <Image src={qrCodeUrl} alt="UPI QR" fill className="object-contain" />
                </div>
              )}
              <div className="text-[11px] text-stone-700 space-y-0.5">
                <p><span className="font-semibold">A/C Name:</span> {bankDetails.accountName || "Aston Holidays"}</p>
                <p><span className="font-semibold">Bank:</span> {bankDetails.bankName || "State Bank of India"}</p>
                <p><span className="font-semibold">A/C No:</span> {bankDetails.accountNumber || "40921008745"}</p>
                <p><span className="font-semibold">IFSC:</span> {bankDetails.ifscCode || "SBIN0008451"}</p>
                <p><span className="font-semibold">UPI ID:</span> {bankDetails.upiId || "astonholidays@sbi"}</p>
              </div>
            </div>
          </div>

          {/* Amount Calculation (Strict Non-GST) */}
          <div className="space-y-2 text-xs text-stone-700">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-semibold">₹{invoice.subtotal.toLocaleString("en-IN")}</span>
            </div>
            {invoice.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount / Special Offer:</span>
                <span className="font-semibold">- ₹{invoice.discount.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-300">
              <span>Total Amount:</span>
              <span>₹{netAmount.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-xs text-emerald-800 bg-emerald-50 p-2 rounded">
              <span>Advance Paid:</span>
              <span className="font-bold">₹{invoice.advancePaid.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-[#2E4F28] p-2 bg-stone-100 rounded">
              <span>Balance Due at Check-In:</span>
              <span>₹{cleanBalanceDue.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        {/* Terms, Cancellation & Authorized Signature */}
        <div className="pt-6 grid grid-cols-3 gap-6 text-[10px] text-stone-500">
          <div className="col-span-2 space-y-1">
            <h4 className="font-bold text-stone-700 text-[11px]">Terms & Conditions:</h4>
            <p>1. Check-in time is 01:00 PM and check-out time is 11:00 AM.</p>
            <p>2. Advance payment is non-refundable upon cancellation within 7 days of arrival.</p>
            <p>3. Government-approved Photo ID is required for all adult guests during check-in.</p>
            <p>4. For queries or assistance, contact our 24/7 helpdesk at +91 97449 00414.</p>
          </div>

          <div className="text-right flex flex-col justify-between items-end">
            <div className="text-[10px] text-stone-400">Authorized Signatory</div>
            <div className="pt-8 text-center border-t border-stone-400 w-36">
              <p className="font-bold text-stone-800 text-[11px]">Aston Holidays</p>
              <p className="text-[9px] text-stone-500">Sulthan Bathery, Wayanad</p>
            </div>
          </div>
        </div>

      </div>

      {/* CONFIRMATION & WHATSAPP VOUCHER MODAL */}
      {confirmModalOpen && dispatchedData && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl border border-stone-200">
            <div className="flex items-center gap-3 text-emerald-700 mb-2">
              <CheckCircle2 className="w-6 h-6" />
              <h3 className="text-lg font-bold text-stone-900">
                Booking Confirmed & WhatsApp Voucher Generated!
              </h3>
            </div>
            <p className="text-xs text-stone-500 mb-4">
              The automated confirmation message containing the official Stay Voucher, Google Maps directions, and Nearby Attractions is ready.
            </p>

            <div className="bg-[#EFEAE2] p-4 rounded-2xl border border-stone-300 text-xs font-mono text-stone-900 whitespace-pre-wrap max-h-[300px] overflow-y-auto leading-relaxed">
              {dispatchedData.messageText}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-stone-100">
              <span className="text-[11px] text-stone-500">
                Guest Phone: <strong>{invoice.customerPhone}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setConfirmModalOpen(false)}
                  className="px-4 py-2 text-stone-600 font-semibold hover:bg-stone-100 rounded-xl text-xs"
                >
                  Close
                </button>
                <a
                  href={dispatchedData.directWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow transition"
                >
                  <MessageCircle className="w-4 h-4" /> Open Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT BANK & PAYMENT DETAILS MODAL */}
      {isEditingBankDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2 text-stone-900">
                <CreditCard className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold">Update Payment & Bank Details</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingBankDetails(false)}
                className="w-7 h-7 flex items-center justify-center text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBankDetails} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-stone-600 font-bold mb-1">Account Holder Name</label>
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
                <label className="block text-stone-600 font-bold mb-1">UPI ID (Live Dynamic QR)</label>
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
                <p className="text-[10px] text-stone-400 mt-1">If empty, dynamic QR for ₹{cleanBalanceDue.toLocaleString("en-IN")} is generated automatically.</p>
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingBankDetails(false)}
                  className="px-4 py-2 text-stone-600 font-semibold hover:bg-stone-100 rounded-xl text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2E4F28] hover:bg-[#233D1F] text-white font-bold rounded-xl text-xs shadow-md transition"
                >
                  Save & Apply Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
