'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../Ts/useAuth'; // Adjust path if needed

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const router = useRouter();
  const { error: authError, loading, role } = useAuth(); // For global state

  if (loading) return <div className="flex items-center min-h-screen">Loading...</div>;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    try {
      await signInWithEmailAndPassword (auth, email, password);
      // Hook handles redirect, but add feedback
    } catch (err: any) {
      let msg = 'Login failed. Please try again.';
      if (err.code === 'auth/invalid-credential') msg = 'Invalid email or password.';
      if (err.code === 'auth/user-not-found') msg = 'No user found with this email.';
      setLocalError(msg);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="p-6 bg-white rounded shadow-md">
        <h2 className="mb-4 text-2xl">Login</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="password"
          value={password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-2 mb-2 border rounded"
        />
        {(localError || authError) && <p className="mb-4 text-red-500">{localError || authError}</p>}
        <button type="submit" className="w-full p-2 text-white bg-500 rounded">Login</button>
      </form>
      {role && <p className="mt-4">Logged in as {role}</p>} // Added for admin feedback
    </div>
  );
}