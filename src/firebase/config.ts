// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set, push, update, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCLR1NyFMAkYmzxZ9K2v0nYZgL767sAAJc",
  authDomain: "contadorcis.firebaseapp.com",
  databaseURL: "https://contadorcis-default-rtdb.firebaseio.com",
  projectId: "contadorcis",
  storageBucket: "contadorcis.firebasestorage.app",
  messagingSenderId: "1075325804169",
  appId: "1:1075325804169:web:c888b4601c36a72b6e7058",
  measurementId: "G-YL4TB0ECVJ"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, get, set, push, update, onValue };