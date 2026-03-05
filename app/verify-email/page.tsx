/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Container, Title, Text, Button, Card, Group, ThemeIcon, Badge, Stack, Paper, Alert, PinInput, Loader, Anchor, Divider, ActionIcon, Tooltip } from '@mantine/core';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  Mail,
  MailCheck,
  MailX,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowRight,
  RefreshCw,
  Clock,
  Shield,
  Send,
  Phone,
  MessageCircle,
  Copy,
  Check,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

// Types
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
}

const MotionDiv = motion.div;

// Floating particles animation
const FloatingParticles = () => {
  // Generate particles directly in useState initializer
  const [particles] = useState<Particle[]>(() => {
    const colors = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];
    
    return [...Array(30)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: 10 + Math.random() * 20,
      delay: Math.random() * 10,
    }));
  });

  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            left: `${p.x}%`,
            top: `${p.y}%`,
            opacity: 0.15,
          }}
          animate={{
            y: [0, -30, 0, 30, 0],
            x: [0, 30, 0, -30, 0],
            scale: [1, 1.2, 1, 0.8, 1],
            opacity: [0.15, 0.25, 0.15, 0.25, 0.15],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

// Animated Gradient Border Card
const GradientBorderCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`relative group ${className}`}>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-xy" />
      <div className="relative bg-white dark:bg-gray-900 rounded-lg">
        {children}
      </div>
    </div>
  );
};

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get('email') || '';
  
  const [email, setEmail] = useState<string>(emailFromUrl);
  const [verificationCode, setVerificationCode] = useState<string>(''); // Changed from array to string
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(true);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [copied, setCopied] = useState<boolean>(false);

  // Load email from localStorage if not in URL
  useEffect(() => {
    if (!email) {
      const savedEmail = localStorage.getItem('verificationEmail');
      if (savedEmail) {
        setEmail(savedEmail);
      }
    }
  }, [email]);

  // Countdown for resend button
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!canResend && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setCanResend(true);
      setCountdown(60);
    }
    return () => clearTimeout(timer);
  }, [canResend, countdown]);

  const handleVerifyWithCode = async () => {
    if (verificationCode.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    if (!email) {
      setError('Email is required. Please go back and try again.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${API_URL}/api/auth/verify-email/code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code: verificationCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      setVerificationStatus('success');
      setSuccess('Email verified successfully! You can now login.');
      
      // Clear stored email
      localStorage.removeItem('verificationEmail');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000);

    } catch (err: any) {
      setError(err.message || 'Failed to verify email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend || !email) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${API_URL}/api/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend verification code');
      }

      setSuccess('Verification code resent successfully! Please check your email.');
      setCanResend(false);
      setCountdown(60);
      setVerificationCode(''); // Clear code input

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChangeEmail = () => {
    router.push('/register');
  };

  if (verificationStatus === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 relative overflow-hidden">
        <FloatingParticles />
        
        <Container size="sm" className="relative z-10 min-h-screen flex items-center justify-center py-20">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <GradientBorderCard>
              <Card padding="xl" radius="lg" className="bg-white dark:bg-gray-900 text-center">
                <ThemeIcon
                  size={80}
                  radius="xl"
                  color="green"
                  variant="light"
                  className="mx-auto mb-4"
                >
                  <CheckCircle size={40} />
                </ThemeIcon>
                
                <Title order={2} className="text-3xl font-bold mb-2 text-green-600">
                  Email Verified!
                </Title>
                
                <Text c="dimmed" mb="lg">
                  Your email has been successfully verified. You can now login to your account.
                </Text>
                
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-6">
                  <Text size="sm" className="text-green-700 dark:text-green-300">
                    ✨ Your account is now active and ready to use
                  </Text>
                </div>
                
                <Button
                  component={Link}
                  href="/login"
                  variant="gradient"
                  gradient={{ from: 'red', to: 'orange' }}
                  size="lg"
                  rightSection={<ArrowRight size={20} />}
                  fullWidth
                >
                  Go to Login
                </Button>
              </Card>
            </GradientBorderCard>
          </MotionDiv>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 relative overflow-hidden">
      <FloatingParticles />

      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/bg-2.jpg"
          alt="Background"
          fill
          className="object-cover opacity-10"
          priority
        />
      </div>

      <Container size="sm" className="relative z-10 min-h-screen flex items-center justify-center py-20">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <GradientBorderCard>
            <Card padding="xl" radius="lg" className="bg-white dark:bg-gray-900">
              <Stack gap="lg">
                {/* Header */}
                <div className="text-center">
                  <ThemeIcon
                    size={60}
                    radius="xl"
                    variant="gradient"
                    gradient={{ from: 'red', to: 'orange' }}
                    className="mx-auto mb-4"
                  >
                    <MailCheck size={30} />
                  </ThemeIcon>
                  <Badge size="lg" variant="gradient" gradient={{ from: 'red', to: 'orange' }} className="mb-2">
                    Almost There!
                  </Badge>
                  <Title order={2} className="text-3xl font-bold mb-2">Verify Your Email</Title>
                  <Text c="dimmed" size="sm">
                    We&apos;ve sent a verification code to your email address
                  </Text>
                </div>

                {/* Email Display */}
                {email && (
                  <Paper p="md" radius="md" withBorder className="bg-blue-50 dark:bg-blue-900/20">
                    <Group justify="space-between">
                      <Group gap="xs">
                        <Mail size={18} className="text-blue-500" />
                        <Text fw={500} size="sm">{email}</Text>
                      </Group>
                      <Group gap="xs">
                        <Tooltip label={copied ? 'Copied!' : 'Copy email'}>
                          <ActionIcon size="sm" variant="subtle" onClick={handleCopyEmail}>
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Change email">
                          <ActionIcon size="sm" variant="subtle" onClick={handleChangeEmail}>
                            <RefreshCw size={14} />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    </Group>
                  </Paper>
                )}

                {/* Alerts */}
                {error && (
                  <Alert 
                    icon={<AlertCircle size={16} />} 
                    title="Error" 
                    color="red" 
                    withCloseButton 
                    onClose={() => setError('')}
                  >
                    {error}
                  </Alert>
                )}

                {success && (
                  <Alert 
                    icon={<CheckCircle size={16} />} 
                    title="Success" 
                    color="green" 
                    withCloseButton 
                    onClose={() => setSuccess('')}
                  >
                    {success}
                  </Alert>
                )}

                <Text size="sm" c="dimmed" ta="center">
                  Enter the 6-digit verification code sent to your email
                </Text>

                {/* Code Input - Fixed */}
                <Group justify="center" mb="md">
                  <PinInput
                    length={6}
                    type="number"
                    value={verificationCode}
                    onChange={setVerificationCode}
                    size="xl"
                    radius="md"
                    disabled={isLoading}
                    oneTimeCode
                    styles={{
                      input: {
                        borderColor: '#d1d5db',
                        fontSize: '1.5rem',
                        fontWeight: 600,
                        '&:focus': {
                          borderColor: '#ef4444',
                        },
                      },
                    }}
                  />
                </Group>

                {/* Verify Button */}
                <Button
                  onClick={handleVerifyWithCode}
                  variant="gradient"
                  gradient={{ from: 'red', to: 'orange' }}
                  size="lg"
                  fullWidth
                  loading={isLoading}
                  rightSection={!isLoading && <CheckCircle size={20} />}
                  className="mb-4 h-12"
                >
                  {isLoading ? 'Verifying...' : 'Verify Email'}
                </Button>

                {/* Resend Section */}
                <Paper p="md" radius="md" withBorder className="bg-gray-50 dark:bg-gray-800">
                  <Stack gap="sm">
                    <Group justify="space-between">
                      <Text size="sm">Didn&apos;t receive the code?</Text>
                      <Button
                        variant="subtle"
                        color="red"
                        size="sm"
                        onClick={handleResendCode}
                        disabled={!canResend || isLoading || !email}
                        loading={isLoading}
                        leftSection={<Send size={16} />}
                      >
                        Resend Code
                      </Button>
                    </Group>
                    
                    {!canResend && (
                      <Group gap="xs" justify="center">
                        <Clock size={14} className="text-gray-500" />
                        <Text size="xs" c="dimmed">
                          Resend available in {countdown} seconds
                        </Text>
                      </Group>
                    )}

                    <Divider />

                    <Text size="xs" c="dimmed" ta="center">
                      Check your spam folder if you don&apos;t see the email in your inbox
                    </Text>
                  </Stack>
                </Paper>

                {/* Security Note */}
                <Paper p="xs" radius="md" withBorder className="bg-gray-50 dark:bg-gray-800">
                  <Group gap="xs" justify="center">
                    <Shield size={14} className="text-gray-500" />
                    <Text size="xs" c="dimmed">
                      For your security, verification codes expire after 24 hours
                    </Text>
                  </Group>
                </Paper>

                {/* Help Links */}
                <Group justify="center" gap="xs">
                  <Button
                    variant="subtle"
                    color="gray"
                    size="sm"
                    component={Link}
                    href="/login"
                  >
                    Back to Login
                  </Button>
                  <Text size="sm" c="dimmed">•</Text>
                  <Button
                    variant="subtle"
                    color="gray"
                    size="sm"
                    component={Link}
                    href="/contact"
                  >
                    Contact Support
                  </Button>
                </Group>
              </Stack>
            </Card>
          </GradientBorderCard>

          {/* Help Section */}
          <Group justify="center" mt="md">
            <Button
              variant="subtle"
              color="gray"
              size="sm"
              leftSection={<Phone size={14} />}
              component={Link}
              href="/contact"
            >
              Need help? Contact support
            </Button>
          </Group>
        </MotionDiv>
      </Container>

      {/* Floating Actions */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        <Tooltip label="Chat with us" position="left">
          <ActionIcon
            size="lg"
            radius="xl"
            variant="filled"
            color="blue"
            className="shadow-lg hover:scale-110 transition-transform"
            component={Link}
            href="/chat"
          >
            <MessageCircle size={20} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Call now" position="left">
          <ActionIcon
            size="lg"
            radius="xl"
            variant="filled"
            color="green"
            className="shadow-lg hover:scale-110 transition-transform"
            component="a"
            href="tel:+251911234567"
          >
            <Phone size={20} />
          </ActionIcon>
        </Tooltip>
      </div>

      <style jsx>{`
        @keyframes gradient-xy {
          0%, 100% {
            background-size: 400% 400%;
            background-position: left top;
          }
          25% {
            background-size: 400% 400%;
            background-position: right top;
          }
          50% {
            background-size: 400% 400%;
            background-position: right bottom;
          }
          75% {
            background-size: 400% 400%;
            background-position: left bottom;
          }
        }
        .animate-gradient-xy {
          animation: gradient-xy 3s ease infinite;
        }
      `}</style>
    </div>
  );
}