/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Container, Title, Text, Button, Card, Group, ThemeIcon, Badge, Stack, Divider, ActionIcon, Tooltip, Paper, TextInput, PasswordInput, Checkbox, Anchor, Alert, useMantineColorScheme } from '@mantine/core';
import { motion } from 'framer-motion';
import { useEffect, useState, useRef, ChangeEvent, FormEvent } from 'react';
import {
  Mail,
  Lock,
  LogIn,
  Eye,
  EyeOff,
  ArrowRight,
  Phone,
  MessageCircle,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

interface AnimatedInputProps {
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  type?: 'text' | 'email' | 'password';
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const MotionDiv = motion.div;

// Floating particles animation
const FloatingParticles = () => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Generate particles directly in useState initializer
  const [particles] = useState(() => {
    const colors = isDark 
      ? ['#ef4444', '#f97316', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899']
      : ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];
    
    return [...Array(20)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 4,
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
            opacity: 0.1,
          }}
          animate={{
            y: [0, -20, 0, 20, 0],
            x: [0, 20, 0, -20, 0],
            scale: [1, 1.1, 1, 0.9, 1],
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
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  
  return (
    <div className={`relative group ${className}`}>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-xy" />
      <div className={`relative rounded-lg ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        {children}
      </div>
    </div>
  );
};

// MagneticButton using div instead of button to avoid nesting issues
const MagneticButton: React.FC<MagneticButtonProps> = ({ children, onClick, className = '' }) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!buttonRef.current) return;
      
      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const distance = Math.sqrt(
        Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
      );
      
      if (distance < 100) {
        const strength = (100 - distance) / 100;
        const moveX = (e.clientX - centerX) * strength * 0.2;
        const moveY = (e.clientY - centerY) * strength * 0.2;
        setPosition({ x: moveX, y: moveY });
      } else {
        setPosition({ x: 0, y: 0 });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      ref={buttonRef}
      className={className}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15 }}
      onClick={onClick}
      style={{ display: 'inline-block', cursor: 'pointer', width: '100%' }}
    >
      {children}
    </motion.div>
  );
};

// Animated Input Field with proper typing
const AnimatedInput: React.FC<AnimatedInputProps> = ({ 
  icon, 
  label, 
  placeholder, 
  type = 'text', 
  value, 
  onChange, 
  error 
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <MotionDiv
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <Text size="sm" fw={500} mb={4} className={isDark ? 'text-gray-300' : 'text-gray-700'}>
        {label}
      </Text>
      <div className="relative">
        <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
          isFocused ? 'text-red-500' : isDark ? 'text-gray-500' : 'text-gray-400'
        }`}>
          {icon}
        </div>
        
        {type === 'password' ? (
          <PasswordInput
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            error={error}
            size="lg"
            radius="md"
            className="w-full"
            styles={{
              input: {
                paddingLeft: '2.5rem',
                backgroundColor: isDark ? '#1f2937' : 'white',
                color: isDark ? 'white' : '#1f2937',
                border: isFocused 
                  ? '2px solid #ef4444' 
                  : isDark 
                    ? '1px solid #374151' 
                    : '1px solid #d1d5db',
                transition: 'all 0.3s ease',
              },
            }}
            visibilityToggleIcon={({ reveal }) => 
              reveal ? <EyeOff size={18} /> : <Eye size={18} />
            }
          />
        ) : (
          <TextInput
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            error={error}
            size="lg"
            radius="md"
            className="w-full"
            type={type}
            styles={{
              input: {
                paddingLeft: '2.5rem',
                backgroundColor: isDark ? '#1f2937' : 'white',
                color: isDark ? 'white' : '#1f2937',
                border: isFocused 
                  ? '2px solid #ef4444' 
                  : isDark 
                    ? '1px solid #374151' 
                    : '1px solid #d1d5db',
                transition: 'all 0.3s ease',
              },
            }}
          />
        )}
        
        {isFocused && (
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-red-500 to-orange-500"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>
      {error && (
        <Text size="xs" c="red" mt={4}>
          {error}
        </Text>
      )}
    </MotionDiv>
  );
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function LoginPage() {
  const router = useRouter();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [needsVerification, setNeedsVerification] = useState<boolean>(false);

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    setEmailError('');
    setPasswordError('');
    setNeedsVerification(false);

    // Validation
    let isValid = true;
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    }

    if (!isValid) return;

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
          rememberMe
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.needsVerification || response.status === 401) {
          setNeedsVerification(true);
          router.push(`/verify-email?email=${encodeURIComponent(email)}`);
          return;
        }
        
        if (data.errors) {
          if (data.errors.email) setEmailError(data.errors.email);
          if (data.errors.password) setPasswordError(data.errors.password);
          throw new Error(data.message || 'Login failed');
        }
        
        throw new Error(data.message || 'Login failed');
      }

      if (data.data?.accessToken) {
        localStorage.setItem('accessToken', data.data.accessToken);
        
        if (data.data.user) {
          localStorage.setItem('user', JSON.stringify(data.data.user));
        }
        
        if (data.data.expiresIn) {
          const expiryTime = Date.now() + (data.data.expiresIn * 1000);
          localStorage.setItem('tokenExpiry', expiryTime.toString());
        }

        setSuccess('Login successful! Redirecting...');
        
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } else {
        throw new Error('Invalid response from server');
      }

    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerification = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend verification');
      }

      setSuccess('Verification email resent successfully! Please check your inbox.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
    setEmailError('');
    setNeedsVerification(false);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
    setPasswordError('');
  };

  const handleRememberMeChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setRememberMe(e.currentTarget.checked);
  };

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950' 
        : 'bg-gradient-to-b from-gray-50 to-white'
    }`}>
      <FloatingParticles />

      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/bg-2.jpg"
          alt="Background"
          fill
          className={`object-cover transition-opacity duration-300 ${
            isDark ? 'opacity-5' : 'opacity-10'
          }`}
          priority
        />
        <div className={`absolute inset-0 transition-colors duration-300 ${
          isDark ? 'bg-black/20' : 'bg-transparent'
        }`} />
      </div>

      <Container size="lg" className="relative z-10 min-h-screen flex items-center justify-center py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full items-center">
          {/* Left Column - Welcome Message */}
          <div className="hidden md:block">
            <MotionDiv
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge size="lg" variant="gradient" gradient={{ from: 'red', to: 'orange' }} className="mb-6">
                Welcome Back
              </Badge>

              <Title className={`text-5xl md:text-6xl font-bold mb-6 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Sign in to <br />
                <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  Lucia Printing
                </span>
              </Title>

              <Text size="xl" className={`mb-8 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Access your account to manage orders, track projects, and connect with our team.
              </Text>

              {/* Feature List */}
              <Stack gap="lg">
                <Group>
                  <ThemeIcon size={40} radius="xl" color="red" variant="light">
                    <CheckCircle size={20} />
                  </ThemeIcon>
                  <div>
                    <Text fw={600} className={isDark ? 'text-white' : 'text-gray-900'}>Order Management</Text>
                    <Text size="sm" c="dimmed">Track and manage all your printing orders</Text>
                  </div>
                </Group>

                <Group>
                  <ThemeIcon size={40} radius="xl" color="orange" variant="light">
                    <Sparkles size={20} />
                  </ThemeIcon>
                  <div>
                    <Text fw={600} className={isDark ? 'text-white' : 'text-gray-900'}>Design Library</Text>
                    <Text size="sm" c="dimmed">Access your saved designs and templates</Text>
                  </div>
                </Group>

                <Group>
                  <ThemeIcon size={40} radius="xl" color="green" variant="light">
                    <MessageCircle size={20} />
                  </ThemeIcon>
                  <div>
                    <Text fw={600} className={isDark ? 'text-white' : 'text-gray-900'}>Live Chat Support</Text>
                    <Text size="sm" c="dimmed">Instant help from our printing experts</Text>
                  </div>
                </Group>
              </Stack>
            </MotionDiv>
          </div>

          {/* Right Column - Login Form */}
          <div>
            <MotionDiv
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <GradientBorderCard>
                <Card padding="xl" radius="lg" className={`border-0 ${
                  isDark ? 'bg-gray-900' : 'bg-white'
                }`}>
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
                        <LogIn size={30} />
                      </ThemeIcon>
                      <Title order={2} className={`text-3xl font-bold mb-2 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        Welcome Back
                      </Title>
                      <Text c="dimmed">Sign in to continue to your account</Text>
                    </div>

                    {/* Alerts */}
                    {error && (
                      <Alert icon={<AlertCircle size={16} />} title="Error" color="red" withCloseButton onClose={() => setError('')}>
                        {error}
                      </Alert>
                    )}

                    {success && (
                      <Alert icon={<CheckCircle size={16} />} title="Success" color="green" withCloseButton onClose={() => setSuccess('')}>
                        {success}
                      </Alert>
                    )}

                    {needsVerification && (
                      <Alert 
                        icon={<AlertCircle size={16} />} 
                        title="Email Not Verified" 
                        color="yellow"
                      >
                        <Text size="sm">Please verify your email before logging in.</Text>
                        <Button
                          variant="subtle"
                          color="yellow"
                          size="xs"
                          onClick={resendVerification}
                          loading={isLoading}
                          className="mt-2"
                        >
                          Resend Verification Email
                        </Button>
                      </Alert>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit}>
                      <Stack gap="md">
                        <AnimatedInput
                          icon={<Mail size={18} />}
                          label="Email Address"
                          placeholder="your@email.com"
                          type="email"
                          value={email}
                          onChange={handleEmailChange}
                          error={emailError}
                        />

                        <AnimatedInput
                          icon={<Lock size={18} />}
                          label="Password"
                          placeholder="Enter your password"
                          type="password"
                          value={password}
                          onChange={handlePasswordChange}
                          error={passwordError}
                        />

                        {/* Remember Me & Forgot Password */}
                        <Group justify="space-between">
                          <Checkbox
                            label="Remember me"
                            checked={rememberMe}
                            onChange={handleRememberMeChange}
                            color="red"
                            classNames={{
                              label: isDark ? 'text-gray-300' : 'text-gray-700',
                            }}
                          />
                          <Anchor
                            component={Link}
                            href="/forgot-password"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            Forgot password?
                          </Anchor>
                        </Group>

                        {/* Submit Button */}
                        <MagneticButton>
                          <Button
                            type="submit"
                            size="lg"
                            fullWidth
                            variant="gradient"
                            gradient={{ from: 'red', to: 'orange' }}
                            rightSection={isLoading ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} />}
                            disabled={isLoading}
                            className="h-12"
                          >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                          </Button>
                        </MagneticButton>
                      </Stack>
                    </form>

                    {/* Sign Up Link */}
                    <Text ta="center" size="sm" c="dimmed">
                      Don&apos;t have an account?{' '}
                      <Anchor
                        component={Link}
                        href="/page/register"
                        fw={700}
                        className="text-red-600 hover:text-red-700"
                      >
                        Create Account
                      </Anchor>
                    </Text>

                    {/* Demo Credentials */}
                    <Paper p="xs" radius="md" withBorder className={`${
                      isDark 
                        ? 'bg-blue-900/10 border-blue-800/30' 
                        : 'bg-blue-50 border-blue-100'
                    }`}>
                      <Text size="xs" ta="center" c="dimmed">
                        Demo: demo@luciaprinting.com / password123
                      </Text>
                    </Paper>
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
                  className={isDark ? 'text-gray-400 hover:text-white' : ''}
                >
                  Need help? Contact support
                </Button>
              </Group>
            </MotionDiv>
          </div>
        </div>
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