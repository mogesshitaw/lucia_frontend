/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect } from 'react';
import {
  Stack,
  Text,
  Group,
  Avatar,
  Button,
  Tooltip,
  Menu,
  Badge,
  ScrollArea,
  ActionIcon,
  useMantineColorScheme,
  Box,
} from '@mantine/core';
import {
  IconLayoutDashboard,
  IconPackage,
  IconSettings,
  IconLogout,
  IconChevronRight,
  IconUser,
  IconSettings2,
  IconBell,
  IconBuildingStore,
  IconCategory,
  IconSun,
  IconMoon,
  IconChevronLeft,
  IconFileText,
} from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { notifications } from '@mantine/notifications';

const MotionDiv = motion.div;

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
  badgeColor?: string;
  children?: SidebarItem[];
}

interface SidebarProps {
  opened: boolean;
  toggleSidebar: () => void;
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

const childVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: 'auto' },
};

const SidebarItemComponent = ({
  item,
  isActive,
  isExpanded,
  depth = 0,
  isDark,
}: {
  item: SidebarItem;
  isActive: boolean;
  isExpanded: boolean;
  depth?: number;
  isDark: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    if (item.children) {
      setIsOpen(!isOpen);
    } else {
      router.push(item.href);
    }
  };

  return (
    <MotionDiv
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.2, delay: depth * 0.05 }}
      style={{ paddingLeft: depth * 16 }}
      className="mb-1"
    >
      <Tooltip
        label={item.label}
        position="right"
        withArrow
        disabled={isExpanded}
        transitionProps={{ duration: 200 }}
      >
        <Button
          variant={isActive ? 'light' : 'subtle'}
          color={isActive ? 'red' : 'gray'}
          fullWidth
          justify={isExpanded ? 'space-between' : 'center'}
          leftSection={
            <div className={isActive ? 'text-red-500' : isDark ? 'text-gray-400' : 'text-gray-600'}>
              {item.icon}
            </div>
          }
          rightSection={
            isExpanded && item.children ? (
              <motion.div animate={{ rotate: isOpen ? 90 : 0 }}>
                <IconChevronRight size={16} />
              </motion.div>
            ) : isExpanded && item.badge ? (
              <Badge 
                size="sm" 
                color={item.badgeColor || 'red'} 
                variant="filled"
                radius="xl"
              >
                {item.badge}
              </Badge>
            ) : null
          }
          onClick={handleClick}
          className={`${!isExpanded ? 'px-2' : ''} transition-all duration-200`}
          styles={{
            root: {
              height: '44px',
              width: '100%',
              borderRadius: '8px',
              backgroundColor: isActive 
                ? isDark ? 'rgba(240, 62, 62, 0.15)' : undefined 
                : 'transparent',
              '&:hover': {
                backgroundColor: isDark 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'rgba(0, 0, 0, 0.05)',
                transform: isExpanded ? 'translateX(4px)' : 'none',
              },
            },
            inner: {
              justifyContent: isExpanded ? 'space-between' : 'center',
              gap: isExpanded ? '12px' : '0',
            },
            label: {
              flex: 1,
              textAlign: 'left',
              fontWeight: isActive ? 600 : 400,
              color: isActive 
                ? isDark ? '#ff6b6b' : '#fa5252'
                : isDark ? '#c1c2c5' : '#495057',
            },
          }}
        >
          {isExpanded && item.label}
        </Button>
      </Tooltip>

      <AnimatePresence>
        {item.children && isOpen && isExpanded && (
          <MotionDiv
            variants={childVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
            className="ml-4 mt-1"
          >
            {item.children.map((child) => (
              <SidebarItemComponent
                key={child.id}
                item={child}
                isActive={false}
                isExpanded={isExpanded}
                depth={depth + 1}
                isDark={isDark}
              />
            ))}
          </MotionDiv>
        )}
      </AnimatePresence>
    </MotionDiv>
  );
};

export default function DashboardSidebar({ opened, toggleSidebar }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const [logoError, setLogoError] = useState(false);
  
  const [activeItem, setActiveItem] = useState('dashboard');
  const [userData, setUserData] = useState({
    name: 'Admin User',
    email: 'admin@luciaprinting.com',
    role: 'Admin',
  });

  useEffect(() => {
    const path = pathname.split('/').pop() || 'dashboard';
    setActiveItem(path);
  }, [pathname]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          setUserData(prev => ({
            ...prev,
            name: user.full_name || user.name || user.username || prev.name,
            email: user.email || prev.email,
            role: user.role === 'admin' ? 'Admin' : 'User',
          }));
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const sidebarItems: SidebarItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <IconLayoutDashboard size={18} />,
      href: '/dashboard',
    },
    {
      id: 'services',
      label: 'Services',
      icon: <IconBuildingStore size={18} />,
      href: '/dashboard/service',
      children: [
        {
          id: 'service-categories',
          label: 'Categories',
          icon: <IconCategory size={16} />,
          href: '/dashboard/services/categories',
        },
        {
          id: 'service-list',
          label: 'All Services',
          icon: <IconPackage size={16} />,
          href: '/dashboard/services',
        },
      ],
    },
    {
      id: 'announcements',
      label: 'Announcements',
      icon: <IconBell size={18} />,
      href: '/dashboard/announcements',
    },
    {
      id: 'testimonials',
      label: 'Testimonials',
      icon: <IconFileText size={18} />,
      href: '/dashboard/testimonials',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <IconSettings size={18} />,
      href: '/dashboard/settings',
    },
  ];

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      notifications.show({
        title: 'Logged Out',
        message: 'You have been logged out successfully',
        color: 'blue',
      });
      
      router.push('/page/login');
    }
  };

  return (
    <div className={`h-full flex flex-col ${
      isDark ? 'bg-gray-900' : 'bg-white'
    } transition-all duration-300`}>
      {/* Header with Logo and Collapse Button */}
      <div className={`p-4 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <Group justify="space-between" align="center" wrap="nowrap">
          <Group gap="sm" wrap="nowrap" style={{ flex: 1 }}>
            {/* Logo with error handling */}
            {!logoError ? (
              <img
                src="/images/logo.jpg"
                alt="Logo"
                width={opened ? 40 : 32}
                height={opened ? 40 : 32}
                className="rounded-lg object-cover"
                onError={() => setLogoError(true)}
                style={{ 
                  width: opened ? '40px' : '32px', 
                  height: opened ? '40px' : '32px',
                  transition: 'all 0.3s ease'
                }}
              />
            ) : (
              <Avatar
                size={opened ? 40 : 32}
                radius="lg"
                color="red"
                style={{ transition: 'all 0.3s ease' }}
              >
                SP
              </Avatar>
            )}
            
            {opened && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                style={{ overflow: 'hidden' }}
              >
                <Text fw={700} size="md" className={isDark ? 'text-white' : 'text-gray-900'} truncate>
                  SPUMS
                </Text>
                <Text size="xs" c="dimmed" truncate>Print Management</Text>
              </motion.div>
            )}
          </Group>
          
          {/* Collapse/Expand Button - Improved */}
          <Tooltip 
            label={opened ? 'Collapse sidebar' : 'Expand sidebar'} 
            position="right"
          >
            <ActionIcon
              variant="subtle"
              onClick={toggleSidebar}
              size="md"
              className={isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
            >
              {opened ? <IconChevronLeft size={18} /> : <IconChevronRight size={18} />}
            </ActionIcon>
          </Tooltip>
        </Group>
      </div>

      {/* Navigation Items */}
      <ScrollArea className="flex-1 px-2 py-2" offsetScrollbars scrollbarSize={4}>
        <Stack gap={2}>
          {sidebarItems.map((item) => (
            <SidebarItemComponent
              key={item.id}
              item={item}
              isActive={activeItem === item.id || pathname.includes(item.id)}
              isExpanded={opened}
              isDark={isDark}
            />
          ))}
        </Stack>
      </ScrollArea>

      {/* User Profile Section - Fixed */}
      <div className={`p-4 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <Group justify="space-between" align="center" wrap="nowrap">
          <Group gap="md" wrap="nowrap" style={{ flex: 1 }}>
            <Avatar
              size={opened ? 'md' : 'sm'}
              radius="xl"
              color="red"
              style={{ transition: 'all 0.3s ease' }}
            >
              {userData.name.charAt(0).toUpperCase()}
            </Avatar>
            {opened && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                style={{ flex: 1, minWidth: 0 }}
              >
                <Text size="sm" fw={500} truncate className={isDark ? 'text-white' : 'text-gray-900'}>
                  {userData.name}
                </Text>
                <Box>
                  <Text size="xs" component="span" c="dimmed">Role: </Text>
                  <Badge size="xs" color="red" variant="light">
                    {userData.role}
                  </Badge>
                </Box>
              </motion.div>
            )}
          </Group>

          <Menu shadow="lg" width={220} position="top-end" withinPortal>
            <Menu.Target>
              <ActionIcon 
                variant="subtle" 
                color="gray"
                size="md"
                className={isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600'}
              >
                <IconSettings2 size={18} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown className={isDark ? 'dark' : ''}>
              <Menu.Label>User Settings</Menu.Label>
              <Menu.Item 
                leftSection={<IconUser size={14} />} 
                component={Link} 
                href="/dashboard/profile"
              >
                Profile
              </Menu.Item>
              <Menu.Item 
                leftSection={<IconSettings size={14} />} 
                component={Link} 
                href="/dashboard/settings"
              >
                Settings
              </Menu.Item>
              
              <Menu.Divider />
              
              <Menu.Label>Preferences</Menu.Label>
              <Menu.Item
                leftSection={isDark ? <IconSun size={14} /> : <IconMoon size={14} />}
                onClick={() => toggleColorScheme()}
              >
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </Menu.Item>
              
              <Menu.Divider />
              
              <Menu.Item 
                leftSection={<IconLogout size={14} />} 
                color="red"
                onClick={handleLogout}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </div>
    </div>
  );
}