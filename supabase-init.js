// supabase-init.js — METTEZ À JOUR CES LIGNES


// ✅ NOUVELLES (à mettre)
const SUPABASE_URL = "https://kdgxbmqwhpuctjtlygrt.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkZ3hibXF3aHB1Y3RqdGx5Z3J0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMjY0NzQsImV4cCI6MjA5MDgwMjQ3NH0.9RsIj_bQgJskg9raRGN6uQJwUUlByTvWAFF2Eq9f6KM";



// Gardez le reste identique
try {
  window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  console.log("supabaseClient initialisé", window.supabaseClient);
} catch (err) {
  console.error("Erreur initialisation supabaseClient", err);
}
