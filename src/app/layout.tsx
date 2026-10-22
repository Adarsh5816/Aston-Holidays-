import type { Metadata, Viewport } from "next";
import "./globals.css";
import PWAInstallBanner from "@/components/PWAInstallBanner";

export const viewport: Viewport = {
  themeColor: "#2E4F28",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Aston Holidays | Curated Resorts & Private Pool Villas in Wayanad",
  description: "Experience the magic of Wayanad with Aston Holidays. Exclusive private pool villas, glass treehouses, and heritage plantation stays with instant WhatsApp brochures and booking.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Aston Holidays",
  },
  icons: {
    icon: "/brand/emblem.png",
    apple: "/brand/emblem.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#FAF8F5] text-stone-900 min-h-screen flex flex-col">
        {children}
        <PWAInstallBanner />
      </body>
    </html>
  );
}
