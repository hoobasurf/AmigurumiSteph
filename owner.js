// 🔹 Config Firebase
var firebaseConfig = {
  apiKey: "AIzaSyAKUqhiGi1ZHIfZRwslMIUip8ohwOiLhFA",
  authDomain: "amigurumisteph.firebaseapp.com",
  projectId: "amigurumisteph",
  storageBucket: "amigurumisteph.appspot.com",
  messagingSenderId: "175290001202",
  appId: "1:175290001202:web:b53e4255e699d65bd4192b"
};
firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();
var storage = firebase.storage();

// 🔹 Éléments HTML
var nameInput = document.getElementById("name");
var photoInput = document.getElementById("photo");
var list = document.getElementById("owner-list");

// 🔹 Upload automatique dès qu’on choisit une photo
photoInput.addEventListener("change", function() {
  var file = photoInput.files[0];
  var name = nameInput.value.trim();

  if (!file || !name) {
    alert("Merci de remplir le nom et choisir une photo !");
    return;
  }

  var timestamp = Date.now();
  var storageRef = storage.ref("creations/" + timestamp + "-" + file.name);
  var uploadTask = storageRef.put(file);

  uploadTask.on("state_changed", 
    null,
    function(error) { alert("Erreur upload : " + error.message); },
    function() {
      uploadTask.snapshot.ref.getDownloadURL().then(function(url) {
        db.collection("creations").add({
          name: name,
          imageUrl: url,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        }).then(function() {
          nameInput.value = "";
          photoInput.value = "";
        });
      });
    }
  );
});

// 🔹 Affichage live Firestore
db.collection("creations").orderBy("createdAt", "desc").onSnapshot(function(snapshot) {
  list.innerHTML = "";
  snapshot.forEach(function(doc) {
    var data = doc.data();
    var item = document.createElement("div");
    item.className = "owner-item";
    item.innerHTML = `
      <p>${data.name}</p>
      <img src="${data.imageUrl}" class="mini-img">
    `;
    list.prepend(item);
  });
});
