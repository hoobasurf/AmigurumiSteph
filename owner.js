import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// ⚡ Remplace par tes infos Supabase
const supabaseUrl = 'VOTRE_SUPABASE_URL';
const supabaseKey = 'VOTRE_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

// ---------------- SIDEBAR ----------------
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}
window.showSection = showSection;

// ---------------- VIDEOS ----------------
const addVideoBtn = document.getElementById('addVideo');
const videoList = document.getElementById('video-list');

addVideoBtn.onclick = async () => {
  const url = document.getElementById('video-url').value.trim();
  const title = document.getElementById('video-title').value.trim();
  const transcription = document.getElementById('video-transcription').value.trim();
  const progress = document.getElementById('video-progress').value.trim();
  if(!url) return alert("URL obligatoire");

  await supabase.from('videos').insert([{ url, title, transcription, progress }]);
  document.getElementById('video-url').value = '';
  document.getElementById('video-title').value = '';
  document.getElementById('video-transcription').value = '';
  document.getElementById('video-progress').value = '';
  renderVideos();
};

async function renderVideos() {
  const { data } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
  videoList.innerHTML = '';
  data.forEach(v => {
    const div = document.createElement('div');
    div.className = 'video-item';
    div.innerHTML = `
      <div class="delete-btn" data-id="${v.id}">×</div>
      <iframe width="200" height="113" src="https://www.youtube.com/embed/${getYoutubeId(v.url)}" frameborder="0" allowfullscreen></iframe>
      <p><b>${v.title}</b></p>
      <p>${v.transcription}</p>
      <p>Progression: ${v.progress}</p>
    `;
    videoList.appendChild(div);
  });
}
function getYoutubeId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length==11) ? match[2] : null;
}
videoList.addEventListener("click", async (e)=>{
  if(e.target.classList.contains("delete-btn")){
    const id = e.target.dataset.id;
    await supabase.from('videos').delete().eq('id',id);
    renderVideos();
  }
});
renderVideos();

// ---------------- MAILLES ----------------
const mailleName = document.getElementById('maille-name');
const mailleCount = document.getElementById('maille-count');
const incrementBtn = document.getElementById('increment-maille');
const decrementBtn = document.getElementById('decrement-maille');
const resetBtn = document.getElementById('reset-maille');

incrementBtn.onclick = () => mailleCount.value = parseInt(mailleCount.value)+1;
decrementBtn.onclick = () => mailleCount.value = Math.max(0, parseInt(mailleCount.value)-1);
resetBtn.onclick = () => mailleCount.value = 0;

// ---------------- PELOTES ----------------
const addPeloteBtn = document.getElementById('addPelote');
const peloteList = document.getElementById('pelote-list');

addPeloteBtn.onclick = async () => {
  const file = document.getElementById('pelote-photo').files[0];
  const name = document.getElementById('pelote-name').value.trim();
  const marque = document.getElementById('pelote-marque').value.trim();
  const ref = document.getElementById('pelote-ref').value.trim();
  const qty = parseInt(document.getElementById('pelote-qty').value)||0;
  if(!file || !name) return alert('Nom et photo obligatoires');

  const { data: uploadData } = await supabase.storage.from('pelotes').upload(`${Date.now()}_${file.name}`, file);
  const photoUrl = supabase.storage.from('pelotes').getPublicUrl(uploadData.path).publicUrl;

  await supabase.from('pelotes').insert([{ name, marque, ref_couleur: ref, quantite: qty, photo_url: photoUrl }]);
  document.getElementById('pelote-name').value = '';
  document.getElementById('pelote-marque').value = '';
  document.getElementById('pelote-ref').value = '';
  document.getElementById('pelote-qty').value = '';
  document.getElementById('pelote-photo').value = '';
  renderPelotes();
};

async function renderPelotes() {
  const { data } = await supabase.from('pelotes').select('*').order('created_at', { ascending: false });
  peloteList.innerHTML='';
  data.forEach(p=>{
    const div = document.createElement('div');
    div.className='pelote-item';
    div.innerHTML=`
      <div class="delete-btn" data-id="${p.id}">×</div>
      <img src="${p.photo_url}" alt="">
      <p><b>${p.name}</b></p>
      <p>${p.marque} / ${p.ref_couleur}</p>
      <p>Quantité: ${p.quantite}</p>
    `;
    peloteList.appendChild(div);
  });
}
peloteList.addEventListener("click", async (e)=>{
  if(e.target.classList.contains("delete-btn")){
    const id = e.target.dataset.id;
    await supabase.from('pelotes').delete().eq('id',id);
    renderPelotes();
  }
});
renderPelotes();

// ---------------- NOTES ----------------
const addNoteBtn = document.getElementById('addNote');
const noteList = document.getElementById('note-list');

addNoteBtn.onclick = async () => {
  const file = document.getElementById('note-photo').files[0];
  const title = document.getElementById('note-title').value.trim();
  const content = document.getElementById('note-content').value.trim();
  if(!title) return alert('Titre obligatoire');

  let photoUrl = null;
  if(file){
    const { data: uploadData } = await supabase.storage.from('notes').upload(`${Date.now()}_${file.name}`, file);
    photoUrl = supabase.storage.from('notes').getPublicUrl(uploadData.path).publicUrl;
  }

  await supabase.from('notes').insert([{ title, content, image_url: photoUrl }]);
  document.getElementById('note-title').value = '';
  document.getElementById('note-content').value = '';
  document.getElementById('note-photo').value = '';
  renderNotes();
};

async function renderNotes() {
  const { data } = await supabase.from('notes').select('*').order('created_at', { ascending:false });
  noteList.innerHTML='';
  data.forEach(n=>{
    const div = document.createElement('div');
    div.className='note-item';
    div.innerHTML=`
      <div class="delete-btn" data-id="${n.id}">×</div>
      ${n.image_url?`<img src="${n.image_url}" alt="">`:''}
      <p><b>${n.title}</b></p>
      <p>${n.content}</p>
    `;
    noteList.appendChild(div);
  });
}

noteList.addEventListener("click", async (e)=>{
  if(e.target.classList.contains("delete-btn")){
    const id = e.target.dataset.id;
    await supabase.from('notes').delete().eq('id', id);
    renderNotes();
  }
});
renderNotes();

// ---------------- PARAMETRES / SAUVEGARDE ----------------
document.getElementById('exportData').onclick = () => {
  const dataStr = JSON.stringify({
    creations: JSON.parse(localStorage.getItem("creations") || "[]")
  }, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = "crochet_data.json";
  a.click();
};

document.getElementById('importData').onclick = () => {
  const file = document.getElementById('importFile').files[0];
  if(!file) return alert("Choisir un fichier à importer");
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = JSON.parse(e.target.result);
    if(data.creations) {
      localStorage.setItem("creations", JSON.stringify(data.creations));
      window.dispatchEvent(new Event('storage')); // pour re-render si besoin
    }
    alert("Import terminé !");
  };
  reader.readAsText(file);
};
