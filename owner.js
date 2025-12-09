import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://iubbxvipgofxasatmvzg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1YmJ4dmlwZ29meGFzYXRtdnpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyODg1NzgsImV4cCI6MjA4MDg2NDU3OH0.cg6AbfQ-av-nyEtAdWetdRjHSKaYJUw2QY2kgCFgkVs';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const nameInput = document.getElementById('name');
const photoInput = document.getElementById('photo');
const addBtn = document.getElementById('add');
const list = document.getElementById('owner-list');

// Ajouter à la liste visuellement (affichage immédiat)
function addToList(item) {
  const div = document.createElement('div');
  div.className = 'owner-item';
  div.innerHTML = `<p>${item.name}</p><img src="${item.image_url}" class="mini-img">`;
  list.prepend(div);
}

// Charger les créations existantes depuis Supabase
async function loadCreations() {
  const { data, error } = await supabase
    .from('creations')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return console.error(error);
  list.innerHTML = '';
  data.forEach(addToList);
}
loadCreations();

// Bouton Ajouter
addBtn.onclick = () => {
  const name = nameInput.value.trim();
  const file = photoInput.files[0];
  if (!name || !file) return alert("Merci de remplir le nom et choisir une photo !");

  console.log("Nom :", name);
  console.log("Fichier sélectionné :", file);

  // ⚡ Affichage immédiat
  const reader = new FileReader();
  reader.onload = (e) => {
    const imgUrl = e.target.result;
    addToList({ name, image_url: imgUrl });
    nameInput.value = '';
    photoInput.value = '';
  };
  reader.readAsDataURL(file);

  // ⚡ Upload réel vers Supabase
  uploadToSupabase(name, file);
};

// Fonction upload Supabase
async function uploadToSupabase(name, file) {
  try {
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;

    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('creations')
      .upload(fileName, file);
    if (uploadError) throw uploadError;

    const { publicURL } = supabase
      .storage
      .from('creations')
      .getPublicUrl(fileName);

    console.log("Upload terminé, URL publique :", publicURL);

    await supabase
      .from('creations')
      .insert([{ name, image_url: publicURL }]);

  } catch (err) {
    console.error(err);
    alert("Erreur upload Supabase : " + err.message);
  }
}
