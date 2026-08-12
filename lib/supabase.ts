import { createClient } from "@supabase/supabase-js";

export interface ClientRow {
  id: string;
  company_name: string;
  project_scope: string;
  status: string;
  created_at: string;
  crm_setup: "GHL" | "HubSpot or Salesforce" | "Other CRM" | "No CRM yet";
  primary_bottleneck: "AI Lead Nurturing" | "Automated Data Extraction" | "Custom Automation Triggers" | "Complete Pipeline Setup";
  current_tools: string[];
  manual_task_description: string | null;
  full_name: string;
  work_email: string;
  has_admin_credentials_ready: boolean;
  file_urls?: string[];
}

let _client: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error("Supabase env vars not configured");
    _client = createClient(url, key);
  }
  return _client;
}
