"use client";

import { useState, useEffect } from "react";
import { getDocs, collection, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/Ts/useAuth"; // Import useAuth
import { useRouter } from "next/navigation"; // Import useRouter

const AdminDashboard = () => {
  const router = useRouter();
  const { user, loading } = useAuth(); // Get user and loading states from useAuth
  const [students, setStudents] = useState([]);
  const [guardians, setGuardians] = useState([]);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserDisplayName, setNewUserDisplayName] = useState("");
  const [newUserRole, setNewUserRole] = useState("student");
  const [showAddUserForm, setShowAddUserForm] = useState(false);

  // Redirect non-admin users to the login page
  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/login"); // Redirect to login if not admin
    }
  }, [user, loading, router]);

  // Fetch students and guardians from Firestore
  const fetchUsers = async () => {
    const studentSnapshot = await getDocs(collection(db, "students"));
    const guardianSnapshot = await getDocs(collection(db, "guardians"));

    setStudents(studentSnapshot.docs.map(doc => doc.data()));
    setGuardians(guardianSnapshot.docs.map(doc => doc.data()));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle adding a new user
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();

    const newUser = {
      email: newUserEmail,
      displayName: newUserDisplayName,
      role: newUserRole,
    };

    try {
      // Create user in Firestore
      await setDoc(doc(db, "users", newUserEmail), newUser);
      if (newUserRole === "guardian") {
        // Create guardian in the guardians collection and link to students
        await setDoc(doc(db, "guardians", newUserEmail), {
          assignedStudents: [],
        });
      }

      // Reset the form and refresh user data
      setNewUserEmail("");
      setNewUserDisplayName("");
      setShowAddUserForm(false);
      fetchUsers(); // Reload users
    } catch (err) {
      console.error("Error adding user:", err);
    }
  };

  return (
    <div className="admin-dashboard p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Students List */}
      <section className="students-list mb-6">
        <h2 className="text-xl font-semibold mb-2">Students</h2>
        <ul>
          {students.length > 0 ? (
            students.map((student, index) => (
              <li key={index} className="border-b py-2">
                {student.displayName} - {student.email}
              </li>
            ))
          ) : (
            <p>No students found.</p>
          )}
        </ul>
      </section>

      {/* Guardians List */}
      <section className="guardians-list mb-6">
        <h2 className="text-xl font-semibold mb-2">Guardians</h2>
        <ul>
          {guardians.length > 0 ? (
            guardians.map((guardian, index) => (
              <li key={index} className="border-b py-2">
                {guardian.displayName} - Assigned Students: {guardian.assignedStudents.join(", ")}
              </li>
            ))
          ) : (
            <p>No guardians found.</p>
          )}
        </ul>
      </section>

      {/* Add New User Button */}
      <div className="add-user-button mt-6">
        <button 
          onClick={() => setShowAddUserForm(true)} 
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Add New User
        </button>
      </div>

      {/* Add New User Form */}
      {showAddUserForm && (
        <div className="add-user-form mt-6 bg-gray-100 p-6 rounded shadow-md">
          <h3 className="text-xl font-semibold mb-4">Add New User</h3>
          <form onSubmit={handleAddUser}>
            <input
              type="email"
              placeholder="User Email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              required
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="Display Name"
              value={newUserDisplayName}
              onChange={(e) => setNewUserDisplayName(e.target.value)}
              required
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <select
              value={newUserRole}
              onChange={(e) => setNewUserRole(e.target.value)}
              required
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            >
              <option value="student">Student</option>
              <option value="guardian">Guardian</option>
              <option value="admin">Admin</option>
            </select>

            <div className="flex space-x-4">
              <button 
                type="submit" 
                className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
              >
                Add User
              </button>
              <button
                type="button"
                onClick={() => setShowAddUserForm(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
