// --- Initialisation Firebase ---
const firebaseConfig = {
  apiKey: "AIzaSyAKUqhiGi1ZHIfZRwslMIUip8ohwOiLhFA",
  authDomain: "amigurumisteph.firebaseapp.com",
  projectId: "amigurumisteph",
  storageBucket: "amigurumisteph.appspot.com",
  messagingSenderId: "175290001202",
  appId: "1:175290001202:web:b53e4255e699d65bd4192b"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// --- Éléments HTML ---
const nameInput = document.getElementById("name");
const photoInput = document.getElementById("photo");
const addBtn = document.getElementById("add");
const list = document.getElementById("owner-list");

// --- Vérif du script ---
alert("Script chargé correctement");

// --- Ajouter création ---
addBtn.onclick = async () => {
  alert("Bouton cliqué !");
  const name = nameInput.value.trim();
  const file = photoInput.files[0];

  if (!name || !file) {
    alert("Nom ou photo manquant !");
    return;
  }

  try {
    // Upload Storage
    const imgRef = storage.ref("creations/" + Date.now() + "-" + file.name);
    const uploadTask = await imgRef.put(file);
    const url = await imgRef.getDownloadURL();

    // Firestore
    await db.collection("creations").add({
      name: name,
      image: url,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    alert("Création ajoutée !");
    nameInput.value = "";
    photoInput.value = "";

  } catch (err) {
    console.error(err);
    alert("Erreur : " + err.message);
  }
};

// --- Affichage live ---
db.collection("creations").orderBy("createdAt", "desc")
.onSnapshot(snapshot => {
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
