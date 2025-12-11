// 1️⃣ Récupération des éléments HTML
const nameInput = document.getElementById('name');
const photoInput = document.getElementById('photo');
const addBtn = document.getElementById('add');
const list = document.getElementById('owner-list');

// 2️⃣ Connexion Supabase
const SUPABASE_URL = "https://iubbxvipgofxasatmvzg.supabase.co";
const SUPABASE_KEY = "sb_secret_pZQyjv-VVblqYWji7tKSTQ_9lr7E4MD"; // clé anon public
const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 3️⃣ Fonction upload vers Supabase
async function uploadToSupabase(name, file) {
  const filePath = `${Date.now()}_${name}.jpg`;

  const { data, error } = await client
    .storage
    .from("creations")
    .upload(filePath, file, {
      contentType: file.type,
      upsert: false
    });

  if (error) {
    console.warn("⚠️ Erreur upload Supabase :", error);
    return null;
  }

  const { publicUrl } = client.storage.from("creations").getPublicUrl(filePath);
  return publicUrl;
}

// 4️⃣ Bouton Ajouter
addBtn.onclick = () => {
  const name = nameInput.value.trim();
  const file = photoInput.files[0];

  if (!name || !file) {
    alert("Merci de remplir le nom et choisir une photo !");
    return;
  }

  console.log("Nom :", name);
  console.log("Fichier sélectionné :", file);

  const reader = new FileReader();
  reader.onload = async (e) => {
    const imgUrl = e.target.result;

    // 4.1 Preview immédiate
    const div = document.createElement('div');
    div.className = 'owner-item';
    div.innerHTML = `<p>${name}</p><img src="${imgUrl}">`;
    list.prepend(div);

    // 4.2 Upload vers Supabase (async mais pas bloquant pour la preview)
    const publicUrl = await uploadToSupabase(name, file);
    if (publicUrl) {
      console.log("✅ Upload Supabase réussi :", publicUrl);
    } else {
      console.warn("⚠️ Upload Supabase échoué pour :", name);
    }

    // 4.3 Reset champs
    nameInput.value = '';
    photoInput.value = '';
  };

  reader.readAsDataURL(file);
};
