// src/components/Navbar.tsx
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="flex justify-between items-center">
        <div className="text-white text-xl">HSOT</div>
        <div className="hidden md:flex space-x-4">
          <Link href="/" className="text-white">Home</Link>
          <Link href="/my-students" className="text-white">My Students</Link>  {/* Add link here */}
          <Link href="/login" className="text-white">Login</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
