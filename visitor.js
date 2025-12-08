import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const gallery = document.getElementById("gallery");
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const modalThumbs = document.getElementById("modal-thumbnails");
const commentModal = document.getElementById("comment-modal");
const commentBtn = document.getElementById("comment-btn");
const closeModal = document.getElementById("close-modal");
const closeComment = document.getElementById("close-comment");

async function loadVisitorCreations() {
  const snap = await getDocs(collection(db, "creations"));
  gallery.innerHTML = "";

  snap.docs.forEach(docu => {
    const div = document.createElement("div");
    div.className = "gallery-item";
    div.innerHTML = `
      <img src="${docu.data().imageUrls[0]}">
      <div class="like-comment">❤️ 0 💬 0</div>
    `;
    div.onclick = () => openModal(docu.data());
    gallery.appendChild(div);
  });
}

function openModal(data) {
  modal.classList.remove("hidden");
  modalImg.src = data.imageUrls[0];
  modalThumbs.innerHTML = "";

  if (data.imageUrls.length > 1) {
    data.imageUrls.forEach(url => {
      const thumb = document.createElement("img");
      thumb.src = url;
      thumb.onclick = () => modalImg.src = url;
      modalThumbs.appendChild(thumb);
    });
  }
}

closeModal.onclick = () => modal.classList.add("hidden");
commentBtn.onclick = () => commentModal.classList.remove("hidden");
closeComment.onclick = () => commentModal.classList.add("hidden");

loadVisitorCreations();
