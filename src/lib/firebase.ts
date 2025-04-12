// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // Import Auth methods
import { getFirestore } from "firebase/firestore"; // Import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDC6361cl2eO3RuhDpp162dSd1uP5OCpX8",
  authDomain: "hsot-app.firebaseapp.com",
  projectId: "hsot-app",
  storageBucket: "hsot-app.firebasestorage.app",
  messagingSenderId: "872469491556",
  appId: "1:872469491556:web:cf9558f11c2802240fd471"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth and Firestore with the app
export const auth = getAuth(app); // Default Auth instance
export const db = getFirestore(app); // Default Firestore instance

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider(); // Google Auth Provider
