const nameInput = document.getElementById("name");
const photoInput = document.getElementById("photo");
const list = document.getElementById("owner-list");

// Upload automatique dès que la photo est choisie
photoInput.addEventListener("change", async () => {
  const file = photoInput.files[0];
  const name = nameInput.value.trim();
  if (!file || !name) return alert("Nom et photo requis !");

  try {
    const timestamp = Date.now();
    const storageRef = storage.ref(`creations/${timestamp}-${file.name}`);
    const uploadTask = storageRef.put(file);

    uploadTask.on("state_changed", null,
      error => alert("Erreur upload : " + error.message),
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
  } catch(e) { alert(e.message); }
});

// Ajouter visuellement dans la liste
function addToList(data){
  const div = document.createElement("div");
  div.className = "owner-item";
  div.innerHTML = `<p>${data.name}</p><img src="${data.imageUrl}" class="mini-img">`;
  list.prepend(div);
}

// Affichage live Firestore
db.collection("creations").orderBy("createdAt", "desc").onSnapshot(snap => {
  list.innerHTML = "";
  snap.forEach(doc => addToList(doc.data()));
});
