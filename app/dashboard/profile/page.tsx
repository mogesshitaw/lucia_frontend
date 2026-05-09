/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Paper,
  Title,
  Text,
  Stack,
  Group,
  Button,
  TextInput,
  PasswordInput,
  Avatar,
  Divider,
  Alert,
  Loader,
  Center,
  Grid,
  Card,
  ThemeIcon,
  SimpleGrid,
  Badge,
  Tabs,
  Select,
  Switch,
} from '@mantine/core';
import {
  IconUser,
  IconMail,
  IconCalendar,
  IconEdit,
  IconCheck,
  IconX,
  IconExclamationCircle,
  IconLock,
  IconKey,
  IconHistory,
  IconBriefcase,
  IconShield,
  IconDeviceDesktop,
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface User {
  id: string;
  username: string;
  full_name: string | null;
  role: 'admin' | string;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
}

interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  details: string;
}

interface UserProfile {
  user: User;
  stats: {
    totalOrders: number;
    totalSpent: number;
  };
  recentActivity: ActivityLog[];
}

const DEFAULT_PROFILE: UserProfile = {
  user: {
    id: '',
    username: '',
    full_name: '',
    role: 'admin',
    is_active: true,
    last_login: null,
    created_at: new Date().toISOString(),
  },
  stats: {
    totalOrders: 0,
    totalSpent: 0,
  },
  recentActivity: [],
};

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>('profile');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const fetchProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/page/login');
        return;
      }

      // Get current user info
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/page/login');
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.user) {
        setProfile(prev => ({
          ...prev,
          user: data.user
        }));
      } else {
        setError(data.error || 'Failed to load profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Error loading profile');
    } finally {
      setLoading(false);
    }
  },[router]);

  useEffect(() => {
    fetchProfile();
    fetchUserStats();
  }, [fetchProfile]);


  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem('token');
      // You'll need to create this endpoint
      const response = await fetch(`${API_URL}/auth/users/stats`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProfile(prev => ({
            ...prev,
            stats: data.stats
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

 
  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/auth/users/profile`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: profile.user.full_name,
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        notifications.show({
          title: 'Success',
          message: 'Profile updated successfully',
          color: 'green',
        });
        setEditing(false);
        fetchProfile(); // Refresh data
      } else {
        throw new Error(data.error || 'Failed to update profile');
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update profile',
        color: 'red',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (file: File | null) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/auth/users/avatar`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        notifications.show({
          title: 'Success',
          message: 'Avatar updated successfully',
          color: 'green',
        });
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to upload avatar',
        color: 'red',
      });
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      notifications.show({
        title: 'Error',
        message: 'New passwords do not match',
        color: 'red',
      });
      return;
    }

    if (newPassword.length < 6) {
      notifications.show({
        title: 'Error',
        message: 'Password must be at least 6 characters',
        color: 'red',
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      
      const data = await response.json();
      if (data.success) {
        notifications.show({
          title: 'Success',
          message: 'Password changed successfully',
          color: 'green',
        });
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        throw new Error(data.error || 'Failed to change password');
      }
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.message,
        color: 'red',
      });
    }
  };

  const getInitials = () => {
    if (profile.user.full_name) {
      return profile.user.full_name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return profile.user.username.substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <Center h="100vh">
        <Loader size="lg" />
      </Center>
    );
  }

  if (error) {
    return (
      <Container size="xl" py="xl">
        <Alert icon={<IconExclamationCircle size={16} />} title="Error" color="red">
          {error}
        </Alert>
        <Group justify="center" mt="md">
          <Button onClick={fetchProfile}>Try Again</Button>
        </Group>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      {/* Profile Header Card */}
      <Paper withBorder p="xl" radius="md">
        <Group wrap="nowrap" align="flex-start" gap="xl">
          <Avatar
            size={120}
            radius={120}
            color="blue"
          >
            {getInitials()}
          </Avatar>

          <div style={{ flex: 1 }}>
            <Group justify="space-between" align="center" mb="xs">
              <div>
                <Title order={2}>
                  {profile.user.full_name || profile.user.username}
                </Title>
                <Text size="sm" c="dimmed">@{profile.user.username}</Text>
              </div>
              
              {!editing ? (
                <Button
                  variant="light"
                  leftSection={<IconEdit size={16} />}
                  onClick={() => setEditing(true)}
                >
                  Edit Profile
                </Button>
              ) : (
                <Group>
                  <Button
                    variant="filled"
                    color="green"
                    leftSection={<IconCheck size={16} />}
                    onClick={handleSaveProfile}
                    loading={saving}
                  >
                    Save
                  </Button>
                  <Button
                    variant="light"
                    color="red"
                    leftSection={<IconX size={16} />}
                    onClick={() => {
                      setEditing(false);
                      fetchProfile();
                    }}
                  >
                    Cancel
                  </Button>
                </Group>
              )}
            </Group>

            <Group gap="md" mt="md">
              <Badge size="lg" color={profile.user.role === 'admin' ? 'grape' : 'blue'}>
                Role: {profile.user.role}
              </Badge>
              <Badge size="lg" color={profile.user.is_active ? 'green' : 'red'}>
                Status: {profile.user.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </Group>

            <SimpleGrid cols={{ base: 1, sm: 2 }} mt="lg" spacing="md">
              <Group gap="xs">
                <IconMail size={16} />
                <Text size="sm">{profile.user.username}</Text>
              </Group>
              <Group gap="xs">
                <IconCalendar size={16} />
                <Text size="sm">
                  Joined: {dayjs(profile.user.created_at).format('MMMM D, YYYY')}
                </Text>
              </Group>
              {profile.user.last_login && (
                <Group gap="xs">
                  <IconHistory size={16} />
                  <Text size="sm">
                    Last login: {dayjs(profile.user.last_login).format('MMM D, YYYY h:mm A')}
                  </Text>
                </Group>
              )}
            </SimpleGrid>
          </div>
        </Group>
      </Paper>

      {/* Stats Cards */}
      <SimpleGrid cols={{ base: 1, sm: 2 }} mt="xl">
        <Card withBorder>
          <Group>
            <ThemeIcon size="lg" color="blue" variant="light">
              <IconBriefcase size={20} />
            </ThemeIcon>
            <div>
              <Text size="xs" c="dimmed">Total Orders</Text>
              <Text fw={700} size="xl">{profile.stats.totalOrders}</Text>
            </div>
          </Group>
        </Card>
        <Card withBorder>
          <Group>
            <ThemeIcon size="lg" color="green" variant="light">
              <IconBriefcase size={20} />
            </ThemeIcon>
            <div>
              <Text size="xs" c="dimmed">Total Spent</Text>
              <Text fw={700} size="xl">${profile.stats.totalSpent.toLocaleString()}</Text>
            </div>
          </Group>
        </Card>
      </SimpleGrid>

      {/* Tabs */}
      <Tabs value={activeTab} onChange={setActiveTab} mt="xl">
        <Tabs.List>
          <Tabs.Tab value="profile" leftSection={<IconUser size={16} />}>
            Profile Information
          </Tabs.Tab>
          <Tabs.Tab value="security" leftSection={<IconLock size={16} />}>
            Security
          </Tabs.Tab>
        </Tabs.List>

        {/* Profile Information Tab */}
        <Tabs.Panel value="profile" pt="xl">
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Paper withBorder p="xl">
                <Stack>
                  <Title order={3}>Personal Information</Title>
                  
                  <TextInput
                    label="Username"
                    value={profile.user.username}
                    disabled={true}
                    description="Username cannot be changed"
                  />

                  <TextInput
                    label="Full Name"
                    value={profile.user.full_name || ''}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        user: { ...profile.user, full_name: e.target.value }
                      })
                    }
                    disabled={!editing}
                    placeholder="Enter your full name"
                  />

                  <Select
                    label="Role"
                    value={profile.user.role}
                    data={[
                      { value: 'admin', label: 'Administrator' },
                      { value: 'user', label: 'User' },
                    ]}
                    disabled={true}
                    description="Role cannot be changed by users"
                  />

                  <Switch
                    label="Account Status"
                    checked={profile.user.is_active}
                    disabled={true}
                    description="Contact administrator to change status"
                  />
                </Stack>
              </Paper>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Paper withBorder p="xl">
                <Stack>
                  <Title order={4}>Account Information</Title>
                  
                  <div>
                    <Text size="sm" fw={500} mb={5}>Account Created</Text>
                    <Text size="sm" c="dimmed">
                      {dayjs(profile.user.created_at).format('MMMM D, YYYY h:mm A')}
                    </Text>
                  </div>

                  {profile.user.last_login && (
                    <div>
                      <Text size="sm" fw={500} mb={5}>Last Login</Text>
                      <Text size="sm" c="dimmed">
                        {dayjs(profile.user.last_login).format('MMMM D, YYYY h:mm A')}
                      </Text>
                    </div>
                  )}

                  <Divider />

                  <div>
                    <Text size="sm" fw={500} mb={5}>Account ID</Text>
                    <Text size="xs" c="dimmed" style={{ fontFamily: 'monospace' }}>
                      {profile.user.id}
                    </Text>
                  </div>
                </Stack>
              </Paper>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        {/* Security Tab */}
        <Tabs.Panel value="security" pt="xl">
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Paper withBorder p="xl">
                <Stack>
                  <Title order={3}>Change Password</Title>
                  
                  <PasswordInput
                    label="Current Password"
                    placeholder="Enter current password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                  
                  <PasswordInput
                    label="New Password"
                    placeholder="Enter new password (min. 6 characters)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  
                  <PasswordInput
                    label="Confirm New Password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  
                  <Button
                    variant="gradient"
                    gradient={{ from: 'blue', to: 'cyan' }}
                    leftSection={<IconKey size={16} />}
                    onClick={handleChangePassword}
                    fullWidth
                  >
                    Update Password
                  </Button>
                </Stack>
              </Paper>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Paper withBorder p="xl">
                <Stack>
                  <Title order={3}>Security Settings</Title>
                  
                  <Card withBorder bg="gray.0">
                    <Group>
                      <ThemeIcon size="lg" color="blue" variant="light">
                        <IconShield size={20} />
                      </ThemeIcon>
                      <div style={{ flex: 1 }}>
                        <Text fw={500}>Session Management</Text>
                        <Text size="xs" c="dimmed">
                          Manage your active sessions and devices
                        </Text>
                      </div>
                      <Button variant="light" color="red" size="xs">
                        Logout All
                      </Button>
                    </Group>
                  </Card>

                  <Card withBorder bg="gray.0">
                    <Group>
                      <ThemeIcon size="lg" color="green" variant="light">
                        <IconDeviceDesktop size={20} />
                      </ThemeIcon>
                      <div style={{ flex: 1 }}>
                        <Text fw={500}>Current Session</Text>
                        <Text size="xs" c="dimmed">
                          You are logged in on this device
                        </Text>
                      </div>
                      <Badge color="green">Active</Badge>
                    </Group>
                  </Card>

                  <Alert color="yellow" title="Security Note">
                    For security reasons, always log out when using public computers.
                    Never share your password with anyone.
                  </Alert>
                </Stack>
              </Paper>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}