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
  Image,
  NumberInput,
  Textarea,
  Switch,
} from '@mantine/core';
import {
  IconSearch,
  IconEye,
  IconEdit,
  IconTrash,
  IconFilter,
  IconPackage,
  IconCategory,
  IconDatabase,
  IconPlus,
  IconCurrencyDollar,
  IconTags,
  IconPhoto,
  IconDotsVertical,
  IconExclamationCircle,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  cost: number;
  category: string;
  stock: number;
  min_stock: number;
  unit: string;
  images: string[];
  is_active: boolean;
  created_at: string;
}

interface Category {
  id: string;
  name: string;
  product_count: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    in_stock: false,
    low_stock: false,
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [openedDelete, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [openedAdd, { open: openAdd, close: closeAdd }] = useDisclosure(false);
  const [openedEdit, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [openedCategory, { open: openCategory, close: closeCategory }] = useDisclosure(false);

  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    description: '',
    price: 0,
    cost: 0,
    category: '',
    stock: 0,
    min_stock: 5,
    unit: 'piece',
    is_active: true,
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [page, filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(filters.search && { search: filters.search }),
        ...(filters.category && { category: filters.category }),
        ...(filters.in_stock && { in_stock: 'true' }),
        ...(filters.low_stock && { low_stock: 'true' }),
      });

      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (data.success) {
        setProducts(data.data.products);
        setTotalPages(data.data.pagination.pages);
      }
    } catch (error) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setCategories(data.data.categories);
      }
    } catch (error) {
      console.error('Failed to fetch categories');
    }
  };

  const handleAddProduct = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });
      const data = await response.json();
      if (data.success) {
        notifications.show({
          title: 'Success',
          message: 'Product added successfully',
          color: 'green',
        });
        closeAdd();
        fetchProducts();
        setNewProduct({
          name: '',
          sku: '',
          description: '',
          price: 0,
          cost: 0,
          category: '',
          stock: 0,
          min_stock: 5,
          unit: 'piece',
          is_active: true,
        });
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to add product',
        color: 'red',
      });
    }
  };

  const handleUpdateProduct = async () => {
    if (!selectedProduct) return;
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${selectedProduct.id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(selectedProduct),
        }
      );
      const data = await response.json();
      if (data.success) {
        notifications.show({
          title: 'Success',
          message: 'Product updated successfully',
          color: 'green',
        });
        closeEdit();
        fetchProducts();
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update product',
        color: 'red',
      });
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${selectedProduct.id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (data.success) {
        notifications.show({
          title: 'Success',
          message: 'Product deleted successfully',
          color: 'green',
        });
        closeDelete();
        fetchProducts();
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete product',
        color: 'red',
      });
    }
  };

  const getStockStatus = (product: Product) => {
    if (product.stock <= 0) {
      return <Badge color="red">Out of Stock</Badge>;
    }
    if (product.stock <= product.min_stock) {
      return <Badge color="yellow">Low Stock</Badge>;
    }
    return <Badge color="green">In Stock</Badge>;
  };

  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2}>Products Management</Title>
          <Text c="dimmed" size="sm">
            Manage your product catalog and inventory
          </Text>
        </div>
        <Group>
          <Button
            variant="light"
            leftSection={<IconCategory size={16} />}
            onClick={openCategory}
          >
            Categories
          </Button>
          <Button
            variant="gradient"
            gradient={{ from: 'blue', to: 'cyan' }}
            leftSection={<IconPlus size={16} />}
            onClick={openAdd}
          >
            Add Product
          </Button>
        </Group>
      </Group>

      {/* Stats Cards */}
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} mb="xl">
        <Card withBorder>
          <Group justify="space-between">
            <div>
              <Text size="xs" c="dimmed">Total Products</Text>
              <Text fw={700} size="xl">{products.length}</Text>
            </div>
            <ThemeIcon color="blue" variant="light" size="lg">
              <IconPackage size={20} />
            </ThemeIcon>
          </Group>
        </Card>
        <Card withBorder>
          <Group justify="space-between">
            <div>
              <Text size="xs" c="dimmed">Categories</Text>
              <Text fw={700} size="xl">{categories.length}</Text>
            </div>
            <ThemeIcon color="grape" variant="light" size="lg">
              <IconCategory size={20} />
            </ThemeIcon>
          </Group>
        </Card>
        <Card withBorder>
          <Group justify="space-between">
            <div>
              <Text size="xs" c="dimmed">Low Stock</Text>
              <Text fw={700} size="xl" c="yellow">
                {products.filter(p => p.stock > 0 && p.stock <= p.min_stock).length}
              </Text>
            </div>
            <ThemeIcon color="yellow" variant="light" size="lg">
              <IconDatabase size={20} />
            </ThemeIcon>
          </Group>
        </Card>
        <Card withBorder>
          <Group justify="space-between">
            <div>
              <Text size="xs" c="dimmed">Out of Stock</Text>
              <Text fw={700} size="xl" c="red">
                {products.filter(p => p.stock <= 0).length}
              </Text>
            </div>
            <ThemeIcon color="red" variant="light" size="lg">
              <IconExclamationCircle size={20} />
            </ThemeIcon>
          </Group>
        </Card>
      </SimpleGrid>

      {/* Filters */}
      <Paper withBorder p="md" mb="lg">
        <Grid>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <TextInput
              placeholder="Search products..."
              leftSection={<IconSearch size={16} />}
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 6, md: 3 }}>
            <Select
              placeholder="Category"
              clearable
              data={categories.map(c => ({ value: c.name, label: c.name }))}
              value={filters.category}
              onChange={(value) => setFilters({ ...filters, category: value || '' })}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 3, md: 2 }}>
            <Switch
              label="In Stock"
              checked={filters.in_stock}
              onChange={(e) => setFilters({ ...filters, in_stock: e.currentTarget.checked })}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 3, md: 3 }}>
            <Switch
              label="Low Stock"
              checked={filters.low_stock}
              onChange={(e) => setFilters({ ...filters, low_stock: e.currentTarget.checked })}
            />
          </Grid.Col>
        </Grid>
      </Paper>

      {/* Products Table */}
      <Paper withBorder>
        {loading ? (
          <Center p="xl">
            <Loader />
          </Center>
        ) : products.length === 0 ? (
          <Center p="xl">
            <Stack align="center">
              <IconPackage size={48} color="gray" />
              <Text size="lg" fw={500}>No products found</Text>
              <Button onClick={openAdd}>Add your first product</Button>
            </Stack>
          </Center>
        ) : (
          <>
            <Table.ScrollContainer minWidth={1000}>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Product</Table.Th>
                    <Table.Th>SKU</Table.Th>
                    <Table.Th>Category</Table.Th>
                    <Table.Th>Price</Table.Th>
                    <Table.Th>Cost</Table.Th>
                    <Table.Th>Stock</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {products.map((product) => (
                    <Table.Tr key={product.id}>
                      <Table.Td>
                        <Group gap="sm">
                          <Avatar
                            size="md"
                            src={product.images[0]}
                            radius="sm"
                          >
                            <IconPhoto size={16} />
                          </Avatar>
                          <div>
                            <Text fw={500}>{product.name}</Text>
                            <Text size="xs" c="dimmed">{product.description?.slice(0, 50)}...</Text>
                          </div>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{product.sku}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge variant="light">{product.category}</Badge>
                      </Table.Td>
                      <Table.Td>
                        <Text fw={500}>${product.price.toFixed(2)}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">${product.cost.toFixed(2)}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text>{product.stock} {product.unit}</Text>
                      </Table.Td>
                      <Table.Td>
                        {getStockStatus(product)}
                      </Table.Td>
                      <Table.Td>
                        <Group gap={4}>
                          <Tooltip label="Edit">
                            <ActionIcon
                              variant="subtle"
                              color="blue"
                              onClick={() => {
                                setSelectedProduct(product);
                                openEdit();
                              }}
                            >
                              <IconEdit size={16} />
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip label="Delete">
                            <ActionIcon
                              variant="subtle"
                              color="red"
                              onClick={() => {
                                setSelectedProduct(product);
                                openDelete();
                              }}
                            >
                              <IconTrash size={16} />
                            </ActionIcon>
                          </Tooltip>
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

      {/* Add Product Modal */}
      <Modal opened={openedAdd} onClose={closeAdd} title="Add New Product" size="lg">
        <Stack>
          <TextInput
            label="Product Name"
            required
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
          <TextInput
            label="SKU"
            required
            value={newProduct.sku}
            onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
          />
          <Textarea
            label="Description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            minRows={3}
          />
          <Grid>
            <Grid.Col span={6}>
              <NumberInput
                label="Price"
                required
                min={0}
                // precision={2}
                value={newProduct.price}
                onChange={(val) => setNewProduct({ ...newProduct, price: Number(val) || 0 })}
                leftSection="$"
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                label="Cost"
                required
                min={0}
                // precision={2}
                value={newProduct.cost}
                onChange={(val) => setNewProduct({ ...newProduct, cost: Number(val) || 0 })}
                leftSection="$"
              />
            </Grid.Col>
          </Grid>
          <Grid>
            <Grid.Col span={6}>
              <Select
                label="Category"
                required
                data={categories.map(c => c.name)}
                value={newProduct.category}
                onChange={(val) => setNewProduct({ ...newProduct, category: val || '' })}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Unit"
                required
                value={newProduct.unit}
                onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
              />
            </Grid.Col>
          </Grid>
          <Grid>
            <Grid.Col span={6}>
              <NumberInput
                label="Stock"
                required
                min={0}
                value={newProduct.stock}
                onChange={(val) => setNewProduct({ ...newProduct, stock: Number(val) || 0 })}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                label="Minimum Stock"
                required
                min={0}
                value={newProduct.min_stock}
                onChange={(val) => setNewProduct({ ...newProduct, min_stock: Number(val) || 0 })}
              />
            </Grid.Col>
          </Grid>
          <Switch
            label="Active"
            checked={newProduct.is_active}
            onChange={(e) => setNewProduct({ ...newProduct, is_active: e.currentTarget.checked })}
          />
          <Group justify="flex-end">
            <Button variant="light" onClick={closeAdd}>Cancel</Button>
            <Button onClick={handleAddProduct}>Add Product</Button>
          </Group>
        </Stack>
      </Modal>

      {/* Edit Product Modal */}
      <Modal opened={openedEdit} onClose={closeEdit} title="Edit Product" size="lg">
        {selectedProduct && (
          <Stack>
            <TextInput
              label="Product Name"
              value={selectedProduct.name}
              onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
            />
            <TextInput
              label="SKU"
              value={selectedProduct.sku}
              onChange={(e) => setSelectedProduct({ ...selectedProduct, sku: e.target.value })}
            />
            <Textarea
              label="Description"
              value={selectedProduct.description}
              onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })}
              minRows={3}
            />
            <Grid>
              <Grid.Col span={6}>
                <NumberInput
                  label="Price"
                  min={0}
                  // precision={2}
                  value={selectedProduct.price}
                  onChange={(val) => setSelectedProduct({ ...selectedProduct, price: Number(val) || 0 })}
                  leftSection="$"
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <NumberInput
                  label="Cost"
                  min={0}
                  // precision={2}
                  value={selectedProduct.cost}
                  onChange={(val) => setSelectedProduct({ ...selectedProduct, cost: Number(val) || 0 })}
                  leftSection="$"
                />
              </Grid.Col>
            </Grid>
            <Grid>
              <Grid.Col span={6}>
                <Select
                  label="Category"
                  data={categories.map(c => c.name)}
                  value={selectedProduct.category}
                  onChange={(val) => setSelectedProduct({ ...selectedProduct, category: val || '' })}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <NumberInput
                  label="Stock"
                  min={0}
                  value={selectedProduct.stock}
                  onChange={(val) => setSelectedProduct({ ...selectedProduct, stock: Number(val) || 0 })}
                />
              </Grid.Col>
            </Grid>
            <Switch
              label="Active"
              checked={selectedProduct.is_active}
              onChange={(e) => setSelectedProduct({ ...selectedProduct, is_active: e.currentTarget.checked })}
            />
            <Group justify="flex-end">
              <Button variant="light" onClick={closeEdit}>Cancel</Button>
              <Button onClick={handleUpdateProduct}>Save Changes</Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal opened={openedDelete} onClose={closeDelete} title="Delete Product">
        <Text mb="lg">
          Are you sure you want to delete {selectedProduct?.name}? This action cannot be undone.
        </Text>
        <Group justify="flex-end">
          <Button variant="light" onClick={closeDelete}>Cancel</Button>
          <Button color="red" onClick={handleDeleteProduct}>Delete</Button>
        </Group>
      </Modal>

      {/* Categories Modal */}
      <Modal opened={openedCategory} onClose={closeCategory} title="Product Categories" size="lg">
        <Stack>
          {categories.map((category) => (
            <Paper key={category.id} withBorder p="sm">
              <Group justify="space-between">
                <div>
                  <Text fw={500}>{category.name}</Text>
                  <Text size="xs" c="dimmed">{category.product_count} products</Text>
                </div>
                <Button
                  variant="light"
                  size="xs"
                  component={Link}
                  href={`/dashboard/products?category=${category.name}`}
                >
                  View Products
                </Button>
              </Group>
            </Paper>
          ))}
        </Stack>
      </Modal>
    </Container>
  );
}