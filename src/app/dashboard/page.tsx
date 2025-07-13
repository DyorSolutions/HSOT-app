'use client';

import { useAuth } from '../../Ts/useAuth'; // Adjust
import Link from 'next/link';

export default function Dashboard() {
  const { user, role, loading, error } = useAuth();

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <div className="p-4">
      <h1>Welcome to Dashboard, {user?.email}!</h1>
      <p>Your role: {role}</p> // Admin feedback
      <Link href="/my-students">Manage Students</Link>
      {/* Add upload component here later */}
    </div>
  );
}