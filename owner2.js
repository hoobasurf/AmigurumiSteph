// 🔹 Config Firebase v8
const firebaseConfig = {
  apiKey: "AIzaSyAKUqhiGi1ZHIfZRwslMIUip8ohwOiLhFA",
  authDomain: "amigurumisteph.firebaseapp.com",
  projectId: "amigurumisteph",
  storageBucket: "amigurumisteph.appspot.com",
  messagingSenderId: "175290001202",
  appId: "1:175290001202:web:a24fbb27d2726eb7d4192b"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

const nameInput = document.getElementById("name");
const photoInput = document.getElementById("photo");
const addBtn = document.getElementById("add");
const list = document.getElementById("owner-list");

// Ajouter une création
addBtn.addEventListener("click", () => {
  const file = photoInput.files[0];
  const name = nameInput.value.trim();
  if(!file || !name) return alert("Nom ou photo manquant !");

  const timestamp = Date.now();
  const storageRef = storage.ref(`creations/${timestamp}-${file.name}`);
  const uploadTask = storageRef.put(file);

  uploadTask.on("state_changed", null,
    error => alert("Erreur upload : " + error.message),
    async () => {
      const url = await uploadTask.snapshot.ref.getDownloadURL();
      await db.collection("creations").add({
        name, imageUrl: url, createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      nameInput.value = "";
      photoInput.value = "";
      addToList({name, imageUrl: url});
    });
});

// Ajouter visuellement à la liste
function addToList(data) {
  const item = document.createElement("div");
  item.className = "owner-item";
  item.innerHTML = `<p>${data.name}</p><img src="${data.imageUrl}" class="mini-img">`;
  list.prepend(item);
}

// Affichage live Firestore
db.collection("creations").orderBy("createdAt", "desc").onSnapshot(snapshot => {
  list.innerHTML = "";
  snapshot.forEach(doc => addToList(doc.data()));
});
