alert("Script chargé");
const addBtn = document.getElementById("add");
alert("addBtn: " + addBtn);
// --- Import Firebase ---
import { db, storage } from "./firebase.js";
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } 
  from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } 
  from "https://www.gstatic.com/firebasejs/12.6.0/firebase-storage.js";

// --- Éléments HTML ---
const nameInput = document.getElementById("name");
const photoInput = document.getElementById("photo");
const addBtn = document.getElementById("add");
const list = document.getElementById("owner-list");

// --- Vérif que le script est chargé ---
alert("OWNER JS chargé");

// --- Clic sur Ajouter ---
addBtn.onclick = async () => {
  alert("Clique détecté !");
  const name = nameInput.value.trim();
  const file = photoInput.files[0];

  if (!name || !file) {
    alert("Merci de remplir le nom et choisir une photo !");
    return;
  }

  try {
    // Upload image dans Firebase Storage
    const imgRef = ref(storage, "creations/" + Date.now() + "-" + file.name);
    const upload = await uploadBytes(imgRef, file);
    const url = await getDownloadURL(upload.ref);

    // Ajouter dans Firestore
    await addDoc(collection(db, "creations"), {
      name: name,
      image: url,
      createdAt: serverTimestamp()
    });

    alert("Création ajoutée !");
    nameInput.value = "";
    photoInput.value = "";

  } catch (err) {
    console.error(err);
    alert("Erreur : " + err.message);
  }
};

// --- Affichage en direct des créations ---
const q = query(collection(db, "creations"), orderBy("createdAt", "desc"));
onSnapshot(q, snapshot => {
  list.innerHTML = "";
  snapshot.forEach(doc => {
    const data = doc.data();
    const item = document.createElement("div");
    item.className = "owner-item";
    item.innerHTML = `
      <p>${data.name}</p>
      <img src="${data.image}" class="mini-img">
    `;
    list.appendChild(item);
  });
});
