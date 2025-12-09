import { db } from "./firebase.js";
import { collection, getDocs, orderBy, query } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const gallery = document.getElementById("gallery");
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const miniThumbs = document.getElementById("mini-thumbs");
const closeModal = document.getElementById("close-modal");

async function loadGallery() {
  gallery.innerHTML = "";
  try {
    const q = query(collection(db, "creations"), orderBy("createdAt"));
    const snapshot = await getDocs(q);

    snapshot.forEach(docu => {
      const data = docu.data();
      const div = document.createElement("div");
      div.className = "gallery-item";
      div.innerHTML = `
        <img src="${data.imageUrl}" class="thumb" alt="${data.name}">
        <div class="caption">${data.name} ❤️</div>
      `;
      div.querySelector("img").onclick = () => openModal(data);
      gallery.appendChild(div);
    });

  } catch (err) {
    console.error(err);
    alert("Erreur lors du chargement de la galerie !");
  }
}

function openModal(data) {
  modal.classList.remove("hidden");
  modalImg.src = data.imageUrl;
  miniThumbs.innerHTML = "";
  // Si tu veux ajouter d'autres miniatures, tu peux ici
}

closeModal.onclick = () => {
  modal.classList.add("hidden");
};

loadGallery();
