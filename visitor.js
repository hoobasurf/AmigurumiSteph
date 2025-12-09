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

const gallery = document.getElementById("gallery");

// Affichage live des créations
db.collection("creations").orderBy("createdAt", "desc").onSnapshot(snapshot => {
  gallery.innerHTML = "";
  snapshot.forEach(doc => {
    const data = doc.data();
    const div = document.createElement("div");
    div.className = "gallery-item";
    div.innerHTML = `<img src="${data.imageUrl}" class="gallery-img"><p>${data.name}</p>`;
    gallery.appendChild(div);

    div.addEventListener("click", () => {
      const modal = document.getElementById("modal");
      const modalImg = document.getElementById("modal-img");
      modalImg.src = data.imageUrl;
      modal.classList.remove("hidden");
    });
  });
});
