
// src/app/auth/logout/page.tsx
'use client';

import { useAuth } from '@/context/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LogoutPage() {
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      await logout();
      router.push('/auth/login');
    };

    void performLogout();
  }, [logout, router]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <p>Logging out...</p>
    </div>
  );
}