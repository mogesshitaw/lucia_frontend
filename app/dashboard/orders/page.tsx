'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Title,
  Text,
  Group,
  Button,
  Table,
  Badge,
  ActionIcon,
  TextInput,
  Select,
  Modal,
  Stack,
  Avatar,
  Menu,
  Grid,
  Alert,
  Pagination,
  Tooltip,
  Card,
  ThemeIcon,
  SimpleGrid,
  Loader,
  Center,
} from '@mantine/core';
import {
  IconSearch,
  IconEye,
  IconPrinter,
  IconDownload,
  IconEdit,
  IconTrash,
  IconFilter,
  IconCalendar,
  IconCurrencyDollar,
  IconPackage,
  IconTruck,
  IconCheck,
  IconX,
  IconClock,
  IconRefresh,
  IconExclamationCircle,
  IconDotsVertical,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';

interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_avatar?: string;
  order_date: string;
  required_by_date: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  subtotal: number;
  tax_amount: number;
  shipping_cost: number;
  total_amount: number;
  payment_status: 'pending' | 'paid' | 'refunded' | 'failed';
  delivery_method: string;
  item_count: number;
  image_count: number;
}

interface OrderStats {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  cancelled: number;
  revenue: number;
  average_order: number;
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    payment_status: '',
    date_from: '',
    date_to: '',
  });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [openedDelete, { open: openDelete, close: closeDelete }] = useDisclosure(false);

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, [page, filters]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(filters.search && { search: filters.search }),
        ...(filters.status && { status: filters.status }),
        ...(filters.payment_status && { payment_status: filters.payment_status }),
        ...(filters.date_from && { date_from: filters.date_from }),
        ...(filters.date_to && { date_to: filters.date_to }),
      });

      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (data.success) {
        setOrders(data.data.orders);
        setTotalPages(data.data.pagination.pages);
      }
    } catch (error) {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats');
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${id}/status`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        }
      );
      const data = await response.json();
      if (data.success) {
        notifications.show({
          title: 'Success',
          message: `Order status updated to ${status}`,
          color: 'green',
        });
        fetchOrders();
        fetchStats();
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update order status',
        color: 'red',
      });
    }
  };

  const handleDeleteOrder = async () => {
    if (!selectedOrder) return;
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${selectedOrder.id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (data.success) {
        notifications.show({
          title: 'Success',
          message: 'Order deleted successfully',
          color: 'green',
        });
        closeDelete();
        fetchOrders();
        fetchStats();
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete order',
        color: 'red',
      });
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'yellow',
      processing: 'blue',
      completed: 'green',
      cancelled: 'red',
    };
    return colors[status] || 'gray';
  };

  const getPaymentStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'yellow',
      paid: 'green',
      refunded: 'orange',
      failed: 'red',
    };
    return colors[status] || 'gray';
  };

  const statsCards = stats ? [
    {
      title: 'Total Orders',
      value: stats.total,
      icon: IconPackage,
      color: 'blue',
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: IconClock,
      color: 'yellow',
    },
    {
      title: 'Processing',
      value: stats.processing,
      icon: IconRefresh,
      color: 'blue',
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: IconCheck,
      color: 'green',
    },
    {
      title: 'Total Revenue',
      value: `$${stats.revenue.toLocaleString()}`,
      icon: IconCurrencyDollar,
      color: 'cyan',
    },
    {
      title: 'Average Order',
      value: `$${stats.average_order.toLocaleString()}`,
      icon: IconTruck,
      color: 'grape',
    },
  ] : [];

  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2}>Orders Management</Title>
          <Text c="dimmed" size="sm">
            Manage and track all customer orders
          </Text>
        </div>
        <Button
          component={Link}
          href="/dashboard/orders/new"
          variant="gradient"
          gradient={{ from: 'blue', to: 'cyan' }}
        >
          New Order
        </Button>
      </Group>

      {/* Stats Cards */}
      {stats && (
        <SimpleGrid cols={{ base: 2, sm: 3, lg: 6 }} mb="xl">
          {statsCards.map((stat, index) => (
            <Card key={index} withBorder padding="md">
              <Group justify="space-between">
                <div>
                  <Text size="xs" c="dimmed">{stat.title}</Text>
                  <Text fw={700} size="xl">{stat.value}</Text>
                </div>
                <ThemeIcon color={stat.color} variant="light" size="lg">
                  <stat.icon size={20} />
                </ThemeIcon>
              </Group>
            </Card>
          ))}
        </SimpleGrid>
      )}

      {/* Filters */}
      <Paper withBorder p="md" mb="lg">
        <Grid>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <TextInput
              placeholder="Search orders..."
              leftSection={<IconSearch size={16} />}
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 6, md: 2 }}>
            <Select
              placeholder="Status"
              clearable
              data={[
                { value: 'pending', label: 'Pending' },
                { value: 'processing', label: 'Processing' },
                { value: 'completed', label: 'Completed' },
                { value: 'cancelled', label: 'Cancelled' },
              ]}
              value={filters.status}
              onChange={(value) => setFilters({ ...filters, status: value || '' })}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 6, md: 2 }}>
            <Select
              placeholder="Payment"
              clearable
              data={[
                { value: 'pending', label: 'Pending' },
                { value: 'paid', label: 'Paid' },
                { value: 'refunded', label: 'Refunded' },
                { value: 'failed', label: 'Failed' },
              ]}
              value={filters.payment_status}
              onChange={(value) => setFilters({ ...filters, payment_status: value || '' })}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 6, md: 2 }}>
            <TextInput
              type="date"
              placeholder="From"
              value={filters.date_from}
              onChange={(e) => setFilters({ ...filters, date_from: e.target.value })}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 6, md: 2 }}>
            <TextInput
              type="date"
              placeholder="To"
              value={filters.date_to}
              onChange={(e) => setFilters({ ...filters, date_to: e.target.value })}
            />
          </Grid.Col>
        </Grid>
      </Paper>

      {/* Error State */}
      {error && (
        <Alert icon={<IconExclamationCircle size={16} />} color="red" mb="lg">
          {error}
        </Alert>
      )}

      {/* Orders Table */}
      <Paper withBorder>
        {loading ? (
          <Center p="xl">
            <Loader />
          </Center>
        ) : orders.length === 0 ? (
          <Center p="xl">
            <Stack align="center">
              <IconPackage size={48} color="gray" />
              <Text size="lg" fw={500}>No orders found</Text>
              <Button component={Link} href="/dashboard/orders/new">
                Create your first order
              </Button>
            </Stack>
          </Center>
        ) : (
          <>
            <Table.ScrollContainer minWidth={1000}>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Order #</Table.Th>
                    <Table.Th>Customer</Table.Th>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Items</Table.Th>
                    <Table.Th>Total</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Payment</Table.Th>
                    <Table.Th>Delivery</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {orders.map((order) => (
                    <Table.Tr key={order.id}>
                      <Table.Td>
                        <Text fw={500}>{order.order_number}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="sm">
                          <Avatar
                            size="sm"
                            src={order.customer_avatar}
                            name={order.customer_name}
                            color="initials"
                          />
                          <div>
                            <Text size="sm">{order.customer_name}</Text>
                            <Text size="xs" c="dimmed">{order.customer_email}</Text>
                          </div>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Stack gap={4}>
                          <Text size="sm">{dayjs(order.order_date).format('MMM D, YYYY')}</Text>
                          <Text size="xs" c="dimmed">
                            Due: {dayjs(order.required_by_date).format('MMM D, YYYY')}
                          </Text>
                        </Stack>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{order.item_count} items</Text>
                        <Text size="xs" c="dimmed">{order.image_count} images</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text fw={500}>${order.total_amount.toFixed(2)}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={getPaymentStatusColor(order.payment_status)} size="sm">
                          {order.payment_status}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{order.delivery_method}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Group gap={4}>
                          <Tooltip label="View Details">
                            <ActionIcon
                              variant="subtle"
                              color="blue"
                              component={Link}
                              href={`/dashboard/orders/${order.id}`}
                            >
                              <IconEye size={16} />
                            </ActionIcon>
                          </Tooltip>
                          <Menu shadow="md" width={150}>
                            <Menu.Target>
                              <ActionIcon variant="subtle">
                                <IconDotsVertical size={16} />
                              </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                              <Menu.Label>Update Status</Menu.Label>
                              {order.status !== 'pending' && (
                                <Menu.Item
                                  leftSection={<IconClock size={14} />}
                                  onClick={() => handleStatusChange(order.id, 'pending')}
                                >
                                  Mark Pending
                                </Menu.Item>
                              )}
                              {order.status !== 'processing' && (
                                <Menu.Item
                                  leftSection={<IconRefresh size={14} />}
                                  onClick={() => handleStatusChange(order.id, 'processing')}
                                >
                                  Start Processing
                                </Menu.Item>
                              )}
                              {order.status !== 'completed' && (
                                <Menu.Item
                                  leftSection={<IconCheck size={14} />}
                                  onClick={() => handleStatusChange(order.id, 'completed')}
                                >
                                  Mark Completed
                                </Menu.Item>
                              )}
                              {order.status !== 'cancelled' && (
                                <Menu.Item
                                  color="red"
                                  leftSection={<IconX size={14} />}
                                  onClick={() => handleStatusChange(order.id, 'cancelled')}
                                >
                                  Cancel Order
                                </Menu.Item>
                              )}
                              <Menu.Divider />
                              <Menu.Item
                                color="red"
                                leftSection={<IconTrash size={14} />}
                                onClick={() => {
                                  setSelectedOrder(order);
                                  openDelete();
                                }}
                              >
                                Delete
                              </Menu.Item>
                            </Menu.Dropdown>
                          </Menu>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>

            {totalPages > 1 && (
              <Group justify="center" p="md">
                <Pagination
                  total={totalPages}
                  value={page}
                  onChange={setPage}
                  withEdges
                />
              </Group>
            )}
          </>
        )}
      </Paper>

      {/* Delete Modal */}
      <Modal opened={openedDelete} onClose={closeDelete} title="Delete Order">
        <Text mb="lg">
          Are you sure you want to delete order {selectedOrder?.order_number}? 
          This action cannot be undone.
        </Text>
        <Group justify="flex-end">
          <Button variant="light" onClick={closeDelete}>Cancel</Button>
          <Button color="red" onClick={handleDeleteOrder}>Delete</Button>
        </Group>
      </Modal>
    </Container>
  );
}