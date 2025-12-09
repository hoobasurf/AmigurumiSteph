import { db } from "./firebase.js";

const gallery = document.getElementById("gallery");

const creationsCol = db.collection ? db.collection("creations") : null; // fallback

if (creationsCol) {
  db.collection("creations").orderBy("createdAt").onSnapshot(snapshot => {
    gallery.innerHTML = "";
    snapshot.docs.forEach(docu => {
      const data = docu.data();
      const img = document.createElement("img");
      img.src = data.imageUrl;
      img.alt = data.name;
      img.onclick = () => {
        const modal = document.getElementById("imageModal");
        const modalImg = document.getElementById("modalImg");
        modalImg.src = data.imageUrl;
        modal.style.display = "flex";
      };
      gallery.appendChild(img);
    });
  });
}
