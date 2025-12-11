<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Galerie Amigurumi</title>
<style>
  body {
    font-family: 'Comic Sans MS', cursive, sans-serif;
    background: #ffe6f0; /* rose pastel */
    margin: 0;
    padding: 20px;
  }

  h1 {
    text-align: center;
    color: #b84c6f; /* bordeaux léger */
    margin-bottom: 30px;
  }

  #gallery {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
  }

  .item {
    background: #fff0f5;
    border-radius: 15px;
    padding: 15px;
    text-align: center;
    box-shadow: 0 4px 12px rgba(184,76,111,0.2);
    transition: transform 0.3s;
    flex: 0 0 150px;
  }

  .item img {
    max-width: 100%;
    border-radius: 12px;
    display: block;
    margin: 0 auto 10px;
    transition: transform 0.3s;
  }

  .item img:hover {
    transform: scale(1.05); /* léger zoom au survol */
  }

  .item p {
    color: #b84c6f;
    font-weight: bold;
    margin: 0;
    font-size: 14px;
  }

  /* Console mobile debug */
  #mobileConsole {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    max-height: 160px;
    background: black;
    color: lime;
    font-size: 12px;
    overflow-y: auto;
    padding: 6px;
    z-index: 9999;
    border-top: 2px solid lime;
  }
</style>
</head>
<body>

<h1>Galerie Amigurumi</h1>

<div id="gallery"></div>
<div id="mobileConsole"></div>

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="visitor.js" type="module"></script>

<script>
  function log(msg) {
    const el = document.getElementById("mobileConsole");
    el.innerHTML += msg + "<br>";
    el.scrollTop = el.scrollHeight;
  }
  console.log = log;
  console.error = log;
  console.warn = log;
</script>

</body>
</html>
