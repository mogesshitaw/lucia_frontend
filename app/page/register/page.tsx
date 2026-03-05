/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Container, Title, Text, Button, Card, Group, ThemeIcon, Badge, Stack, Divider, ActionIcon, Tooltip, Paper, TextInput, PasswordInput, Checkbox, Anchor, Alert, Select } from '@mantine/core';
import { motion } from 'framer-motion';
import { useState, ChangeEvent, FormEvent } from 'react';
import {
  Mail,
  Lock,
  UserPlus,
  Eye,
  EyeOff,
  ArrowRight,
  ChevronRight,
  Facebook,
  Twitter,
  Instagram,
  Send,
  Phone,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  User,
  Briefcase,
  Award,
  Heart,
  Rocket,
  Zap,
  Users,
  Clock,
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
  type?: 'text' | 'email' | 'password' | 'tel';
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
}

interface AnimatedPasswordInputProps {
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
}

interface SocialButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  color: string;
  loading?: boolean;
}

interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const MotionDiv = motion.div;
const MotionCard = motion(Card as any);

// Floating particles animation - FIXED VERSION
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

// Animated Input Field
const AnimatedInput: React.FC<AnimatedInputProps> = ({ 
  icon, 
  label, 
  placeholder, 
  type = 'text', 
  value, 
  onChange, 
  error,
  required = false 
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  return (
    <MotionDiv
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <Text size="sm" fw={500} mb={4} className="text-gray-700 dark:text-gray-300">
        {label} {required && <span className="text-red-500">*</span>}
      </Text>
      <div className="relative">
        <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
          isFocused ? 'text-red-500' : 'text-gray-400'
        }`}>
          {icon}
        </div>
        
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
          required={required}
          styles={{
            input: {
              paddingLeft: '2.5rem',
              backgroundColor: 'transparent',
              border: isFocused ? '2px solid #ef4444' : '1px solid #d1d5db',
              transition: 'all 0.3s ease',
            },
          }}
        />
        
        {isFocused && (
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-red-500 to-orange-500"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>
    </MotionDiv>
  );
};

// Animated Password Field
const AnimatedPasswordInput: React.FC<AnimatedPasswordInputProps> = ({ 
  icon, 
  label, 
  placeholder, 
  value, 
  onChange, 
  error,
  required = false 
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  return (
    <MotionDiv
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <Text size="sm" fw={500} mb={4} className="text-gray-700 dark:text-gray-300">
        {label} {required && <span className="text-red-500">*</span>}
      </Text>
      <div className="relative">
        <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
          isFocused ? 'text-red-500' : 'text-gray-400'
        }`}>
          {icon}
        </div>
        
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
          required={required}
          styles={{
            input: {
              paddingLeft: '2.5rem',
              backgroundColor: 'transparent',
              border: isFocused ? '2px solid #ef4444' : '1px solid #d1d5db',
              transition: 'all 0.3s ease',
            },
          }}
          visibilityToggleIcon={({ reveal }) => 
            reveal ? <EyeOff size={18} /> : <Eye size={18} />
          }
        />
        
        {isFocused && (
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-red-500 to-orange-500"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>
    </MotionDiv>
  );
};

// Social Register Button
const SocialButton: React.FC<SocialButtonProps> = ({ icon, label, onClick, color, loading }) => {
  return (
    <Button
      variant="outline"
      size="lg"
      radius="md"
      fullWidth
      leftSection={icon}
      onClick={onClick}
      loading={loading}
      className="hover:border-red-500 transition-all duration-300"
      styles={{
        root: {
          borderColor: '#e5e7eb',
          color: '#374151',
          '&:hover': {
            borderColor: '#ef4444',
            backgroundColor: 'white',
          },
        },
      }}
    >
      {label}
    </Button>
  );
};

// Password Strength Indicator
const PasswordStrength = ({ password }: { password: string }) => {
  const getStrength = () => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.match(/[a-z]/)) score++;
    if (password.match(/[A-Z]/)) score++;
    if (password.match(/[0-9]/)) score++;
    if (password.match(/[^a-zA-Z0-9]/)) score++;
    return score;
  };

  const strength = getStrength();
  const percentage = (strength / 5) * 100;

  const getColor = () => {
    if (strength <= 2) return 'red';
    if (strength <= 4) return 'yellow';
    return 'green';
  };

  const getMessage = () => {
    if (strength <= 2) return 'Weak password';
    if (strength <= 4) return 'Medium password';
    return 'Strong password';
  };

  return (
    <div className="mt-2">
      <div className="flex justify-between mb-1">
        <Text size="xs" c="dimmed">Password strength:</Text>
        <Text size="xs" c={getColor()}>{getMessage()}</Text>
      </div>
      <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3 }}
          className={`h-full bg-${getColor()}-500`}
        />
      </div>
      <Text size="xs" c="dimmed" className="mt-1">
        Use at least 8 characters with mix of letters, numbers & symbols
      </Text>
    </div>
  );
};

// Benefit Card
const BenefitCard: React.FC<BenefitCardProps> = ({ icon, title, description }) => {
  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      padding="md"
      radius="lg"
      withBorder
      className="bg-white/50 backdrop-blur-sm"
    >
      <Group>
        <ThemeIcon size={40} radius="xl" color="red" variant="light">
          {icon}
        </ThemeIcon>
        <div>
          <Text fw={600}>{title}</Text>
          <Text size="sm" c="dimmed">{description}</Text>
        </div>
      </Group>
    </MotionCard>
  );
};

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    company: '',
    accountType: 'individual',
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  const accountTypes = [
    { value: 'individual', label: 'Individual' },
    { value: 'business', label: 'Business' },
    { value: 'designer', label: 'Designer / Creative' },
    { value: 'reseller', label: 'Reseller' },
  ];

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const re = /^\+?[0-9]{10,15}$/;
    return phone === '' || re.test(phone);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  const handleChange = (field: string) => (e: ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSelectChange = (field: string) => (value: string | null) => {
    setFormData(prev => ({ ...prev, [field]: value || '' }));
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, agreeTerms: e.target.checked }));
    setErrors(prev => ({ ...prev, agreeTerms: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      agreeTerms: '',
    };
    let isValid = true;

    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    } else {
      const hasUpperCase = /[A-Z]/.test(formData.password);
      const hasLowerCase = /[a-z]/.test(formData.password);
      const hasNumbers = /\d/.test(formData.password);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);
      
      if (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecial)) {
        newErrors.password = 'Password must contain uppercase, lowercase, number and special character';
        isValid = false;
      }
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Simulated registration function - Replace with actual API call
  const registerUser = async (userData: typeof formData) => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate success for demo
        // For testing error: reject(new Error('Email already exists'))
        resolve({ 
          success: true, 
          message: 'Registration successful!',
          data: { email: userData.email }
        });
      }, 1500);
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await registerUser(formData) as any;
      
      setSuccess('Registration successful! Please check your email to verify your account.');
      
      // Store email for verification page
      localStorage.setItem('verificationEmail', formData.email);
      
      // Clear form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        company: '',
        accountType: 'individual',
        agreeTerms: false,
      });

      // Redirect to verification page
      setTimeout(() => {
        router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
      }, 3000);

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during registration';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialRegister = async (provider: string) => {
    setSocialLoading(provider);
    
    try {
      // Simulate social registration - Replace with actual OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`Registering with ${provider}`);
      
      // In a real app, you would redirect to OAuth provider:
      // const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      // window.location.href = `${API_URL}/api/auth/${provider.toLowerCase()}`;
      
      setSocialLoading(null);
      // Show success message or redirect
      setSuccess(`Successfully connected with ${provider}`);
    } catch (err) {
      console.error(err);
      setError(`Failed to connect to ${provider}`);
      setSocialLoading(null);
    }
  };

  const nextStep = () => {
    const step1Errors: any = {};
    let isValid = true;

    if (!formData.firstName) {
      step1Errors.firstName = 'First name is required';
      isValid = false;
    }
    if (!formData.lastName) {
      step1Errors.lastName = 'Last name is required';
      isValid = false;
    }
    if (!formData.email) {
      step1Errors.email = 'Email is required';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      step1Errors.email = 'Please enter a valid email';
      isValid = false;
    }

    if (isValid) {
      setCurrentStep(2);
    } else {
      setErrors(prev => ({ ...prev, ...step1Errors }));
    }
  };

  const prevStep = () => {
    setCurrentStep(1);
  };

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

      <Container size="xl" className="relative z-10 min-h-screen flex items-center justify-center py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full items-start">
          {/* Left Column - Benefits & Info */}
          <div className="hidden md:block md:col-span-5">
            <MotionDiv
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="sticky top-24"
            >
              <Badge size="lg" variant="gradient" gradient={{ from: 'red', to: 'orange' }} className="mb-6">
                Join Our Community
              </Badge>

              <Title className="text-4xl md:text-5xl font-bold mb-6">
                Create Your <br />
                <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  Lucia Printing
                </span>
                <br />Account
              </Title>

              <Text size="lg" className="text-gray-600 dark:text-gray-400 mb-8">
                Get access to exclusive features, manage your orders, and connect with our design team.
              </Text>

              {/* Benefits Grid */}
              <Stack gap="md">
                <BenefitCard
                  icon={<Rocket size={20} />}
                  title="Fast & Easy Ordering"
                  description="Upload designs and get quotes in minutes"
                />
                <BenefitCard
                  icon={<Award size={20} />}
                  title="Member Discounts"
                  description="Exclusive offers and loyalty rewards"
                />
                <BenefitCard
                  icon={<Clock size={20} />}
                  title="Order History"
                  description="Track all your past orders easily"
                />
                <BenefitCard
                  icon={<Heart size={20} />}
                  title="Saved Designs"
                  description="Store your favorite designs for later"
                />
                <BenefitCard
                  icon={<Users size={20} />}
                  title="Team Accounts"
                  description="Manage multiple users with business accounts"
                />
                <BenefitCard
                  icon={<Zap size={20} />}
                  title="Priority Support"
                  description="Get faster responses from our team"
                />
              </Stack>

              {/* Stats */}
              <Paper p="md" radius="lg" withBorder className="mt-8 bg-white/50 backdrop-blur-sm">
                <Group justify="space-around">
                  <div className="text-center">
                    <Text fw={700} size="xl" className="text-red-600">5000+</Text>
                    <Text size="sm" c="dimmed">Happy Clients</Text>
                  </div>
                  <div className="text-center">
                    <Text fw={700} size="xl" className="text-red-600">13+</Text>
                    <Text size="sm" c="dimmed">Years</Text>
                  </div>
                  <div className="text-center">
                    <Text fw={700} size="xl" className="text-red-600">24/7</Text>
                    <Text size="sm" c="dimmed">Support</Text>
                  </div>
                </Group>
              </Paper>
            </MotionDiv>
          </div>

          {/* Right Column - Registration Form */}
          <div className="col-span-12 md:col-span-7">
            <MotionDiv
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
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
                        <UserPlus size={30} />
                      </ThemeIcon>
                      <Title order={2} className="text-3xl font-bold mb-2">Create Account</Title>
                      <Text c="dimmed">Join Lucia Printing and start your printing journey</Text>
                    </div>

                    {/* Progress Steps */}
                    <Group justify="center" gap="xs">
                      {[1, 2].map((step) => (
                        <div key={step} className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            currentStep >= step ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'
                          }`}>
                            {step}
                          </div>
                          {step < 2 && (
                            <div className={`w-12 h-1 mx-1 ${
                              currentStep > step ? 'bg-red-600' : 'bg-gray-200'
                            }`} />
                          )}
                        </div>
                      ))}
                    </Group>

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

                    {/* Registration Form */}
                    <form onSubmit={handleSubmit}>
                      <Stack gap="md">
                        {currentStep === 1 ? (
                          <>
                            {/* Step 1: Basic Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <AnimatedInput
                                icon={<User size={18} />}
                                label="First Name"
                                placeholder="John"
                                value={formData.firstName}
                                onChange={handleChange('firstName')}
                                error={errors.firstName}
                                required
                              />
                              <AnimatedInput
                                icon={<User size={18} />}
                                label="Last Name"
                                placeholder="Doe"
                                value={formData.lastName}
                                onChange={handleChange('lastName')}
                                error={errors.lastName}
                                required
                              />
                            </div>

                            <AnimatedInput
                              icon={<Mail size={18} />}
                              label="Email Address"
                              placeholder="john@example.com"
                              type="email"
                              value={formData.email}
                              onChange={handleChange('email')}
                              error={errors.email}
                              required
                            />

                            <AnimatedInput
                              icon={<Phone size={18} />}
                              label="Phone Number (Optional)"
                              placeholder="+251 911 234 567"
                              type="tel"
                              value={formData.phone}
                              onChange={handleChange('phone')}
                              error={errors.phone}
                            />

                            <AnimatedInput
                              icon={<Briefcase size={18} />}
                              label="Company/Organization (Optional)"
                              placeholder="Your Company"
                              value={formData.company}
                              onChange={handleChange('company')}
                            />

                            <Select
                              label="Account Type"
                              placeholder="Select account type"
                              data={accountTypes}
                              value={formData.accountType}
                              onChange={handleSelectChange('accountType')}
                              size="lg"
                              radius="md"
                              styles={{
                                input: {
                                  backgroundColor: 'transparent',
                                  border: '1px solid #d1d5db',
                                  '&:focus': {
                                    borderColor: '#ef4444',
                                  },
                                },
                              }}
                            />

                            <Button
                              size="lg"
                              variant="gradient"
                              gradient={{ from: 'red', to: 'orange' }}
                              onClick={nextStep}
                              rightSection={<ArrowRight size={20} />}
                              className="mt-4"
                            >
                              Continue
                            </Button>
                          </>
                        ) : (
                          <>
                            {/* Step 2: Security & Agreement */}
                            <AnimatedPasswordInput
                              icon={<Lock size={18} />}
                              label="Password"
                              placeholder="Create a strong password"
                              value={formData.password}
                              onChange={handleChange('password')}
                              error={errors.password}
                              required
                            />

                            {formData.password && <PasswordStrength password={formData.password} />}

                            <AnimatedPasswordInput
                              icon={<Lock size={18} />}
                              label="Confirm Password"
                              placeholder="Re-enter your password"
                              value={formData.confirmPassword}
                              onChange={handleChange('confirmPassword')}
                              error={errors.confirmPassword}
                              required
                            />

                            <Paper p="md" radius="md" withBorder className="bg-blue-50 dark:bg-blue-900/20">
                              <Text size="sm" fw={500} mb="xs">Password Requirements:</Text>
                              <ul className="space-y-1 text-sm">
                                <li className="flex items-center gap-2">
                                  <CheckCircle size={14} className={formData.password.length >= 8 ? 'text-green-500' : 'text-gray-400'} />
                                  At least 8 characters
                                </li>
                                <li className="flex items-center gap-2">
                                  <CheckCircle size={14} className={/[a-z]/.test(formData.password) ? 'text-green-500' : 'text-gray-400'} />
                                  Contains lowercase letter
                                </li>
                                <li className="flex items-center gap-2">
                                  <CheckCircle size={14} className={/[A-Z]/.test(formData.password) ? 'text-green-500' : 'text-gray-400'} />
                                  Contains uppercase letter
                                </li>
                                <li className="flex items-center gap-2">
                                  <CheckCircle size={14} className={/[0-9]/.test(formData.password) ? 'text-green-500' : 'text-gray-400'} />
                                  Contains number
                                </li>
                                <li className="flex items-center gap-2">
                                  <CheckCircle size={14} className={/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'text-green-500' : 'text-gray-400'} />
                                  Contains special character
                                </li>
                              </ul>
                            </Paper>

                            <Checkbox
                              label={
                                <Text size="sm">
                                  I agree to the{' '}
                                  <Anchor href="/terms" className="text-red-600 hover:text-red-700">
                                    Terms of Service
                                  </Anchor>{' '}
                                  and{' '}
                                  <Anchor href="/privacy" className="text-red-600 hover:text-red-700">
                                    Privacy Policy
                                  </Anchor>
                                </Text>
                              }
                              checked={formData.agreeTerms}
                              onChange={handleCheckboxChange}
                              color="red"
                              error={errors.agreeTerms}
                            />

                            <div className="flex gap-4">
                              <Button
                                size="lg"
                                variant="light"
                                color="gray"
                                onClick={prevStep}
                                leftSection={<ChevronRight size={20} className="rotate-180" />}
                                className="flex-1"
                              >
                                Back
                              </Button>
                              <Button
                                type="submit"
                                size="lg"
                                variant="gradient"
                                gradient={{ from: 'red', to: 'orange' }}
                                rightSection={isLoading ? <Loader2 className="animate-spin" size={20} /> : <UserPlus size={20} />}
                                disabled={isLoading}
                                className="flex-1"
                              >
                                {isLoading ? 'Creating Account...' : 'Create Account'}
                              </Button>
                            </div>
                          </>
                        )}
                      </Stack>
                    </form>

                    {/* Divider */}
                    <Divider label="Or register with" labelPosition="center" />

                    {/* Social Registration */}
                    <div className="grid grid-cols-2 gap-4">
                      <SocialButton
                        icon={<Facebook size={18} />}
                        label="Facebook"
                        onClick={() => handleSocialRegister('Facebook')}
                        color="#1877F2"
                        loading={socialLoading === 'Facebook'}
                      />
                      <SocialButton
                        icon={<Twitter size={18} />}
                        label="Twitter"
                        onClick={() => handleSocialRegister('Twitter')}
                        color="#1DA1F2"
                        loading={socialLoading === 'Twitter'}
                      />
                      <SocialButton
                        icon={<Instagram size={18} />}
                        label="Instagram"
                        onClick={() => handleSocialRegister('Instagram')}
                        color="#E4405F"
                        loading={socialLoading === 'Instagram'}
                      />
                      <SocialButton
                        icon={<Send size={18} />}
                        label="Telegram"
                        onClick={() => handleSocialRegister('Telegram')}
                        color="#0088cc"
                        loading={socialLoading === 'Telegram'}
                      />
                    </div>

                    {/* Sign In Link */}
                    <Text ta="center" size="sm">
                      Already have an account?{' '}
                      <Anchor
                        component={Link}
                        href="/login"
                        fw={700}
                        className="text-red-600 hover:text-red-700"
                      >
                        Sign In
                      </Anchor>
                    </Text>
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