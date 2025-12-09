import { supabase } from './supabase.js';

const nameInput = document.getElementById('name');
const photoInput = document.getElementById('photo');
const addBtn = document.getElementById('add');
const list = document.getElementById('owner-list');

// Affichage existant au chargement
async function loadCreations() {
  const { data, error } = await supabase
    .from('creations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) { console.error(error); return; }

  list.innerHTML = '';
  data.forEach(item => addToList(item));
}

// Ajouter à la liste visuellement
function addToList(item) {
  const div = document.createElement('div');
  div.className = 'owner-item';
  div.innerHTML = `
    <p>${item.name}</p>
    <img src="${item.image_url}" class="mini-img">
  `;
  list.prepend(div);
}

// Bouton Ajouter
addBtn.onclick = async () => {
  const file = photoInput.files[0];
  const name = nameInput.value.trim();

  if (!file || !name) {
    alert("Merci de remplir le nom et choisir une photo !");
    return;
  }

  try {
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;
    
    // Upload image dans Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('creations')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // Récupérer l'URL publique
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

    nameInput.value = '';
    photoInput.value = '';
    addToList({ name, image_url: publicURL });

  } catch (err) {
    console.error(err);
    alert('Erreur : ' + err.message);
  }
};

// Charger les créations au départ
loadCreations();
