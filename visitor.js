import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://iubbxvipgofxasatmvzg.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_GDoZmwIdoP28XOdrfYYVNw_E_HiCQB1'; // ta clé publique

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const gallery = document.getElementById('gallery');
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const closeModal = document.getElementById('close-modal');

// Charger les créations depuis Supabase
async function loadCreations() {
  const { data, error } = await supabase
    .from('creations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    gallery.innerHTML = '<p>Erreur lors du chargement des créations</p>';
    return;
  }

  gallery.innerHTML = '';
  data.forEach(item => {
    const div = document.createElement('div');
    div.className = 'gallery-item';
    div.innerHTML = `
      <p>${item.name}</p>
      <img src="${item.image_url}" alt="${item.name}">
    `;

    // Click pour ouvrir modal
    div.querySelector('img').addEventListener('click', () => {
      modalImg.src = item.image_url;
      modal.classList.add('active');
    });

    gallery.appendChild(div);
  });
}

// Fermer modal
closeModal.addEventListener('click', () => {
  modal.classList.remove('active');
  modalImg.src = '';
});

loadCreations();
