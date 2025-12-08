import { db, storage } from "./firebase.js";
import { collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-storage.js";

const addBtn = document.getElementById("add");
const nameInput = document.getElementById("name");
const photoInput = document.getElementById("photo");
const ownerList = document.getElementById("owner-list");

// Vérification Firebase
alert("Firebase chargé ? " + (db ? "OUI" : "NON"));

// Ajouter création
addBtn.onclick = async () => {
  const name = nameInput.value.trim();
  const files = Array.from(photoInput.files);

  if (!name || files.length === 0) {
    alert("Remplis le nom et choisis au moins une image 🧸");
    return;
  }

  try {
    const urls = [];
    for (let file of files) {
      const storageRef = ref(storage, "photos/" + Date.now() + "-" + file.name);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      urls.push(url);
    }

    await addDoc(collection(db, "creations"), {
      name,
      imageUrls: urls,
      createdAt: Date.now()
    });

    nameInput.value = "";
    photoInput.value = "";
    loadCreations();
  } catch (err) {
    alert("Erreur lors de l'ajout !");
    console.error(err);
  }
};

// Charger créations
async function loadCreations() {
  ownerList.innerHTML = "";
  const snap = await getDocs(collection(db, "creations"));

  snap.docs.forEach(docu => {
    const div = document.createElement("div");
    div.className = "owner-item";

    const images = docu.data().imageUrls.map(url => `<img src="${url}" class="owner-thumb">`).join("");
    div.innerHTML = `
      <span class="owner-name">${docu.data().name}</span>
      <div class="owner-images">${images}</div>
      <button class="delete-btn">🗑</button>
    `;

    div.querySelector(".delete-btn").onclick = async () => {
      await deleteDoc(doc(db, "creations", docu.id));
      loadCreations();
    };

    ownerList.appendChild(div);
  });
}

loadCreations();
