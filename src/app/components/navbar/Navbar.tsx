// C:\Users\Anirudha\Desktop\CogniCare\frontend\src\app\components\Navbar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../store/useAuthStore.js';
import toast from 'react-hot-toast';
import { Home, UserCircle, LogIn, LogOut, Info, HeartPulse } from 'lucide-react'; // Using Lucide icons for aesthetics

export default function Navbar() {
  const { authUser, isLoading, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      toast.success('Logged out successfully!');
      router.push('/auth/login');
    } else {
      toast.error('Failed to log out.');
    }
  };

  return (
    // CURSOR ADDED: Enhanced Navbar container styling (gradient, padding, shadow)
    <nav className="bg-gradient-to-r from-indigo-400 to-purple-400 text-white p-4 md:p-5 shadow-xl fixed w-full top-0 z-50 transition-all duration-300 ease-in-out">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
        {/* Brand/Home Link */}
        <Link href="/" className="flex items-center text-3xl text-gray-900 font-extrabold tracking-tight hover:text-indigo-600 transition duration-300 ease-in-out transform hover:scale-105">
          <HeartPulse size={30} className="mr-3 text-red-300 transform rotate-[-10deg]" /> {/* CURSOR ADDED: Larger icon, slight rotation */}
          CogniCare
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-4 md:space-x-6 flex-wrap justify-center"> {/* CURSOR ADDED: Flex-wrap for responsiveness */}
          <Link href="/" className="flex items-center px-3 py-2 rounded-md hover:bg-indigo-600 transition duration-300 ease-in-out text-lg font-medium">
            <Home size={18} className="mr-2" /> Home
          </Link>

          <Link href="/about" className="flex items-center px-3 py-2 rounded-md hover:bg-indigo-600 transition duration-300 ease-in-out text-lg font-medium">
            <Info size={18} className="mr-2" /> About
          </Link>

          {authUser ? (
            // Links for logged-in users
            <>
              <Link href="/profile" className="flex items-center px-3 py-2 rounded-md hover:bg-indigo-600 transition duration-300 ease-in-out text-lg font-medium">
                <UserCircle size={18} className="mr-2" /> Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center bg-accent-foreground px-5 py-2 rounded-lg font-semibold hover:bg-red-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transform hover:scale-105"
              >
                <LogOut size={18} className="mr-2" /> Logout
              </button>
            </>
          ) : (
            // Link for logged-out users
            !isLoading && (
              <Link href="/auth/login" className="flex items-center bg-blue-600 px-5 py-2 rounded-lg font-semibold hover:bg-green-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 transform hover:scale-105">
                <LogIn size={18} className="mr-2" /> Login
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
    // END CURSOR ADDED: Navbar styling
  );
}