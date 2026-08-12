import { z } from "zod";

export const intakeSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  projectScope: z.string().min(1, "Project scope is required"),
  crmSetup: z.enum(["GHL", "HubSpot or Salesforce", "Other CRM", "No CRM yet"]),
  primaryBottleneck: z.enum(["AI Lead Nurturing", "Automated Data Extraction", "Custom Automation Triggers", "Complete Pipeline Setup"]),
  currentTools: z.array(z.string()).default([]),
  manualTaskDescription: z.string().optional().default(""),
  fullName: z.string().min(1, "Full name is required"),
  workEmail: z.string().email("Valid work email required"),
  hasAdminCredentialsReady: z.boolean().default(false),
});

export type IntakeFormData = z.infer<typeof intakeSchema>;
