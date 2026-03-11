/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect, useCallback } from 'react';
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
  ActionIcon,
  Menu,
  Modal,
  Stack,
  Pagination,
  Select,
  TextInput,
  Chip,
  Tooltip,
  Loader,
  Center,
  Alert,
  Divider,
  Textarea,
  Table,
} from '@mantine/core';
import {
  IconPhoto,
  IconEye,
  IconDownload,
  IconTrash,
  IconCheck,
  IconX,
  IconPrinter,
  IconStar,
  IconStarFilled,
  IconSearch,
  IconDotsVertical,
  IconAlertCircle,
  IconUpload,
  IconRefresh,
  IconList,
  IconLayoutGrid,
  IconTag,
  IconCloudUpload,
  IconFile,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Dropzone, FileWithPath } from '@mantine/dropzone';

dayjs.extend(relativeTime);

// API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Helper function to get image URL
const getImageUrl = (filePath: string | null | undefined): string => {
  if (!filePath) return 'https://placehold.co/600x400?text=No+Image';
  
  // Clean up the path
  let cleanPath = filePath.replace(/\\/g, '/');
  cleanPath = cleanPath.replace(/^\/+/, '');
  
  if (!cleanPath.startsWith('uploads/')) {
    cleanPath = `uploads/${cleanPath}`;
  }
  
  return `${API_URL}/${cleanPath}`;
};

// Helper for thumbnails
const getThumbnailUrl = (thumbnailPath: string | null | undefined, originalPath?: string): string => {
  if (thumbnailPath) {
    return getImageUrl(thumbnailPath);
  }
  if (originalPath) {
    return getImageUrl(originalPath);
  }
  return 'https://placehold.co/600x400?text=No+Image';
};

// Format file size
const formatFileSize = (bytes: number): string => {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Types
interface ImageItem {
  id: string;
  image_code: string;
  filename: string;
  original_filename: string;
  file_path: string;
  thumbnail_path: string;
  file_size: number;
  mime_type: string;
  width: number;
  height: number;
  status: 'pending' | 'approved' | 'rejected' | 'in_progress' | 'completed';
  tags: string[];
  uploaded_by: string;
  uploader_name: string;
  created_at: string;
  is_favorite: boolean;
  description?: string;
  category?: string;
  download_count?: number;
  print_count?: number;
}

interface UploadedFile extends File {
  id: string;
  preview?: string;
  uploadProgress?: number;
  uploadStatus?: 'pending' | 'uploading' | 'success' | 'error';
  tags?: string[];
  description?: string;
  category?: string;
}

interface ImageStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  in_progress: number;
  completed: number;
  total_size: number;
}

// Image Preview Modal
const ImagePreviewModal = ({
  opened,
  onClose,
  image,
  onApprove,
  onReject,
  onDownload,
  onDelete,
  onToggleFavorite,
}: {
  opened: boolean;
  onClose: () => void;
  image: ImageItem | null;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onDownload?: (image: ImageItem) => void;
  onDelete?: (image: ImageItem) => void;
  onToggleFavorite?: (id: string) => void;
}) => {
  const [zoom, setZoom] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);

  if (!image) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Image Preview - ${image.original_filename}`}
      size={fullscreen ? '100%' : 'xl'}
      fullScreen={fullscreen}
    >
      <Stack>
        <Group justify="space-between">
          <Group>
            <Button
              variant="light"
              size="xs"
              onClick={() => setZoom(z => Math.min(z + 0.25, 3))}
              leftSection={<IconEye size={16} />}
            >
              Zoom In
            </Button>
            <Button
              variant="light"
              size="xs"
              onClick={() => setZoom(z => Math.max(z - 0.25, 0.5))}
              leftSection={<IconEye size={16} />}
            >
              Zoom Out
            </Button>
            <Text size="sm">{Math.round(zoom * 100)}%</Text>
          </Group>
          <Group>
            {onDownload && (
              <Tooltip label="Download">
                <ActionIcon
                  variant="subtle"
                  color="green"
                  size="lg"
                  onClick={() => onDownload(image)}
                >
                  <IconDownload size={20} />
                </ActionIcon>
              </Tooltip>
            )}
            {onToggleFavorite && (
              <Tooltip label={image.is_favorite ? 'Remove from favorites' : 'Add to favorites'}>
                <ActionIcon
                  variant="subtle"
                  color="yellow"
                  size="lg"
                  onClick={() => onToggleFavorite(image.id)}
                >
                  {image.is_favorite ? <IconStarFilled size={20} /> : <IconStar size={20} />}
                </ActionIcon>
              </Tooltip>
            )}
            <Tooltip label={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
              <ActionIcon
                variant="subtle"
                size="lg"
                onClick={() => setFullscreen(!fullscreen)}
              >
                {fullscreen ? <IconPhoto size={20} /> : <IconPhoto size={20} />}
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>

        <Center style={{ 
          backgroundColor: '#f5f5f5', 
          minHeight: fullscreen ? 'calc(100vh - 180px)' : 400,
          overflow: 'auto',
          position: 'relative',
          borderRadius: 8
        }}>
          <div style={{ transform: `scale(${zoom})`, transition: 'transform 0.2s' }}>
            <img
              src={getImageUrl(image.file_path)}
              alt={image.original_filename}
              style={{ maxWidth: '100%', maxHeight: fullscreen ? 'calc(100vh - 200px)' : 400 }}
              onError={(e) => {
                console.error('Failed to load image:', image.file_path);
                e.currentTarget.src = 'https://placehold.co/600x400?text=Failed+to+load';
              }}
            />
          </div>
        </Center>

        <Divider />

        <Grid>
          <Grid.Col span={6}>
            <Text size="sm" fw={500}>File Information</Text>
            <Text size="sm"><strong>Filename:</strong> {image.original_filename}</Text>
            <Text size="sm"><strong>Size:</strong> {formatFileSize(image.file_size)}</Text>
            <Text size="sm"><strong>Type:</strong> {image.mime_type}</Text>
            <Text size="sm"><strong>Dimensions:</strong> {image.width} x {image.height}</Text>
          </Grid.Col>
          <Grid.Col span={6}>
            <Text size="sm" fw={500}>Upload Information</Text>
            <Text size="sm"><strong>Uploaded by:</strong> {image.uploader_name}</Text>
            <Text size="sm"><strong>Uploaded:</strong> {dayjs(image.created_at).format('MMM D, YYYY h:mm A')}</Text>
            <Text size="sm"><strong>Status:</strong> 
              <Badge 
                ml="xs"
                color={
                  image.status === 'approved' ? 'green' :
                  image.status === 'rejected' ? 'red' :
                  image.status === 'pending' ? 'yellow' :
                  image.status === 'in_progress' ? 'blue' : 'gray'
                }
              >
                {image.status}
              </Badge>
            </Text>
            <Text size="sm"><strong>Downloads:</strong> {image.download_count || 0}</Text>
            <Text size="sm"><strong>Print count:</strong> {image.print_count || 0}</Text>
          </Grid.Col>
        </Grid>

        {image.description && (
          <>
            <Divider />
            <Text size="sm" fw={500}>Description</Text>
            <Text size="sm">{image.description}</Text>
          </>
        )}

        {image.tags && image.tags.length > 0 && (
          <>
            <Divider />
            <Text size="sm" fw={500}>Tags</Text>
            <Group gap="xs">
              {image.tags.map(tag => (
                <Badge key={tag} variant="light">{tag}</Badge>
              ))}
            </Group>
          </>
        )}

        <Group justify="flex-end">
          {image.status === 'pending' && (
            <>
              <Button
                color="green"
                leftSection={<IconCheck size={16} />}
                onClick={() => onApprove?.(image.id)}
              >
                Approve
              </Button>
              <Button
                color="red"
                leftSection={<IconX size={16} />}
                onClick={() => onReject?.(image.id)}
              >
                Reject
              </Button>
            </>
          )}
          <Button variant="light" onClick={onClose}>Close</Button>
        </Group>
      </Stack>
    </Modal>
  );
};

// Upload Modal
const UploadModal = ({
  opened,
  onClose,
  onUploadSuccess,
}: {
  opened: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
}) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleDrop = (acceptedFiles: FileWithPath[]) => {
    const newFiles = acceptedFiles.map((file) => {
      const customFile = file as UploadedFile;
      customFile.id = Math.random().toString(36).substring(7);
      customFile.preview = file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined;
      customFile.uploadStatus = 'pending';
      customFile.uploadProgress = 0;
      customFile.tags = [];
      customFile.description = '';
      customFile.category = '';
      return customFile;
    });
    
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (id: string) => {
    setFiles((prev) => {
      const file = prev.find(f => f.id === id);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const handleUploadAll = async () => {
    if (files.length === 0) {
      notifications.show({
        title: 'Error',
        message: 'Please select files to upload',
        color: 'red',
      });
      return;
    }

    setUploading(true);

    const formData = new FormData();
    const metadata: any[] = [];

    files.forEach((file) => {
      formData.append('files', file);
      metadata.push({
        description: file.description || '',
        tags: file.tags || [],
        category: file.category || '',
      });
    });

    formData.append('metadata', JSON.stringify(metadata));

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        notifications.show({
          title: 'Error',
          message: 'Please login first',
          color: 'red',
        });
        return;
      }
      
      const response = await fetch(`${API_URL}/api/images/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        notifications.show({
          title: 'Success',
          message: `Uploaded ${files.length} file(s) successfully`,
          color: 'green',
        });

        files.forEach(file => {
          if (file.preview) {
            URL.revokeObjectURL(file.preview);
          }
        });

        setFiles([]);
        onUploadSuccess();
        onClose();
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to upload files',
        color: 'red',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Upload Images" size="lg">
      <Stack>
        <Dropzone
          onDrop={handleDrop}
          onReject={(rejections) => {
            notifications.show({
              title: 'Error',
              message: rejections[0]?.errors[0]?.message || 'File rejected',
              color: 'red',
            });
          }}
          accept={['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'application/pdf']}
          maxSize={50 * 1024 * 1024}
          multiple
          loading={uploading}
        >
          <Group justify="center" gap="xl" style={{ minHeight: 150 }}>
            <div>
              <Text size="xl" inline>
                Drag files here or click to browse
              </Text>
              <Text size="sm" c="dimmed" inline mt={7}>
                Attach up to 10 files, each up to 50MB
              </Text>
              <Text size="xs" c="dimmed" mt={7}>
                Supported: PNG, JPEG, GIF, WebP, PDF
              </Text>
            </div>
          </Group>
        </Dropzone>

        {files.length > 0 && (
          <Paper withBorder p="md">
            <Group justify="space-between" mb="md">
              <Text fw={500}>Selected Files ({files.length})</Text>
              <Button
                variant="subtle"
                color="red"
                size="xs"
                onClick={() => {
                  files.forEach(f => f.preview && URL.revokeObjectURL(f.preview));
                  setFiles([]);
                }}
              >
                Clear All
              </Button>
            </Group>

            <Stack gap="xs">
              {files.map((file) => (
                <Card key={file.id} withBorder padding="sm">
                  <Group justify="space-between">
                    <Group gap="sm">
                      {file.preview ? (
                        <img
                          src={file.preview}
                          alt={file.name}
                          style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }}
                        />
                      ) : (
                        <IconFile size={40} />
                      )}
                      <div>
                        <Text size="sm" fw={500}>{file.name}</Text>
                        <Text size="xs" c="dimmed">{formatFileSize(file.size)}</Text>
                      </div>
                    </Group>
                    <ActionIcon
                      color="red"
                      variant="subtle"
                      onClick={() => handleRemoveFile(file.id)}
                    >
                      <IconX size={16} />
                    </ActionIcon>
                  </Group>
                </Card>
              ))}
            </Stack>

            <Button
              fullWidth
              mt="md"
              onClick={handleUploadAll}
              loading={uploading}
              leftSection={<IconCloudUpload size={16} />}
            >
              Upload {files.length} File{files.length !== 1 ? 's' : ''}
            </Button>
          </Paper>
        )}
      </Stack>
    </Modal>
  );
};

// Main Component
export default function ImagesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get('status');

  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ImageStats | null>(null);
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    status: statusFilter || '',
    search: '',
    tags: [] as string[],
    sortBy: 'created_at',
    sortOrder: 'desc',
  });
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [userRole, setUserRole] = useState<string>('');

  // Modal states
  const [openedPreview, { open: openPreview, close: closePreview }] = useDisclosure(false);
  const [openedDelete, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [openedUpload, { open: openUpload, close: closeUpload }] = useDisclosure(false);
  const [openedReject, { open: openReject, close: closeReject }] = useDisclosure(false);
  const [rejectReason, setRejectReason] = useState('');

  // Get user role on mount
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserRole(user.role);
      } catch (e) {
        console.error('Failed to parse user');
      }
    }
  }, []);
 const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        router.push('/page/login');
        return;
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        ...(filters.status && { status: filters.status }),
        ...(filters.search && { search: filters.search }),
        ...(filters.tags.length > 0 && { tags: filters.tags.join(',') }),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });

      const response = await fetch(`${API_URL}/api/images?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const data = await response.json();
      if (data.success) {
        setImages(data.data.images || []);
        setTotalPages(data.data.pagination?.pages || 1);
      } else {
        setError(data.message || 'Failed to fetch images');
      }
    } catch (error) {
      console.log(error)
      setError('Failed to fetch images');
    } finally {
      setLoading(false);
    }
  },[filters.search, filters.sortBy, filters.sortOrder, filters.status, filters.tags, page, router]);

  // Fetch images
  useEffect(() => {
    fetchImages();
    fetchStats();
    fetchTags();
  }, [page, filters, fetchImages]);

 
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const response = await fetch(`${API_URL}/api/images/stats`, {
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

  const fetchTags = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const response = await fetch(`${API_URL}/api/images/tags`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const data = await response.json();
      if (data.success) {
        setAvailableTags(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch tags');
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/api/images/${id}/approve`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.success) {
        notifications.show({
          title: 'Success',
          message: 'Image approved',
          color: 'green',
        });
        fetchImages();
        fetchStats();
        closePreview();
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to approve image',
        color: 'red',
      });
    }
  };

  const handleReject = async () => {
    if (!selectedImage || !rejectReason.trim()) return;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/api/images/${selectedImage.id}/reject`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: rejectReason }),
      });
      const data = await response.json();
      if (data.success) {
        notifications.show({
          title: 'Success',
          message: 'Image rejected',
          color: 'orange',
        });
        fetchImages();
        fetchStats();
        closeReject();
        closePreview();
        setRejectReason('');
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to reject image',
        color: 'red',
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedImage) return;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/api/images/${selectedImage.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        notifications.show({
          title: 'Success',
          message: 'Image deleted',
          color: 'green',
        });
        closeDelete();
        closePreview();
        fetchImages();
        fetchStats();
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete image',
        color: 'red',
      });
    }
  };

  const handleDownload = async (image: ImageItem) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/api/images/${image.id}/download`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = image.original_filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
      notifications.show({
        title: 'Success',
        message: 'Download started',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to download image',
        color: 'red',
      });
    }
  };

  const handleToggleFavorite = async (id: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/api/images/${id}/favorite`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        fetchImages();
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update favorite',
        color: 'red',
      });
    }
  };

  const canApprove = ['admin', 'cashier'].includes(userRole);
  const canDelete = ['admin'].includes(userRole);

  if (loading && images.length === 0) {
    return (
      <Center h="100vh">
        <Loader size="lg" />
      </Center>
    );
  }

  return (
    <Container size="xl" py="xl">
      {/* Header */}
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2}>Image Gallery</Title>
          <Text c="dimmed" size="sm">
            Manage and organize your images
          </Text>
        </div>
        <Group>
          <Button
            variant="light"
            leftSection={<IconRefresh size={16} />}
            onClick={() => fetchImages()}
            loading={loading}
          >
            Refresh
          </Button>
          <Button
            leftSection={<IconUpload size={16} />}
            onClick={openUpload}
            variant="gradient"
            gradient={{ from: 'blue', to: 'cyan' }}
          >
            Upload Images
          </Button>
        </Group>
      </Group>

      {/* Stats Cards */}
      {stats && (
        <SimpleGrid cols={{ base: 2, sm: 3, md: 6 }} mb="lg">
          <Card withBorder padding="xs">
            <Text size="xs" c="dimmed">Total</Text>
            <Text fw={700} size="lg">{stats.total}</Text>
          </Card>
          <Card withBorder padding="xs" bg="yellow.0">
            <Text size="xs" c="dimmed">Pending</Text>
            <Text fw={700} size="lg" c="yellow.7">{stats.pending}</Text>
          </Card>
          <Card withBorder padding="xs" bg="green.0">
            <Text size="xs" c="dimmed">Approved</Text>
            <Text fw={700} size="lg" c="green.7">{stats.approved}</Text>
          </Card>
          <Card withBorder padding="xs" bg="red.0">
            <Text size="xs" c="dimmed">Rejected</Text>
            <Text fw={700} size="lg" c="red.7">{stats.rejected}</Text>
          </Card>
          <Card withBorder padding="xs" bg="blue.0">
            <Text size="xs" c="dimmed">In Progress</Text>
            <Text fw={700} size="lg" c="blue.7">{stats.in_progress || 0}</Text>
          </Card>
          <Card withBorder padding="xs">
            <Text size="xs" c="dimmed">Storage</Text>
            <Text fw={700} size="lg">{formatFileSize(stats.total_size)}</Text>
          </Card>
        </SimpleGrid>
      )}

      {/* Filters */}
      <Paper withBorder p="md" mb="lg">
        <Grid>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <TextInput
              placeholder="Search images..."
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
                { value: 'approved', label: 'Approved' },
                { value: 'rejected', label: 'Rejected' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'completed', label: 'Completed' },
              ]}
              value={filters.status}
              onChange={(value) => setFilters({ ...filters, status: value || '' })}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 6, md: 3 }}>
            <Select
              placeholder="Sort by"
              data={[
                { value: 'created_at:desc', label: 'Newest first' },
                { value: 'created_at:asc', label: 'Oldest first' },
                { value: 'filename:asc', label: 'Name A-Z' },
                { value: 'filename:desc', label: 'Name Z-A' },
                { value: 'file_size:desc', label: 'Largest first' },
                { value: 'file_size:asc', label: 'Smallest first' },
              ]}
              value={`${filters.sortBy}:${filters.sortOrder}`}
              onChange={(value) => {
                const [sortBy, sortOrder] = (value || '').split(':');
                setFilters({ ...filters, sortBy, sortOrder: sortOrder as 'asc' | 'desc' });
              }}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Group justify="flex-end">
              <Button
                variant={viewMode === 'grid' ? 'filled' : 'light'}
                onClick={() => setViewMode('grid')}
                leftSection={<IconLayoutGrid size={16} />}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'filled' : 'light'}
                onClick={() => setViewMode('list')}
                leftSection={<IconList size={16} />}
              >
                List
              </Button>
            </Group>
          </Grid.Col>
        </Grid>

        {availableTags.length > 0 && (
          <Group mt="md">
            <IconTag size={16} />
            <Chip.Group
              multiple
              value={filters.tags}
              onChange={(tags) => setFilters({ ...filters, tags })}
            >
              {availableTags.map((tag) => (
                <Chip key={tag} value={tag} size="sm">
                  {tag}
                </Chip>
              ))}
            </Chip.Group>
          </Group>
        )}
      </Paper>

      {/* Error State */}
      {error && (
        <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red" mb="lg">
          {error}
        </Alert>
      )}

      {/* Image Grid/List */}
      {images.length === 0 ? (
        <Paper p="xl" withBorder>
          <Center>
            <Stack align="center">
              <IconPhoto size={48} color="gray" />
              <Text size="lg" fw={500}>No images found</Text>
              <Button onClick={openUpload}>Upload your first image</Button>
            </Stack>
          </Center>
        </Paper>
      ) : viewMode === 'grid' ? (
        <>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg">
            {images.map((image) => (
              <Card key={image.id} withBorder padding="lg" radius="md">
                <Card.Section>
                  <div style={{ position: 'relative', height: 200 }}>
                    <img
                      src={getThumbnailUrl(image.thumbnail_path, image.file_path)}
                      alt={image.original_filename}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        setSelectedImage(image);
                        openPreview();
                      }}
                      onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/600x400?text=No+Image';
                      }}
                    />
                    {image.is_favorite && (
                      <IconStarFilled
                        size={20}
                        color="gold"
                        style={{ position: 'absolute', top: 10, right: 10 }}
                      />
                    )}
                  </div>
                </Card.Section>

                <Stack mt="md" gap="xs">
                  <Group justify="space-between">
                    <Text fw={500} lineClamp={1}>
                      {image.original_filename}
                    </Text>
                    <Badge
                      color={
                        image.status === 'approved' ? 'green' :
                        image.status === 'rejected' ? 'red' :
                        image.status === 'pending' ? 'yellow' :
                        image.status === 'in_progress' ? 'blue' : 'gray'
                      }
                    >
                      {image.status}
                    </Badge>
                  </Group>

                  <Text size="xs" c="dimmed">
                    {image.uploader_name} • {dayjs(image.created_at).fromNow()}
                  </Text>

                  <Group justify="space-between" mt="xs">
                    <Group gap={4}>
                      <Tooltip label="Preview">
                        <ActionIcon
                          variant="subtle"
                          onClick={() => {
                            setSelectedImage(image);
                            openPreview();
                          }}
                        >
                          <IconEye size={16} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="Download">
                        <ActionIcon
                          variant="subtle"
                          onClick={() => handleDownload(image)}
                        >
                          <IconDownload size={16} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="Add to favorites">
                        <ActionIcon
                          variant="subtle"
                          onClick={() => handleToggleFavorite(image.id)}
                        >
                          {image.is_favorite ? (
                            <IconStarFilled size={16} color="gold" />
                          ) : (
                            <IconStar size={16} />
                          )}
                        </ActionIcon>
                      </Tooltip>
                    </Group>

                    <Menu shadow="md" width={150}>
                      <Menu.Target>
                        <ActionIcon variant="subtle">
                          <IconDotsVertical size={16} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        {image.status === 'pending' && canApprove && (
                          <>
                            <Menu.Item
                              color="green"
                              leftSection={<IconCheck size={14} />}
                              onClick={() => {
                                setSelectedImage(image);
                                handleApprove(image.id);
                              }}
                            >
                              Approve
                            </Menu.Item>
                            <Menu.Item
                              color="red"
                              leftSection={<IconX size={14} />}
                              onClick={() => {
                                setSelectedImage(image);
                                openReject();
                              }}
                            >
                              Reject
                            </Menu.Item>
                          </>
                        )}
                        {image.status === 'approved' && (
                          <Menu.Item
                            leftSection={<IconPrinter size={14} />}
                            component={Link}
                            href={`/dashboard/print-jobs/new?image=${image.id}`}
                          >
                            Create Print Job
                          </Menu.Item>
                        )}
                        {canDelete && (
                          <Menu.Item
                            color="red"
                            leftSection={<IconTrash size={14} />}
                            onClick={() => {
                              setSelectedImage(image);
                              openDelete();
                            }}
                          >
                            Delete
                          </Menu.Item>
                        )}
                      </Menu.Dropdown>
                    </Menu>
                  </Group>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>

          {totalPages > 1 && (
            <Group justify="center" mt="xl">
              <Pagination
                total={totalPages}
                value={page}
                onChange={setPage}
                withEdges
              />
            </Group>
          )}
        </>
      ) : (
        // List View
        <Paper withBorder>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Image</Table.Th>
                <Table.Th>Filename</Table.Th>
                <Table.Th>Uploader</Table.Th>
                <Table.Th>Date</Table.Th>
                <Table.Th>Size</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {images.map((image) => (
                <Table.Tr key={image.id}>
                  <Table.Td>
                    <img
                      src={getThumbnailUrl(image.thumbnail_path, image.file_path)}
                      alt={image.original_filename}
                      style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                      onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/50x50?text=No+Image';
                      }}
                    />
                  </Table.Td>
                  <Table.Td>
                    <Text fw={500}>{image.original_filename}</Text>
                  </Table.Td>
                  <Table.Td>{image.uploader_name}</Table.Td>
                  <Table.Td>{dayjs(image.created_at).format('MMM D, YYYY')}</Table.Td>
                  <Table.Td>{formatFileSize(image.file_size)}</Table.Td>
                  <Table.Td>
                    <Badge
                      color={
                        image.status === 'approved' ? 'green' :
                        image.status === 'rejected' ? 'red' :
                        image.status === 'pending' ? 'yellow' : 'blue'
                      }
                    >
                      {image.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group gap={4}>
                      <Tooltip label="Preview">
                        <ActionIcon
                          variant="subtle"
                          onClick={() => {
                            setSelectedImage(image);
                            openPreview();
                          }}
                        >
                          <IconEye size={16} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="Download">
                        <ActionIcon
                          variant="subtle"
                          onClick={() => handleDownload(image)}
                        >
                          <IconDownload size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Paper>
      )}

      {/* Modals */}
      <ImagePreviewModal
        opened={openedPreview}
        onClose={closePreview}
        image={selectedImage}
        onApprove={canApprove ? handleApprove : undefined}
        onReject={canApprove ? (id) => {
          setSelectedImage(images.find(i => i.id === id) || null);
          openReject();
        } : undefined}
        onDownload={handleDownload}
        onDelete={canDelete ? (image) => {
          setSelectedImage(image);
          openDelete();
        } : undefined}
        onToggleFavorite={handleToggleFavorite}
      />

      <UploadModal
        opened={openedUpload}
        onClose={closeUpload}
        onUploadSuccess={() => {
          fetchImages();
          fetchStats();
        }}
      />

      {/* Reject Modal */}
      <Modal opened={openedReject} onClose={closeReject} title="Reject Image">
        <Stack>
          <Textarea
            label="Rejection Reason"
            placeholder="Please provide a reason for rejection..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            minRows={3}
            required
          />
          <Group justify="flex-end">
            <Button variant="light" onClick={closeReject}>Cancel</Button>
            <Button color="red" onClick={handleReject}>Reject</Button>
          </Group>
        </Stack>
      </Modal>

      {/* Delete Modal */}
      <Modal opened={openedDelete} onClose={closeDelete} title="Delete Image">
        <Text mb="lg">
          Are you sure you want to delete this image? This action cannot be undone.
        </Text>
        <Group justify="flex-end">
          <Button variant="light" onClick={closeDelete}>Cancel</Button>
          <Button color="red" onClick={handleDelete}>Delete</Button>
        </Group>
      </Modal>
    </Container>
  );
}