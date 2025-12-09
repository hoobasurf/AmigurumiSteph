import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// --- Configure Supabase ---
const SUPABASE_URL = 'https://iubbxvipgofxasatmvzg.supabase.co';
const SUPABASE_ANON_KEY = 'TA_CLE_ANON_ICI';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- Éléments HTML ---
const gallery = document.getElementById('gallery');
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const thumbnails = document.getElementById('thumbnails');
const commentModal = document.getElementById('comment-modal');
const commentBtn = document.getElementById('comment-btn');
const closeModalBtn = document.getElementById('close-modal');
const closeCommentBtn = document.getElementById('close-comment');

// --- Charger créations ---
async function loadCreations() {
  const { data, error } = await supabase
    .from('creations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return console.error(error);
  gallery.innerHTML = '';

  data.forEach(item => {
    const div = document.createElement('div');
    div.className = 'gallery-item';
    div.innerHTML = `
      <img src="${item.image_url}" alt="${item.name}" class="thumb-img">
      <p>${item.name}</p>
    `;
    div.addEventListener('click', () => openModal(item));
    gallery.appendChild(div);
  });
}

// --- Ouvrir modal ---
function openModal(item) {
  modal.classList.remove('hidden');
  modalImg.src = item.image_url;

  thumbnails.innerHTML = '';
  // Ici tu pourrais ajouter d'autres images du projet si dispo
  const thumb = document.createElement('img');
  thumb.src = item.image_url;
  thumb.className = 'thumb-mini';
  thumb.addEventListener('click', () => modalImg.src = item.image_url);
  thumbnails.appendChild(thumb);
}

// --- Fermer modal ---
closeModalBtn.addEventListener('click', () => modal.classList.add('hidden'));

// --- Bouton commentaire ---
commentBtn.addEventListener('click', () => {
  commentModal.classList.remove('hidden');
});

// --- Fermer commentaire ---
closeCommentBtn.addEventListener('click', () => commentModal.classList.add('hidden'));

// --- Initialisation ---
loadCreations();
