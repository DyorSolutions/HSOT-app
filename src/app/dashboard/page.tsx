'use client';

import { useAuth } from '@/context/AuthContext'; // Correct path (adjust if your useAuth is elsewhere, e.g., '@/Ts/useAuth')
import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton'; // Assuming you added this file

export default function Dashboard() {
  const { user, role, loading, error } = useAuth();

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>Please log in.</div>;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-blue-500">Welcome to Dashboard, {user?.email}!</h1>
      <p>Your role: {role}</p>
      <Link href="/my-students" className="text-blue-500 hover:underline">Manage Students</Link>
      <div className="mt-4">
        <LogoutButton />
        
      </div>
    </div>
  );
}