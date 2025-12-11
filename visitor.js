// --- CONFIG SUPABASE ---
const SUPABASE_URL = "https://iubbxvipgofxasatmvzg.supabase.co";
const SUPABASE_KEY = "sb_secret_pZQyjv-VVblqYWji7tKSTQ_9lr7E4MD";
const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// DOM
const carousel = document.getElementById("carousel");
const dotsContainer = document.getElementById("dots");

let slides = [];
let currentIndex = 0;

// --- CHARGEMENT DES IMAGES ---
async function loadGallery() {
  console.log("Chargement des images…");

  const { data, error } = await client
    .storage
    .from("creations")
    .list("", { limit: 100 });

  if (error) {
    console.error("Erreur LIST : " + error.message);
    return;
  }

  console.log("Fichiers trouvés :", data.length);

  // Création des slides
  data.forEach((file, i) => {
    const url = `${SUPABASE_URL}/storage/v1/object/public/creations/${file.name}`;

    const div = document.createElement("div");
    div.className = "slide";
    div.innerHTML = `<img src="${url}" alt=""><p>${file.name}</p>`;
    carousel.appendChild(div);
    slides.push(div);

    // Dots
    const dot = document.createElement("span");
    dot.className = "dot";
    dot.addEventListener("click", () => showSlide(i));
    dotsContainer.appendChild(dot);
  });

  if (slides.length > 0) showSlide(0);
  console.log("Affichage terminé.");
}

// --- NAVIGATION ---
function showSlide(index) {
  slides.forEach((s, i) => {
    s.style.display = i === index ? "block" : "none";
    dotsContainer.children[i].className = i === index ? "dot active-dot" : "dot";
  });
  currentIndex = index;
}

function nextSlide() {
  showSlide((currentIndex + 1) % slides.length);
}

function prevSlide() {
  showSlide((currentIndex - 1 + slides.length) % slides.length);
}

// Flèches
const prevBtn = document.createElement("button");
prevBtn.className = "prev";
prevBtn.innerHTML = "&#10094;";
prevBtn.onclick = prevSlide;
carousel.appendChild(prevBtn);

const nextBtn = document.createElement("button");
nextBtn.className = "next";
nextBtn.innerHTML = "&#10095;";
nextBtn.onclick = nextSlide;
carousel.appendChild(nextBtn);

// --- LANCEMENT ---
loadGallery();
