// owner.js — version complète avec popup pastel

document.addEventListener("DOMContentLoaded", () => {

  const nameInput = document.getElementById('name');
  const photoInput = document.getElementById('photo');
  const addBtn = document.getElementById('add');
  const list = document.getElementById('owner-list');

  // Chargement sécurisé des créations
  let creations = [];
  try {
    creations = JSON.parse(localStorage.getItem("creations") || "[]");
    if (!Array.isArray(creations)) creations = [];
  } catch (err) {
    creations = [];
  }

  renderCreations();

  // --- AJOUT ---
  addBtn.addEventListener("click", () => {
    const nameRaw = nameInput.value.trim();
    const file = photoInput.files[0];

    if (!nameRaw || !file) {
      alert("Merci de remplir le nom et choisir une photo !");
      return;
    }

    const reader = new FileReader();
    reader.onload = e => {
      const item = {
        id: Date.now() + "-" + Math.floor(Math.random() * 9999),
        name: escapeHtml(nameRaw),
        img: e.target.result,
        date: Date.now()
      };

      creations.push(item);

      try {
        localStorage.setItem("creations", JSON.stringify(creations));
      } catch (error) {
        alert("Impossible de sauvegarder : stockage plein ?");
        return;
      }

      renderCreations();

      nameInput.value = "";
      photoInput.value = "";
    };

    reader.readAsDataURL(file);
  });

  // --- SUPPRESSION PAR DÉLÉGATION ---
  list.addEventListener("click", (e) => {
    const btn = e.target.closest(".delete-btn");
    if (!btn) return;

    const id = btn.dataset.id;
    const index = creations.findIndex(c => c.id === id);

    if (index !== -1) showDeletePopup(index);
  });

  // --- AFFICHAGE ---
  function renderCreations() {
    creations.sort((a, b) => b.date - a.date);

    list.innerHTML = "";
    creations.forEach(item => {
      const div = document.createElement("div");
      div.className = "owner-item";

      div.innerHTML = `
        <div class="delete-btn" data-id="${item.id}">×</div>
        <img src="${item.img}">
        <p>${item.name}</p>
      `;

      list.appendChild(div);
    });
  }

  // --- POPUP DE SUPPRESSION (Pastel + Bordeaux + Animations) ---
  function showDeletePopup(index) {
    const overlay = document.createElement("div");
    overlay.style = `
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.18);
      backdrop-filter: blur(2px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 99999;
      animation: fadeIn 0.25s ease-out;
    `;

    const box = document.createElement("div");
    box.style = `
      background: linear-gradient(145deg, #ffd6e6, #ffc1d9);
      border: 3px solid #b67385;
      padding: 22px;
      border-radius: 18px;
      width: 280px;
      text-align: center;
      box-shadow: 0 8px 22px rgba(182, 76, 111, 0.25);
      transform: scale(0.85);
      animation: popIn 0.25s ease-out forwards;
    `;

    box.innerHTML = `
      <p style="
        color: #8b3a55;
        font-weight: 700;
        font-size: 17px;
        margin-bottom: 18px;
      ">
        Supprimer cette création ?
      </p>

      <div style="display:flex; gap:12px; justify-content:center;">

        <button id="delYes" style="
          padding: 10px 16px;
          border-radius: 25px;
          border: none;
          background: #ff9fba;
          color: white;
          font-weight: bold;
          cursor: pointer;
          box-shadow: 0 3px 8px rgba(255, 159, 186, 0.4);
        ">
          Oui
        </button>

        <button id="delNo" style="
          padding: 10px 16px;
          border-radius: 25px;
          border: none;
          background: #f2c6d8;
          color: #8b3a55;
          font-weight: bold;
          cursor: pointer;
          box-shadow: 0 3px 8px rgba(242, 198, 216, 0.4);
        ">
          Non
        </button>

      </div>
    `;

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    box.querySelector("#delYes").onclick = () => {
      creations.splice(index, 1);
      localStorage.setItem("creations", JSON.stringify(creations));
      renderCreations();
      overlay.remove();
    };

    box.querySelector("#delNo").onclick = () => overlay.remove();

    // ajouter animations css
    const style = document.createElement("style");
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes popIn {
        0% { transform: scale(0.85); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }

  // Protection
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

});
