"use client";

import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth"; // Import useAuth

export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth(); // Use the useAuth hook to access the user and loading state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // To prevent multiple submissions

  // If the user is already logged in, redirect to the dashboard
  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email:", email); // Log email
    console.log("Password:", password); // Log password
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/"); // Redirect to home page after successful login
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        setError("No account found with this email. Please sign up.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else {
        setError(err.message); // Default error message for other issues
      }
    }
  };
  
  


  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Log In</h1>
      
      {/* Error message */}
      {error && (
        <div>
          <p className="text-red-500 mb-2">{error}</p>
          {error.includes("No account found") && (
            <p
              className="text-blue-500 cursor-pointer mt-2"
              onClick={() => router.push("/signup")}
            >
              Sign up here
            </p>
          )}
        </div>
      )}

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          className="border p-2 rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="border p-2 rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          disabled={isSubmitting} // Disable the button during submission
        >
          Log In
        </button>
      </form>

      {/* Sign up link */}
      <div className="mt-4 text-center">
        <p>
          Don't have an account?{" "}
          <a
            className="text-blue-500 cursor-pointer"
            onClick={() => router.push("/signup")}
          >
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
}
