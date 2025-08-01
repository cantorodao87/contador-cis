// src/firebase/config.js
import { ref, get, set, push, update, remove, onValue } from "firebase/database";

import { dbLocal } from "./firebaseConfig.local";
import { dbProd } from "./firebaseConfig.prod";

const db =
  import.meta.env.MODE === "development"
    ? dbLocal
    : dbProd;

export { db, ref, get, set, push, update, remove, onValue };