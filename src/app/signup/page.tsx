'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center min-h-screen animate-spin">Loading...</div>;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const role = usersSnapshot.empty ? 'admin' : 'user';
      await setDoc(doc(db, 'users', user.uid), { email: user.email, role });
      document.cookie = `authToken=${await user.getIdToken()}; path=/; secure; samesite=strict`;
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Signup error:', err);
      let msg = 'Signup failed. Please try again.';
      if (err.code === 'auth/email-already-in-use') msg = 'Email is already in use.';
      if (err.code === 'auth/invalid-email') msg = 'Invalid email format.';
      if (err.code === 'auth/weak-password') msg = 'Password is too weak (must be at least 6 characters).';
      if (err.code === 'auth/operation-not-allowed') msg = 'Email/password signup is disabled in Firebase.';
      if (err.code === 'auth/network-request-failed') msg = 'Network error—check your connection.';
      setError(msg);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center">Signup</h2>
        <form onSubmit={handleSignup} className="space-y-4">
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" />
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" className="w-full">Signup</Button>
        </form>
        <p className="text-center text-sm">
          Already have an account? <Link href="/login" className="text-blue-500 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}