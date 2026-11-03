import React from "react";
import HomePageClient from "@/components/HomePageClient";
import { Store } from "@/lib/store";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const settings = Store.getSettings();
  const allResorts = Store.getResorts();
  const packages = Store.getPackages();
  const blogs = Store.getBlogs();

  return (
    <HomePageClient
      settings={settings}
      resorts={allResorts}
      packages={packages}
      blogs={blogs}
    />
  );
}
