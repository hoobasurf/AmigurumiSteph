import { supabase } from './supabase.js';

const nameInput = document.getElementById('name');
const photoInput = document.getElementById('photo');
const addBtn = document.getElementById('add');
const list = document.getElementById('owner-list');

addBtn.onclick = async () => {
  const name = nameInput.value.trim();
  const file = photoInput.files[0];

  if (!name || !file) {
    alert("Merci de remplir le nom et choisir une photo !");
    return;
  }

  console.log("Nom :", name);
  console.log("Fichier sélectionné :", file);

  // --- TON CODE ORIGINAL, JE NE TOUCHE PAS ---
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

  // --- AJOUT SUPABASE (ne touche pas ton bouton) ---
  try {
    const fileName = `${Date.now()}-${file.name}`;
    console.log("Upload Supabase…");

    const { error: uploadError } = await supabase
      .storage
      .from('creations')
      .upload(fileName, file);

    if (uploadError) {
      console.error(uploadError);
      alert("Erreur upload : " + uploadError.message);
      return;
    }

    const { data: urlData } = supabase
      .storage
      .from('creations')
      .getPublicUrl(fileName);

    const image_url = urlData.publicUrl;
    console.log("URL publique :", image_url);

    const { error: insertError } = await supabase
      .from('creations')
      .insert([{ name, image_url }]);

    if (insertError) {
      console.error(insertError);
      alert("Erreur base : " + insertError.message);
      return;
    }

    console.log("Création ajoutée dans Supabase");
  } catch (err) {
    console.error(err);
    alert("Erreur Supabase : " + err.message);
  }
};
