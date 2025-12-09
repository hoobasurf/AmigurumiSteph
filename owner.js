import { supabase } from './supabase.js';

const nameInput = document.getElementById('name');
const photoInput = document.getElementById('photo');
const list = document.getElementById('owner-list');

// Fonction pour ajouter visuellement dans la liste
function addToList(item) {
  const div = document.createElement('div');
  div.className = 'owner-item';
  div.innerHTML = `
    <p>${item.name}</p>
    <img src="${item.image_url}" class="mini-img">
  `;
  list.prepend(div);
}

// Charger les créations existantes au démarrage
async function loadCreations() {
  const { data, error } = await supabase
    .from('creations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) { console.error(error); return; }

  list.innerHTML = '';
  data.forEach(item => addToList(item));
}

// Upload automatique dès que l’image est sélectionnée
photoInput.addEventListener('change', async () => {
  const file = photoInput.files[0];
  const name = nameInput.value.trim();

  if (!file || !name) {
    alert("Merci de remplir le nom et choisir une photo !");
    return;
  }

  try {
    console.log("Fichier sélectionné :", file);
    console.log("Nom :", name);

    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;

    // Upload dans Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('creations')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    console.log("Upload commencé");

    // URL publique
    const { publicURL, error: urlError } = supabase
      .storage
      .from('creations')
      .getPublicUrl(fileName);

    if (urlError) throw urlError;

    console.log("URL publique :", publicURL);

    // Ajouter dans la table Supabase
    const { data: insertData, error: insertError } = await supabase
      .from('creations')
      .insert([{ name, image_url: publicURL }]);

    if (insertError) throw insertError;

    // Reset champs
    nameInput.value = '';
    photoInput.value = '';

    // Ajouter visuellement
    addToList({ name, image_url: publicURL });

  } catch (err) {
    console.error(err);
    alert('Erreur : ' + err.message);
  }
});

// Charger au départ
loadCreations();
