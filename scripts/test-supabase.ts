import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://lqimlancvbluqrxlxoem.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxaW1sYW5jdmJsdXFyeGx4b2VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyMzYwNDEsImV4cCI6MjEwNzgxMjA0MX0.tw2M1g8_HQ3x9zy9BIuURBoKutt9TRW7Lqps7g1gVUs";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  console.log("Checking Supabase connection...");
  const { data, error } = await supabase.from("resorts").select("*").limit(1);
  if (error) {
    console.log("Error querying resorts table:", error.message, error.code, error.details);
  } else {
    console.log("Success! Data:", data);
  }
}

main();
