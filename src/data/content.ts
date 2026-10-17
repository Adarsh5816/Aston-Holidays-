import { HolidayPackage, BlogPost, ClientReview } from "@/lib/types";

export const initialPackages: HolidayPackage[] = [
  {
    id: "pkg-hm-1",
    title: "Wayanad Mist & Roses Romantic Escape",
    category: "Honey Moon Package",
    tagline: "Candlelight Dinners, Heated Plunge Pool & Misty Valley Panoramas",
    duration: "3 Days / 2 Nights",
    price: 24999,
    featured: true,
    image: "/brochure-assets/extracted_img_2.jpg",
    inclusions: [
      "2 Nights in Private Pool Villa with mountain sunrise view",
      "Romantic Candlelight Dinner by the pool with acoustic playlist",
      "Floral Bed Decoration & Signature Spiced Honeymoon Cake",
      "Private Guided Plantation Trail & Sunset at Lakkidi View Point",
      "Daily Chef Breakfast & Authentic Malabar Gourmet Dinners",
      "Complimentary High-Definition Photo Voucher"
    ],
    description: "Designed exclusively for newlyweds, this secluded haven blends wild rainforest tranquility with tender romantic touches. Unwind in your temperature-controlled private pool while the afternoon clouds roll over the valley canopy.",
    applicableResortCodes: ["AH-112", "AH-114", "AH-121"]
  },
  {
    id: "pkg-hm-2",
    title: "Canopy Cloud Rainforest Treehouse Honeymoon",
    category: "Honey Moon Package",
    tagline: "Elevated Solitude Amidst Tropical Canopies & Whispering Brooks",
    duration: "3 Days / 2 Nights",
    price: 28500,
    featured: true,
    image: "/brochure-assets/extracted_img_29.jpg",
    inclusions: [
      "Luxury Treehouse stay suspended 40ft in the rainforest canopy",
      "Private couple Ayurvedic rejuvenation massage (60 mins)",
      "Evening bonfire setup with artisanal roasted marshmallows",
      "Exclusive guided dawn trek to secluded forest waterfalls",
      "Signature high tea with freshly plucked estate cardamom infusions"
    ],
    description: "Wake to the chorus of exotic hornbills and early morning mountain mist. An extraordinary elevated perspective of Wayanad's primordial rainforests with premier eco-luxury comforts.",
    applicableResortCodes: ["AH-105", "AH-118"]
  },
  {
    id: "pkg-de-1",
    title: "Wayanad Royal Estate Destination Wedding",
    category: "Destination events",
    tagline: "A Dreamy Forest-Mountain Ceremony Amidst 15-Acre Private Foliage",
    duration: "3 Days / 2 Nights",
    price: 185000,
    featured: true,
    image: "/brochure-assets/extracted_img_7.jpg",
    inclusions: [
      "Exclusive buyout of entire villa cluster (Accommodates up to 45 guests)",
      "Traditional Kerala Nadaswaram & Panchavadyam arrival welcome",
      "Open-air mandap setup overlooking Banasura Sagar mountain lake",
      "Grand 24-item Royal Malabar Sadhya & evening barbecue banquet",
      "Fairy light illuminated lawn with acoustic sound setup & campfire"
    ],
    description: "Exchange vows framed by emerald mountains and ancient shola forests. Aston Holidays handles bespoke staging, private chef catering, guest transfers, and luxury accommodation.",
    applicableResortCodes: ["AH-121", "AH-123", "AH-124"]
  },
  {
    id: "pkg-de-2",
    title: "Executive Corporate Mountain Offsite & Strategy Turf",
    category: "Destination events",
    tagline: "Unwind, Strategize & Bond in Secluded Western Ghats Solitude",
    duration: "2 Days / 1 Night",
    price: 65000,
    featured: false,
    image: "/brochure-assets/extracted_img_13.jpg",
    inclusions: [
      "Dedicated multi-bedroom villa estate with conference turf",
      "High-speed fiber WiFi & 4K projection display setup",
      "Guided off-road team obstacle trail & river crossing adventure",
      "Evening campfire with live acoustic music and chef BBQ skewers",
      "All meals including morning South Indian breakfast & dinner banquet"
    ],
    description: "Ditch traditional conference rooms for mist-kissed verandas. Combine focused executive brainstorming with exhilarating outdoor experiences.",
    applicableResortCodes: ["AH-118", "AH-120", "AH-122"]
  },
  {
    id: "pkg-gp-1",
    title: "Bachelors & Friends Wayanad Adventure Safari",
    category: "Group Packages",
    tagline: "Private Pool Villa, 4x4 Off-Road Trail & Bamboo Rafting",
    duration: "3 Days / 2 Nights",
    price: 22000,
    featured: true,
    image: "/brochure-assets/extracted_img_16.jpg",
    inclusions: [
      "Exclusive access to 3BHK/4BHK Private Pool Villa",
      "4x4 Open Jeep Safari through rugged forest tracks",
      "Bamboo rafting excursion across Kuruva Evergreen Island",
      "Unlimited campfire nights with high-bass Bluetooth speaker",
      "Barbecue grill & marinated chicken/veg setup by villa caretaker"
    ],
    description: "Crafted for friend squads who crave untamed adventures by day and lively private pool parties by night with absolute privacy.",
    applicableResortCodes: ["AH-116", "AH-121", "AH-126"]
  },
  {
    id: "pkg-gp-2",
    title: "Grand Family Reunion Multi-Villa Estate",
    category: "Group Packages",
    tagline: "Multi-Generation Celebration with Private Lawns & Dedicated Chef",
    duration: "3 Days / 2 Nights",
    price: 36000,
    featured: false,
    image: "/brochure-assets/extracted_img_10.jpg",
    inclusions: [
      "Adjoining private villas accommodating up to 20 family members",
      "Private swimming pool with dedicated toddler splash area",
      "Sprawling manicured lawn for cricket, badminton, and games",
      "Dedicated in-house chef preparing customized home-style meals",
      "Sightseeing coordination with private comfortable AC traveler cab"
    ],
    description: "Bring grandparents, kids, and cousins together in one secure, scenic sanctuary with customized home-style catering and endless laughter.",
    applicableResortCodes: ["AH-114", "AH-118", "AH-124"]
  },
  {
    id: "pkg-best-1",
    title: "Aston Signature Wayanad Circuit Grand Tour",
    category: "Best Holiday Package",
    tagline: "All-Inclusive VIP Sightseeing, Private Pool Stay & Chauffeur",
    duration: "4 Days / 3 Nights",
    price: 34999,
    featured: true,
    image: "/brochure-assets/extracted_img_5.jpg",
    inclusions: [
      "3 Nights in Handpicked Luxury Pool Villa",
      "Chauffeur-driven private AC vehicle for all 4 days",
      "VIP entries to Edakkal Caves, Banasura Sagar Dam, and Pookode Lake",
      "Daily breakfast buffet & curated dinner spread",
      "Pick-up and drop from Calicut Airport (CCJ) or Railway Station"
    ],
    description: "The gold standard Wayanad holiday. Experience the historic petroglyphs, mountain lakes, mist viewpoints, and prime luxury stays without worrying about logistics.",
    applicableResortCodes: ["AH-112", "AH-121"]
  },
  {
    id: "pkg-best-2",
    title: "Weekend Rainforest Escape & Stream Dipping",
    category: "Best Holiday Package",
    tagline: "Quick Recharge for Bangalore, Kochi & Calicut Travelers",
    duration: "2 Days / 1 Night",
    price: 13999,
    featured: true,
    image: "/brochure-assets/extracted_img_20.jpg",
    inclusions: [
      "1 Night in Private Hilltop Cottage with forest panorama",
      "Direct access to private natural mountain freshwater stream",
      "Night campfire with herbal spiced tea & roasted snacks",
      "Complimentary Wayanad organic spice gift hamper (Pepper & Cardamom)"
    ],
    description: "The perfect 48-hour decompression. Leave Friday evening and return Monday morning completely recharged by the Western Ghats rainforest air.",
    applicableResortCodes: ["AH-111", "AH-114"]
  }
];

export const initialBlogs: BlogPost[] = [
  {
    id: "blog-1",
    title: "Monsoon Mist in Lakkidi: Why Wayanad is South India's Rain Paradise",
    slug: "monsoon-mist-lakkidi-wayanad-paradise",
    category: "Seasonal Guide",
    excerpt: "When the South-West monsoon washes over Lakkidi, Wayanad transforms into a theatrical dream of cascading waterfalls, swirling fog, and emerald slopes.",
    content: "Lakkidi, often described as the 'Gateway of Wayanad', receives one of the highest rainfalls in all of peninsular India. Driving up the Thamarassery Ghats with its 9 hairpin curves, the air turns cool and thick with pine scent. Here, vacationing in a private pool villa during the monsoon offers an experience unlike anywhere else on earth.",
    readTime: "4 min read",
    date: "October 14, 2026",
    image: "/brochure-assets/extracted_img_2.jpg",
    author: "Aston Holidays Editorial Desk",
    featured: true
  },
  {
    id: "blog-2",
    title: "Decoding the 6,000-Year-Old Rock Petroglyphs of Edakkal Caves",
    slug: "decoding-ancient-petroglyphs-edakkal-caves",
    category: "Heritage & History",
    excerpt: "High atop Ambukuthi Hills lie the Neolithic rock carvings that inspired Aston Holidays' iconic brand footprint.",
    content: "Dating back to at least 6,000 BCE, Edakkal is not technically a cave, but a cleft formed by a massive boulder stranded between two rock walls. The petroglyphs carved deep into its quartzite stone depict ancient figures, wheeled carts, and animal motifs—the only stone age engravings discovered in South India.",
    readTime: "6 min read",
    date: "October 02, 2026",
    image: "/brochure-assets/extracted_img_7.jpg",
    author: "Heritage Research Wing",
    featured: true
  },
  {
    id: "blog-3",
    title: "The Legend of Chembra Peak: Trekking to the Natural Heart-Shaped Lake",
    slug: "chembra-peak-heart-shaped-lake-trek",
    category: "Adventure & Trekking",
    excerpt: "At 2,100 meters above sea level, Chembra Peak harbors a natural lake shaped like a heart that is believed never to dry up.",
    content: "The trek through the rolling tea estates of Meppadi up into the high montane grasslands (Shola forests) is an unforgettable pilgrimage for nature lovers. When you stand before 'Hridaya Saras' (the Heart Lake), shrouded in clouds, the world feels pristine and untouched.",
    readTime: "5 min read",
    date: "September 24, 2026",
    image: "/brochure-assets/extracted_img_29.jpg",
    author: "Adventure Guide Desk",
    featured: false
  },
  {
    id: "blog-4",
    title: "Flavors of the Ghats: The Culinary Magic of Malabar & Wayanadan Spices",
    slug: "flavors-of-wayanad-malabar-spices",
    category: "Food & Culture",
    excerpt: "From pathiri and spicy chicken stew to earthen pot bamboo biryani and fresh green pepper pickles, taste the authentic heritage of Wayanad.",
    content: "Wayanad's cuisine is intimately woven with its soil. Organic black pepper, sun-dried cardamom, bird's eye chilies (Kanthari), and freshly pressed coconut milk create a flavor profile that is aromatic, comforting, and unforgettable.",
    readTime: "3 min read",
    date: "September 18, 2026",
    image: "/brochure-assets/extracted_img_16.jpg",
    author: "Culinary Curator",
    featured: false
  }
];

export const initialReviews: ClientReview[] = [
  {
    id: "rev-1",
    name: "Ananya & Siddharth",
    location: "Bangalore",
    rating: 5,
    packageTaken: "Wayanad Mist & Roses Romantic Escape (AH-112)",
    review: "Our honeymoon stay at AH-112 was absolute bliss! The candlelight dinner arranged right next to our heated pool overlooking the mist was unforgettable. Receiving the HD PDF brochure on WhatsApp within 30 seconds made planning effortless.",
    date: "October 2026",
    avatar: "AS"
  },
  {
    id: "rev-2",
    name: "Vikramaditya Rao & Family",
    location: "Hyderabad",
    rating: 5,
    packageTaken: "Grand Family Reunion Multi-Villa Estate (AH-121)",
    review: "We booked for a family of 14 people. Having the private pool and entire estate to ourselves gave our children and elders complete privacy and freedom. The caretaker was courteous and the food was 10/10.",
    date: "September 2026",
    avatar: "VR"
  },
  {
    id: "rev-3",
    name: "Deepak Kurup & Team",
    location: "Dubai & Kochi",
    rating: 5,
    packageTaken: "Bachelors & Friends Wayanad Adventure Safari",
    review: "Aston Holidays organized our college reunion. The 4x4 off-road jeep safari and the evening acoustic campfire were legendary. Super transparent rates and prompt coordination.",
    date: "September 2026",
    avatar: "DK"
  },
  {
    id: "rev-4",
    name: "Dr. Meera Nambiar",
    location: "Calicut",
    rating: 5,
    packageTaken: "Weekend Rainforest Escape & Stream Dipping",
    review: "We love that Aston Holidays doesn't charge hidden fees and curates strictly verified stays. Dipping in the private freshwater stream right outside our cottage was restorative. We will definitely be back!",
    date: "August 2026",
    avatar: "MN"
  }
];

export const whisperingTownsData = [
  {
    name: "Vythiri",
    tagline: "The Misty Gateway & Rainforest Canopy",
    description: "Nestled in dense evergreen forests with year-round cool mist, suspension bridges, and famous hill viewpoints.",
    keyAttractions: ["Lakkidi View Point", "Pookode Lake", "En Ooru Tribal Village", "Chain Tree"],
    distanceFromCalicut: "65 km",
    icon: "🌫️"
  },
  {
    name: "Sulthan Bathery",
    tagline: "Ancient Petroglyphs & Royal Forts",
    description: "A historic hub boasting prehistoric rock art at Edakkal Caves, the 14th-century Jain temple, and wildlife elephant safaris.",
    keyAttractions: ["Edakkal Prehistoric Caves", "Heritage Museum", "Jain Temple", "Muthanga Wildlife Sanctuary"],
    distanceFromCalicut: "98 km",
    icon: "🪨"
  },
  {
    name: "Padinjarathara",
    tagline: "Mirror Lakes & Earth Dam Vistas",
    description: "Home to Banasura Sagar, India's largest earthen dam, surrounded by dramatic peaks and shimmering blue waters.",
    keyAttractions: ["Banasura Sagar Dam", "Karlad Lake", "Meenmutty Waterfalls", "Speed Boating Turf"],
    distanceFromCalicut: "82 km",
    icon: "🌊"
  },
  {
    name: "Meppadi",
    tagline: "Rolling Tea Slopes & The Heart Lake",
    description: "Endless emerald tea plantations leading to Chembra Peak and the cascading thunder of Soochipara Waterfalls.",
    keyAttractions: ["Chembra Peak Heart Lake", "Soochipara Falls", "Kanthanpara Falls", "900 Kandi Glass Bridge"],
    distanceFromCalicut: "76 km",
    icon: "⛰️"
  },
  {
    name: "Mananthavady",
    tagline: "Bamboo Rafting & Spiritual Foothills",
    description: "A cultural and natural sanctuary famous for the evergreen Kuruva Island archipelago and the ancient Thirunelli Temple.",
    keyAttractions: ["Kuruva Evergreen Island", "Thirunelli Maha Vishnu Temple", "Pazhassi Raja Tomb", "Brahmagiri Hills"],
    distanceFromCalicut: "95 km",
    icon: "🎋"
  },
  {
    name: "Kalpetta",
    tagline: "Vibrant Foothills & Artisan Coffee Roasts",
    description: "The bustling heart of Wayanad surrounded by fragrant coffee estates, spice emporiums, and panoramic hill perches.",
    keyAttractions: ["Karapuzha Dam", "Koottamundu Glass Temple", "Wayanad Spice Markets", "Coffee Plantation Trails"],
    distanceFromCalicut: "72 km",
    icon: "☕"
  }
];
