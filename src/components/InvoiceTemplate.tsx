"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Printer, Share2, ArrowLeft, Check, Phone, Mail, Globe, MapPin, MessageCircle, Send, CheckCircle2, Navigation, Compass } from "lucide-react";
import Link from "next/link";
import QRCode from "qrcode";
import { Invoice } from "@/lib/types";
import { printElementIsolated } from "@/lib/printUtils";

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

  useEffect(() => {
    // Generate UPI payment / invoice verification QR
    const upiString = `upi://pay?pa=astonholidays@sbi&pn=Aston%20Holidays&am=${invoice.balanceDue}&cu=INR&tn=Invoice%20${invoice.invoiceNumber}`;
    QRCode.toDataURL(upiString, { width: 130, margin: 1 })
      .then(url => setQrCodeUrl(url))
      .catch(err => console.error(err));
  }, [invoice]);

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

        <div className="flex items-center gap-2">
          {/* Main Booking Confirmation Trigger */}
          <button
            onClick={handleConfirmAndSendWhatsApp}
            disabled={isConfirming}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#2E4F28] hover:bg-[#233D1F] px-4 py-2 rounded-lg transition shadow-sm"
          >
            <Send className="w-3.5 h-3.5 text-emerald-300" />
            {isConfirming ? "Dispatching..." : "Confirm Booking & Send WhatsApp Voucher"}
          </button>

          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 px-3 py-2 rounded-lg transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy Link"}
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 px-3.5 py-2 rounded-lg transition shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" /> Print / Save PDF
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
              ASTON HOLIDAYS DESTINATION MANAGEMENT
            </p>
            <p className="text-xs text-stone-600 mt-0.5">
              Kolagappara, Beenachi, Sulthan Bathery, Wayanad - 673592, Kerala
            </p>
            <p className="text-xs text-stone-600">
              GSTIN: 32AABCA1234F1Z5 | Phone: +91 97449 00414
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
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">
              Payment & Bank Details
            </h3>
            <div className="flex gap-4 items-center bg-stone-50 p-3 rounded-lg border border-stone-200">
              {qrCodeUrl && (
                <div className="w-24 h-24 relative flex-shrink-0 bg-white p-1 rounded border border-stone-200">
                  <Image src={qrCodeUrl} alt="UPI QR" fill className="object-contain" />
                </div>
              )}
              <div className="text-[11px] text-stone-700 space-y-0.5">
                <p><span className="font-semibold">A/C Name:</span> {invoice.bankDetails?.accountName || "Aston Holidays LLP"}</p>
                <p><span className="font-semibold">Bank:</span> {invoice.bankDetails?.bankName || "State Bank of India"}</p>
                <p><span className="font-semibold">A/C No:</span> {invoice.bankDetails?.accountNumber || "40921008745"}</p>
                <p><span className="font-semibold">IFSC:</span> {invoice.bankDetails?.ifscCode || "SBIN0008451"}</p>
                <p><span className="font-semibold">UPI ID:</span> {invoice.bankDetails?.upiId || "astonholidays@sbi"}</p>
              </div>
            </div>
          </div>

          {/* Amount Calculation */}
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
            <div className="flex justify-between">
              <span>GST ({invoice.gstRate}%):</span>
              <span className="font-semibold">₹{invoice.gstAmount.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-300">
              <span>Total Amount:</span>
              <span>₹{invoice.totalAmount.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-xs text-emerald-800 bg-emerald-50 p-2 rounded">
              <span>Advance Paid:</span>
              <span className="font-bold">₹{invoice.advancePaid.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-[#2E4F28] p-2 bg-stone-100 rounded">
              <span>Balance Due at Check-In:</span>
              <span>₹{invoice.balanceDue.toLocaleString("en-IN")}</span>
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
    </div>
  );
}
