import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aston Holidays | Curated Resorts & Private Pool Villas in Wayanad",
  description: "Experience the magic of Wayanad with Aston Holidays. Exclusive private pool villas, glass treehouses, and heritage plantation stays with instant WhatsApp brochures and booking.",
  icons: {
    icon: "/brand/emblem.png",
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
      </body>
    </html>
  );
}
