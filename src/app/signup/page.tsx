"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase"; // Import your Firebase setup
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from "firebase/auth"; 
import { doc, setDoc } from "firebase/firestore";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");  // State for success message
  const [isSubmitting, setIsSubmitting] = useState(false);  // Prevent multiple form submissions

  // Effect for handling redirect after success message
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.push("/dashboard");  // Redirect to the dashboard
      }, 2000);
      return () => clearTimeout(timer);  // Cleanup on unmount or when success changes
    }
  }, [success, router]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);  // Disable submit button to prevent multiple submissions

    try {
      // Check if the email is already in use
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.length > 0) {
        setError("This email is already registered. Please log in or use a different email.");
        setIsSubmitting(false);
        return;
      }

      // Proceed to create the user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create the user record in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        displayName,
        role: "admin",
        createdAt: new Date().toISOString(),
      });

      // Set success message and reset the form
      setSuccess("Account created successfully! Redirecting to your dashboard...");
      setEmail("");  // Clear email input
      setPassword("");  // Clear password input
      setDisplayName("");  // Clear displayName input

    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already in use. Please log in or use a different email.");
      } else {
        // Catch other errors, e.g., weak passwords
        setError(err.message);
      }
    }

    setIsSubmitting(false);  // Re-enable the submit button after processing
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>

      {/* Show success message if available */}
      {success && <p className="text-green-500 mb-2">{success}</p>}

      <form onSubmit={handleSignUp} className="space-y-4">
        <input
          type="text"
          placeholder="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full px-4 py-2 rounded bg-gray-100 text-black"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded bg-gray-100 text-black"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 rounded bg-gray-100 text-black"
          required
        />
        {/* Display error message */}
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          disabled={isSubmitting}  // Disable the submit button when submitting
        >
          Sign Up
        </button>
      </form>

      {/* Link to Login Page */}
      <div className="mt-4 text-center">
        <p>
          Already have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => router.push("/login")}
          >
            Log in here
          </span>
        </p>
      </div>
    </div>
  );
}
