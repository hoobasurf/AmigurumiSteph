import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// --- CONFIG SUPABASE ---
const SUPABASE_URL = "https://iubbxvipgofxasatmvzg.supabase.co";
const SUPABASE_KEY = "sb_secret_pZQyjv-VVblqYWji7tKSTQ_9lr7E4MD";
const client = createClient(SUPABASE_URL, SUPABASE_KEY);

const gallery = document.getElementById("gallery");

// --- LOAD GALLERY ---
async function loadGallery() {
  console.log("Chargement des images…");

  const { data, error } = await client.storage.from("creations").list("", { limit: 100 });
  if (error) { console.error(error.message); return; }

  console.log("Fichiers trouvés :", data.length);

  data.forEach(file => {
    const url = `${SUPABASE_URL}/storage/v1/object/public/creations/${file.name}`;
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `<img src="${url}" alt=""><p>${file.name}</p>`;
    gallery.appendChild(div);
  });

  console.log("Affichage terminé.");
}

// --- LANCEMENT ---
loadGallery();
