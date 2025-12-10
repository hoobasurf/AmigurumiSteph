const gallery = document.getElementById("gallery");

const saved = JSON.parse(localStorage.getItem("creations") || "[]");

saved.forEach(item => {
  const div = document.createElement("div");
  div.className = "item";
  div.innerHTML = `
    <p>${item.name}</p>
    <img src="${item.imgUrl}">
  `;
  gallery.appendChild(div);
});
