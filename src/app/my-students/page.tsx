'use client';

import { useAuth } from '@/context/AuthContext'; // Adjust path if needed (was '../../Ts/useAuth' in your code)
import UploadComponent from '@/components/UploadComponent';

export default function MyStudents() {
  const { loading, user } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in to access this page.</div>;

  return (
    <div className="p-4">
      <h2>My Students</h2>
      {/* Use the reusable component; pass dynamic studentId */}
      <UploadComponent studentId="example-student" /> {/* Replace with real ID from state/props */}
    </div>
  );
}