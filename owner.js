// 1️⃣ Création du client Supabase directement ici
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://iubbxvipgofxasatmvzg.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_GDoZmwIdoP28XOdrfYYVNw_E_HiCQB1';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
console.log('Supabase chargé', supabase);

// 2️⃣ Éléments HTML
const nameInput = document.getElementById('name');
const photoInput = document.getElementById('photo');
const addBtn = document.getElementById('add');
const list = document.getElementById('owner-list');

// 3️⃣ Affichage existant au chargement
async function loadCreations() {
  const { data, error } = await supabase
    .from('creations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) { console.error(error); return; }

  list.innerHTML = '';
  data.forEach(item => addToList(item));
}

// 4️⃣ Ajouter à la liste visuellement
function addToList(item) {
  const div = document.createElement('div');
  div.className = 'owner-item';
  div.innerHTML = `
    <p>${item.name}</p>
    <img src="${item.image_url}" class="mini-img">
  `;
  list.prepend(div);
}

// 5️⃣ Bouton Ajouter
addBtn.onclick = async () => {
  const file = photoInput.files[0];
  const name = nameInput.value.trim();

  if (!file || !name) {
    alert("Merci de remplir le nom et choisir une photo !");
    return;
  }

  try {
    console.log("Fichier sélectionné :", file);
    console.log("Nom :", name);
    console.log("Upload commencé");

    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;

    // Upload image
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('creations')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // URL publique
    const { publicURL, error: urlError } = supabase
      .storage
      .from('creations')
      .getPublicUrl(fileName);

    if (urlError) throw urlError;

    // Ajouter dans la table Supabase
    const { data: insertData, error: insertError } = await supabase
      .from('creations')
      .insert([{ name, image_url: publicURL }]);

    if (insertError) throw insertError;

    console.log("URL publique :", publicURL);
    nameInput.value = '';
    photoInput.value = '';
    addToList({ name, image_url: publicURL });

  } catch (err) {
    console.error(err);
    alert('Erreur : ' + err.message);
  }
};

// 6️⃣ Charger les créations au départ
loadCreations();
