import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xxxx.supabase.co';
const supabaseKey = 'PUBLIC_ANON_KEY'; // clé publique pour lecture
const supabase = createClient(supabaseUrl, supabaseKey);

const list = document.getElementById("visitor-list");

async function renderVisitor() {
  list.innerHTML = "";

  // Récupérer les fichiers dans le bucket "creations"
  const { data, error } = await supabase.storage
    .from('creations')
    .list('', { limit: 100 });

  if (error) return console.error(error);

  for (let file of data) {
    const { publicURL } = supabase.storage
      .from('creations')
      .getPublicUrl(file.name);

    const div = document.createElement("div");
    div.className = "visitor-item";
    div.innerHTML = `
      <img src="${publicURL}">
      <p>${file.name}</p>
    `;
    list.appendChild(div);
  }
}

renderVisitor();
