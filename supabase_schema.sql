-- ================================================================
-- ASTON HOLIDAYS DATABASE SCHEMA (SUPABASE POSTGRESQL)
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/lqimlancvbluqrxlxoem/sql/new
-- ================================================================

-- 1. Resorts Table
CREATE TABLE IF NOT EXISTS public.resorts (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  destination TEXT NOT NULL,
  location_details TEXT,
  google_maps_url TEXT,
  accommodation_type TEXT NOT NULL,
  stay_preference TEXT NOT NULL,
  ambience JSONB DEFAULT '[]'::jsonb,
  category TEXT,
  bedrooms INTEGER DEFAULT 1,
  bathrooms INTEGER DEFAULT 1,
  max_adults INTEGER DEFAULT 2,
  max_children INTEGER DEFAULT 0,
  max_guests INTEGER DEFAULT 2,
  price_per_night NUMERIC NOT NULL,
  b2b_rate NUMERIC,
  featured BOOLEAN DEFAULT false,
  cover_image TEXT,
  photos JSONB DEFAULT '[]'::jsonb,
  amenities JSONB DEFAULT '[]'::jsonb,
  specialities JSONB DEFAULT '[]'::jsonb,
  nearby_attractions JSONB DEFAULT '[]'::jsonb,
  check_in_time TEXT DEFAULT '01:00 PM',
  check_out_time TEXT DEFAULT '11:00 AM',
  overview TEXT,
  inclusions JSONB DEFAULT '[]'::jsonb,
  exclusions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Leads Table (WhatsApp inquiries & Website CRM)
CREATE TABLE IF NOT EXISTS public.leads (
  id TEXT PRIMARY KEY,
  lead_number TEXT NOT NULL,
  customer_name TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  source TEXT DEFAULT 'WhatsApp',
  destination TEXT,
  accommodation_type TEXT,
  stay_preference TEXT,
  ambience TEXT,
  check_in TEXT,
  check_out TEXT,
  rooms_count INTEGER,
  adults_count INTEGER,
  children_count INTEGER,
  guests_count INTEGER,
  budget NUMERIC,
  status TEXT DEFAULT 'New',
  requested_resort_code TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Invoices & Stay Vouchers Table
CREATE TABLE IF NOT EXISTS public.invoices (
  id TEXT PRIMARY KEY,
  invoice_number TEXT UNIQUE NOT NULL,
  type TEXT DEFAULT 'Tax Invoice',
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  customer_address TEXT,
  resort_code TEXT NOT NULL,
  resort_name TEXT NOT NULL,
  destination TEXT NOT NULL,
  check_in TEXT NOT NULL,
  check_out TEXT NOT NULL,
  nights INTEGER DEFAULT 1,
  guests JSONB DEFAULT '{"adults": 2, "children": 0}'::jsonb,
  items JSONB DEFAULT '[]'::jsonb,
  subtotal NUMERIC DEFAULT 0,
  gst_rate NUMERIC DEFAULT 12,
  gst_amount NUMERIC DEFAULT 0,
  discount NUMERIC DEFAULT 0,
  total_amount NUMERIC DEFAULT 0,
  advance_paid NUMERIC DEFAULT 0,
  balance_due NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'Draft',
  issue_date TEXT,
  due_date TEXT,
  bank_details JSONB,
  notes TEXT,
  whatsapp_voucher_sent BOOLEAN DEFAULT false,
  whatsapp_voucher_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Site Settings & Visual Customizer
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'global',
  hero_title TEXT,
  hero_subtitle TEXT,
  hero_banner_image TEXT,
  announcement_text TEXT,
  heritage_story_title TEXT,
  heritage_story_text TEXT,
  heritage_image TEXT,
  company_name TEXT,
  office_address TEXT,
  phone TEXT,
  email TEXT,
  whatsapp_number TEXT,
  whatsapp_webhook_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Developer & Integration Settings
CREATE TABLE IF NOT EXISTS public.integration_config (
  id TEXT PRIMARY KEY DEFAULT 'global',
  whatsapp_app_base_url TEXT,
  whatsapp_webhook_path TEXT,
  outbound_api_key TEXT,
  outbound_secret TEXT,
  inbound_api_key TEXT,
  inbound_secret TEXT,
  security_mode TEXT DEFAULT 'strict',
  rate_limit_per_minute INTEGER DEFAULT 120,
  allowed_ips JSONB DEFAULT '[]'::jsonb,
  bot_welcome_header TEXT,
  bot_call_to_action TEXT,
  default_min_price NUMERIC DEFAULT 2000,
  default_max_price NUMERIC DEFAULT 50000,
  last_diagnostic_ping_at TIMESTAMPTZ,
  last_diagnostic_latency_ms INTEGER,
  last_outbound_sync_at TIMESTAMPTZ,
  last_outbound_status TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Cyber Threat & API Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id TEXT PRIMARY KEY,
  timestamp TIMESTAMPTZ DEFAULT now(),
  type TEXT NOT NULL,
  method TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  client_ip TEXT,
  status_code INTEGER NOT NULL,
  duration_ms INTEGER NOT NULL,
  status TEXT NOT NULL,
  summary TEXT,
  payload_summary TEXT
);

-- ================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Allow anonymous read & write for the Aston application
-- ================================================================
ALTER TABLE public.resorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create open access policies for the Aston backend
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for anon resorts') THEN
    CREATE POLICY "Allow all for anon resorts" ON public.resorts FOR ALL TO anon USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for anon leads') THEN
    CREATE POLICY "Allow all for anon leads" ON public.leads FOR ALL TO anon USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for anon invoices') THEN
    CREATE POLICY "Allow all for anon invoices" ON public.invoices FOR ALL TO anon USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for anon site_settings') THEN
    CREATE POLICY "Allow all for anon site_settings" ON public.site_settings FOR ALL TO anon USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for anon integration_config') THEN
    CREATE POLICY "Allow all for anon integration_config" ON public.integration_config FOR ALL TO anon USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for anon audit_logs') THEN
    CREATE POLICY "Allow all for anon audit_logs" ON public.audit_logs FOR ALL TO anon USING (true) WITH CHECK (true);
  END IF;
END $$;
