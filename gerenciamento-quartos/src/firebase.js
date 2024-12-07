// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAqP1V3xYhJA2_-L9tPZUB9IWO42l26eh4",
    authDomain: "gestao-de-quartos.firebaseapp.com",
    projectId: "gestao-de-quartos",
    storageBucket: "gestao-de-quartos.appspot.com",
    messagingSenderId: "384417841114",
    appId: "1:384417841114:web:b504900d190982c788cae3"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
