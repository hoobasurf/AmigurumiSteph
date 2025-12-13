const list = document.getElementById("visitor-list");

async function loadCreations(){
  const { data, error } = await supabase
    .storage
    .from("owners")
    .list("", { limit: 100, sortBy: { column: "name", order: "asc" } });

  if(error){
    console.error(error);
    return;
  }

  list.innerHTML = "";

  data.forEach(item=>{
    const imgUrl = supabase
      .storage
      .from("owners")
      .getPublicUrl(item.name).publicURL;

    const div = document.createElement("div");
    div.className = "visitor-item";
    div.innerHTML = `
      <img src="${imgUrl}">
      <p>${item.name}</p>
    `;
    list.appendChild(div);
  });
}

loadCreations();
