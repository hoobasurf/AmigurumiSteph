const nameInput = document.getElementById('name');
const photoInput = document.getElementById('photo');
const addBtn = document.getElementById('add');
const list = document.getElementById('owner-list');

// On charge ce qui existe déjà
let creations = JSON.parse(localStorage.getItem("creations") || "[]");

// Compression pour stocker plus d’images
function compressImage(file, maxWidth = 900, quality = 0.8) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");

        let w = img.width;
        let h = img.height;

        if (w > maxWidth) {
          h *= maxWidth / w;
          w = maxWidth;
        }

        canvas.width = w;
        canvas.height = h;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);

        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}


// --------- AFFICHAGE ----------
function renderCreations() {
  list.innerHTML = "";

  creations.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "owner-item";

    div.innerHTML = `
      <div class="delete-btn" data-index="${index}">×</div>
      <img src="${item.imgUrl}" alt="">
      <p>${item.name}</p>
    `;

    list.appendChild(div);
  });
}


// --------- SUPPRESSION (fenêtre rose pastel) ----------
function showDeletePopup(index) {
  const overlay = document.createElement("div");
  overlay.style = `
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.15);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 99999;
  `;

  const box = document.createElement("div");
  box.style = `
    background: #ffe4ec;
    border: 3px solid #b84c6f;
    padding: 20px;
    border-radius: 15px;
    width: 260px;
    text-align: center;
    box-shadow: 0 8px 25px rgba(0,0,0,0.2);
  `;

  box.innerHTML = `
    <p style="color:#b84c6f; font-weight:600; font-size:16px; margin-bottom:15px;">
      Supprimer cette création ?
    </p>

    <div style="display:flex; gap:10px; justify-content:center;">
      <button id="delYes" style="
        padding: 8px 14px;
        border-radius: 10px;
        border: none;
        background: #ffb6c1;
        color: #8b3a3a;
        font-weight: bold;
        cursor: pointer;">
        Oui
      </button>

      <button id="delNo" style="
        padding: 8px 14px;
        border-radius: 10px;
        border: none;
        background: #ddd;
        cursor: pointer;">
        Non
      </button>
    </div>
  `;

  overlay.appendChild(box);
  document.body.appendChild(overlay);

  // OK suppression
  box.querySelector("#delYes").onclick = () => {
    creations.splice(index, 1);
    localStorage.setItem("creations", JSON.stringify(creations));
    renderCreations();
    overlay.remove();
  };

  // Annuler
  box.querySelector("#delNo").onclick = () => overlay.remove();
}


// --------- AJOUT ----------
addBtn.onclick = async () => {
  const name = nameInput.value.trim();
  const file = photoInput.files[0];

  if (!name || !file) {
    alert("Merci de remplir le nom et choisir une photo !");
    return;
  }

  const imgUrl = await compressImage(file);
  creations.unshift({ name, imgUrl });

  localStorage.setItem("creations", JSON.stringify(creations));
  renderCreations();

  nameInput.value = "";
  photoInput.value = "";
};


// --------- CLIC SUR LA CROIX ----------
list.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const index = e.target.dataset.index;
    showDeletePopup(index);
  }
});

// --------- INIT ----------
renderCreations();


// ====================== NOUVEAU POUR SIDEBAR & AFFICHAGE ======================

const sidebar = document.getElementById("sidebar");
const toggle = document.getElementById("toggleSidebar");
const displayModes = document.getElementById("display-modes");

toggle.onclick = () => sidebar.classList.toggle("sidebar-open");

// Modes d’affichage uniquement pour Mes Créations
function setMode(mode){
  list.className = mode;
}

// OUVRIR SECTION SIDEBAR
function openSection(id){
  sidebar.classList.remove('sidebar-open'); // ferme sidebar automatiquement
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.owner-box, #owner-list, #display-modes').forEach(e=>e.style.display='none');
  document.getElementById(id).classList.add('active');
}

// FERMER SECTION / RETOUR MES CREATIONS
function closeSection(){
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.owner-box, #owner-list, #display-modes').forEach(e=>e.style.display='flex');
  list.style.display='flex';
}
