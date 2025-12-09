// ---------------------------
// INITIALISATION SUPABASE
// ---------------------------
const supabaseUrl = "https://iubbxvipgofxasatmvzg.supabase.co";
const supabaseKey = "TON_PUBLIC_ANON_KEY_ICI";
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

console.log("Supabase initialisé :", supabase);

// ---------------------------
// ELEMENTS
// ---------------------------
const nameInput = document.getElementById('name');
const photoInput = document.getElementById('photo');
const addBtn = document.getElementById('add');
const list = document.getElementById('owner-list');

// ---------------------------
// BOUTON AJOUTER
// ---------------------------
addBtn.onclick = async () => {
  const name = nameInput.value.trim();
  const file = photoInput.files[0];

  if (!name || !file) {
    alert("Merci de remplir le nom et choisir une photo !");
    return;
  }

  console.log("Nom :", name);
  console.log("Fichier sélectionné :", file);
  console.log("Upload Supabase commencé…");

  // --- 1) Affichage immédiat (ton ancien code QUI MARCHAIT)
  const reader = new FileReader();
  reader.onload = (e) => {
    const imgUrl = e.target.result;

    const div = document.createElement('div');
    div.className = 'owner-item';
    div.innerHTML = `
      <p>${name}</p>
      <img src="${imgUrl}">
    `;
    list.prepend(div);
  };
  reader.readAsDataURL(file);

  // --- 2) Envoi dans SUPABASE STORAGE
  const filePath = `${Date.now()}_${file.name}`;

  const { data, error } = await supabase.storage
    .from("creations")
    .upload(filePath, file);

  if (error) {
    console.error("Erreur upload Supabase :", error);
    alert("Erreur upload supabase !");
    return;
  }

  console.log("Upload Supabase OK :", data);

  // --- 3) Générer l'URL publique
  const { data: urlData } = supabase.storage
    .from("creations")
    .getPublicUrl(filePath);

  const publicURL = urlData.publicUrl;
  console.log("URL publique :", publicURL);

  // --- 4) Enregistrer dans la base (visitor va lire ça)
  const { error: dbError } = await supabase
    .from("creations")
    .insert([{ name, url: publicURL }]);

  if (dbError) {
    console.error("Erreur DB :", dbError);
  }

  // Reset inputs
  nameInput.value = '';
  photoInput.value = '';

  alert("Création ajoutée !");
};
