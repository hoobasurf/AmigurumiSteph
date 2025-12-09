// 🔹 Config Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAKUqhiGi1ZHIfZRwslMIUip8ohwOiLhFA",
  authDomain: "amigurumisteph.firebaseapp.com",
  projectId: "amigurumisteph",
  storageBucket: "amigurumisteph.appspot.com",
  messagingSenderId: "175290001202",
  appId: "1:175290001202:web:b53e4255e699d65bd4192b"
};

// 🔹 Initialisation Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// 🔹 Éléments HTML
const nameInput = document.getElementById("name");
const photoInput = document.getElementById("photo");
const list = document.getElementById("owner-list");

// 🔹 Upload et affichage
photoInput.addEventListener("change", async () => {
  const file = photoInput.files[0];
  const name = nameInput.value.trim();

  if (!file || !name) {
    alert("Merci de remplir le nom et choisir une photo !");
    return;
  }

  try {
    // 1️⃣ Crée la référence Storage unique
    const timestamp = Date.now();
    const storageRef = storage.ref().child(`creations/${timestamp}-${file.name}`);

    // 2️⃣ Upload
    const uploadTask = storageRef.put(file);

    // 3️⃣ Listener pour mobile
    uploadTask.on(
      "state_changed",
      null,
      error => {
        console.error(error);
        alert("Erreur lors de l'upload : " + error.message);
      },
      async () => {
        // 4️⃣ Quand upload terminé, récupérer URL
        const url = await uploadTask.snapshot.ref.getDownloadURL();

        // 5️⃣ Ajouter dans Firestore
        const docRef = await db.collection("creations").add({
          name: name,
          imageUrl: url,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        // 6️⃣ Reset champs
        nameInput.value = "";
        photoInput.value = "";

        // ✅ Affichage immédiat
        addToList({ name, imageUrl: url });
      }
    );

  } catch (err) {
    console.error(err);
    alert("Erreur : " + err.message);
  }
});

// 🔹 Fonction pour ajouter visuellement à la liste sans attendre snapshot
function addToList(data) {
  const item = document.createElement("div");
  item.className = "owner-item";
  item.innerHTML = `
    <p>${data.name}</p>
    <img src="${data.imageUrl}" class="mini-img">
  `;
  list.prepend(item);
}

// 🔹 Affichage live Firestore
db.collection("creations").orderBy("createdAt", "desc")
  .onSnapshot(snapshot => {
    list.innerHTML = "";
    snapshot.forEach(doc => {
      addToList(doc.data());
    });
});
