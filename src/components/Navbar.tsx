"use client";

import { useState } from "react";
import Link from "next/link";
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="flex justify-between items-center">
        <div className="text-white text-xl">HSOT</div>

        <button onClick={toggleMenu} className="text-white md:hidden">
          {isOpen ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-4">
          <Link href="/" className="text-white">Home</Link>
          <Link href="/about" className="text-white">About</Link>
          <Link href="/login" className="text-white">Login</Link>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isOpen ? "block" : "hidden"} mt-4`}>
        <div className="flex flex-col space-y-4">
          <Link href="/" className="text-white">Home</Link>
          <Link href="/about" className="text-white">About</Link>
          <Link href="/login" className="text-white">Login</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;