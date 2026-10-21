"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, ReceiptText, Users, Building2, Palette, ExternalLink, LogOut, ShieldCheck, Terminal, HelpCircle, FileText, Sparkles, Compass, Network } from "lucide-react";
import { User } from "@/lib/types";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Read session from cookie or default to admin
    try {
      const match = document.cookie.match(/aston_session=([^;]+)/);
      if (match) {
        setCurrentUser(JSON.parse(decodeURIComponent(match[1])));
      } else {
        setCurrentUser({ id: "1", name: "Aston Admin", email: "admin@astonholidays.com", role: "admin" });
      }
    } catch {
      setCurrentUser({ id: "1", name: "Aston Admin", email: "admin@astonholidays.com", role: "admin" });
    }
  }, []);

  const handleLogout = async () => {
    await fetch("/api/v1/auth", { method: "DELETE" });
    router.push("/login");
  };

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Itinerary & Package Builder", href: "/admin/itineraries", icon: Compass },
    { label: "Packages & Live Ticker", href: "/admin/packages", icon: Sparkles },
    { label: "Resort API & Live Sync", href: "/admin/resort-sync", icon: Network },
    { label: "Brochure & PDF Studio", href: "/admin/brochures", icon: FileText },
    { label: "Invoices & Vouchers", href: "/admin/invoices", icon: ReceiptText },
    { label: "Leads CRM", href: "/admin/leads", icon: Users },
    { label: "Resort Inventory", href: "/admin/resorts", icon: Building2 },
    { label: "Site Customizer", href: "/admin/customizer", icon: Palette },
    { label: "Developer Hub", href: "/admin/dev", icon: Terminal },
    { label: "Integration Guide", href: "/admin/help", icon: HelpCircle },
  ];

  return (
    <aside className="w-64 bg-white border-r border-stone-200 flex flex-col justify-between min-h-screen p-5 print:hidden no-print">
      <div>
        {/* Brand Logo & Backoffice Tag */}
        <div className="pb-5 border-b border-stone-200">
          <div className="relative w-40 h-12">
            <Image
              src="/brand/logo.png"
              alt="Aston Holidays"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
              Backoffice Hub
            </span>
          </div>
        </div>

        {/* User Card */}
        {currentUser && (
          <div className="mt-4 p-3 bg-stone-50 rounded-xl border border-stone-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#2E4F28] text-white flex items-center justify-center font-bold text-xs uppercase">
                {currentUser.name.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-bold text-stone-900 leading-tight">{currentUser.name}</p>
                <p className="text-[10px] text-stone-500 capitalize">{currentUser.role} Account</p>
              </div>
            </div>
            <span className="text-[9px] font-mono bg-white border border-stone-200 text-emerald-800 px-1.5 py-0.5 rounded font-bold uppercase">
              {currentUser.role}
            </span>
          </div>
        )}

        {/* Nav Links */}
        <nav className="mt-6 space-y-1 text-xs font-semibold">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                  isActive
                    ? "bg-[#2E4F28] text-white shadow-sm"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-emerald-300" : "text-stone-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Actions */}
      <div className="pt-4 border-t border-stone-200 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between text-xs font-semibold text-stone-600 hover:text-stone-900 p-2.5 rounded-xl hover:bg-stone-100 transition"
        >
          <span>Customer Website</span>
          <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 text-xs font-semibold text-red-600 hover:text-red-800 p-2.5 rounded-xl hover:bg-red-50 transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
