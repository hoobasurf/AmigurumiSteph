const nameInput = document.getElementById('name');
const photoInput = document.getElementById('photo');
const addBtn = document.getElementById('add');
const list = document.getElementById('owner-list');

// --- Load existing creations ---
let creations = JSON.parse(localStorage.getItem("creations") || "[]");

// Display on load
renderCreations();

addBtn.onclick = () => {
  const name = nameInput.value.trim();
  const file = photoInput.files[0];

  if (!name || !file) {
    alert("Merci de remplir le nom et choisir une photo !");
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const imgUrl = e.target.result;

    // Save in array
    creations.push({
      name,
      img: imgUrl,
      date: Date.now()
    });

    // Save in localStorage
    localStorage.setItem("creations", JSON.stringify(creations));

    // Refresh display
    renderCreations();

    // Reset
    nameInput.value = "";
    photoInput.value = "";
  };

  reader.readAsDataURL(file);
};

// --- Function to display all creations ---
function renderCreations() {
  list.innerHTML = "";

  creations
    .sort((a, b) => b.date - a.date)
    .forEach(item => {
      const div = document.createElement('div');
      div.className = 'owner-item';
      div.innerHTML = `
        <p>${item.name}</p>
        <img src="${item.img}">
      `;
      list.appendChild(div);
    });
}
