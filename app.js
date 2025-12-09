:root{
  --bg: #fff5f8;
  --card: #fff0f5;
  --accent: #ff85b3;
  --accent-2: #ffb3c6;
  --muted: #7a5a67;
  --radius: 16px;
  --glass: rgba(255,255,255,0.6);
}

*{box-sizing:border-box}
html,body{height:100%}
body{
  margin:0;
  font-family: "Segoe UI", system-ui, -apple-system, "Helvetica Neue", Arial;
  background: linear-gradient(180deg,var(--bg),#fff);
  color:#332;
  -webkit-font-smoothing:antialiased;
  -moz-osx-font-smoothing:grayscale;
  padding:16px;
}

/* Header */
.top{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  margin-bottom:12px;
}
.brand{
  margin:0;
  color:var(--accent);
  font-weight:700;
  letter-spacing:0.6px;
}
.mode-switch .tab{
  background:transparent;
  border:1px solid var(--accent-2);
  padding:8px 12px;
  border-radius:14px;
  margin-left:6px;
  cursor:pointer;
}
.mode-switch .tab.active{
  background:var(--accent);
  color:white;
  box-shadow:0 6px 18px rgba(255,133,179,0.18);
}

/* Views */
.view{display:block}
.hidden{display:none}

/* Hero / gallery */
.hero{margin-bottom:18px}
.subtitle{margin:8px 0 14px 0;text-align:center;color:var(--muted)}
.gallery-scroll{
  display:flex;
  gap:12px;
  overflow-x:auto;
  padding:10px 6px;
  scroll-behavior:smooth;
}
.gallery-item{
  flex:0 0 220px;
  height:220px;
  border-radius:var(--radius);
  background:var(--card);
  box-shadow:0 8px 30px rgba(0,0,0,0.06);
  overflow:hidden;
  position:relative;
  cursor:pointer;
  transition:transform .18s;
}
.gallery-item:hover{transform:scale(1.03)}
.gallery-item img{width:100%;height:100%;object-fit:cover}

/* like / meta */
.gallery-info{
  position:absolute;
  left:8px;bottom:8px;
  background:var(--glass);
  padding:6px 8px;border-radius:12px;
  display:flex;gap:8px;align-items:center;font-size:13px;color:#5a3a44;
}

/* Owner */
.owner-panel{max-width:760px;margin:0 auto}
.owner-box{
  display:flex;flex-direction:column;gap:8px;max-width:520px;margin:0 auto 18px auto;
}
.owner-box input[type="text"], .owner-box input[type="file"], .owner-box input, .owner-box textarea{
  padding:10px;border-radius:12px;border:1px solid var(--accent-2);
  background:white;
}
.validate-btn{
  background:var(--accent);
  color:white;border:none;padding:10px;border-radius:12px;cursor:pointer;font-weight:600;
  box-shadow:0 6px 18px rgba(255,133,179,0.12);
}

/* owner gallery */
.owner-gallery{display:flex;flex-wrap:wrap;gap:12px;justify-content:center}
.owner-item{width:180px;background:var(--card);padding:10px;border-radius:12px;box-shadow:0 8px 20px rgba(0,0,0,0.06)}
.owner-item img{width:100%;height:110px;border-radius:10px;object-fit:cover}
.owner-name{display:block;text-align:center;margin-top:8px;font-weight:600;color:var(--muted)}

/* modal */
.modal{
  position:fixed;left:0;top:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;
  z-index:200;
}
.modal-overlay{position:absolute;left:0;top:0;width:100%;height:100%;backdrop-filter:blur(8px);background:rgba(255,235,242,0.5)}
.modal-content{
  position:relative;z-index:210;background:var(--card);padding:14px;border-radius:18px;max-width:92%;max-height:86%;overflow:auto;text-align:center;
}
.modal-image{max-width:100%;border-radius:12px}
.modal-thumbnails{display:flex;gap:8px;margin-top:10px;overflow-x:auto;padding-bottom:6px}
.modal-thumbnails img{width:64px;height:64px;border-radius:10px;object-fit:cover;cursor:pointer;border:2px solid transparent}
.modal-thumbnails img.active{border-color:var(--accent)}

/* small helpers */
.small{max-width:420px}
.close-btn{position:absolute;right:10px;top:8px;background:transparent;border:none;font-size:20px;cursor:pointer}
.comment-btn{margin-top:8px;background:var(--accent-2);border:none;padding:8px 12px;border-radius:12px;cursor:pointer}
input, textarea{font-size:15px}
