'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton';

export default function Dashboard() {
  const { user, role, loading, error } = useAuth();

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;
  if (!user) return <div className="p-4">Please log in.</div>;

  return (
    <div className="p-6 bg-white rounded shadow-md m-4">
      <h1 className="text-2xl font-bold mb-4">Welcome to Dashboard, {user?.email}!</h1>
      <p className="mb-4">Your role: {role}</p>
      <Link href="/my-students" className="text-blue-500 hover:underline block mb-4">Manage Students</Link>
      <LogoutButton />
    </div>
  );
}