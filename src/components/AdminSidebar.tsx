"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ReceiptText,
  Users,
  Building2,
  Palette,
  ExternalLink,
  LogOut,
  Terminal,
  HelpCircle,
  FileText,
  Sparkles,
  Compass,
  Network,
  Menu,
  X
} from "lucide-react";
import { User } from "@/lib/types";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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

  // Auto-close sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    setIsMobileOpen(false);
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

  const currentItem = navItems.find((item) => item.href === pathname);

  return (
    <>
      {/* ================= MOBILE STICKY TOP BAR (lg:hidden) ================= */}
      <header className="lg:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 px-4 py-2.5 flex items-center justify-between w-full print:hidden shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileOpen(true)}
            aria-label="Open Navigation Menu"
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 transition active:scale-95 flex items-center justify-center"
          >
            <Menu className="w-5 h-5 text-stone-800" />
          </button>
          <div className="relative w-32 h-8">
            <Image
              src="/brand/logo.png"
              alt="Aston Holidays"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60 max-w-[120px] truncate">
            {currentItem ? currentItem.label : "Backoffice"}
          </span>
        </div>
      </header>

      {/* ================= MOBILE BACKDROP (lg:hidden) ================= */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* ================= SIDEBAR (Drawer on Mobile, Static on Desktop) ================= */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-stone-200 flex flex-col justify-between p-5 shadow-2xl transition-transform duration-300 ease-in-out print:hidden no-print overflow-y-auto
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:static lg:w-64 lg:min-h-screen lg:translate-x-0 lg:shadow-none lg:overflow-y-visible
        `}
      >
        <div>
          {/* Brand Logo & Backoffice Tag + Mobile Close Button */}
          <div className="pb-5 border-b border-stone-200 flex items-start justify-between">
            <div>
              <div className="relative w-36 sm:w-40 h-11 sm:h-12">
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

            {/* Mobile close button */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-xl text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition"
              aria-label="Close Navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Card */}
          {currentUser && (
            <div className="mt-4 p-3 bg-stone-50 rounded-xl border border-stone-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#2E4F28] text-white flex items-center justify-center font-bold text-xs uppercase shrink-0">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-stone-900 leading-tight truncate">{currentUser.name}</p>
                  <p className="text-[10px] text-stone-500 capitalize">{currentUser.role} Account</p>
                </div>
              </div>
              <span className="text-[9px] font-mono bg-white border border-stone-200 text-emerald-800 px-1.5 py-0.5 rounded font-bold uppercase shrink-0">
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
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                    isActive
                      ? "bg-[#2E4F28] text-white shadow-sm"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-emerald-300" : "text-stone-400"}`} />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 mt-6 border-t border-stone-200 space-y-1">
          <Link
            href="/"
            target="_blank"
            onClick={() => setIsMobileOpen(false)}
            className="flex items-center justify-between text-xs font-semibold text-stone-600 hover:text-stone-900 p-2.5 rounded-xl hover:bg-stone-100 transition"
          >
            <span>Customer Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-xs font-semibold text-red-600 hover:text-red-800 p-2.5 rounded-xl hover:bg-red-50 transition"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
