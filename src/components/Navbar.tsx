'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import LogoutButton from '@/components/LogoutButton';

export default function Navbar() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <nav className="bg-blue-600 p-4 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/dashboard" className="text-xl font-bold">HSOT</Link>
        <div className="space-x-4">
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          <Link href="/my-students" className="hover:underline">My Students</Link>
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
}