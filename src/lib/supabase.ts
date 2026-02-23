/**
 * Supabase Client Configuration
 * Shared utility for database access across the BuildRightPros site
 */

import { createClient } from '@supabase/supabase-js';

// Environment variables (set in .env file)
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check .env file.');
}

// Create Supabase client (singleton)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // We're not using auth for public forms
  },
});

/**
 * Database Types
 * Auto-generated from Supabase schema
 */
export interface Lead {
  id?: string;
  name: string;
  email?: string;
  phone: string;
  business_name?: string;
  business_type?: string;
  source?: string;
  landing_page?: string;
  utm_source?: string;
  utm_campaign?: string;
  calc_monthly_revenue?: number;
  calc_weekly_calls?: number;
  calc_avg_ticket?: number;
  calc_close_rate?: number;
  calc_who_answers?: string;
  calc_lost_revenue?: number;
  status?: string;
  priority?: string;
  payment_status?: string;
  stripe_customer_id?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CallLog {
  id?: string;
  lead_id?: string;
  caller_phone: string;
  direction?: string;
  duration_seconds?: number;
  call_status?: string;
  transcript?: string;
  recording_url?: string;
  ai_summary?: string;
  lead_qualified?: boolean;
  appointment_booked?: boolean;
  created_at?: string;
}

export interface SMSLog {
  id?: string;
  lead_id?: string;
  phone_number: string;
  direction?: string;
  message: string;
  status?: string;
  campaign?: string;
  created_at?: string;
}

export interface Appointment {
  id?: string;
  lead_id?: string;
  appointment_type?: string;
  scheduled_at: string;
  duration_minutes?: number;
  status?: string;
  meeting_url?: string;
  calendar_event_id?: string;
  notes?: string;
  outcome?: string;
  created_at?: string;
  completed_at?: string;
}

/**
 * Helper Functions
 */

/**
 * Create a new lead in the database
 */
export async function createLead(lead: Lead) {
  const { data, error } = await supabase
    .from('leads')
    .insert([lead])
    .select()
    .single();

  if (error) {
    console.error('Error creating lead:', error);
    throw error;
  }

  return data;
}

/**
 * Update lead status
 */
export async function updateLeadStatus(leadId: string, status: string) {
  const { data, error } = await supabase
    .from('leads')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', leadId)
    .select()
    .single();

  if (error) {
    console.error('Error updating lead status:', error);
    throw error;
  }

  return data;
}

/**
 * Find lead by phone number
 */
export async function findLeadByPhone(phone: string) {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('phone', phone)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = no rows returned (not an error)
    console.error('Error finding lead:', error);
    throw error;
  }

  return data;
}

/**
 * Log a call event
 */
export async function logCall(callLog: CallLog) {
  const { data, error } = await supabase
    .from('call_logs')
    .insert([callLog])
    .select()
    .single();

  if (error) {
    console.error('Error logging call:', error);
    throw error;
  }

  return data;
}

/**
 * Log an SMS event
 */
export async function logSMS(smsLog: SMSLog) {
  const { data, error } = await supabase
    .from('sms_logs')
    .insert([smsLog])
    .select()
    .single();

  if (error) {
    console.error('Error logging SMS:', error);
    throw error;
  }

  return data;
}

/**
 * Get recent leads (for dashboard)
 */
export async function getRecentLeads(limit: number = 10) {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching leads:', error);
    throw error;
  }

  return data;
}

/**
 * Get leads summary (for dashboard)
 */
export async function getLeadsSummary() {
  const { data, error } = await supabase
    .from('leads_summary')
    .select('*');

  if (error) {
    console.error('Error fetching leads summary:', error);
    throw error;
  }

  return data;
}
