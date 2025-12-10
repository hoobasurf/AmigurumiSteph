// --- CONFIG SUPABASE ---
const SUPABASE_URL = "https://iubbxvipgofxasatmvzg.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1YmJ4dmlwZ29meGFzYXRtdnpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyODg1NzgsImV4cCI6MjA4MDg2NDU3OH0.cg6AbfQ-av-nyEtAdWetdRjHSKaYJUw2QY2kgCFgkVs";

const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// DOM
const gallery = document.getElementById("gallery");

// --- FONCTION DE CHARGEMENT ---
async function loadGallery() {
  log("Chargement des images…");

  const { data, error } = await client.storage
    .from("photos")
    .list("", { limit: 100 });

  if (error) {
    log("Erreur LIST : " + error.message);
    return;
  }

  log("Fichiers trouvés : " + data.length);

  data.forEach((file) => {
    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/photos/${file.name}`;

    const div = document.createElement("div");
    div.className = "item";

    div.innerHTML = `
      <img src="${publicUrl}">
      <p>${file.name}</p>
    `;

    gallery.appendChild(div);
  });

  log("Affichage terminé.");
}

// --- LANCEMENT ---
loadGallery();
