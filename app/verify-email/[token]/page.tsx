/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Container, Title, Text, Button, Card, ThemeIcon, Alert, Loader } from '@mantine/core';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  AlertCircle,
  MailX,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';

const MotionDiv = motion.div;

export default function VerifyEmailWithTokenPage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(5);

  const verifyEmail = useCallback( async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${API_URL}/api/auth/verify-email/${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      setStatus('success');
      setMessage('Email verified successfully!');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Failed to verify email. The link may be expired.');
    }
  }, [token] );

  useEffect(() => {
    if (token) {
      verifyEmail();
    }
  }, [token, verifyEmail]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === 'success' && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (status === 'success' && countdown === 0) {
      router.push('/login');
    }
    return () => clearTimeout(timer);
  }, [status, countdown, router]);

  const handleResend = () => {
    router.push('/verify-email');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
      <Container size="sm">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card padding="xl" radius="lg" withBorder className="bg-white dark:bg-gray-900">
            {status === 'loading' && (
              <div className="text-center py-8">
                <Loader size="lg" color="red" />
                <Title order={3} mt="md">Verifying your email...</Title>
                <Text c="dimmed" size="sm" mt="sm">
                  Please wait while we verify your email address
                </Text>
              </div>
            )}

            {status === 'success' && (
              <div className="text-center py-4">
                <ThemeIcon
                  size={80}
                  radius="xl"
                  color="green"
                  variant="light"
                  className="mx-auto mb-4"
                >
                  <CheckCircle size={40} />
                </ThemeIcon>
                <Title order={3} className="text-green-600 mb-2">Email Verified!</Title>
                <Text c="dimmed" mb="lg">
                  {message}
                </Text>
                <Text size="sm" c="dimmed" mb="lg">
                  Redirecting to login in {countdown} seconds...
                </Text>
                <Button
                  component={Link}
                  href="/login"
                  variant="gradient"
                  gradient={{ from: 'red', to: 'orange' }}
                  size="lg"
                  rightSection={<ArrowRight size={20} />}
                  fullWidth
                >
                  Go to Login Now
                </Button>
              </div>
            )}

            {status === 'error' && (
              <div className="text-center py-4">
                <ThemeIcon
                  size={80}
                  radius="xl"
                  color="red"
                  variant="light"
                  className="mx-auto mb-4"
                >
                  <MailX size={40} />
                </ThemeIcon>
                <Title order={3} className="text-red-600 mb-2">Verification Failed</Title>
                <Alert color="red" className="mb-4">
                  {message}
                </Alert>
                <Text c="dimmed" size="sm" mb="lg">
                  The verification link may be expired or invalid. 
                  You can request a new verification email.
                </Text>
                <Button
                  onClick={handleResend}
                  variant="gradient"
                  gradient={{ from: 'red', to: 'orange' }}
                  size="lg"
                  leftSection={<RefreshCw size={20} />}
                  fullWidth
                >
                  Request New Link
                </Button>
              </div>
            )}
          </Card>
        </MotionDiv>
      </Container>
    </div>
  );
}