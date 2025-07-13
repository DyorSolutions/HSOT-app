import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext'; // Adjust path if different (e.g., '../context/AuthContext')

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
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}