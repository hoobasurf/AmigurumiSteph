async function uploadToSupabase(name, file) {
  const filePath = `${Date.now()}_${name}.jpg`;

  const { data, error } = await client
    .storage
    .from("creations")
    .upload(filePath, file, {
      contentType: file.type,
      upsert: false
    });

  // === SI ERREUR UPLOAD ===
  if (error) {
    const msg = "❌ Erreur upload Supabase : " + JSON.stringify(error, null, 2);
    alert(msg);

    const errorBox = document.createElement("div");
    errorBox.style.background = "#ffdddd";
    errorBox.style.border = "1px solid red";
    errorBox.style.color = "black";
    errorBox.style.padding = "10px";
    errorBox.style.margin = "10px 0";
    errorBox.innerText = msg;
    document.body.appendChild(errorBox);

    return null;
  }

  // === SI UPLOAD RÉUSSI ===
  const { publicUrl } = client
    .storage
    .from("creations")
    .getPublicUrl(filePath);

  return publicUrl;
}
