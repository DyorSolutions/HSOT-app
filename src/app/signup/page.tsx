'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../Ts/useAuth'; // Adjust

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const { user } = await createUserWithEmailAndPassword (auth, email, password);
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const role = usersSnapshot.empty ? 'admin' : 'user';
      await setDoc(doc(db, 'users', user.uid), { email: user.email, role });
      router.push('/dashboard');
    } catch (err: any) {
      let msg = 'Signup failed.';
      if (err.code === 'auth/email-already-in-use') msg = 'Email already in use.';
      setError(msg);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSignup} className="p-6 bg-white rounded shadow-md">
        <h2 className="mb-4 text-2xl">Signup</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-2 mb-4 border rounded"
        />
        {error && <p className="mb-4 text-red-500">{error}</p>}
        <button type="submit" className="w-full p-2 text-white bg-blue-500 rounded">Signup</button>
      </form>
    </div>
  );
}