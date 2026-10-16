import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#FAF8F5] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Get In Touch
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mt-1">
              Contact Aston Holidays
            </h1>
            <p className="text-sm text-stone-500 mt-2">
              Our travel desk in Sulthan Bathery is ready to assist you with resort reservations, customized family packages, and B2B partnerships.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Contact Details Card */}
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 shadow-sm space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-stone-900">Head Office</h2>
                <p className="text-xs text-stone-500 mt-1">Visit our local operations desk or call anytime</p>
              </div>

              <div className="space-y-6 text-sm text-stone-700">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider">Address</h3>
                    <p className="text-stone-600 mt-0.5">
                      Aston Holidays, Kolagappara, Beenachi,<br />
                      Sulthan Bathery, Wayanad - 673592, Kerala, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider">Direct Calls & WhatsApp</h3>
                    <p className="text-stone-600 mt-0.5 font-medium">+91 97449 00414</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider">Email Inquiry</h3>
                    <p className="text-stone-600 mt-0.5">info@astonholidays.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wider">Working Hours</h3>
                    <p className="text-stone-600 mt-0.5">Monday - Friday: 8:30 AM - 8:00 PM</p>
                    <p className="text-stone-600">Saturday & Sunday: 9:30 AM - 9:30 PM</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100">
                <a
                  href="https://wa.me/919744900414?text=Hi%20Aston%20Holidays,%20I%20have%20an%20inquiry%20regarding%20resorts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#2E4F28] hover:bg-[#233D1F] text-white font-bold py-3.5 rounded-xl shadow transition"
                >
                  <MessageCircle className="w-4 h-4" /> Start Direct WhatsApp Chat
                </a>
              </div>
            </div>

            {/* Quick Inquiry Form */}
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 shadow-sm">
              <h2 className="text-2xl font-bold text-stone-900 mb-2">Send an Inquiry</h2>
              <p className="text-xs text-stone-500 mb-6">Fill in your requirements and we will send recommendations directly to your phone.</p>

              <form action="/api/v1/leads" method="POST" className="space-y-4 text-xs font-medium">
                <div>
                  <label className="block text-stone-700 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    name="customerName"
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 mb-1">Phone Number (with WhatsApp)</label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    placeholder="+91 98470 00000"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-700 mb-1">Preferred Location</label>
                    <select
                      name="destination"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 bg-white"
                    >
                      <option value="Padinjarathara">Padinjarathara (Banasura)</option>
                      <option value="Vythiri">Vythiri</option>
                      <option value="Meppadi">Meppadi</option>
                      <option value="Sulthan Bathery">Sulthan Bathery</option>
                      <option value="Kalpetta">Kalpetta</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-700 mb-1">Number of Guests</label>
                    <input
                      type="number"
                      name="guestsCount"
                      defaultValue={2}
                      min={1}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 mb-1">Notes / Preferences</label>
                  <textarea
                    rows={3}
                    name="notes"
                    placeholder="e.g. Need private pool villa for anniversary, campfire option"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 bg-stone-900 hover:bg-black text-white font-bold py-3 rounded-xl transition shadow"
                >
                  <Send className="w-3.5 h-3.5" /> Submit Inquiry
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
