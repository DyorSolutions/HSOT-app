'use client';

import { useAuth } from '@/context/AuthContext';
import UploadComponent from '@/components/UploadComponent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MyStudents() {
  const { loading, user } = useAuth();

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (!user) return <div className="p-4">Please log in.</div>;

  // Mock students; replace with Firestore
  const students = [
    { id: 'example-student', name: 'Example Student' },
  ];

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">My Students</h2>
      {students.map((student) => (
        <Card key={student.id} className="mb-6">
          <CardHeader>
            <CardTitle>{student.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <UploadComponent studentId={student.id} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}