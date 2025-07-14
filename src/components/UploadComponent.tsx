'use client';

import { useState } from 'react';
import { ref, uploadBytes } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { storage, db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';

interface UploadComponentProps {
  studentId: string;
}

export default function UploadComponent({ studentId }: UploadComponentProps) {
  const [files, setFiles] = useState<FileList | null>(null);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { user } = useAuth();

  if (!user) return <Alert variant="destructive"><AlertDescription>Please log in to upload.</AlertDescription></Alert>;

  const handleUpload = async () => {
    if (!files || files.length === 0) {
      setUploadError('No files selected.');
      return;
    }
    setUploading(true);
    setUploadError(null);
    const timestamp = new Date().toISOString();
    const totalFiles = files.length;
    try {
      for (let i = 0; i < totalFiles; i++) {
        const file = files[i];
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
        setProgress(((i + 1) / totalFiles) * 100);
      }
      setFiles(null);
      setSubject('');
      setDescription('');
      setProgress(0);
      alert('Upload successful!');
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Input
        type="file"
        multiple
        accept="image/*,application/pdf"
        capture="environment"
        onChange={(e) => setFiles(e.target.files)}
      />
      {files && (
        <div className="grid grid-cols-3 gap-2">
          {Array.from(files).map((file, index) => (
            <div key={index} className="relative w-full h-32">
              <Image src={URL.createObjectURL(file)} alt="preview" fill className="object-cover rounded" />
            </div>
          ))}
        </div>
      )}
      <Select onValueChange={setSubject} value={subject}>
        <SelectTrigger>
          <SelectValue placeholder="Select Subject" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="math">Math</SelectItem>
          <SelectItem value="science">Science</SelectItem>
          <SelectItem value="nature-study">Nature Study</SelectItem>
        </SelectContent>
      </Select>
      <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What was learned?" />
      {uploadError && (
        <Alert variant="destructive">
          <AlertDescription>{uploadError}</AlertDescription>
        </Alert>
      )}
      {uploading && <Progress value={progress} />}
      <Button onClick={handleUpload} disabled={uploading} className="w-full">
        {uploading ? 'Uploading...' : 'Upload Batch'}
      </Button>
    </div>
  );
}