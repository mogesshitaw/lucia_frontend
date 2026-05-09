/* eslint-disable @typescript-eslint/no-explicit-any */
// frontend/app/page/login/page.tsx
'use client';

import { useState, useEffect } from 'react';
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
  Loader,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconLogin, IconUser, IconLock, IconAlertCircle, IconArrowRight, IconCheck } from '@tabler/icons-react';
import { api } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [redirecting, setRedirecting] = useState(false);

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Already logged in, redirecting to dashboard');
      router.replace('/dashboard');
    }
  }, [router]);

  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },
    validate: {
      username: (value) => (!value ? 'Username is required' : null),
      password: (value) => (!value ? 'Password is required' : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    setError('');

    try {
      console.log('Attempting login with:', values.username);
      
      const response = await api.post('/auth/login', {
        username: values.username,
        password: values.password,
      });

      console.log('Login response:', response.data);

      if (response.data.success && response.data.token) {
        // Save token and user data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Set token expiry if provided
        if (response.data.expiresIn) {
          const expiryTime = Date.now() + (response.data.expiresIn * 1000);
          localStorage.setItem('tokenExpiry', expiryTime.toString());
        }
        
        console.log('Token saved successfully');
        
        notifications.show({
          title: 'Success',
          message: 'Login successful! Redirecting...',
          color: 'green',
          icon: <IconCheck size={16} />,
          autoClose: 2000,
        });
        
        // Set redirecting state
        setRedirecting(true);
        
        // Use a small delay before redirecting
        setTimeout(() => {
          console.log('Redirecting to dashboard...');
          // Use replace instead of push to prevent going back to login
          router.replace('/dashboard');
        }, 500);
      } else {
        throw new Error(response.data.error || 'Login failed');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.error || err.message || 'An error occurred during login';
      setError(errorMessage);
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
      });
      setRedirecting(false);
    } finally {
      setLoading(false);
    }
  };

  // Show loading while redirecting
  if (redirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <Loader size="lg" className="mb-4" />
          <Text size="lg" className="mb-2">Login successful!</Text>
          <Text size="sm" c="dimmed">Redirecting to dashboard...</Text>
        </div>
      </div>
    );
  }

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
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 mb-4">
              <IconLogin size={32} className="text-white" />
            </div>
            <Title order={2} className="text-gray-900 dark:text-white mb-2">
              Welcome Back
            </Title>
            <Text size="sm" c="dimmed">
              Sign in to your account to continue
            </Text>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              title="Login Failed"
              color="red"
              withCloseButton
              onClose={() => setError('')}
              className="mb-6"
            >
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput
                label="Username"
                placeholder="Enter your username"
                leftSection={<IconUser size={18} />}
                {...form.getInputProps('username')}
                disabled={loading}
                autoFocus
              />

              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                leftSection={<IconLock size={18} />}
                {...form.getInputProps('password')}
                disabled={loading}
              />

              <Button
                type="submit"
                fullWidth
                size="lg"
                loading={loading}
                rightSection={<IconArrowRight size={18} />}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                Sign In
              </Button>
            </Stack>
          </form>

          <Divider label="or" labelPosition="center" my="lg" />

          {/* Register Link */}
          <Group justify="center">
            <Text size="sm" c="dimmed">
              Don&apos;t have an account?
            </Text>
            <Anchor
              component={Link}
              href="/page/register"
              size="sm"
              fw={500}
              className="text-blue-600 hover:text-blue-700"
            >
              Create account
            </Anchor>
          </Group>

          {/* Demo Credentials */}
          <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <Text size="xs" c="dimmed" ta="center">
              Demo credentials:
            </Text>
            <Text size="xs" c="dimmed" ta="center">
              Username: admin / Password: admin123
            </Text>
          </div>
        </Paper>
      </Container>
    </div>
  );
}