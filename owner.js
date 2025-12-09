import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://iubbxvipgofxasatmvzg.supabase.co';
const SUPABASE_KEY = 'sb_publishable_GDoZmwIdoP28XOdrfYYVNw_E_HiCQB1';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const nameInput = document.getElementById('name');
const photoInput = document.getElementById('photo');
const addBtn = document.getElementById('add');
const list = document.getElementById('owner-list');

// ----------------------------
// BOUTON AJOUTER
// ----------------------------
addBtn.onclick = async () => {
  const name = nameInput.value.trim();
  const file = photoInput.files[0];

  if (!name || !file) {
    alert("Merci de remplir le nom et choisir une photo !");
    return;
  }

  console.log("Nom :", name);
  console.log("Fichier sélectionné :", file);

  // --- 1) AFFICHAGE LOCAL (ton ancien code, je n’y touche pas) ---
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

    nameInput.value = '';
    photoInput.value = '';
  };
  reader.readAsDataURL(file);

  // --- 2) UPLOAD SUPABASE ---
  try {
    const fileName = `${Date.now()}-${file.name}`;

    console.log("UPLOAD EN COURS…");

    const { data: uploaded, error: uploadError } = await supabase
      .storage
      .from('creations')   // nom du bucket
      .upload(fileName, file);

    if (uploadError) {
      console.error(uploadError);
      alert("Erreur upload Supabase : " + uploadError.message);
      return;
    }

    // --- 3) URL PUBLIQUE ---
    const { data: urlData } = supabase
      .storage
      .from('creations')
      .getPublicUrl(fileName);

    const image_url = urlData.publicUrl;
    console.log("URL publique :", image_url);

    // --- 4) ENREGISTRER DANS LA TABLE ---
    const { error: insertError } = await supabase
      .from('creations')
      .insert([{ name, image_url }]);

    if (insertError) {
      console.error(insertError);
      alert("Erreur insertion BD : " + insertError.message);
      return;
    }

    console.log("Création enregistrée dans la base Supabase");

  } catch (err) {
    console.error(err);
    alert("Erreur Supabase : " + err.message);
  }
};
