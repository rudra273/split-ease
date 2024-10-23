// // src/app/auth/register/page.tsx
// 'use client';

// import { useAuth } from '@/context/AuthProvider';
// import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';
// import { RegisterForm } from '@/components/forms/RegisterForm';
// import Link from 'next/link';

// export default function RegisterPage() {
//   const { user, loading } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!loading && user) {
//       router.push('/');
//     }
//   }, [loading, user, router]);

//   if (loading) {
//     return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//           Create your account
//         </h2>
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
//           <RegisterForm />
//           <div className="mt-6 text-center">
//             <Link
//               href="/auth/login"
//               className="text-blue-500 hover:text-blue-600 font-medium"
//             >
//               Already have an account? Login
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import { useAuth } from '@/context/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { RegisterForm } from '@/components/forms/RegisterForm';
import Link from 'next/link';
import { 
  Receipt, 
  UserPlus,
  Users, 
  ArrowLeft,
  Wallet,
  Shield,
  LockKeyhole
} from 'lucide-react';

export default function RegisterPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"/>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Panel - Hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-500 text-white p-12 flex-col justify-between">
        <div className="flex items-center space-x-3">
          <Wallet className="w-8 h-8" />
          <span className="text-2xl font-bold">Split-ease</span>
        </div>
        
        <div className="space-y-6">
          <h1 className="text-4xl font-bold">Join Split-ease Today</h1>
          <p className="text-blue-100 text-lg">
            Create your account and start managing expenses with friends effortlessly.
          </p>
          
          {/* Feature List */}
          <div className="mt-8 space-y-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-400/20 rounded-lg">
                <Shield className="w-6 h-6" />
              </div>
              <span className="text-blue-100">Secure account creation</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-400/20 rounded-lg">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-blue-100">Connect with friends instantly</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-400/20 rounded-lg">
                <Receipt className="w-6 h-6" />
              </div>
              <span className="text-blue-100">Start tracking expenses immediately</span>
            </div>
          </div>
        </div>

        <div className="text-sm text-blue-200">
          © 2024 Split-ease. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-6 sm:px-6 lg:px-8">
        <div className="w-full max-w-md mx-auto space-y-8">
          {/* Mobile Logo - Only visible on mobile */}
          <div className="flex lg:hidden items-center justify-center space-x-3 mb-8">
            <Wallet className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold text-gray-900">Split-ease</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
            <p className="text-gray-500">Join Split-ease to manage expenses with friends</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden p-8">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-blue-50 rounded-full">
                <UserPlus className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <RegisterForm />
          </div>

          <div className="flex justify-center items-center space-x-2">
            <span className="text-gray-500">Already have an account?</span>
            <Link
              href="/auth/login"
              className="text-blue-500 hover:text-blue-600 font-medium inline-flex items-center group"
            >
              <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
