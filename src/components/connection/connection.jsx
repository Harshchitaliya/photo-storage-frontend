// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // For authentication
import { getFirestore } from "firebase/firestore"; // For Firestore
import { getStorage } from "firebase/storage"; // For Storage

const firebaseConfig = {
  apiKey: "AIzaSyAqdD3xC1r-jOoDCo4XdneC4-tqq0BW5cA",
  authDomain: "cloud-storage-c36bf.firebaseapp.com",
  projectId: "cloud-storage-c36bf",
  storageBucket: "cloud-storage-c36bf.appspot.com",
  messagingSenderId: "932544679160",
  appId: "1:932544679160:web:2690e169b89e2a7911ff0d",
  measurementId: "G-7715V13VW3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Initialize Authentication
const firestore = getFirestore(app); // Initialize Firestore
const storage = getStorage(app); // Initialize Storage

export { auth, firestore, storage }; // Export initialized services
