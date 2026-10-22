import React from "react";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";
import { Store } from "@/lib/store";
import { Building2, ReceiptText, Users, ArrowUpRight, Plus, MessageCircle, FileText } from "lucide-react";

export default function AdminDashboardPage() {
  const resorts = Store.getResorts();
  const leads = Store.getLeads();
  const invoices = Store.getInvoices();

  const totalRevenue = invoices.reduce((acc, curr) => acc + curr.advancePaid, 0);
  const pendingBalance = invoices.reduce((acc, curr) => acc + curr.balanceDue, 0);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F5F6F8]">
      <AdminSidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto w-full">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
          <div>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">
              Aston Holidays Operations Hub
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Manage resort inventory, generate invoices & vouchers, and track incoming WhatsApp inquiries.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/invoices"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#2E4F28] hover:bg-[#233D1F] px-4 py-2.5 rounded-xl transition shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> Create Invoice
            </Link>
            <Link
              href="/admin/recommend-test"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-800 bg-white border border-stone-200 hover:bg-stone-50 px-4 py-2.5 rounded-xl transition shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp Test Bot
            </Link>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Total Resorts</span>
              <Building2 className="w-4 h-4 text-emerald-700" />
            </div>
            <p className="text-3xl font-black text-stone-900 mt-3">{resorts.length}</p>
            <span className="text-[11px] font-semibold text-emerald-700 mt-1 block">
              10 Wayanad Destinations
            </span>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Leads / Inquiries</span>
              <Users className="w-4 h-4 text-emerald-700" />
            </div>
            <p className="text-3xl font-black text-stone-900 mt-3">{leads.length}</p>
            <span className="text-[11px] font-semibold text-emerald-700 mt-1 block">
              WhatsApp & Web combined
            </span>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Advance Received</span>
              <ReceiptText className="w-4 h-4 text-emerald-700" />
            </div>
            <p className="text-3xl font-black text-stone-900 mt-3">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </p>
            <span className="text-[11px] font-semibold text-stone-500 mt-1 block">
              Across {invoices.length} invoices
            </span>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Pending Balance</span>
              <ReceiptText className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-3xl font-black text-stone-900 mt-3">
              ₹{pendingBalance.toLocaleString("en-IN")}
            </p>
            <span className="text-[11px] font-semibold text-amber-600 mt-1 block">
              Due on check-in arrival
            </span>
          </div>
        </div>

        {/* Split Grid: Recent Invoices & Recent WhatsApp Inquiries */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          
          {/* Recent Invoices */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-stone-900">Recent Invoices & Vouchers</h2>
                <Link href="/admin/invoices" className="text-xs font-semibold text-emerald-800 hover:underline">
                  View All ({invoices.length})
                </Link>
              </div>

              <div className="divide-y divide-stone-100">
                {invoices.slice(0, 4).map((inv) => (
                  <div key={inv.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-stone-900">
                          {inv.invoiceNumber}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          inv.status === "Fully Paid" ? "bg-emerald-100 text-emerald-800" :
                          inv.status === "Advance Received" ? "bg-amber-100 text-amber-800" :
                          "bg-stone-100 text-stone-700"
                        }`}>
                          {inv.status}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 mt-0.5">
                        {inv.customerName} • [{inv.resortCode}] {inv.resortName}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-bold text-stone-900">
                        ₹{inv.totalAmount.toLocaleString("en-IN")}
                      </p>
                      <Link
                        href={`/admin/invoices?id=${inv.id}`}
                        className="text-[11px] text-emerald-800 hover:underline inline-flex items-center gap-0.5 font-semibold mt-0.5"
                      >
                        Print / PDF <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100">
              <Link
                href="/admin/invoices"
                className="w-full inline-flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold py-2.5 rounded-xl transition"
              >
                <Plus className="w-3.5 h-3.5" /> Generate New Booking Invoice
              </Link>
            </div>
          </div>

          {/* Recent Leads from WhatsApp / Web */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-stone-900">Incoming Inquiries & Leads</h2>
                <Link href="/admin/leads" className="text-xs font-semibold text-emerald-800 hover:underline">
                  View All ({leads.length})
                </Link>
              </div>

              <div className="divide-y divide-stone-100">
                {leads.slice(0, 4).map((lead) => (
                  <div key={lead.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-900">
                          {lead.customerName}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          lead.source === "WhatsApp" ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"
                        }`}>
                          {lead.source}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {lead.phone} • Destination: {lead.destination || "Wayanad"}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded">
                        {lead.status}
                      </span>
                      {lead.requestedResortCode && (
                        <p className="text-[10px] text-stone-500 mt-0.5">
                          Req: {lead.requestedResortCode}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100">
              <Link
                href="/admin/recommend-test"
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold py-2.5 rounded-xl transition"
              >
                <MessageCircle className="w-3.5 h-3.5" /> Test Filter & Send Sample WhatsApp Brochure
              </Link>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
