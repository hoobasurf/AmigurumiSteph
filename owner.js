// owner.js — IndexedDB, compression image, ajout & suppression fonctionnels

(function(){
  // ---------- Utils IndexedDB ----------
  const DB_NAME = "creations-db";
  const STORE_NAME = "creations";
  const DB_VERSION = 1;
  let db;

  function openDb() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = (e) => {
        const idb = e.target.result;
        if (!idb.objectStoreNames.contains(STORE_NAME)) {
          idb.createObjectStore(STORE_NAME, { keyPath: "id" });
        }
      };
      req.onsuccess = (e) => { db = e.target.result; resolve(db); };
      req.onerror = (e) => reject(e.target.error);
    });
  }

  function idbAdd(record) {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const r = store.add(record);
      r.onsuccess = () => resolve(record);
      r.onerror = (e) => reject(e.target.error);
    });
  }

  function idbGetAll() {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const r = store.getAll();
      r.onsuccess = () => resolve(r.result);
      r.onerror = (e) => reject(e.target.error);
    });
  }

  function idbDelete(id) {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const r = store.delete(id);
      r.onsuccess = () => resolve();
      r.onerror = (e) => reject(e.target.error);
    });
  }

  // ---------- Image compression (canvas -> jpeg blob) ----------
  function resizeImageFileToBlob(file, maxSize = 1200, quality = 0.8) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Erreur lecture fichier"));
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          let w = img.width, h = img.height;
          const ratio = Math.min(1, maxSize / Math.max(w, h));
          const newW = Math.round(w * ratio);
          const newH = Math.round(h * ratio);
          const canvas = document.createElement("canvas");
          canvas.width = newW;
          canvas.height = newH;
          const ctx = canvas.getContext("2d");
          // optional white background for PNG transparency
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0,0,newW,newH);
          ctx.drawImage(img, 0, 0, newW, newH);
          canvas.toBlob((blob) => {
            if (!blob) return reject(new Error("Erreur conversion image"));
            resolve(blob);
          }, "image/jpeg", quality);
        };
        img.onerror = () => reject(new Error("Image invalide"));
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  // ---------- DOM ----------
  document.addEventListener("DOMContentLoaded", async () => {
    // éléments
    const nameInput = document.getElementById('name');
    const photoInput = document.getElementById('photo');
    const addBtn = document.getElementById('add');
    const list = document.getElementById('owner-list');

    // open DB
    try {
      await openDb();
    } catch (err) {
      console.error("Impossible d'ouvrir IndexedDB:", err);
      alert("Erreur IndexedDB. Le stockage local ne fonctionne pas.");
      return;
    }

    // render initial
    await renderAll();

    // handler add
    addBtn.addEventListener("click", async () => {
      const name = (nameInput.value || "").trim();
      const file = photoInput.files[0];
      if (!name || !file) { alert("Merci de remplir le nom et choisir une photo !"); return; }

      addBtn.disabled = true;
      addBtn.textContent = "Ajout...";

      try {
        // compress image to blob (adjust parameters if you want smaller sizes)
        let blob = await resizeImageFileToBlob(file, 1200, 0.8); // ~good quality
        // if resulting blob too big, compress more
        if (blob.size > 800 * 1024) { // >800KB
          blob = await resizeImageFileToBlob(file, 900, 0.7);
        }
        if (blob.size > 1.2 * 1024 * 1024) { // >1.2MB : last attempt
          blob = await resizeImageFileToBlob(file, 700, 0.6);
        }

        const id = String(Date.now()) + "-" + Math.floor(Math.random()*9999);
        const record = {
          id,
          name: escapeHtml(name),
          blob, // store blob directly
          date: Date.now()
        };

        await idbAdd(record);
        await renderAll();

        // reset fields
        nameInput.value = "";
        photoInput.value = "";
      } catch (err) {
        console.error("Erreur ajout:", err);
        alert("Erreur lors de l'ajout : " + (err.message || err));
      } finally {
        addBtn.disabled = false;
        addBtn.textContent = "Ajouter";
      }
    });

    // delete via delegation
    list.addEventListener("click", async (ev) => {
      const btn = ev.target.closest(".delete-btn");
      if (!btn) return;
      const id = btn.dataset.id;
      if (!id) return;
      if (!confirm("Supprimer cette création ?")) return;
      try {
        await idbDelete(id);
        await renderAll();
      } catch (err) {
        console.error("Erreur suppression:", err);
        alert("Impossible de supprimer : " + (err.message || err));
      }
    });

    // render function
    async function renderAll() {
      list.innerHTML = "";
      let records = [];
      try { records = await idbGetAll(); } catch (err) { console.error(err); }
      // sort by date desc
      records.sort((a,b) => (b.date||0) - (a.date||0));
      for (const r of records) {
        const url = URL.createObjectURL(r.blob);
        const div = document.createElement("div");
        div.className = "owner-item";
        div.innerHTML = `
          <div class="delete-btn" data-id="${r.id}" title="Supprimer">×</div>
          <p>${r.name}</p>
          <img src="${url}" alt="${r.name}">
        `;
        list.appendChild(div);
        // revoke URL when img loaded to free memory
        const img = div.querySelector("img");
        img.onload = () => { URL.revokeObjectURL(url); };
      }
    }

    // helper escape
    function escapeHtml(str){
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }
  }); // DOMContentLoaded
})();
