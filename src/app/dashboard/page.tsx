'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {
  const { user, role, loading, error } = useAuth();

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;
  if (!user) return <div className="p-4">Please log in.</div>;

  return (
    <Card className="max-w-md mx-auto mt-8 p-6">
      <CardHeader>
        <CardTitle className="text-2xl">Welcome, {user?.email}!</CardTitle>
        <p className="text-gray-600">Your role: {role}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Link href="/my-students">
          <Button variant="outline" className="w-full">Manage Students</Button>
        </Link>
        <LogoutButton />
      </CardContent>
    </Card>
  );
}