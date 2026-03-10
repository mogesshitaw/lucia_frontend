'use client';

import { useState, useEffect } from 'react';
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
  Rating,
  FileInput,
  Switch,
  Card,
  SimpleGrid,
  Loader,
  Center,
  ScrollArea,
  Flex,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconCheck,
  IconX,
  IconEye,
  IconTrash,
  IconStar,
  IconStarFilled,
  IconRefresh,
  IconSearch,
  IconFilter,
  IconPlus,
} from '@tabler/icons-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface Testimonial {
  id: string;
  customer_name: string;
  customer_role: string | null;
  company: string | null;
  content: string;
  rating: number;
  avatar_url: string | null;
  avatar_path: string | null;
  email: string | null;
  status: 'pending' | 'approved' | 'rejected';
  is_featured: boolean;
  source: string;
  created_at: string;
  approved_at: string | null;
  approver_name: string | null;
}

export default function TestimonialsAdminPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [openedView, { open: openView, close: closeView }] = useDisclosure(false);
  const [openedEdit, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [openedAdd, { open: openAdd, close: closeAdd }] = useDisclosure(false);
  const [stats, setStats] = useState<any>({});

  // Edit form state
  const [editForm, setEditForm] = useState({
    customer_name: '',
    customer_role: '',
    company: '',
    content: '',
    rating: 5,
    email: '',
    avatar_url: '',
    is_featured: false,
    status: 'pending',
  });
  const [editAvatarFile, setEditAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTestimonials();
    fetchStats();
  }, [page, search, statusFilter]);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
      });

      const response = await fetch(`${API_URL}/api/testimonials?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setTestimonials(data.data.testimonials);
        setTotalPages(data.data.pagination.pages);
      }
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch testimonials',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/api/testimonials/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/api/testimonials/${id}/approve`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        notifications.show({ 
          title: 'Success', 
          message: 'Testimonial approved', 
          color: 'green',
          icon: <IconCheck size={16} />,
        });
        fetchTestimonials();
        fetchStats();
      }
    } catch (error) {
      notifications.show({ 
        title: 'Error', 
        message: 'Failed to approve', 
        color: 'red',
        icon: <IconX size={16} />,
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/api/testimonials/${id}/reject`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        notifications.show({ 
          title: 'Success', 
          message: 'Testimonial rejected', 
          color: 'orange',
          icon: <IconX size={16} />,
        });
        fetchTestimonials();
        fetchStats();
      }
    } catch (error) {
      notifications.show({ 
        title: 'Error', 
        message: 'Failed to reject', 
        color: 'red',
        icon: <IconX size={16} />,
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/api/testimonials/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        notifications.show({ 
          title: 'Success', 
          message: 'Testimonial deleted', 
          color: 'green',
          icon: <IconCheck size={16} />,
        });
        fetchTestimonials();
        fetchStats();
      }
    } catch (error) {
      notifications.show({ 
        title: 'Error', 
        message: 'Failed to delete', 
        color: 'red',
        icon: <IconX size={16} />,
      });
    }
  };

  const handleToggleFeatured = async (id: string, currentValue: boolean) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/api/testimonials/${id}/toggle-featured`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        notifications.show({ 
          title: 'Success', 
          message: `Testimonial ${!currentValue ? 'featured' : 'unfeatured'}`, 
          color: 'green',
        });
        fetchTestimonials();
      }
    } catch (error) {
      notifications.show({ 
        title: 'Error', 
        message: 'Failed to update featured status', 
        color: 'red',
      });
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setEditForm({
      customer_name: testimonial.customer_name,
      customer_role: testimonial.customer_role || '',
      company: testimonial.company || '',
      content: testimonial.content,
      rating: testimonial.rating,
      email: testimonial.email || '',
      avatar_url: testimonial.avatar_url || '',
      is_featured: testimonial.is_featured,
      status: testimonial.status,
    });
    setEditAvatarFile(null);
    openEdit();
  };

  const handleSaveEdit = async () => {
    if (!selectedTestimonial) return;
    
    setSaving(true);
    const formData = new FormData();
    
    Object.entries(editForm).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });
    
    if (editAvatarFile) {
      formData.append('avatar', editAvatarFile);
    }

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/api/testimonials/${selectedTestimonial.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        notifications.show({
          title: 'Success',
          message: 'Testimonial updated successfully',
          color: 'green',
        });
        fetchTestimonials();
        closeEdit();
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to update testimonial',
        color: 'red',
      });
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'yellow',
      approved: 'green',
      rejected: 'red',
    };
    return (
      <Badge color={colors[status as keyof typeof colors] || 'gray'} variant="light">
        {status}
      </Badge>
    );
  };

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between">
          <div>
            <Title order={1}>Testimonials Management</Title>
            <Text c="dimmed" size="sm">
              Manage customer testimonials and reviews
            </Text>
          </div>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={openAdd}
            color="blue"
          >
            Add Testimonial
          </Button>
        </Group>

        {/* Stats Cards */}
        <SimpleGrid cols={{ base: 2, md: 5 }} spacing="md">
          <Card withBorder padding="md" radius="md">
            <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Total</Text>
            <Text fw={700} size="xl">{stats.total || 0}</Text>
          </Card>
          <Card withBorder padding="md" radius="md" bg="yellow.0">
            <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Pending</Text>
            <Text fw={700} size="xl" c="yellow.7">{stats.pending || 0}</Text>
          </Card>
          <Card withBorder padding="md" radius="md" bg="green.0">
            <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Approved</Text>
            <Text fw={700} size="xl" c="green.7">{stats.approved || 0}</Text>
          </Card>
          <Card withBorder padding="md" radius="md">
            <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Avg. Rating</Text>
            <Group gap={4}>
              <Text fw={700} size="xl">{stats.average_rating || 0}</Text>
              <IconStar size={20} className="text-yellow-500 fill-yellow-500" />
            </Group>
          </Card>
          <Card withBorder padding="md" radius="md">
            <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Featured</Text>
            <Text fw={700} size="xl">{stats.featured || 0}</Text>
          </Card>
        </SimpleGrid>

        {/* Filters */}
        <Paper withBorder p="md" radius="md">
          <Group>
            <TextInput
              placeholder="Search by name, company, or content"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftSection={<IconSearch size={16} />}
              style={{ flex: 1 }}
              radius="md"
            />
            <Select
              placeholder="Filter by status"
              data={[
                { value: '', label: 'All' },
                { value: 'pending', label: 'Pending' },
                { value: 'approved', label: 'Approved' },
                { value: 'rejected', label: 'Rejected' },
              ]}
              value={statusFilter}
              onChange={setStatusFilter}
              leftSection={<IconFilter size={16} />}
              w={200}
              radius="md"
              clearable
            />
            <Button
              variant="light"
              onClick={() => {
                setSearch('');
                setStatusFilter(null);
                setPage(1);
              }}
              leftSection={<IconRefresh size={16} />}
            >
              Reset
            </Button>
          </Group>
        </Paper>

        {/* Table */}
        <Paper withBorder radius="md" style={{ overflow: 'hidden' }}>
          <ScrollArea>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Customer</Table.Th>
                  <Table.Th>Rating</Table.Th>
                  <Table.Th>Testimonial</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Featured</Table.Th>
                  <Table.Th>Date</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {loading ? (
                  <Table.Tr>
                    <Table.Td colSpan={7}>
                      <Center py="xl">
                        <Loader />
                      </Center>
                    </Table.Td>
                  </Table.Tr>
                ) : testimonials.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={7}>
                      <Center py="xl">
                        <Text c="dimmed">No testimonials found</Text>
                      </Center>
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  testimonials.map((t) => (
                    <Table.Tr key={t.id}>
                      <Table.Td>
                        <Group gap="sm">
                          <Avatar 
                            src={t.avatar_path ? `${API_URL}/${t.avatar_path.replace(/\\/g, '/')}` : t.avatar_url} 
                            size="md" 
                            radius="xl"
                            color="blue"
                          >
                            {t.customer_name?.charAt(0)}
                          </Avatar>
                          <div>
                            <Text fw={500}>{t.customer_name}</Text>
                            <Text size="xs" c="dimmed">
                              {t.customer_role} {t.company && `at ${t.company}`}
                            </Text>
                          </div>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Group gap={2}>
                          {[...Array(5)].map((_, i) => (
                            <IconStar
                              key={i}
                              size={14}
                              className={i < t.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                            />
                          ))}
                        </Group>
                      </Table.Td>
                      <Table.Td style={{ maxWidth: 300 }}>
                        <Text size="sm" lineClamp={2}>
                          {t.content}
                        </Text>
                      </Table.Td>
                      <Table.Td>{getStatusBadge(t.status)}</Table.Td>
                      <Table.Td>
                        <Switch
                          checked={t.is_featured}
                          onChange={() => handleToggleFeatured(t.id, t.is_featured)}
                          size="sm"
                          color="yellow"
                        />
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{dayjs(t.created_at).format('MMM D, YYYY')}</Text>
                        <Text size="xs" c="dimmed">{dayjs(t.created_at).fromNow()}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Group gap={4}>
                          <Tooltip label="View">
                            <ActionIcon
                              size="sm"
                              variant="light"
                              color="blue"
                              onClick={() => {
                                setSelectedTestimonial(t);
                                openView();
                              }}
                            >
                              <IconEye size={16} />
                            </ActionIcon>
                          </Tooltip>
                          
                          {t.status === 'pending' && (
                            <>
                              <Tooltip label="Approve">
                                <ActionIcon
                                  size="sm"
                                  variant="light"
                                  color="green"
                                  onClick={() => handleApprove(t.id)}
                                >
                                  <IconCheck size={16} />
                                </ActionIcon>
                              </Tooltip>
                              <Tooltip label="Reject">
                                <ActionIcon
                                  size="sm"
                                  variant="light"
                                  color="red"
                                  onClick={() => handleReject(t.id)}
                                >
                                  <IconX size={16} />
                                </ActionIcon>
                              </Tooltip>
                            </>
                          )}
                          
                          <Tooltip label="Edit">
                            <ActionIcon
                              size="sm"
                              variant="light"
                              color="blue"
                              onClick={() => handleEdit(t)}
                            >
                              <IconStar size={16} />
                            </ActionIcon>
                          </Tooltip>
                          
                          <Tooltip label="Delete">
                            <ActionIcon
                              size="sm"
                              variant="light"
                              color="red"
                              onClick={() => handleDelete(t.id)}
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

      {/* View Modal */}
      <Modal
        opened={openedView}
        onClose={closeView}
        title="Testimonial Details"
        size="lg"
        radius="lg"
      >
        {selectedTestimonial && (
          <Stack>
            <Group>
              <Avatar 
                src={selectedTestimonial.avatar_path ? `${API_URL}/${selectedTestimonial.avatar_path.replace(/\\/g, '/')}` : selectedTestimonial.avatar_url} 
                size="xl" 
                radius="xl"
                color="blue"
              >
                {selectedTestimonial.customer_name?.charAt(0)}
              </Avatar>
              <div>
                <Text fw={700} size="xl">{selectedTestimonial.customer_name}</Text>
                <Text c="dimmed">
                  {selectedTestimonial.customer_role} {selectedTestimonial.company && `at ${selectedTestimonial.company}`}
                </Text>
                {selectedTestimonial.email && (
                  <Text size="sm" c="dimmed">{selectedTestimonial.email}</Text>
                )}
              </div>
            </Group>

            <Group>
              <Group gap={2}>
                {[...Array(5)].map((_, i) => (
                  <IconStar
                    key={i}
                    size={20}
                    className={i < selectedTestimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                  />
                ))}
              </Group>
              <Badge color={selectedTestimonial.status === 'approved' ? 'green' : 'yellow'}>
                {selectedTestimonial.status}
              </Badge>
              {selectedTestimonial.is_featured && (
                <Badge color="yellow" variant="light">Featured</Badge>
              )}
            </Group>

            <Paper withBorder p="md" radius="md" bg="gray.0">
              <Text fs="italic">&quot;{selectedTestimonial.content}&quot;</Text>
            </Paper>

            <Text size="sm" c="dimmed">
              Submitted {dayjs(selectedTestimonial.created_at).format('MMMM D, YYYY')}
              {selectedTestimonial.approved_at && ` • Approved ${dayjs(selectedTestimonial.approved_at).fromNow()}`}
              {selectedTestimonial.approver_name && ` by ${selectedTestimonial.approver_name}`}
            </Text>
          </Stack>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        opened={openedEdit}
        onClose={closeEdit}
        title="Edit Testimonial"
        size="lg"
        radius="lg"
      >
        <Stack>
          <FileInput
            label="Avatar"
            placeholder="Upload new avatar"
            accept="image/jpeg,image/png,image/gif,image/webp"
            value={editAvatarFile}
            onChange={setEditAvatarFile}
            clearable
          />

          <TextInput
            label="Name"
            required
            value={editForm.customer_name}
            onChange={(e) => setEditForm({ ...editForm, customer_name: e.target.value })}
          />

          <TextInput
            label="Role"
            value={editForm.customer_role}
            onChange={(e) => setEditForm({ ...editForm, customer_role: e.target.value })}
          />

          <TextInput
            label="Company"
            value={editForm.company}
            onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
          />

          <TextInput
            label="Email"
            value={editForm.email}
            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
          />

          <div>
            <Text size="sm" fw={500} mb={4}>Rating</Text>
            <Rating
              value={editForm.rating}
              onChange={(value) => setEditForm({ ...editForm, rating: value })}
              size="lg"
            />
          </div>

          <Textarea
            label="Content"
            required
            minRows={4}
            value={editForm.content}
            onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
          />

          <Select
            label="Status"
            data={[
              { value: 'pending', label: 'Pending' },
              { value: 'approved', label: 'Approved' },
              { value: 'rejected', label: 'Rejected' },
            ]}
            value={editForm.status}
            onChange={(value) => setEditForm({ ...editForm, status: value || 'pending' })}
          />

          <Switch
            label="Featured"
            checked={editForm.is_featured}
            onChange={(e) => setEditForm({ ...editForm, is_featured: e.currentTarget.checked })}
          />

          <Group justify="flex-end">
            <Button variant="light" onClick={closeEdit}>Cancel</Button>
            <Button onClick={handleSaveEdit} loading={saving} color="blue">
              Save Changes
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}