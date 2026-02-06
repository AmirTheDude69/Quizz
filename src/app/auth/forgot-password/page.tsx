'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Sparkles, LockKeyhole } from 'lucide-react';
import { apiPost } from '@/lib/api';
import { Button, Input, Card } from '@/components/ui';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await apiPost<{ success: boolean; error?: { message: string } }>(
        '/auth/forgot-password',
        { email }
      );

      if (response.success) {
        setSuccess(true);
      } else {
        setError(response.error?.message || 'Failed to send reset email');
      }
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background-950 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary-500/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-accent-500/10 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-md text-center"
        >
          <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-6">
            <Mail className="w-8 h-8 text-green-400" />
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-2">
            Check Your Email
          </h1>
          <p className="text-gray-400 mb-6">
            We've sent password reset instructions to <span className="text-white">{email}</span>
          </p>
          
          <Card className="p-6">
            <p className="text-sm text-gray-400">
              Didn't receive the email? Check your spam folder or{' '}
              <button
                onClick={() => setSuccess(false)}
                className="text-primary-400 hover:text-primary-300"
              >
                try again
              </button>
            </p>
          </Card>

          <div className="mt-6">
            <Link href="/auth/login" className="text-sm text-gray-400 hover:text-white">
              ← Back to Sign In
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background-950 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-accent-500/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">Quizz</span>
          </Link>
        </div>

        <Card className="p-6 lg:p-8">
          <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center mb-4">
            <LockKeyhole className="w-6 h-6 text-white" />
          </div>

          <h1 className="text-2xl font-bold text-white text-center mb-2">
            Forgot Password?
          </h1>
          <p className="text-gray-400 text-center mb-6">
            Enter your email and we'll send you a link to reset your password
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={18} />}
              required
            />

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
              Send Reset Link
              <ArrowRight size={18} className="ml-2" />
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/auth/login" className="text-sm text-gray-400 hover:text-white">
              ← Back to Sign In
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
