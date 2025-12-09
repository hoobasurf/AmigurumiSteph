// visitor.js — charge toutes les créations stockées dans Supabase

const gallery = document.getElementById("gallery");

async function loadCreations() {
  try {
    if (!window.supabaseClient) {
      console.error("supabaseClient manquant");
      return;
    }

    console.log("Chargement des créations...");

    // Récupère la table 'creations'
    const { data, error } = await window.supabaseClient
      .from("creations")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Erreur SELECT :", error);
      return;
    }

    console.log("Données reçues :", data);

    gallery.innerHTML = "";

    data.forEach(item => {
      const div = document.createElement("div");
      div.className = "item";

      div.innerHTML = `
        <img src="${item.image_url}" alt="">
        <p>${item.name}</p>
      `;

      gallery.appendChild(div);
    });

  } catch (err) {
    console.error("Erreur loadCreations():", err);
  }
}

loadCreations();
