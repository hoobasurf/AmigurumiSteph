// =======================
// 1. Connexion Supabase
// =======================
const SUPABASE_URL = "https://iubbxvipgofxasatmvzg.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJra3hkc2p2anR4aWpvYWFyb3pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5MDQ3NDYsImV4cCI6MjA1NDQ4MDc0Nn0.bgPgL82VCPKsJBfqt-F8AdmcuxIV3qsPp3KFUvkgwzg";

// ⚠️ CORRECTION ICI
const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// =======================
// 2. Champs HTML
// =======================
const nameInput = document.getElementById('name');
const photoInput = document.getElementById('photo');
const addBtn = document.getElementById('add');
const list = document.getElementById('owner-list');

// =======================
// 3. Upload vers Supabase
// =======================
async function uploadToSupabase(name, file) {
  const filePath = `${Date.now()}_${name}.jpg`;

  console.log("📤 Upload vers Supabase :", filePath);

  const { data, error } = await client   // ⚠️ CORRECTION
    .storage
    .from("creations")
    .upload(filePath, file, {
      contentType: file.type,
      upsert: false
    });

  if (error) {
    console.error("❌ Erreur upload Supabase :", error.message);
    return null;
  }

  console.log("✅ Upload réussi :", data);

  const url = `${SUPABASE_URL}/storage/v1/object/public/creations/${filePath}`;
  return url;
}

// =======================
// 4. Quand on clique "Ajouter"
// =======================
addBtn.onclick = async () => {
  const name = nameInput.value.trim();
  const file = photoInput.files[0];

  if (!name || !file) {
    alert("Merci de remplir le nom et choisir une photo !");
    return;
  }

  console.log("Nom :", name);
  console.log("Fichier sélectionné :", file);

  // 4.1 Upload dans Supabase
  const publicUrl = await uploadToSupabase(name, file);

  if (!publicUrl) {
    alert("Erreur upload Supabase");
    return;
  }

  // 4.2 Prévisualisation immédiate
  const div = document.createElement('div');
  div.className = 'owner-item';
  div.innerHTML = `
    <p>${name}</p>
    <img src="${publicUrl}">
  `;
  list.prepend(div);

  // 4.3 Sauvegarde pour visitor
  const saved = JSON.parse(localStorage.getItem("creations") || "[]");
  saved.unshift({ name, imgUrl: publicUrl });
  localStorage.setItem("creations", JSON.stringify(saved));

  nameInput.value = '';
  photoInput.value = '';
};
