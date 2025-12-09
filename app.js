// ---------- CONFIG Firebase (remplace si besoin) ----------
const firebaseConfig = {
  apiKey: "AIzaSyAKUqhiGi1ZHIfZRwslMIUip8ohwOiLhFA",
  authDomain: "amigurumisteph.firebaseapp.com",
  projectId: "amigurumisteph",
  storageBucket: "amigurumisteph.appspot.com",
  messagingSenderId: "175290001202",
  appId: "1:175290001202:web:b53e4255e699d65bd4192b"
};

// Init (compat global API)
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// ---------- UI refs ----------
const viewVisitor = document.getElementById("view-visitor");
const viewOwner = document.getElementById("view-owner");
const btnVisitor = document.getElementById("btn-visitor");
const btnOwner = document.getElementById("btn-owner");

const gallery = document.getElementById("gallery");
const ownerList = document.getElementById("owner-list");
const addBtn = document.getElementById("add");
const nameInput = document.getElementById("name");
const photoInput = document.getElementById("photo");

// Modals
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const modalThumbs = document.getElementById("modal-thumbs");
const closeModal = document.getElementById("close-modal");
const openComment = document.getElementById("open-comment");

const commentModal = document.getElementById("comment-modal");
const closeComment = document.getElementById("close-comment");
const sendComment = document.getElementById("send-comment");
const prenomInput = document.getElementById("prenom");
const commentaireInput = document.getElementById("commentaire");

// ---------- NAV ----------
btnVisitor.addEventListener("click", () => {
  btnVisitor.classList.add("active");
  btnOwner.classList.remove("active");
  viewVisitor.classList.remove("hidden");
  viewOwner.classList.add("hidden");
});
btnOwner.addEventListener("click", () => {
  btnOwner.classList.add("active");
  btnVisitor.classList.remove("active");
  viewOwner.classList.remove("hidden");
  viewVisitor.classList.add("hidden");
});

// ---------- OWNER: upload and list ----------
addBtn.addEventListener("click", async () => {
  // debug quick check
  try {
    alert("Clique détecté !");
  } catch(e){}

  const name = nameInput.value.trim();
  const files = Array.from(photoInput.files || []);
  if (!name || files.length === 0) {
    alert("Remplis le nom et choisis une image !");
    return;
  }

  try {
    // upload all files, gather URLs
    const urls = [];
    for (let f of files) {
      const path = "photos/" + Date.now() + "-" + f.name;
      const ref = storage.ref(path);
      await ref.put(f);
      const url = await ref.getDownloadURL();
      urls.push(url);
    }

    // add doc
    await db.collection("creations").add({
      name,
      imageUrls: urls,
      createdAt: Date.now()
    });

    // reset ui
    nameInput.value = "";
    photoInput.value = "";
    // reload owner list will be automatic via snapshot
  } catch (err) {
    console.error(err);
    alert("Erreur lors de l'ajout : " + (err && err.message ? err.message : ""));
  }
});

// owner list realtime
db.collection("creations").orderBy("createdAt").onSnapshot(snapshot => {
  // update owner list
  ownerList.innerHTML = "";
  snapshot.docs.slice().reverse().forEach(doc => {
    const data = doc.data();
    const wrap = document.createElement("div");
    wrap.className = "owner-item";
    const first = (data.imageUrls && data.imageUrls[0]) || "";
    wrap.innerHTML = `
      <img src="${first}" alt="${data.name}">
      <div class="owner-name">${escapeHtml(data.name)}</div>
      <div style="text-align:center;margin-top:8px;">
        <button class="validate-btn delete-local" data-id="${doc.id}">Supprimer</button>
      </div>
    `;
    ownerList.appendChild(wrap);
  });

  // attach delete handlers
  document.querySelectorAll(".delete-local").forEach(b => {
    b.onclick = async (e) => {
      const id = e.currentTarget.getAttribute("data-id");
      if (!confirm("Supprimer cette création ?")) return;
      await db.collection("creations").doc(id).delete();
    };
  });
});

// ---------- VISITOR: gallery realtime ----------
db.collection("creations").orderBy("createdAt").onSnapshot(snapshot => {
  gallery.innerHTML = "";
  snapshot.docs.forEach(doc => {
    const data = doc.data();
    const div = document.createElement("div");
    div.className = "gallery-item";
    const thumb = (data.imageUrls && data.imageUrls[0]) || "";
    div.innerHTML = `
      <img src="${thumb}" alt="${escapeHtml(data.name)}">
      <div class="gallery-info">
        <span>${escapeHtml(data.name)}</span>
      </div>
    `;
    div.onclick = () => openModalWithData(data, doc.id);
    gallery.appendChild(div);
  });
});

// ---------- MODAL behavior ----------
function openModalWithData(data, docId) {
  modal.classList.remove("hidden");
  modalImg.src = (data.imageUrls && data.imageUrls[0]) || "";
  modalThumbs.innerHTML = "";
  if (data.imageUrls && data.imageUrls.length > 1) {
    data.imageUrls.forEach((u, i) => {
      const img = document.createElement("img");
      img.src = u; if (i === 0) img.classList.add("active");
      img.onclick = () => {
        modalImg.src = u;
        modalThumbs.querySelectorAll("img").forEach(t => t.classList.remove("active"));
        img.classList.add("active");
      };
      modalThumbs.appendChild(img);
    });
  }
  // prepare comment send: store docId in attribute
  sendComment.setAttribute("data-doc", docId);
}

closeModal.onclick = () => modal.classList.add("hidden");
document.getElementById("modal-overlay").onclick = () => modal.classList.add("hidden");

// COMMENTS modal
openComment.onclick = () => commentModal.classList.remove("hidden");
closeComment.onclick = () => commentModal.classList.add("hidden");
document.getElementById("comment-overlay").onclick = () => commentModal.classList.add("hidden");

// send comment
sendComment.onclick = async () => {
  const docId = sendComment.getAttribute("data-doc");
  const prenom = prenomInput.value.trim();
  const text = commentaireInput.value.trim();
  if (!prenom || !text) { alert("Prénom et message requis"); return; }
  await db.collection("creations").doc(docId).collection("comments").add({
    prenom, text, createdAt: Date.now()
  });
  prenomInput.value = ""; commentaireInput.value = "";
  commentModal.classList.add("hidden");
  alert("Commentaire envoyé !");
};

// helper escape
function escapeHtml(s){
  return String(s || "").replace(/[&<>"']/g, function(m){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]; });
}
