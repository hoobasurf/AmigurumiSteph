// Connexion Firebase via CDN
const db = firebase.firestore();
const storage = firebase.storage();

// Sélecteurs
const nameInput = document.getElementById("nameInput");
const photoInput = document.getElementById("photoInput");
const addBtn = document.getElementById("addBtn");
const creationList = document.getElementById("creationList");

// --- CLICK AJOUTER ---
addBtn.onclick = async () => {

    const name = nameInput.value.trim();
    const file = photoInput.files[0];

    if (!name || !file) {
        alert("Nom + Photo obligatoires");
        return;
    }

    // Upload Storage
    const path = `creations/${Date.now()}_${file.name}`;
    const ref = storage.ref().child(path);
    await ref.put(file);
    const url = await ref.getDownloadURL();

    // Enregistrer dans Firestore
    await db.collection("creations").add({
        name: name,
        image: url,
        createdAt: Date.now()
    });

    nameInput.value = "";
    photoInput.value = "";

    alert("Création ajoutée !");
};


// --- AFFICHAGE AUTOMATIQUE DES PROJETS ---
db.collection("creations")
  .orderBy("createdAt", "desc")
  .onSnapshot(snapshot => {

    creationList.innerHTML = "";

    snapshot.forEach(doc => {
        const data = doc.data();

        creationList.innerHTML += `
            <div class="creation-item">
                <img src="${data.image}" class="thumb">
                <p>${data.name}</p>
            </div>
        `;
    });
});
