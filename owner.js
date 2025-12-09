// 🔹 Config Firebase
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};

// 🔹 Initialisation Firebase v8
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// 🔹 Éléments HTML
const nameInput = document.getElementById("name");
const photoInput = document.getElementById("photo");
const list = document.getElementById("owner-list");

// 🔹 Upload automatique dès qu’on choisit une photo
photoInput.addEventListener("change", async () => {
  const file = photoInput.files[0];
  const name = nameInput.value.trim();
  if (!file || !name) return alert("Merci de remplir le nom et choisir une photo !");

  const timestamp = Date.now();
  const storageRef = storage.ref(`creations/${timestamp}-${file.name}`);
  const uploadTask = storageRef.put(file);

  uploadTask.on(
    "state_changed",
    null,
    (error) => alert("Erreur upload : " + error.message),
    async () => {
      const url = await uploadTask.snapshot.ref.getDownloadURL();
      await db.collection("creations").add({
        name,
        imageUrl: url,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      nameInput.value = "";
      photoInput.value = "";
      addToList({ name, imageUrl: url });
    }
  );
});

function addToList(data) {
  const item = document.createElement("div");
  item.className = "owner-item";
  item.innerHTML = `<p>${data.name}</p><img src="${data.imageUrl}" class="mini-img">`;
  list.prepend(item);
}

// 🔹 Affichage live Firestore
db.collection("creations").orderBy("createdAt", "desc")
  .onSnapshot(snapshot => {
    list.innerHTML = "";
    snapshot.forEach(doc => addToList(doc.data()));
  });
