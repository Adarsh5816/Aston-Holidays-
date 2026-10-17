import { HolidayPackage, BlogPost, ClientReview } from "@/lib/types";

export const initialPackages: HolidayPackage[] = [
  // 1. Best Holiday Package
  {
    id: "pkg-best-1",
    title: "Adventure Wayanad",
    category: "Best Holiday Package",
    tagline: "High-altitude trails, bamboo rafting & off-road 4x4 safaris",
    duration: "3 Days / 2 Nights",
    price: 18999,
    featured: true,
    image: "/brochure-assets/extracted_img_5.jpg",
    inclusions: [
      "2 Nights stay in Verified Code-Protected Villa",
      "Kuruva Island bamboo rafting expedition",
      "4x4 Rugged jeep safari through deep forest trails",
      "Campfire with acoustic sound setup under starry skies",
      "Daily breakfast & traditional Kerala dinner spread"
    ],
    description: "Find peace in the rhythm of waterfalls, joy in the laughter of local life, and meaning in journeys that linger long after they end. Book now!",
    applicableResortCodes: ["AH-121", "AH-116"]
  },
  {
    id: "pkg-best-2",
    title: "Trinity of Sanctuaries",
    category: "Best Holiday Package",
    tagline: "Wildlife safaris, pristine dam lakes & ancient hill trails",
    duration: "4 Days / 3 Nights",
    price: 26500,
    featured: true,
    image: "/brochure-assets/extracted_img_2.jpg",
    inclusions: [
      "3 Nights in luxury pool villa retreat",
      "Muthanga Wildlife Sanctuary elephant jeep safari",
      "Banasura Sagar earthen dam speed-boating",
      "Edakkal Prehistoric Caves guided exploration",
      "All transfers in private chauffeur-driven AC cab"
    ],
    description: "An extraordinary journey connecting Wayanad's three sacred sanctuaries of nature, wildlife, and Neolithic heritage.",
    applicableResortCodes: ["AH-112", "AH-114"]
  },
  {
    id: "pkg-best-3",
    title: "Educational Excursion",
    category: "Best Holiday Package",
    tagline: "Living tribal heritage, tea processing & historical cave archaeology",
    duration: "3 Days / 2 Nights",
    price: 14500,
    featured: false,
    image: "/brochure-assets/extracted_img_7.jpg",
    inclusions: [
      "En Ooru Tribal Heritage Village guided masterclass",
      "Century-old tea estate tour with sommelier tasting",
      "Wayanad Heritage Museum & Jain Temple expedition",
      "Comfortable group stay with hygienic buffet meals"
    ],
    description: "An immersive learning holiday combining environmental geography, tribal culture, and historical archaeology in Wayanad.",
    applicableResortCodes: ["AH-118", "AH-120"]
  },
  {
    id: "pkg-best-4",
    title: "Explore Wayanad Circuit",
    category: "Best Holiday Package",
    tagline: "Complete iconic landmarks tour from Lakkidi to Kuruva",
    duration: "4 Days / 3 Nights",
    price: 29999,
    featured: true,
    image: "/brochure-assets/extracted_img_13.jpg",
    inclusions: [
      "Lakkidi View Point & Pookode Freshwater Lake",
      "Chembra Peak & Soochipara Cascading Waterfalls",
      "Banasura Dam & Karlad Adventure Turf",
      "Full chauffeur cab and resort breakfast & dinner"
    ],
    description: "Experience the ultimate Wayanad vacation covering all major scenic viewpoints, lakes, waterfalls, and tea gardens.",
    applicableResortCodes: ["AH-112", "AH-121"]
  },

  // 2. Honey Moon Package
  {
    id: "pkg-hm-1",
    title: "Love Nest in the Heights",
    category: "Honey Moon Package",
    tagline: "Private Heated Pool Villa suspended above misty mountain valleys",
    duration: "3 Days / 2 Nights",
    price: 27999,
    featured: true,
    image: "/brochure-assets/extracted_img_2.jpg",
    inclusions: [
      "2 Nights in Secluded Private Pool Villa (100% Privacy)",
      "Candlelight Dinner poolside with acoustic romantic music",
      "Floral Bed Decoration & Signature Honeymoon Cake",
      "Sunset viewpoints tour at Lakkidi & tea garden walk",
      "Daily Chef Breakfast & Gourmet Malabar Dinners"
    ],
    description: "Discover the magic of Wayanad with our best honeymoon package. Explore lush landscapes, vibrant culture, and thrilling adventures for an unforgettable vacation.",
    applicableResortCodes: ["AH-112", "AH-121"]
  },
  {
    id: "pkg-hm-2",
    title: "Moonlit Waters Retreat",
    category: "Honey Moon Package",
    tagline: "Waterfront tranquility with private veranda overlooking the lake",
    duration: "3 Days / 2 Nights",
    price: 24500,
    featured: true,
    image: "/brochure-assets/extracted_img_8.jpg",
    inclusions: [
      "Waterfront luxury villa with direct lake panoramas",
      "Private boat cruise across mirror-smooth waters",
      "Romantic starlit campfire with roasted marshmallows",
      "Couple Ayurvedic relaxation therapy session",
      "Complimentary floral welcome drink & gift hamper"
    ],
    description: "Spend slow romantic mornings watching the mist rise over serene lake waters, followed by intimate candlelit dinners under the stars.",
    applicableResortCodes: ["AH-114", "AH-122"]
  },
  {
    id: "pkg-hm-3",
    title: "Among the Forests",
    category: "Honey Moon Package",
    tagline: "Authentic luxury treehouse nestled in primordial rainforest canopies",
    duration: "3 Days / 2 Nights",
    price: 29999,
    featured: true,
    image: "/brochure-assets/extracted_img_29.jpg",
    inclusions: [
      "Elevated luxury treehouse stay with panoramic foliage views",
      "Private naturalist-guided dawn forest trail",
      "Candlelight dinner on private treehouse wooden deck",
      "High-speed WiFi, en-suite modern amenities & heater"
    ],
    description: "Immerse yourselves in nature's purest embrace. Wake up to the songs of tropical birds and gentle mountain breezes in complete seclusion.",
    applicableResortCodes: ["AH-105", "AH-118"]
  },
  {
    id: "pkg-hm-4",
    title: "Serenity in the Estates",
    category: "Honey Moon Package",
    tagline: "Colonial plantation bungalow with private tea trails & fireplace",
    duration: "4 Days / 3 Nights",
    price: 32000,
    featured: false,
    image: "/brochure-assets/extracted_img_10.jpg",
    inclusions: [
      "Heritage plantation estate bungalow stay",
      "Private tea-tasting sessions with resident sommelier",
      "Chembra Heart-Shaped Lake romantic excursion",
      "Private chef candlelit dinners by the fireplace"
    ],
    description: "Surround yourselves with endless emerald tea slopes, cool breezes, and timeless colonial hospitality.",
    applicableResortCodes: ["AH-111", "AH-114"]
  },

  // 3. Destination Events
  {
    id: "pkg-de-1",
    title: "Wedding & Royal Celebrations",
    category: "Destination events",
    tagline: "Breathtaking 15-acre estate weddings overlooking Banasura mountain lake",
    duration: "3 Days / 2 Nights",
    price: 195000,
    featured: true,
    image: "/brochure-assets/extracted_img_7.jpg",
    inclusions: [
      "Complete buyout of entire villa property for up to 50 guests",
      "Open-air mandap setup overlooking mountain lake waters",
      "Traditional Kerala Panchavadyam & floral entrance decor",
      "Curated 24-item Royal Malabar Sadhya & barbecue gala",
      "Dedicated on-site event coordinator & staging setup"
    ],
    description: "Celebrate life’s milestones in breathtaking settings—where every destination becomes a stage for unforgettable moments.",
    applicableResortCodes: ["AH-121", "AH-123"]
  },
  {
    id: "pkg-de-2",
    title: "Corporate Event & Strategy Retreat",
    category: "Destination events",
    tagline: "Focused brainstorming in mountain solitude paired with outdoor obstacle turf",
    duration: "2 Days / 1 Night",
    price: 68000,
    featured: true,
    image: "/brochure-assets/extracted_img_13.jpg",
    inclusions: [
      "Multi-bedroom executive villa clusters with meeting hall",
      "High-speed fiber WiFi & 4K display conference equipment",
      "Team obstacle trail & off-road river crossing adventure",
      "Evening campfire with live acoustic music & barbecue skewers"
    ],
    description: "Re-energize your leadership team away from city chaos with productive strategy sessions and thrilling outdoor activities.",
    applicableResortCodes: ["AH-118", "AH-120"]
  },
  {
    id: "pkg-de-3",
    title: "Family Gathering & Milestone Celebrations",
    category: "Destination events",
    tagline: "Exclusive private lawns, children play turf & customized home-style dining",
    duration: "3 Days / 2 Nights",
    price: 48000,
    featured: false,
    image: "/brochure-assets/extracted_img_16.jpg",
    inclusions: [
      "Sprawling private villa accommodating multi-generation families",
      "Private swimming pool with dedicated toddler splash area",
      "Lawn games, badminton turf, and campfire area",
      "Dedicated in-house chef cooking customized family meals"
    ],
    description: "Unite grandparents, children, and cousins in a private paradise with endless laughter and zero disruptions.",
    applicableResortCodes: ["AH-114", "AH-124"]
  },

  // 4. Group Packages
  {
    id: "pkg-gp-1",
    title: "Luxury Package",
    category: "Group Packages",
    tagline: "Exclusive 4BHK/5BHK Private Pool Villa buyout with chef service",
    duration: "3 Days / 2 Nights",
    price: 38000,
    featured: true,
    image: "/brochure-assets/extracted_img_16.jpg",
    inclusions: [
      "Total privacy with entire luxury villa reserved exclusively for your group",
      "Private infinity pool with unhindered valley sunset view",
      "Nightly campfire with high-bass Bluetooth sound system",
      "Barbecue dinner arranged on the stargazing deck",
      "Dedicated villa caretaker available 24/7"
    ],
    description: "Travel isn’t just about places—it’s about people. Share laughter, stories, and adventures as you explore the world side by side.",
    applicableResortCodes: ["AH-116", "AH-121"]
  },
  {
    id: "pkg-gp-2",
    title: "Bachelor Friendly Safari & Camp",
    category: "Group Packages",
    tagline: "4x4 Open Jeep trail, bamboo river rafting & midnight campfire",
    duration: "3 Days / 2 Nights",
    price: 24000,
    featured: true,
    image: "/brochure-assets/extracted_img_14.jpg",
    inclusions: [
      "Group-friendly private villa with zero noise restrictions",
      "Deep forest 4x4 off-road jeep safari trail",
      "Kuruva Island river bamboo rafting tickets",
      "Barbecue grill setup with marinated skewers & campfire"
    ],
    description: "The ultimate squad trip for friends seeking rugged thrills by day and lively private pool parties by night.",
    applicableResortCodes: ["AH-118", "AH-126"]
  },
  {
    id: "pkg-gp-3",
    title: "Classic Package",
    category: "Group Packages",
    tagline: "Sightseeing, plantation trails & comfortable group cottages",
    duration: "3 Days / 2 Nights",
    price: 21500,
    featured: false,
    image: "/brochure-assets/extracted_img_6.jpg",
    inclusions: [
      "Spacious group cottage stay surrounded by tea foliage",
      "Guided plantation walk and viewpoint excursion",
      "Daily breakfast & authentic Kerala dinner",
      "Evening campfire with spiced tea and snacks"
    ],
    description: "A well-balanced, comfortable group holiday ideal for friend circles and corporate peers.",
    applicableResortCodes: ["AH-111", "AH-114"]
  },
  {
    id: "pkg-gp-4",
    title: "Value Package",
    category: "Group Packages",
    tagline: "Budget-friendly group stay with pool access & campfire",
    duration: "2 Days / 1 Night",
    price: 12999,
    featured: false,
    image: "/brochure-assets/extracted_img_18.jpg",
    inclusions: [
      "1 Night stay in spacious group villa",
      "Swimming pool access and lawn games",
      "Campfire setup with music system",
      "Traditional South Indian breakfast"
    ],
    description: "Maximum fun at an unbeatable per-person price without compromising cleanliness or privacy.",
    applicableResortCodes: ["AH-111", "AH-116"]
  }
];

export const initialBlogs: BlogPost[] = [
  {
    id: "blog-1",
    title: "Tourist Places Near by Sulthan Bathery",
    slug: "tourist-places-near-by-sulthan-bathery",
    category: "Destination Guide",
    excerpt: "Discover the prehistoric rock engravings of Edakkal Caves, the 14th-century Jain Temple, and the elephant herds of Muthanga Wildlife Sanctuary.",
    content: "Sulthan Bathery is the historic heart of Wayanad, named after Tipu Sultan who used the ancient Jain Temple as his battery (ammunition storehouse). Located at an elevation of 930 meters, it is bordered by the wildlife-rich forests of Muthanga. Visiting the Neolithic petroglyphs at Edakkal Caves just 10km away reveals engravings dating back to 6,000 BCE.",
    readTime: "4 min read",
    date: "April 25, 2026",
    image: "/brochure-assets/extracted_img_7.jpg",
    author: "Aston Holidays",
    featured: true
  },
  {
    id: "blog-2",
    title: "Tourist Places Near by Mananthavady",
    slug: "tourist-places-near-by-mananthavady",
    category: "Destination Guide",
    excerpt: "From the dense evergreen archipelago of Kuruva Island to the sacred waters of Papanasini at Thirunelli Temple and Pazhassi Raja's tomb.",
    content: "Mananthavady sits on the banks of the Kabini River and serves as the cultural gateway to Northern Wayanad. The 950-acre Kuruva Island with its bamboo rafts, rare orchids, and serene waterways is an absolute must-visit. Higher up into the Brahmagiri foothills lies Thirunelli Maha Vishnu Temple, revered for millennia as the 'Kashi of the South'.",
    readTime: "5 min read",
    date: "April 25, 2026",
    image: "/brochure-assets/extracted_img_29.jpg",
    author: "Aston Holidays",
    featured: true
  },
  {
    id: "blog-3",
    title: "Tourist Places Near by Kalpetta",
    slug: "tourist-places-near-by-kalpetta",
    category: "Destination Guide",
    excerpt: "Explore the bustling headquarters of Wayanad surrounded by verdant coffee hills, Karapuzha Dam, and the ancient Koottamundu Glass Temple.",
    content: "Kalpetta is the administrative and commercial epicenter of Wayanad. Located conveniently in the center of the district, it gives you quick access to Karapuzha earthen dam, sprawling spice markets, and aromatic coffee processing estates. The Glass Temple dedicated to the Jain Tirthankara Parshvanatha on the slopes of Vellarimala is a hidden architectural marvel.",
    readTime: "4 min read",
    date: "April 25, 2026",
    image: "/brochure-assets/extracted_img_2.jpg",
    author: "Aston Holidays",
    featured: true
  },
  {
    id: "blog-4",
    title: "Best 5 Cafes in Mananthavady",
    slug: "best-5-cafes-in-mananthavady",
    category: "Food & Cafes",
    excerpt: "Looking for freshly brewed artisan Wayanadan coffee, wood-fired snacks, and cozy rain-view seats in Mananthavady? Here are the top 5 spots.",
    content: "Mananthavady's cafe culture has blossomed with vibrant spots catering to travelers heading towards Kuruva and Thirunelli. Experience single-origin Robusta roasts, layered Malabar snacks, iced cardamom espressos, and scenic plantation verandas.",
    readTime: "3 min read",
    date: "April 25, 2026",
    image: "/brochure-assets/extracted_img_16.jpg",
    author: "Aston Holidays",
    featured: false
  },
  {
    id: "blog-5",
    title: "Best 5 Cafes in Kalpetta",
    slug: "best-5-cafes-in-kalpetta",
    category: "Food & Cafes",
    excerpt: "Where to find the best specialty brews, artisanal Malabar tea blends, and delicious pastries after a long day of Wayanad sightseeing.",
    content: "Kalpetta boasts some of the most charming cafes in the Western Ghats. From roasteries serving fresh estate harvests to cozy mountain lounges with high-speed WiFi, explore the 5 best cafe haunts in Kalpetta town.",
    readTime: "3 min read",
    date: "April 25, 2026",
    image: "/brochure-assets/extracted_img_13.jpg",
    author: "Aston Holidays",
    featured: false
  }
];

export const initialReviews: ClientReview[] = [
  {
    id: "rev-1",
    name: "Dr. Ananya & Siddharth",
    location: "Bangalore",
    rating: 5,
    packageTaken: "Honey Moon Package • Love Nest in the Heights",
    review: "Our honeymoon stay in Wayanad with Aston Holidays was absolute perfection! The candlelight dinner arranged right next to our heated pool with misty valley views will stay with us forever. The 12-page WhatsApp brochure made selection seamless.",
    date: "October 2026",
    avatar: "AS"
  },
  {
    id: "rev-2",
    name: "Vikramaditya Rao & Family",
    location: "Hyderabad",
    rating: 5,
    packageTaken: "Group Packages • Grand Family Reunion",
    review: "We reserved the 4BHK private villa for our family gathering of 14 people. Cleanliness was 10/10, the food was delicious, and having the full villa and pool exclusively to ourselves was priceless. Aston Holidays handled every detail flawlessly.",
    date: "September 2026",
    avatar: "VR"
  },
  {
    id: "rev-3",
    name: "Deepak Kurup & Team",
    location: "Dubai",
    rating: 5,
    packageTaken: "Group Packages • Bachelor Friendly Safari",
    review: "Aston Holidays organized our college reunion. The 4x4 off-road jeep safari and the acoustic campfire setup with music was unforgettable. Highly recommend their group packages!",
    date: "September 2026",
    avatar: "DK"
  },
  {
    id: "rev-4",
    name: "Meera Nambiar",
    location: "Kochi",
    rating: 5,
    packageTaken: "Best Holiday Package • Trinity of Sanctuaries",
    review: "The standard PDF brochure sent directly on WhatsApp made it so easy to compare options with transparent rates. Everything was 100% verified with zero hidden fees. Aston Holidays is our go-to for Wayanad!",
    date: "August 2026",
    avatar: "MN"
  }
];

export const whisperingTownsData = [
  {
    name: "Sulthan Bathery",
    tripsCount: 17,
    tagline: "Historic Forts & Neolithic Caves",
    description: "Quiet enclaves of Wayanad, where nature’s rhythm meets ancestral tales, creating unforgettable holiday experiences steeped in heritage and serenity.",
    keyAttractions: ["Edakkal Prehistoric Caves", "Wayanad Heritage Museum", "Jain Temple", "Muthanga Wildlife Sanctuary"],
    distanceFromCalicut: "98 km",
    icon: "🪨"
  },
  {
    name: "Pulpally",
    tripsCount: 17,
    tagline: "Mythological Foothills & Ancient Shrines",
    description: "A tranquil border town rich in agrarian spice plantations, serene forest trails, and ancient folklore.",
    keyAttractions: ["Sita Devi Temple", "Kuruva Island Access", "Pulpally Forest Trails", "Kabini River Banks"],
    distanceFromCalicut: "94 km",
    icon: "🌾"
  },
  {
    name: "Ambalavayal",
    tripsCount: 17,
    tagline: "Prehistoric Foothills & Agricultural Gardens",
    description: "Nestled right below the Ambukuthi Hills, home to the regional agricultural research center and flower nurseries.",
    keyAttractions: ["Ambukuthi Hills", "Agricultural Research Garden", "Wayanad Heritage Museum", "Phantom Rock"],
    distanceFromCalicut: "88 km",
    icon: "🌸"
  },
  {
    name: "Meppadi",
    tripsCount: 16,
    tagline: "Rolling Tea Slopes & The Heart Lake",
    description: "Endless rolling emerald tea plantations leading to Chembra Peak and the cascading thunder of Soochipara Waterfalls.",
    keyAttractions: ["Chembra Peak Heart Lake", "Soochipara Waterfalls", "Kanthanpara Falls", "900 Kandi Glass Bridge"],
    distanceFromCalicut: "76 km",
    icon: "⛰️"
  },
  {
    name: "Vythiri",
    tripsCount: 16,
    tagline: "The Misty Gateway & Rainforest Canopy",
    description: "Dense evergreen rainforests with year-round cool mountain mist, suspension bridges, and famous hill viewpoints.",
    keyAttractions: ["Lakkidi View Point", "Pookode Lake", "En Ooru Tribal Village", "Chain Tree"],
    distanceFromCalicut: "65 km",
    icon: "🌫️"
  },
  {
    name: "Mananthavady",
    tripsCount: 17,
    tagline: "Bamboo Rafting & Spiritual Foothills",
    description: "A cultural and natural sanctuary famous for the evergreen Kuruva Island archipelago and the ancient Thirunelli Temple.",
    keyAttractions: ["Kuruva Evergreen Island", "Thirunelli Maha Vishnu Temple", "Pazhassi Raja Tomb", "Brahmagiri Wildlife"],
    distanceFromCalicut: "95 km",
    icon: "🎋"
  },
  {
    name: "Kalpetta",
    tripsCount: 10,
    tagline: "Vibrant Foothills & Artisan Coffee Roasts",
    description: "The bustling heart of Wayanad surrounded by fragrant coffee estates, spice emporiums, and panoramic hill perches.",
    keyAttractions: ["Karapuzha Dam", "Koottamundu Glass Temple", "Wayanad Spice Markets", "Coffee Plantation Trails"],
    distanceFromCalicut: "72 km",
    icon: "☕"
  }
];
