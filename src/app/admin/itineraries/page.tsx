"use client";

import React, { useState, useEffect, Suspense } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import ItineraryVoucherModal from "@/components/ItineraryVoucherModal";
import { PackageItineraryBooking, Resort, ItineraryDay, RoomBookingItem, VehicleBookingItem, OtherExpenseItem } from "@/lib/types";
import {
  Compass,
  Plus,
  Search,
  BedDouble,
  Car,
  Receipt,
  Eye,
  Trash2,
  Calendar,
  X,
  Sparkles,
  Edit3,
  CheckCircle2,
  Phone,
  MessageCircle,
  Clock,
  MapPin,
  ChevronRight,
  FileText,
  Printer,
  ShieldCheck,
  RotateCcw,
  AlertTriangle,
  Save,
  Building2,
  Loader2
} from "lucide-react";

const DRAFT_STORAGE_KEY = "aston_wip_itinerary_draft_v1";
const LOCAL_BOOKINGS_BACKUP_KEY = "aston_persistent_package_bookings_v1";

// Calculate exact nights between checkIn and checkOut (e.g. 22nd to 23rd Oct = 1 Night stay)
const calculateNightsBetween = (startStr: string, endStr: string): number => {
  if (!startStr || !endStr) return 1;
  const d1 = new Date(startStr);
  const d2 = new Date(endStr);
  const diffTime = d2.getTime() - d1.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 1;
};

function ItinerariesContent() {
  const [bookings, setBookings] = useState<PackageItineraryBooking[]>([]);
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<PackageItineraryBooking | null>(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [recoveredDraft, setRecoveredDraft] = useState<any | null>(null);
  const [lastAutoSavedAt, setLastAutoSavedAt] = useState<string | null>(null);

  // Quick Add Resort to Inventory State (Hand-in-Hand Sync)
  const [isQuickAddResortOpen, setIsQuickAddResortOpen] = useState(false);
  const [quickAddTargetRoomIdx, setQuickAddTargetRoomIdx] = useState<number>(-1);
  const [qaName, setQaName] = useState("");
  const [qaCode, setQaCode] = useState("");
  const [qaDestination, setQaDestination] = useState("Vythiri");
  const [qaCustomDestination, setQaCustomDestination] = useState("");
  const [qaRoomType, setQaRoomType] = useState("Private Pool Villa");
  const [qaPricePerNight, setQaPricePerNight] = useState(12500);
  const [qaB2bRate, setQaB2bRate] = useState(9500);
  const [qaAccommodationType, setQaAccommodationType] = useState<Resort["accommodationType"]>("Private Pool Villa");
  const [qaStayPreference, setQaStayPreference] = useState<Resort["stayPreference"]>("Independent Private Cottage/Villa");
  const [qaLocationDetails, setQaLocationDetails] = useState("Vythiri, Wayanad, Kerala");
  const [qaGoogleMapsUrl, setQaGoogleMapsUrl] = useState("");
  const [qaCoverImage, setQaCoverImage] = useState("");
  const [qaMaxAdults, setQaMaxAdults] = useState(2);
  const [qaMaxChildren, setQaMaxChildren] = useState(0);
  const [isSavingResort, setIsSavingResort] = useState(false);
  const [quickResortCreatedNotice, setQuickResortCreatedNotice] = useState("");

  // Form State
  const [packageTitle, setPackageTitle] = useState("Romantic Misty Wayanad & Private Pool Escape");
  const [category, setCategory] = useState<PackageItineraryBooking["category"]>("Honey Moon Package");
  const [duration, setDuration] = useState("3 Days / 2 Nights");
  const [startDate, setStartDate] = useState("2026-11-15");
  const [endDate, setEndDate] = useState("2026-11-17");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  // Itinerary Days
  const [itineraryDays, setItineraryDays] = useState<ItineraryDay[]>([
    {
      dayNumber: 1,
      title: "Calicut Pickup & Scenic Rainforest Ascent to Wayanad",
      activities: "Chauffeur pickup from Calicut Railway Station / Airport. Scenic drive through Thamarassery Churam mountain pass with viewpoints. Check-in to private pool villa. Evening leisurely poolside dip and welcome plantation tea.",
      sightseeing: ["Lakkidi View Point", "Pookode Freshwater Lake", "Thamarassery Ghats"],
      mealsIncluded: { breakfast: false, lunch: true, dinner: true },
      stayDestination: "Padinjarathara",
      stayResortCode: "AH-112"
    },
    {
      dayNumber: 2,
      title: "Banasura Sagar Dam Boating & Candlelight Dinner by the Pool",
      activities: "Morning breakfast with estate fresh coffee. Visit Banasura Sagar earthen dam with speed boat excursion. Afternoon visit to Karlad Adventure Lake. Evening exclusive romantic candlelight dinner setup by the pool with rose petals.",
      sightseeing: ["Banasura Sagar Dam", "Karlad Adventure Lake", "Meenmutty Waterfalls"],
      mealsIncluded: { breakfast: true, lunch: false, dinner: true },
      stayDestination: "Padinjarathara",
      stayResortCode: "AH-112"
    },
    {
      dayNumber: 3,
      title: "Tea Plantation Walk, Spice Shopping & Calicut Drop",
      activities: "Early morning sunrise walk through tea estate paths. Leisurely breakfast and pool dip. Check-out at 11:00 AM. Visit Wayanad Tea Museum and local spice market at Kalpetta for authentic cardamom & pepper. Comfortable drive back and drop at Calicut.",
      sightseeing: ["Tea Museum & Factory", "Kalpetta Heritage Spice Market", "Chain Tree"],
      mealsIncluded: { breakfast: true, lunch: true, dinner: false },
      stayDestination: "Calicut Drop"
    }
  ]);

  // Rooms Booking (Auto-connected with resorts)
  const [rooms, setRooms] = useState<RoomBookingItem[]>([
    {
      id: "room-1",
      resortCode: "AH-112",
      resortName: "2BHK Private Pool Villa",
      roomType: "Luxury Private Pool Villa",
      destination: "Padinjarathara",
      checkIn: "2026-11-15",
      checkOut: "2026-11-17",
      nights: 2,
      roomsCount: 1,
      adultsCount: 2,
      childrenCount: 0,
      ratePerNight: 12500,
      totalAmount: 25000,
      mealPlan: "CP (Bed & Breakfast)",
      specialRequests: "Rose petal bed decoration"
    }
  ]);

  // Vehicle Booking
  const [vehicle, setVehicle] = useState<VehicleBookingItem>({
    id: "veh-1",
    enabled: true,
    vehicleType: "Sedan (Dzire / Etios)",
    pricingModel: "package_km_extra",
    vehicleNumber: "KL-12-AE-4819",
    driverName: "Suresh Babu",
    driverPhone: "+91 97455 12840",
    pickupLocation: "Calicut Airport / Railway Station",
    dropLocation: "Calicut Railway Station",
    pickupDate: "2026-11-15",
    dropDate: "2026-11-17",
    totalDays: 3,
    ratePerDay: 2600,
    driverBatta: 400,
    startKmReading: 42100,
    endKmReading: 42480,
    totalKmCovered: 380,
    baseKmIncluded: 300,
    ratePerKm: 14,
    extraKmCovered: 80,
    extraKmRate: 15,
    extraKmAmount: 1200,
    tollAndParking: 0,
    totalAmount: 10200,
    dutyNotes: "Driver will report at Calicut Airport at 09:30 AM with guest name placard."
  });

  // Other Expenses & Interactive Notepad
  const [otherExpenses, setOtherExpenses] = useState<OtherExpenseItem[]>([
    {
      id: "exp-1",
      category: "Candlelight Dinner",
      title: "5-Course Romantic Candlelight Dinner by the Pool",
      rate: 3500,
      quantity: 1,
      totalAmount: 3500,
      notepadContent: "Client requested pure vegetarian Continental menu, heart-shaped chocolate truffle cake (eggless), and candle lanterns around the pool edge.",
      showInVoucher: true
    }
  ]);

  const [notepadNotes, setNotepadNotes] = useState(
    "VIP Honeymoon couple. Ensure villa manager provides warm welcome with fresh tender coconut on arrival."
  );

  // Financials
  const [discount, setDiscount] = useState(0);
  const [gstRate, setGstRate] = useState(0);
  const [advancePaid, setAdvancePaid] = useState(10000);
  const [paymentStatus, setPaymentStatus] = useState<PackageItineraryBooking["paymentStatus"]>("Advance Received");

  // Check for recovered draft on mount
  useEffect(() => {
    try {
      const savedDraftStr = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (savedDraftStr) {
        const draft = JSON.parse(savedDraftStr);
        if (draft && (draft.customerName || draft.customerPhone || draft.editingId || draft.packageTitle !== "Romantic Misty Wayanad & Private Pool Escape")) {
          setRecoveredDraft(draft);
        }
      }
    } catch (e) {
      console.warn("Could not load itinerary draft:", e);
    }
  }, []);

  // Exit guard: warn user if navigating away with builder open
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isBuilderOpen) {
        e.preventDefault();
        e.returnValue = "You have an unsaved itinerary in progress. All changes are auto-saved in your browser, but please confirm if you wish to close.";
        return e.returnValue;
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isBuilderOpen]);

  // Real-time auto-save whenever builder is open
  useEffect(() => {
    if (!isBuilderOpen) return;
    const now = new Date().toISOString();
    const draftPayload = {
      editingId,
      packageTitle,
      category,
      duration,
      startDate,
      endDate,
      customerName,
      customerPhone,
      customerEmail,
      customerAddress,
      adults,
      children,
      itineraryDays,
      rooms,
      vehicle,
      otherExpenses,
      notepadNotes,
      discount,
      gstRate,
      advancePaid,
      paymentStatus,
      savedAt: now
    };
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftPayload));
      setLastAutoSavedAt(now);
    } catch (e) {
      console.warn("Could not auto-save itinerary draft:", e);
    }
  }, [
    isBuilderOpen,
    editingId,
    packageTitle,
    category,
    duration,
    startDate,
    endDate,
    customerName,
    customerPhone,
    customerEmail,
    customerAddress,
    adults,
    children,
    itineraryDays,
    rooms,
    vehicle,
    otherExpenses,
    notepadNotes,
    discount,
    gstRate,
    advancePaid,
    paymentStatus
  ]);

  const applyRecoveredDraft = () => {
    if (!recoveredDraft) return;
    setEditingId(recoveredDraft.editingId || null);
    setPackageTitle(recoveredDraft.packageTitle || "Romantic Misty Wayanad & Private Pool Escape");
    setCategory(recoveredDraft.category || "Honey Moon Package");
    setDuration(recoveredDraft.duration || "3 Days / 2 Nights");
    setStartDate(recoveredDraft.startDate || "2026-11-15");
    setEndDate(recoveredDraft.endDate || "2026-11-17");
    setCustomerName(recoveredDraft.customerName || "");
    setCustomerPhone(recoveredDraft.customerPhone || "");
    setCustomerEmail(recoveredDraft.customerEmail || "");
    setCustomerAddress(recoveredDraft.customerAddress || "");
    setAdults(recoveredDraft.adults ?? 2);
    setChildren(recoveredDraft.children ?? 0);
    if (recoveredDraft.itineraryDays?.length) setItineraryDays(recoveredDraft.itineraryDays);
    if (recoveredDraft.rooms?.length) setRooms(recoveredDraft.rooms);
    if (recoveredDraft.vehicle) setVehicle(recoveredDraft.vehicle);
    if (recoveredDraft.otherExpenses) setOtherExpenses(recoveredDraft.otherExpenses);
    if (recoveredDraft.notepadNotes) setNotepadNotes(recoveredDraft.notepadNotes);
    setDiscount(recoveredDraft.discount ?? 0);
    setGstRate(recoveredDraft.gstRate ?? 5);
    setAdvancePaid(recoveredDraft.advancePaid ?? 10000);
    setPaymentStatus(recoveredDraft.paymentStatus || "Advance Received");
    setIsBuilderOpen(true);
    setRecoveredDraft(null);
  };

  const discardRecoveredDraft = () => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {}
    setRecoveredDraft(null);
  };

  // Load bookings with dual-vault persistence (Server + LocalStorage Backup)
  const loadData = async () => {
    try {
      // 1. Read local backup
      let localSaved: PackageItineraryBooking[] = [];
      try {
        const localStr = localStorage.getItem(LOCAL_BOOKINGS_BACKUP_KEY);
        if (localStr) localSaved = JSON.parse(localStr);
      } catch {}

      const [bRes, rRes] = await Promise.all([
        fetch("/api/v1/itineraries"),
        fetch("/api/v1/resorts")
      ]);

      let serverBookings: PackageItineraryBooking[] = [];
      if (bRes.ok) {
        serverBookings = await bRes.json();
      }

      // Merge: Any booking saved locally that is missing on server is preserved
      const mergedMap = new Map<string, PackageItineraryBooking>();
      serverBookings.forEach(b => mergedMap.set(b.id, b));
      const missingOnServer: PackageItineraryBooking[] = [];
      localSaved.forEach(b => {
        if (!mergedMap.has(b.id)) {
          mergedMap.set(b.id, b);
          missingOnServer.push(b);
        }
      });

      const mergedList = Array.from(mergedMap.values());
      setBookings(mergedList);

      try {
        localStorage.setItem(LOCAL_BOOKINGS_BACKUP_KEY, JSON.stringify(mergedList));
      } catch {}

      // Auto re-sync missing bookings to backend
      if (missingOnServer.length > 0) {
        console.log(`[Zero-Data-Loss] Syncing ${missingOnServer.length} local bookings to server...`);
        missingOnServer.forEach(b => {
          fetch("/api/v1/itineraries", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(b)
          }).catch(err => console.warn("Background sync error:", err));
        });
      }

      if (rRes.ok) {
        const rData = await rRes.json();
        setResorts(rData);
      }
    } catch (e) {
      console.error("Error loading itineraries:", e);
      // Fallback to local storage if network glitch
      try {
        const localStr = localStorage.getItem(LOCAL_BOOKINGS_BACKUP_KEY);
        if (localStr) setBookings(JSON.parse(localStr));
      } catch {}
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Financial calculations
  const roomsSubtotal = rooms.reduce((acc, r) => acc + (r.totalAmount || 0), 0);
  const vehicleSubtotal = vehicle.enabled ? (vehicle.totalAmount || 0) : 0;
  const otherExpensesSubtotal = otherExpenses.reduce((acc, e) => acc + (e.totalAmount || 0), 0);
  const grossTotal = roomsSubtotal + vehicleSubtotal + otherExpensesSubtotal;
  const taxableAmount = Math.max(0, grossTotal - discount);
  const gstAmount = Math.round((taxableAmount * gstRate) / 100);
  const netPayable = taxableAmount + gstAmount;
  const balanceDue = Math.max(0, netPayable - advancePaid);

  // Helper to compute vehicle total across Daily, Per KM, and Package KM + Extra KM
  const computeVehicleTotal = (v: Partial<VehicleBookingItem>): { totalAmount: number; extraKmCovered: number; extraKmAmount: number } => {
    const days = v.totalDays || 1;
    const batta = (v.driverBatta || 0) * days;
    const toll = v.tollAndParking || 0;
    const model = v.pricingModel || "daily";

    if (model === "per_km") {
      const km = v.totalKmCovered || 0;
      const rateKm = v.ratePerKm || 0;
      const kmCost = km * rateKm;
      return {
        totalAmount: kmCost + batta + toll,
        extraKmCovered: 0,
        extraKmAmount: 0
      };
    } else if (model === "package_km_extra") {
      const baseCost = (v.ratePerDay || 0) * days;
      const totalKm = v.totalKmCovered || 0;
      const baseKm = v.baseKmIncluded || 0;
      const extraKm = Math.max(0, totalKm - baseKm);
      const extraRate = v.extraKmRate || 0;
      const extraCost = extraKm * extraRate;
      return {
        totalAmount: baseCost + extraCost + batta + toll,
        extraKmCovered: extraKm,
        extraKmAmount: extraCost
      };
    } else {
      const dailyCost = (v.ratePerDay || 0) * days;
      return {
        totalAmount: dailyCost + batta + toll,
        extraKmCovered: 0,
        extraKmAmount: 0
      };
    }
  };

  const updateVehicle = (updates: Partial<VehicleBookingItem>) => {
    const merged = { ...vehicle, ...updates };

    // Auto-calculate totalKmCovered if startKmReading and endKmReading are present
    if (merged.startKmReading !== undefined && merged.endKmReading !== undefined && merged.endKmReading >= merged.startKmReading) {
      if (updates.endKmReading !== undefined || updates.startKmReading !== undefined) {
        merged.totalKmCovered = merged.endKmReading - merged.startKmReading;
      }
    }

    const { totalAmount, extraKmCovered, extraKmAmount } = computeVehicleTotal(merged);
    merged.totalAmount = totalAmount;
    merged.extraKmCovered = extraKmCovered;
    merged.extraKmAmount = extraKmAmount;
    setVehicle(merged);
  };

  // Generate next sequential resort code
  const generateNextResortCode = () => {
    let highest = 120;
    resorts.forEach((r) => {
      const match = r.code.match(/AH-(\d+)/i);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > highest) highest = num;
      }
    });
    return `AH-${highest + 1}`;
  };

  // Open Quick Add Resort Modal
  const openQuickAddResortModal = (roomIdx: number = -1) => {
    setQuickAddTargetRoomIdx(roomIdx);
    const nextCode = generateNextResortCode();
    setQaCode(nextCode);
    setQaName("");
    setQaDestination("Vythiri");
    setQaCustomDestination("");
    setQaRoomType("Luxury Private Pool Villa");
    setQaPricePerNight(12500);
    setQaB2bRate(9500);
    setQaAccommodationType("Private Pool Villa");
    setQaStayPreference("Independent Private Cottage/Villa");
    setQaLocationDetails("Vythiri, Wayanad, Kerala");
    setQaGoogleMapsUrl("");
    setQaCoverImage("");
    setQaMaxAdults(adults || 2);
    setQaMaxChildren(children || 0);
    setIsQuickAddResortOpen(true);
  };

  // Quick Create Resort in Inventory & Auto-assign to Itinerary
  const handleQuickCreateResort = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qaName.trim()) return;
    setIsSavingResort(true);

    const finalCode = qaCode.trim().toUpperCase() || generateNextResortCode();
    const finalDestination = qaDestination === "Other" && qaCustomDestination.trim()
      ? qaCustomDestination.trim()
      : qaDestination.trim();
    const slug = `${finalCode}-${qaName.trim()}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const newResort: Resort = {
      id: `res-${Date.now()}`,
      code: finalCode,
      name: qaName.trim(),
      slug,
      destination: finalDestination,
      locationDetails: qaLocationDetails.trim() || `${finalDestination}, Wayanad, Kerala`,
      googleMapsUrl: qaGoogleMapsUrl.trim() || `https://maps.google.com/?q=${encodeURIComponent(qaName.trim() + " " + finalDestination)}`,
      accommodationType: qaAccommodationType,
      stayPreference: qaStayPreference,
      ambience: ["Mountain / Valley View", "Romantic / Honeymoon", "Secluded & Peaceful"],
      category: qaAccommodationType === "Private Pool Villa" ? "Pool Villa" : qaAccommodationType === "Tree House" ? "Tree House" : "Luxury Resort",
      bedrooms: 1,
      bathrooms: 1,
      maxAdults: Number(qaMaxAdults) || 2,
      maxChildren: Number(qaMaxChildren) || 1,
      maxGuests: (Number(qaMaxAdults) || 2) + (Number(qaMaxChildren) || 1),
      pricePerNight: Number(qaPricePerNight) || 10000,
      b2bRate: Number(qaB2bRate) || Math.round((Number(qaPricePerNight) || 10000) * 0.75),
      featured: false,
      coverImage: qaCoverImage.trim() || "/brand/hero.png",
      photos: [qaCoverImage.trim() || "/brand/hero.png"],
      amenities: ["Swimming Pool", "Mountain View", "Wi-Fi", "Room Service", "Power Backup"],
      specialities: ["Scenic View", "Peaceful Location"],
      checkInTime: "01:00 PM",
      checkOutTime: "11:00 AM",
      overview: `${qaName.trim()} is an exclusive property in ${finalDestination}, offering premium hospitality, pristine nature surroundings, and personalized service.`,
      inclusions: ["Welcome drink on arrival", "Complimentary breakfast", "Free Wi-Fi access"],
      exclusions: ["Personal expenses", "Any extra meals not in plan"],
      nearbyAttractions: []
    };

    try {
      await fetch("/api/v1/resorts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newResort)
      });

      // Update local resorts list
      const updatedResorts = [...resorts, newResort];
      setResorts(updatedResorts);

      // Link to room
      if (quickAddTargetRoomIdx >= 0 && quickAddTargetRoomIdx < rooms.length) {
        handleUpdateRoom(quickAddTargetRoomIdx, {
          resortCode: newResort.code,
          resortName: newResort.name,
          destination: newResort.destination,
          roomType: qaRoomType.trim() || newResort.name,
          ratePerNight: newResort.pricePerNight
        });
      } else {
        // Add new room with this resort
        const initialNights = calculateNightsBetween(startDate, endDate);
        const newRoomItem: RoomBookingItem = {
          id: `room-${Date.now()}`,
          resortCode: newResort.code,
          resortName: newResort.name,
          roomType: qaRoomType.trim() || newResort.name,
          destination: newResort.destination,
          checkIn: startDate,
          checkOut: endDate,
          nights: initialNights,
          roomsCount: 1,
          adultsCount: adults,
          childrenCount: children,
          ratePerNight: newResort.pricePerNight,
          totalAmount: newResort.pricePerNight * initialNights,
          mealPlan: "CP (Bed & Breakfast)",
          specialRequests: ""
        };
        setRooms([...rooms, newRoomItem]);
      }

      setIsQuickAddResortOpen(false);
      setQuickResortCreatedNotice(`Resort [${newResort.code}] ${newResort.name} added to inventory and linked to this package!`);
      setTimeout(() => setQuickResortCreatedNotice(""), 6000);
    } catch (err) {
      console.error("Failed to save resort to inventory:", err);
    } finally {
      setIsSavingResort(false);
    }
  };

  // Add room
  const handleAddRoom = () => {
    const defaultResort = resorts[0] || { code: "AH-121", name: "3BHK Villa", destination: "Padinjarathara", pricePerNight: 14500 };
    const initialNights = calculateNightsBetween(startDate, endDate);
    const newRoom: RoomBookingItem = {
      id: `room-${Date.now()}`,
      resortCode: defaultResort.code,
      resortName: defaultResort.name,
      roomType: "Private Pool Villa",
      destination: defaultResort.destination,
      checkIn: startDate,
      checkOut: endDate,
      nights: initialNights,
      roomsCount: 1,
      adultsCount: adults,
      childrenCount: children,
      ratePerNight: defaultResort.pricePerNight,
      totalAmount: defaultResort.pricePerNight * initialNights,
      mealPlan: "CP (Bed & Breakfast)",
      specialRequests: ""
    };
    setRooms([...rooms, newRoom]);
  };

  const handleUpdateRoom = (idx: number, updates: Partial<RoomBookingItem>) => {
    const updated = [...rooms];
    const current = { ...updated[idx], ...updates };
    
    // Auto sync with resort details if resortCode changed
    if (updates.resortCode && updates.resortCode !== updated[idx].resortCode) {
      const found = resorts.find(r => r.code === updates.resortCode);
      if (found) {
        current.resortName = found.name;
        current.destination = found.destination;
        current.ratePerNight = found.pricePerNight;
      }
    }

    // Auto-calculate nights if checkIn or checkOut changed
    if (updates.checkIn !== undefined || updates.checkOut !== undefined) {
      const s = updates.checkIn !== undefined ? updates.checkIn : current.checkIn;
      const e = updates.checkOut !== undefined ? updates.checkOut : current.checkOut;
      current.nights = calculateNightsBetween(s, e);
    }
    
    current.totalAmount = (current.ratePerNight || 0) * (current.nights || 1) * (current.roomsCount || 1);
    updated[idx] = current;
    setRooms(updated);
  };

  const handleRemoveRoom = (idx: number) => {
    setRooms(rooms.filter((_, i) => i !== idx));
  };

  const handleStartDateChange = (newStart: string) => {
    setStartDate(newStart);
    if (newStart && endDate) {
      const calculatedNights = calculateNightsBetween(newStart, endDate);
      const calculatedDays = calculatedNights + 1;
      setDuration(`${calculatedDays} Days / ${calculatedNights} Night${calculatedNights > 1 ? "s" : ""}`);
      setRooms(prev => prev.map(r => {
        if (r.checkIn === startDate || prev.length === 1) {
          const n = calculateNightsBetween(newStart, r.checkOut || endDate);
          return {
            ...r,
            checkIn: newStart,
            nights: n,
            totalAmount: (r.ratePerNight || 0) * n * (r.roomsCount || 1)
          };
        }
        return r;
      }));
    }
  };

  const handleEndDateChange = (newEnd: string) => {
    setEndDate(newEnd);
    if (startDate && newEnd) {
      const calculatedNights = calculateNightsBetween(startDate, newEnd);
      const calculatedDays = calculatedNights + 1;
      setDuration(`${calculatedDays} Days / ${calculatedNights} Night${calculatedNights > 1 ? "s" : ""}`);
      setRooms(prev => prev.map(r => {
        if (r.checkOut === endDate || prev.length === 1) {
          const n = calculateNightsBetween(r.checkIn || startDate, newEnd);
          return {
            ...r,
            checkOut: newEnd,
            nights: n,
            totalAmount: (r.ratePerNight || 0) * n * (r.roomsCount || 1)
          };
        }
        return r;
      }));
    }
  };

  // Add Day to Itinerary
  const handleAddDay = () => {
    const nextDayNum = itineraryDays.length + 1;
    const newDay: ItineraryDay = {
      dayNumber: nextDayNum,
      title: `Day ${nextDayNum} Sightseeing & Wayanad Exploration`,
      activities: "Breakfast at stay. Scenic morning excursion to local waterfalls and viewpoints. Afternoon traditional lunch. Evening leisure time.",
      sightseeing: ["Chembra Peak", "Soochipara Falls"],
      mealsIncluded: { breakfast: true, lunch: false, dinner: true },
      stayDestination: "Wayanad",
      stayResortCode: rooms[0]?.resortCode || "AH-112"
    };
    setItineraryDays([...itineraryDays, newDay]);
  };

  const handleUpdateDay = (idx: number, updates: Partial<ItineraryDay>) => {
    const updated = [...itineraryDays];
    updated[idx] = { ...updated[idx], ...updates };
    setItineraryDays(updated);
  };

  const handleRemoveDay = (idx: number) => {
    const updated = itineraryDays.filter((_, i) => i !== idx).map((day, i) => ({
      ...day,
      dayNumber: i + 1
    }));
    setItineraryDays(updated);
  };

  // Add Other Expense
  const handleAddOtherExpense = () => {
    const newExp: OtherExpenseItem = {
      id: `exp-${Date.now()}`,
      category: "Other Custom Expense",
      title: "Special Experience / Activity",
      rate: 1500,
      quantity: 1,
      totalAmount: 1500,
      notepadContent: "Client requested custom arrangement. Contact vendor directly prior to arrival.",
      showInVoucher: true
    };
    setOtherExpenses([...otherExpenses, newExp]);
  };

  const handleUpdateOtherExpense = (idx: number, updates: Partial<OtherExpenseItem>) => {
    const updated = [...otherExpenses];
    const current = { ...updated[idx], ...updates };
    current.totalAmount = (current.rate || 0) * (current.quantity || 1);
    updated[idx] = current;
    setOtherExpenses(updated);
  };

  const handleRemoveOtherExpense = (idx: number) => {
    setOtherExpenses(otherExpenses.filter((_, i) => i !== idx));
  };

  // Save Package & Auto-Sync with Invoice / Booking
  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Partial<PackageItineraryBooking> = {
      id: editingId || undefined,
      bookingCode: editingId ? (bookings.find(b => b.id === editingId)?.bookingCode || undefined) : undefined,
      packageTitle,
      category,
      duration,
      startDate,
      endDate,
      customerName,
      customerPhone,
      customerEmail: customerEmail || undefined,
      customerAddress: customerAddress || undefined,
      totalGuests: { adults, children },
      itineraryDays,
      rooms,
      vehicle,
      otherExpenses,
      notepadNotes,
      roomsSubtotal,
      vehicleSubtotal,
      otherExpensesSubtotal,
      grossTotal,
      discount,
      taxableAmount,
      gstRate,
      gstAmount,
      netPayable,
      advancePaid,
      balanceDue,
      paymentStatus
    };

    try {
      const res = await fetch("/api/v1/itineraries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const saved = await res.json();
        let nextList: PackageItineraryBooking[];
        if (editingId) {
          nextList = bookings.map(b => b.id === editingId ? saved : b);
        } else {
          nextList = [saved, ...bookings];
        }
        setBookings(nextList);
        try {
          localStorage.setItem(LOCAL_BOOKINGS_BACKUP_KEY, JSON.stringify(nextList));
          localStorage.removeItem(DRAFT_STORAGE_KEY);
        } catch {}
        setRecoveredDraft(null);
        setIsBuilderOpen(false);
        setEditingId(null);
        setSelectedBooking(saved);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleEdit = (b: PackageItineraryBooking) => {
    setEditingId(b.id);
    setPackageTitle(b.packageTitle);
    setCategory(b.category);
    setDuration(b.duration);
    setStartDate(b.startDate);
    setEndDate(b.endDate);
    setCustomerName(b.customerName);
    setCustomerPhone(b.customerPhone);
    setCustomerEmail(b.customerEmail || "");
    setCustomerAddress(b.customerAddress || "");
    setAdults(b.totalGuests.adults);
    setChildren(b.totalGuests.children);
    setItineraryDays(b.itineraryDays);
    setRooms(b.rooms);
    setVehicle(b.vehicle);
    setOtherExpenses(b.otherExpenses);
    setNotepadNotes(b.notepadNotes);
    setDiscount(b.discount);
    setGstRate(b.gstRate);
    setAdvancePaid(b.advancePaid);
    setPaymentStatus(b.paymentStatus);
    setIsBuilderOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this itinerary & package booking?")) return;
    await fetch(`/api/v1/itineraries?id=${id}`, { method: "DELETE" });
    const nextList = bookings.filter(b => b.id !== id);
    setBookings(nextList);
    try {
      localStorage.setItem(LOCAL_BOOKINGS_BACKUP_KEY, JSON.stringify(nextList));
    } catch {}
    if (selectedBooking?.id === id) setSelectedBooking(null);
  };

  const handleDirectWhatsApp = (b: PackageItineraryBooking) => {
    let msg = `🌟 *ASTON HOLIDAYS - TOUR ITINERARY & VOUCHER* 🌟\n\n`;
    msg += `Dear *${b.customerName}*,\n`;
    msg += `Here is your confirmed itinerary & stay package for Wayanad!\n\n`;
    msg += `🔖 *Booking Code:* ${b.bookingCode}\n`;
    msg += `📦 *Package:* ${b.packageTitle}\n`;
    msg += `⏳ *Duration:* ${b.duration} (${b.startDate} to ${b.endDate})\n`;
    msg += `👥 *Guests:* ${b.totalGuests.adults} Adults, ${b.totalGuests.children} Children\n\n`;
    if (b.rooms.length > 0) {
      msg += `🏨 *STAY:* ${b.rooms.map(r => `${r.resortCode} - ${r.roomType || r.resortName} (${r.nights}N)`).join(", ")}\n`;
    }
    if (b.vehicle && b.vehicle.enabled) {
      msg += `🚗 *CAB:* ${b.vehicle.vehicleType} (${b.vehicle.pickupLocation} to ${b.vehicle.dropLocation})\n`;
    }
    msg += `\n💰 *Total Package:* ₹${b.netPayable.toLocaleString("en-IN")}\n`;
    msg += `💰 *Advance Paid:* ₹${b.advancePaid.toLocaleString("en-IN")}\n`;
    msg += `💰 *Balance Due:* ₹${b.balanceDue.toLocaleString("en-IN")}\n\n`;
    msg += `📞 Need any assistance? Call desk: +91 97449 00414\n`;
    msg += `🌿 *Aston Holidays - Curated Wayanad Escapes*`;

    const cleanPhone = b.customerPhone.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const filtered = bookings.filter(b =>
    b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.bookingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.packageTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F5F6F8] print:bg-white print:min-h-0 print:block">
      <div className={selectedBooking ? "print:hidden no-print" : ""}>
        <AdminSidebar />
      </div>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto w-full print:p-0 print:m-0 print:overflow-visible print:block">
        <div className={`dashboard-background-content ${selectedBooking ? "print:hidden no-print" : ""}`}>
          {/* Unsaved Draft Recovery Banner */}
          {recoveredDraft && !isBuilderOpen && (
            <div className="mb-6 bg-gradient-to-r from-[#1A2E1A] to-[#253923] text-white p-4 sm:p-5 rounded-2xl shadow-xl border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top duration-300">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-black tracking-wider text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                      Work In Progress Preserved
                    </span>
                    <span className="text-xs text-stone-300">
                      {recoveredDraft.savedAt ? `Auto-saved at ${new Date(recoveredDraft.savedAt).toLocaleTimeString()}` : "Protected from data loss"}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-white mt-1">
                    Unsaved Itinerary: <span className="text-emerald-300">{recoveredDraft.customerName ? `${recoveredDraft.customerName} • ` : ""}{recoveredDraft.packageTitle}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <button
                  type="button"
                  onClick={discardRecoveredDraft}
                  className="px-3 py-1.5 text-xs font-semibold text-stone-300 hover:text-white hover:bg-white/10 rounded-lg transition"
                >
                  Discard Draft
                </button>
                <button
                  type="button"
                  onClick={applyRecoveredDraft}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-stone-900 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition shadow active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Resume Editing & Save
                </button>
              </div>
            </div>
          )}

          {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
                Package & Itinerary Studio
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md">
                Auto-Synced with Bookings
              </span>
            </div>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight mt-1">
              Itinerary & Package Builder
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Create day-by-day itineraries, auto-connect room bookings from inventory, manage cabs & other expenses with interactive notepads, and generate individual vouchers & bills.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingId(null);
              setIsBuilderOpen(true);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#2E4F28] hover:bg-[#233D1F] px-4 py-2.5 rounded-xl transition shadow-sm"
          >
            <Plus className="w-4 h-4" /> Create New Itinerary & Package
          </button>
        </div>

        {/* Search Bar */}
        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer name, booking code, or package title..."
              className="w-full text-xs font-medium pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 bg-white"
            />
          </div>
          <span className="text-xs text-stone-500 font-medium">
            Showing {filtered.length} package bookings
          </span>
        </div>

        {/* ================= MOBILE CARD VIEW (< md) ================= */}
        <div className="md:hidden space-y-3 mt-5">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-xs text-stone-500">
              No bookings found matching your search.
            </div>
          ) : (
            filtered.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-sm space-y-3 transition hover:shadow-md"
              >
                {/* Header: Code + Duration + Status */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black bg-stone-100 text-stone-900 px-2 py-0.5 rounded-md">
                      {b.bookingCode}
                    </span>
                    <span className="text-[11px] text-stone-500 font-medium">
                      {b.duration}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      b.paymentStatus === "Fully Paid"
                        ? "bg-emerald-100 text-emerald-800"
                        : b.paymentStatus === "Advance Received"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-stone-100 text-stone-700"
                    }`}
                  >
                    {b.paymentStatus}
                  </span>
                </div>

                {/* Package Title & Guest Info */}
                <div>
                  <h4 className="text-sm font-bold text-stone-900 leading-snug">
                    {b.packageTitle}
                  </h4>
                  <p className="text-xs text-stone-500 mt-1 flex flex-wrap items-center gap-1.5">
                    <span className="font-semibold text-stone-700">{b.customerName}</span>
                    <span>•</span>
                    <span className="font-mono">{b.customerPhone}</span>
                  </p>
                </div>

                {/* Rooms, Cab & Extras Chips */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {b.rooms.map((r, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200/60 font-semibold"
                    >
                      🏨 {r.resortCode} ({r.nights}N)
                    </span>
                  ))}
                  {b.vehicle && b.vehicle.enabled && (
                    <span className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-medium">
                      🚗 {b.vehicle.vehicleType.split(" ")[0]}
                    </span>
                  )}
                  {b.otherExpenses.length > 0 && (
                    <span className="text-[10px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded font-medium">
                      +{b.otherExpenses.length} Extras
                    </span>
                  )}
                </div>

                {/* Pricing Breakdown Grid */}
                <div className="bg-stone-50 rounded-xl p-3 grid grid-cols-3 gap-2 text-xs border border-stone-100 text-center">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Total</span>
                    <span className="font-bold text-stone-900">₹{b.netPayable.toLocaleString("en-IN")}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Advance</span>
                    <span className="font-bold text-emerald-700">₹{b.advancePaid.toLocaleString("en-IN")}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Balance</span>
                    <span className="font-bold text-amber-700">₹{b.balanceDue.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {/* DIRECT ACTION BUTTONS (MOBILE) */}
                <div className="pt-2 border-t border-stone-100 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedBooking(b)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#2E4F28] hover:bg-[#233D1F] text-white text-xs font-bold py-2.5 px-3 rounded-xl shadow-sm transition active:scale-95"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Vouchers & Bill</span>
                  </button>

                  <button
                    onClick={() => handleDirectWhatsApp(b)}
                    className="inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-3.5 rounded-xl shadow-sm transition active:scale-95"
                    title="Share to WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    onClick={() => setSelectedBooking(b)}
                    className="inline-flex items-center justify-center p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 transition active:scale-95"
                    title="Print as PDF"
                  >
                    <Printer className="w-4 h-4 text-emerald-800" />
                  </button>

                  <button
                    onClick={() => handleEdit(b)}
                    className="p-2.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
                    title="Edit"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ================= DESKTOP & TABLET TABLE (hidden md:block) ================= */}
        <div className="hidden md:block mt-6 bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-3.5 px-4">Booking Code</th>
                  <th className="py-3.5 px-4">Package & Guest</th>
                  <th className="py-3.5 px-4">Rooms & Cab</th>
                  <th className="py-3.5 px-4 text-right">Net Tariff</th>
                  <th className="py-3.5 px-4 text-right">Advance Paid</th>
                  <th className="py-3.5 px-4 text-right">Balance Due</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-stone-50 transition">
                    <td className="py-4 px-4 font-mono font-bold text-stone-900">
                      {b.bookingCode}
                      <span className="block text-[10px] font-normal text-stone-400">{b.duration}</span>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-bold text-stone-900">{b.packageTitle}</p>
                      <p className="text-[11px] text-stone-500">
                        Guest: <span className="font-medium text-stone-700">{b.customerName}</span> ({b.customerPhone})
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap max-w-xs">
                        {b.rooms.map((r, i) => (
                          <span key={i} className="text-[10px] font-mono bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                            {r.resortCode} ({r.nights}N)
                          </span>
                        ))}
                        {b.vehicle && b.vehicle.enabled && (
                          <span className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
                            🚗 {b.vehicle.vehicleType.split(" ")[0]}
                          </span>
                        )}
                        {b.otherExpenses.length > 0 && (
                          <span className="text-[10px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded">
                            +{b.otherExpenses.length} Extras
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-stone-900">
                      ₹{b.netPayable.toLocaleString("en-IN")}
                    </td>
                    <td className="py-4 px-4 text-right text-emerald-700 font-semibold">
                      ₹{b.advancePaid.toLocaleString("en-IN")}
                    </td>
                    <td className="py-4 px-4 text-right text-amber-700 font-bold">
                      ₹{b.balanceDue.toLocaleString("en-IN")}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        b.paymentStatus === "Fully Paid" ? "bg-emerald-100 text-emerald-800" :
                        b.paymentStatus === "Advance Received" ? "bg-amber-100 text-amber-800" :
                        "bg-stone-100 text-stone-700"
                      }`}>
                        {b.paymentStatus}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleDirectWhatsApp(b)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-2.5 py-1.5 rounded-lg transition shadow-sm active:scale-95"
                          title="Share to WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </button>
                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-stone-800 hover:text-stone-950 bg-stone-100 hover:bg-stone-200 px-2.5 py-1.5 rounded-lg transition active:scale-95"
                          title="Print / PDF"
                        >
                          <Printer className="w-3.5 h-3.5 text-emerald-800" />
                          <span>PDF</span>
                        </button>
                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg transition active:scale-95"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Vouchers</span>
                        </button>
                        <button
                          onClick={() => handleEdit(b)}
                          className="text-stone-400 hover:text-stone-700 p-1.5 transition rounded-lg hover:bg-stone-100"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(b.id)}
                          className="text-stone-400 hover:text-red-600 p-1.5 transition rounded-lg hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================= BUILDER MODAL ================= */}
        {isBuilderOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 my-8 max-h-[90vh] overflow-y-auto">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-xl font-bold text-stone-900">
                      {editingId ? "Edit Package & Itinerary" : "Create New Itinerary & Package"}
                    </h2>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Auto-Saved Draft
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">
                    Auto-connects room bookings, cabs, and other expenses with synchronized invoicing.
                  </p>
                </div>
                <button
                  onClick={() => setIsBuilderOpen(false)}
                  className="text-stone-400 hover:text-stone-700 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Live Resort Created Banner */}
              {quickResortCreatedNotice && (
                <div className="mt-4 p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-950 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top duration-300 shadow-sm text-xs font-bold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                  <span>{quickResortCreatedNotice}</span>
                </div>
              )}

              <form onSubmit={handleSavePackage} className="mt-6 space-y-8 text-xs font-medium">
                
                {/* 1. BASIC DETAILS */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                    <Compass className="w-4 h-4 text-emerald-700" /> 1. Package & Customer Details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-stone-700 mb-1">Package Title *</label>
                      <input
                        type="text"
                        required
                        value={packageTitle}
                        onChange={(e) => setPackageTitle(e.target.value)}
                        placeholder="e.g. Wayanad Honeymoon Private Pool Villa Special"
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 mb-1">Category</label>
                      <select
                        value={category}
                        onChange={(e: any) => setCategory(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                      >
                        <option value="Honey Moon Package">Honey Moon Package</option>
                        <option value="Destination events">Destination events</option>
                        <option value="Group Packages">Group Packages</option>
                        <option value="Best Holiday Package">Best Holiday Package</option>
                        <option value="Custom Family Tour">Custom Family Tour</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-stone-700 mb-1">Duration</label>
                      <input
                        type="text"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        placeholder="e.g. 3 Days / 2 Nights"
                        className="w-full px-3 py-2 rounded-xl border border-stone-200"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 mb-1">Start Date</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => handleStartDateChange(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-200"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 mb-1">End Date</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => handleEndDateChange(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-200"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-stone-700 mb-1">Adults</label>
                        <input
                          type="number"
                          min={1}
                          value={adults}
                          onChange={(e) => setAdults(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-stone-200"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-700 mb-1">Children</label>
                        <input
                          type="number"
                          min={0}
                          value={children}
                          onChange={(e) => setChildren(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-stone-200"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div>
                      <label className="block text-stone-700 mb-1">Customer Name *</label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Rajesh Nair"
                        className="w-full px-3 py-2 rounded-xl border border-stone-200"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 mb-1">Customer Phone / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="+91 98470 00000"
                        className="w-full px-3 py-2 rounded-xl border border-stone-200"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 mb-1">Email / City</label>
                      <input
                        type="text"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="e.g. rajesh@gmail.com"
                        className="w-full px-3 py-2 rounded-xl border border-stone-200"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. DAY-BY-DAY ITINERARY BUILDER */}
                <div className="space-y-4 pt-4 border-t border-stone-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-emerald-700" /> 2. Day-by-Day Itinerary ({itineraryDays.length} Days)
                    </h3>
                    <button
                      type="button"
                      onClick={handleAddDay}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Day
                    </button>
                  </div>

                  <div className="space-y-3">
                    {itineraryDays.map((day, idx) => (
                      <div key={idx} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-bold text-xs text-stone-900 bg-white px-2.5 py-1 rounded-lg border border-stone-200">
                            Day {day.dayNumber}
                          </span>
                          <input
                            type="text"
                            value={day.title}
                            onChange={(e) => handleUpdateDay(idx, { title: e.target.value })}
                            placeholder="Day Title e.g. Banasura Sagar Dam & Private Pool Leisure"
                            className="flex-1 px-3 py-1.5 rounded-xl border border-stone-200 bg-white font-semibold"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveDay(idx)}
                            className="text-stone-400 hover:text-red-600 p-1"
                            title="Remove Day"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div>
                          <label className="block text-stone-600 text-[11px] mb-1">Activities & Schedule</label>
                          <textarea
                            rows={2}
                            value={day.activities}
                            onChange={(e) => handleUpdateDay(idx, { activities: e.target.value })}
                            placeholder="Detailed activities, pickups, sightseeing timings, meal breaks..."
                            className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                          <div>
                            <label className="block text-stone-600 text-[11px] mb-1">Sightseeing Spots (Comma separated)</label>
                            <input
                              type="text"
                              value={day.sightseeing.join(", ")}
                              onChange={(e) => handleUpdateDay(idx, { sightseeing: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                              placeholder="e.g. Edakkal Caves, Phantom Rock, Heritage Museum"
                              className="w-full px-3 py-1.5 rounded-xl border border-stone-200 bg-white"
                            />
                          </div>

                          <div className="flex items-center gap-4 text-xs pt-3">
                            <span className="text-stone-600 font-semibold">Meals:</span>
                            <label className="flex items-center gap-1 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={day.mealsIncluded.breakfast}
                                onChange={(e) => handleUpdateDay(idx, { mealsIncluded: { ...day.mealsIncluded, breakfast: e.target.checked } })}
                              />
                              Breakfast
                            </label>
                            <label className="flex items-center gap-1 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={day.mealsIncluded.lunch}
                                onChange={(e) => handleUpdateDay(idx, { mealsIncluded: { ...day.mealsIncluded, lunch: e.target.checked } })}
                              />
                              Lunch
                            </label>
                            <label className="flex items-center gap-1 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={day.mealsIncluded.dinner}
                                onChange={(e) => handleUpdateDay(idx, { mealsIncluded: { ...day.mealsIncluded, dinner: e.target.checked } })}
                              />
                              Dinner
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. ROOM BOOKINGS (AUTO-CONNECTED WITH RESORT INVENTORY) */}
                <div className="space-y-4 pt-4 border-t border-stone-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                        <BedDouble className="w-4 h-4 text-emerald-700" /> 3. Room Bookings (Auto-Connected with Inventory)
                      </h3>
                      <p className="text-[11px] text-stone-500">
                        Select properties directly from inventory, or add any new resort on the fly; changes auto-sync live!
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openQuickAddResortModal(-1)}
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-lg transition shadow-sm active:scale-95"
                      >
                        <Building2 className="w-3.5 h-3.5 text-amber-700" /> + Add Resort to Inventory
                      </button>
                      <button
                        type="button"
                        onClick={handleAddRoom}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Another Room / Villa
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {rooms.map((room, idx) => (
                      <div key={room.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-2">
                            <div className="flex items-center justify-between mb-1">
                              <label className="block text-stone-700 text-[11px] font-bold">
                                Select Resort / Stay from Inventory *
                              </label>
                              <button
                                type="button"
                                onClick={() => openQuickAddResortModal(idx)}
                                className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 transition"
                              >
                                <Plus className="w-3 h-3" /> Not in inventory? Add Resort
                              </button>
                            </div>
                            <select
                              value={room.resortCode}
                              onChange={(e) => {
                                if (e.target.value === "__ADD_NEW_RESORT__") {
                                  openQuickAddResortModal(idx);
                                } else {
                                  handleUpdateRoom(idx, { resortCode: e.target.value });
                                }
                              }}
                              className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white font-semibold"
                            >
                              <option value="__ADD_NEW_RESORT__" className="text-emerald-700 font-bold bg-emerald-50">
                                ➕ + Add New Resort (Not in inventory)...
                              </option>
                              {resorts.map((r) => (
                                <option key={r.code} value={r.code}>
                                  [{r.code}] {r.name} • {r.destination} (₹{r.pricePerNight}/night)
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-stone-700 text-[11px] mb-1">Meal Plan</label>
                            <select
                              value={room.mealPlan || "EP (Room Only)"}
                              onChange={(e: any) => handleUpdateRoom(idx, { mealPlan: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                            >
                              <option value="EP (Room Only)">EP (Room Only)</option>
                              <option value="CP (Bed & Breakfast)">CP (Bed & Breakfast)</option>
                              <option value="MAP (Breakfast & Dinner)">MAP (Breakfast & Dinner)</option>
                              <option value="AP (All Meals)">AP (All Meals)</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                          <div>
                            <label className="block text-stone-700 text-[11px] mb-1">Check-In</label>
                            <input
                              type="date"
                              value={room.checkIn}
                              onChange={(e) => handleUpdateRoom(idx, { checkIn: e.target.value })}
                              className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-stone-700 text-[11px] mb-1">Check-Out</label>
                            <input
                              type="date"
                              value={room.checkOut}
                              onChange={(e) => handleUpdateRoom(idx, { checkOut: e.target.value })}
                              className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-stone-700 text-[11px] mb-1 font-bold text-emerald-800">
                              Nights (Stay)
                            </label>
                            <input
                              type="number"
                              min={1}
                              value={room.nights || 1}
                              onChange={(e) => handleUpdateRoom(idx, { nights: Math.max(1, Number(e.target.value)) })}
                              className="w-full px-2.5 py-1.5 rounded-xl border border-emerald-300 bg-white font-bold text-stone-900"
                            />
                          </div>
                          <div>
                            <label className="block text-stone-700 text-[11px] mb-1">Rooms Count</label>
                            <input
                              type="number"
                              min={1}
                              value={room.roomsCount}
                              onChange={(e) => handleUpdateRoom(idx, { roomsCount: Number(e.target.value) })}
                              className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-stone-700 text-[11px] mb-1">Rate / Night (₹)</label>
                            <input
                              type="number"
                              value={room.ratePerNight}
                              onChange={(e) => handleUpdateRoom(idx, { ratePerNight: Number(e.target.value) })}
                              className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-stone-700 text-[11px] mb-1">Total Room Tariff</label>
                            <div className="font-bold text-stone-900 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 text-center">
                              ₹{room.totalAmount.toLocaleString("en-IN")}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-3 pt-1">
                          <input
                            type="text"
                            value={room.specialRequests || ""}
                            onChange={(e) => handleUpdateRoom(idx, { specialRequests: e.target.value })}
                            placeholder="Special room requests (e.g. extra bed, high floor, honeymoon bed decor)..."
                            className="flex-1 px-3 py-1.5 rounded-xl border border-stone-200 bg-white text-[11px]"
                          />
                          {rooms.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveRoom(idx)}
                              className="text-stone-400 hover:text-red-600 p-1"
                              title="Remove Room"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. VEHICLE BOOKING & CHAUFFEUR (DAILY / PER KM / EXTRA KM) */}
                <div className="space-y-4 pt-4 border-t border-stone-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                        <Car className="w-4 h-4 text-emerald-700" /> 4. Vehicle Booking & Chauffeur
                      </h3>
                      <p className="text-[11px] text-stone-500">
                        Supports Fixed Daily Rate, Running KM Rate, and Package Base KM + Extra KM Covered.
                      </p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-700">
                      <input
                        type="checkbox"
                        checked={vehicle.enabled}
                        onChange={(e) => updateVehicle({ enabled: e.target.checked })}
                      />
                      Include Vehicle in Package
                    </label>
                  </div>

                  {vehicle.enabled && (
                    <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-4">
                      {/* Pricing Model Selector */}
                      <div>
                        <label className="block text-stone-700 text-[11px] font-bold mb-1.5">
                          Vehicle Pricing Model *
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={() => updateVehicle({ pricingModel: "daily" })}
                            className={`px-3 py-2 rounded-xl border text-xs font-bold transition text-left ${
                              (vehicle.pricingModel || "daily") === "daily"
                                ? "bg-[#2E4F28] text-white border-[#2E4F28] shadow-sm"
                                : "bg-white text-stone-700 border-stone-200 hover:bg-stone-100"
                            }`}
                          >
                            <span className="block font-bold">1. Fixed Daily Rate</span>
                            <span className="block text-[10px] opacity-80 font-normal">Daily tariff × Total days + Driver batta</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => updateVehicle({ pricingModel: "per_km" })}
                            className={`px-3 py-2 rounded-xl border text-xs font-bold transition text-left ${
                              vehicle.pricingModel === "per_km"
                                ? "bg-[#2E4F28] text-white border-[#2E4F28] shadow-sm"
                                : "bg-white text-stone-700 border-stone-200 hover:bg-stone-100"
                            }`}
                          >
                            <span className="block font-bold">2. Running KM Rate</span>
                            <span className="block text-[10px] opacity-80 font-normal">Total KM covered × ₹/KM + Batta/Toll</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => updateVehicle({ pricingModel: "package_km_extra" })}
                            className={`px-3 py-2 rounded-xl border text-xs font-bold transition text-left ${
                              vehicle.pricingModel === "package_km_extra"
                                ? "bg-[#2E4F28] text-white border-[#2E4F28] shadow-sm"
                                : "bg-white text-stone-700 border-stone-200 hover:bg-stone-100"
                            }`}
                          >
                            <span className="block font-bold">3. Package KM + Extra KM</span>
                            <span className="block text-[10px] opacity-80 font-normal">Base package KM + Extra KM charges</span>
                          </button>
                        </div>
                      </div>

                      {/* Basic Vehicle Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-stone-700 text-[11px] mb-1">Vehicle Type</label>
                          <select
                            value={vehicle.vehicleType}
                            onChange={(e: any) => updateVehicle({ vehicleType: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                          >
                            <option value="Sedan (Dzire / Etios)">Sedan (Dzire / Etios)</option>
                            <option value="SUV (Innova Crysta / Ertiga)">SUV (Innova Crysta / Ertiga)</option>
                            <option value="Tempo Traveller (12/17 Seater)">Tempo Traveller (12/17 Seater)</option>
                            <option value="4x4 Jeep Safari">4x4 Jeep Safari</option>
                            <option value="Custom Vehicle">Custom Vehicle</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-stone-700 text-[11px] mb-1">Pickup Location</label>
                          <input
                            type="text"
                            value={vehicle.pickupLocation}
                            onChange={(e) => updateVehicle({ pickupLocation: e.target.value })}
                            placeholder="e.g. Calicut Airport / Railway Station"
                            className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-stone-700 text-[11px] mb-1">Drop Location</label>
                          <input
                            type="text"
                            value={vehicle.dropLocation}
                            onChange={(e) => updateVehicle({ dropLocation: e.target.value })}
                            placeholder="e.g. Calicut Railway Station"
                            className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                          />
                        </div>
                      </div>

                      {/* Dynamic Pricing Model Inputs */}
                      {vehicle.pricingModel === "per_km" && (
                        <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-3">
                          <p className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider">
                            Per-KM Running Rate Calculations
                          </p>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div>
                              <label className="block text-stone-700 text-[11px] mb-1">Start Odometer (KM)</label>
                              <input
                                type="number"
                                value={vehicle.startKmReading !== undefined ? vehicle.startKmReading : ""}
                                onChange={(e) => updateVehicle({ startKmReading: e.target.value === "" ? 0 : Number(e.target.value) })}
                                placeholder="e.g. 42000"
                                className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 bg-stone-50"
                              />
                            </div>
                            <div>
                              <label className="block text-stone-700 text-[11px] mb-1">End Odometer (KM)</label>
                              <input
                                type="number"
                                value={vehicle.endKmReading !== undefined ? vehicle.endKmReading : ""}
                                onChange={(e) => updateVehicle({ endKmReading: e.target.value === "" ? 0 : Number(e.target.value) })}
                                placeholder="e.g. 42350"
                                className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 bg-stone-50"
                              />
                            </div>
                            <div>
                              <label className="block text-stone-700 text-[11px] mb-1 font-bold text-emerald-800">
                                Total KM Covered *
                              </label>
                              <input
                                type="number"
                                value={vehicle.totalKmCovered !== undefined ? vehicle.totalKmCovered : ""}
                                onChange={(e) => updateVehicle({ totalKmCovered: e.target.value === "" ? 0 : Number(e.target.value) })}
                                className="w-full px-2.5 py-1.5 rounded-xl border border-emerald-300 bg-white font-bold text-stone-900"
                              />
                            </div>
                            <div>
                              <label className="block text-stone-700 text-[11px] mb-1 font-bold text-emerald-800">
                                Rate / KM (₹) *
                              </label>
                              <input
                                type="number"
                                value={vehicle.ratePerKm !== undefined ? vehicle.ratePerKm : ""}
                                onChange={(e) => updateVehicle({ ratePerKm: e.target.value === "" ? 0 : Number(e.target.value) })}
                                placeholder="e.g. 14"
                                className="w-full px-2.5 py-1.5 rounded-xl border border-emerald-300 bg-white font-bold text-stone-900"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {vehicle.pricingModel === "package_km_extra" && (
                        <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-3">
                          <p className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider">
                            Package Base KM &amp; Extra KM Calculations
                          </p>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div>
                              <label className="block text-stone-700 text-[11px] mb-1">Base KM in Package</label>
                              <input
                                type="number"
                                value={vehicle.baseKmIncluded !== undefined ? vehicle.baseKmIncluded : ""}
                                onChange={(e) => updateVehicle({ baseKmIncluded: e.target.value === "" ? 0 : Number(e.target.value) })}
                                placeholder="e.g. 300"
                                className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-stone-700 text-[11px] mb-1 font-bold text-emerald-800">
                                Total KM Covered
                              </label>
                              <input
                                type="number"
                                value={vehicle.totalKmCovered !== undefined ? vehicle.totalKmCovered : ""}
                                onChange={(e) => updateVehicle({ totalKmCovered: e.target.value === "" ? 0 : Number(e.target.value) })}
                                placeholder="e.g. 380"
                                className="w-full px-2.5 py-1.5 rounded-xl border border-emerald-300 bg-white font-bold"
                              />
                            </div>
                            <div>
                              <label className="block text-stone-700 text-[11px] mb-1">Extra KM Covered</label>
                              <div className="font-bold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                                {vehicle.extraKmCovered || 0} Extra KM
                              </div>
                            </div>
                            <div>
                              <label className="block text-stone-700 text-[11px] mb-1">Extra KM Rate (₹/KM)</label>
                              <input
                                type="number"
                                value={vehicle.extraKmRate !== undefined ? vehicle.extraKmRate : ""}
                                onChange={(e) => updateVehicle({ extraKmRate: e.target.value === "" ? 0 : Number(e.target.value) })}
                                placeholder="e.g. 16"
                                className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 bg-white"
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-xs p-2 bg-amber-50/60 rounded-lg border border-amber-200 font-semibold text-amber-950">
                            <span>Extra KM Charges ({vehicle.extraKmCovered || 0} KM × ₹{vehicle.extraKmRate || 0}/KM):</span>
                            <span className="font-bold">₹{(vehicle.extraKmAmount || 0).toLocaleString("en-IN")}</span>
                          </div>
                        </div>
                      )}

                      {/* Days, Daily Rate, Driver Batta & Tolls */}
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        <div>
                          <label className="block text-stone-700 text-[11px] mb-1">Total Duty Days</label>
                          <input
                            type="number"
                            min={1}
                            value={vehicle.totalDays !== undefined ? vehicle.totalDays : ""}
                            onChange={(e) => updateVehicle({ totalDays: e.target.value === "" ? 1 : Number(e.target.value) })}
                            className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-stone-700 text-[11px] mb-1">
                            {vehicle.pricingModel === "package_km_extra" ? "Base Daily Rate (₹)" : "Rate / Day (₹)"}
                          </label>
                          <input
                            type="number"
                            value={vehicle.ratePerDay !== undefined ? vehicle.ratePerDay : ""}
                            onChange={(e) => updateVehicle({ ratePerDay: e.target.value === "" ? 0 : Number(e.target.value) })}
                            className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-stone-700 text-[11px] mb-1">Driver Batta (₹/day)</label>
                          <input
                            type="number"
                            value={vehicle.driverBatta !== undefined ? vehicle.driverBatta : ""}
                            onChange={(e) => updateVehicle({ driverBatta: e.target.value === "" ? 0 : Number(e.target.value) })}
                            className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-stone-700 text-[11px] mb-1">Toll &amp; Parking (₹)</label>
                          <input
                            type="number"
                            value={vehicle.tollAndParking !== undefined ? vehicle.tollAndParking : ""}
                            onChange={(e) => updateVehicle({ tollAndParking: e.target.value === "" ? 0 : Number(e.target.value) })}
                            placeholder="0"
                            className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-stone-700 text-[11px] mb-1 font-bold text-stone-900">Total Vehicle Cost</label>
                          <div className="font-bold text-stone-900 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 text-center">
                            ₹{(vehicle.totalAmount || 0).toLocaleString("en-IN")}
                          </div>
                        </div>
                      </div>

                      {/* Driver & Plate Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div>
                          <label className="block text-stone-700 text-[11px] mb-1">Driver Name &amp; Phone</label>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={vehicle.driverName || ""}
                              onChange={(e) => updateVehicle({ driverName: e.target.value })}
                              placeholder="Driver Name (e.g. Suresh Babu)"
                              className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 bg-white"
                            />
                            <input
                              type="text"
                              value={vehicle.driverPhone || ""}
                              onChange={(e) => updateVehicle({ driverPhone: e.target.value })}
                              placeholder="Phone (+91 97455...)"
                              className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 bg-white"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-stone-700 text-[11px] mb-1">Vehicle Plate Number &amp; Duty Notes</label>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={vehicle.vehicleNumber || ""}
                              onChange={(e) => updateVehicle({ vehicleNumber: e.target.value })}
                              placeholder="Plate (e.g. KL-12-AE-4819)"
                              className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 bg-white font-mono"
                            />
                            <input
                              type="text"
                              value={vehicle.dutyNotes || ""}
                              onChange={(e) => updateVehicle({ dutyNotes: e.target.value })}
                              placeholder="Notes (e.g. Airport placard)"
                              className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 5. OTHER EXPENSES & INTERACTIVE NOTEPAD */}
                <div className="space-y-4 pt-4 border-t border-stone-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-700" /> 5. Other Expenses & Interactive Notepad
                      </h3>
                      <p className="text-[11px] text-stone-500">
                        When other expenses are selected, an interactive notepad is available for instructions, diet preferences, and vendor memos.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddOtherExpense}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Other Expense
                    </button>
                  </div>

                  <div className="space-y-3">
                    {otherExpenses.map((exp, idx) => (
                      <div key={exp.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                          <div className="sm:col-span-2">
                            <label className="block text-stone-700 text-[11px] mb-1">Category & Expense Title</label>
                            <div className="flex gap-2">
                              <select
                                value={exp.category}
                                onChange={(e: any) => handleUpdateOtherExpense(idx, { category: e.target.value })}
                                className="px-2.5 py-1.5 rounded-xl border border-stone-200 bg-white text-[11px]"
                              >
                                <option value="Campfire & Music">Campfire & Music</option>
                                <option value="Candlelight Dinner">Candlelight Dinner</option>
                                <option value="Ayurvedic Spa & Massage">Ayurvedic Spa & Massage</option>
                                <option value="Wildlife Safari & Entry Permits">Wildlife Safari & Entry Permits</option>
                                <option value="Adventure Park & Glass Bridge">Adventure Park & Glass Bridge</option>
                                <option value="Barbeque / Special Chef">Barbeque / Special Chef</option>
                                <option value="Other Custom Expense">Other Custom Expense</option>
                              </select>
                              <input
                                type="text"
                                value={exp.title}
                                onChange={(e) => handleUpdateOtherExpense(idx, { title: e.target.value })}
                                placeholder="Expense Name"
                                className="flex-1 px-3 py-1.5 rounded-xl border border-stone-200 bg-white font-semibold"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-stone-700 text-[11px] mb-1">Rate (₹)</label>
                              <input
                                type="number"
                                value={exp.rate}
                                onChange={(e) => handleUpdateOtherExpense(idx, { rate: Number(e.target.value) })}
                                className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-stone-700 text-[11px] mb-1">Qty</label>
                              <input
                                type="number"
                                min={1}
                                value={exp.quantity}
                                onChange={(e) => handleUpdateOtherExpense(idx, { quantity: Number(e.target.value) })}
                                className="w-full px-2.5 py-1.5 rounded-xl border border-stone-200 bg-white"
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <label className="block text-stone-700 text-[11px] mb-1">Total</label>
                              <div className="font-bold text-stone-900 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                                ₹{exp.totalAmount.toLocaleString("en-IN")}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveOtherExpense(idx)}
                              className="text-stone-400 hover:text-red-600 p-1.5 mt-4"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Interactive Notepad for Other Expense */}
                        <div className="bg-white p-3 rounded-xl border border-stone-200">
                          <label className="block text-emerald-800 font-bold text-[11px] mb-1 flex items-center gap-1">
                            <Edit3 className="w-3.5 h-3.5" /> Interactive Notepad for &ldquo;{exp.title}&rdquo;:
                          </label>
                          <textarea
                            rows={2}
                            value={exp.notepadContent}
                            onChange={(e) => handleUpdateOtherExpense(idx, { notepadContent: e.target.value })}
                            placeholder="Add memo for this item (e.g. food requests, cake text, vendor phone number, booking slot)..."
                            className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-[11px] focus:outline-none focus:ring-1 focus:ring-emerald-700/20"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* General Master Notepad */}
                  <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-2">
                    <label className="block font-bold text-amber-950 text-xs flex items-center gap-1.5">
                      <Edit3 className="w-4 h-4 text-amber-800" /> Master Package Notepad (Overall Notes & Client Instructions)
                    </label>
                    <textarea
                      rows={3}
                      value={notepadNotes}
                      onChange={(e) => setNotepadNotes(e.target.value)}
                      placeholder="Type general internal memos, dietary restrictions, arrival instructions, or special requests..."
                      className="w-full px-3 py-2 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-700/20 bg-white"
                    />
                  </div>
                </div>

                {/* 6. FINANCIALS & AUTO-SYNC SUMMARY */}
                <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 space-y-4">
                  <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-emerald-700" /> 6. Bill Summary & Automatic Booking Sync
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-stone-700 mb-1">Discount (₹)</label>
                      <input
                        type="number"
                        value={discount}
                        onChange={(e) => setDiscount(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 mb-1">GST Tax Rate</label>
                      <select
                        value={gstRate}
                        onChange={(e) => setGstRate(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                      >
                        <option value={0}>0% (Exempt)</option>
                        <option value={5}>5% GST (Tours)</option>
                        <option value={12}>12% GST</option>
                        <option value={18}>18% GST</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-stone-700 mb-1">Advance Received (₹)</label>
                      <input
                        type="number"
                        value={advancePaid}
                        onChange={(e) => setAdvancePaid(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 mb-1">Payment Status</label>
                      <select
                        value={paymentStatus}
                        onChange={(e: any) => setPaymentStatus(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Advance Received">Advance Received</option>
                        <option value="Fully Paid">Fully Paid</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Rooms Stay Subtotal:</span>
                      <span className="font-semibold">₹{roomsSubtotal.toLocaleString("en-IN")}</span>
                    </div>
                    {vehicle.enabled && (
                      <div className="flex justify-between">
                        <span className="text-stone-500">Vehicle & Chauffeur Subtotal:</span>
                        <span className="font-semibold">₹{vehicleSubtotal.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    {otherExpenses.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-stone-500">Other Expenses Subtotal:</span>
                        <span className="font-semibold">₹{otherExpensesSubtotal.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    {gstRate > 0 && (
                      <div className="flex justify-between">
                        <span className="text-stone-500">GST Tax ({gstRate}%):</span>
                        <span className="font-semibold">₹{gstAmount.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-black text-sm text-stone-900 pt-2 border-t border-stone-200">
                      <span>Total Package Tariff:</span>
                      <span>₹{netPayable.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-amber-800 font-bold">
                      <span>Balance Due on Arrival:</span>
                      <span>₹{balanceDue.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setIsBuilderOpen(false)}
                    className="px-4 py-2 text-stone-600 font-semibold hover:bg-stone-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#2E4F28] hover:bg-[#233D1F] text-white font-bold rounded-xl shadow transition"
                  >
                    Save & Auto-Sync with Bookings
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= QUICK ADD RESORT TO INVENTORY MODAL ================= */}
        {isQuickAddResortOpen && (
          <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 my-8 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-stone-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-stone-900">
                      Add New Resort to Inventory
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Instantly registers this resort in your master inventory and auto-links it to this package.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsQuickAddResortOpen(false)}
                  className="text-stone-400 hover:text-stone-700 p-1 rounded-full hover:bg-stone-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Add Form */}
              <form onSubmit={handleQuickCreateResort} className="mt-5 space-y-4 text-xs font-medium">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-stone-700 font-bold mb-1">
                      Resort / Property Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={qaName}
                      onChange={(e) => setQaName(e.target.value)}
                      placeholder="e.g. Vythiri Mist Valley Cottage"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-bold mb-1">
                      Inventory Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={qaCode}
                      onChange={(e) => setQaCode(e.target.value.toUpperCase())}
                      placeholder="e.g. AH-125"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 font-mono font-bold uppercase text-emerald-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 font-bold mb-1">
                      Destination / Location *
                    </label>
                    <select
                      value={qaDestination}
                      onChange={(e) => setQaDestination(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white font-medium"
                    >
                      <option value="Padinjarathara">Padinjarathara (Banasura Dam)</option>
                      <option value="Vythiri">Vythiri (Pookode & Rainforest)</option>
                      <option value="Sulthan Bathery">Sulthan Bathery</option>
                      <option value="Meppadi">Meppadi (Chembra & Tea Estates)</option>
                      <option value="Kalpetta">Kalpetta (Central Hub)</option>
                      <option value="Mananthavady">Mananthavady (Kuruva Island)</option>
                      <option value="Thirunelly">Thirunelly / Brahmagiri</option>
                      <option value="Pozhuthana">Pozhuthana (Bamboo Rafting)</option>
                      <option value="Other">Other / Custom Location...</option>
                    </select>
                    {qaDestination === "Other" && (
                      <input
                        type="text"
                        required
                        value={qaCustomDestination}
                        onChange={(e) => setQaCustomDestination(e.target.value)}
                        placeholder="Enter custom location name..."
                        className="w-full mt-2 px-3 py-1.5 rounded-xl border border-stone-200"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-stone-700 font-bold mb-1">
                      Room / Villa Type *
                    </label>
                    <input
                      type="text"
                      required
                      value={qaRoomType}
                      onChange={(e) => setQaRoomType(e.target.value)}
                      placeholder="e.g. Luxury Private Pool Villa, Forest Suite"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-stone-700 font-bold mb-1">
                      Price / Night (₹) *
                    </label>
                    <input
                      type="number"
                      min={0}
                      required
                      value={qaPricePerNight}
                      onChange={(e) => setQaPricePerNight(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 font-bold text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-bold mb-1">
                      B2B / Agent Cost Rate (₹)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={qaB2bRate}
                      onChange={(e) => setQaB2bRate(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 text-stone-600"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-bold mb-1">
                      Accommodation Type
                    </label>
                    <select
                      value={qaAccommodationType}
                      onChange={(e: any) => setQaAccommodationType(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                    >
                      <option value="Private Pool Villa">Private Pool Villa</option>
                      <option value="Luxury Resort">Luxury Resort</option>
                      <option value="Tree House">Tree House</option>
                      <option value="Plantation Resort">Plantation Resort</option>
                      <option value="Budget Stay">Budget Stay</option>
                      <option value="Heritage Bungalow">Heritage Bungalow</option>
                      <option value="Glamping / Tent">Glamping / Tent</option>
                      <option value="Houseboat">Houseboat</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-stone-700 font-bold mb-1">
                      Stay Preference
                    </label>
                    <select
                      value={qaStayPreference}
                      onChange={(e: any) => setQaStayPreference(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                    >
                      <option value="Independent Private Cottage/Villa">Independent Villa/Cottage</option>
                      <option value="Individual Room/Suite">Individual Room/Suite</option>
                      <option value="Group / Bachelor Friendly">Group / Bachelor Friendly</option>
                      <option value="Family Gathering">Family Gathering</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-stone-700 font-bold mb-1">
                      Max Adults
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={qaMaxAdults}
                      onChange={(e) => setQaMaxAdults(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-bold mb-1">
                      Max Children
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={qaMaxChildren}
                      onChange={(e) => setQaMaxChildren(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 font-bold mb-1">
                      Location Address / Landmark
                    </label>
                    <input
                      type="text"
                      value={qaLocationDetails}
                      onChange={(e) => setQaLocationDetails(e.target.value)}
                      placeholder="e.g. Near Pookode Lake, Vythiri, Wayanad"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-bold mb-1">
                      Google Maps URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={qaGoogleMapsUrl}
                      onChange={(e) => setQaGoogleMapsUrl(e.target.value)}
                      placeholder="https://maps.google.com/?q=..."
                      className="w-full px-3 py-2 rounded-xl border border-stone-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 font-bold mb-1">
                    Cover Photo URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={qaCoverImage}
                    onChange={(e) => setQaCoverImage(e.target.value)}
                    placeholder="Leave blank to use default scenic image"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200"
                  />
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2.5 text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="text-[11px] leading-relaxed">
                    <strong>Hand-in-Hand Sync:</strong> Saving this form will create <strong>[{qaCode || "AH-..."}] {qaName || "New Resort"}</strong> in your live Master Inventory permanently and immediately apply it to your current itinerary room allocation without losing your progress.
                  </span>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsQuickAddResortOpen(false)}
                    className="px-4 py-2 text-stone-600 font-semibold hover:bg-stone-100 rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingResort}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#2E4F28] hover:bg-[#233D1F] disabled:opacity-75 text-white font-bold rounded-xl shadow transition active:scale-95"
                  >
                    {isSavingResort ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Saving to Inventory...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" /> Save to Inventory &amp; Apply to Package
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        </div>

        {/* ================= VOUCHER & BILL MODAL ================= */}
        {selectedBooking && (
          <ItineraryVoucherModal
            booking={selectedBooking}
            onClose={() => setSelectedBooking(null)}
            onUpdateBooking={(updated) => {
              setSelectedBooking(updated);
              setBookings(bookings.map(b => b.id === updated.id ? updated : b));
            }}
          />
        )}
      </main>
    </div>
  );
}

export default function ItinerariesPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm">Loading Package & Itinerary Studio...</div>}>
      <ItinerariesContent />
    </Suspense>
  );
}
