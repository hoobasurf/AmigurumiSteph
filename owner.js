document.getElementById("addBtn").addEventListener("click", async () => {
    const name = document.getElementById("name").value.trim();
    const file = document.getElementById("file").files[0];

    console.log("Fichier sélectionné :", file);
    console.log("Nom :", name);

    if (!name || !file) {
        alert("Name or file missing");
        return;
    }

    console.log("Upload commencé");

    const filePath = `${Date.now()}_${file.name}`;

    // UPLOAD
    const { data, error } = await supabase.storage
        .from("creations")
        .upload(filePath, file);

    if (error) {
        console.error("Upload error:", error);
        alert("Erreur d'upload");
        return;
    }

    console.log("Upload OK :", data);

    // URL PUBLIQUE
    const { data: urlData } = supabase.storage.from("creations").getPublicUrl(filePath);
    const publicURL = urlData.publicUrl;

    console.log("URL publique :", publicURL);

    // AJOUT DANS LA LISTE
    const gallery = document.getElementById("gallery");
    const img = document.createElement("img");
    img.src = publicURL;
    img.alt = name;
    gallery.appendChild(img);

    alert("Image ajoutée !");
});
