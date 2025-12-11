// =======================
// 1. Connexion Supabase
// =======================
const SUPABASE_URL = "https://iubbxvipgofxasatmvzg.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJra3hkc2p2anR4aWpvYWFyb3pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5MDQ3NDYsImV4cCI6MjA1NDQ4MDc0Nn0.bgPgL82VCPKsJBfqt-F8AdmcuxIV3qsPp3KFUvkgwzg";

const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

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

  const { data, error } = await client
    .storage
    .from("creations")
    .upload(filePath, file, {
      contentType: file.type,
      upsert: false
    });

  // SI ERREUR
  if (error) {
    const msg = "❌ Erreur upload Supabase : " + JSON.stringify(error, null, 2);
    alert(msg);

    const errorBox = document.createElement("div");
    errorBox.style.background = "#ffdddd";
    errorBox.style.border = "1px solid red";
    errorBox.style.color = "black";
    errorBox.style.padding = "10px";
    errorBox.style.margin = "10px 0";
    errorBox.innerText = msg;
    document.body.appendChild(errorBox);

    return null;
  }

  // SI OK
  const { publicUrl } = client
    .storage
    .from("creations")
    .getPublicUrl(filePath);

  return publicUrl;
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

  // 1️⃣ Upload vers Supabase
  const publicUrl = await uploadToSupabase(name, file);

  if (!publicUrl) {
    return; // erreur déjà affichée
  }

  // 2️⃣ AFFICHAGE immédiat dans la liste
  const div = document.createElement('div');
  div.className = 'owner-item';
  div.innerHTML = `
    <p>${name}</p>
    <img src="${publicUrl}">
  `;
  list.prepend(div);

  // 3️⃣ Reset champs
  nameInput.value = '';
  photoInput.value = '';
};
