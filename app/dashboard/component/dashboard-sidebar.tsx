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
  TextInput,
} from '@mantine/core';
import {
  IconLayoutDashboard,
  IconPackage,
  IconShoppingCart,
  IconUsers,
  IconSettings,
  IconLogout,
  IconSearch,
  IconChevronRight,
  IconChartBar,
  IconMessage,
  IconCalendar,
  IconClock,
  IconUser,
  IconAlertCircle,
  IconCheck,
  IconSettings2,
  IconUsersGroup,
  IconBox,
  IconDatabase,
  IconUserPlus,
  IconPhoto,
  IconUpload,
  IconPhotoCheck,
  IconPhotoX,
  IconCategory,
  IconTag,
  IconHistory,
  IconStar,
  IconCloudUpload,
} from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

// const MotionDiv = motion.div;

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
  children?: SidebarItem[];
}

interface SidebarProps {
  opened: boolean;
}

// Sidebar Item Component
const SidebarItemComponent = ({
  item,
  isActive,
  isExpanded,
  depth = 0,
  onItemClick,
}: {
  item: SidebarItem;
  isActive: boolean;
  isExpanded: boolean;
  depth?: number;
  onItemClick?: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    if (item.children) {
      setIsOpen(!isOpen);
    } else {
      router.push(item.href);
      if (onItemClick) onItemClick();
    }
  };

  return (
    <div style={{ paddingLeft: depth * 12 }} className="mb-1">
      <Tooltip
        label={item.label}
        position="right"
        withArrow
        disabled={isExpanded}
      >
        <Button
          variant={isActive ? 'light' : 'subtle'}
          color={isActive ? 'red' : 'gray'}
          fullWidth
          justify={isExpanded ? 'space-between' : 'center'}
          leftSection={item.icon}
          rightSection={
            isExpanded && item.children ? (
              <motion.div animate={{ rotate: isOpen ? 90 : 0 }}>
                <IconChevronRight size={16} />
              </motion.div>
            ) : isExpanded && item.badge ? (
              <Badge size="xs" color="red" variant="filled" circle>
                {item.badge}
              </Badge>
            ) : null
          }
          onClick={handleClick}
          className={`${!isExpanded ? 'px-2' : ''}`}
          styles={{
            root: {
              height: '44px',
              width: '100%',
              '&:hover': {
                backgroundColor: isActive ? undefined : 'rgba(0,0,0,0.05)',
              },
            },
            inner: {
              justifyContent: isExpanded ? 'space-between' : 'center',
              gap: isExpanded ? '12px' : '0',
            },
            label: {
              flex: 1,
              textAlign: 'left',
            },
          }}
        >
          {isExpanded && item.label}
          {!isExpanded && item.badge && (
            <div className="absolute -top-1 -right-1">
              <Badge size="xs" color="red" variant="filled" circle>
                {item.badge}
              </Badge>
            </div>
          )}
        </Button>
      </Tooltip>

      {item.children && isOpen && isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="ml-4 mt-1"
        >
          {item.children.map((child) => (
            <SidebarItemComponent
              key={child.id}
              item={child}
              isActive={false}
              isExpanded={isExpanded}
              depth={depth + 1}
              onItemClick={onItemClick}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default function DashboardSidebar({ opened }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [activeItem, setActiveItem] = useState('dashboard');
  const [imageStats, setImageStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  });

  useEffect(() => {
    const path = pathname.split('/').pop() || 'dashboard';
    setActiveItem(path);
  }, [pathname]);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  // Fetch image stats
  useEffect(() => {
    const fetchImageStats = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${API_URL}/api/images/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setImageStats(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch image stats:', error);
      }
    };

    fetchImageStats();
  }, [API_URL]);

  const sidebarItems: SidebarItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <IconLayoutDashboard size={20} />,
      href: '/dashboard',
    },
    {
      id: 'images',
      label: 'Image Management',
      icon: <IconPhoto size={20} />,
      href: '/dashboard/images',
      badge: imageStats.pending,
      children: [
        {
          id: 'upload',
          label: 'Upload Images',
          icon: <IconCloudUpload size={16} />,
          href: '/dashboard/images/upload',
        },
        {
          id: 'all-images',
          label: 'All Images',
          icon: <IconPhoto size={16} />,
          href: '/dashboard/images',
          badge: imageStats.total,
        },
        {
          id: 'pending',
          label: 'Pending Approval',
          icon: <IconPhotoCheck size={16} />,
          href: '/dashboard/images?status=pending',
          badge: imageStats.pending,
        },
        {
          id: 'approved',
          label: 'Approved',
          icon: <IconCheck size={16} />,
          href: '/dashboard/images?status=approved',
          badge: imageStats.approved,
        },
        {
          id: 'rejected',
          label: 'Rejected',
          icon: <IconPhotoX size={16} />,
          href: '/dashboard/images?status=rejected',
          badge: imageStats.rejected,
        },
        {
          id: 'favorites',
          label: 'Favorites',
          icon: <IconStar size={16} />,
          href: '/dashboard/images/favorites',
        },
        {
          id: 'categories',
          label: 'Categories',
          icon: <IconCategory size={16} />,
          href: '/dashboard/images/categories',
        },
        {
          id: 'tags',
          label: 'Tags',
          icon: <IconTag size={16} />,
          href: '/dashboard/images/tags',
        },
        {
          id: 'history',
          label: 'History',
          icon: <IconHistory size={16} />,
          href: '/dashboard/images/history',
        },
      ],
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: <IconShoppingCart size={20} />,
      href: '/dashboard/orders',
      badge: 12,
      children: [
        {
          id: 'active-orders',
          label: 'Active Orders',
          icon: <IconClock size={16} />,
          href: '/dashboard/orders/active',
          badge: 5,
        },
        {
          id: 'completed-orders',
          label: 'Completed',
          icon: <IconCheck size={16} />,
          href: '/dashboard/orders/completed',
        },
        {
          id: 'cancelled-orders',
          label: 'Cancelled',
          icon: <IconAlertCircle size={16} />,
          href: '/dashboard/orders/cancelled',
        },
      ],
    },
    {
      id: 'products',
      label: 'Products',
      icon: <IconPackage size={20} />,
      href: '/dashboard/products',
      children: [
        {
          id: 'all-products',
          label: 'All Products',
          icon: <IconBox size={16} />,
          href: '/dashboard/products',
        },
        {
          id: 'categories',
          label: 'Categories',
          icon: <IconCategory size={16} />,
          href: '/dashboard/products/categories',
        },
        {
          id: 'inventory',
          label: 'Inventory',
          icon: <IconDatabase size={16} />,
          href: '/dashboard/products/inventory',
        },
      ],
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: <IconUsers size={20} />,
      href: '/dashboard/manage-user',
      badge: 5,
      children: [
        {
          id: 'all-customers',
          label: 'All Customers',
          icon: <IconUsersGroup size={16} />,
          href: '/dashboard/manage-user',
        },
        {
          id: 'leads',
          label: 'Leads',
          icon: <IconUserPlus size={16} />,
          href: '/dashboard/customers/leads',
          badge: 3,
        },
      ],
    },
    {
      id: 'Announcement',
      label: 'Announcement',
      icon: <IconChartBar size={20} />,
      href: '/dashboard/announcements'
    },
    {
      id: 'Testmonia',
      label: 'Testmonia',
      icon: <IconMessage size={20} />,
      href: '/dashboard/testimonials',
      badge: 3,
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: <IconCalendar size={20} />,
      href: '/dashboard/calendar',
    },
     {
      id: 'Service',
      label: 'Service',
      icon: <IconLayoutDashboard size={20} />,
      href: '/dashboard/service',
      children: [
        {
          id: 'Catagory',
          label: 'Catagories',
          icon: <IconClock size={16} />,
          href: '/dashboard/service/categories',
        },
        {
          id: 'Service',
          label: 'Service',
          icon: <IconLayoutDashboard size={20} />,
          href: '/dashboard/service',
        }
      ]
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <IconSettings size={20} />,
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
    <div className="h-full flex flex-col bg-white dark:bg-white-900">

      {/* Quick Upload Button */}
      {opened && (
        <div className="p-4">
          <Button
            fullWidth
            variant="gradient"
            gradient={{ from: 'red', to: 'orange' }}
            leftSection={<IconUpload size={18} />}
            component={Link}
            href="/dashboard/images/upload"
          >
            Upload Images
          </Button>
        </div>
      )}

      {/* Search */}
      {opened && (
        <div className="px-4 pb-2">
          <div className="relative">
            <IconSearch size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <TextInput
              placeholder="Search images..."
              size="sm"
              radius="md"
              styles={{
                input: {
                  paddingLeft: '2.5rem',
                  backgroundColor: '#f8f9fa',
                },
              }}
            />
          </div>
        </div>
      )}

      {/* Navigation Items */}
      <ScrollArea className="flex-1 px-2">
        <Stack gap={4}>
          {sidebarItems.map((item) => (
            <SidebarItemComponent
              key={item.id}
              item={item}
              isActive={activeItem === item.id || pathname.includes(item.id)}
              isExpanded={opened}
            />
          ))}
        </Stack>
      </ScrollArea>

      {/* Image Stats Summary */}
      {opened && (
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800">
          <Text size="xs" fw={500} c="dimmed" mb="xs">
            IMAGE SUMMARY
          </Text>
          <Group grow>
            <div className="text-center">
              <Text fw={700} size="lg" c="yellow">{imageStats.pending}</Text>
              <Text size="xs" c="dimmed">Pending</Text>
            </div>
            <div className="text-center">
              <Text fw={700} size="lg" c="green">{imageStats.approved}</Text>
              <Text size="xs" c="dimmed">Approved</Text>
            </div>
            <div className="text-center">
              <Text fw={700} size="lg" c="red">{imageStats.rejected}</Text>
              <Text size="xs" c="dimmed">Rejected</Text>
            </div>
          </Group>
        </div>
      )}

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <Group justify="space-between" wrap="nowrap">
          <Group gap="md" wrap="nowrap">
            <Avatar
              src="https://i.pravatar.cc/150?img=7"
              size="md"
              radius="xl"
            />
            {opened && (
              <div>
                <Text size="sm" fw={500}>John Doe</Text>
                <Text size="xs" c="dimmed">Administrator</Text>
              </div>
            )}
          </Group>
          <Menu shadow="lg" width={200} position="top-end">
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray">
                <IconSettings2 size={18} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<IconUser size={14} />} component={Link} href="/dashboard/profile">
                Profile
              </Menu.Item>
              <Menu.Item leftSection={<IconSettings size={14} />} component={Link} href="/dashboard/settings">
                Settings
              </Menu.Item>
              <Menu.Item leftSection={<IconPhoto size={14} />} component={Link} href="/dashboard/images">
                My Images
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