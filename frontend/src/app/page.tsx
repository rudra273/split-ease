
// src/app/page.tsx
'use client';

import { useAuth } from '@/context/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Welcome, {user.user.first_name}!</h1>
        </div>
        
        <div className="space-y-4">
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-2">Profile Information</h2>
            <p><span className="font-medium">Username:</span> {user.user.username}</p>
            <p><span className="font-medium">Email:</span> {user.user.email}</p>
            <p><span className="font-medium">Phone:</span> {user.phone || 'Not provided'}</p>
          </div>
          
          <div className="flex justify-between pt-4">
            <Link
              href="/profile"
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              Edit Profile
            </Link>
            <Link
              href="/expense"
              className="text-blue-500 hover:text-blue-600 font-medium block mt-2"
            >
              View Expenses
            </Link>
                        <button
              onClick={() => logout()}
              className="text-red-500 hover:text-red-600 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

