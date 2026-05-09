/* eslint-disable @typescript-eslint/no-explicit-any */
// frontend/app/page/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from '@mantine/form';
import {
  Container,
  Paper,
  Title,
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Text,
  Anchor,
  Alert,
  Group,
  Divider,
  Progress,
  Box,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconUserPlus, IconUser, IconLock, IconMail, IconAlertCircle, IconArrowRight, IconCheck } from '@tabler/icons-react';
import { authApi } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const form = useForm({
    initialValues: {
      username: '',
      full_name: '',
      password: '',
      confirmPassword: '',
    },
    validate: {
      username: (value) => (!value ? 'Username is required' : null),
      password: (value) => {
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return null;
      },
      confirmPassword: (value, values) =>
        value !== values.password ? 'Passwords do not match' : null,
    },
  });

  // Password strength calculator
  const calculateStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 6) strength += 20;
    if (password.length >= 8) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;
    return Math.min(strength, 100);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    form.setFieldValue('password', password);
    setPasswordStrength(calculateStrength(password));
  };

  const getStrengthColor = () => {
    if (passwordStrength < 40) return 'red';
    if (passwordStrength < 70) return 'yellow';
    return 'green';
  };

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    setError('');

    try {
      const response = await authApi.register({
        username: values.username,
        password: values.password,
        full_name: values.full_name,
      });
      
      if (response.success && response.token) {
        // Save token and user data
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        notifications.show({
          title: 'Success',
          message: 'Account created successfully! Redirecting...',
          color: 'green',
          icon: <IconCheck size={16} />,
        });
        
        // Redirect to dashboard
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } else {
        throw new Error(response.error || 'Registration failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
      notifications.show({
        title: 'Error',
        message: err.message || 'Registration failed',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Container size="xs" className="w-full">
        <Paper
          radius="lg"
          p="xl"
          withBorder
          className="bg-white dark:bg-gray-800 shadow-xl"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-green-600 mb-4">
              <IconUserPlus size={32} className="text-white" />
            </div>
            <Title order={2} className="text-gray-900 dark:text-white mb-2">
              Create Account
            </Title>
            <Text size="sm" c="dimmed">
              Join us to start managing your printing business
            </Text>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              title="Registration Failed"
              color="red"
              withCloseButton
              onClose={() => setError('')}
              className="mb-6"
            >
              {error}
            </Alert>
          )}

          {/* Registration Form */}
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput
                label="Username"
                placeholder="Choose a username"
                leftSection={<IconUser size={18} />}
                {...form.getInputProps('username')}
                disabled={loading}
                autoFocus
              />

              <TextInput
                label="Full Name (Optional)"
                placeholder="Enter your full name"
                leftSection={<IconMail size={18} />}
                {...form.getInputProps('full_name')}
                disabled={loading}
              />

              <PasswordInput
                label="Password"
                placeholder="Create a password"
                leftSection={<IconLock size={18} />}
                {...form.getInputProps('password')}
                onChange={handlePasswordChange}
                disabled={loading}
              />
              
              {/* Password Strength Indicator */}
              {form.values.password && (
                <Box>
                  <Progress
                    value={passwordStrength}
                    color={getStrengthColor()}
                    size="sm"
                    className="mt-1"
                  />
                  <Text size="xs" c="dimmed" className="mt-1">
                    {passwordStrength < 40 && 'Weak password'}
                    {passwordStrength >= 40 && passwordStrength < 70 && 'Medium password'}
                    {passwordStrength >= 70 && 'Strong password'}
                  </Text>
                </Box>
              )}

              <PasswordInput
                label="Confirm Password"
                placeholder="Confirm your password"
                leftSection={<IconLock size={18} />}
                {...form.getInputProps('confirmPassword')}
                disabled={loading}
              />

              <Button
                type="submit"
                fullWidth
                size="lg"
                loading={loading}
                rightSection={<IconArrowRight size={18} />}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                Create Account
              </Button>
            </Stack>
          </form>

          <Divider label="or" labelPosition="center" my="lg" />

          {/* Login Link */}
          <Group justify="center">
            <Text size="sm" c="dimmed">
              Already have an account?
            </Text>
            <Anchor
              component={Link}
              href="/page/login"
              size="sm"
              fw={500}
              className="text-green-600 hover:text-green-700"
            >
              Sign in
            </Anchor>
          </Group>

          {/* Info Text */}
          <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Text size="xs" c="dimmed" ta="center">
              By creating an account, you agree to our Terms of Service and Privacy Policy.
            </Text>
          </div>
        </Paper>
      </Container>
    </div>
  );
}