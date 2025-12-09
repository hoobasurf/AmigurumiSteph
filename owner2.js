// 🔹 Config Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAKUqhiGi1ZHIfZRwslMIUip8ohwOiLhFA",
  authDomain: "amigurumisteph.firebaseapp.com",
  projectId: "amigurumisteph",
  storageBucket: "amigurumisteph.appspot.com",
  messagingSenderId: "175290001202",
  appId: "1:175290001202:web:b53e4255e699d65bd4192b"
};

// 🔹 Initialisation Firebase v8
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// 🔹 Éléments HTML
const nameInput = document.getElementById("name");
const photoInput = document.getElementById("photo");
const addBtn = document.getElementById("add");
const list = document.getElementById("owner-list");

// 🔹 Ajouter la création
addBtn.addEventListener("click", async () => {
  const file = photoInput.files[0];
  const name = nameInput.value.trim();

  if (!file || !name) {
    alert("Merci de remplir le nom et choisir une photo !");
    return;
  }

  try {
    const timestamp = Date.now();
    const storageRef = storage.ref(`creations/${timestamp}-${file.name}`);
    const uploadTask = storageRef.put(file);

    uploadTask.on(
      "state_changed",
      null,
      (error) => {
        console.error(error);
        alert("Erreur upload : " + error.message);
      },
      async () => {
        const url = await uploadTask.snapshot.ref.getDownloadURL();

        // Ajouter dans Firestore
        await db.collection("creations").add({
          name: name,
          imageUrl: url,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Reset champs
        nameInput.value = "";
        photoInput.value = "";

        // Affichage instantané
        addToList({ name, imageUrl: url });
      }
    );
  } catch (err) {
    console.error(err);
    alert("Erreur : " + err.message);
  }
});

// 🔹 Fonction affichage liste
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
db.collection("creations")
  .orderBy("createdAt", "desc")
  .onSnapshot(snapshot => {
    list.innerHTML = "";
    snapshot.forEach(doc => addToList(doc.data()));
  });
