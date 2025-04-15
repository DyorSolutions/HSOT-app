"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to appropriate page once the user state is loaded
    if (!loading) {
      router.push(user ? "/dashboard" : "/login");
    }
  }, [user, loading, router]); // Runs when user or loading changes

  return <div className="text-center mt-10">Redirecting...</div>;
}