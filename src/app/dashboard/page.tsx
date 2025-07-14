'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

export default function Dashboard() {
  const { user, role, loading, error, logout } = useAuth();

  if (loading) return <div className="flex items-center justify-center min-h-screen animate-spin">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;
  if (!user) return <div className="p-4">Please log in.</div>;

  return (
    <Card className="m-4 max-w-lg mx-auto">
      <CardHeader>
        <h1 className="text-2xl font-bold">Welcome, {user?.email}!</h1>
        <p>Your role: {role}</p>
      </CardHeader>
      <CardContent>
        <Link href="/my-students">
          <Button className="w-full mb-4">Manage Students</Button>
        </Link>
        <Button variant="destructive" onClick={logout} className="w-full">Logout</Button>
      </CardContent>
    </Card>
  );
}