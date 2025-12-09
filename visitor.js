const gallery = document.getElementById("gallery");

db.collection("creations").orderBy("createdAt","desc").onSnapshot(snap => {
  gallery.innerHTML = "";
  snap.forEach(doc => {
    const data = doc.data();
    const div = document.createElement("div");
    div.className = "gallery-item";
    div.innerHTML = `
      <img src="${data.imageUrl}" class="gallery-img">
      <p>${data.name}</p>
    `;
    gallery.appendChild(div);
  });
});
