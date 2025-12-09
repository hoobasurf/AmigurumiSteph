import { db, storage } from "./firebase.js";
import { collection, addDoc, getDocs, orderBy, query } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-storage.js";

const addBtn = document.getElementById("add");
const nameInput = document.getElementById("name");
const photoInput = document.getElementById("photo");
const ownerList = document.getElementById("owner-list");

addBtn.onclick = async () => {
  if (!nameInput.value || !photoInput.files[0]) {
    alert("Merci de remplir le nom et choisir une photo !");
    return;
  }

  const file = photoInput.files[0];
  const storageRef = ref(storage, "photos/" + Date.now() + "-" + file.name);

  try {
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    await addDoc(collection(db, "creations"), {
      name: nameInput.value,
      imageUrl: url,
      createdAt: Date.now()
    });

    // Reset inputs
    nameInput.value = "";
    photoInput.value = "";

    alert("Création ajoutée ✅");
    loadCreations(); // Met à jour la liste Owner

  } catch (err) {
    console.error(err);
    alert("Erreur lors de l'ajout !");
  }
};

// --- Charger les créations côté Owner ---
async function loadCreations() {
  ownerList.innerHTML = "";
  try {
    const q = query(collection(db, "creations"), orderBy("createdAt"));
    const snapshot = await getDocs(q);

    snapshot.forEach(docu => {
      const data = docu.data();
      const div = document.createElement("div");
      div.className = "owner-item";
      div.innerHTML = `
        <img src="${data.imageUrl}" class="owner-thumb">
        <span>${data.name}</span>
      `;
      ownerList.appendChild(div);
    });

  } catch (err) {
    console.error(err);
    alert("Erreur lors du chargement des créations !");
  }
}

loadCreations();
