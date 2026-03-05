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
  ActionIcon,
  Modal,
  Stack,
  TextInput,
  Alert,
  Loader,
  Center,
  Badge,
  Tooltip,
} from '@mantine/core';
import {
  IconEdit,
  IconTrash,
  IconPlus,
  IconCategory,
  IconExclamationCircle,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';

interface Category {
  id: string;
  name: string;
  description: string;
  product_count: number;
  created_at: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  
  const [openedAdd, { open: openAdd, close: closeAdd }] = useDisclosure(false);
  const [openedEdit, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [openedDelete, { open: openDelete, close: closeDelete }] = useDisclosure(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
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
      setError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/categories`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategory),
      });
      const data = await response.json();
      if (data.success) {
        notifications.show({
          title: 'Success',
          message: 'Category added successfully',
          color: 'green',
        });
        closeAdd();
        fetchCategories();
        setNewCategory({ name: '', description: '' });
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to add category',
        color: 'red',
      });
    }
  };

  const handleUpdateCategory = async () => {
    if (!selectedCategory) return;
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/categories/${selectedCategory.id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(selectedCategory),
        }
      );
      const data = await response.json();
      if (data.success) {
        notifications.show({
          title: 'Success',
          message: 'Category updated successfully',
          color: 'green',
        });
        closeEdit();
        fetchCategories();
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update category',
        color: 'red',
      });
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/categories/${selectedCategory.id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (data.success) {
        notifications.show({
          title: 'Success',
          message: 'Category deleted successfully',
          color: 'green',
        });
        closeDelete();
        fetchCategories();
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete category',
        color: 'red',
      });
    }
  };

  if (loading) {
    return (
      <Center h="100vh">
        <Loader size="lg" />
      </Center>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2}>Product Categories</Title>
          <Text c="dimmed" size="sm">
            Manage your product categories
          </Text>
        </div>
        <Button
          leftSection={<IconPlus size={16} />}
          variant="gradient"
          gradient={{ from: 'blue', to: 'cyan' }}
          onClick={openAdd}
        >
          Add Category
        </Button>
      </Group>

      {error && (
        <Alert icon={<IconExclamationCircle size={16} />} color="red" mb="lg">
          {error}
        </Alert>
      )}

      <Paper withBorder>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Category Name</Table.Th>
              <Table.Th>Description</Table.Th>
              <Table.Th>Products</Table.Th>
              <Table.Th>Created</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {categories.map((category) => (
              <Table.Tr key={category.id}>
                <Table.Td>
                  <Text fw={500}>{category.name}</Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" lineClamp={2}>{category.description || '-'}</Text>
                </Table.Td>
                <Table.Td>
                  <Badge>{category.product_count}</Badge>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{new Date(category.created_at).toLocaleDateString()}</Text>
                </Table.Td>
                <Table.Td>
                  <Group gap={4}>
                    <Tooltip label="Edit">
                      <ActionIcon
                        variant="subtle"
                        color="blue"
                        onClick={() => {
                          setSelectedCategory(category);
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
                          setSelectedCategory(category);
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
      </Paper>

      {/* Add Category Modal */}
      <Modal opened={openedAdd} onClose={closeAdd} title="Add Category">
        <Stack>
          <TextInput
            label="Category Name"
            required
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
          />
          <TextInput
            label="Description"
            value={newCategory.description}
            onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
          />
          <Group justify="flex-end">
            <Button variant="light" onClick={closeAdd}>Cancel</Button>
            <Button onClick={handleAddCategory}>Add Category</Button>
          </Group>
        </Stack>
      </Modal>

      {/* Edit Category Modal */}
      <Modal opened={openedEdit} onClose={closeEdit} title="Edit Category">
        {selectedCategory && (
          <Stack>
            <TextInput
              label="Category Name"
              value={selectedCategory.name}
              onChange={(e) => setSelectedCategory({ ...selectedCategory, name: e.target.value })}
            />
            <TextInput
              label="Description"
              value={selectedCategory.description}
              onChange={(e) => setSelectedCategory({ ...selectedCategory, description: e.target.value })}
            />
            <Group justify="flex-end">
              <Button variant="light" onClick={closeEdit}>Cancel</Button>
              <Button onClick={handleUpdateCategory}>Save Changes</Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal opened={openedDelete} onClose={closeDelete} title="Delete Category">
        <Text mb="lg">
          Are you sure you want to delete {selectedCategory?.name}? 
          This will affect all products in this category.
        </Text>
        <Group justify="flex-end">
          <Button variant="light" onClick={closeDelete}>Cancel</Button>
          <Button color="red" onClick={handleDeleteCategory}>Delete</Button>
        </Group>
      </Modal>
    </Container>
  );
}