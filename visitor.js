// --- CONFIG SUPABASE ---
const SUPABASE_URL = "https://iubbxvipgofxasatmvzg.supabase.co";
const SUPABASE_KEY = "sb_secret_pZQyjv-VVblqYWji7tKSTQ_9lr7E4MD";
const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// DOM
const carousel = document.getElementById("carousel");
let slides = [];
let currentIndex = 0;

// --- LOAD GALLERY ---
async function loadGallery() {
  console.log("Chargement des images…");

  const { data, error } = await client.storage.from("creations").list("", { limit: 100 });
  if (error) {
    console.error("Erreur LIST :", error.message);
    return;
  }

  console.log("Fichiers trouvés :", data.length);

  data.forEach(file => {
    const url = `${SUPABASE_URL}/storage/v1/object/public/creations/${file.name}`;
    const div = document.createElement("div");
    div.className = "slide";
    div.innerHTML = `<img src="${url}" alt=""><p>${file.name}</p>`;
    carousel.appendChild(div);
    slides.push(div);
  });

  if (slides.length > 0) updateCarousel();
  console.log("Affichage terminé.");
}

// --- UPDATE CAROUSEL ---
function updateCarousel() {
  slides.forEach((slide, i) => {
    slide.classList.remove("active");
  });
  slides[currentIndex].classList.add("active");

  // Centre le carousel sur l'image active
  const offset = slides[currentIndex].offsetLeft - carousel.parentElement.offsetWidth/2 + slides[currentIndex].offsetWidth/2;
  carousel.style.transform = `translateX(${-offset}px)`;
}

// --- NAVIGATION TACTILE / AUTO ---
let startX = 0;
carousel.addEventListener("touchstart", e => { startX = e.touches[0].clientX; });
carousel.addEventListener("touchend", e => {
  const endX = e.changedTouches[0].clientX;
  if (endX < startX - 20) nextSlide();
  else if (endX > startX + 20) prevSlide();
});

function nextSlide() {
  currentIndex = (currentIndex + 1) % slides.length;
  updateCarousel();
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  updateCarousel();
}

// --- LANCEMENT ---
loadGallery();
