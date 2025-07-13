'use client';

import { useState } from 'react';
import { ref, uploadBytes } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { storage, db } from '@/lib/firebase';
import { useAuth } from '@/Ts/useAuth';

export default function UploadWork({ studentId }: { studentId: string }) {
  const [files, setFiles] = useState<FileList | null>(null);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const { user } = useAuth();

  const handleUpload = async () => {
    if (!files || !user) return;
    const timestamp = new Date().toISOString();
    for (const file of files) {
      const fileRef = ref(storage, `users/${user.uid}/students/${studentId}/${timestamp}-${file.name}`);
      await uploadBytes(fileRef, file);
      await addDoc(collection(db, 'work'), {
        userId: user.uid,
        studentId,
        subject,
        description,
        timestamp,
        path: fileRef.fullPath,
      });
    }
    // Success message or reset
  };

  return (
    <div>
      <input 
        type="file" 
        multiple 
        accept="image/*" 
        capture="environment" // Mobile camera for outdoor pics
        onChange={(e) => setFiles(e.target.files)} 
      />
      <select value={subject} onChange={(e) => setSubject(e.target.value)}>
        <option value="">Select Subject</option>
        <option value="math">Math</option>
        <option value="science">Science</option>
        <option value="nature">Nature Study</option>
      </select>
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What was learned?" />
      <button onClick={handleUpload}>Upload Work</button>
    </div>
  );
}