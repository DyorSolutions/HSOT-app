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
    e.preventDefault();
    setLocalError(null);
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      document.cookie = `authToken=${await user.getIdToken()}; path=/; secure; samesite=strict`;
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      let msg = 'Login failed. Please try again.';
      if (err.code === 'auth/invalid-credential') msg = 'Invalid email or password.';
      if (err.code === 'auth/user-not-found') msg = 'No user found with this email.';
      if (err.code === 'auth/wrong-password') msg = 'Incorrect password.';
      if (err.code === 'auth/user-disabled') msg = 'User account is disabled.';
      if (err.code === 'auth/network-request-failed') msg = 'Network error—check your connection.';
      if (err.code === 'auth/too-many-requests') msg = 'Too many failed attempts. Try again later.';
      setLocalError(msg);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          {(localError || authError) && (
            <Alert variant="destructive">
              <AlertDescription>{localError || authError}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" className="w-full">Login</Button>
        </form>
        <p className="text-center text-sm">
          Don't have an account? <Link href="/signup" className="text-blue-500 hover:underline">Sign up</Link>
        </p>
        {role && <p className="text-center text-sm">Logged in as {role}</p>}
      </div>
    </div>
  );
}