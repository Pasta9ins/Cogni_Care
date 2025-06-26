// C:\Users\Anirudha\Desktop\CogniCare\frontend\src\app\components\Navbar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../store/useAuthStore.js';
import toast from 'react-hot-toast';
import { Home, UserCircle, LogIn, LogOut, Info, HeartPulse, Search } from 'lucide-react'; 

import { useState } from "react";
import { Menu, X } from "lucide-react"; //hamburger and close icons



export default function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false);

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
    <nav className="bg-gradient-to-r from-indigo-400 to-purple-400 text-white p-4 md:p-5 shadow-xl fixed w-full top-0 z-50 transition-all duration-300 ease-in-out">
  <div className="container mx-auto flex justify-between items-center">
    {/* Brand/Home Link */}
    <Link href="/" className="flex items-center text-2xl md:text-3xl text-gray-900 font-extrabold tracking-tight hover:text-indigo-600 transition duration-300 ease-in-out transform hover:scale-105">
      <HeartPulse size={30} className="mr-3 text-red-300 transform rotate-[-10deg]" />
      CogniCare
    </Link>

    {/* Hamburger menu for mobile */}
    <button
      className="md:hidden p-2 rounded focus:outline-none"
      onClick={() => setMenuOpen(!menuOpen)}
      aria-label="Toggle menu"
    >
      {menuOpen ? <X size={28} /> : <Menu size={28} />}
    </button>

    {/* Navigation Links (desktop) */}
    <div className="hidden md:flex items-center space-x-4 md:space-x-6 flex-wrap justify-center">
      <Link href="/clinic-finder" className="flex items-center px-3 py-2 rounded-md hover:bg-indigo-600 transition text-lg font-medium">
        <Search size={18} className="mr-2" /> Find Doctor
      </Link>
      <Link href="/" className="flex items-center px-3 py-2 rounded-md hover:bg-indigo-600 transition text-lg font-medium">
        <Home size={18} className="mr-2" /> Dashboard
      </Link>
      <Link href="/about" className="flex items-center px-3 py-2 rounded-md hover:bg-indigo-600 transition text-lg font-medium">
        <Info size={18} className="mr-2" /> About
      </Link>
      {authUser ? (
        <>
          <Link href="/profile" className="flex items-center px-3 py-2 rounded-md hover:bg-indigo-600 transition text-lg font-medium">
            <UserCircle size={18} className="mr-2" /> Profile
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center bg-accent-foreground px-5 py-2 rounded-lg font-semibold hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transform hover:scale-105"
          >
            <LogOut size={18} className="mr-2" /> Logout
          </button>
        </>
      ) : (
        !isLoading && (
          <Link href="/auth/login" className="flex items-center bg-blue-600 px-5 py-2 rounded-lg font-semibold hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 transform hover:scale-105">
            <LogIn size={18} className="mr-2" /> Login
          </Link>
        )
      )}
    </div>
  </div>

  {/* Mobile Menu */}
  {menuOpen && (
    <div className="md:hidden mt-3 flex flex-col items-center space-y-2 bg-gradient-to-r from-indigo-400 to-purple-400 p-4 rounded-b-xl shadow-lg">
      <Link href="/clinic-finder" className="flex items-center px-3 py-2 rounded-md hover:bg-indigo-600 transition text-lg font-medium w-full justify-center" onClick={() => setMenuOpen(false)}>
        <Search size={18} className="mr-2" /> Find Doctor
      </Link>
      <Link href="/" className="flex items-center px-3 py-2 rounded-md hover:bg-indigo-600 transition text-lg font-medium w-full justify-center" onClick={() => setMenuOpen(false)}>
        <Home size={18} className="mr-2" /> Dashboard
      </Link>
      <Link href="/about" className="flex items-center px-3 py-2 rounded-md hover:bg-indigo-600 transition text-lg font-medium w-full justify-center" onClick={() => setMenuOpen(false)}>
        <Info size={18} className="mr-2" /> About
      </Link>
      {authUser ? (
        <>
          <Link href="/profile" className="flex items-center px-3 py-2 rounded-md hover:bg-indigo-600 transition text-lg font-medium w-full justify-center" onClick={() => setMenuOpen(false)}>
            <UserCircle size={18} className="mr-2" /> Profile
          </Link>
          <button
            onClick={() => { setMenuOpen(false); handleLogout(); }}
            className="flex items-center bg-accent-foreground px-5 py-2 rounded-lg font-semibold hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transform hover:scale-105 w-full justify-center"
          >
            <LogOut size={18} className="mr-2" /> Logout
          </button>
        </>
      ) : (
        !isLoading && (
          <Link href="/auth/login" className="flex items-center bg-blue-600 px-5 py-2 rounded-lg font-semibold hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 transform hover:scale-105 w-full justify-center" onClick={() => setMenuOpen(false)}>
            <LogIn size={18} className="mr-2" /> Login
          </Link>
        )
      )}
    </div>
  )}
</nav>
  );
}