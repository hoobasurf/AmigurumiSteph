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

// Vérification Firebase
alert("Firebase chargé ? " + (db ? "OUI" : "NON"));

// Ajouter création
addBtn.onclick = async () => {
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

    await db.collection("creations").add({
      name: name,
      imageUrl: url,
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
  const snap = await db.collection("creations").get();

  snap.docs.forEach(docu => {
    const div = document.createElement("div");
    div.className = "owner-item";
    div.innerHTML = `
      <span>${docu.data().name}</span>
      <img src="${docu.data().imageUrl}" class="owner-thumb">
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
