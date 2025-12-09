import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://iubbxvipgofxasatmvzg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1YmJ4dmlwZ29meGFzYXRtdnpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyODg1NzgsImV4cCI6MjA4MDg2NDU3OH0.cg6AbfQ-av-nyEtAdWetdRjHSKaYJUw2QY2kgCFgkVs';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const list = document.getElementById('visitor-list');

function addToList(item) {
  const div = document.createElement('div');
  div.className = 'visitor-item';
  div.innerHTML = `<p>${item.name}</p><img src="${item.image_url}" class="mini-img">`;
  list.prepend(div);
}

// Charger les créations existantes
async function loadCreations() {
  const { data, error } = await supabase
    .from('creations')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return console.error(error);
  list.innerHTML = '';
  data.forEach(addToList);
}
loadCreations();
