import { db, storage } from "./firebase.js";
import { collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-storage.js";

// Vérification Firebase
alert("Firebase chargé ? " + (db ? "OUI" : "NON"));

// --- AJOUTER UNE CRÉATION ---
document.getElementById("add").onclick = async () => {
  const name = document.getElementById("name").value.trim();
  const file = document.getElementById("photo").files[0];

  if (!name || !file) {
    alert("Remplis le nom et choisis une image 🧸");
    return;
  }

  try {
    // Upload image
    const storageRef = ref(storage, "photos/" + Date.now() + "-" + file.name);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    // Ajouter dans Firestore
    await addDoc(collection(db, "creations"), {
      name,
      imageUrl: url,
      createdAt: Date.now()
    });

    // Reset inputs
    document.getElementById("name").value = "";
    document.getElementById("photo").value = "";

    loadCreations();
  } catch (err) {
    alert("Erreur lors de l'ajout de la création !");
    console.error(err);
  }
};

// --- CHARGER LES CRÉATIONS ---
async function loadCreations() {
  try {
    const snap = await getDocs(collection(db, "creations"));
    const list = document.getElementById("owner-list");
    list.innerHTML = "";

    snap.docs.forEach(docu => {
      const div = document.createElement("div");
      div.className = "owner-item";
      div.innerHTML = `
        <img src="${docu.data().imageUrl}" class="owner-thumb">
        <span>${docu.data().name}</span>
        <button class="delete-btn">🗑</button>
      `;
      div.querySelector(".delete-btn").onclick = async () => {
        await deleteDoc(doc(db, "creations", docu.id));
        loadCreations();
      };
      list.appendChild(div);
    });
  } catch (err) {
    alert("Erreur lors du chargement des créations !");
    console.error(err);
  }
}

// Charger la liste au lancement
loadCreations();
