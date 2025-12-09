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

// 🔹 Upload et ajout
addBtn.onclick = async () => {
  const file = photoInput.files[0];
  const name = nameInput.value.trim();
  if (!file || !name) { alert("Remplis le nom et choisis une photo !"); return; }

  try {
    const timestamp = Date.now();
    const storageRef = storage.ref(`creations/${timestamp}-${file.name}`);
    const uploadTask = storageRef.put(file);

    uploadTask.on("state_changed", null,
      (err) => alert("Erreur upload : " + err.message),
      async () => {
        const url = await uploadTask.snapshot.ref.getDownloadURL();
        await db.collection("creations").add({
          name: name,
          imageUrl: url,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Reset champs
        nameInput.value = "";
        photoInput.value = "";

        // Affichage immédiat
        const item = document.createElement("div");
        item.className = "owner-item";
        item.innerHTML = `<p>${name}</p><img src="${url}" class="mini-img">`;
        list.prepend(item);
      }
    );

  } catch (err) {
    alert("Erreur : " + err.message);
  }
};

// 🔹 Affichage live Firestore
db.collection("creations")
  .orderBy("createdAt", "desc")
  .onSnapshot(snapshot => {
    list.innerHTML = "";
    snapshot.forEach(doc => {
      const data = doc.data();
      const item = document.createElement("div");
      item.className = "owner-item";
      item.innerHTML = `<p>${data.name}</p><img src="${data.imageUrl}" class="mini-img">`;
      list.appendChild(item);
    });
  });
