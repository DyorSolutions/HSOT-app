'use client';

import { useState } from 'react';
import { ref, uploadBytes } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { storage, db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext'; // Adjust path if needed

interface UploadComponentProps {
  studentId: string; // Required: For organizing in Storage/Firestore
  onSuccess?: () => void; // Optional: Callback after upload
}

export default function UploadComponent({ studentId, onSuccess }: UploadComponentProps) {
  const [files, setFiles] = useState<FileList | null>(null);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();

  if (!user) return <div>Please log in to upload.</div>;

  const handleUpload = async () => {
    if (!files || files.length === 0) {
      setUploadError('No files selected.');
      return;
    }
    setUploading(true);
    setUploadError(null);
    const timestamp = new Date().toISOString();

    try {
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
      setSubject('');
      setDescription('');
      if (onSuccess) onSuccess();
      alert('Upload successful!'); // Or use a toast component
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded bg-white shadow-md">
      <h3 className="mb-4 text-lg font-bold">Upload Student Work</h3>
      <input
        type="file"
        multiple
        accept="image/*,application/pdf"
        capture="environment" // Mobile camera for on-the-go pics
        onChange={(e) => setFiles(e.target.files)}
        className="mb-4"
      />
      <select
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      >
        <option value="">Select Subject</option>
        <option value="math">Math</option>
        <option value="science">Science</option>
        <option value="nature-study">Nature Study</option>
        {/* Add more as needed */}
      </select>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="What was learned? (e.g., outdoor activity details)"
        className="w-full p-2 mb-4 border rounded"
      />
      {uploadError && <p className="mb-4 text-red-500">{uploadError}</p>}
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="w-full p-2 text-white bg-blue-500 rounded disabled:bg-gray-400"
      >
        {uploading ? 'Uploading...' : 'Upload Batch'}
      </button>
    </div>
  );
}