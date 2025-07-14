'use client';

import { useAuth } from '@/context/AuthContext';
import UploadComponent from '@/components/UploadComponent';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

export default function MyStudents() {
  const { loading, user } = useAuth();

  if (loading) return <div className="flex items-center justify-center min-h-screen animate-spin">Loading...</div>;
  if (!user) return <div className="p-4">Please log in.</div>;

  const students = [
    { id: '1', name: 'Student 1' },
    { id: '2', name: 'Student 2' },
  ]; // Mock; replace with Firestore fetch

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold">My Students</h2>
      {students.map((student) => (
        <Card key={student.id}>
          <CardHeader>
            <h3 className="text-xl font-semibold">{student.name}</h3>
          </CardHeader>
          <CardContent>
            <UploadComponent studentId={student.id} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}