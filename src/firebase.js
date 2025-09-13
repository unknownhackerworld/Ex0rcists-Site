import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyCwP8qwOIVxYrp0G1pcejbAxGbuYaAZe7A",
  authDomain: "ex0rcists-site.firebaseapp.com",
  databaseURL: "https://ex0rcists-site-default-rtdb.firebaseio.com",
  projectId: "ex0rcists-site",
  storageBucket: "ex0rcists-site.firebasestorage.app",
  messagingSenderId: "1022042369572",
  appId: "1:1022042369572:web:414a753eb27d49ddadf2b1"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth(app);