'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Text,
  Paper,
  Group,
  Button,
  Stack,
  Grid,
  Card,
  Badge,
  ActionIcon,
  Tooltip,
  TextInput,
  Select,
  Textarea,
  Modal,
  Divider,
  Alert,
  Loader,
  ThemeIcon,
  SimpleGrid,
  Pagination,
  Menu,
  Chip,
  Switch,
  NumberInput,
} from '@mantine/core';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconEye,
  IconEyeOff,
  IconSearch,
  IconRefresh,
  IconCheck,
  IconX,
  IconFolder,
  IconDeviceFloppy,
  IconChevronRight,
  IconDotsVertical,
  IconSortAscending,
  IconSortDescending,
  IconFilter,
  IconClearAll,
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useDisclosure } from '@mantine/hooks';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Types
interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon_name: string;
  display_order: number;
  service_count?: number;
  created_at?: string;
  updated_at?: string;
}

// Icon options for categories
const ICON_OPTIONS = [
  { value: 'Shirt', label: '👕 Shirt', emoji: '👕' },
  { value: 'ShoppingBag', label: '🛍️ Shopping Bag', emoji: '🛍️' },
  { value: 'Megaphone', label: '📢 Megaphone', emoji: '📢' },
  { value: 'Camera', label: '📷 Camera', emoji: '📷' },
  { value: 'Car', label: '🚗 Car', emoji: '🚗' },
  { value: 'Lightbulb', label: '💡 Lightbulb', emoji: '💡' },
  { value: 'Sparkles', label: '✨ Sparkles', emoji: '✨' },
  { value: 'Tag', label: '🏷️ Tag', emoji: '🏷️' },
  { value: 'Snowflake', label: '❄️ Snowflake', emoji: '❄️' },
  { value: 'Coffee', label: '☕ Coffee', emoji: '☕' },
  { value: 'Wine', label: '🍷 Wine', emoji: '🍷' },
  { value: 'FileText', label: '📄 File Text', emoji: '📄' },
  { value: 'Package', label: '📦 Package', emoji: '📦' },
  { value: 'Pen', label: '✒️ Pen', emoji: '✒️' },
  { value: 'Key', label: '🔑 Key', emoji: '🔑' },
  { value: 'Flame', label: '🔥 Flame', emoji: '🔥' },
  { value: 'Printer', label: '🖨️ Printer', emoji: '🖨️' },
  { value: 'Scissors', label: '✂️ Scissors', emoji: '✂️' },
  { value: 'Palette', label: '🎨 Palette', emoji: '🎨' },
];

// Motion components
const MotionDiv = motion.div;
const MotionCard = motion(Card as any);

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'display_order' | 'created_at'>('display_order');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Modal states
  const [openedForm, { open: openForm, close: closeForm }] = useDisclosure(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon_name: 'Shirt',
    display_order: 0,
  });
  const [saving, setSaving] = useState(false);

  // Delete modal
  const [openedDelete, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  // View modal
  const [openedView, { open: openView, close: closeView }] = useDisclosure(false);
  const [viewingCategory, setViewingCategory] = useState<Category | null>(null);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    withServices: 0,
    empty: 0,
  });

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/api/admin/services/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
        calculateStats(data.data);
      } else {
        notifications.show({
          title: 'Error',
          message: 'Failed to fetch categories',
          color: 'red',
        });
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch categories',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const calculateStats = (cats: Category[]) => {
    const withServices = cats.filter(c => (c.service_count || 0) > 0).length;
    setStats({
      total: cats.length,
      withServices,
      empty: cats.length - withServices,
    });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle form input changes
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate slug from name
    if (field === 'name') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      icon_name: 'Shirt',
      display_order: categories.length,
    });
    setEditingCategory(null);
  };

  // Open edit modal
  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      icon_name: category.icon_name,
      display_order: category.display_order,
    });
    openForm();
  };

  // Open view modal
  const handleView = (category: Category) => {
    setViewingCategory(category);
    openView();
  };

  // Open delete modal
  const handleDeleteClick = (category: Category) => {
    setDeletingCategory(category);
    openDelete();
  };

  // Save category
  const handleSave = async () => {
    if (!formData.name || !formData.slug) {
      notifications.show({
        title: 'Validation Error',
        message: 'Name and slug are required',
        color: 'red',
      });
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('accessToken');
      const url = editingCategory
        ? `${API_URL}/api/admin/services/categories/${editingCategory.id}`
        : `${API_URL}/api/admin/services/categories`;
      
      const response = await fetch(url, {
        method: editingCategory ? 'PUT' : 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        notifications.show({
          title: 'Success',
          message: `Category ${editingCategory ? 'updated' : 'created'} successfully`,
          color: 'green',
          icon: <IconCheck size={16} />,
        });
        closeForm();
        resetForm();
        fetchCategories();
      } else {
        throw new Error(data.message || 'Failed to save category');
      }
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to save category',
        color: 'red',
        icon: <IconX size={16} />,
      });
    } finally {
      setSaving(false);
    }
  };

  // Delete category
  const handleDelete = async () => {
    if (!deletingCategory) return;

    setDeleting(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/api/admin/services/categories/${deletingCategory.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.success) {
        notifications.show({
          title: 'Success',
          message: 'Category deleted successfully',
          color: 'green',
          icon: <IconCheck size={16} />,
        });
        closeDelete();
        fetchCategories();
      } else {
        throw new Error(data.message || 'Failed to delete category');
      }
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to delete category',
        color: 'red',
        icon: <IconX size={16} />,
      });
    } finally {
      setDeleting(false);
      setDeletingCategory(null);
    }
  };

  // Filter and sort categories
  const filteredCategories = categories
    .filter(cat => 
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cat.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'display_order') {
        comparison = (a.display_order || 0) - (b.display_order || 0);
      } else if (sortBy === 'created_at') {
        comparison = new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Get icon emoji
  const getIconEmoji = (iconName: string) => {
    const icon = ICON_OPTIONS.find(i => i.value === iconName);
    return icon?.emoji || '📁';
  };

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between">
          <div>
            <Title order={1}>Category Management</Title>
            <Text c="dimmed" size="sm">
              Manage service categories to organize your printing services
            </Text>
          </div>
          <Button
            size="lg"
            leftSection={<IconPlus size={20} />}
            onClick={() => {
              resetForm();
              openForm();
            }}
          >
            Add New Category
          </Button>
        </Group>

        {/* Stats Cards */}
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
          <Paper withBorder p="lg" radius="lg">
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Total Categories
                </Text>
                <Text fw={700} size="xl">
                  {stats.total}
                </Text>
              </div>
              <ThemeIcon size="lg" radius="xl" color="blue" variant="light">
                <IconFolder size={24} />
              </ThemeIcon>
            </Group>
          </Paper>

          <Paper withBorder p="lg" radius="lg">
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  With Services
                </Text>
                <Text fw={700} size="xl">
                  {stats.withServices}
                </Text>
              </div>
              <ThemeIcon size="lg" radius="xl" color="green" variant="light">
                <IconCheck size={24} />
              </ThemeIcon>
            </Group>
          </Paper>

          <Paper withBorder p="lg" radius="lg">
            <Group justify="space-between">
              <div>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  Empty Categories
                </Text>
                <Text fw={700} size="xl">
                  {stats.empty}
                </Text>
              </div>
              <ThemeIcon size="lg" radius="xl" color="yellow" variant="light">
                <IconX size={24} />
              </ThemeIcon>
            </Group>
          </Paper>
        </SimpleGrid>

        {/* Search and Filters */}
        <Paper withBorder p="md" radius="lg">
          <Group>
            <TextInput
              placeholder="Search categories..."
              leftSection={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1 }}
              size="md"
            />
            
            <Select
              placeholder="Sort by"
              leftSection={<IconSortAscending size={16} />}
              value={sortBy}
              onChange={(value) => setSortBy(value as any)}
              data={[
                { value: 'display_order', label: 'Display Order' },
                { value: 'name', label: 'Name' },
                { value: 'created_at', label: 'Date Created' },
              ]}
              size="md"
              style={{ width: 180 }}
            />
            
            <ActionIcon
              size="lg"
              variant="light"
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? <IconSortAscending size={20} /> : <IconSortDescending size={20} />}
            </ActionIcon>

            <Button
              variant="light"
              onClick={fetchCategories}
              leftSection={<IconRefresh size={16} />}
              size="md"
            >
              Refresh
            </Button>
          </Group>
        </Paper>

        {/* Categories Grid */}
        {loading ? (
          <Paper p="xl" withBorder>
            <Stack align="center" gap="md">
              <Loader size="lg" />
              <Text c="dimmed">Loading categories...</Text>
            </Stack>
          </Paper>
        ) : filteredCategories.length === 0 ? (
          <Paper p="xl" withBorder>
            <Stack align="center" gap="md">
              <ThemeIcon size={60} radius="xl" color="gray" variant="light">
                <IconFolder size={30} />
              </ThemeIcon>
              <Title order={3}>No Categories Found</Title>
              <Text c="dimmed" ta="center">
                {searchQuery
                  ? `No categories match "${searchQuery}"`
                  : 'Get started by creating your first category'}
              </Text>
              {!searchQuery && (
                <Button
                  leftSection={<IconPlus size={16} />}
                  onClick={() => {
                    resetForm();
                    openForm();
                  }}
                  size="md"
                >
                  Create First Category
                </Button>
              )}
            </Stack>
          </Paper>
        ) : (
          <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
            <AnimatePresence>
              {filteredCategories.map((category) => (
                <MotionCard
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  withBorder
                  padding="lg"
                  radius="lg"
                  className="hover:shadow-lg transition-shadow"
                >
                  <Stack>
                    <Group justify="space-between">
                      <Group gap="xs">
                        <ThemeIcon size="lg" radius="xl" color="blue" variant="light">
                          <Text size="xl">{getIconEmoji(category.icon_name)}</Text>
                        </ThemeIcon>
                        <div>
                          <Text fw={600} size="lg">{category.name}</Text>
                          <Text size="xs" c="dimmed">Slug: {category.slug}</Text>
                        </div>
                      </Group>
                      <Menu shadow="lg" width={200}>
                        <Menu.Target>
                          <ActionIcon variant="subtle" color="gray">
                            <IconDotsVertical size={16} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item
                            leftSection={<IconEye size={14} />}
                            onClick={() => handleView(category)}
                          >
                            View Details
                          </Menu.Item>
                          <Menu.Item
                            leftSection={<IconEdit size={14} />}
                            onClick={() => handleEdit(category)}
                          >
                            Edit
                          </Menu.Item>
                          <Menu.Divider />
                          <Menu.Item
                            leftSection={<IconTrash size={14} />}
                            color="red"
                            onClick={() => handleDeleteClick(category)}
                            disabled={(category.service_count || 0) > 0}
                          >
                            Delete
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Group>

                    {category.description && (
                      <Text size="sm" c="dimmed" lineClamp={2}>
                        {category.description}
                      </Text>
                    )}

                    <Divider />

                    <Group justify="space-between">
                      <Badge
                        color={(category.service_count || 0) > 0 ? 'green' : 'gray'}
                        variant="light"
                      >
                        {(category.service_count || 0)} Services
                      </Badge>
                      <Text size="sm" c="dimmed">
                        Order: {category.display_order}
                      </Text>
                    </Group>

                    <Group gap="xs">
                      <Button
                        variant="light"
                        color="blue"
                        size="xs"
                        onClick={() => handleView(category)}
                        leftSection={<IconEye size={14} />}
                        fullWidth
                      >
                        View Details
                      </Button>
                    </Group>
                  </Stack>
                </MotionCard>
              ))}
            </AnimatePresence>
          </SimpleGrid>
        )}
      </Stack>

      {/* Category Form Modal */}
      <Modal
        opened={openedForm}
        onClose={closeForm}
        title={editingCategory ? 'Edit Category' : 'Create New Category'}
        size="lg"
        radius="lg"
      >
        <Stack gap="md">
          <TextInput
            label="Category Name"
            placeholder="e.g., Apparel Printing"
            required
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            description="Display name for the category"
          />

          <TextInput
            label="Slug"
            placeholder="e.g., apparel-printing"
            required
            value={formData.slug}
            onChange={(e) => handleInputChange('slug', e.target.value)}
            description="URL-friendly identifier (auto-generated from name)"
          />

          <Textarea
            label="Description"
            placeholder="Brief description of this category..."
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            minRows={3}
            description="Optional description to help users understand this category"
          />

          <Select
            label="Icon"
            placeholder="Select an icon"
            required
            data={ICON_OPTIONS}
            value={formData.icon_name}
            onChange={(value) => handleInputChange('icon_name', value)}
            description="Choose an icon to represent this category"
          />

          <NumberInput
            label="Display Order"
            placeholder="0"
            value={formData.display_order}
            onChange={(val) => handleInputChange('display_order', val || 0)}
            min={0}
            max={999}
            description="Lower numbers appear first"
          />

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={closeForm} disabled={saving}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              loading={saving}
              leftSection={<IconDeviceFloppy size={16} />}
            >
              {editingCategory ? 'Update Category' : 'Create Category'}
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* View Category Modal */}
      <Modal
        opened={openedView}
        onClose={closeView}
        title="Category Details"
        size="lg"
        radius="lg"
      >
        {viewingCategory && (
          <Stack gap="md">
            <Group>
              <ThemeIcon size={60} radius="xl" color="blue" variant="light">
                <Text size="3rem">{getIconEmoji(viewingCategory.icon_name)}</Text>
              </ThemeIcon>
              <div>
                <Title order={3}>{viewingCategory.name}</Title>
                <Text size="sm" c="dimmed">Slug: {viewingCategory.slug}</Text>
              </div>
            </Group>

            <Divider />

            <Grid>
              <Grid.Col span={4}>
                <Text fw={600}>Display Order</Text>
                <Text>{viewingCategory.display_order}</Text>
              </Grid.Col>
              <Grid.Col span={4}>
                <Text fw={600}>Services Count</Text>
                <Badge color={(viewingCategory.service_count || 0) > 0 ? 'green' : 'gray'} size="lg">
                  {(viewingCategory.service_count || 0)} Services
                </Badge>
              </Grid.Col>
              <Grid.Col span={4}>
                <Text fw={600}>Icon</Text>
                <Text>{viewingCategory.icon_name}</Text>
              </Grid.Col>
            </Grid>

            {viewingCategory.description && (
              <>
                <Divider label="Description" />
                <Text>{viewingCategory.description}</Text>
              </>
            )}

            <Divider />

            <Group justify="flex-end">
              <Button variant="light" onClick={closeView}>
                Close
              </Button>
              <Button
                color="blue"
                onClick={() => {
                  closeView();
                  handleEdit(viewingCategory);
                }}
              >
                Edit Category
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={openedDelete}
        onClose={closeDelete}
        title="Delete Category"
        size="md"
        radius="lg"
      >
        {deletingCategory && (
          <Stack gap="md">
            <Alert color="red" icon={<IconTrash size={16} />}>
              <Text fw={500}>Are you sure you want to delete this category?</Text>
              <Text size="sm" mt="xs">
                This action cannot be undone.
              </Text>
            </Alert>

            <Paper withBorder p="md" radius="md">
              <Group>
                <ThemeIcon size="lg" radius="xl" color="blue" variant="light">
                  <Text size="lg">{getIconEmoji(deletingCategory.icon_name)}</Text>
                </ThemeIcon>
                <div>
                  <Text fw={600}>{deletingCategory.name}</Text>
                  <Text size="xs" c="dimmed">Slug: {deletingCategory.slug}</Text>
                </div>
              </Group>
            </Paper>

            {(deletingCategory.service_count || 0) > 0 && (
              <Alert color="yellow" icon={<IconX size={16} />}>
                <Text fw={500}>Cannot Delete</Text>
                <Text size="sm">
                  This category has {(deletingCategory.service_count)} services. 
                  Please reassign or delete those services first.
                </Text>
              </Alert>
            )}

            <Group justify="flex-end">
              <Button variant="light" onClick={closeDelete} disabled={deleting}>
                Cancel
              </Button>
              <Button
                color="red"
                onClick={handleDelete}
                loading={deleting}
                disabled={(deletingCategory.service_count || 0) > 0}
              >
                Delete Category
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Container>
  );
}