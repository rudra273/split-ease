// src/components/forms/RegisterForm.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthProvider';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Username"
        name="username"
        type="text"
        required
      />
      <Input
        label="Email"
        name="email"
        type="email"
        required
      />
      <Input
        label="Password"
        name="password"
        type="password"
        required
      />
      <Input
        label="First Name"
        name="firstName"
        type="text"
        required
      />
      <Input
        label="Last Name"
        name="lastName"
        type="text"
        required
      />
      <Input
        label="Phone"
        name="phone"
        type="tel"
      />
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Button type="submit" isLoading={loading}>
        Register
      </Button>
    </form>
  );
}