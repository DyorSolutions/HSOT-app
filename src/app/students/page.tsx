"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

export default function StudentsPage() {
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) router.push("/login");
      else {
        const q = query(
          collection(db, "students"),
          where("uid", "==", user.uid)
        );
        onSnapshot(q, (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setStudents(data);
        });
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    await addDoc(collection(db, "students"), {
      name,
      grade,
      uid: user.uid,
      createdAt: serverTimestamp(),
    });

    setName("");
    setGrade("");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl mb-4">Add a Student</h1>
      <form onSubmit={handleAddStudent} className="space-y-4">
        <input
          className="w-full p-2 border"
          placeholder="Student Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="w-full p-2 border"
          placeholder="Grade (optional)"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Add Student
        </button>
      </form>

      <h2 className="text-xl mt-8 mb-2">Your Students</h2>
      <ul className="space-y-2">
        {students.map((student) => (
          <li key={student.id} className="p-3 border rounded">
            <strong>{student.name}</strong>
            {student.grade && <span> — Grade {student.grade}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
