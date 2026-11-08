"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";
import { Resort, NearbyAttraction, AccommodationType, StayPreference, AmbienceType } from "@/lib/types";
import { Building2, Search, Bed, Users, Plus, FileText, Check, X, MapPin, Trash2, Edit3, Navigation, Sparkles, Layers, Upload, Loader2, Star, CheckSquare, Square, DollarSign } from "lucide-react";

const CATEGORY_CHOICES = [
  "Private Pool Villa",
  "Family Resort",
  "Group",
  "Tree House",
  "Plantation Stay",
  "Luxury Resort",
  "Heritage Bungalow",
  "Budget Resort",
  "Glamping / Tent"
];

const STAY_TYPE_CHOICES = [
  "Independent",
  "Twin Cottage",
  "Multi Cottage"
];

const ROOMS_PROVIDED_CHOICES = [
  "Family",
  "Group",
  "Family or Group"
];

const BUDGET_CATEGORY_CHOICES = [
  "2000-5000",
  "5000-10000",
  "10000 Plus"
];

const ROOMS_AVAILABLE_OPTIONS = [1, 2, 3, 4, 5, 6, 7, "7+"];

const STANDARD_AMENITIES = [
  "Parking",
  "Swimming Pool",
  "WiFi",
  "Spa & Wellness Centre",
  "Jacuzzi",
  "Restaurant",
  "Electric Charging Station",
  "Handicapped / Wheelchair Accessible",
  "Room Service or Butler",
  "Kitchen / Self Cooking",
  "Barbecue",
  "Campfire",
  "Candle Light Dinner",
  "Kids Play Area",
  "Badminton",
  "Indoor / Outdoor Games",
  "Play Area"
];

export default function ResortManagerPage() {
  const [resorts, setResorts] = useState<Resort[]>([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResort, setEditingResort] = useState<Resort | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form State for 9 Dimensions
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [destination, setDestination] = useState("Padinjarathara");
  const [locationDetails, setLocationDetails] = useState("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [accommodationType, setAccommodationType] = useState<AccommodationType>("Private Pool Villa");
  const [stayPreference, setStayPreference] = useState<StayPreference>("Independent Private Cottage/Villa");
  const [ambienceStr, setAmbienceStr] = useState("Mountain / Valley View, Lake / Dam Waterfront");
  const [category, setCategory] = useState<Resort["category"]>("Pool Villa");

  // Automation & Multi-Dimension Filter States
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["Private Pool Villa"]);
  const [stayType, setStayType] = useState<string>("Independent");
  const [roomsProvidedType, setRoomsProvidedType] = useState<string>("Family");
  const [budgetCategory, setBudgetCategory] = useState<string>("5000-10000");
  const [rateB2c, setRateB2c] = useState<string>("₹12,000 / night");
  const [rateB2b, setRateB2b] = useState<string>("₹9,000 / night");
  const [ratePerPerson, setRatePerPerson] = useState<string>("");
  const [rateFullProperty, setRateFullProperty] = useState<string>("");
  const [roomsAvailableCount, setRoomsAvailableCount] = useState<number | string>(2);
  const [dormitoryDetails, setDormitoryDetails] = useState<string>("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    "Swimming Pool",
    "WiFi",
    "Parking",
    "Campfire",
    "Barbecue"
  ]);
  const [customAmenityInput, setCustomAmenityInput] = useState<string>("");

  const [bedrooms, setBedrooms] = useState(2);
  const [bathrooms, setBathrooms] = useState(2);
  const [maxAdults, setMaxAdults] = useState(6);
  const [maxChildren, setMaxChildren] = useState(2);
  const [maxGuests, setMaxGuests] = useState(8);
  const [pricePerNight, setPricePerNight] = useState(12000);
  const [b2bRate, setB2bRate] = useState(9000);
  const [coverImage, setCoverImage] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [customPhotoInput, setCustomPhotoInput] = useState("");
  const [amenitiesStr, setAmenitiesStr] = useState("Infinity Swimming Pool, Kids Play area, Camp Fire (Chargeable), High Speed Wifi");
  const [specialitiesStr, setSpecialitiesStr] = useState("Banasura hill view, Hilltop sunset view");
  const [checkInTime, setCheckInTime] = useState("01:00 PM");
  const [checkOutTime, setCheckOutTime] = useState("11:00 AM");
  const [overview, setOverview] = useState("");
  const [nearbyAttractions, setNearbyAttractions] = useState<NearbyAttraction[]>([
    { name: "Banasura Sagar Dam", distance: "≈03 km" },
    { name: "Karlad Lake", distance: "≈05 km" },
    { name: "Meenmutty Waterfalls", distance: "≈06 km" }
  ]);

  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Client-side instant canvas compressor: compresses 10MB camera photos to crisp ~250KB Web images
  const compressImageForWeb = async (file: File): Promise<File> => {
    if (!file.type.startsWith("image/") || file.type.includes("svg") || file.type.includes("gif")) {
      return file;
    }
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.onload = () => {
          const maxWidth = 1600;
          const maxHeight = 1600;
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return resolve(file);
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (!blob || blob.size >= file.size) {
                return resolve(file);
              }
              const cleanName = file.name.replace(/\.[^.]+$/, ".jpg");
              resolve(new File([blob], cleanName, { type: "image/jpeg", lastModified: Date.now() }));
            },
            "image/jpeg",
            0.85
          );
        };
        img.onerror = () => resolve(file);
        img.src = event.target?.result as string;
      };
      reader.onerror = () => resolve(file);
      reader.readAsDataURL(file);
    });
  };

  const handleUploadPhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploadingPhotos(true);
      const newUrls: string[] = [];

      // Upload file-by-file sequentially to prevent large batch timeouts and ensure 100% reliability
      for (let i = 0; i < files.length; i++) {
        const originalFile = files[i];
        setUploadProgressText(`Optimizing ${i + 1} of ${files.length}...`);
        const fileToUpload = await compressImageForWeb(originalFile);

        setUploadProgressText(`Uploading ${i + 1} of ${files.length}...`);
        const formData = new FormData();
        formData.append("files", fileToUpload);

        const res = await fetch("/api/v1/upload", {
          method: "POST",
          body: formData
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => null);
          const msg = errData?.error || `Server HTTP ${res.status}: ${res.statusText || "Request rejected"}`;
          throw new Error(`"${originalFile.name}": ${msg}`);
        }

        const data = await res.json();
        if (data.urls && data.urls.length > 0) {
          newUrls.push(...data.urls);
        } else if (data.url) {
          newUrls.push(data.url);
        }
      }

      if (newUrls.length > 0) {
        setPhotos((prev) => [...prev, ...newUrls]);
        if (!coverImage) {
          setCoverImage(newUrls[0]);
        }
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      alert("Failed to upload photos: " + err.message);
    } finally {
      setIsUploadingPhotos(false);
      setUploadProgressText("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemovePhoto = (photoUrl: string) => {
    const updated = photos.filter((p) => p !== photoUrl);
    setPhotos(updated);
    if (coverImage === photoUrl) {
      setCoverImage(updated.length > 0 ? updated[0] : "");
    }
  };

  const handleSetCoverPhoto = (photoUrl: string) => {
    setCoverImage(photoUrl);
    if (!photos.includes(photoUrl)) {
      setPhotos([photoUrl, ...photos]);
    }
  };

  const [taxonomies, setTaxonomies] = useState<any>(null);

  const loadResorts = async () => {
    try {
      const [res, taxRes] = await Promise.all([
        fetch("/api/v1/resorts"),
        fetch("/api/v1/taxonomies").catch(() => null)
      ]);
      if (res.ok) {
        const data = await res.json();
        setResorts(data);
      }
      if (taxRes && taxRes.ok) {
        const taxData = await taxRes.json();
        setTaxonomies(taxData);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadResorts();
  }, []);

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleSelectAllCategories = () => {
    if (selectedCategories.length === CATEGORY_CHOICES.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories([...CATEGORY_CHOICES]);
    }
  };

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleSelectAllAmenities = () => {
    if (selectedAmenities.length >= STANDARD_AMENITIES.length) {
      setSelectedAmenities([]);
    } else {
      setSelectedAmenities([...STANDARD_AMENITIES]);
    }
  };

  const handleAddCustomAmenity = () => {
    if (customAmenityInput.trim()) {
      const trimmed = customAmenityInput.trim();
      if (!selectedAmenities.includes(trimmed)) {
        setSelectedAmenities([...selectedAmenities, trimmed]);
      }
      setCustomAmenityInput("");
    }
  };

  const openCreateModal = () => {
    setEditingResort(null);
    setCode(`AH-${120 + resorts.length + 1}`);
    setName("");
    setDestination("Padinjarathara");
    setLocationDetails("Near Banasura Dam, Wayanad, Kerala");
    setGoogleMapsUrl("https://maps.google.com/?q=Banasura+Dam+Wayanad");
    setAccommodationType("Private Pool Villa");
    setStayPreference("Independent Private Cottage/Villa");
    setAmbienceStr("Mountain / Valley View, Lake / Dam Waterfront, Secluded & Peaceful");
    setCategory("Pool Villa");
    setSelectedCategories(["Private Pool Villa"]);
    setStayType("Independent");
    setRoomsProvidedType("Family");
    setBudgetCategory("5000-10000");
    setRateB2c("₹12,000 / night");
    setRateB2b("₹9,000 / night");
    setRatePerPerson("");
    setRateFullProperty("");
    setRoomsAvailableCount(2);
    setDormitoryDetails("");
    setSelectedAmenities([
      "Parking",
      "Swimming Pool",
      "WiFi",
      "Campfire",
      "Barbecue"
    ]);
    setCustomAmenityInput("");
    setBedrooms(2);
    setBathrooms(2);
    setMaxAdults(6);
    setMaxChildren(2);
    setMaxGuests(8);
    setPricePerNight(12000);
    setB2bRate(9000);
    setCoverImage("");
    setPhotos([]);
    setCustomPhotoInput("");
    setAmenitiesStr("Infinity Swimming Pool, Mountain View Balcony, High Speed Wifi, Campfire Area");
    setSpecialitiesStr("Valley view, Peaceful privacy");
    setCheckInTime("01:00 PM");
    setCheckOutTime("11:00 AM");
    setOverview("Stunning luxury villa nestled in Wayanad with private pool and scenic hill views.");
    setNearbyAttractions([
      { name: "Banasura Sagar Dam", distance: "≈03 km" },
      { name: "Karlad Lake", distance: "≈05 km" }
    ]);
    setIsModalOpen(true);
  };

  const openEditModal = (resort: Resort) => {
    setEditingResort(resort);
    setCode(resort.code);
    setName(resort.name);
    setDestination(resort.destination);
    setLocationDetails(resort.locationDetails || "");
    setGoogleMapsUrl(resort.googleMapsUrl || "");
    setAccommodationType(resort.accommodationType || "Private Pool Villa");
    setStayPreference(resort.stayPreference || "Independent Private Cottage/Villa");
    setAmbienceStr(resort.ambience ? resort.ambience.join(", ") : "Mountain / Valley View");
    setCategory(resort.category);
    setSelectedCategories(
      Array.isArray(resort.categories) && resort.categories.length > 0
        ? resort.categories
        : [resort.accommodationType || "Private Pool Villa"]
    );
    setStayType(resort.stayType || "Independent");
    setRoomsProvidedType(resort.roomsProvidedType || "Family");
    setBudgetCategory(resort.budgetCategory || "5000-10000");
    setRateB2c(resort.rates?.b2c || (resort.pricePerNight ? `₹${resort.pricePerNight.toLocaleString("en-IN")}` : ""));
    setRateB2b(resort.rates?.b2b || (resort.b2bRate ? `₹${resort.b2bRate.toLocaleString("en-IN")}` : ""));
    setRatePerPerson(resort.rates?.perPerson || "");
    setRateFullProperty(resort.rates?.fullProperty || "");
    setRoomsAvailableCount(resort.roomsAvailableCount ?? resort.bedrooms ?? 1);
    setDormitoryDetails(resort.dormitoryDetails || "");
    setSelectedAmenities(
      Array.isArray(resort.amenities) && resort.amenities.length > 0
        ? resort.amenities
        : ["Swimming Pool", "WiFi", "Parking"]
    );
    setCustomAmenityInput("");
    setBedrooms(resort.bedrooms);
    setBathrooms(resort.bathrooms);
    setMaxAdults(resort.maxAdults || resort.maxGuests);
    setMaxChildren(resort.maxChildren || 2);
    setMaxGuests(resort.maxGuests);
    setPricePerNight(resort.pricePerNight);
    setB2bRate(resort.b2bRate);
    const resortPhotos = Array.isArray(resort.photos) ? resort.photos.filter(Boolean) : [];
    setCoverImage(resort.coverImage || resortPhotos[0] || "");
    setPhotos(resortPhotos);
    setCustomPhotoInput("");
    setAmenitiesStr(resort.amenities.join(", "));
    setSpecialitiesStr(resort.specialities.join(", "));
    setCheckInTime(resort.checkInTime || "01:00 PM");
    setCheckOutTime(resort.checkOutTime || "11:00 AM");
    setOverview(resort.overview || "");
    setNearbyAttractions(resort.nearbyAttractions && resort.nearbyAttractions.length > 0 ? resort.nearbyAttractions : [
      { name: "Banasura Sagar Dam", distance: "≈03 km" }
    ]);
    setIsModalOpen(true);
  };

  const handleAddAttraction = () => {
    setNearbyAttractions([...nearbyAttractions, { name: "", distance: "≈05 km" }]);
  };

  const handleRemoveAttraction = (index: number) => {
    setNearbyAttractions(nearbyAttractions.filter((_, i) => i !== index));
  };

  const handleAttractionChange = (index: number, field: keyof NearbyAttraction, value: string) => {
    const updated = [...nearbyAttractions];
    updated[index][field] = value;
    setNearbyAttractions(updated);
  };

  const handleSaveResort = async (e: React.FormEvent) => {
    e.preventDefault();

    const photoList = photos.filter(Boolean);
    const finalCover = coverImage.trim() || photoList[0] || "";

    const manualAmenityList = amenitiesStr
      .split(",")
      .map(s => s.trim())
      .filter(s => s.length > 0);
    const combinedAmenities = Array.from(new Set([...selectedAmenities, ...manualAmenityList]));

    const specialityList = specialitiesStr
      .split(",")
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const ambienceList = ambienceStr
      .split(",")
      .map(s => s.trim())
      .filter(s => s.length > 0) as AmbienceType[];

    const parsedB2cNumber = parseInt(rateB2c.replace(/[^0-9]/g, ""), 10) || pricePerNight;
    const parsedB2bNumber = parseInt(rateB2b.replace(/[^0-9]/g, ""), 10) || b2bRate;

    const resortObj: Resort = {
      id: editingResort ? editingResort.id : `resort-${code.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
      code: code.trim().toUpperCase(),
      name: name.trim(),
      slug: name.toLowerCase().replace(/[^a-z0-9]/g, "-") + "-" + destination.toLowerCase(),
      destination,
      locationDetails,
      googleMapsUrl: googleMapsUrl.trim() || undefined,
      accommodationType,
      stayPreference,
      ambience: ambienceList.length > 0 ? ambienceList : ["Mountain / Valley View"],
      category,
      categories: selectedCategories.length > 0 ? selectedCategories : [category],
      stayType,
      roomsProvidedType,
      budgetCategory,
      rates: {
        b2c: rateB2c.trim() || `₹${parsedB2cNumber.toLocaleString("en-IN")}`,
        b2b: rateB2b.trim() || `₹${parsedB2bNumber.toLocaleString("en-IN")}`,
        perPerson: ratePerPerson.trim() || undefined,
        fullProperty: rateFullProperty.trim() || undefined
      },
      roomsAvailableCount,
      dormitoryDetails: dormitoryDetails.trim() || undefined,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      maxAdults: Number(maxAdults),
      maxChildren: Number(maxChildren),
      maxGuests: Number(maxGuests),
      pricePerNight: parsedB2cNumber,
      b2bRate: parsedB2bNumber,
      featured: editingResort ? editingResort.featured : true,
      coverImage: finalCover,
      photos: photoList,
      amenities: combinedAmenities,
      specialities: specialityList,
      nearbyAttractions: nearbyAttractions.filter(a => a.name.trim().length > 0),
      checkInTime,
      checkOutTime,
      overview,
      inclusions: [
        "Exclusive access to villa & private pool",
        "Welcome drink on arrival",
        "High-speed WiFi"
      ],
      exclusions: [
        "Chef-prepared BBQ and dinners",
        "Vehicle sightseeing"
      ]
    };

    const res = await fetch("/api/v1/resorts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(resortObj)
    });

    if (res.ok) {
      const saved = await res.json();
      if (editingResort) {
        setResorts(resorts.map(r => r.id === saved.id ? saved : r));
      } else {
        setResorts([saved, ...resorts]);
      }
      setIsModalOpen(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const filtered = resorts.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.code.toLowerCase().includes(search.toLowerCase()) ||
    r.destination.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F5F6F8]">
      <AdminSidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
          <div>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">
              Resort & Villa Inventory Manager
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Add new properties with all 9 criteria (Accommodation Type, Stay Preference, Ambience, Adults, Children, Rooms, Attractions).
            </p>
          </div>

          <div className="flex items-center gap-3">
            {saveSuccess && (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Property Saved
              </span>
            )}
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#2E4F28] hover:bg-[#233D1F] px-4 py-2.5 rounded-xl transition shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add New Resort
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-6 max-w-md">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by code (AH-121), destination, or name..."
              className="w-full text-xs font-medium pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 bg-white"
            />
          </div>
        </div>

        {/* Resorts Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filtered.map((resort) => (
            <div
              key={resort.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 bg-stone-100">
                  {resort.coverImage ? (
                    <Image
                      src={resort.coverImage}
                      alt={resort.name}
                      fill
                      unoptimized={resort.coverImage?.startsWith("data:")}
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-stone-400 bg-stone-900 text-stone-300 font-medium">
                      No cover photo
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-[#1A2218] text-white text-xs font-mono font-bold px-2.5 py-1 rounded shadow">
                    {resort.code}
                  </div>
                  <div className="absolute top-3 right-3 bg-white/95 text-stone-800 text-[10px] font-bold px-2 py-0.5 rounded shadow">
                    {resort.accommodationType || resort.category}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-stone-900 text-base">{resort.name}</h3>
                  <p className="text-xs text-stone-500 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" /> {resort.destination}, Wayanad
                  </p>

                  <div className="flex items-center gap-4 text-xs font-medium text-stone-600 mt-3 pt-3 border-t border-stone-100">
                    <span className="flex items-center gap-1">
                      <Bed className="w-3.5 h-3.5 text-stone-400" /> {resort.bedrooms} BHK
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-stone-400" /> {resort.maxAdults || resort.maxGuests} Adults, {resort.maxChildren || 2} Kids
                    </span>
                  </div>

                  {/* Automation & Category Tags */}
                  <div className="mt-2.5 flex flex-wrap gap-1">
                    {(resort.categories && resort.categories.length > 0 ? resort.categories : [resort.accommodationType || resort.category]).slice(0, 3).map((cat, i) => (
                      <span key={i} className="text-[10px] bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded-md border border-emerald-100">
                        {cat}
                      </span>
                    ))}
                    {resort.categories && resort.categories.length > 3 && (
                      <span className="text-[10px] bg-emerald-50 text-emerald-800 font-semibold px-1.5 py-0.5 rounded-md">
                        +{resort.categories.length - 3} more
                      </span>
                    )}
                    {resort.stayType && (
                      <span className="text-[10px] bg-stone-100 text-stone-700 font-medium px-2 py-0.5 rounded-md border border-stone-200">
                        {resort.stayType}
                      </span>
                    )}
                    {resort.budgetCategory && (
                      <span className="text-[10px] bg-amber-50 text-amber-800 font-medium px-2 py-0.5 rounded-md border border-amber-200">
                        ₹{resort.budgetCategory}
                      </span>
                    )}
                    {resort.roomsAvailableCount && (
                      <span className="text-[10px] bg-blue-50 text-blue-800 font-medium px-2 py-0.5 rounded-md border border-blue-200">
                        {resort.roomsAvailableCount} Rooms
                      </span>
                    )}
                  </div>

                  {/* Pricing Box */}
                  <div className="mt-3 bg-stone-50 p-3 rounded-xl border border-stone-200/80 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-stone-400 block uppercase font-bold">Customer Rate</span>
                        <span className="text-sm font-extrabold text-[#2E4F28]">
                          {resort.rates?.b2c || `₹${resort.pricePerNight.toLocaleString("en-IN")}/n`}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-stone-400 block uppercase font-bold">B2B Agent Rate</span>
                        <span className="text-sm font-bold text-stone-700">
                          {resort.rates?.b2b || `₹${resort.b2bRate.toLocaleString("en-IN")}/n`}
                        </span>
                      </div>
                    </div>
                    {(resort.rates?.perPerson || resort.rates?.fullProperty) && (
                      <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-stone-600">
                        {resort.rates.perPerson && <span>Per Person: <strong className="text-stone-900">{resort.rates.perPerson}</strong></span>}
                        {resort.rates.fullProperty && <span>Full Property: <strong className="text-stone-900">{resort.rates.fullProperty}</strong></span>}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0 flex items-center justify-between gap-2 border-t border-stone-100 mt-3 pt-3">
                <Link
                  href={`/brochure/${resort.code}`}
                  target="_blank"
                  className="inline-flex items-center gap-1 text-xs font-bold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-3 py-2 rounded-xl transition"
                >
                  <FileText className="w-3.5 h-3.5" /> 12-Page PDF
                </Link>

                <button
                  onClick={() => openEditModal(resort)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-xl transition"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ADD / EDIT RESORT MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-3xl w-full p-8 shadow-2xl border border-stone-200 my-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <div>
                  <h2 className="text-xl font-bold text-stone-900">
                    {editingResort ? `Edit Resort [${editingResort.code}]` : "Add New Resort / Villa"}
                  </h2>
                  <p className="text-xs text-stone-500">Configure all 9 criteria: Accommodation Type, Stay Preference, Ambience, Guests & Attractions</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveResort} className="space-y-4 mt-6 text-xs font-medium">
                
                {/* 1. Code, Name */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-stone-700 mb-1">Resort Code * (e.g. AH-122)</label>
                    <input
                      type="text"
                      required
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 font-mono font-bold"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-stone-700 mb-1">Property Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. 3BHK-Private Pool Villa"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 font-semibold"
                    />
                  </div>
                </div>

                {/* AUTOMATION & MULTI-DIMENSION MATCHING MATRIX */}
                <div className="bg-gradient-to-br from-emerald-50/60 via-stone-50 to-emerald-50/40 p-5 rounded-2xl border-2 border-emerald-600/30 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-200/60">
                    <div>
                      <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-700" />
                        <span>Automation & Matching Filter Matrix</span>
                      </h3>
                      <p className="text-[11px] text-stone-600">
                        Multi-select category, stay types, budget tiers, and room counts used for automated WhatsApp Bot matching and custom quotes.
                      </p>
                    </div>
                  </div>

                  {/* 1. Category Choices (Multi-Select with Select All) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-stone-800 font-bold text-xs flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-emerald-700" />
                        Category Choices (Multi-Select)
                        <span className="text-[11px] font-normal text-stone-500">
                          ({selectedCategories.length} selected)
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={handleSelectAllCategories}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg border border-emerald-600/40 text-emerald-800 bg-white hover:bg-emerald-50 transition"
                      >
                        {selectedCategories.length === CATEGORY_CHOICES.length ? (
                          <>
                            <Square className="w-3 h-3 text-emerald-700" /> Deselect All
                          </>
                        ) : (
                          <>
                            <CheckSquare className="w-3 h-3 text-emerald-700" /> Select All Categories
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {CATEGORY_CHOICES.map((cat) => {
                        const isSelected = selectedCategories.includes(cat);
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => toggleCategory(cat)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                              isSelected
                                ? "bg-emerald-800 text-white border-emerald-800 shadow-sm"
                                : "bg-white text-stone-700 border-stone-200 hover:border-emerald-600/60"
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                            {cat}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Stay Type, Rooms Provided & Budget Category in 3 Columns */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    {/* Stay Type */}
                    <div className="bg-white p-3 rounded-xl border border-stone-200/80 space-y-1.5">
                      <label className="block text-stone-800 font-bold text-xs">Stay Type</label>
                      <div className="flex flex-col gap-1.5">
                        {STAY_TYPE_CHOICES.map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => setStayType(st)}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between border transition ${
                              stayType === st
                                ? "bg-emerald-50 text-emerald-900 border-emerald-600 font-bold"
                                : "bg-stone-50 text-stone-700 border-transparent hover:border-stone-200"
                            }`}
                          >
                            <span>{st}</span>
                            {stayType === st && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Rooms Provided */}
                    <div className="bg-white p-3 rounded-xl border border-stone-200/80 space-y-1.5">
                      <label className="block text-stone-800 font-bold text-xs">Rooms Provided</label>
                      <div className="flex flex-col gap-1.5">
                        {ROOMS_PROVIDED_CHOICES.map((rp) => (
                          <button
                            key={rp}
                            type="button"
                            onClick={() => setRoomsProvidedType(rp)}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between border transition ${
                              roomsProvidedType === rp
                                ? "bg-emerald-50 text-emerald-900 border-emerald-600 font-bold"
                                : "bg-stone-50 text-stone-700 border-transparent hover:border-stone-200"
                            }`}
                          >
                            <span>{rp}</span>
                            {roomsProvidedType === rp && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Budget Category */}
                    <div className="bg-white p-3 rounded-xl border border-stone-200/80 space-y-1.5">
                      <label className="block text-stone-800 font-bold text-xs">Budget Category (₹)</label>
                      <div className="flex flex-col gap-1.5">
                        {BUDGET_CATEGORY_CHOICES.map((bc) => (
                          <button
                            key={bc}
                            type="button"
                            onClick={() => setBudgetCategory(bc)}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between border transition ${
                              budgetCategory === bc
                                ? "bg-emerald-50 text-emerald-900 border-emerald-600 font-bold"
                                : "bg-stone-50 text-stone-700 border-transparent hover:border-stone-200"
                            }`}
                          >
                            <span>₹ {bc}</span>
                            {budgetCategory === bc && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 3. No. of Rooms Available & Dormitory Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="bg-white p-3 rounded-xl border border-stone-200/80 space-y-2">
                      <label className="block text-stone-800 font-bold text-xs">
                        No. of Rooms Available
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {ROOMS_AVAILABLE_OPTIONS.map((opt) => {
                          const isActive = String(roomsAvailableCount) === String(opt);
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => {
                                setRoomsAvailableCount(opt);
                                if (typeof opt === "number") setBedrooms(opt);
                              }}
                              className={`w-9 h-9 rounded-xl text-xs font-bold transition border flex items-center justify-center ${
                                isActive
                                  ? "bg-emerald-800 text-white border-emerald-800 shadow"
                                  : "bg-stone-50 text-stone-700 border-stone-200 hover:border-emerald-500"
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-stone-200/80 space-y-1">
                      <label className="block text-stone-800 font-bold text-xs">
                        Dormitory Details (If in case there)
                      </label>
                      <input
                        type="text"
                        value={dormitoryDetails}
                        onChange={(e) => setDormitoryDetails(e.target.value)}
                        placeholder="e.g. 12-Bed AC Dormitory with 2 attached washrooms and lockers"
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-xs focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* 4. Rates (Text Input Options for B2C, B2B, Per Person, Full Property) */}
                  <div className="bg-white p-3.5 rounded-xl border border-stone-200/80 space-y-2.5">
                    <div>
                      <label className="block text-stone-800 font-bold text-xs flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-700" />
                        Rate Details (Enter Custom Text)
                      </label>
                      <p className="text-[10px] text-stone-500">
                        Enter custom text rates (e.g. ₹12,000 / night, ₹9,000 net, ₹2,200 / person, ₹35,000 full property).
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-stone-700 font-medium text-[11px] mb-1">
                          B2C Customer Rate *
                        </label>
                        <input
                          type="text"
                          value={rateB2c}
                          onChange={(e) => {
                            setRateB2c(e.target.value);
                            const num = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10);
                            if (num) setPricePerNight(num);
                          }}
                          placeholder="e.g. ₹12,000 / night"
                          className="w-full px-3 py-1.5 rounded-xl border border-stone-200 font-semibold text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-stone-700 font-medium text-[11px] mb-1">
                          B2B Agent Rate *
                        </label>
                        <input
                          type="text"
                          value={rateB2b}
                          onChange={(e) => {
                            setRateB2b(e.target.value);
                            const num = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10);
                            if (num) setB2bRate(num);
                          }}
                          placeholder="e.g. ₹9,000 / night"
                          className="w-full px-3 py-1.5 rounded-xl border border-stone-200 font-semibold text-xs text-stone-700"
                        />
                      </div>

                      <div>
                        <label className="block text-stone-700 font-medium text-[11px] mb-1">
                          Per Person Rate
                        </label>
                        <input
                          type="text"
                          value={ratePerPerson}
                          onChange={(e) => setRatePerPerson(e.target.value)}
                          placeholder="e.g. ₹2,200 / person"
                          className="w-full px-3 py-1.5 rounded-xl border border-stone-200 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-stone-700 font-medium text-[11px] mb-1">
                          Full Property Rate
                        </label>
                        <input
                          type="text"
                          value={rateFullProperty}
                          onChange={(e) => setRateFullProperty(e.target.value)}
                          placeholder="e.g. ₹35,000 / property"
                          className="w-full px-3 py-1.5 rounded-xl border border-stone-200 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Accommodation Type & Stay Preference */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-700 mb-1">1. Accommodation Type *</label>
                    <select
                      value={accommodationType}
                      onChange={(e) => {
                        setAccommodationType(e.target.value as AccommodationType);
                        if (e.target.value === "Private Pool Villa") setCategory("Pool Villa");
                        else if (e.target.value === "Tree House") setCategory("Tree House");
                        else if (e.target.value === "Budget Stay") setCategory("Budget Resort");
                        else setCategory("Luxury Resort");
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                    >
                      {(taxonomies?.resortFilters?.accommodationTypes || [
                        "Private Pool Villa",
                        "Tree House",
                        "Luxury Resort",
                        "Plantation Resort",
                        "Heritage Bungalow",
                        "Budget Stay",
                        "Glamping / Tent",
                        "Houseboat"
                      ]).map((type: string) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-stone-700 mb-1">2. Stay Preference *</label>
                    <select
                      value={stayPreference}
                      onChange={(e) => setStayPreference(e.target.value as StayPreference)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                    >
                      {(taxonomies?.resortFilters?.stayPreferences || [
                        "Independent Private Cottage/Villa",
                        "Individual Room/Suite",
                        "Group / Bachelor Friendly",
                        "Family Gathering"
                      ]).map((pref: string) => (
                        <option key={pref} value={pref}>{pref}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 3. Destination & Ambience */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-700 mb-1">3. Location (Destination) *</label>
                    <select
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white"
                    >
                      {(taxonomies?.resortFilters?.destinations || [
                        "Padinjarathara",
                        "Vythiri",
                        "Meppadi",
                        "Sulthan Bathery",
                        "Kalpetta",
                        "Ambalavayal",
                        "Muthanga",
                        "Mananthavady",
                        "Lakkidi"
                      ]).map((dest: string) => (
                        <option key={dest} value={dest.split(" ")[0]}>{dest}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-stone-700 mb-1">4. Ambience / Vibe (Comma-separated)</label>
                    <input
                      type="text"
                      value={ambienceStr}
                      onChange={(e) => setAmbienceStr(e.target.value)}
                      placeholder="e.g. Mountain / Valley View, Lake / Dam Waterfront, Secluded"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200"
                    />
                  </div>
                </div>

                {/* 4. Google Maps & Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-700 mb-1">Address / Landmark</label>
                    <input
                      type="text"
                      value={locationDetails}
                      onChange={(e) => setLocationDetails(e.target.value)}
                      placeholder="Near Banasura Dam, Padinjarathara"
                      className="w-full px-3 py-2 rounded-xl border border-stone-200"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 mb-1">Google Maps Navigation URL</label>
                    <input
                      type="url"
                      value={googleMapsUrl}
                      onChange={(e) => setGoogleMapsUrl(e.target.value)}
                      placeholder="https://maps.google.com/?q=..."
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 font-mono text-[11px]"
                    />
                  </div>
                </div>

                {/* 5. Bedrooms, Adults, Children, Guests & Rates */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-stone-700 mb-1">Rooms (BHK)</label>
                    <input
                      type="number"
                      min={1}
                      value={bedrooms}
                      onChange={(e) => setBedrooms(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 mb-1">Max Adults</label>
                    <input
                      type="number"
                      min={1}
                      value={maxAdults}
                      onChange={(e) => setMaxAdults(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 mb-1">Max Kids</label>
                    <input
                      type="number"
                      min={0}
                      value={maxChildren}
                      onChange={(e) => setMaxChildren(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 mb-1">Rack Rate (₹)</label>
                    <input
                      type="number"
                      value={pricePerNight}
                      onChange={(e) => setPricePerNight(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 mb-1">B2B Rate (₹)</label>
                    <input
                      type="number"
                      value={b2bRate}
                      onChange={(e) => setB2bRate(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 font-bold text-stone-600"
                    />
                  </div>
                </div>

                {/* Interactive Resort Photo Studio */}
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-stone-900 text-xs flex items-center gap-2">
                        <Upload className="w-4 h-4 text-emerald-700" />
                        <span>Resort Photos & Media</span>
                      </h4>
                      <p className="text-[11px] text-stone-500">
                        Upload high-resolution property photos. Files are permanently stored on server disk and will never reset.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleUploadPhotos}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingPhotos}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-sm transition disabled:opacity-50"
                      >
                        {isUploadingPhotos ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>{uploadProgressText || "Uploading..."}</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Photos</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Uploaded Photos Thumbnails Preview */}
                  {photos.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                      {photos.map((photoUrl, idx) => {
                        const isCover = coverImage === photoUrl || (!coverImage && idx === 0);
                        return (
                          <div
                            key={idx}
                            className={`relative group rounded-xl overflow-hidden border aspect-video bg-stone-900 ${
                              isCover ? "border-emerald-600 ring-2 ring-emerald-600/30" : "border-stone-200"
                            }`}
                          >
                            <img
                              src={photoUrl}
                              alt="Resort Preview"
                              className="w-full h-full object-cover"
                            />
                            {isCover && (
                              <div className="absolute top-1 left-1 bg-emerald-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                                Cover Photo
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                              {!isCover && (
                                <button
                                  type="button"
                                  onClick={() => handleSetCoverPhoto(photoUrl)}
                                  className="p-1.5 bg-white/90 hover:bg-white text-emerald-800 rounded-lg text-[10px] font-bold shadow transition"
                                  title="Set as Cover"
                                >
                                  Set Cover
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemovePhoto(photoUrl)}
                                className="p-1.5 bg-red-600/90 hover:bg-red-600 text-white rounded-lg text-[10px] shadow transition"
                                title="Delete photo"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Manual Path Overrides (Advanced) */}
                  <div className="pt-2 border-t border-stone-200/80 space-y-2">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-600 mb-1">Cover Image URL / Path</label>
                      <input
                        type="text"
                        value={coverImage}
                        onChange={(e) => setCoverImage(e.target.value)}
                        placeholder="/uploads/resorts/photo.jpg or https://..."
                        className="w-full px-3 py-1.5 rounded-xl border border-stone-200 font-mono text-[11px] bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-stone-600 mb-1">Add Photo by Direct Link / URL</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={customPhotoInput}
                          onChange={(e) => setCustomPhotoInput(e.target.value)}
                          placeholder="https://images.unsplash.com/... or /uploads/..."
                          className="flex-1 px-3 py-1.5 rounded-xl border border-stone-200 font-mono text-[11px] bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (customPhotoInput.trim()) {
                              const trimmed = customPhotoInput.trim();
                              setPhotos((prev) => [...prev, trimmed]);
                              if (!coverImage) setCoverImage(trimmed);
                              setCustomPhotoInput("");
                            }
                          }}
                          className="px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-bold transition"
                        >
                          Add Link
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interactive Amenities Selector with Select All */}
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                        Amenities & Facilities Checklist
                        <span className="text-[11px] font-normal text-stone-500">
                          ({selectedAmenities.length}/{STANDARD_AMENITIES.length} selected)
                        </span>
                      </h4>
                      <p className="text-[10px] text-stone-500">
                        Check all applicable amenities. These power website badges, 12-page brochures, and WhatsApp bot matching.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleSelectAllAmenities}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-xl border border-emerald-700/40 text-emerald-800 bg-white hover:bg-emerald-50 transition shadow-sm"
                    >
                      {selectedAmenities.length >= STANDARD_AMENITIES.length ? (
                        <>
                          <Square className="w-3.5 h-3.5 text-emerald-700" /> Deselect All
                        </>
                      ) : (
                        <>
                          <CheckSquare className="w-3.5 h-3.5 text-emerald-700" /> Select All Amenities
                        </>
                      )}
                    </button>
                  </div>

                  {/* 17 Standard Amenities Checkbox Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pt-1">
                    {STANDARD_AMENITIES.map((amenity) => {
                      const isChecked = selectedAmenities.includes(amenity);
                      return (
                        <button
                          key={amenity}
                          type="button"
                          onClick={() => toggleAmenity(amenity)}
                          className={`flex items-center gap-2 p-2 rounded-xl text-left text-xs transition border ${
                            isChecked
                              ? "bg-emerald-50 border-emerald-600 text-emerald-950 font-bold"
                              : "bg-white border-stone-200 text-stone-600 hover:border-stone-300 font-medium"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                              isChecked ? "bg-emerald-700 border-emerald-700 text-white" : "border-stone-300 bg-white"
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3" />}
                          </div>
                          <span className="truncate">{amenity}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Amenity Adder */}
                  <div className="pt-2 border-t border-stone-200/80 flex items-center gap-2">
                    <input
                      type="text"
                      value={customAmenityInput}
                      onChange={(e) => setCustomAmenityInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddCustomAmenity();
                        }
                      }}
                      placeholder="Add custom amenity (e.g. Forest View Deck, EV Charging Hub)..."
                      className="flex-1 px-3 py-1.5 rounded-xl border border-stone-200 bg-white text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomAmenity}
                      className="px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-bold transition shrink-0"
                    >
                      + Add Amenity
                    </button>
                  </div>

                  {/* Manual Comma-Separated Tag Sync (Advanced) */}
                  <div className="pt-2 border-t border-stone-200/80">
                    <label className="block text-[11px] font-bold text-stone-600 mb-1">
                      Additional Amenities / Custom Raw Tags (Comma-separated)
                    </label>
                    <input
                      type="text"
                      value={amenitiesStr}
                      onChange={(e) => setAmenitiesStr(e.target.value)}
                      placeholder="e.g. Infinity Swimming Pool, Kids Play area, Camp Fire"
                      className="w-full px-3 py-1.5 rounded-xl border border-stone-200 text-xs bg-white"
                    />
                  </div>
                </div>

                {/* Nearby Attractions */}
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-stone-900 text-xs">
                        Nearby Tourist Attractions & Distances
                      </h4>
                      <p className="text-[10px] text-stone-500">
                        These will automatically be sent in the WhatsApp confirmation message to the guest!
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddAttraction}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-white border border-stone-200 hover:bg-emerald-50 px-2.5 py-1 rounded-lg"
                    >
                      <Plus className="w-3 h-3" /> Add Attraction
                    </button>
                  </div>

                  <div className="space-y-2">
                    {nearbyAttractions.map((att, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={att.name}
                          onChange={(e) => handleAttractionChange(idx, "name", e.target.value)}
                          placeholder="Attraction name (e.g. Banasura Sagar Dam)"
                          className="flex-1 px-3 py-1.5 rounded-lg border border-stone-200 bg-white"
                        />
                        <input
                          type="text"
                          value={att.distance}
                          onChange={(e) => handleAttractionChange(idx, "distance", e.target.value)}
                          placeholder="Distance (e.g. ≈03 km)"
                          className="w-32 px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-center"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveAttraction(idx)}
                          className="text-stone-400 hover:text-red-600 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Check In / Out & Overview */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-700 mb-1">Check-in Time</label>
                    <input
                      type="text"
                      value={checkInTime}
                      onChange={(e) => setCheckInTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 mb-1">Check-out Time</label>
                    <input
                      type="text"
                      value={checkOutTime}
                      onChange={(e) => setCheckOutTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 mb-1">Property Overview</label>
                  <textarea
                    rows={3}
                    value={overview}
                    onChange={(e) => setOverview(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200"
                  />
                </div>

                {/* Submit */}
                <div className="pt-4 border-t border-stone-200 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-stone-600 font-semibold hover:bg-stone-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#2E4F28] hover:bg-[#233D1F] text-white font-bold rounded-xl shadow transition"
                  >
                    {editingResort ? "Save Changes" : "Create Resort & Brochure"}
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
