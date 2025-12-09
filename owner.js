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

    // Reset
    nameInput.value = '';
    photoInput.value = '';
  };

  reader.readAsDataURL(file); // Convertit l'image pour affichage immédiat
};
