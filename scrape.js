const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://astonholidays.com/wp-json';
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'application/json, text/plain, */*'
};

const outputDir = path.join(__dirname, 'scraped_data');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function fetchAndSave(endpoint, filename) {
  try {
    const url = `${BASE_URL}${endpoint}`;
    console.log(`Fetching: ${url}`);
    const res = await fetch(url, { headers: HEADERS });
    if (!res.ok) {
      console.warn(`[${res.status}] Failed to fetch ${url}`);
      return null;
    }
    const data = await res.json();
    fs.writeFileSync(path.join(outputDir, filename), JSON.stringify(data, null, 2), 'utf8');
    const count = Array.isArray(data) ? data.length : (data.data ? data.data.length : 'object');
    console.log(`Saved ${filename} (Items: ${count})`);
    return data;
  } catch (err) {
    console.error(`Error fetching ${endpoint}:`, err.message);
    return null;
  }
}

async function run() {
  console.log('--- Starting Aston Holidays Scrape ---');
  await fetchAndSave('/wp/v2/pages?per_page=100', 'pages.json');
  await fetchAndSave('/wp/v2/posts?per_page=100', 'posts.json');
  await fetchAndSave('/wp/v2/trip?per_page=100', 'trips_wp.json');
  await fetchAndSave('/wptravelengine/v2/trips?per_page=100', 'trips_v2.json');
  await fetchAndSave('/wp/v2/destination?per_page=100', 'destinations.json');
  await fetchAndSave('/wp/v2/activities?per_page=100', 'activities.json');
  await fetchAndSave('/wp/v2/trip_types?per_page=100', 'trip_types.json');
  await fetchAndSave('/wp/v2/media?per_page=100', 'media.json');

  // Also scrape the raw HTML of homepage, contact, about, trips
  const htmlPages = [
    { url: 'https://astonholidays.com/', name: 'homepage.html' },
    { url: 'https://astonholidays.com/destinations/', name: 'destinations.html' },
    { url: 'https://astonholidays.com/trips/', name: 'trips.html' },
    { url: 'https://astonholidays.com/contact-us/', name: 'contact-us.html' },
    { url: 'https://astonholidays.com/about-us/', name: 'about-us.html' }
  ];

  for (const page of htmlPages) {
    try {
      console.log(`Fetching HTML: ${page.url}`);
      const res = await fetch(page.url, { headers: HEADERS });
      if (res.ok) {
        const text = await res.text();
        fs.writeFileSync(path.join(outputDir, page.name), text, 'utf8');
        console.log(`Saved ${page.name} (${text.length} bytes)`);
      }
    } catch (e) {
      console.warn(`Could not fetch HTML for ${page.url}: ${e.message}`);
    }
  }

  console.log('--- Scraping Complete ---');
}

run();
