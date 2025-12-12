// owner.js — version corrigée et robuste

document.addEventListener("DOMContentLoaded", () => {
  // DOM
  const nameInput = document.getElementById('name');
  const photoInput = document.getElementById('photo');
  const addBtn = document.getElementById('add');
  const list = document.getElementById('owner-list');

  // Safe load localStorage
  let creations = [];
  try {
    creations = JSON.parse(localStorage.getItem("creations") || "[]");
    if (!Array.isArray(creations)) creations = [];
  } catch (e) {
    creations = [];
  }

  renderCreations();

  // Ajout
  addBtn.addEventListener("click", () => {
    const nameRaw = nameInput.value.trim();
    const file = photoInput.files[0];

    if (!nameRaw || !file) {
      alert("Merci de remplir le nom et choisir une photo !");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const id = String(Date.now()) + "-" + Math.floor(Math.random() * 9999);
      const item = {
        id,
        name: escapeHtml(nameRaw),
        img: e.target.result,
        date: Date.now()
      };

      creations.push(item);
      try {
        localStorage.setItem("creations", JSON.stringify(creations));
      } catch (err) {
        console.error("Erreur stockage local:", err);
        alert("Impossible de sauvegarder : stockage plein ?");
      }

      renderCreations();

      // reset
      nameInput.value = "";
      photoInput.value = "";
      photoInput.value = null;
    };

    reader.readAsDataURL(file);
  });

  // Délégation pour delete (plus fiable que ré-attacher après chaque render)
  list.addEventListener("click", (ev) => {
    const btn = ev.target.closest(".delete-btn");
    if (!btn) return;
    const id = btn.dataset.id;
    if (!id) return;
    confirmDelete(id);
  });

  // Affichage
  function renderCreations() {
    // tri récent d'abord
    creations.sort((a, b) => b.date - a.date);

    list.innerHTML = "";
    creations.forEach(item => {
      const div = document.createElement('div');
      div.className = 'owner-item';
      // structure : delete bouton, nom, img
      div.innerHTML = `
        <div class="delete-btn" data-id="${item.id}" aria-label="Supprimer">×</div>
        <p>${item.name}</p>
        <img src="${item.img}" alt="${item.name}">
      `;
      list.appendChild(div);
    });
  }

  // Popup confirmation
  function confirmDelete(id) {
    const box = document.createElement("div");
    box.style.position = "fixed";
    box.style.top = "50%";
    box.style.left = "50%";
    box.style.transform = "translate(-50%, -50%)";
    box.style.background = "#ffe4ec";
    box.style.border = "2px solid #8b3a3a";
    box.style.padding = "18px";
    box.style.borderRadius = "12px";
    box.style.boxShadow = "0 8px 30px rgba(0,0,0,0.15)";
    box.style.textAlign = "center";
    box.style.zIndex = "99999";
    box.innerHTML = `
      <p style="margin-bottom:14px; color:#8b3a3a; font-weight:600;">
        Êtes-vous sûre de vouloir supprimer ce projet ?
      </p>
      <div style="display:flex; gap:10px; justify-content:center;">
        <button id="yesDel" style="
          padding:8px 14px; border-radius:8px; border:none;
          background:#ffb6c1; color:#8b3a3a; cursor:pointer; font-weight:600;">
          Oui
        </button>
        <button id="noDel" style="
          padding:8px 14px; border-radius:8px; border:none;
          background:#ddd; cursor:pointer;">
          Non
        </button>
      </div>
    `;
    document.body.appendChild(box);

    box.querySelector("#yesDel").addEventListener("click", () => {
      creations = creations.filter(c => c.id !== id);
      try {
        localStorage.setItem("creations", JSON.stringify(creations));
      } catch (err) {
        console.error("Erreur stockage local:", err);
      }
      renderCreations();
      box.remove();
    });

    box.querySelector("#noDel").addEventListener("click", () => {
      box.remove();
    });
  }

  // small utility to avoid injection
  function escapeHtml(str){
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
});
