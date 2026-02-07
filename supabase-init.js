// supabase-init.js — METTEZ À JOUR CES LIGNES

// ❌ ANCIENNES (à supprimer)
const SUPABASE_URL = "https://iubbxvipgofxasatmvzg.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_GDoZmwIdoP28XOdrfYYVNw_E_HiCQB1";

// ✅ NOUVELLES (à mettre)
const SUPABASE_URL = "https://jyhbamdcxmpveujjqjla.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5aGJhbWRjeG1wdmV1ampxamxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMjYzOTMsImV4cCI6MjA4MjYwMjM5M30.PIOMZxprCdkFwFj_sUC0ZDNSIP5OcGmxkvYN7D3JmGY";

// Gardez le reste identique
try {
  window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  console.log("supabaseClient initialisé", window.supabaseClient);
} catch (err) {
  console.error("Erreur initialisation supabaseClient", err);
}
