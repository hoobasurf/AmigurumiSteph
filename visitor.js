// visitor.js
// Initialisation Supabase
const SUPABASE_URL = "https://iubbxvipgofxasatmvzg.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_GDoZmwIdoP28XOdrfYYVNw_E_HiCQB1";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Éléments DOM
const list = document.getElementById('visitor-list');
const modal = document.getElementById('modal');
const modalMain = document.getElementById('modalMain');
const thumbs = document.getElementById('thumbsContainer');
const heart = document.getElementById('heart');
const likeCount = document.getElementById('likeCount');
const commentList = document.getElementById('commentsList');
const commentFormBg = document.getElementById('commentFormBg');
const commentName = document.getElementById('commentName');
const commentText = document.getElementById('commentText');

let creations = [];
let currentIndex = null;
let currentView = 'carousel';

// Escape HTML
function escapeHtml(s) {
    return s ? String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') : '';
}

// Charger les images depuis Supabase
async function loadCreationsFromBucket() {
    try {
        const { data, error } = await supabaseClient.storage.from('owners').list();
        if (error) { console.error(error); return; }

        creations = data.map(item => ({
            name: item.name,
            imgUrl: supabaseClient.storage.from('owners').getPublicUrl(item.name).publicURL
        }));

        renderVisitor();
    } catch (err) {
        console.error(err);
    }
}

// Rendu des images
function renderVisitor() {
    list.innerHTML = '';
    list.className = currentView + '-view';

    creations.forEach((item, i) => {
        const div = document.createElement('div');
        div.className = 'visitor-item';
        div.setAttribute('data-index', i);
        div.innerHTML = `<img src="${item.imgUrl}" alt="${escapeHtml(item.name)}"><p>${escapeHtml(item.name)}</p>`;
        div.addEventListener('click', () => openModal(i));
        list.appendChild(div);
    });

    updateCenter();
}

// Changement de vue
function setView(mode) {
    currentView = mode;
    document.getElementById('btnCarousel').classList.toggle('active', mode==='carousel');
    document.getElementById('btnGrid').classList.toggle('active', mode==='grid');
    document.getElementById('btnList').classList.toggle('active', mode==='list');
    renderVisitor();
}

document.getElementById('btnCarousel').addEventListener('click', () => setView('carousel'));
document.getElementById('btnGrid').addEventListener('click', () => setView('grid'));
document.getElementById('btnList').addEventListener('click', () => setView('list'));

// Centre des images pour carrousel
function updateCenter() {
    if (currentView !== 'carousel') {
        document.querySelectorAll('.visitor-item').forEach(it => it.classList.remove('active'));
        return;
    }
    const items = document.querySelectorAll('.visitor-item');
    const center = window.innerWidth / 2;
    items.forEach(item => {
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.left + rect.width / 2;
        if (Math.abs(itemCenter - center) < 170) item.classList.add('active');
        else item.classList.remove('active');
    });
}

list.addEventListener('scroll', updateCenter);
window.addEventListener('resize', updateCenter);

// Modal
function openModal(i) {
    currentIndex = i;
    const proj = creations[i];
    modalMain.src = proj.imgUrl;
    thumbs.innerHTML = '';
    loadLikes();
    loadComments();

    modal.style.display = 'flex';
}

function closeModal() { modal.style.display = 'none'; renderVisitor(); }
function backgroundClose(e) { if (e.target === modal) closeModal(); }

// Likes
function toggleLike() {
    if (currentIndex === null) return;
    const name = prompt("Ton prénom pour liker cette image:") || "Anonyme";
    const key = 'likes_' + currentIndex;
    let likes = JSON.parse(localStorage.getItem(key) || '[]');
    if (likes.includes(name)) likes = likes.filter(n => n !== name);
    else likes.push(name);
    localStorage.setItem(key, JSON.stringify(likes));
    loadLikes();
}

function loadLikes() {
    if (currentIndex === null) return;
    const key = 'likes_' + currentIndex;
    const likes = JSON.parse(localStorage.getItem(key) || '[]');
    if (likes.length > 0) { heart.classList.add('liked'); heart.textContent = '❤️'; }
    else { heart.classList.remove('liked'); heart.textContent = '♡'; }
    likeCount.textContent = `${likes.length}`;
}

// Commentaires
function openCommentForm() { commentFormBg.style.display = 'flex'; }
function closeCommentForm(e) { if (e && e.target === commentFormBg) commentFormBg.style.display = 'none'; }

function submitComment() {
    const name = (commentName.value || '').trim();
    const text = (commentText.value || '').trim();
    if (!name || !text) return;

    const key = 'comments_' + currentIndex;
    const comments = JSON.parse(localStorage.getItem(key) || '[]');
    comments.push({ name, text, at: Date.now() });
    localStorage.setItem(key, JSON.stringify(comments));

    commentName.value = ''; commentText.value = '';
    commentFormBg.style.display = 'none';
    loadComments();
}

function loadComments() {
    if (currentIndex === null) return;
    const key = 'comments_' + currentIndex;
    const comments = JSON.parse(localStorage.getItem(key) || '[]');
    commentList.innerHTML = comments.map(c => `<div class="comment"><strong>${escapeHtml(c.name)}</strong><br>${escapeHtml(c.text)}</div>`).join('');
    // Ajouter le nombre de commentaire à côté du like
    likeCount.textContent += ` | ${comments.length} 💬`;
}

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        if (commentFormBg.style.display === 'flex') commentFormBg.style.display = 'none';
        else if (modal.style.display === 'flex') closeModal();
    }
});

// Observer pour carrousel
const observer = new MutationObserver(() => updateCenter());
observer.observe(list, { childList: true, subtree: true });
setTimeout(updateCenter, 200);

// Lancement
loadCreationsFromBucket();
