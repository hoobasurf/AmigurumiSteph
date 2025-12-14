// visitor.js

// Assure-toi que ce script est chargé **après le HTML**, dans le <div id="app">

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = "https://iubbxvipgofxasatmvzg.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_GDoZmwIdoP28XOdrfYYVNw_E_HiCQB1";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const app = document.getElementById('app');

// Container pour les créations
const listContainer = document.createElement('div');
listContainer.id = 'visitor-list';
listContainer.style.display = 'flex';
listContainer.style.flexWrap = 'wrap';
listContainer.style.justifyContent = 'center';
listContainer.style.gap = '15px';
listContainer.style.padding = '20px';
app.appendChild(listContainer);

// Gestion des vues : carousel, grid, list
let currentView = 'grid';

function setView(view) {
  currentView = view;
  renderCreations();
}

// Charger les créations depuis le bucket Supabase
async function loadCreations() {
  try {
    const { data, error } = await supabase.storage.from('owners').list();
    if (error) throw error;

    const creations = data.map(item => ({
      name: item.name,
      imgUrl: supabase.storage.from('owners').getPublicUrl(item.name).publicURL
    }));

    window.visitorCreations = creations; // stock global pour re-render
    renderCreations();
  } catch (err) {
    console.error('Erreur Supabase:', err);
  }
}

function renderCreations() {
  const creations = window.visitorCreations || [];
  listContainer.innerHTML = '';

  creations.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'visitor-item';
    div.style.border = '2px solid #b67385';
    div.style.borderRadius = '16px';
    div.style.padding = '8px';
    div.style.textAlign = 'center';
    div.style.background = '#ffe6f0';
    div.style.cursor = 'pointer';
    div.style.transition = 'transform 0.2s ease';

    const img = document.createElement('img');
    img.src = item.imgUrl;
    img.alt = item.name;
    img.style.width = currentView === 'carousel' ? '260px' :
                      currentView === 'grid' ? '200px' : '140px';
    img.style.height = img.style.width;
    img.style.objectFit = 'cover';
    img.style.borderRadius = '12px';
    img.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
    img.onmouseover = () => {
      img.style.transform = 'scale(1.05)';
      img.style.boxShadow = '0 8px 20px rgba(184,76,111,0.3)';
    };
    img.onmouseout = () => {
      img.style.transform = 'scale(1)';
      img.style.boxShadow = 'none';
    };

    const p = document.createElement('p');
    p.textContent = item.name;
    p.style.marginTop = '6px';
    p.style.fontWeight = 'bold';
    p.style.color = '#8b3a3a';

    div.appendChild(img);
    div.appendChild(p);
    listContainer.appendChild(div);
  });
}

// Boutons pour changer la vue
const viewControls = document.createElement('div');
viewControls.style.display = 'flex';
viewControls.style.justifyContent = 'center';
viewControls.style.gap = '10px';
viewControls.style.marginBottom = '12px';

['carousel', 'grid', 'list'].forEach(view => {
  const btn = document.createElement('button');
  btn.textContent = view.charAt(0).toUpperCase() + view.slice(1);
  btn.style.padding = '8px 16px';
  btn.style.borderRadius = '12px';
  btn.style.border = '2px solid #b84c6f';
  btn.style.background = '#ffe6f0';
  btn.style.color = '#8b3a3a';
  btn.style.fontWeight = 'bold';
  btn.style.cursor = 'pointer';
  btn.onclick = () => setView(view);
  viewControls.appendChild(btn);
});

app.prepend(viewControls);

// Initialisation
loadCreations();
