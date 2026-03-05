'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  Text,
  Title,
  Group,
  Select,
  SimpleGrid,
  ThemeIcon,
  RingProgress,
  Table,
  Button,
  Loader,
  Center,
  Alert,
} from '@mantine/core';
import {
  IconTrendingUp,
  IconTrendingDown,
  IconUsers,
  IconShoppingCart,
  IconPhoto,
  IconCurrencyDollar,
  IconChartBar,
  IconChartPie,
  IconChartLine,
  IconExclamationCircle,
} from '@tabler/icons-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useRouter } from 'next/navigation';

interface AnalyticsData {
  revenue: {
    daily: { date: string; amount: number }[];
    weekly: { week: string; amount: number }[];
    monthly: { month: string; amount: number }[];
    yearly: { year: string; amount: number }[];
  };
  orders: {
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
    byStatus: { status: string; count: number }[];
    byDay: { day: string; count: number }[];
  };
  images: {
    in_progress: number;
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    byStatus: { status: string; count: number }[];
    byDay: { day: string; count: number }[];
  };
  customers: {
    total: number;
    new: number;
    active: number;
    churned: number;
    byMonth: { month: string; count: number }[];
  };
  topProducts: {
    id: string;
    name: string;
    revenue: number;
    orders: number;
  }[];
  topCustomers: {
    id: string;
    name: string;
    spent: number;
    orders: number;
  }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

export default function AnalyticsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [chartType, setChartType] = useState('revenue');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/analytics?range=${timeRange}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      } else {
        setError('Failed to fetch analytics data');
      }
    } catch (error) {
      console.log(error);
      setError('Error loading analytics');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 100;
    return ((current - previous) / previous) * 100;
  };

  if (loading) {
    return (
      <Center h="100vh">
        <Loader size="lg" />
      </Center>
    );
  }

  if (error || !data) {
    return (
      <Container size="xl" py="xl">
        <Alert icon={<IconExclamationCircle size={16} />} title="Error" color="red">
          {error || 'Failed to load analytics data'}
        </Alert>
      </Container>
    );
  }

  const totalRevenue = data.revenue.monthly.reduce((sum, m) => sum + m.amount, 0);
  const previousMonthRevenue = data.revenue.monthly[data.revenue.monthly.length - 2]?.amount || 0;
  const revenueGrowth = calculateGrowth(totalRevenue, previousMonthRevenue);

  const totalOrders = data.orders.total;
  const previousMonthOrders = data.orders.byDay.slice(-30, -15).reduce((sum, d) => sum + d.count, 0);
  const ordersGrowth = calculateGrowth(totalOrders, previousMonthOrders);

  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2}>Analytics Dashboard</Title>
          <Text c="dimmed" size="sm">
            Comprehensive overview of your business performance
          </Text>
        </div>
        <Select
          value={timeRange}
          onChange={(value) => setTimeRange(value || '30d')}
          data={[
            { value: '7d', label: 'Last 7 days' },
            { value: '30d', label: 'Last 30 days' },
            { value: '90d', label: 'Last 90 days' },
            { value: '12m', label: 'Last 12 months' },
          ]}
          style={{ width: 200 }}
        />
      </Group>

      {/* Key Metrics */}
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} mb="xl">
        <Card withBorder padding="lg">
          <Group justify="space-between">
            <div>
              <Text size="xs" c="dimmed">Total Revenue</Text>
              <Text fw={700} size="xl">{formatCurrency(totalRevenue)}</Text>
              <Group gap={4}>
                {revenueGrowth >= 0 ? (
                  <IconTrendingUp size={16} color="green" />
                ) : (
                  <IconTrendingDown size={16} color="red" />
                )}
                <Text size="sm" c={revenueGrowth >= 0 ? 'green' : 'red'}>
                  {revenueGrowth >= 0 ? '+' : ''}{revenueGrowth.toFixed(1)}%
                </Text>
                <Text size="xs" c="dimmed">vs last month</Text>
              </Group>
            </div>
            <ThemeIcon size="lg" color="blue" variant="light">
              <IconCurrencyDollar size={20} />
            </ThemeIcon>
          </Group>
        </Card>

        <Card withBorder padding="lg">
          <Group justify="space-between">
            <div>
              <Text size="xs" c="dimmed">Total Orders</Text>
              <Text fw={700} size="xl">{formatNumber(totalOrders)}</Text>
              <Group gap={4}>
                {ordersGrowth >= 0 ? (
                  <IconTrendingUp size={16} color="green" />
                ) : (
                  <IconTrendingDown size={16} color="red" />
                )}
                <Text size="sm" c={ordersGrowth >= 0 ? 'green' : 'red'}>
                  {ordersGrowth >= 0 ? '+' : ''}{ordersGrowth.toFixed(1)}%
                </Text>
                <Text size="xs" c="dimmed">vs last month</Text>
              </Group>
            </div>
            <ThemeIcon size="lg" color="green" variant="light">
              <IconShoppingCart size={20} />
            </ThemeIcon>
          </Group>
        </Card>

        <Card withBorder padding="lg">
          <Group justify="space-between">
            <div>
              <Text size="xs" c="dimmed">Total Images</Text>
              <Text fw={700} size="xl">{formatNumber(data.images.total)}</Text>
              <Group gap={4}>
                <Text size="sm" c="yellow">{data.images.pending} pending</Text>
                <Text size="xs" c="dimmed">awaiting review</Text>
              </Group>
            </div>
            <ThemeIcon size="lg" color="orange" variant="light">
              <IconPhoto size={20} />
            </ThemeIcon>
          </Group>
        </Card>

        <Card withBorder padding="lg">
          <Group justify="space-between">
            <div>
              <Text size="xs" c="dimmed">Total Customers</Text>
              <Text fw={700} size="xl">{formatNumber(data.customers.total)}</Text>
              <Group gap={4}>
                <Text size="sm" c="green">+{data.customers.new} new</Text>
                <Text size="xs" c="dimmed">this month</Text>
              </Group>
            </div>
            <ThemeIcon size="lg" color="grape" variant="light">
              <IconUsers size={20} />
            </ThemeIcon>
          </Group>
        </Card>
      </SimpleGrid>

      {/* Chart Type Selector */}
      <Group mb="lg">
        <Button
          variant={chartType === 'revenue' ? 'filled' : 'light'}
          onClick={() => setChartType('revenue')}
          leftSection={<IconChartLine size={16} />}
        >
          Revenue
        </Button>
        <Button
          variant={chartType === 'orders' ? 'filled' : 'light'}
          onClick={() => setChartType('orders')}
          leftSection={<IconChartBar size={16} />}
        >
          Orders
        </Button>
        <Button
          variant={chartType === 'customers' ? 'filled' : 'light'}
          onClick={() => setChartType('customers')}
          leftSection={<IconChartPie size={16} />}
        >
          Customers
        </Button>
      </Group>

      {/* Main Chart */}
      <Grid mb="xl">
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card withBorder padding="lg">
            <Title order={4} mb="md">
              {chartType === 'revenue' && 'Revenue Trend'}
              {chartType === 'orders' && 'Orders Trend'}
              {chartType === 'customers' && 'Customer Growth'}
            </Title>
            <ResponsiveContainer width="100%" height={300}>
              {chartType === 'revenue' && (
                <AreaChart data={data.revenue.daily}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.3}
                    name="Revenue"
                  />
                </AreaChart>
              )}
              {chartType === 'orders' && (
                <BarChart data={data.orders.byDay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#82ca9d" name="Orders" />
                </BarChart>
              )}
              {chartType === 'customers' && (
                <LineChart data={data.customers.byMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#8884d8"
                    name="New Customers"
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </Card>
        </Grid.Col>

        {/* Status Distribution */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder padding="lg" h="100%">
            <Title order={4} mb="md">Order Status</Title>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={data.orders.byStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="count"
                  label
                >
                  {data.orders.byStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <SimpleGrid cols={2} mt="md">
              {data.orders.byStatus.map((status, index) => (
                <Group key={status.status} gap="xs">
                  <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: COLORS[index % COLORS.length] }} />
                  <Text size="xs">{status.status}</Text>
                  <Text size="xs" fw={500}>{status.count}</Text>
                </Group>
              ))}
            </SimpleGrid>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Image Status */}
      <Grid mb="xl">
        <Grid.Col span={12}>
          <Card withBorder padding="lg">
            <Title order={4} mb="md">Image Status Distribution</Title>
            <SimpleGrid cols={{ base: 1, md: 4 }}>
              <RingProgress
                size={150}
                thickness={16}
                label={
                  <Text size="xs" ta="center">
                    Pending<br />
                    <Text fw={700} size="lg">{data.images.pending}</Text>
                  </Text>
                }
                sections={[{ value: (data.images.pending / data.images.total) * 100, color: 'yellow' }]}
              />
              <RingProgress
                size={150}
                thickness={16}
                label={
                  <Text size="xs" ta="center">
                    Approved<br />
                    <Text fw={700} size="lg">{data.images.approved}</Text>
                  </Text>
                }
                sections={[{ value: (data.images.approved / data.images.total) * 100, color: 'green' }]}
              />
              <RingProgress
                size={150}
                thickness={16}
                label={
                  <Text size="xs" ta="center">
                    Rejected<br />
                    <Text fw={700} size="lg">{data.images.rejected}</Text>
                  </Text>
                }
                sections={[{ value: (data.images.rejected / data.images.total) * 100, color: 'red' }]}
              />
              <RingProgress
                size={150}
                thickness={16}
                label={
                  <Text size="xs" ta="center">
                    In Progress<br />
                    <Text fw={700} size="lg">{data.images.in_progress || 0}</Text>
                  </Text>
                }
                sections={[{ value: ((data.images.in_progress || 0) / data.images.total) * 100, color: 'blue' }]}
              />
            </SimpleGrid>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Top Products and Customers */}
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder padding="lg">
            <Title order={4} mb="md">Top Products</Title>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Product</Table.Th>
                  <Table.Th>Orders</Table.Th>
                  <Table.Th>Revenue</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {data.topProducts.map((product) => (
                  <Table.Tr key={product.id}>
                    <Table.Td>
                      <Text fw={500}>{product.name}</Text>
                    </Table.Td>
                    <Table.Td>{product.orders}</Table.Td>
                    <Table.Td>
                      <Text fw={500}>{formatCurrency(product.revenue)}</Text>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder padding="lg">
            <Title order={4} mb="md">Top Customers</Title>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Customer</Table.Th>
                  <Table.Th>Orders</Table.Th>
                  <Table.Th>Total Spent</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {data.topCustomers.map((customer) => (
                  <Table.Tr key={customer.id}>
                    <Table.Td>
                      <Text fw={500}>{customer.name}</Text>
                    </Table.Td>
                    <Table.Td>{customer.orders}</Table.Td>
                    <Table.Td>
                      <Text fw={500}>{formatCurrency(customer.spent)}</Text>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
}