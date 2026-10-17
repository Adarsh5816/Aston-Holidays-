import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "https://lqimlancvbluqrxlxoem.supabase.co";

const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxaW1sYW5jdmJsdXFyeGx4b2VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyMzYwNDEsImV4cCI6MjEwNzgxMjA0MX0.tw2M1g8_HQ3x9zy9BIuURBoKutt9TRW7Lqps7g1gVUs";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_KEY);
}
