const app = firebase.initializeApp({
  apiKey: "…",
  authDomain: "…",
  projectId: "…",
  storageBucket: "…",
  messagingSenderId: "…",
  appId: "…"
});

const db = firebase.firestore();
const storage = firebase.storage();

document.getElementById("add").onclick = async () => {
  alert("Clique détecté !");
  const name = document.getElementById("name").value;
  const file = document.getElementById("photo").files[0];
  if(!name || !file){ alert("Remplis tout !"); return; }

  const ref = storage.ref("photos/" + Date.now() + "-" + file.name);
  await ref.put(file);
  const url = await ref.getDownloadURL();
  alert("Upload OK !");

  await db.collection("creations").add({
    name, imageUrl: url, createdAt: Date.now()
  });
  alert("Création ajoutée !");
};
