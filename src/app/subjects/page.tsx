"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function SubjectsPage() {
  const [subject, setSubject] = useState("");
  const [subjects, setSubjects] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) router.push("/login");
      else {
        const q = query(
          collection(db, "subjects"),
          where("uid", "==", user.uid)
        );
        onSnapshot(q, (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setSubjects(data);
        });
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || !subject.trim()) return;

    await addDoc(collection(db, "subjects"), {
      name: subject.trim(),
      uid: user.uid,
      createdAt: serverTimestamp(),
    });

    setSubject("");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl mb-4">Add a Subject</h1>
      <form onSubmit={handleAddSubject} className="space-y-4">
        <input
          className="w-full p-2 border"
          placeholder="e.g. Math, History"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-purple-600 text-white p-2 rounded"
        >
          Add Subject
        </button>
      </form>

      <h2 className="text-xl mt-8 mb-2">Your Subjects</h2>
      <ul className="space-y-2">
        {subjects.map((s) => (
          <li key={s.id} className="p-3 border rounded">
            {s.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
