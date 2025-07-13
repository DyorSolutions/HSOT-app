'use client';

import { useState } from 'react';
import { ref, uploadBytes } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { storage, db } from '@/lib/firebase';
import { useAuth } from '../../Ts/useAuth';

export default function MyStudents() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const { user, loading } = useAuth();
  const studentId = 'example-student'; // Replace with dynamic (e.g., from props or state)

  if (loading || !user) return <div>Loading...</div>;

  const handleUpload = async () => {
    if (!files) return;
    const timestamp = new Date().toISOString();
    for (const file of Array.from(files)) {
      const storageRef = ref(storage, `users/${user.uid}/students/${studentId}/${timestamp}-${file.name}`);
      await uploadBytes(storageRef, file);
      await addDoc(collection(db, 'work'), {
        userId: user.uid,
        studentId,
        subject,
        description,
        timestamp,
        path: storageRef.fullPath,
      });
    }
    setFiles(null);
    alert('Uploaded!');
  };

  return (
    <div className="p-4">
      <h2>Upload Student Work</h2>
      <input 
        type="file" 
        multiple 
        accept="image/*,application/pdf" 
        capture="environment" // Mobile camera
        onChange={(e) => setFiles(e.target.files)} 
      />
      <select value={subject} onChange={(e) => setSubject(e.target.value)}>
        <option value="">Select Subject</option>
        <option value="math">Math</option>
        <option value="science">Science</option>
        <option value="nature-study">Nature Study</option>
      </select>
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What was learned? (e.g., outdoor activity)" className="w-full p-2 border" />
      <button onClick={handleUpload} className="mt-2 p-2 bg-green-500 text-white">Upload Batch</button>
    </div>
  );
}