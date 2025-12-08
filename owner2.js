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
  const files = Array.from(photoInput.files);

  if (!name || files.length === 0) {
    alert("Remplis le nom et choisis au moins une image 🧸");
    return;
  }

  try {
    const urls = [];
    for (let file of files) {
      const storageRef = storage.ref("photos/" + Date.now() + "-" + file.name);
      await storageRef.put(file);
      const url = await storageRef.getDownloadURL();
      urls.push(url);
    }

    await db.collection("creations").add({
      name: name,
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
  const snap = await db.collection("creations").get();

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
      await db.collection("creations").doc(docu.id).delete();
      loadCreations();
    };

    ownerList.appendChild(div);
  });
}

loadCreations();
