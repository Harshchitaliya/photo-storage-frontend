// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // For authentication
import { getFirestore } from "firebase/firestore"; // For Firestore
import { getStorage } from "firebase/storage"; // For Storage

const firebaseConfig = {
  apiKey: "AIzaSyDof8hxotTUQlxAuSz9BWji7p_9fg9IpVs",
  authDomain: "gem-vi.firebaseapp.com",
  projectId: "gem-vi",
  storageBucket: "gem-vi.appspot.com",
  messagingSenderId: "162510409501",
  appId: "1:162510409501:web:a20cacc7142ba1810cdbf4",
  measurementId: "G-72GWMFH6PS"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Initialize Authentication
const firestore = getFirestore(app); // Initialize Firestore
const storage = getStorage(app); // Initialize Storage

export { auth, firestore, storage }; // Export initialized services
