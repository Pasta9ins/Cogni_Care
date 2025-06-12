// C:\Users\Anirudha\Desktop\CogniCare\frontend\src\app\page.tsx
'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore.js';
//import { useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import HeroSection from './components/home/HeroSection.tsx'; // Ensure this import path is correct
import DashboardContent, {} from "./components/dashboard/DashboardContent.tsx"

export default function Home() {
  // Removed backendMessage, error, isClient states as they are not used in this component directly anymore-
  // Only keep them if you plan to display backend status elsewhere on the page.
  // For simplicity and focus, I'm removing them from here as the HeroSection is now standalone.
  // If you still want a backend message visible somewhere for logged-out users,
  // we can add a small status component on the main page.

  const { authUser, isLoading, getAuthUser } = useAuthStore();
  //const router = useRouter();

  useEffect(() => {
    // console.log('page.tsx: useEffect triggered, calling getAuthUser');------------------------
    // getAuthUser(); // Still fetch auth user to check session
  }, [getAuthUser]);


  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Loading...</h1>
        <p className="text-xl text-gray-600">Checking authentication status.</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen bg-gray-50 text-gray-800"> {/* Removed justify-center for full page layout */}
      <Toaster />

      {authUser ? (
        // Content for logged-in users
        <DashboardContent/> // Render the DashboardContent component for logged-in users
      ) : (
        // Render the new HeroSection component (without backend-related props)
        <HeroSection />
      )}
    </main>
  );
}