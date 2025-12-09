// owner.js — keep original behavior, then also upload to Supabase (non-blocking for local display)

const nameInput = document.getElementById('name');
const photoInput = document.getElementById('photo');
const addBtn = document.getElementById('add');
const list = document.getElementById('owner-list');

addBtn.onclick = () => {
  const name = nameInput.value.trim();
  const file = photoInput.files[0];

  if (!name || !file) {
    alert("Merci de remplir le nom et choisir une photo !");
    return;
  }

  console.log("Nom :", name);
  console.log("Fichier sélectionné :", file);

  // --- ORIGINAL local display using FileReader (unchanged) ---
  const reader = new FileReader();
  reader.onload = (e) => {
    const imgUrl = e.target.result;

    // Crée un élément dans la liste
    const div = document.createElement('div');
    div.className = 'owner-item';
    div.innerHTML = `
      <p>${name}</p>
      <img src="${imgUrl}">
    `;
    list.prepend(div);

    // Reset local inputs
    nameInput.value = '';
    photoInput.value = '';
  };

  reader.readAsDataURL(file); // Convertit l'image pour affichage immédiat

  // --- NEW: upload to Supabase (doesn't remove the local display) ---
  // We run the upload async and log results.
  (async () => {
    try {
      if (!window.supabaseClient) {
        console.warn("supabaseClient non trouvé — upload Supabase annulé.");
        return;
      }

      console.log("Upload Supabase commencé...");

      const fileName = `${Date.now()}-${file.name}`;

      const { data: uploadData, error: uploadError } = await window.supabaseClient
        .storage
        .from('creations')
        .upload(fileName, file);

      if (uploadError) {
        console.error("Erreur upload:", uploadError);
        return;
      }

      console.log("Upload Supabase OK :", uploadData);

      // getPublicUrl (no error returned by getPublicUrl in latest SDK)
      const { data: urlData } = window.supabaseClient
        .storage
        .from('creations')
        .getPublicUrl(fileName);

      const publicURL = urlData && urlData.publicUrl ? urlData.publicUrl : null;
      console.log("URL publique :", publicURL);

      if (!publicURL) {
        console.warn("Impossible d'obtenir l'URL publique.");
        return;
      }

      // insert row into table 'creations' — adjust column name if yours is different
      const { error: insertError } = await window.supabaseClient
        .from('creations')
        .insert([{ name: name, image_url: publicURL }]); // table column = image_url

      if (insertError) {
        console.error("Erreur insertion BD :", insertError);
        return;
      }

      console.log("Création insérée dans la table 'creations'.");

    } catch (err) {
      console.error("Erreur upload Supabase (catch):", err);
    }
  })();

};
