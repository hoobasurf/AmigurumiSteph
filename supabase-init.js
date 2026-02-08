// supabase-init.js — METTEZ À JOUR CES LIGNES


// ✅ NOUVELLES (à mettre)
const SUPABASE_URL = "https://lgduavepbznnzjfxlsnx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnZHVhdmVwYnpubnpqZnhsc254Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0NzgyODcsImV4cCI6MjA4NjA1NDI4N30.6yAmtLvG0t7ne3sV2DXMbsCfcK8JVAi5NujZsQUJ_Tk";



// Gardez le reste identique
try {
  window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  console.log("supabaseClient initialisé", window.supabaseClient);
} catch (err) {
  console.error("Erreur initialisation supabaseClient", err);
}
