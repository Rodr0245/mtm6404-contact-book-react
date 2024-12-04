// Import the necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyD0tqVU4JCl4Q4hAauzTq3PO1y1-1zUYws",
  authDomain: "contact-book-a1579.firebaseapp.com",
  projectId: "contact-book-a1579",
  storageBucket: "contact-book-a1579.firebasestorage.app",
  messagingSenderId: "950980173145",
  appId: "1:950980173145:web:c909ef7de3d7da0e12c048"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export default db;
