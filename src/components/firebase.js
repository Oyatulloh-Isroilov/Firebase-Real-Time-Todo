import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAeGD63DVWFyXlphW5cCnMQvsrmrk-t5YE",
  authDomain: "todo-283fd.firebaseapp.com",
  projectId: "todo-283fd",
  storageBucket: "todo-283fd.appspot.com",
  messagingSenderId: "259914901339",
  appId: "1:259914901339:web:14ca42cdba4d10c22b5c7e",
  measurementId: "G-RSVHST6B0V",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
