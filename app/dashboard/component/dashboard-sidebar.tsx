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
} from '@mantine/core';
import {
  IconLayoutDashboard,
  IconPackage,
  IconUsers,
  IconSettings,
  IconLogout,
  IconChevronRight,
  IconChartBar,
  IconMessage,
  IconUser,
  IconSettings2,
  IconBell,
  IconBuildingStore,
  IconCategory,
  IconSun,
  IconMoon,
  IconChevronLeft,
} from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

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

// Animation variants
const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

const childVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: 'auto' },
};

// Helper function to determine if dark mode is active
const isDarkMode = (colorScheme: 'light' | 'dark' | 'auto'): boolean => {
  if (colorScheme === 'dark') return true;
  if (colorScheme === 'light') return false;
  // For 'auto', check system preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

// Sidebar Item Component with animations
const SidebarItemComponent = ({
  item,
  isActive,
  isExpanded,
  depth = 0,
  colorScheme,
}: {
  item: SidebarItem;
  isActive: boolean;
  isExpanded: boolean;
  depth?: number;
  colorScheme: 'light' | 'dark' | 'auto';
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const isDark = isDarkMode(colorScheme);

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
          {!isExpanded && item.badge && (
            <div className="absolute -top-1 -right-1">
              <Badge 
                size="xs" 
                color={item.badgeColor || 'red'} 
                variant="filled" 
                circle
              >
                {item.badge}
              </Badge>
            </div>
          )}
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
                colorScheme={colorScheme}
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
  
  // Use the helper function to determine actual dark mode state
  const isDark = isDarkMode(colorScheme);
  
  const [activeItem, setActiveItem] = useState('dashboard');
  const [userData, setUserData] = useState({
    name: 'Admin User',
    email: 'admin@luciaprinting.com',
    role: 'Administrator',
  });

  useEffect(() => {
    const path = pathname.split('/').pop() || 'dashboard';
    setActiveItem(path);
  }, [pathname]);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          setUserData(prev => ({
            ...prev,
            name: user.full_name || user.name || prev.name,
            email: user.email || prev.email,
            role: user.role || prev.role,
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
      href: '/dashboard/services',
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
      icon: <IconMessage size={18} />,
      href: '/dashboard/testimonials',
      badge: 3,
      badgeColor: 'violet',
    },
    {
      id: 'users',
      label: 'Users',
      icon: <IconUsers size={18} />,
      href: '/dashboard/manage-user',
      badge: 5,
      badgeColor: 'green',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <IconChartBar size={18} />,
      href: '/dashboard/analytics',
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
      const token = localStorage.getItem('accessToken');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      router.push('/page/login');
    }
  };

  return (
    <div className={`h-full flex flex-col ${
      isDark ? 'bg-gray-900' : 'bg-white'
    } transition-colors duration-200`}>
      {/* Header with Logo and Collapse Button */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <Group justify="space-between" align="center">
          <Group gap="sm">
            <Avatar
              src="/images/logo.jpg"
              size={opened ? 40 : 32}
              radius="xl"
            />
            {opened && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Text fw={700} size="lg" className={isDark ? 'text-white' : 'text-gray-900'}>
                  Lucia Admin
                </Text>
                <Text size="xs" c="dimmed">Dashboard</Text>
              </motion.div>
            )}
          </Group>
          
          {/* Collapse/Expand Button */}
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
              colorScheme={colorScheme} // Pass the original colorScheme which can be 'light' | 'dark' | 'auto'
            />
          ))}
        </Stack>
      </ScrollArea>

      {/* User Profile Section */}
      <div className={`p-4 border-t ${
        isDark ? 'border-gray-800' : 'border-gray-200'
      }`}>
        <Group justify="space-between" align="center" wrap="nowrap">
          <Group gap="md" wrap="nowrap" style={{ flex: 1 }}>
            <Avatar
              size={opened ? 'md' : 'sm'}
              radius="xl"
              color="red"
            >
              {userData.name.charAt(0)}
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
                <Group gap={4}>
                  <Badge size="xs" color="red" variant="light">
                    {userData.role}
                  </Badge>
                </Group>
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