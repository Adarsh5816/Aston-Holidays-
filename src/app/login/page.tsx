"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/v1/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (role: "admin" | "staff") => {
    if (role === "admin") {
      setEmail("admin@astonholidays.com");
      setPassword("admin");
    } else {
      setEmail("staff@astonholidays.com");
      setPassword("staff");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F0] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block relative w-48 h-16 mb-2">
          <Image
            src="/brand/logo.png"
            alt="Aston Holidays"
            fill
            className="object-contain"
            priority
          />
        </Link>
        <h2 className="text-2xl font-black text-stone-900 tracking-tight">
          Operations & Inventory Portal
        </h2>
        <p className="text-xs text-stone-500 mt-1">
          Authorized Admin & Staff Access
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl rounded-3xl border border-stone-200">
          
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs font-medium">
            <div>
              <label className="block text-stone-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@astonholidays.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#2E4F28] hover:bg-[#233D1F] text-white font-bold py-3 rounded-xl transition shadow mt-2"
            >
              {loading ? "Authenticating..." : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Switcher */}
          <div className="mt-8 pt-6 border-t border-stone-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block text-center mb-3">
              One-Click Quick Login
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDemoCredentials("admin")}
                className="flex items-center justify-center gap-1.5 p-2 rounded-xl border border-stone-200 hover:border-emerald-600/40 text-stone-700 text-[11px] font-bold bg-stone-50 hover:bg-emerald-50 transition"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> Admin Account
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials("staff")}
                className="flex items-center justify-center gap-1.5 p-2 rounded-xl border border-stone-200 hover:border-emerald-600/40 text-stone-700 text-[11px] font-bold bg-stone-50 hover:bg-emerald-50 transition"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-700" /> Staff Account
              </button>
            </div>
          </div>

        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-xs font-semibold text-stone-500 hover:text-stone-800 transition">
            ← Back to Customer Website
          </Link>
        </div>
      </div>
    </div>
  );
}
