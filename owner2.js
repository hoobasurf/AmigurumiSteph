import { db, storage } from "./firebase.js";
import { collection, addDoc, getDocs, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-storage.js";

const addBtn = document.getElementById("addBtn");
const nameInput = document.getElementById("name");
const photoInput = document.getElementById("photo");
const ownerList = document.getElementById("owner-list");

alert("Owner JS chargé !");

addBtn.onclick = async () => {
  const name = nameInput.value.trim();
  const file = photoInput.files[0];

  if (!name || !file) {
    alert("Remplis le nom et choisis une image 🧸");
    return;
  }

  try {
    // Upload sur Firebase Storage
    const storageRef = ref(storage, "photos/" + Date.now() + "-" + file.name);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    // Ajout Firestore
    await addDoc(collection(db, "creations"), {
      name,
      imageUrl: url,
      createdAt: Date.now()
    });

    // Reset champs
    nameInput.value = "";
    photoInput.value = "";

    alert("Création ajoutée !");
  } catch (err) {
    console.error(err);
    alert("Erreur lors de l'ajout de la création !");
  }
};

// 🔥 Affichage live côté Owner
const creationsCol = collection(db, "creations");
const q = query(creationsCol, orderBy("createdAt", "desc"));

onSnapshot(q, (snapshot) => {
  ownerList.innerHTML = "";
  snapshot.docs.forEach(docu => {
    const data = docu.data();
    const div = document.createElement("div");
    div.className = "owner-item";
    div.innerHTML = `<strong>${data.name}</strong><br><img src="${data.imageUrl}" width="150">`;
    ownerList.appendChild(div);
  });
});
