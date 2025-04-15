import "./globals.css";
import { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "HSOT",
  description: "Homeschool On Track",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main className="p-6">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}