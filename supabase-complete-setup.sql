-- ============================================================
-- Complete Supabase Setup — idempotent (safe to re-run)
-- ============================================================

-- 1. Enum types
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'crm_setup_type' AND n.nspname = 'public'
  ) THEN
    CREATE TYPE public.crm_setup_type AS ENUM (
      'GHL', 'HubSpot or Salesforce', 'Other CRM', 'No CRM yet'
    );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'primary_bottleneck_type' AND n.nspname = 'public'
  ) THEN
    CREATE TYPE public.primary_bottleneck_type AS ENUM (
      'AI Lead Nurturing', 'Automated Data Extraction',
      'Custom Automation Triggers', 'Complete Pipeline Setup'
    );
  END IF;
END $$;

-- 2. Clients table
CREATE TABLE IF NOT EXISTS public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  project_scope text NOT NULL,
  status text DEFAULT 'PENDING',
  created_at timestamp with time zone DEFAULT now(),
  crm_setup public.crm_setup_type NOT NULL,
  primary_bottleneck public.primary_bottleneck_type NOT NULL,
  current_tools text[] DEFAULT '{}',
  manual_task_description text,
  full_name text NOT NULL,
  work_email text NOT NULL,
  has_admin_credentials_ready boolean DEFAULT false NOT NULL,
  file_urls text[] DEFAULT '{}'
);

-- 3. Enable RLS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies (drop first so re-run is safe)
DROP POLICY IF EXISTS "allow_public_insert" ON public.clients;
DROP POLICY IF EXISTS "allow_public_read" ON public.clients;

CREATE POLICY "allow_public_insert"
  ON public.clients FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "allow_public_read"
  ON public.clients FOR SELECT
  TO anon, authenticated
  USING (true);
