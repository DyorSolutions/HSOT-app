"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

export default function StudentPage() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [grade, setGrade] = useState("preK");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // State for success message

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("You must be logged in to add students.");
      return;
    }
    setIsSubmitting(true);

    try {
      const studentRef = collection(db, "users", user.uid, "students");
      await addDoc(studentRef, {
        name,
        age,
        grade,
        userId: user.uid,
        createdAt: new Date(),
      });
      setName("");
      setAge("");
      setGrade("preK");
      setSuccessMessage("Student added successfully!"); // Show success message

      // Hide the success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Add a Student</h1>

      {error && <p className="text-red-500 text-center">{error}</p>}
      {successMessage && (
        <p className="text-green-500 text-center">{successMessage}</p> // Green success message
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-white">Student Name</label>
          <input
            id="name"
            type="text"
            placeholder="Enter student name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-100 text-black"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="age" className="block text-white">Age</label>
          <input
            id="age"
            type="number"
            placeholder="Enter student age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-100 text-black"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="grade" className="block text-white">Grade</label>
          <select
            id="grade"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-100 text-black"
            required
          >
            {/* Dropdown options for grades PreK-12 */}
            <option value="preK">PreK</option>
            <option value="K">K</option>
            <option value="1">1st Grade</option>
            <option value="2">2nd Grade</option>
            <option value="3">3rd Grade</option>
            <option value="4">4th Grade</option>
            <option value="5">5th Grade</option>
            <option value="6">6th Grade</option>
            <option value="7">7th Grade</option>
            <option value="8">8th Grade</option>
            <option value="9">9th Grade</option>
            <option value="10">10th Grade</option>
            <option value="11">11th Grade</option>
            <option value="12">12th Grade</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding..." : "Add Student"}
        </button>
      </form>
    </div>
  );
}
