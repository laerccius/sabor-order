// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB18CimRnkuYcRi9vtzXz1nDAzO-2OGfLw",
  authDomain: "data-laerccius-project.firebaseapp.com",
  projectId: "data-laerccius-project",
  storageBucket: "data-laerccius-project.firebasestorage.app",
  messagingSenderId: "750348338314",
  appId: "1:750348338314:web:edf3e4718b079c94d6d973"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app,"sabor");