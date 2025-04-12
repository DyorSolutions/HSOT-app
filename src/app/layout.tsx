import "./globals.css";
import { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext"; // Import AuthProvider

export const metadata = {
  title: "HSOT",
  description: "Homeschool On Track",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider> {/* Wrap the entire app with AuthProvider */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
