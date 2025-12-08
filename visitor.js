import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

async function loadVisitorCreations() {
  try {
    const snap = await getDocs(collection(db, "creations"));
    const list = document.getElementById("visitor-list");
    list.innerHTML = "";

    snap.docs.forEach(docu => {
      const div = document.createElement("div");
      div.className = "visitor-item";
      div.innerHTML = `
        <img src="${docu.data().imageUrl}" class="visitor-thumb">
        <span>${docu.data().name}</span>
      `;
      list.appendChild(div);
    });
  } catch (err) {
    alert("Erreur lors du chargement des créations côté visiteur !");
    console.error(err);
  }
}

loadVisitorCreations();
