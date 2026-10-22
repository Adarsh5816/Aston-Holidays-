"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Download, X, Share, PlusSquare, Smartphone, CheckCircle2 } from "lucide-react";

export default function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isDismissed, setIsDismissed] = useState(true); // default true until mounted check
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker in production or localhost
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => console.log("[PWA] Service Worker registered:", reg.scope))
          .catch((err) => console.warn("[PWA] Service Worker registration failed:", err));
      });
    }

    // 2. Check if already running as installed Standalone Web App
    const isRunningStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    setIsStandalone(isRunningStandalone);
    if (isRunningStandalone) return;

    // 3. Check dismiss preference from storage
    const dismissed = localStorage.getItem("aston_pwa_dismissed");
    if (dismissed && Date.now() - parseInt(dismissed, 10) < 1000 * 60 * 60 * 24 * 7) {
      // Dismissed within 7 days
      return;
    }
    setIsDismissed(false);

    // 4. Detect iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
    const isSafari = isAppleDevice && /safari/.test(userAgent) && !/crios|fxios/.test(userAgent);

    if (isAppleDevice && !isRunningStandalone) {
      setIsIOS(true);
      setIsInstallable(true);
    }

    // 5. Detect Android / Chrome 'beforeinstallprompt'
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      setIsIOS(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 6. Listen for successful installation
    window.addEventListener("appinstalled", () => {
      setIsStandalone(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem("aston_pwa_dismissed", Date.now().toString());
  };

  if (isStandalone || isDismissed || !isInstallable) {
    return null;
  }

  return (
    <>
      {/* Floating Bottom Install Pill / Banner */}
      <aside
        aria-label="Install Web App"
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-40 bg-[#1A2518]/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-white/15 flex items-center justify-between gap-3 animate-float"
      >
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-xl bg-white/10 p-1.5 flex items-center justify-center shrink-0 border border-white/10">
            <Image
              src="/brand/emblem.png"
              alt="Aston Holidays App"
              width={34}
              height={34}
              className="object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-bold text-white tracking-wide">
                Aston Holidays App
              </h4>
              <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">
                Web App
              </span>
            </div>
            <p className="text-[11px] text-stone-300 mt-0.5">
              {isIOS ? "Add to Home Screen for fast mobile access" : "Install on your phone without an APK"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleInstallClick}
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-md transition transform active:scale-95"
          >
            {isIOS ? (
              <>
                <Share className="w-3.5 h-3.5" />
                <span>Add App</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Install</span>
              </>
            )}
          </button>

          <button
            onClick={handleDismiss}
            aria-label="Dismiss banner"
            className="text-stone-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* iOS Instructions Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-white text-stone-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#2E4F28] flex items-center justify-center text-white">
                  <Smartphone className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-stone-900">
                  Add to iPhone Home Screen
                </h3>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Install the Aston Holidays Web App on your iPhone without going to the App Store:
            </p>

            <ol className="space-y-3 text-xs text-stone-700">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-stone-100 font-bold text-stone-800 flex items-center justify-center shrink-0 text-[11px]">
                  1
                </span>
                <span>
                  Tap the <strong className="text-stone-900">Share button</strong>{" "}
                  <Share className="w-3.5 h-3.5 inline text-blue-600" /> at the bottom of Safari.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-stone-100 font-bold text-stone-800 flex items-center justify-center shrink-0 text-[11px]">
                  2
                </span>
                <span>
                  Scroll down and tap <strong className="text-stone-900">Add to Home Screen</strong>{" "}
                  <PlusSquare className="w-3.5 h-3.5 inline text-stone-800" />.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-stone-100 font-bold text-stone-800 flex items-center justify-center shrink-0 text-[11px]">
                  3
                </span>
                <span>
                  Tap <strong className="text-stone-900">Add</strong> in the top right corner.
                </span>
              </li>
            </ol>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-700" />
              <span>It will open in full-screen standalone mode like a native app!</span>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 bg-[#2E4F28] hover:bg-[#233D1F] text-white font-bold text-xs rounded-xl transition shadow"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
