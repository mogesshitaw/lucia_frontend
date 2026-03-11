'use client';

import { useState, useEffect } from 'react';
import {
  Group,
  Text,
  Avatar,
  Menu,
  ActionIcon,
  Tooltip,
  Indicator,
  TextInput,
  Drawer,
  Burger,
  Badge,
  LoadingOverlay,
  rem,
} from '@mantine/core';
import {
  IconChevronDown,
  IconUser,
  IconSearch,
  IconBell,
  IconLogout,
  IconSettings,
  IconCreditCard,
  IconDashboard,
  IconFileText,
  IconMessage,
} from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { notifications } from '@mantine/notifications';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  user?: {
    id: string;
    full_name: string;
    email: string;
    role: string;
    department_name?: string;
    avatar?: string;
    is_first_login?: boolean;
  } | null;
  onLogout?: () => void;
}

export default function Header({ toggleSidebar, isSidebarOpen, user, onLogout }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpened, setSearchOpened] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch notifications count (optional)
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token || !user) return;
        
        const response = await fetch(`${API_URL}/api/notifications/count`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.success) {
          setNotificationsCount(data.count || 0);
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    fetchNotifications();
  }, [user]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      
      // Call logout API
      if (token) {
        await fetch(`${API_URL}/api/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      
      // Clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      
      notifications.show({
        title: 'Success',
        message: 'Logged out successfully',
        color: 'green',
      });
      
      // Call custom onLogout if provided
      if (onLogout) {
        onLogout();
      }
      
      // Redirect to home
      router.push('/');
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to logout',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  // Get current page title from pathname
  const getPageTitle = () => {
    const path = pathname.split('/').pop();
    if (!path || path === 'dashboard') return 'Dashboard';
    
    // Format the title (e.g., "manage-users" -> "Manage Users")
    return path
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user?.full_name) return 'U';
    return user.full_name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get role badge color
  const getRoleColor = (role: string) => {
    const roleColors: Record<string, string> = {
      admin: 'red',
      manager: 'orange',
      cashier: 'green',
      instructor: 'blue',
      student: 'grape',
      department_head: 'violet',
    };
    return roleColors[role?.toLowerCase()] || 'gray';
  };

  // Format role for display
  const formatRole = (role: string) => {
    return role
      ?.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ') || 'User';
  };

  return (
    <header
      className={`w-full h-full flex items-center px-4 md:px-6 transition-all duration-300 relative ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm dark:bg-gray-900/95' : 'bg-transparent'
      }`}
    >
      <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />
      
      <Group justify="space-between" className="w-full">
        <Group>
          <Burger
            opened={isSidebarOpen}
            onClick={toggleSidebar}
            size="sm"
            className="md:hidden"
            aria-label="Toggle navigation"
          />
          
          {/* Page Title */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="hidden md:block"
          >
            <Text size="xl" fw={700} className="text-gray-800 dark:text-white">
              {getPageTitle()}
            </Text>
          </motion.div>
        </Group>

        <Group gap="lg">
          {/* Search */}
          <div className="hidden md:block relative">
            <IconSearch size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <TextInput
              placeholder="Search..."
              className="w-64"
              size="sm"
              radius="md"
              styles={{
                input: {
                  paddingLeft: '2.5rem',
                  backgroundColor: scrolled ? 'white' : '#f8f9fa',
                  border: 'none',
                  '&:focus': {
                    border: '1px solid #ef4444',
                  },
                },
              }}
            />
          </div>

          {/* Notifications */}
          <Indicator 
            label={notificationsCount} 
            size={16} 
            color="red" 
            offset={4}
            disabled={notificationsCount === 0}
          >
            <Tooltip label="Notifications" withArrow position="bottom">
              <ActionIcon 
                size="lg" 
                variant="subtle" 
                color="gray"
                onClick={() => router.push('/dashboard/notifications')}
              >
                <IconBell size={20} />
              </ActionIcon>
            </Tooltip>
          </Indicator>

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
                    <Text size="sm" fw={500}>{user?.full_name || 'User'}</Text>
                    <Badge 
                      size="xs" 
                      color={getRoleColor(user?.role || '')}
                      variant="light"
                    >
                      {formatRole(user?.role || 'user')}
                    </Badge>
                  </Group>
                  <Text size="xs" c="dimmed">{user?.email || 'user@example.com'}</Text>
                </div>
                <IconChevronDown size={14} className="hidden md:block" />
              </Group>
            </Menu.Target>
            
            <Menu.Dropdown>
              {/* User Info Header */}
              <div className="px-3 py-2 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-t-lg">
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
                    <Text fw={600} size="sm">{user?.full_name || 'User'}</Text>
                    <Text size="xs" c="dimmed">{user?.email || 'user@example.com'}</Text>
                  </div>
                </Group>
              </div>

              <Menu.Label>Quick Actions</Menu.Label>
              <Menu.Item 
                leftSection={<IconDashboard size={14} />} 
                component={Link} 
                href="/dashboard"
              >
                Dashboard
              </Menu.Item>
              <Menu.Item 
                leftSection={<IconUser size={14} />} 
                component={Link} 
                href="/dashboard/profile"
              >
                My Profile
              </Menu.Item>
              <Menu.Item 
                leftSection={<IconFileText size={14} />} 
                component={Link} 
                href="/dashboard/my-uploads"
              >
                My Uploads
              </Menu.Item>
              <Menu.Item 
                leftSection={<IconMessage size={14} />} 
                component={Link} 
                href="/dashboard/messages"
              >
                Messages
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
              <Menu.Item 
                leftSection={<IconCreditCard size={14} />} 
                component={Link} 
                href="/dashboard/billing"
              >
                Billing & Payments
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

      {/* Mobile Search Drawer */}
      <Drawer
        opened={searchOpened}
        onClose={() => setSearchOpened(false)}
        position="top"
        size="auto"
        padding="md"
        radius="md"
      >
        <TextInput
          placeholder="Search..."
          size="lg"
          radius="md"
          autoFocus
          leftSection={<IconSearch size={18} />}
          rightSection={
            <ActionIcon size="sm" onClick={() => setSearchOpened(false)}>
              ✕
            </ActionIcon>
          }
        />
      </Drawer>
    </header>
  );
}