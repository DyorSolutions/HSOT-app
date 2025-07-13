// src/app/api/students/route.ts
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next"; // Using getServerSession instead of getSession
import { connectToDatabase } from "@/lib/firebase"; // Make sure this connects to your Firebase
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Correct path for authOptions

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get the session using getServerSession
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" }); // If no session, return error
  }

  const { method } = req;
  const db = await connectToDatabase(); // Connect to the database

  switch (method) {
    case "GET":
      try {
        // Fetch students for the logged-in user
        const students = await db
          .collection("students")  // Students collection in your Firebase
          .find({ userId: session.user.id })  // Filter by the userId of the logged-in user
          .toArray();
        res.status(200).json(students);  // Return the students to the frontend
      } catch (error) {
        res.status(500).json({ error: "Error fetching students" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`); // Handle unsupported methods
  }
}
