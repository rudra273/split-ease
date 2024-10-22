
// src/components/forms/LoginForm.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Username"
        name="username"
        type="text"
        required
      />
      <Input
        label="Password"
        name="password"
        type="password"
        required
      />
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Button type="submit" isLoading={loading}>
        Login
      </Button>
    </form>
  );
}
