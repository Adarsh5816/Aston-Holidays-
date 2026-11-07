"use client";

import React, { useEffect, useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import { SiteTypographyConfig, PageFontSetting } from "@/lib/types";

const DEFAULT_TYPOGRAPHY: SiteTypographyConfig = {
  global: {
    headingFont: "Playfair Display",
    bodyFont: "Plus Jakarta Sans",
    headingLetterSpacing: "normal",
    headingTransform: "none",
    headingWeight: "normal"
  },
  home: {
    headingFont: "Playfair Display",
    bodyFont: "Plus Jakarta Sans"
  },
  resorts: {
    headingFont: "Playfair Display",
    bodyFont: "Plus Jakarta Sans"
  },
  destinations: {
    headingFont: "Playfair Display",
    bodyFont: "Plus Jakarta Sans"
  },
  brochure: {
    headingFont: "Cormorant Garamond",
    bodyFont: "Plus Jakarta Sans",
    headingLetterSpacing: "wide"
  },
  invoices: {
    headingFont: "Playfair Display",
    bodyFont: "Plus Jakarta Sans"
  },
  contact: {
    headingFont: "Playfair Display",
    bodyFont: "Plus Jakarta Sans"
  },
  admin: {
    headingFont: "Plus Jakarta Sans",
    bodyFont: "Plus Jakarta Sans"
  }
};

function formatGoogleFontUrl(fonts: string[]): string {
  const uniqueFonts = Array.from(new Set(fonts.filter(Boolean))).map(f => f.trim());
  if (uniqueFonts.length === 0) return "";
  
  const families = uniqueFonts.map(font => {
    const encoded = font.replace(/\s+/g, "+");
    return `family=${encoded}:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600`;
  });
  
  return `https://fonts.googleapis.com/css2?${families.join("&")}&display=swap`;
}

export default function TypographyProvider() {
  const pathname = usePathname() || "/";
  const [typography, setTypography] = useState<SiteTypographyConfig>(DEFAULT_TYPOGRAPHY);

  // Load initial from localStorage or API
  useEffect(() => {
    try {
      const cached = localStorage.getItem("aston_typography_cache");
      if (cached) {
        setTypography(JSON.parse(cached));
      }
    } catch {}

    fetch("/api/v1/fonts")
      .then(res => res.json())
      .then(data => {
        if (data && data.global) {
          setTypography(data);
          try {
            localStorage.setItem("aston_typography_cache", JSON.stringify(data));
          } catch {}
        }
      })
      .catch(err => console.warn("Failed to load typography config:", err));

    // Listen for live studio updates
    const handleLiveUpdate = (e: CustomEvent) => {
      if (e.detail) {
        setTypography(e.detail);
      }
    };

    window.addEventListener("aston_typography_updated" as any, handleLiveUpdate);
    return () => {
      window.removeEventListener("aston_typography_updated" as any, handleLiveUpdate);
    };
  }, []);

  // Determine current active page setting
  const activeSetting: PageFontSetting = useMemo(() => {
    const globalSetting = typography.global || DEFAULT_TYPOGRAPHY.global;

    let pageKey: keyof SiteTypographyConfig = "global";
    if (pathname === "/") {
      pageKey = "home";
    } else if (pathname.startsWith("/resorts")) {
      pageKey = "resorts";
    } else if (pathname.startsWith("/destinations")) {
      pageKey = "destinations";
    } else if (pathname.startsWith("/brochure")) {
      pageKey = "brochure";
    } else if (pathname.startsWith("/admin/invoices")) {
      pageKey = "invoices";
    } else if (pathname.startsWith("/contact")) {
      pageKey = "contact";
    } else if (pathname.startsWith("/admin")) {
      pageKey = "admin";
    }

    const specific = typography[pageKey] as PageFontSetting | undefined;
    if (!specific) return globalSetting;

    return {
      headingFont: specific.headingFont || globalSetting.headingFont || "Playfair Display",
      bodyFont: specific.bodyFont || globalSetting.bodyFont || "Plus Jakarta Sans",
      headingLetterSpacing: specific.headingLetterSpacing || globalSetting.headingLetterSpacing || "normal",
      headingTransform: specific.headingTransform || globalSetting.headingTransform || "none",
      headingWeight: specific.headingWeight || globalSetting.headingWeight || "normal"
    };
  }, [pathname, typography]);

  // Inject Google Fonts link
  useEffect(() => {
    if (typeof document === "undefined") return;

    const allFonts: string[] = [
      activeSetting.headingFont,
      activeSetting.bodyFont,
      typography.global?.headingFont,
      typography.global?.bodyFont,
      "Playfair Display",
      "Plus Jakarta Sans",
      "Cormorant Garamond"
    ].filter(Boolean) as string[];

    const googleFontUrl = formatGoogleFontUrl(allFonts);
    if (!googleFontUrl) return;

    let linkElem = document.getElementById("aston-dynamic-google-fonts") as HTMLLinkElement | null;
    if (!linkElem) {
      linkElem = document.createElement("link");
      linkElem.id = "aston-dynamic-google-fonts";
      linkElem.rel = "stylesheet";
      document.head.appendChild(linkElem);
    }
    if (linkElem.href !== googleFontUrl) {
      linkElem.href = googleFontUrl;
    }
  }, [activeSetting, typography]);

  // Inject Dynamic CSS Variables and Overrides
  useEffect(() => {
    if (typeof document === "undefined") return;

    const headingFont = activeSetting.headingFont || "Playfair Display";
    const bodyFont = activeSetting.bodyFont || "Plus Jakarta Sans";

    let letterSpacing = "inherit";
    if (activeSetting.headingLetterSpacing === "wide") letterSpacing = "0.08em";
    if (activeSetting.headingLetterSpacing === "wider") letterSpacing = "0.18em";

    let textTransform = "none";
    if (activeSetting.headingTransform === "uppercase") textTransform = "uppercase";
    if (activeSetting.headingTransform === "capitalize") textTransform = "capitalize";

    let styleElem = document.getElementById("aston-dynamic-typography-css") as HTMLStyleElement | null;
    if (!styleElem) {
      styleElem = document.createElement("style");
      styleElem.id = "aston-dynamic-typography-css";
      document.head.appendChild(styleElem);
    }

    styleElem.innerHTML = `
      :root {
        --font-playfair: '${headingFont}', 'Playfair Display', Georgia, serif;
        --font-inter: '${bodyFont}', 'Plus Jakarta Sans', -apple-system, sans-serif;
        --font-heading: '${headingFont}', serif;
        --font-body: '${bodyFont}', sans-serif;
      }
      .font-editorial, .font-serif {
        font-family: var(--font-playfair) !important;
        ${letterSpacing !== "inherit" ? `letter-spacing: ${letterSpacing} !important;` : ""}
        ${textTransform !== "none" ? `text-transform: ${textTransform} !important;` : ""}
      }
      .font-sans-luxury, .font-sans {
        font-family: var(--font-inter) !important;
      }
    `;
  }, [activeSetting]);

  return null;
}
