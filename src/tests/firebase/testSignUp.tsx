import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore";

// Firebase config (use your own)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function testSignup() {
  try {
    // Create a new user
    const userCredential = await createUserWithEmailAndPassword(auth, "testuser@example.com", "password123");
    const user = userCredential.user;

    // Write to Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      displayName: "Test User",
      createdAt: new Date().toISOString(),
    });

    console.log("User created and data written to Firestore!");
  } catch (error) {
    console.error("Error during signup and write:", error);
  }
}

testSignup();
