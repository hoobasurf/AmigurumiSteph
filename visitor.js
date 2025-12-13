const list = document.getElementById("visitor-list");

// Sécurité : si l’élément n’existe pas, on stop
if (!list) {
  console.error("❌ #visitor-list introuvable dans le HTML");
} else {

  // Récupération des créations (même clé que owner)
  const creations = JSON.parse(localStorage.getItem("creations") || "[]");

  function renderVisitor() {
    list.innerHTML = "";

    if (creations.length === 0) {
      list.innerHTML = "<p style='color:#b84c6f;text-align:center;'>Aucune création pour le moment</p>";
      return;
    }

    creations.forEach(item => {
      const div = document.createElement("div");
      div.className = "visitor-item";

      const img = document.createElement("img");
      img.src = item.imgUrl;
      img.alt = item.name || "Création";

      const name = document.createElement("p");
      name.textContent = item.name || "";

      div.appendChild(img);
      div.appendChild(name);
      list.appendChild(div);
    });
  }

  renderVisitor();
}
