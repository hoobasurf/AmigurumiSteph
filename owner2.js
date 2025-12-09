// Config Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAKUqhiGi1ZHIfZRwslMIUip8ohwOiLhFA",
  authDomain: "amigurumisteph.firebaseapp.com",
  projectId: "amigurumisteph",
  storageBucket: "amigurumisteph.appspot.com",
  messagingSenderId: "175290001202",
  appId: "1:175290001202:web:b53e4255e699d65bd4192b"
};

// Initialisation
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// Éléments HTML
const nameInput = document.getElementById("name");
const photoInput = document.getElementById("photo");
const list = document.getElementById("owner-list");

// Upload automatique
photoInput.addEventListener("change", async () => {
  const file = photoInput.files[0];
  const name = nameInput.value.trim();

  if (!file || !name) {
    alert("Merci de remplir le nom et choisir une photo !");
    return;
  }

  try {
    // 🔹 Crée une référence unique
    const imgRef = storage.ref("creations/" + Date.now() + "-" + file.name);

    // 🔹 Upload le fichier
    await imgRef.put(file);

    // 🔹 Récupère l'URL finale
    const url = await imgRef.getDownloadURL();

    // 🔹 Ajoute à Firestore
    await db.collection("creations").add({
      name: name,
      imageUrl: url,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    // Reset champs
    nameInput.value = "";
    photoInput.value = "";

  } catch (err) {
    console.error(err);
    alert("Erreur : " + err.message);
  }
});

// Affichage live
db.collection("creations").orderBy("createdAt", "desc").onSnapshot(snapshot => {
  list.innerHTML = "";
  snapshot.forEach(doc => {
    const data = doc.data();
    const item = document.createElement("div");
    item.className = "owner-item";
    item.innerHTML = `
      <p>${data.name}</p>
      <img src="${data.imageUrl}" class="mini-img">
    `;
    list.appendChild(item);
  });
});
