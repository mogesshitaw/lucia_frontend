/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
  Switch,
  NumberInput,
  Textarea,
  TagsInput,
  Modal,
  Tabs,
  SimpleGrid,
  Divider,
  Loader,
  Pagination,
  Center,
} from '@mantine/core';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconEye,
  IconEyeOff,
  IconSearch,
  IconRefresh,
  IconPrinter,
  IconShirt,
  IconTag,
  IconCoffee,
  IconCar,
  IconPackage,
  IconFileText,
  IconPalette,
  IconDeviceFloppy,
  IconUpload,
  IconFolder,
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/navigation';
import { Dropzone } from '@mantine/dropzone';
import { useDisclosure } from '@mantine/hooks';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Icon options
const ICON_OPTIONS = [
  { value: 'Printer', label: 'Printer', icon: <IconPrinter size={16} /> },
  { value: 'Shirt', label: 'Shirt', icon: <IconShirt size={16} /> },
  { value: 'Megaphone', label: 'Megaphone', icon: <IconPrinter size={16} /> },
  { value: 'Tag', label: 'Tag', icon: <IconTag size={16} /> },
  { value: 'Coffee', label: 'Coffee', icon: <IconCoffee size={16} /> },
  { value: 'Car', label: 'Car', icon: <IconCar size={16} /> },
  { value: 'Package', label: 'Package', icon: <IconPackage size={16} /> },
  { value: 'FileText', label: 'File Text', icon: <IconFileText size={16} /> },
  { value: 'Palette', label: 'Palette', icon: <IconPalette size={16} /> },
  { value: 'Sparkles', label: 'Sparkles', icon: <IconPrinter size={16} /> },
  { value: 'Award', label: 'Award', icon: <IconPrinter size={16} /> },
  { value: 'Flame', label: 'Flame', icon: <IconPrinter size={16} /> },
  { value: 'Snowflake', label: 'Snowflake', icon: <IconPrinter size={16} /> },
  { value: 'Scissors', label: 'Scissors', icon: <IconPrinter size={16} /> },
  { value: 'Camera', label: 'Camera', icon: <IconPrinter size={16} /> },
  { value: 'Key', label: 'Key', icon: <IconPrinter size={16} /> },
  { value: 'Pen', label: 'Pen', icon: <IconPrinter size={16} /> },
];

// Gradient options
const GRADIENT_OPTIONS = [
  { value: 'from-purple-500 to-pink-500', label: 'Purple to Pink' },
  { value: 'from-blue-500 to-cyan-500', label: 'Blue to Cyan' },
  { value: 'from-red-500 to-orange-500', label: 'Red to Orange' },
  { value: 'from-green-500 to-emerald-500', label: 'Green to Emerald' },
  { value: 'from-yellow-500 to-orange-500', label: 'Yellow to Orange' },
  { value: 'from-gray-500 to-gray-700', label: 'Gray' },
  { value: 'from-indigo-500 to-purple-500', label: 'Indigo to Purple' },
  { value: 'from-pink-500 to-rose-500', label: 'Pink to Rose' },
  { value: 'from-teal-500 to-green-500', label: 'Teal to Green' },
];

interface Service {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  category: string;
  badge?: string;
  price_range: string;
  status: string;
  is_featured: boolean;
  is_popular: boolean;
  is_new: boolean;
  display_order: number;
  created_at: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  icon_name: string;
}

export default function AdminServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  
  // Modal states
  const [openedForm, { open: openForm, close: closeForm }] = useDisclosure(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    title: '',
    slug: '',
    short_description: '',
    full_description: '',
    icon_name: 'Printer',
    gradient_from: 'from-purple-500',
    gradient_to: 'to-pink-500',
    badge: '',
    category: '',
    subcategory: '',
    price_range: '',
    min_order: '',
    turnaround: '',
    is_featured: false,
    is_popular: false,
    is_new: false,
    display_order: 0,
    status: 'active',
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    features: [],
    applications: [],
    process_steps: [],
    specifications: [],
    materials: [],
    formats: [],
    colors: [],
    faqs: [],
  });
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [existingGallery, setExistingGallery] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  // Fetch services
  const fetchServices = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(searchQuery && { search: searchQuery }),
        ...(selectedCategory && { category: selectedCategory }),
        ...(selectedStatus && { status: selectedStatus }),
      });

      const response = await fetch(`${API_URL}/api/admin/services?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      
      if (data.success) {
        setServices(data.data);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch services',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/api/admin/services/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, [page, searchQuery, selectedCategory, selectedStatus]);

  // Handle form input changes
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    
    // Auto-generate slug from title
    if (field === 'title') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData((prev: any) => ({ ...prev, slug }));
    }
  };

  // Handle array field changes
  const handleArrayChange = (field: string, index: number, key: string, value: any) => {
    const newArray = [...formData[field]];
    newArray[index] = { ...newArray[index], [key]: value };
    setFormData((prev: any) => ({ ...prev, [field]: newArray }));
  };

  const addArrayItem = (field: string, defaultValue = {}) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: [...(prev[field] || []), defaultValue],
    }));
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: prev[field].filter((_: any, i: number) => i !== index),
    }));
  };

  // Handle save service
// Handle save service
const handleSave = async () => {
  setSaving(true);
  try {
    const token = localStorage.getItem('accessToken');
    const formDataToSend = new FormData();
    
    // IMPORTANT: Send ALL form data, including empty arrays
    // This ensures the backend receives all fields
    Object.keys(formData).forEach(key => {
      const value = formData[key];
      
      if (key === 'gallery') {
        // Skip gallery as it's handled separately
        return;
      }
      
      // Handle different types of values
      if (Array.isArray(value)) {
        // Always send arrays as JSON strings, even if empty
        // This is crucial - if you don't send empty arrays, the backend might not update them
        formDataToSend.append(key, JSON.stringify(value));
        console.log(`Appending ${key}:`, JSON.stringify(value)); // Debug log
      } else if (typeof value === 'object' && value !== null) {
        formDataToSend.append(key, JSON.stringify(value));
        console.log(`Appending ${key}:`, JSON.stringify(value)); // Debug log
      } else {
        // For strings, numbers, booleans, etc.
        formDataToSend.append(key, value?.toString() || '');
        console.log(`Appending ${key}:`, value?.toString() || ''); // Debug log
      }
    });
    
    // Append gallery files
    galleryFiles.forEach(file => {
      formDataToSend.append('gallery', file);
    });

    // Handle deleted images
    if (editingService) {
      const originalGallery = editingService.gallery || [];
      const currentGalleryIds = existingGallery.map(img => img.id);
      const deletedImages = originalGallery
        .filter((img: any) => !currentGalleryIds.includes(img.id))
        .map((img: any) => img.id);
      
      if (deletedImages.length > 0) {
        formDataToSend.append('deleted_images', JSON.stringify(deletedImages));
        console.log('Deleted images:', JSON.stringify(deletedImages)); // Debug log
      }
    }

    const url = editingService
      ? `${API_URL}/api/admin/services/${editingService.id}`
      : `${API_URL}/api/admin/services`;
    
    console.log('Sending form data to:', url); // Debug log
    
    const response = await fetch(url, {
      method: editingService ? 'PUT' : 'POST',
      headers: { 
        Authorization: `Bearer ${token}`,
        // Don't set Content-Type header when sending FormData
        // The browser will set it automatically with the correct boundary
      },
      body: formDataToSend,
    });

    const data = await response.json();

    if (data.success) {
      notifications.show({
        title: 'Success',
        message: `Service ${editingService ? 'updated' : 'created'} successfully`,
        color: 'green',
      });
      closeForm();
      fetchServices();
      resetForm();
    } else {
      throw new Error(data.message);
    }
  } catch (error: any) {
    console.error('Save error:', error); // Debug log
    notifications.show({
      title: 'Error',
      message: error.message || 'Failed to save service',
      color: 'red',
    });
  } finally {
    setSaving(false);
  }
};
  // Handle delete service
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/api/admin/services/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.success) {
        notifications.show({
          title: 'Success',
          message: 'Service deleted successfully',
          color: 'green',
        });
        fetchServices();
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete service',
        color: 'red',
      });
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/api/admin/services/${id}/toggle-status`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        notifications.show({
          title: 'Success',
          message: data.message,
          color: 'green',
        });
        fetchServices();
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update service status',
        color: 'red',
      });
    }
  };

  // Reset form
 // Reset form
const resetForm = () => {
  setFormData({
    title: '',
    slug: '',
    short_description: '',
    full_description: '',
    icon_name: 'Printer',
    gradient_from: 'from-purple-500',
    gradient_to: 'to-pink-500',
    badge: '',
    category: '',
    subcategory: '',
    price_range: '',
    min_order: '',
    turnaround: '',
    is_featured: false,
    is_popular: false,
    is_new: false,
    display_order: 0,
    status: 'active',
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    features: [],
    applications: [],
    process_steps: [],
    specifications: [],
    materials: [],
    formats: [],
    colors: [],
    faqs: [],
  });
  setGalleryFiles([]);
  setExistingGallery([]);
  setEditingService(null);
};
// Edit service
const handleEdit = async (service: any) => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${API_URL}/api/admin/services/${service.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    
    if (data.success) {
      console.log('Fetched service data:', data.data); // Debug log
      
      setEditingService(data.data);
      
      // Helper function to parse array fields that might come as JSON strings
      const parseArrayField = (field: any) => {
        if (!field) return [];
        if (Array.isArray(field)) return field;
        if (typeof field === 'string') {
          try {
            const parsed = JSON.parse(field);
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return [];
          }
        }
        return [];
      };

      setFormData({
        // Basic Info
        title: data.data.title || '',
        slug: data.data.slug || '',
        short_description: data.data.short_description || '',
        full_description: data.data.full_description || '',
        icon_name: data.data.icon_name || 'Printer',
        gradient_from: data.data.gradient_from || 'from-purple-500',
        gradient_to: data.data.gradient_to || 'to-pink-500',
        badge: data.data.badge || '',
        category: data.data.category || '',
        subcategory: data.data.subcategory || '',
        price_range: data.data.price_range || '',
        min_order: data.data.min_order || '',
        turnaround: data.data.turnaround || '',
        
        // Status flags
        is_featured: data.data.is_featured || false,
        is_popular: data.data.is_popular || false,
        is_new: data.data.is_new || false,
        display_order: data.data.display_order || 0,
        status: data.data.status || 'active',
        
        // SEO
        seo_title: data.data.seo_title || '',
        seo_description: data.data.seo_description || '',
        seo_keywords: data.data.seo_keywords || '',
        
        // Arrays - parse them properly
        features: parseArrayField(data.data.features),
        applications: parseArrayField(data.data.applications),
        process_steps: parseArrayField(data.data.process_steps),
        specifications: parseArrayField(data.data.specifications),
        materials: parseArrayField(data.data.materials),
        formats: parseArrayField(data.data.formats),
        colors: parseArrayField(data.data.colors),
        faqs: parseArrayField(data.data.faqs),
      });
      
      setExistingGallery(data.data.gallery || []);
      openForm();
    }
  } catch (error) {
    console.error('Edit error:', error); // Debug log
    notifications.show({
      title: 'Error',
      message: 'Failed to load service details',
      color: 'red',
    });
  }
};

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between">
          <div>
            <Title order={1}>Service Management</Title>
            <Text c="dimmed" size="sm">
              Manage all your printing services, create new ones, and update existing ones
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
            Add New Service
          </Button>
        </Group>

        {/* Filters */}
        <Paper withBorder p="md" radius="lg">
          <Group>
            <TextInput
              placeholder="Search services..."
              leftSection={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1 }}
            />
            <Select
              placeholder="All Categories"
              data={[
                { value: '', label: 'All Categories' },
                ...categories.map(c => ({ value: c.slug, label: c.name })),
              ]}
              value={selectedCategory}
              onChange={setSelectedCategory}
              clearable
              leftSection={<IconFolder size={16} />}
            />
            <Select
              placeholder="All Status"
              data={[
                { value: '', label: 'All Status' },
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ]}
              value={selectedStatus}
              onChange={setSelectedStatus}
              clearable
            />
            <Button variant="light" onClick={fetchServices} leftSection={<IconRefresh size={16} />}>
              Refresh
            </Button>
          </Group>
        </Paper>

        {/* Services Grid */}
        {loading ? (
          <Center py="xl">
            <Loader size="lg" />
          </Center>
        ) : (
          <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
            {services.map((service) => (
              <Card key={service.id} withBorder radius="lg" padding="lg">
                <Stack>
                  <Group justify="space-between">
                    <Badge
                      color={service.status === 'active' ? 'green' : 'red'}
                      variant="light"
                    >
                      {service.status}
                    </Badge>
                    <Group gap={4}>
                      <Tooltip label="Edit">
                        <ActionIcon
                          variant="light"
                          color="blue"
                          onClick={() => handleEdit(service)}
                        >
                          <IconEdit size={16} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label={service.status === 'active' ? 'Deactivate' : 'Activate'}>
                        <ActionIcon
                          variant="light"
                          color={service.status === 'active' ? 'yellow' : 'green'}
                          onClick={() => handleToggleStatus(service.id, service.status)}
                        >
                          {service.status === 'active' ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="Delete">
                        <ActionIcon
                          variant="light"
                          color="red"
                          onClick={() => handleDelete(service.id)}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </Group>

                  <div>
                    <Group gap="xs" mb={4}>
                      {service.is_featured && (
                        <Badge size="xs" color="yellow">Featured</Badge>
                      )}
                      {service.is_popular && (
                        <Badge size="xs" color="blue">Popular</Badge>
                      )}
                      {service.is_new && (
                        <Badge size="xs" color="green">New</Badge>
                      )}
                    </Group>
                    <Text fw={600} size="lg">{service.title}</Text>
                    {service.badge && (
                      <Badge color="red" variant="light" size="sm">
                        {service.badge}
                      </Badge>
                    )}
                  </div>

                  <Text size="sm" c="dimmed" lineClamp={2}>
                    {service.short_description}
                  </Text>

                  <Divider />

                  <Group justify="space-between">
                    <div>
                      <Text size="xs" c="dimmed">Price Range</Text>
                      <Text fw={600}>{service.price_range}</Text>
                    </div>
                    <div>
                      <Text size="xs" c="dimmed">Order</Text>
                      <Text fw={600}>{service.display_order}</Text>
                    </div>
                  </Group>

                  <Group gap="xs">
                    <Text size="xs" c="dimmed">Slug:</Text>
                    <Text size="xs">{service.slug}</Text>
                  </Group>

                  <Button
                    variant="light"
                    color="blue"
                    size="xs"
                    onClick={() => window.open(`/page/services/${service.slug}`, '_blank')}
                  >
                    View Page
                  </Button>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Group justify="center">
            <Pagination
              total={totalPages}
              value={page}
              onChange={setPage}
              withEdges
            />
          </Group>
        )}
      </Stack>

      {/* Service Form Modal */}
      <Modal
        opened={openedForm}
        onClose={closeForm}
        title={editingService ? 'Edit Service' : 'Create New Service'}
        size="xl"
        radius="lg"
      >
        <Tabs defaultValue="basic">
          <Tabs.List>
            <Tabs.Tab value="basic">Basic Info</Tabs.Tab>
            <Tabs.Tab value="details">Details</Tabs.Tab>
            <Tabs.Tab value="features">Features & Apps</Tabs.Tab>
            <Tabs.Tab value="process">Process</Tabs.Tab>
            <Tabs.Tab value="specs">Specifications</Tabs.Tab>
            <Tabs.Tab value="faq">FAQ</Tabs.Tab>
            <Tabs.Tab value="seo">SEO</Tabs.Tab>
            <Tabs.Tab value="gallery">Gallery</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="basic" pt="md">
            <Stack>
              <TextInput
                label="Title"
                required
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
              
              <TextInput
                label="Slug"
                required
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
              />
              
              <Textarea
                label="Short Description"
                required
                value={formData.short_description}
                onChange={(e) => handleInputChange('short_description', e.target.value)}
                minRows={3}
              />
              
              <Textarea
                label="Full Description"
                required
                value={formData.full_description}
                onChange={(e) => handleInputChange('full_description', e.target.value)}
                minRows={5}
              />
              
              <Grid>
                <Grid.Col span={6}>
                  <Select
                    label="Icon"
                    data={ICON_OPTIONS}
                    value={formData.icon_name}
                    onChange={(val) => handleInputChange('icon_name', val)}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <Select
                    label="Gradient"
                    data={GRADIENT_OPTIONS}
                    value={`${formData.gradient_from} ${formData.gradient_to}`}
                    onChange={(val) => {
                      const [from, to] = val?.split(' ') || [];
                      handleInputChange('gradient_from', from);
                      handleInputChange('gradient_to', to);
                    }}
                  />
                </Grid.Col>
              </Grid>
              
              <Grid>
                <Grid.Col span={4}>
                  <TextInput
                    label="Badge"
                    placeholder="e.g., Popular"
                    value={formData.badge}
                    onChange={(e) => handleInputChange('badge', e.target.value)}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <Select
                    label="Category"
                    data={categories.map(c => ({ value: c.slug, label: c.name }))}
                    value={formData.category}
                    onChange={(val) => handleInputChange('category', val)}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <TextInput
                    label="Subcategory"
                    value={formData.subcategory}
                    onChange={(e) => handleInputChange('subcategory', e.target.value)}
                  />
                </Grid.Col>
              </Grid>
              
              <Grid>
                <Grid.Col span={4}>
                  <TextInput
                    label="Price Range"
                    placeholder="e.g., ETB 150 - 500"
                    value={formData.price_range}
                    onChange={(e) => handleInputChange('price_range', e.target.value)}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <TextInput
                    label="Minimum Order"
                    placeholder="e.g., 1 piece"
                    value={formData.min_order}
                    onChange={(e) => handleInputChange('min_order', e.target.value)}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <TextInput
                    label="Turnaround Time"
                    placeholder="e.g., 2-3 days"
                    value={formData.turnaround}
                    onChange={(e) => handleInputChange('turnaround', e.target.value)}
                  />
                </Grid.Col>
              </Grid>
              
              <Grid>
                <Grid.Col span={3}>
                  <Switch
                    label="Featured"
                    checked={formData.is_featured}
                    onChange={(e) => handleInputChange('is_featured', e.currentTarget.checked)}
                  />
                </Grid.Col>
                <Grid.Col span={3}>
                  <Switch
                    label="Popular"
                    checked={formData.is_popular}
                    onChange={(e) => handleInputChange('is_popular', e.currentTarget.checked)}
                  />
                </Grid.Col>
                <Grid.Col span={3}>
                  <Switch
                    label="New"
                    checked={formData.is_new}
                    onChange={(e) => handleInputChange('is_new', e.currentTarget.checked)}
                  />
                </Grid.Col>
                <Grid.Col span={3}>
                  <NumberInput
                    label="Display Order"
                    value={formData.display_order}
                    onChange={(val) => handleInputChange('display_order', val)}
                  />
                </Grid.Col>
              </Grid>
              
              <Select
                label="Status"
                data={[
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                ]}
                value={formData.status}
                onChange={(val) => handleInputChange('status', val)}
              />
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="details" pt="md">
            <Stack>
              <Divider label="Features" />
              {formData.features?.map((feature: string, index: number) => (
                <Group key={index}>
                  <TextInput
                    style={{ flex: 1 }}
                    value={feature}
                    onChange={(e) => {
                      const newFeatures = [...formData.features];
                      newFeatures[index] = e.target.value;
                      handleInputChange('features', newFeatures);
                    }}
                  />
                  <ActionIcon color="red" onClick={() => removeArrayItem('features', index)}>
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              ))}
              <Button
                variant="light"
                onClick={() => addArrayItem('features', '')}
                leftSection={<IconPlus size={16} />}
              >
                Add Feature
              </Button>

              <Divider label="Applications" mt="md" />
              {formData.applications?.map((app: string, index: number) => (
                <Group key={index}>
                  <TextInput
                    style={{ flex: 1 }}
                    value={app}
                    onChange={(e) => {
                      const newApps = [...formData.applications];
                      newApps[index] = e.target.value;
                      handleInputChange('applications', newApps);
                    }}
                  />
                  <ActionIcon color="red" onClick={() => removeArrayItem('applications', index)}>
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              ))}
              <Button
                variant="light"
                onClick={() => addArrayItem('applications', '')}
                leftSection={<IconPlus size={16} />}
              >
                Add Application
              </Button>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="process" pt="md">
            <Stack>
              {formData.process_steps?.map((step: any, index: number) => (
                <Paper key={index} withBorder p="md">
                  <Group justify="space-between" mb="xs">
                    <Text fw={600}>Step {index + 1}</Text>
                    <ActionIcon color="red" onClick={() => removeArrayItem('process_steps', index)}>
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                  <Grid>
                    <Grid.Col span={6}>
                      <TextInput
                        label="Title"
                        value={step.title}
                        onChange={(e) => handleArrayChange('process_steps', index, 'title', e.target.value)}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Select
                        label="Icon"
                        data={ICON_OPTIONS}
                        value={step.icon}
                        onChange={(val) => handleArrayChange('process_steps', index, 'icon', val)}
                      />
                    </Grid.Col>
                  </Grid>
                  <Textarea
                    label="Description"
                    value={step.description}
                    onChange={(e) => handleArrayChange('process_steps', index, 'description', e.target.value)}
                    mt="xs"
                  />
                </Paper>
              ))}
              <Button
                variant="light"
                onClick={() => addArrayItem('process_steps', { title: '', description: '', icon: 'Printer' })}
                leftSection={<IconPlus size={16} />}
              >
                Add Step
              </Button>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="specs" pt="md">
            <Stack>
              <Divider label="Specifications" />
              {formData.specifications?.map((spec: any, index: number) => (
                <Group key={index} grow>
                  <TextInput
                    placeholder="Label (e.g., Max Size)"
                    value={spec.label}
                    onChange={(e) => handleArrayChange('specifications', index, 'label', e.target.value)}
                  />
                  <TextInput
                    placeholder="Value (e.g., 16x20 inches)"
                    value={spec.value}
                    onChange={(e) => handleArrayChange('specifications', index, 'value', e.target.value)}
                  />
                  <ActionIcon color="red" onClick={() => removeArrayItem('specifications', index)}>
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              ))}
              <Button
                variant="light"
                onClick={() => addArrayItem('specifications', { label: '', value: '' })}
                leftSection={<IconPlus size={16} />}
              >
                Add Specification
              </Button>

              <Divider label="Materials" mt="md" />
              {formData.materials?.map((material: string, index: number) => (
                <Group key={index}>
                  <TextInput
                    style={{ flex: 1 }}
                    value={material}
                    onChange={(e) => {
                      const newMaterials = [...formData.materials];
                      newMaterials[index] = e.target.value;
                      handleInputChange('materials', newMaterials);
                    }}
                  />
                  <ActionIcon color="red" onClick={() => removeArrayItem('materials', index)}>
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              ))}
              <Button
                variant="light"
                onClick={() => addArrayItem('materials', '')}
                leftSection={<IconPlus size={16} />}
              >
                Add Material
              </Button>

              <Divider label="Formats" mt="md" />
              {formData.formats?.map((format: string, index: number) => (
                <Group key={index}>
                  <TextInput
                    style={{ flex: 1 }}
                    value={format}
                    onChange={(e) => {
                      const newFormats = [...formData.formats];
                      newFormats[index] = e.target.value;
                      handleInputChange('formats', newFormats);
                    }}
                  />
                  <ActionIcon color="red" onClick={() => removeArrayItem('formats', index)}>
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              ))}
              <Button
                variant="light"
                onClick={() => addArrayItem('formats', '')}
                leftSection={<IconPlus size={16} />}
              >
                Add Format
              </Button>

              <Divider label="Colors" mt="md" />
              {formData.colors?.map((color: string, index: number) => (
                <Group key={index}>
                  <TextInput
                    style={{ flex: 1 }}
                    value={color}
                    onChange={(e) => {
                      const newColors = [...formData.colors];
                      newColors[index] = e.target.value;
                      handleInputChange('colors', newColors);
                    }}
                  />
                  <ActionIcon color="red" onClick={() => removeArrayItem('colors', index)}>
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              ))}
              <Button
                variant="light"
                onClick={() => addArrayItem('colors', '')}
                leftSection={<IconPlus size={16} />}
              >
                Add Color
              </Button>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="faq" pt="md">
            <Stack>
              {formData.faqs?.map((faq: any, index: number) => (
                <Paper key={index} withBorder p="md">
                  <Group justify="space-between" mb="xs">
                    <Text fw={600}>FAQ {index + 1}</Text>
                    <ActionIcon color="red" onClick={() => removeArrayItem('faqs', index)}>
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                  <TextInput
                    label="Question"
                    value={faq.question}
                    onChange={(e) => handleArrayChange('faqs', index, 'question', e.target.value)}
                    mb="xs"
                  />
                  <Textarea
                    label="Answer"
                    value={faq.answer}
                    onChange={(e) => handleArrayChange('faqs', index, 'answer', e.target.value)}
                    minRows={2}
                  />
                </Paper>
              ))}
              <Button
                variant="light"
                onClick={() => addArrayItem('faqs', { question: '', answer: '' })}
                leftSection={<IconPlus size={16} />}
              >
                Add FAQ
              </Button>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="seo" pt="md">
            <Stack>
              <TextInput
                label="SEO Title"
                value={formData.seo_title}
                onChange={(e) => handleInputChange('seo_title', e.target.value)}
              />
              <Textarea
                label="SEO Description"
                value={formData.seo_description}
                onChange={(e) => handleInputChange('seo_description', e.target.value)}
                minRows={3}
              />
              <TagsInput
                label="SEO Keywords"
                placeholder="Enter keywords and press Enter"
                value={formData.seo_keywords?.split(',').map((k: string) => k.trim()) || []}
                onChange={(tags) => handleInputChange('seo_keywords', tags.join(','))}
              />
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="gallery" pt="md">
            <Stack>
              {existingGallery.length > 0 && (
                <>
                  <Text fw={500}>Existing Images</Text>
                  <SimpleGrid cols={4}>
                    {existingGallery.map((img) => (
                      <Paper key={img.id} withBorder p="xs">
                        <img
                          src={`${API_URL}/${img.thumbnail_path}`}
                          alt={img.alt}
                          style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 4 }}
                        />
                        <Group justify="center" mt="xs">
                          <ActionIcon
                            size="sm"
                            color="red"
                            onClick={() => {
                              setExistingGallery(prev => prev.filter(i => i.id !== img.id));
                            }}
                          >
                            <IconTrash size={14} />
                          </ActionIcon>
                        </Group>
                      </Paper>
                    ))}
                  </SimpleGrid>
                </>
              )}

              <Text fw={500}>Upload New Images</Text>
              <Dropzone
                onDrop={setGalleryFiles}
                accept={['image/png', 'image/jpeg', 'image/gif', 'image/webp']}
                maxSize={10 * 1024 * 1024}
                multiple
              >
                <Group justify="center" gap="xl" style={{ minHeight: 120 }}>
                  <IconUpload size={50} stroke={1.5} />
                  <div>
                    <Text size="xl" fw={600}>
                      Drag images or click to upload
                    </Text>
                    <Text size="sm" c="dimmed">
                      Add up to 10 images, each up to 10MB
                    </Text>
                  </div>
                </Group>
              </Dropzone>

              {galleryFiles.length > 0 && (
                <>
                  <Text fw={500}>New Images to Upload</Text>
                  <SimpleGrid cols={4}>
                    {galleryFiles.map((file, index) => (
                      <Paper key={index} withBorder p="xs">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 4 }}
                        />
                        <Text size="xs" ta="center" mt={4} lineClamp={1}>
                          {file.name}
                        </Text>
                      </Paper>
                    ))}
                  </SimpleGrid>
                </>
              )}
            </Stack>
          </Tabs.Panel>
        </Tabs>

        <Group justify="flex-end" mt="xl">
          <Button variant="light" onClick={closeForm}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            loading={saving}
            leftSection={<IconDeviceFloppy size={16} />}
          >
            {editingService ? 'Update' : 'Create'} Service
          </Button>
        </Group>
      </Modal>
    </Container>
  );
}