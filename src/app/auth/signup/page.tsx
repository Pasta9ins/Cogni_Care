    // C:\Users\Anirudha\Desktop\CogniCare\frontend\src\app\auth\signup\page.tsx
    'use client';

    import { useState, useEffect } from 'react';
    import { useRouter } from 'next/navigation';
    import { useAuthStore } from '../../../store/useAuthStore.js';
    import toast, { Toaster } from 'react-hot-toast';

    export default function SignupPage() {
      const [username, setUsername] = useState('');
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [role, setRole] = useState('user'); // Default role
      const router = useRouter();
      const { signup, isLoading, authUser } = useAuthStore();

      useEffect(() => {
        if (authUser) {
          router.push('/'); // Redirect to home if already logged in
        }
      }, [authUser, router]);

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !email || !password) {
          toast.error('Please fill in all fields.');
          return;
        }
        if (password.length < 6) {
          toast.error('Password must be at least 6 characters long.');
          return;
        }

        const success = await signup({ username, email, password, role });
        if (success) {
          // Redirection is handled by useEffect based on authUser state
        }
      };

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
          <Toaster />
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-2xl font-bold text-center mb-6">Sign Up for CogniCare</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
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
              <div className="mb-4">
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
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                  Role
                </label>
                <select
                  id="role"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="professional">Professional</option>
                  {/* <option value="admin">Admin</option> - Admin role usually set by backend */}
                </select>
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing Up...' : 'Sign Up'}
                </button>
              </div>
              <p className="text-center text-gray-600 text-sm mt-4">
                Already have an account?{' '}
                <a href="/auth/login" className="text-blue-500 hover:underline">
                  Login
                </a>
              </p>
            </form>
          </div>
        </div>
      );
    }