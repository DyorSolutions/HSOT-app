"use client";
import React, { createContext, useState, useEffect, ReactNode, useContext } from "react";
import { onAuthStateChanged, User } from "firebase/auth"; // Import Firebase auth functions
import { auth } from "@/lib/firebase"; // Import the Firebase instance

// Define the shape of the context
interface AuthContextType {
  user: User | null;
  loading: boolean;
}

// Create the context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the useAuth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Set up the authentication listener when the component mounts
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false); // Set loading to false once we know the auth state
    });

    // Clean up the listener when the component unmounts
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
