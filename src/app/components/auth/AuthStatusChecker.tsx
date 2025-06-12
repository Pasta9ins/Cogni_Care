    // frontend/src/app/components/auth/AuthStatusChecker.tsx
    'use client';

    import { useEffect } from 'react';
    import { useAuthStore } from '../../../store/useAuthStore.js';
    import { useRouter, usePathname } from 'next/navigation';
    import { Loader2 } from 'lucide-react';

    export default function AuthStatusChecker({ children }: { children: React.ReactNode }) {
      // Destructure 'error' as 'authError'
      const { authUser, isLoading, getAuthUser, error: authError } = useAuthStore();
      const router = useRouter();
      const pathname = usePathname();

      useEffect(() => {
        console.log('AuthStatusChecker: useEffect triggered, calling getAuthUser');
        getAuthUser();
      }, [getAuthUser]);

      // 1. Show a loader if authentication status is still being fetched.
      if (isLoading) {
        return (
          <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
            <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
            <h1 className="text-4xl font-bold mb-8 text-gray-800">Checking Authentication...</h1>
            <p className="text-xl text-gray-600">Please wait.</p>
          </div>
        );
      }

      // Define routes that should be accessible without authentication
      const publicRoutes = ['/', '/auth/login', '/auth/signup', '/about']; // Add any other public routes here

      // Check if the current path is a public route
      const isPublicRoute = publicRoutes.some(route =>
        route === '/' ? pathname === '/' : pathname.startsWith(route)
      );

      // 2. Modified Redirect Logic:
      // Only redirect if NOT authenticated, NOT a public route, AND there's an explicit authentication error.
      // This ensures we only redirect if the auth check *failed*, not if it's just 'null' during hydration.
      if (!authUser && !isPublicRoute && authError) {
        console.log(`AuthStatusChecker: Authentication failed, redirecting to login from ${pathname}. Error: ${authError}`);
        router.push('/auth/login');
        return null; // Don't render children until authenticated or redirected
      }

      // 3. If authenticated, or if it's a public route, or if no authError (meaning pending success), render the children.
      return <>{children}</>;
    }