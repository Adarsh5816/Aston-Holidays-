"use client";

import React, { useState } from "react";
import { BlogPost } from "@/lib/types";
import {
  BookOpen,
  Clock,
  Calendar,
  Sparkles,
  ArrowRight,
  X,
  Share2,
  Check
} from "lucide-react";

interface LiveBlogTickerProps {
  blogs: BlogPost[];
}

export default function LiveBlogTickerSection({ blogs }: LiveBlogTickerProps) {
  const [activeModalBlog, setActiveModalBlog] = useState<BlogPost | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Duplicate for seamless infinite loop
  const marqueeBlogs = [...blogs, ...blogs, ...blogs];

  const handleCopy = (slug: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}/#blog-${slug}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <section className="py-20 bg-stone-900 text-white relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#34D399_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Live News &amp; Travel Journals
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Our Latest Blogs &amp; Stories
            </h2>
            <p className="text-stone-400 text-xs sm:text-sm mt-1 max-w-lg">
              Fresh insights on monsoon trails, ancient rock art, and culinary secrets from our Wayanad destination experts.
            </p>
          </div>

          <div className="text-xs text-stone-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Hover card to pause scrolling • Click any article to read</span>
          </div>
        </div>
      </div>

      {/* Continuous Scrolling Marquee */}
      <div className="relative py-4">
        {/* Edge Fade Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-stone-900 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-stone-900 to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee gap-6">
          {marqueeBlogs.map((b, idx) => (
            <div
              key={`${b.id}-${idx}`}
              onClick={() => setActiveModalBlog(b)}
              className="w-80 sm:w-96 flex-shrink-0 bg-stone-800/80 hover:bg-stone-800 rounded-3xl p-6 border border-stone-700/70 hover:border-emerald-500/60 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                    {b.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-stone-400">
                    <Clock className="w-3 h-3 text-stone-500" />
                    <span>{b.readTime}</span>
                  </div>
                </div>

                <h3 className="text-base font-extrabold text-white group-hover:text-emerald-300 transition line-clamp-2 leading-snug">
                  {b.title}
                </h3>

                <p className="text-xs text-stone-400 mt-2 line-clamp-3 leading-relaxed font-serif">
                  {b.excerpt}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-stone-700/60 flex items-center justify-between text-[11px] text-stone-400">
                <span className="flex items-center gap-1 text-stone-400">
                  <Calendar className="w-3 h-3 text-stone-500" /> {b.date}
                </span>

                <span className="inline-flex items-center gap-1 text-emerald-400 font-bold group-hover:translate-x-1 transition-transform">
                  Read Article <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Modal Article Reader */}
      {activeModalBlog && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[85vh] overflow-y-auto text-white shadow-2xl relative">
            <button
              onClick={() => setActiveModalBlog(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                {activeModalBlog.category}
              </span>
              <span className="text-xs text-stone-400">{activeModalBlog.readTime}</span>
              <span className="text-xs text-stone-500">• {activeModalBlog.date}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight mb-4">
              {activeModalBlog.title}
            </h2>

            <div className="p-4 rounded-2xl bg-stone-800/60 border border-stone-700/60 mb-6 text-xs text-emerald-300 font-medium">
              ✍️ By {activeModalBlog.author} • Aston Holidays Wayanad Editorial
            </div>

            <div className="space-y-4 text-stone-300 text-sm leading-relaxed font-serif">
              <p className="text-base text-stone-200 font-medium">{activeModalBlog.excerpt}</p>
              <p>{activeModalBlog.content}</p>
              <p>
                To reserve verified stays near this landmark or experience private campfire evenings with bespoke transfers, reach out to our travel desk directly.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-stone-800 flex items-center justify-between">
              <button
                onClick={() => handleCopy(activeModalBlog.slug)}
                className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-white transition"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                {copiedLink ? "Link Copied!" : "Share Article"}
              </button>

              <button
                onClick={() => setActiveModalBlog(null)}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
