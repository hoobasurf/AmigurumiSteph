// 1️⃣ Connexion Supabase
const SUPABASE_URL = "https://iubbxvipgofxasatmvzg.supabase.co";
const SUPABASE_KEY = "sb_secret_pZQyjv-VVblqYWji7tKSTQ_9lr7E4MD"; // clé anon public
const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 2️⃣ Champs HTML
const nameInput = document.getElementById('name');
const photoInput = document.getElementById('photo');
const addBtn = document.getElementById('add');
const list = document.getElementById('owner-list');

// 3️⃣ Upload + preview
async function uploadToSupabase(name, file) {
  const filePath = `${Date.now()}_${name}.jpg`;

  const { data, error } = await client
    .storage
    .from("creations")
    .upload(filePath, file, { contentType: file.type, upsert: false });

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

  const { publicUrl } = client.storage.from("creations").getPublicUrl(filePath);
  return publicUrl;
}

// 4️⃣ Bouton Ajouter
addBtn.onclick = async () => {
  const name = nameInput.value.trim();
  const file = photoInput.files[0];

  if (!name || !file) { alert("Merci de remplir le nom et choisir une photo !"); return; }

  // Upload Supabase
  const publicUrl = await uploadToSupabase(name, file);
  if (!publicUrl) return;

  // Preview immédiate
  const div = document.createElement('div');
  div.className = 'owner-item';
  div.innerHTML = `<p>${name}</p><img src="${publicUrl}">`;
  list.prepend(div);

  // Reset
  nameInput.value = '';
  photoInput.value = '';
};
