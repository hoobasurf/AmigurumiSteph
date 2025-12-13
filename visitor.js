const list = document.getElementById("visitor-list");

// Charger les créations depuis localStorage (même stockage que owner)
const creations = JSON.parse(localStorage.getItem("creations") || "[]");

function renderVisitor() {
  list.innerHTML = "";

  creations.forEach(item => {
    const div = document.createElement("div");
    div.className = "visitor-item";

    div.innerHTML = `
      <img src="${item.imgUrl}">
      <p>${item.name}</p>
    `;

    list.appendChild(div);
  });
}

renderVisitor();
