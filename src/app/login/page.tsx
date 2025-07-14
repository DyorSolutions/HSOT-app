'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const router = useRouter();
  const { error: authError, loading, role } = useAuth();

  if (loading) return <div className="flex items-center justify-center min-h-screen animate-spin">Loading...</div>;

  const handleLogin = async (e: React.FormEvent) => {
    // ... existing logic
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-white p-4">
      <div className="w-full max-w-md space-y-8">
        <h2 className="text-3xl font-bold text-center text-gray-900">Login to HSOT</h2>
        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="rounded-md" />
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="rounded-md" />
          {(localError || authError) && <Alert variant="destructive"><AlertDescription>{localError || authError}</AlertDescription></Alert>}
          <Button type="submit" className="w-full">Login</Button>
        </form>
        <p className="text-center text-sm text-gray-600">
          Don't have an account? <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">Sign up</Link>
        </p>
        {role && <p className="text-center text-sm text-gray-600">Logged in as {role}</p>}
      </div>
    </div>
  );
}