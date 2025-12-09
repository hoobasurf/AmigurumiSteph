// ---- DOM ----
const nameInput = document.getElementById('name');
const photoInput = document.getElementById('photo');
const addBtn = document.getElementById('add');
const list = document.getElementById('owner-list');

// ---- UPLOAD + TABLE ----
async function uploadToSupabase(name, file) {

  // nom unique
  const fileName = Date.now() + "_" + file.name;

  // upload dans storage
  const { data: uploadData, error: uploadError } =
    await window.supabaseClient.storage
      .from("creations")
      .upload(fileName, file);

  if (uploadError) {
    console.error("Erreur upload :", uploadError);
    alert("Erreur upload Supabase");
    return;
  }

  // URL publique
  const publicURL = window.supabaseClient.storage
    .from("creations")
    .getPublicUrl(fileName).data.publicUrl;

  console.log("URL publique :", publicURL);

  // insert dans la table
  const { error: insertError } = await window.supabaseClient
    .from("creations")
    .insert({
      name: name,
      image_url: publicURL
    });

  if (insertError) {
    console.error("Erreur insert table :", insertError);
    alert("Erreur table Supabase");
    return;
  }

  console.log("Enregistrement OK !");
}


// ---- Bouton Ajouter ----
addBtn.onclick = async () => {
  const name = nameInput.value.trim();
  const file = photoInput.files[0];

  if (!name || !file) {
    alert("Merci de remplir le nom et choisir une photo !");
    return;
  }

  console.log("Nom :", name);
  console.log("Fichier sélectionné :", file);

  // Affichage immédiat dans owner (comme AVANT)
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

    nameInput.value = "";
    photoInput.value = "";
  };
  reader.readAsDataURL(file);

  // Envoi réel vers Supabase
  uploadToSupabase(name, file);
};
