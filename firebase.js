<!-- Firebase v8 classique pour iPhone -->
<script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js"></script>
<script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-storage.js"></script>

<script>
  // 🔹 Config Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyAKUqhiGi1ZHIfZRwslMIUip8ohwOiLhFA",
    authDomain: "amigurumisteph.firebaseapp.com",
    projectId: "amigurumisteph",
    storageBucket: "amigurumisteph.appspot.com",
    messagingSenderId: "175290001202",
    appId: "1:175290001202:web:b53e4255e699d65bd4192b"
  };

  // 🔹 Initialisation Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  const storage = firebase.storage();
</script>
