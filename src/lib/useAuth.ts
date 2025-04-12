import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext"; // Import AuthContext

export const useAuth = () => {
  return useContext(AuthContext); // Use context to access user and loading
};
