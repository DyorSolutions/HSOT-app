'use client';

import { useAuth } from '@/context/AuthContext';
import UploadComponent from '@/components/UploadComponent';

export default function MyStudents() {
  const { loading, user } = useAuth();

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (!user) return <div className="p-4">Please log in.</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Students</h2>
      {/* Placeholder student list */}
      <ul className="mb-4">
        <li className="mb-2">Student 1 - <UploadComponent studentId="student1" /></li>
        <li className="mb-2">Student 2 - <UploadComponent studentId="student2" /></li>
      </ul>
    </div>
  );
}

const students = [{ id: '1', name: 'Student 1' }, { id: '2', name: 'Student 2' }]; // Mock; replace with Firestore fetch later
return (
  <div className="p-6">
    <h2 className="text-2xl font-bold mb-4">My Students</h2>
    {students.map(student => (
      <div key={student.id} className="mb-8">
        <h3 className="text-xl font-semibold mb-2">{student.name}</h3>
        <UploadComponent studentId={student.id} />
      </div>
    ))}
  </div>
);