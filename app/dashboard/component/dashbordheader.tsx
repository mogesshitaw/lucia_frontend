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
  Title,
} from '@mantine/core';
import {
  IconChevronDown,
  IconUser,
  IconSearch,
  IconBell,
  IconLogout,
  IconSettings,
  IconCreditCard,
} from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export default function Header({ toggleSidebar, isSidebarOpen }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpened, setSearchOpened] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get current page title
  const getPageTitle = () => {
    const path = pathname.split('/').pop();
    if (!path || path === 'dashboard') return 'Dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <header
      className={`w-full h-full flex items-center px-4 md:px-6 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <Group justify="space-between" className="w-full">
        <Group>
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
                <div className="w-[45px] h-[45px] rounded-full overflow-hidden border-2 border-black">
                  <Image
                    src="/images/logo.jpg"
                    alt="Lucia Printing Logo"
                    width={45}
                    height={45}
                    className="object-cover"
                    priority
                  />
                </div>
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              </div>
                 {/* Logo Text - Hidden on mobile, shown on sm and up */}
              <div className="hidden sm:flex flex-col min-w-0">
                <Text
                  size="lg"
                  fw={800}
                  className={`leading-tight truncate ${
                    scrolled 
                      ? 'text-gray-900 dark:text-white' 
                      : 'text-white'
                  }`}
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  Lucia
                </Text>
                <Text
                  size="sm"
                  fw={600}
                  className={`leading-tight truncate ${
                    scrolled 
                      ? 'text-red-600 dark:text-red-400' 
                      : 'text-red-400'
                  }`}
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                Printing & Advertising
                </Text>
              </div>

              {/* Mobile: Show only first letter or short name */}
              <div className="sm:hidden flex flex-col">
                <Text
                  size="md"
                  fw={800}
                  className={`leading-tight ${
                    scrolled 
                      ? 'text-gray-900 dark:text-white' 
                      : 'text-white'
                  }`}
                >
                  L
                </Text>
              </div>
            </Link>
          </Group>

          {/* <Title order={3} className="hidden md:block">{getPageTitle()}</Title> */}
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
          <Indicator label={3} size={16} color="red" offset={4}>
            <Tooltip label="Notifications" withArrow position="bottom">
              <ActionIcon size="lg" variant="subtle" color="gray">
                <IconBell size={20} />
              </ActionIcon>
            </Tooltip>
          </Indicator>

          {/* User Menu */}
          <Menu shadow="lg" width={200} position="bottom-end">
            <Menu.Target>
              <Group gap="xs" className="cursor-pointer">
                <Avatar src="https://i.pravatar.cc/150?img=7" size="md" radius="xl" />
                <div className="hidden md:block">
                  <Text size="sm" fw={500}>John Doe</Text>
                  <Text size="xs" c="dimmed">Administrator</Text>
                </div>
                <IconChevronDown size={14} className="hidden md:block" />
              </Group>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Account</Menu.Label>
              <Menu.Item leftSection={<IconUser size={14} />} component={Link} href="/dashboard/profile">
                Profile
              </Menu.Item>
              <Menu.Item leftSection={<IconSettings size={14} />} component={Link} href="/dashboard/settings">
                Settings
              </Menu.Item>
              <Menu.Item leftSection={<IconCreditCard size={14} />} component={Link} href="/dashboard/billing">
                Billing
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item leftSection={<IconLogout size={14} />} color="red">
                Logout
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
      >
        <TextInput
          placeholder="Search..."
          size="lg"
          radius="md"
          autoFocus
          leftSection={<IconSearch size={18} />}
        />
      </Drawer>
    </header>
  );
}

// Missing Title import
