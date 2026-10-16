import React from "react";
import { notFound } from "next/navigation";
import { Store } from "@/lib/store";
import BrochureDocument from "@/components/BrochureDocument";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ print?: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params;
  const resort = Store.getResortByCode(code);
  if (!resort) return { title: "Brochure Not Found | Aston Holidays" };

  return {
    title: `[${resort.code}] ${resort.name} - Official Brochure | Aston Holidays`,
    description: `${resort.name} in ${resort.destination}, Wayanad. View photos, pool villa specs, amenities, and nearby attractions.`,
    openGraph: {
      title: `${resort.code} ${resort.name} - Aston Holidays`,
      description: resort.overview,
      images: [resort.coverImage]
    }
  };
}

export default async function BrochurePage({ params, searchParams }: PageProps) {
  const { code } = await params;
  const { print } = await searchParams;
  const resort = Store.getResortByCode(code);

  if (!resort) {
    notFound();
  }

  return <BrochureDocument resort={resort} autoPrint={print === "true"} />;
}
