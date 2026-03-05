/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  Text,
  Title,
  Group,
  Badge,
  Button,
  Paper,
  SimpleGrid,
  ThemeIcon,
  Progress,
  RingProgress,
  Table,
  Avatar,
  Stack,
  Menu,
  ActionIcon,
} from '@mantine/core';
import {
  IconArrowUpRight,
  IconArrowDownRight,
  IconUsers,
  IconShoppingCart,
  IconPhoto,
  IconCurrencyDollar,
  IconClock,
  IconCheck,
  IconX,
  IconEye,
  IconDotsVertical,
} from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalImages: number;
  pendingOrders: number;
  pendingImages: number;
  revenueGrowth: number;
  ordersGrowth: number;
  recentOrders: any[];
  recentUploads: any[];
  chartData: any[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:5000/api/dashboard/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Total Revenue',
      value: `$${stats?.totalRevenue?.toLocaleString() || '0'}`,
      icon: IconCurrencyDollar,
      color: 'blue',
      growth: stats?.revenueGrowth,
      growthLabel: 'vs last month',
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders?.toString() || '0',
      icon: IconShoppingCart,
      color: 'green',
      growth: stats?.ordersGrowth,
      growthLabel: 'vs last month',
    },
    {
      title: 'Total Customers',
      value: stats?.totalCustomers?.toString() || '0',
      icon: IconUsers,
      color: 'grape',
    },
    {
      title: 'Total Images',
      value: stats?.totalImages?.toString() || '0',
      icon: IconPhoto,
      color: 'orange',
    },
  ];

  return (
    <Container size="xl" py="xl">
      <Title order={2} mb="lg">Dashboard</Title>

      {/* Stats Grid */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} mb="xl">
        {statsCards.map((stat, index) => (
          <Card key={index} withBorder padding="lg" radius="md">
            <Group justify="space-between">
              <ThemeIcon size="lg" color={stat.color} variant="light">
                <stat.icon size={20} />
              </ThemeIcon>
              {stat.growth !== undefined && (
                <Badge
                  color={stat.growth >= 0 ? 'green' : 'red'}
                  variant="light"
                >
                  {stat.growth >= 0 ? '+' : ''}{stat.growth}%
                </Badge>
              )}
            </Group>
            <Text fw={700} size="xl" mt="md">
              {stat.value}
            </Text>
            <Text size="sm" c="dimmed">
              {stat.title}
            </Text>
            {stat.growthLabel && (
              <Text size="xs" c="dimmed" mt={4}>
                {stat.growthLabel}
              </Text>
            )}
          </Card>
        ))}
      </SimpleGrid>

      {/* Pending Items */}
      <Grid mb="xl">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder padding="lg">
            <Group justify="space-between" mb="md">
              <Text fw={500}>Pending Orders</Text>
              <Badge color="yellow" size="lg">{stats?.pendingOrders || 0}</Badge>
            </Group>
            <Progress value={65} color="yellow" size="lg" />
            <Group justify="space-between" mt="xs">
              <Text size="sm">65% of monthly target</Text>
              <Button
                variant="light"
                size="xs"
                component={Link}
                href="/dashboard/orders/active"
              >
                View All
              </Button>
            </Group>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder padding="lg">
            <Group justify="space-between" mb="md">
              <Text fw={500}>Pending Images</Text>
              <Badge color="orange" size="lg">{stats?.pendingImages || 0}</Badge>
            </Group>
            <Progress value={40} color="orange" size="lg" />
            <Group justify="space-between" mt="xs">
              <Text size="sm">40% awaiting approval</Text>
              <Button
                variant="light"
                size="xs"
                component={Link}
                href="/dashboard/images?status=pending"
              >
                Review Now
              </Button>
            </Group>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Recent Orders */}
      <Card withBorder padding="lg" mb="xl">
        <Group justify="space-between" mb="md">
          <Title order={4}>Recent Orders</Title>
          <Button
            variant="light"
            size="sm"
            component={Link}
            href="/dashboard/orders"
          >
            View All
          </Button>
        </Group>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Order ID</Table.Th>
              <Table.Th>Customer</Table.Th>
              <Table.Th>Items</Table.Th>
              <Table.Th>Total</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Date</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {stats?.recentOrders?.map((order) => (
              <Table.Tr key={order.id}>
                <Table.Td>
                  <Text fw={500}>{order.orderNumber}</Text>
                </Table.Td>
                <Table.Td>
                  <Group gap="sm">
                    <Avatar size="sm" name={order.customerName} color="initials" />
                    <Text size="sm">{order.customerName}</Text>
                  </Group>
                </Table.Td>
                <Table.Td>{order.itemCount} items</Table.Td>
                <Table.Td>${order.total.toFixed(2)}</Table.Td>
                <Table.Td>
                  <Badge
                    color={
                      order.status === 'completed'
                        ? 'green'
                        : order.status === 'processing'
                        ? 'blue'
                        : order.status === 'cancelled'
                        ? 'red'
                        : 'yellow'
                    }
                  >
                    {order.status}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{new Date(order.date).toLocaleDateString()}</Text>
                </Table.Td>
                <Table.Td>
                  <Menu shadow="md" width={150}>
                    <Menu.Target>
                      <ActionIcon variant="subtle">
                        <IconDotsVertical size={16} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        leftSection={<IconEye size={14} />}
                        component={Link}
                        href={`/dashboard/orders/${order.id}`}
                      >
                        View Details
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>

      {/* Recent Uploads */}
      <Card withBorder padding="lg">
        <Group justify="space-between" mb="md">
          <Title order={4}>Recent Image Uploads</Title>
          <Button
            variant="light"
            size="sm"
            component={Link}
            href="/dashboard/images"
          >
            View All
          </Button>
        </Group>
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }}>
          {stats?.recentUploads?.map((image) => (
            <Card key={image.id} withBorder padding="xs">
              <Card.Section>
                <img
                  src={image.thumbnail}
                  alt={image.filename}
                  style={{ height: 120, width: '100%', objectFit: 'cover' }}
                />
              </Card.Section>
              <Stack gap={4} mt="xs">
                <Text size="sm" fw={500} lineClamp={1}>
                  {image.filename}
                </Text>
                <Group gap="xs">
                  <Badge
                    size="xs"
                    color={
                      image.status === 'approved'
                        ? 'green'
                        : image.status === 'rejected'
                        ? 'red'
                        : 'yellow'
                    }
                  >
                    {image.status}
                  </Badge>
                  <Text size="xs" c="dimmed">
                    {new Date(image.uploadedAt).toLocaleDateString()}
                  </Text>
                </Group>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      </Card>
    </Container>
  );
}