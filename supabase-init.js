// supabase-init.js — non module, sets global window.supabaseClient

// Replace with your project URL and publishable key
const SUPABASE_URL = "https://iubbxvipgofxasatmvzg.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_GDoZmwIdoP28XOdrfYYVNw_E_HiCQB1";

// create client using the global `supabase` from the UMD bundle
try {
  window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  console.log("supabaseClient initialisé", window.supabaseClient);
} catch (err) {
  console.error("Erreur initialisation supabaseClient", err);
}
