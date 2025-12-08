// ⚡ Config Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAKUqhiGi1ZHIfZRwslMIUip8ohwOiLhFA",
  authDomain: "amigurumisteph.firebaseapp.com",
  projectId: "amigurumisteph",
  storageBucket: "amigurumisteph.appspot.com",
  messagingSenderId: "175290001202",
  appId: "1:175290001202:web:b53e4255e699d65bd4192b"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

const gallery = document.getElementById("gallery");

// Chargement en temps réel
db.collection("creations").orderBy("createdAt").onSnapshot(snapshot => {
  gallery.innerHTML = "";

  snapshot.docs.forEach(docu => {
    const data = docu.data();
    const div = document.createElement("div");
    div.className = "gallery-item";

    div.innerHTML = `
      <img src="${data.imageUrl}" class="gallery-thumb">
      <div class="gallery-info">
        <span class="gallery-name">${data.name}</span>
        <span class="like-count">❤️ 0</span>
        <span class="comment-count">💬 0</span>
      </div>
    `;

    div.querySelector(".gallery-thumb").onclick = () => {
      openModal(data);
    };

    gallery.appendChild(div);
  });
});

// Modal photo + commentaires
function openModal(data) {
  const modal = document.getElementById("modal");
  const modalImg = document.getElementById("modal-img");
  modalImg.src = data.imageUrl;
  modal.classList.remove("hidden");

  document.getElementById("close-modal").onclick = () => {
    modal.classList.add("hidden");
  };

  document.getElementById("comment-btn").onclick = () => {
    document.getElementById("comment-modal").classList.remove("hidden");
    document.getElementById("close-comment").onclick = () => {
      document.getElementById("comment-modal").classList.add("hidden");
    };
  };
}
