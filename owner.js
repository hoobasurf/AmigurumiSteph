// --- INITIALISATION SUPABASE ---
const supabaseUrl = 'https://xxxx.supabase.co'; // Remplace par ton URL Supabase
const supabaseKey = 'PUBLIC_ANON_KEY';          // Remplace par ta clé publique
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

const nameInput = document.getElementById('name');
const photoInput = document.getElementById('photo');
const addBtn = document.getElementById('add');
const list = document.getElementById('owner-list');

// --- TABLEAU DES CRÉATIONS ---
let creations = [];

// --- FONCTION AFFICHAGE ---
function renderCreations() {
  list.innerHTML = "";
  creations.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "owner-item";
    div.innerHTML = `
      <img src="${item.imgUrl}" alt="">
      <p>${item.name}</p>
      <button class="delete-btn">&times;</button>
    `;
    // Suppression avec confirmation
    div.querySelector(".delete-btn").onclick = async () => {
      if(confirm(`Supprimer "${item.name}" ?`)) {
        try {
          const fileName = item.imgUrl.split('/').pop().split('?')[0];
          await supabase.storage.from('creations').remove([fileName]);
        } catch(e) {
          console.error("Erreur suppression Supabase :", e);
        }
        creations.splice(index, 1);
        renderCreations();
      }
    };
    list.appendChild(div);
  });
}

// --- BOUTON AJOUT ---
addBtn.onclick = async () => {
  const name = nameInput.value.trim();
  const file = photoInput.files[0];

  if(!name || !file) {
    alert("Merci de remplir le nom et choisir une photo !");
    return;
  }

  const fileName = `${Date.now()}_${file.name}`;

  // Upload sur Supabase
  const { data, error } = await supabase
    .storage
    .from('creations') // Nom du bucket
    .upload(fileName, file);

  if(error) {
    console.error(error);
    alert("Erreur lors de l'upload !");
    return;
  }

  // Récupérer l'URL publique
  const { publicUrl } = supabase
    .storage
    .from('creations')
    .getPublicUrl(fileName);

  creations.unshift({ name, imgUrl: publicUrl });
  renderCreations();

  // Reset
  nameInput.value = "";
  photoInput.value = "";
};

// --- CHARGEMENT INITIAL DES IMAGES SUPABASE ---
async function loadCreationsFromSupabase() {
  const { data, error } = await supabase.storage.from('creations').list('', { limit: 1000 }); 
  // '' = dossier racine, limit = max 1000 fichiers à récupérer
  if(error) {
    console.error("Erreur chargement images :", error);
    return;
  }

  creations = data.map(file => ({
    name: file.name.split('_').slice(1).join('_'), // retire le timestamp ajouté
    imgUrl: supabase.storage.from('creations').getPublicUrl(file.name).publicUrl
  }));

  renderCreations();
}

// --- INITIALISATION ---
loadCreationsFromSupabase();
