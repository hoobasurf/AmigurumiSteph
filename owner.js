const nameInput = document.getElementById('name');
const photoInput = document.getElementById('photo');
const addBtn = document.getElementById('add');
const list = document.getElementById('owner-list');

let creations = JSON.parse(localStorage.getItem("creations") || "[]");
renderCreations();

addBtn.onclick = () => {
  const name = nameInput.value.trim();
  const file = photoInput.files[0];

  if (!name || !file) {
    alert("Merci de remplir le nom et choisir une photo !");
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    creations.push({
      id: Date.now(),
      name,
      img: e.target.result
    });

    localStorage.setItem("creations", JSON.stringify(creations));
    renderCreations();

    nameInput.value = "";
    photoInput.value = "";
  };

  reader.readAsDataURL(file);
};

function renderCreations() {
  list.innerHTML = "";

  creations.forEach(item => {
    const div = document.createElement('div');
    div.className = 'owner-item';

    div.innerHTML = `
      <div class="delete-btn" data-id="${item.id}">×</div>
      <p>${item.name}</p>
      <img src="${item.img}">
    `;

    list.appendChild(div);
  });

  // Active le bouton supprimer
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.onclick = (e) => {
      const id = Number(e.target.dataset.id);
      confirmDelete(id);
    };
  });
}

// --- Popup de confirmation rose pastel ---
function confirmDelete(id) {
  const box = document.createElement("div");
  box.style.position = "fixed";
  box.style.top = "50%";
  box.style.left = "50%";
  box.style.transform = "translate(-50%, -50%)";
  box.style.background = "#ffe4ec";   // rose pastel
  box.style.border = "2px solid #8b3a3a"; // bordeaux
  box.style.padding = "20px";
  box.style.borderRadius = "12px";
  box.style.boxShadow = "0 0 10px rgba(0,0,0,0.2)";
  box.style.textAlign = "center";

  box.innerHTML = `
    <p style="margin-bottom: 15px; color:#8b3a3a; font-weight: bold;">
      Êtes-vous sûre de vouloir supprimer ce projet ?
    </p>
    <button id="yesDel" style="
        margin-right:10px; padding:8px 15px; border-radius:8px; border:none;
        background:#ffb6c1; color:#8b3a3a; cursor:pointer;">Oui</button>
    <button id="noDel" style="
        padding:8px 15px; border-radius:8px; border:none;
        background:#ddd; cursor:pointer;">Non</button>
  `;

  document.body.appendChild(box);

  document.getElementById("yesDel").onclick = () => {
    creations = creations.filter(c => c.id !== id);
    localStorage.setItem("creations", JSON.stringify(creations));
    renderCreations();
    box.remove();
  };

  document.getElementById("noDel").onclick = () => {
    box.remove();
  };
}
