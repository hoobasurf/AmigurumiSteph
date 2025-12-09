const supabaseUrl = "https://iubbxvipgofxasatmvzg.supabase.co";
const supabaseKey = "TON_PUBLIC_ANON_KEY";
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

console.log("Supabase VISITOR chargé", supabase);

const list = document.getElementById("visitor-list");

async function loadCreations() {
  const { data, error } = await supabase
    .from("creations")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error("Erreur chargement créations :", error);
    return;
  }

  list.innerHTML = ""; // reset

  data.forEach(item => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <p>${item.name}</p>
      <img src="${item.url}">
    `;
    list.appendChild(div);
  });
}

loadCreations();
