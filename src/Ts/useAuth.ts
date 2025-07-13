'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { usePathname, useRouter } from 'next/navigation';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'admin' | 'user' | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          const userRole = userDoc.exists() ? userDoc.data()?.role : 'user';
          setRole(userRole);
          if (pathname === '/login' || pathname === '/signup') {
            router.push('/dashboard');
          }
        } catch (err) {
          setError('Failed to load user data');
          console.error(err);
        }
      } else if (pathname !== '/login' && pathname !== '/signup') {
        router.push('/login');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [router, pathname]);

  return { user, role, loading, error };
};