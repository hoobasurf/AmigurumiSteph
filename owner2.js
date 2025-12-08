// ⚡ Config Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAKUqhiGi1ZHIfZRwslMIUip8ohwOiLhFA",
  authDomain: "amigurumisteph.firebaseapp.com",
  projectId: "amigurumisteph",
  storageBucket: "amigurumisteph.appspot.com",
  messagingSenderId: "175290001202",
  appId: "1:175290001202:web:b53e4255e699d65bd4192b"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

const addBtn = document.getElementById("add");
const nameInput = document.getElementById("name");
const photoInput = document.getElementById("photo");
const ownerList = document.getElementById("owner-list");

// Debug vérification bouton
addBtn.onclick = async () => {
  alert("Clique détecté !");
  console.log("Nom :", nameInput.value, "Photo :", photoInput.files[0]);

  const name = nameInput.value.trim();
  const file = photoInput.files[0];

  if (!name || !file) {
    alert("Remplis le nom et choisis une image 🧸");
    return;
  }

  try {
    const storageRef = storage.ref("photos/" + Date.now() + "-" + file.name);
    await storageRef.put(file);
    const url = await storageRef.getDownloadURL();
    console.log("URL upload :", url);

    await db.collection("creations").add({
      name: name,
      imageUrl: url,
      createdAt: Date.now()
    });

    alert("Création ajoutée !");
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
  const snap = await db.collection("creations").get();

  snap.docs.forEach(docu => {
    const data = docu.data();
    const div = document.createElement("div");
    div.className = "owner-item";
    div.innerHTML = `
      <span>${data.name}</span>
      <img src="${data.imageUrl}" class="owner-thumb">
      <button class="delete-btn">🗑</button>
    `;

    div.querySelector(".delete-btn").onclick = async () => {
      await db.collection("creations").doc(docu.id).delete();
      loadCreations();
    };

    ownerList.appendChild(div);
  });
}

loadCreations();
