/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Paper,
  Title,
  Text,
  Group,
  Button,
  Stack,
  Table,
  Badge,
  Avatar,
  ActionIcon,
  Tooltip,
  TextInput,
  Select,
  Pagination,
  Modal,
  Textarea,
  FileInput,
  Switch,
  Card,
  SimpleGrid,
  Loader,
  Center,
  ScrollArea,
  Tabs,
  Alert,
  Divider,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconEye,
  IconCheck,
  IconX,
  IconSearch,
  IconFilter,
  IconRefresh,
  IconCalendar,
  IconTag,
  IconBell,
  IconDownload,
} from '@tabler/icons-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface Announcement {
  id: string;
  title: string;
  description: string;
  detailed_content: string | null;
  bullet_points: string[];
  cta: string | null;
  cta_link: string | null;
  date: string;
  read_time: number;
  type: string;
  priority: string;
  image_url: string | null;
  tags: string[];
  views: number;
  likes: number;
  comments: number;
  is_featured: boolean;
  is_published: boolean;
  status: string;
  created_at: string;
  creator_name: string;
}

export default function AnnouncementsAdminPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [openedView, { open: openView, close: closeView }] = useDisclosure(false);
  const [openedEdit, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [openedCreate, { open: openCreate, close: closeCreate }] = useDisclosure(false);
  const [stats, setStats] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>('announcements');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    detailed_content: '',
    bullet_points: '',
    cta: '',
    cta_link: '',
    date: dayjs().format('YYYY-MM-DD'),
    read_time: 1,
    type: 'news',
    priority: 'medium',
    tags: '',
    is_featured: false,
    is_published: true,
    status: 'published',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
 const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
        ...(typeFilter && { type: typeFilter }),
      });

      const response = await fetch(`${API_URL}/api/announcements/admin/all?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setAnnouncements(data.data.announcements);
        setTotalPages(data.data.pagination.pages);
      }
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch announcements',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  },[page, search, statusFilter, typeFilter]);
  useEffect(() => {
    fetchAnnouncements();
    fetchStats();
    fetchTypes();
  }, [fetchAnnouncements, page, search, statusFilter, typeFilter]);

 

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/announcements/stats`);
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchTypes = async () => {
    try {
      const response = await fetch(`${API_URL}/api/announcements/types`);
      const data = await response.json();
      if (data.success) {
        setTypes(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch types:', error);
    }
  };

  const handleCreate = async () => {
    setSaving(true);
    const formDataToSend = new FormData();
    
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (key === 'bullet_points') {
          formDataToSend.append(key, value as string);
        } else {
          formDataToSend.append(key, value.toString());
        }
      }
    });
    
    if (imageFile) {
      formDataToSend.append('image', imageFile);
    }

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/api/announcements`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();
      if (data.success) {
        notifications.show({
          title: 'Success',
          message: 'Announcement created successfully',
          color: 'green',
        });
        closeCreate();
        resetForm();
        fetchAnnouncements();
        fetchStats();
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to create announcement',
        color: 'red',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedAnnouncement) return;
    
    setSaving(true);
    const formDataToSend = new FormData();
    
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (key === 'bullet_points') {
          formDataToSend.append(key, value as string);
        } else {
          formDataToSend.append(key, value.toString());
        }
      }
    });
    
    if (imageFile) {
      formDataToSend.append('image', imageFile);
    }

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/api/announcements/${selectedAnnouncement.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();
      if (data.success) {
        notifications.show({
          title: 'Success',
          message: 'Announcement updated successfully',
          color: 'green',
        });
        closeEdit();
        resetForm();
        fetchAnnouncements();
        fetchStats();
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to update announcement',
        color: 'red',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/api/announcements/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        notifications.show({
          title: 'Success',
          message: 'Announcement deleted successfully',
          color: 'green',
        });
        fetchAnnouncements();
        fetchStats();
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete announcement',
        color: 'red',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      detailed_content: '',
      bullet_points: '',
      cta: '',
      cta_link: '',
      date: dayjs().format('YYYY-MM-DD'),
      read_time: 1,
      type: 'news',
      priority: 'medium',
      tags: '',
      is_featured: false,
      is_published: true,
      status: 'published',
    });
    setImageFile(null);
  };

  const editAnnouncement = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      description: announcement.description,
      detailed_content: announcement.detailed_content || '',
      bullet_points: announcement.bullet_points?.join('|') || '',
      cta: announcement.cta || '',
      cta_link: announcement.cta_link || '',
      date: dayjs(announcement.date).format('YYYY-MM-DD'),
      read_time: announcement.read_time,
      type: announcement.type,
      priority: announcement.priority,
      tags: announcement.tags?.join(', ') || '',
      is_featured: announcement.is_featured,
      is_published: announcement.is_published,
      status: announcement.status,
    });
    setImageFile(null);
    openEdit();
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'red';
      case 'medium': return 'yellow';
      case 'low': return 'blue';
      default: return 'gray';
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'promotion': return 'green';
      case 'event': return 'blue';
      case 'news': return 'purple';
      case 'offer': return 'orange';
      case 'update': return 'yellow';
      case 'alert': return 'red';
      default: return 'gray';
    }
  };
{/* Add this helper function at the top of your component, after the API_URL definition */}
const getImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) return '/images/placeholder.jpg';
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Clean up the path
  let cleanPath = imagePath.replace(/\\/g, '/').replace(/^\/+/, '');
  
  // Remove any duplicate 'uploads' in the path
  cleanPath = cleanPath.replace(/uploads\/uploads\//g, 'uploads/');
  
  // Ensure it has the correct prefix
  if (!cleanPath.startsWith('uploads/')) {
    cleanPath = `uploads/${cleanPath}`;
  }
  
  return `${API_URL}/${cleanPath}`;
};
  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between">
          <div>
            <Title order={1}>Announcements Management</Title>
            <Text c="dimmed" size="sm">
              Manage all announcements, promotions, and news
            </Text>
          </div>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => {
              resetForm();
              openCreate();
            }}
            color="red"
          >
            Create Announcement
          </Button>
        </Group>

        {/* Stats Cards */}
        <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
          {stats.map((stat, index) => (
            <Card key={index} withBorder padding="md" radius="md">
              <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                {stat.label}
              </Text>
              <Text fw={700} size="xl">{stat.value}</Text>
            </Card>
          ))}
        </SimpleGrid>

        {/* Filters */}
        <Paper withBorder p="md" radius="md">
          <Group>
            <TextInput
              placeholder="Search announcements..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftSection={<IconSearch size={16} />}
              style={{ flex: 1 }}
              radius="md"
            />
            <Select
              placeholder="Status"
              data={[
                { value: '', label: 'All Status' },
                { value: 'published', label: 'Published' },
                { value: 'draft', label: 'Draft' },
                { value: 'archived', label: 'Archived' },
              ]}
              value={statusFilter}
              onChange={setStatusFilter}
              leftSection={<IconFilter size={16} />}
              w={150}
              radius="md"
              clearable
            />
            <Select
              placeholder="Type"
              data={[
                { value: '', label: 'All Types' },
                ...types.map(t => ({ value: t.type, label: t.type })),
              ]}
              value={typeFilter}
              onChange={setTypeFilter}
              w={150}
              radius="md"
              clearable
            />
            <Button
              variant="light"
              onClick={() => {
                setSearch('');
                setStatusFilter(null);
                setTypeFilter(null);
                setPage(1);
              }}
              leftSection={<IconRefresh size={16} />}
            >
              Reset
            </Button>
          </Group>
        </Paper>

        {/* Announcements Table */}
        <Paper withBorder radius="md" style={{ overflow: 'hidden' }}>
          <ScrollArea>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Title</Table.Th>
                  <Table.Th>Type</Table.Th>
                  <Table.Th>Priority</Table.Th>
                  <Table.Th>Date</Table.Th>
                  <Table.Th>Stats</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Featured</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {loading ? (
                  <Table.Tr>
                    <Table.Td colSpan={8}>
                      <Center py="xl">
                        <Loader />
                      </Center>
                    </Table.Td>
                  </Table.Tr>
                ) : announcements.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={8}>
                      <Center py="xl">
                        <Text c="dimmed">No announcements found</Text>
                      </Center>
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  announcements.map((a) => (
                    <Table.Tr key={a.id}>
                      <Table.Td>
                        <Stack gap={2}>
                          <Text fw={500}>{a.title}</Text>
                          <Text size="xs" c="dimmed" lineClamp={1}>
                            {a.description}
                          </Text>
                        </Stack>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={getTypeColor(a.type)} variant="light">
                          {a.type}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={getPriorityColor(a.priority)}>
                          {a.priority}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{dayjs(a.date).format('MMM D, YYYY')}</Text>
                        <Text size="xs" c="dimmed">{a.read_time} min read</Text>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <Badge size="sm" variant="light">
                            👁️ {a.views}
                          </Badge>
                          <Badge size="sm" variant="light">
                            ❤️ {a.likes}
                          </Badge>
                          <Badge size="sm" variant="light">
                            💬 {a.comments}
                          </Badge>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={a.is_published ? 'green' : 'yellow'}>
                          {a.is_published ? 'Published' : 'Draft'}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        {a.is_featured && (
                          <Badge color="red" variant="filled">⭐ Featured</Badge>
                        )}
                      </Table.Td>
                      <Table.Td>
                        <Group gap={4}>
                          <Tooltip label="View">
                            <ActionIcon
                              size="sm"
                              variant="light"
                              color="blue"
                              onClick={() => {
                                setSelectedAnnouncement(a);
                                openView();
                              }}
                            >
                              <IconEye size={16} />
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip label="Edit">
                            <ActionIcon
                              size="sm"
                              variant="light"
                              color="blue"
                              onClick={() => editAnnouncement(a)}
                            >
                              <IconEdit size={16} />
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip label="Delete">
                            <ActionIcon
                              size="sm"
                              variant="light"
                              color="red"
                              onClick={() => handleDelete(a.id)}
                            >
                              <IconTrash size={16} />
                            </ActionIcon>
                          </Tooltip>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))
                )}
              </Table.Tbody>
            </Table>
          </ScrollArea>

          {/* Pagination */}
          {totalPages > 1 && (
            <Group justify="center" p="md">
              <Pagination
                total={totalPages}
                value={page}
                onChange={setPage}
                withEdges
                radius="md"
              />
            </Group>
          )}
        </Paper>
      </Stack>

      {/* Create/Edit Modal */}
      <Modal
        opened={openedCreate || openedEdit}
        onClose={() => {
          closeCreate();
          closeEdit();
          resetForm();
        }}
        title={openedEdit ? 'Edit Announcement' : 'Create Announcement'}
        size="lg"
        radius="lg"
        scrollAreaComponent={ScrollArea.Autosize}
      >
        <Stack>
          <FileInput
            label="Image"
            placeholder="Upload image"
            accept="image/jpeg,image/png,image/gif,image/webp"
            value={imageFile}
            onChange={setImageFile}
            clearable
          />

          <TextInput
            label="Title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <Textarea
            label="Description"
            required
            minRows={2}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <Textarea
            label="Detailed Content"
            minRows={4}
            value={formData.detailed_content}
            onChange={(e) => setFormData({ ...formData, detailed_content: e.target.value })}
          />

          <TextInput
            label="Bullet Points"
            placeholder="Separate with | (pipe)"
            value={formData.bullet_points}
            onChange={(e) => setFormData({ ...formData, bullet_points: e.target.value })}
          />

          <Group grow>
            <TextInput
              label="CTA Text"
              placeholder="Learn More"
              value={formData.cta}
              onChange={(e) => setFormData({ ...formData, cta: e.target.value })}
            />
            <TextInput
              label="CTA Link"
              placeholder="/services"
              value={formData.cta_link}
              onChange={(e) => setFormData({ ...formData, cta_link: e.target.value })}
            />
          </Group>

          <Group grow>
            <TextInput
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
            <TextInput
              label="Read Time (minutes)"
              type="number"
              min={1}
              value={formData.read_time}
              onChange={(e) => setFormData({ ...formData, read_time: parseInt(e.target.value) || 1 })}
            />
          </Group>

          <Group grow>
            <Select
              label="Type"
              data={[
                { value: 'promotion', label: 'Promotion' },
                { value: 'event', label: 'Event' },
                { value: 'news', label: 'News' },
                { value: 'offer', label: 'Offer' },
                { value: 'update', label: 'Update' },
                { value: 'alert', label: 'Alert' },
              ]}
              value={formData.type}
              onChange={(value) => setFormData({ ...formData, type: value || 'news' })}
            />
            <Select
              label="Priority"
              data={[
                { value: 'high', label: 'High' },
                { value: 'medium', label: 'Medium' },
                { value: 'low', label: 'Low' },
              ]}
              value={formData.priority}
              onChange={(value) => setFormData({ ...formData, priority: value || 'medium' })}
            />
          </Group>

          <TextInput
            label="Tags"
            placeholder="Separate with commas"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          />

          <Group grow>
            <Switch
              label="Featured"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.currentTarget.checked })}
            />
            <Switch
              label="Published"
              checked={formData.is_published}
              onChange={(e) => setFormData({ ...formData, is_published: e.currentTarget.checked })}
            />
          </Group>

          <Group justify="flex-end">
            <Button variant="light" onClick={() => {
              closeCreate();
              closeEdit();
              resetForm();
            }}>
              Cancel
            </Button>
            <Button
              onClick={openedEdit ? handleUpdate : handleCreate}
              loading={saving}
              color="red"
            >
              {openedEdit ? 'Update' : 'Create'}
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* View Modal */}
      <Modal
        opened={openedView}
        onClose={closeView}
        title="Announcement Details"
        size="lg"
        radius="lg"
      >
        {selectedAnnouncement && (
          <Stack>
           {selectedAnnouncement.image_url && (
            <div className="relative h-64 rounded-lg overflow-hidden bg-gray-100">
              <img
                src={getImageUrl(selectedAnnouncement.image_url)}
                alt={selectedAnnouncement.title}
                className="w-full h-full object-contain"
                onError={(e) => {
                  console.error('Failed to load image:', selectedAnnouncement.image_url);
                  e.currentTarget.src = '/images/placeholder.jpg';
                }}
              />
            </div>
)}

            <Group>
              <Badge color={getTypeColor(selectedAnnouncement.type)} size="lg">
                {selectedAnnouncement.type}
              </Badge>
              <Badge color={getPriorityColor(selectedAnnouncement.priority)}>
                {selectedAnnouncement.priority} priority
              </Badge>
              {selectedAnnouncement.is_featured && (
                <Badge color="red" variant="filled">Featured</Badge>
              )}
            </Group>

            <Title order={2}>{selectedAnnouncement.title}</Title>

            <Text size="lg">{selectedAnnouncement.description}</Text>

            {selectedAnnouncement.detailed_content && (
              <Text>{selectedAnnouncement.detailed_content}</Text>
            )}

            {selectedAnnouncement.bullet_points?.length > 0 && (
              <ul className="list-disc list-inside space-y-2">
                {selectedAnnouncement.bullet_points.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            )}

            {selectedAnnouncement.tags?.length > 0 && (
              <Group gap="xs">
                {selectedAnnouncement.tags.map((tag, i) => (
                  <Badge key={i} variant="light" color="gray">
                    #{tag}
                  </Badge>
                ))}
              </Group>
            )}

            <Divider />

            <Group>
              <Group gap={4}>
                <IconCalendar size={16} />
                <Text size="sm">{dayjs(selectedAnnouncement.date).format('MMMM D, YYYY')}</Text>
              </Group>
              <Group gap={4}>
                <IconEye size={16} />
                <Text size="sm">{selectedAnnouncement.views} views</Text>
              </Group>
              <Group gap={4}>
                <IconTag size={16} />
                <Text size="sm">{selectedAnnouncement.likes} likes</Text>
              </Group>
            </Group>

            {selectedAnnouncement.cta && (
              <Button
                component="a"
                href={selectedAnnouncement.cta_link || '#'}
                target="_blank"
                color="red"
              >
                {selectedAnnouncement.cta}
              </Button>
            )}
          </Stack>
        )}
      </Modal>
    </Container>
  );
}