/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Group,
  Text,
  Avatar,
  Menu,
  ActionIcon,
  Tooltip,
  Badge,
  LoadingOverlay,
  Modal,
  PasswordInput,
  Button,
  Stack,
  Divider,
  useMantineColorScheme,
  Image,
  Box,
  Burger,
} from '@mantine/core';
import {
  IconChevronDown,
  IconUser,
  IconLogout,
  IconSettings,
  IconDashboard,
  IconLock,
  IconEyeCheck,
  IconUserCircle,
  IconKey,
  IconSun,
  IconMoon,
  IconMenu2,
} from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { notifications } from '@mantine/notifications';
import { useForm } from '@mantine/form';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface User {
  id: string;
  username: string;
  full_name: string | null;
  role: string;
  avatar?: string;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
}

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  onLogout?: () => void;
}

export default function Header({ toggleSidebar, isSidebarOpen, onLogout }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [changePasswordOpened, setChangePasswordOpened] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const [user, setUser] = useState<User | null>(null);
  const [logoError, setLogoError] = useState(false);

  const passwordForm = useForm({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validate: {
      currentPassword: (value) => {
        if (!value) return 'Current password is required';
        return null;
      },
      newPassword: (value) => {
        if (!value) return 'New password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return null;
      },
      confirmPassword: (value, values) => 
        value !== values.newPassword ? 'Passwords do not match' : null,
    },
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchUserData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/page/login');
        return;
      }

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
        setUser(data.user);
      } else {
        console.error('Failed to load user data');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }, [router]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      if (token) {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
        }).catch(() => null);
      }
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      notifications.show({
        title: 'Success',
        message: 'Logged out successfully',
        color: 'green',
      });
      
      if (onLogout) {
        onLogout();
      }
      
      router.push('/page/login');
    } catch (error) {
      console.error('Logout error:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to logout',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (values: typeof passwordForm.values) => {
    setPasswordLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oldPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        notifications.show({
          title: 'Success',
          message: 'Password changed successfully',
          color: 'green',
        });
        setChangePasswordOpened(false);
        passwordForm.reset();
      } else {
        throw new Error(data.error || 'Failed to change password');
      }
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to change password',
        color: 'red',
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const getPageTitle = () => {
    const titles: Record<string, string> = {
      dashboard: 'Dashboard',
      announcements: 'Announcements',
      services: 'Services',
      testimonials: 'Testimonials',
      settings: 'Settings',
      profile: 'Profile',
    };
    
    const path = pathname.split('/').pop() || 'dashboard';
    return titles[path] || path.charAt(0).toUpperCase() + path.slice(1);
  };

  const getUserInitials = () => {
    const displayName = user?.full_name || user?.username || 'User';
    return displayName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleColor = (role: string) => {
    const roleColors: Record<string, string> = {
      admin: 'red',
      manager: 'orange',
      user: 'blue',
    };
    return roleColors[role?.toLowerCase()] || 'gray';
  };

  const formatRole = (role: string) => {
    if (role?.toLowerCase() === 'admin') return 'Admin';
    if (role?.toLowerCase() === 'manager') return 'Manager';
    return 'User';
  };

  return (
    <>
      <header
        className={`w-full h-full flex items-center px-4 md:px-6 transition-all duration-300 relative ${
          scrolled 
            ? `bg-white/95 backdrop-blur-md shadow-sm ${isDark ? 'dark:bg-gray-900/95' : ''}` 
            : 'bg-transparent'
        }`}
      >
        <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />
        
        <Group justify="space-between" className="w-full">
          {/* Left side - Logo and Page Title */}
          <Group gap="md">
           <Burger
              opened={isSidebarOpen}
              onClick={toggleSidebar}
              size="sm"
              className="md:hidden"
              aria-label="Toggle navigation"
            />
               {/* Logo Section */}
          <Group gap="xs">
            <Link href="/dashboard" className="flex items-center gap-2 no-underline">
              <div className="relative">
                <div className="w-[45px] h-[45px] rounded-full overflow-hidden border-2 border-red-500 shadow-lg  hidden md:block">
                  <Image
                    src="/images/logo.jpg"
                    alt="Lucia Printing Logo"
                    width={45}
                    height={45}
                    className="object-cover "
                  />
                </div>
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              </div>

              {/* Logo Text */}
              <div className="hidden sm:flex flex-col min-w-0">
                <Text
                  size="lg"
                  fw={800}
                  className={`leading-tight truncate transition-colors duration-300`}
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  Lucia 
                </Text>
                <Text
                  size="sm"
                  fw={500}
                  className={`leading-tight truncate transition-colors duration-300 `}
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                 Printing && Advertising
                </Text>
              </div>

              {/* Mobile: Short logo */}
              <div className="sm:hidden flex flex-col">
                <Text
                  size="md"
                  fw={800}
                  className={`leading-tight transition-colors duration-300 `}
                >
                  Lucia
                </Text>
              </div>
            </Link>
          </Group>

            {/* Vertical Divider */}
            <div className={`hidden md:block h-8 w-px ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`} />
            
            {/* Page Title */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="hidden md:block"
            >
              <Text size="xl" fw={600} className={isDark ? 'text-white' : 'text-gray-800'}>
                {getPageTitle()}
              </Text>
            </motion.div>
          </Group>

          {/* Right side - Theme toggle and User menu */}
          <Group gap="lg">
            {/* Theme Toggle */}
            <Tooltip label={isDark ? 'Light Mode' : 'Dark Mode'} withArrow position="bottom">
              <ActionIcon 
                size="lg" 
                variant="subtle" 
                color="gray"
                onClick={() => toggleColorScheme()}
              >
                {isDark ? <IconSun size={20} /> : <IconMoon size={20} />}
              </ActionIcon>
            </Tooltip>

            {/* User Menu */}
            <Menu shadow="lg" width={280} position="bottom-end" withArrow>
              <Menu.Target>
                <Group gap="xs" className="cursor-pointer hover:opacity-80 transition-opacity">
                  <Avatar 
                    src={user?.avatar || null} 
                    size="md" 
                    radius="xl"
                    color={getRoleColor(user?.role || '')}
                  >
                    {getUserInitials()}
                  </Avatar>
                  <div className="hidden md:block">
                    <Group gap="xs">
                      <Text size="sm" fw={500} className={isDark ? 'text-white' : 'text-gray-800'}>
                        {user?.full_name || user?.username || 'User'}
                      </Text>
                      <Badge 
                        size="xs" 
                        color={getRoleColor(user?.role || '')}
                        variant="light"
                      >
                        {formatRole(user?.role || 'user')}
                      </Badge>
                    </Group>
                  </div>
                  <IconChevronDown size={14} className="hidden md:block" />
                </Group>
              </Menu.Target>
              
              <Menu.Dropdown className={isDark ? 'dark' : ''}>
                {/* User Info Header */}
                <div className={`px-3 py-2 bg-gradient-to-r from-red-50 to-orange-50 ${isDark ? 'dark:from-red-900/20 dark:to-orange-900/20' : ''} rounded-t-lg`}>
                  <Group>
                    <Avatar 
                      src={user?.avatar || null} 
                      size="md" 
                      radius="xl"
                      color={getRoleColor(user?.role || '')}
                    >
                      {getUserInitials()}
                    </Avatar>
                    <div>
                      <Text fw={600} size="sm" className={isDark ? 'text-white' : ''}>
                        {user?.full_name || user?.username || 'User'}
                      </Text>
                      <Badge 
                        size="xs" 
                        color={getRoleColor(user?.role || '')}
                        variant="light"
                        className="mt-1"
                      >
                        {formatRole(user?.role || 'user')}
                      </Badge>
                    </div>
                  </Group>
                </div>

                <Menu.Label>Account Management</Menu.Label>
                <Menu.Item 
                  leftSection={<IconUserCircle size={14} />} 
                  component={Link} 
                  href="/dashboard/profile"
                >
                  View Profile
                </Menu.Item>
                <Menu.Item 
                  leftSection={<IconKey size={14} />} 
                  onClick={() => setChangePasswordOpened(true)}
                >
                  Change Password
                </Menu.Item>
                
                <Menu.Divider />
                
                <Menu.Label>Quick Links</Menu.Label>
                <Menu.Item 
                  leftSection={<IconDashboard size={14} />} 
                  component={Link} 
                  href="/dashboard"
                >
                  Dashboard
                </Menu.Item>
                
                <Menu.Divider />
                
                <Menu.Label>Settings</Menu.Label>
                <Menu.Item 
                  leftSection={<IconSettings size={14} />} 
                  component={Link} 
                  href="/dashboard/settings"
                >
                  Account Settings
                </Menu.Item>
                
                <Menu.Divider />
                
                <Menu.Item 
                  leftSection={<IconLogout size={14} />} 
                  color="red"
                  onClick={handleLogout}
                  disabled={loading}
                >
                  {loading ? 'Logging out...' : 'Logout'}
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </header>

      {/* Change Password Modal */}
      <Modal
        opened={changePasswordOpened}
        onClose={() => {
          setChangePasswordOpened(false);
          passwordForm.reset();
        }}
        title="Change Password"
        size="md"
        radius="lg"
        centered
        className={isDark ? 'dark' : ''}
      >
        <form onSubmit={passwordForm.onSubmit(handleChangePassword)}>
          <Stack gap="md">
            <PasswordInput
              label="Current Password"
              placeholder="Enter your current password"
              leftSection={<IconLock size={16} />}
              required
              {...passwordForm.getInputProps('currentPassword')}
            />

            <PasswordInput
              label="New Password"
              placeholder="Enter new password"
              leftSection={<IconKey size={16} />}
              required
              description="Password must be at least 6 characters"
              {...passwordForm.getInputProps('newPassword')}
            />

            <PasswordInput
              label="Confirm New Password"
              placeholder="Confirm your new password"
              leftSection={<IconEyeCheck size={16} />}
              required
              {...passwordForm.getInputProps('confirmPassword')}
            />

            <Divider />

            <Group justify="flex-end">
              <Button 
                variant="light" 
                color="gray" 
                onClick={() => {
                  setChangePasswordOpened(false);
                  passwordForm.reset();
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                loading={passwordLoading}
                variant="gradient"
                gradient={{ from: 'red', to: 'orange' }}
              >
                Change Password
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
}