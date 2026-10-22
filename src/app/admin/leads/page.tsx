"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { Lead } from "@/lib/types";
import { Users, MessageCircle, Globe, Phone, Calendar, ArrowUpRight, Search } from "lucide-react";
import Link from "next/link";

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");

  const loadLeads = async () => {
    try {
      const res = await fetch("/api/v1/leads");
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const handleStatusChange = async (id: string, newStatus: Lead["status"]) => {
    await fetch("/api/v1/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus })
    });
    setLeads(leads.map(l => (l.id === id ? { ...l, status: newStatus } : l)));
  };

  const filtered = leads.filter(l =>
    l.customerName.toLowerCase().includes(search.toLowerCase()) ||
    l.phone.includes(search) ||
    (l.destination && l.destination.toLowerCase().includes(search.toLowerCase())) ||
    (l.requestedResortCode && l.requestedResortCode.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F5F6F8]">
      <AdminSidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
          <div>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">
              Leads & WhatsApp Inquiries CRM
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              All customer filter requests originating from WhatsApp automation and website inquiries are logged here in real time.
            </p>
          </div>

          <div className="text-xs font-bold bg-white border border-stone-200 px-3.5 py-2 rounded-xl text-stone-700 shadow-sm">
            Total Inquiries: {leads.length}
          </div>
        </div>

        {/* Search */}
        <div className="mt-6 max-w-md">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter leads by guest name, phone, or resort code..."
              className="w-full text-xs font-medium pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 bg-white"
            />
          </div>
        </div>

        {/* Table */}
        <div className="mt-6 bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-wider border-b border-stone-200">
              <tr>
                <th className="py-3.5 px-4">Lead #</th>
                <th className="py-3.5 px-4">Guest Details</th>
                <th className="py-3.5 px-4">Source</th>
                <th className="py-3.5 px-4">Requirements</th>
                <th className="py-3.5 px-4">Matched Resort</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((lead) => (
                <tr key={lead.id} className="hover:bg-stone-50 transition">
                  <td className="py-4 px-4 font-mono font-bold text-stone-900">
                    {lead.leadNumber}
                    <span className="block text-[10px] text-stone-400 font-normal">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-bold text-stone-900">{lead.customerName}</p>
                    <p className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-stone-400" /> {lead.phone}
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      lead.source === "WhatsApp" ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"
                    }`}>
                      {lead.source === "WhatsApp" ? <MessageCircle className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                      {lead.source}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-semibold text-stone-800">
                      Destination: {lead.destination || "Any Wayanad"}
                    </p>
                    <p className="text-[11px] text-stone-500">
                      {lead.guestsCount ? `${lead.guestsCount} Guests` : "Flexible guests"}
                      {lead.budget ? ` • Budget: ₹${lead.budget.toLocaleString("en-IN")}` : ""}
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    {lead.requestedResortCode ? (
                      <Link
                        href={`/brochure/${lead.requestedResortCode}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md transition"
                      >
                        {lead.requestedResortCode} <ArrowUpRight className="w-3 h-3" />
                      </Link>
                    ) : (
                      <span className="text-stone-400">—</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value as Lead["status"])}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border focus:outline-none bg-white ${
                        lead.status === "Booked" ? "border-emerald-300 text-emerald-800 bg-emerald-50" :
                        lead.status === "Brochure Sent" ? "border-amber-300 text-amber-800 bg-amber-50" :
                        "border-stone-200 text-stone-700"
                      }`}
                    >
                      <option value="New">New</option>
                      <option value="Brochure Sent">Brochure Sent</option>
                      <option value="Quoted">Quoted</option>
                      <option value="Booked">Booked</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <a
                      href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(lead.customerName)},%20Aston%20Holidays%20here!%20Following%20up%20on%20your%20resort%20inquiry.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition"
                    >
                      <MessageCircle className="w-3 h-3" /> Chat
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
