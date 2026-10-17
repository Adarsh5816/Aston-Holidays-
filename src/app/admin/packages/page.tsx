"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { HolidayPackage, BlogPost, ClientReview } from "@/lib/types";
import {
  Sparkles,
  Heart,
  Calendar,
  Users,
  Compass,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  BookOpen,
  MessageSquareQuote,
  Star,
  Check,
  X,
  Save,
  Clock,
  MapPin
} from "lucide-react";

export default function AdminPackagesPage() {
  const [activeTab, setActiveTab] = useState<"packages" | "blogs" | "reviews">("packages");
  const [packages, setPackages] = useState<HolidayPackage[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [reviews, setReviews] = useState<ClientReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Modals state
  const [isPkgModalOpen, setIsPkgModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState<HolidayPackage | null>(null);

  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<ClientReview | null>(null);

  // Form states for Package
  const [pkgTitle, setPkgTitle] = useState("");
  const [pkgCategory, setPkgCategory] = useState<HolidayPackage["category"]>("Honey Moon Package");
  const [pkgTagline, setPkgTagline] = useState("");
  const [pkgDuration, setPkgDuration] = useState("3 Days / 2 Nights");
  const [pkgPrice, setPkgPrice] = useState(24999);
  const [pkgInclusions, setPkgInclusions] = useState("");
  const [pkgDescription, setPkgDescription] = useState("");
  const [pkgResortCodes, setPkgResortCodes] = useState("AH-112, AH-121");

  // Form states for Blog
  const [blogTitle, setBlogTitle] = useState("");
  const [blogCategory, setBlogCategory] = useState("Seasonal Guide");
  const [blogExcerpt, setBlogExcerpt] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogReadTime, setBlogReadTime] = useState("4 min read");
  const [blogAuthor, setBlogAuthor] = useState("Aston Holidays Editorial");

  // Form states for Review
  const [revName, setRevName] = useState("");
  const [revLocation, setRevLocation] = useState("Bangalore");
  const [revRating, setRevRating] = useState(5);
  const [revPackage, setRevPackage] = useState("Honeymoon Private Pool Villa (AH-112)");
  const [revReview, setRevReview] = useState("");

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [pkgRes, blogRes, revRes] = await Promise.all([
        fetch("/api/v1/packages"),
        fetch("/api/v1/blogs"),
        fetch("/api/v1/reviews")
      ]);

      if (pkgRes.ok) setPackages(await pkgRes.json());
      if (blogRes.ok) setBlogs(await blogRes.json());
      if (revRes.ok) setReviews(await revRes.json());
    } catch (e) {
      console.error("Error loading data:", e);
    } finally {
      setLoading(false);
    }
  };

  // ================= PACKAGE CRUD =================
  const openPackageModal = (pkg?: HolidayPackage) => {
    if (pkg) {
      setEditingPkg(pkg);
      setPkgTitle(pkg.title);
      setPkgCategory(pkg.category);
      setPkgTagline(pkg.tagline);
      setPkgDuration(pkg.duration);
      setPkgPrice(pkg.price);
      setPkgInclusions(pkg.inclusions.join("\n"));
      setPkgDescription(pkg.description);
      setPkgResortCodes(pkg.applicableResortCodes.join(", "));
    } else {
      setEditingPkg(null);
      setPkgTitle("");
      setPkgCategory("Honey Moon Package");
      setPkgTagline("");
      setPkgDuration("3 Days / 2 Nights");
      setPkgPrice(24999);
      setPkgInclusions("2 Nights in Private Pool Villa\nRomantic Candlelight Dinner by the Pool\nFloral Bed Decoration & Cake\nDaily Breakfast & Dinner");
      setPkgDescription("An exclusive curated holiday experience in Wayanad.");
      setPkgResortCodes("AH-112, AH-121");
    }
    setIsPkgModalOpen(true);
  };

  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: HolidayPackage = {
      id: editingPkg ? editingPkg.id : `pkg-${Date.now()}`,
      title: pkgTitle,
      category: pkgCategory,
      tagline: pkgTagline,
      duration: pkgDuration,
      price: Number(pkgPrice),
      featured: true,
      image: "/brochure-assets/extracted_img_2.jpg",
      inclusions: pkgInclusions.split("\n").map((s) => s.trim()).filter(Boolean),
      description: pkgDescription,
      applicableResortCodes: pkgResortCodes.split(",").map((s) => s.trim()).filter(Boolean)
    };

    const res = await fetch("/api/v1/packages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      setIsPkgModalOpen(false);
      loadAllData();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleDeletePackage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this holiday package?")) return;
    const res = await fetch(`/api/v1/packages?id=${id}`, { method: "DELETE" });
    if (res.ok) loadAllData();
  };

  // ================= BLOG CRUD =================
  const openBlogModal = (b?: BlogPost) => {
    if (b) {
      setEditingBlog(b);
      setBlogTitle(b.title);
      setBlogCategory(b.category);
      setBlogExcerpt(b.excerpt);
      setBlogContent(b.content);
      setBlogReadTime(b.readTime);
      setBlogAuthor(b.author);
    } else {
      setEditingBlog(null);
      setBlogTitle("");
      setBlogCategory("Seasonal Guide");
      setBlogExcerpt("");
      setBlogContent("");
      setBlogReadTime("4 min read");
      setBlogAuthor("Aston Holidays Editorial");
    }
    setIsBlogModalOpen(true);
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: BlogPost = {
      id: editingBlog ? editingBlog.id : `blog-${Date.now()}`,
      title: blogTitle,
      slug: editingBlog ? editingBlog.slug : blogTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      category: blogCategory,
      excerpt: blogExcerpt,
      content: blogContent,
      readTime: blogReadTime,
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      image: "/brochure-assets/extracted_img_2.jpg",
      author: blogAuthor,
      featured: true
    };

    const res = await fetch("/api/v1/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      setIsBlogModalOpen(false);
      loadAllData();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    const res = await fetch(`/api/v1/blogs?id=${id}`, { method: "DELETE" });
    if (res.ok) loadAllData();
  };

  // ================= REVIEW CRUD =================
  const openReviewModal = (r?: ClientReview) => {
    if (r) {
      setEditingReview(r);
      setRevName(r.name);
      setRevLocation(r.location);
      setRevRating(r.rating);
      setRevPackage(r.packageTaken);
      setRevReview(r.review);
    } else {
      setEditingReview(null);
      setRevName("");
      setRevLocation("Bangalore");
      setRevRating(5);
      setRevPackage("Honeymoon Private Pool Villa (AH-112)");
      setRevReview("");
    }
    setIsReviewModalOpen(true);
  };

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: ClientReview = {
      id: editingReview ? editingReview.id : `rev-${Date.now()}`,
      name: revName,
      location: revLocation,
      rating: Number(revRating),
      review: revReview,
      packageTaken: revPackage,
      date: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      avatar: revName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    };

    const res = await fetch("/api/v1/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      setIsReviewModalOpen(false);
      loadAllData();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    const res = await fetch(`/api/v1/reviews?id=${id}`, { method: "DELETE" });
    if (res.ok) loadAllData();
  };

  return (
    <div className="flex min-h-screen bg-[#F7F8FA]">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between pb-6 border-b border-stone-200 gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200/60">
                <Sparkles className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-2xl font-black text-stone-900 tracking-tight">
                  Packages, Live Ticker &amp; Content Studio
                </h1>
                <p className="text-xs text-stone-500 mt-0.5">
                  Create and manage Honeymoon Packages, Destination Events, Group Packages, Live Scrolling Blog &amp; News, and Client Testimonials.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === "packages" && (
              <button
                onClick={() => openPackageModal()}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#2E4F28] hover:bg-[#233D1F] px-4 py-2.5 rounded-xl transition shadow-sm"
              >
                <Plus className="w-4 h-4" /> Create New Holiday Package
              </button>
            )}

            {activeTab === "blogs" && (
              <button
                onClick={() => openBlogModal()}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 px-4 py-2.5 rounded-xl transition shadow-sm"
              >
                <Plus className="w-4 h-4" /> Add New Blog Article
              </button>
            )}

            {activeTab === "reviews" && (
              <button
                onClick={() => openReviewModal()}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 px-4 py-2.5 rounded-xl transition shadow-sm"
              >
                <Plus className="w-4 h-4" /> Add Client Testimonial
              </button>
            )}
          </div>
        </div>

        {/* Success Alert */}
        {saveSuccess && (
          <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-2 text-xs font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
            Changes saved and published live to website and live tickers!
          </div>
        )}

        {/* Tab Controls */}
        <div className="mt-8 flex items-center gap-3 border-b border-stone-200 pb-3">
          <button
            onClick={() => setActiveTab("packages")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === "packages"
                ? "bg-[#2E4F28] text-white shadow-sm"
                : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
            }`}
          >
            <Compass className="w-4 h-4" />
            Holiday Packages ({packages.length})
          </button>

          <button
            onClick={() => setActiveTab("blogs")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === "blogs"
                ? "bg-stone-900 text-white shadow-sm"
                : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Live Blog &amp; News ({blogs.length})
          </button>

          <button
            onClick={() => setActiveTab("reviews")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === "reviews"
                ? "bg-amber-700 text-white shadow-sm"
                : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
            }`}
          >
            <MessageSquareQuote className="w-4 h-4" />
            Client&apos;s Words ({reviews.length})
          </button>
        </div>

        {/* ================= TAB 1: HOLIDAY PACKAGES LIST ================= */}
        {activeTab === "packages" && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {pkg.category}
                    </span>
                    <span className="text-xs font-bold text-stone-500">{pkg.duration}</span>
                  </div>

                  <h3 className="text-lg font-black text-stone-900 leading-snug">{pkg.title}</h3>
                  <p className="text-xs text-stone-500 mt-1">{pkg.tagline}</p>

                  <div className="mt-4 pt-3 border-t border-stone-100 space-y-1">
                    {pkg.inclusions.slice(0, 3).map((inc, i) => (
                      <div key={i} className="text-xs text-stone-700 flex items-center gap-1.5 truncate">
                        <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span className="truncate">{inc}</span>
                      </div>
                    ))}
                    {pkg.inclusions.length > 3 && (
                      <span className="text-[10px] text-stone-400 block pt-1">
                        +{pkg.inclusions.length - 3} more inclusions
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-400 block uppercase">Price</span>
                    <span className="text-base font-black text-[#2E4F28]">
                      ₹{pkg.price.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openPackageModal(pkg)}
                      className="p-2 text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition"
                      title="Edit package"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeletePackage(pkg.id)}
                      className="p-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition"
                      title="Delete package"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================= TAB 2: BLOG & NEWS LIST ================= */}
        {activeTab === "blogs" && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-800">
                      {b.category}
                    </span>
                    <span className="text-xs text-stone-400">{b.readTime}</span>
                  </div>

                  <h3 className="text-base font-black text-stone-900 leading-snug">{b.title}</h3>
                  <p className="text-xs text-stone-500 mt-2 line-clamp-3 leading-relaxed font-serif">
                    {b.excerpt}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400">{b.date}</span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openBlogModal(b)}
                      className="p-2 text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteBlog(b.id)}
                      className="p-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================= TAB 3: CLIENT REVIEWS LIST ================= */}
        {activeTab === "reviews" && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-3">
                    {Array.from({ length: r.rating || 5 }).map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-current" />
                    ))}
                  </div>

                  <p className="text-xs text-stone-700 leading-relaxed font-serif italic mb-4">
                    &ldquo;{r.review}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black text-stone-900">{r.name}</h4>
                    <p className="text-[10px] text-stone-500">📍 {r.location} • {r.date}</p>
                    <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-1">
                      {r.packageTaken}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openReviewModal(r)}
                      className="p-2 text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteReview(r.id)}
                      className="p-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================= PACKAGE MODAL ================= */}
        {isPkgModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <h3 className="text-base font-black text-stone-900">
                  {editingPkg ? "Edit Holiday Package" : "Create New Holiday Package"}
                </h3>
                <button onClick={() => setIsPkgModalOpen(false)}>
                  <X className="w-5 h-5 text-stone-400" />
                </button>
              </div>

              <form onSubmit={handleSavePackage} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Package Title</label>
                  <input
                    type="text"
                    required
                    value={pkgTitle}
                    onChange={(e) => setPkgTitle(e.target.value)}
                    placeholder="e.g. Wayanad Mist & Roses Romantic Escape"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Category</label>
                    <select
                      value={pkgCategory}
                      onChange={(e) => setPkgCategory(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 focus:outline-none"
                    >
                      <option value="Honey Moon Package">Honey Moon Package</option>
                      <option value="Destination events">Destination events</option>
                      <option value="Group Packages">Group Packages</option>
                      <option value="Best Holiday Package">Best Holiday Package</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Duration</label>
                    <input
                      type="text"
                      required
                      value={pkgDuration}
                      onChange={(e) => setPkgDuration(e.target.value)}
                      placeholder="e.g. 3 Days / 2 Nights"
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Price (₹ INR)</label>
                    <input
                      type="number"
                      required
                      value={pkgPrice}
                      onChange={(e) => setPkgPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Applicable Villa Codes</label>
                    <input
                      type="text"
                      value={pkgResortCodes}
                      onChange={(e) => setPkgResortCodes(e.target.value)}
                      placeholder="AH-112, AH-121"
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Tagline</label>
                  <input
                    type="text"
                    value={pkgTagline}
                    onChange={(e) => setPkgTagline(e.target.value)}
                    placeholder="Short catchy feature highlight"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Inclusions (One per line)
                  </label>
                  <textarea
                    rows={4}
                    value={pkgInclusions}
                    onChange={(e) => setPkgInclusions(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={pkgDescription}
                    onChange={(e) => setPkgDescription(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPkgModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-stone-600 bg-stone-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-[#2E4F28] hover:bg-[#233D1F] rounded-xl shadow-sm"
                  >
                    Save &amp; Publish Package
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= BLOG MODAL ================= */}
        {isBlogModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <h3 className="text-base font-black text-stone-900">
                  {editingBlog ? "Edit Blog Article" : "Add New Blog Article"}
                </h3>
                <button onClick={() => setIsBlogModalOpen(false)}>
                  <X className="w-5 h-5 text-stone-400" />
                </button>
              </div>

              <form onSubmit={handleSaveBlog} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Article Title</label>
                  <input
                    type="text"
                    required
                    value={blogTitle}
                    onChange={(e) => setBlogTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Category</label>
                    <input
                      type="text"
                      value={blogCategory}
                      onChange={(e) => setBlogCategory(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Read Time</label>
                    <input
                      type="text"
                      value={blogReadTime}
                      onChange={(e) => setBlogReadTime(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Short Excerpt</label>
                  <textarea
                    rows={2}
                    required
                    value={blogExcerpt}
                    onChange={(e) => setBlogExcerpt(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Full Article Content</label>
                  <textarea
                    rows={6}
                    required
                    value={blogContent}
                    onChange={(e) => setBlogContent(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsBlogModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-stone-600 bg-stone-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-stone-900 hover:bg-black rounded-xl shadow-sm"
                  >
                    Publish Blog Post
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= REVIEW MODAL ================= */}
        {isReviewModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <h3 className="text-base font-black text-stone-900">
                  {editingReview ? "Edit Client Testimonial" : "Add Client Testimonial"}
                </h3>
                <button onClick={() => setIsReviewModalOpen(false)}>
                  <X className="w-5 h-5 text-stone-400" />
                </button>
              </div>

              <form onSubmit={handleSaveReview} className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Client Name</label>
                    <input
                      type="text"
                      required
                      value={revName}
                      onChange={(e) => setRevName(e.target.value)}
                      placeholder="e.g. Rahul & Neha"
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Location / Origin</label>
                    <input
                      type="text"
                      required
                      value={revLocation}
                      onChange={(e) => setRevLocation(e.target.value)}
                      placeholder="e.g. Bangalore"
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Star Rating (1-5)</label>
                    <select
                      value={revRating}
                      onChange={(e) => setRevRating(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 focus:outline-none"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                      <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                      <option value={3}>⭐⭐⭐ (3 Stars)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Package or Villa Code</label>
                    <input
                      type="text"
                      required
                      value={revPackage}
                      onChange={(e) => setRevPackage(e.target.value)}
                      placeholder="e.g. Honeymoon Private Pool Villa (AH-112)"
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Review Comments</label>
                  <textarea
                    rows={4}
                    required
                    value={revReview}
                    onChange={(e) => setRevReview(e.target.value)}
                    placeholder="What did the client say about their holiday experience?"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsReviewModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-stone-600 bg-stone-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-xl shadow-sm"
                  >
                    Save Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
