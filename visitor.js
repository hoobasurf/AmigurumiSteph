// --- CONFIG SUPABASE ---
const SUPABASE_URL = "https://iubbxvipgofxasatmvzg.supabase.co";
const SUPABASE_KEY = "sb_secret_pZQyjv-VVblqYWji7tKSTQ_9lr7E4MD"; // clé anon public
const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- DOM ---
const gallery = document.getElementById("gallery");

// --- CHARGEMENT DES IMAGES ---
async function loadGallery() {
  console.log("Chargement des images…");

  // Liste le bucket "creations" (le même que owner)
  const { data, error } = await client
    .storage
    .from("creations")
    .list("", { limit: 100 });

  if (error) {
    console.error("Erreur LIST : " + error.message);
    return;
  }

  console.log("Fichiers trouvés : " + data.length);

  data.forEach((file) => {
    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/creations/${file.name}`;

    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <img src="${publicUrl}" alt="">
      <p>${file.name}</p>
    `;
    gallery.appendChild(div);
  });

  console.log("Affichage terminé.");
}

// --- LANCEMENT ---
loadGallery();
