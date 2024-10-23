'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { AtSign, KeyRound, Loader } from 'lucide-react';

export function LoginForm() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    try {
      await login({
        username: formData.get('username') as string,
        password: formData.get('password') as string,
      });
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

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
            className="block w-full pl-10 pr-3 py-2.5 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            placeholder="Enter your username"
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
            className="block w-full pl-10 pr-3 py-2.5 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            placeholder="Enter your password"
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
            Signing in...
          </div>
        ) : (
          'Sign in'
        )}
      </button>

      {/* Remember me & Forgot password - Optional */}
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center text-gray-600">
          <input
            type="checkbox"
            className="rounded border-gray-300 text-blue-500 focus:ring-blue-500 mr-2"
          />
          Remember me
        </label>
        <button
          type="button"
          className="text-blue-500 hover:text-blue-600 font-medium"
        >
          Forgot password?
        </button>
      </div>
    </form>
  );
}