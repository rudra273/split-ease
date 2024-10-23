'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { AtSign, KeyRound, User, Phone, Loader } from 'lucide-react';

export function RegisterForm() {
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    try {
      await register({
        username: formData.get('username') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        first_name: formData.get('firstName') as string,
        last_name: formData.get('lastName') as string,
        phone: formData.get('phone') as string,
      });
    } catch (err) {
      setError('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputBaseClass = "block w-full pl-10 pr-3 py-2.5 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Username Input */}
      <div className="space-y-2">
        <label 
          htmlFor="username" 
          className="block text-sm font-medium text-gray-700"
        >
          Username
        </label>
        <div className="relative rounded-lg">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <AtSign className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="username"
            name="username"
            type="text"
            required
            className={inputBaseClass}
            placeholder="Choose a username"
          />
        </div>
      </div>

      {/* Email Input */}
      <div className="space-y-2">
        <label 
          htmlFor="email" 
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <div className="relative rounded-lg">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <AtSign className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={inputBaseClass}
            placeholder="Enter your email"
          />
        </div>
      </div>

      {/* Password Input */}
      <div className="space-y-2">
        <label 
          htmlFor="password" 
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <div className="relative rounded-lg">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <KeyRound className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            className={inputBaseClass}
            placeholder="Create a password"
          />
        </div>
      </div>

      {/* First Name and Last Name - Horizontal Layout */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label 
            htmlFor="firstName" 
            className="block text-sm font-medium text-gray-700"
          >
            First Name
          </label>
          <div className="relative rounded-lg">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              className={inputBaseClass}
              placeholder="First name"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label 
            htmlFor="lastName" 
            className="block text-sm font-medium text-gray-700"
          >
            Last Name
          </label>
          <div className="relative rounded-lg">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              className={inputBaseClass}
              placeholder="Last name"
            />
          </div>
        </div>
      </div>

      {/* Phone Input */}
      <div className="space-y-2">
        <label 
          htmlFor="phone" 
          className="block text-sm font-medium text-gray-700"
        >
          Phone Number (Optional)
        </label>
        <div className="relative rounded-lg">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="phone"
            name="phone"
            type="tel"
            className={inputBaseClass}
            placeholder="Enter your phone number"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors relative"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <Loader className="w-5 h-5 animate-spin mr-2" />
            Creating account...
          </div>
        ) : (
          'Create Account'
        )}
      </button>
    </form>
  );
}