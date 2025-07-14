import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext'; // Adjust if path different
import Navbar from '@/components/Navbar'; // Add if you have it; otherwise, create in Step 2

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Homeschool On Track',
  description: 'Track homeschool progress',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}