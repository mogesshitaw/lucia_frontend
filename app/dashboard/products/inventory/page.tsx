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
  Grid,
  Card,
  ThemeIcon,
  SimpleGrid,
  Loader,
  Center,
  Progress,
  NumberInput,
  Tooltip,
  Stack,
} from '@mantine/core';
import {
  IconSearch,
  IconEdit,
  IconRefresh,
  IconDatabase,
  IconAlertCircle,
  IconCheck,
  IconX,
  IconTrendingUp,
  IconTrendingDown,
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  min_stock: number;
  max_stock: number;
  unit: string;
  reorder_point: number;
  last_restocked: string;
  supplier: string;
}

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/inventory`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setItems(data.data.items);
      }
    } catch (error) {
      console.error('Failed to fetch inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async (id: string, newStock: number) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/inventory/${id}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ stock: newStock }),
        }
      );
      const data = await response.json();
      if (data.success) {
        notifications.show({
          title: 'Success',
          message: 'Stock updated successfully',
          color: 'green',
        });
        fetchInventory();
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update stock',
        color: 'red',
      });
    }
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.stock <= 0) {
      return { color: 'red', label: 'Out of Stock', progress: 0 };
    }
    if (item.stock <= item.min_stock) {
      const percentage = (item.stock / item.min_stock) * 100;
      return { color: 'yellow', label: 'Low Stock', progress: percentage };
    }
    const percentage = (item.stock / item.max_stock) * 100;
    return { color: 'green', label: 'In Stock', progress: Math.min(percentage, 100) };
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                         item.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !category || item.category === category;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(items.map(item => item.category))];

  const lowStockCount = items.filter(i => i.stock > 0 && i.stock <= i.min_stock).length;
  const outOfStockCount = items.filter(i => i.stock <= 0).length;
  const totalValue = items.reduce((sum, item) => sum + (item.stock * 10), 0); // Example calculation

  if (loading) {
    return (
      <Center h="100vh">
        <Loader size="lg" />
      </Center>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Title order={2} mb="lg">Inventory Management</Title>

      {/* Stats Cards */}
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} mb="xl">
        <Card withBorder>
          <Group justify="space-between">
            <div>
              <Text size="xs" c="dimmed">Total Items</Text>
              <Text fw={700} size="xl">{items.length}</Text>
            </div>
            <ThemeIcon color="blue" variant="light" size="lg">
              <IconDatabase size={20} />
            </ThemeIcon>
          </Group>
        </Card>
        <Card withBorder>
          <Group justify="space-between">
            <div>
              <Text size="xs" c="dimmed">Low Stock</Text>
              <Text fw={700} size="xl" c="yellow">{lowStockCount}</Text>
            </div>
            <ThemeIcon color="yellow" variant="light" size="lg">
              <IconTrendingDown size={20} />
            </ThemeIcon>
          </Group>
        </Card>
        <Card withBorder>
          <Group justify="space-between">
            <div>
              <Text size="xs" c="dimmed">Out of Stock</Text>
              <Text fw={700} size="xl" c="red">{outOfStockCount}</Text>
            </div>
            <ThemeIcon color="red" variant="light" size="lg">
              <IconX size={20} />
            </ThemeIcon>
          </Group>
        </Card>
        <Card withBorder>
          <Group justify="space-between">
            <div>
              <Text size="xs" c="dimmed">Est. Value</Text>
              <Text fw={700} size="xl">${totalValue.toLocaleString()}</Text>
            </div>
            <ThemeIcon color="green" variant="light" size="lg">
              <IconTrendingUp size={20} />
            </ThemeIcon>
          </Group>
        </Card>
      </SimpleGrid>

      {/* Filters */}
      <Paper withBorder p="md" mb="lg">
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              placeholder="Search by name or SKU..."
              leftSection={<IconSearch size={16} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Select
              placeholder="Filter by category"
              clearable
              data={categories}
              value={category}
              onChange={(value) => setCategory(value || '')}
            />
          </Grid.Col>
        </Grid>
      </Paper>

      {/* Inventory Table */}
      <Paper withBorder>
        <Table.ScrollContainer minWidth={1000}>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Product</Table.Th>
                <Table.Th>SKU</Table.Th>
                <Table.Th>Category</Table.Th>
                <Table.Th>Current Stock</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Min / Max</Table.Th>
                <Table.Th>Last Restocked</Table.Th>
                <Table.Th>Supplier</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredItems.map((item) => {
                const status = getStockStatus(item);
                return (
                  <Table.Tr key={item.id}>
                    <Table.Td>
                      <Text fw={500}>{item.name}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{item.sku}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="light">{item.category}</Badge>
                    </Table.Td>
                    <Table.Td>
                      <Stack gap={4}>
                        <Text fw={500}>{item.stock} {item.unit}</Text>
                        <Progress value={status.progress} color={status.color} size="xs" />
                      </Stack>
                    </Table.Td>
                    <Table.Td>
                      <Badge color={status.color}>{status.label}</Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{item.min_stock} / {item.max_stock} {item.unit}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">
                        {item.last_restocked ? new Date(item.last_restocked).toLocaleDateString() : 'Never'}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{item.supplier || '-'}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap={4}>
                        <Tooltip label="Update Stock">
                          <ActionIcon
                            variant="subtle"
                            color="blue"
                            onClick={() => {
                              const newStock = prompt('Enter new stock quantity:', item.stock.toString());
                              if (newStock && !isNaN(Number(newStock))) {
                                handleUpdateStock(item.id, Number(newStock));
                              }
                            }}
                          >
                            <IconEdit size={16} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Restock">
                          <ActionIcon
                            variant="subtle"
                            color="green"
                            onClick={() => {
                              const newStock = prompt('Enter restock quantity:', '10');
                              if (newStock && !isNaN(Number(newStock))) {
                                handleUpdateStock(item.id, item.stock + Number(newStock));
                              }
                            }}
                          >
                            <IconRefresh size={16} />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Paper>
    </Container>
  );
}