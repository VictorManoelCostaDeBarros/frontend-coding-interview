'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '@/components/Logo';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';

export default function SignInPage() {
  const [email, setEmail] = useState('testing@testing.com');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      if (success) {
        router.push('/photos');
      } else {
        setError('Invalid email or password');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-start md:items-center justify-center px-4 pt-9 md:pt-0">
      <div className="w-[319px] h-[395px] flex flex-col items-center justify-center text-center">
        <Logo />

        <form onSubmit={handleSubmit}>
          <h1 className="text-[20px] font-bold text-[#111827] mb-10 mt-6 leading-[1.15] font-['Helvetica']">
            Sign in to your account
          </h1>

          {error && (
            <div className="py-3 bg-red-50 border border-red-200 rounded-lg mb-6">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="mb-[23px]">
            <Input
              label="Username"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=""
              required
            />
          </div>

          <div className="mb-[24px]">
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=""
              rightElement={<span className="cursor-pointer">Forgot password?</span>}
              required
            />
          </div>

          <Button type="submit" loading={loading}>
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
} 