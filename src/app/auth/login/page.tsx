    // C:\Users\Anirudha\Desktop\CogniCare\frontend\src\app\auth\login\page.tsx
    'use client';

    import { useState, useEffect } from 'react';
    import { useRouter } from 'next/navigation';
    import { useAuthStore } from '../../../store/useAuthStore.js';
    import toast, { Toaster } from 'react-hot-toast';

    export default function LoginPage() {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const router = useRouter();
      const { login, isLoading, authUser } = useAuthStore();

      useEffect(() => {
        if (authUser) {
          router.push('/'); // Redirect to home if already logged in
        }
      }, [authUser, router]);

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
          toast.error('Please enter both email and password.');
          return;
        }

        const success = await login({ email, password });
        if (success) {
          // Redirection is handled by useEffect based on authUser state
        }
      };

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
          <Toaster />
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-2xl font-bold text-center mb-6">Login to CogniCare</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="your@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging In...' : 'Login'}
                </button>
              </div>
              <p className="text-center text-gray-600 text-sm mt-4">
                Don&apos;t have an account?{' '}
                <a href="/auth/signup" className="text-blue-500 hover:underline">
                  Sign up
                </a>
              </p>
            </form>
          </div>
        </div>
      );
    }