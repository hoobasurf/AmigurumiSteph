const nameInput = document.getElementById('name');
const photoInput = document.getElementById('photo');
const addBtn = document.getElementById('add');
const list = document.getElementById('owner-list');

// On charge ce qui existe déjà
let creations = JSON.parse(localStorage.getItem("creations") || "[]");

// 🔥 Augmenter la taille possible du localStorage (compression)
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

        const compressed = canvas.toDataURL("image/jpeg", quality);
        resolve(compressed);
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
      <button class="delete-btn" data-index="${index}">&times;</button>
      <img src="${item.imgUrl}" alt="">
      <p>${item.name}</p>
    `;

    list.appendChild(div);
  });
}


// --------- AJOUT ----------
addBtn.onclick = async () => {
  const name = nameInput.value.trim();
  const file = photoInput.files[0];

  if (!name || !file) {
    alert("Merci de remplir le nom et choisir une photo !");
    return;
  }

  // 🔥 compression pour stocker beaucoup plus (100+ images)
  const imgUrl = await compressImage(file, 900, 0.7);

  creations.unshift({ name, imgUrl });

  localStorage.setItem("creations", JSON.stringify(creations));

  renderCreations();

  nameInput.value = "";
  photoInput.value = "";
};


// --------- SUPPRESSION ----------
list.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-btn")) {
    const index = event.target.dataset.index;

    if (confirm("Supprimer cette création ?")) {
      creations.splice(index, 1);
      localStorage.setItem("creations", JSON.stringify(creations));
      renderCreations();
    }
  }
});


// --------- INITIALISATION ----------
renderCreations();
