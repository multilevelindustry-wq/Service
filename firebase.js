import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-storage.js";

/*
  PASTE YOUR EXISTING ZONGO FIREBASE CONFIG BELOW.
  Keep your existing Firebase project if you already have one.
*/
const firebaseConfig = {

    apiKey:
        "AIzaSyAC3qCkDfdS2X8YA6deg01lXif7qAStfQQ",

    authDomain:
        "neostore-81b57.firebaseapp.com",

    projectId:
        "neostore-81b57",

    storageBucket:
        "neostore-81b57.firebasestorage.app",

    messagingSenderId:
        "760637387702",

    appId:
        "1:760637387702:web:3c7c231c34a3513d1a4717"

};


const configured = !Object.values(firebaseConfig).some(v => String(v).startsWith("PASTE_"));
let app = null, auth = null, db = null, storage = null;

if (configured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
}

export { app, auth, db, storage, configured };
