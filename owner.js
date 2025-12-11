const nameInput = document.getElementById('name');
const photoInput = document.getElementById('photo');
const addBtn = document.getElementById('add');
const list = document.getElementById('owner-list');

// --- CHARGEMENT EXISTANT DE localStorage ---
let creations = JSON.parse(localStorage.getItem("creations") || "[]");

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
    div.querySelector(".delete-btn").onclick = () => {
      if(confirm(`Supprimer "${item.name}" ?`)) {
        creations.splice(index,1);
        localStorage.setItem("creations", JSON.stringify(creations));
        renderCreations();
      }
    };
    list.appendChild(div);
  });
}

// --- BOUTON AJOUT ---
addBtn.onclick = () => {
  const name = nameInput.value.trim();
  const file = photoInput.files[0];

  if(!name || !file) {
    alert("Merci de remplir le nom et choisir une photo !");
    return;
  }

  // Lecture locale de l'image pour affichage immédiat
  const reader = new FileReader();
  reader.onload = e => {
    const imgUrl = e.target.result;
    creations.unshift({ name, imgUrl });
    localStorage.setItem("creations", JSON.stringify(creations));
    renderCreations();

    // Reset champs
    nameInput.value = "";
    photoInput.value = "";
  };
  reader.readAsDataURL(file);
};

// --- INITIALISATION ---
renderCreations();
