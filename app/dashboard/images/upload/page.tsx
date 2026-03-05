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
  Grid,
  Card,
  Badge,
  Progress,
  Alert,
  TextInput,
  Textarea,
  Select,
  TagsInput,
  Chip,
  Divider,
  SimpleGrid,
  ActionIcon,
  Tooltip,
  ScrollArea,
  NavLink,
  Box,
  ThemeIcon,
  Center,
  Loader,
  Modal,
  Menu,
  Avatar,
  Pagination,
  Collapse,
  lighten,
  useMantineTheme,
} from '@mantine/core';
import {
  IconUpload,
  IconPhoto,
  IconX,
  IconCheck,
  IconTag,
  IconFolder,
  IconClock,
  IconAlertCircle,
  IconFileDescription,
  IconUser,
  IconEye,
  IconDownload,
  IconTrash,
  IconEdit,
  IconCloudUpload,
  IconFile,
  IconFileText,
  IconRefresh,
  IconSearch,
  IconDotsVertical,
  IconPrinter,
  IconChevronDown,
  IconChevronUp,
  IconCircleCheck,
  IconCircleX,
  IconCircle,
  IconRocket,
  IconDeviceFloppy,
  IconHeart,
  IconHeartFilled,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/navigation';
import { Dropzone, FileWithPath } from '@mantine/dropzone';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { motion, AnimatePresence } from 'framer-motion';

dayjs.extend(relativeTime);

// API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Types
interface UploadedFile extends File {
  id: string;
  preview?: string;
  uploadProgress?: number;
  uploadStatus?: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  tags?: string[];
  description?: string;
  category?: string;
}

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

interface Category {
  value: string;
  label: string;
  count?: number;
  color?: string;
  icon?: React.ReactNode;
}

interface Tag {
  name: string;
  count: number;
  color?: string;
}

// Helper Functions
const formatFileSize = (bytes: number): string => {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getImageUrl = (filePath: string | null | undefined): string => {
  if (!filePath) return 'https://placehold.co/600x400?text=No+Image';
  let cleanPath = filePath.replace(/\\/g, '/');
  cleanPath = cleanPath.replace(/^\/+/, '');
  if (!cleanPath.startsWith('uploads/')) {
    cleanPath = `uploads/${cleanPath}`;
  }
  return `${API_URL}/${cleanPath}`;
};

const getThumbnailUrl = (thumbnailPath: string | null | undefined, originalPath?: string): string => {
  if (thumbnailPath) {
    return getImageUrl(thumbnailPath);
  }
  if (originalPath) {
    return getImageUrl(originalPath);
  }
  return 'https://placehold.co/600x400?text=No+Image';
};

const getFileIcon = (file: UploadedFile | null | undefined) => {
  if (!file) return <IconFile size={24} />;
  const type = file.type || '';
  if (type.startsWith('image/')) return <IconPhoto size={24} />;
  if (type === 'application/pdf') return <IconFileText size={24} />;
  return <IconFile size={24} />;
};

const getStatusColor = (status: string) => {
  const colors = {
    pending: 'yellow',
    approved: 'green',
    rejected: 'red',
    in_progress: 'blue',
    completed: 'teal',
  };
  return colors[status as keyof typeof colors] || 'gray';
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'approved':
      return <IconCircleCheck size={14} />;
    case 'rejected':
      return <IconCircleX size={14} />;
    case 'pending':
      return <IconClock size={14} />;
    case 'in_progress':
      return <IconRefresh size={14} />;
    case 'completed':
      return <IconCheck size={14} />;
    default:
      return <IconCircle size={14} />;
  }
};

// Animated Components
const MotionCard = motion(Card as any );
const MotionBox = motion(Box as any);
const MotionGroup = motion(Group);
const MotionStack = motion(Stack);

// Edit Image Modal Component
const EditImageModal = ({
  opened,
  onClose,
  image,
  onSave,
}: {
  opened: boolean;
  onClose: () => void;
  image: ImageItem | null;
  onSave: (id: string, data: any) => Promise<void>;
}) => {
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (image) {
      setDescription(image.description || '');
      setTags(image.tags || []);
      setCategory(image.category || '');
    }
  }, [image]);

  const handleSave = async () => {
    if (!image) return;
    setSaving(true);
    try {
      await onSave(image.id, { description, tags, category });
      notifications.show({
        title: 'Success',
        message: 'Image updated successfully',
        color: 'green',
      });
      onClose();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update image',
        color: 'red',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Edit Image Details" size="lg" radius="lg">
      {image && (
        <Stack>
          <Group gap="lg" align="flex-start">
            <Box style={{ width: 120, height: 120, borderRadius: 8, overflow: 'hidden' }}>
              <img
                src={getThumbnailUrl(image.thumbnail_path, image.file_path)}
                alt={image.original_filename}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Box>
            <Box style={{ flex: 1 }}>
              <Text fw={600} size="lg">{image.original_filename}</Text>
              <Text size="sm" c="dimmed">Uploaded by {image.uploader_name}</Text>
              <Text size="sm" c="dimmed">{dayjs(image.created_at).format('MMM D, YYYY')}</Text>
            </Box>
          </Group>

          <Divider />

          <Textarea
            label="Description"
            placeholder="Add a description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            minRows={3}
            radius="md"
          />

          <TagsInput
            label="Tags"
            placeholder="Add tags (press Enter)"
            value={tags}
            onChange={setTags}
            radius="md"
          />

          <Select
            label="Category"
            placeholder="Select a category"
            data={[
              { value: 'DTF', label: ' DTF print' },
              { value: 'T-shirt', label: ' T-shirt print' },
              { value: 'Banner', label: 'Banner $ signing' },
              { value: 'Sticker', label: 'Sticker' },
              { value: 'card', label: 'Busines Card' },
              { value: 'other', label: 'Other' },
            ]}
            value={category}
            onChange={(value) => setCategory(value || '')}
            radius="md"
            clearable
          />

          <Group justify="flex-end">
            <Button variant="light" onClick={onClose} radius="xl">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              loading={saving}
              leftSection={<IconDeviceFloppy size={16} />}
              radius="xl"
            >
              Save Changes
            </Button>
          </Group>
        </Stack>
      )}
    </Modal>
  );
};

// Delete Confirmation Modal
const DeleteModal = ({
  opened,
  onClose,
  onConfirm,
  itemName,
}: {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  itemName: string;
}) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Confirm Delete" size="md" radius="lg">
      <Stack>
        <Box style={{ textAlign: 'center' }}>
          <ThemeIcon size={60} radius="xl" color="red" variant="light" style={{ margin: '0 auto' }}>
            <IconTrash size={30} />
          </ThemeIcon>
          <Text size="lg" fw={600} mt="md">Delete Image</Text>
          <Text size="sm" c="dimmed">
            Are you sure you want to delete &quot;{itemName}&quot;? This action cannot be undone.
          </Text>
        </Box>
        <Group justify="flex-end">
          <Button variant="light" onClick={onClose} radius="xl">
            Cancel
          </Button>
          <Button
            color="red"
            onClick={handleDelete}
            loading={deleting}
            radius="xl"
          >
            Delete
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

// Elegant File Card Component
const ElegantFileCard = ({
  file,
  onRemove,
  onUpdate,
  onPreview,
  index,
}: {
  file: UploadedFile;
  onRemove: (id: string) => void;
  onUpdate: (id: string, data: Partial<UploadedFile>) => void;
  onPreview: (file: UploadedFile) => void;
  index: number;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const theme = useMantineTheme();

  if (!file || !file.name) return null;

  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ delay: index * 0.05 }}
      withBorder
      padding="md"
      radius="lg"
      style={{
        borderColor: isHovered ? theme.colors.blue[5] : undefined,
        boxShadow: isHovered ? '0 8px 24px rgba(0,0,0,0.12)' : undefined,
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Group gap="md" wrap="nowrap" align="flex-start">
        {/* File Preview */}
        <Box
          style={{
            position: 'relative',
            width: 80,
            height: 80,
            borderRadius: theme.radius.lg,
            overflow: 'hidden',
            background: `linear-gradient(135deg, ${theme.colors.gray[1]}, ${theme.colors.gray[2]})`,
          }}
        >
          {file.type?.startsWith('image/') && file.preview ? (
            <>
              <img
                src={file.preview}
                alt={file.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  cursor: 'pointer',
                }}
                onClick={() => onPreview(file)}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.3), transparent)',
                  opacity: isHovered ? 1 : 0,
                  transition: 'opacity 0.3s ease',
                }}
              />
            </>
          ) : (
            <Center h="100%" onClick={() => onPreview(file)} style={{ cursor: 'pointer' }}>
              {getFileIcon(file)}
            </Center>
          )}
          
          {/* Status Badge Overlay */}
          {file.uploadStatus === 'uploading' && (
            <div
              style={{
                position: 'absolute',
                bottom: 4,
                right: 4,
                background: 'rgba(0,0,0,0.6)',
                borderRadius: theme.radius.sm,
                padding: '2px 6px',
                backdropFilter: 'blur(4px)',
              }}
            >
              <Text size="xs" c="white">{file.uploadProgress}%</Text>
            </div>
          )}
        </Box>

        {/* File Details */}
        <Stack gap={4} style={{ flex: 1 }}>
          <Group justify="space-between">
            <Box style={{ flex: 1 }}>
              <Text size="sm" fw={600} lineClamp={1}>
                {file.name}
              </Text>
              <Group gap="xs" mt={2}>
                <Text size="xs" c="dimmed">{formatFileSize(file.size)}</Text>
                <Text size="xs" c="dimmed">•</Text>
                <Badge
                  size="xs"
                  variant="light"
                  radius="sm"
                >
                  {file.name.split('.').pop()?.toUpperCase() || 'Unknown'}
                </Badge>
              </Group>
            </Box>
            
            <Group gap={4}>
              <Tooltip label="Preview" withArrow position="top">
                <ActionIcon
                  variant="subtle"
                  color="blue"
                  onClick={() => onPreview(file)}
                  size="md"
                  radius="xl"
                >
                  <IconEye size={18} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Remove" withArrow position="top">
                <ActionIcon
                  variant="subtle"
                  color="red"
                  onClick={() => onRemove(file.id)}
                  size="md"
                  radius="xl"
                >
                  <IconX size={18} />
                </ActionIcon>
              </Tooltip>
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={() => setExpanded(!expanded)}
                size="md"
                radius="xl"
              >
                {expanded ? <IconChevronUp size={18} /> : <IconChevronDown size={18} />}
              </ActionIcon>
            </Group>
          </Group>

          {/* Upload Progress */}
          {file.uploadStatus === 'uploading' && (
            <Box mt={4}>
              <Progress
                value={file.uploadProgress || 0}
                size="sm"
                striped
                animated
                color="blue"
                radius="xl"
              />
            </Box>
          )}

          {/* Error Message */}
          {file.error && (
            <Alert
              color="red"
              variant="light"
              radius="md"
              p="xs"
              icon={<IconAlertCircle size={16} />}
            >
              <Text size="xs">{file.error}</Text>
            </Alert>
          )}

          {/* Expanded Options */}
          <Collapse in={expanded}>
            <Paper
              withBorder
              p="md"
              radius="lg"
              bg={theme.colors.gray[0]}
              mt="xs"
              style={{
                borderStyle: 'dashed',
                borderColor: theme.colors.gray[3],
              }}
            >
              <Stack gap="md">
                <TextInput
                  size="sm"
                  placeholder="Add a description..."
                  value={file.description || ''}
                  onChange={(e) => onUpdate(file.id, { description: e.target.value })}
                  leftSection={<IconFileDescription size={16} />}
                  radius="md"
                  variant="filled"
                />

                <TagsInput
                  size="sm"
                  placeholder="Add tags (press Enter)"
                  value={file.tags || []}
                  onChange={(tags) => onUpdate(file.id, { tags })}
                  leftSection={<IconTag size={16} />}
                  radius="md"
                  variant="filled"
                  clearable
                />

                <Select
                  size="sm"
                  placeholder="Select category"
                  data={[
                    { value: 'business', label: '💼 Business' },
                    { value: 'personal', label: '👤 Personal' },
                    { value: 'design', label: '🎨 Design' },
                    { value: 'marketing', label: '📊 Marketing' },
                    { value: 'other', label: '📁 Other' },
                  ]}
                  value={file.category || ''}
                  onChange={(value) => onUpdate(file.id, { category: value || undefined })}
                  leftSection={<IconFolder size={16} />}
                  radius="md"
                  variant="filled"
                  clearable
                />
              </Stack>
            </Paper>
          </Collapse>
        </Stack>
      </Group>
    </MotionCard>
  );
};

// Beautiful Dropzone Component
const BeautifulDropzone = ({ onDrop, loading }: { onDrop: (files: FileWithPath[]) => void; loading: boolean }) => {
  const [isHovered, setIsHovered] = useState(false);
  const theme = useMantineTheme();

  return (
    <Dropzone
      onDrop={onDrop}
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
      loading={loading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        borderStyle: 'dashed',
        borderWidth: 2,
        borderColor: isHovered ? theme.colors.blue[5] : theme.colors.gray[3],
        backgroundColor: isHovered ? lighten(theme.colors.blue[0]!, 0.9) : theme.white,
        transition: 'all 0.3s ease',
        cursor: 'pointer',
      }}
      radius="xl"
    >
      <Group justify="center" gap="xl" style={{ minHeight: 240, pointerEvents: 'none' }}>
        <MotionBox
          animate={{
            scale: isHovered ? 1.1 : 1,
            rotate: isHovered ? 5 : 0,
          }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <ThemeIcon
            size={80}
            radius="xl"
            color={isHovered ? 'blue' : 'gray'}
            variant={isHovered ? 'filled' : 'light'}
            style={{ transition: 'all 0.3s ease' }}
          >
            <IconCloudUpload size={40} />
          </ThemeIcon>
        </MotionBox>

        <div>
          <Text size="xl" fw={600} mb={4}>
            <span style={{ color: isHovered ? theme.colors.blue[6] : undefined }}>
              Drag & drop
            </span>{' '}
            or click to browse
          </Text>
          <Text size="sm" c="dimmed">
            Attach up to 10 files, each up to 50MB
          </Text>
          <Group gap="xs" mt="md">
            <Badge size="lg" radius="xl" variant="dot" color="blue">PNG</Badge>
            <Badge size="lg" radius="xl" variant="dot" color="green">JPEG</Badge>
            <Badge size="lg" radius="xl" variant="dot" color="grape">GIF</Badge>
            <Badge size="lg" radius="xl" variant="dot" color="cyan">WebP</Badge>
            <Badge size="lg" radius="xl" variant="dot" color="red">PDF</Badge>
          </Group>
        </div>
      </Group>
    </Dropzone>
  );
};

// Elegant Gallery Card Component
const ElegantGalleryCard = ({
  image,
  onPreview,
  onDownload,
  onToggleFavorite,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  canApprove,
  canDelete,
}: {
  image: ImageItem;
  onPreview: (image: ImageItem) => void;
  onDownload: (image: ImageItem) => void;
  onToggleFavorite: (id: string) => void;
  onEdit: (image: ImageItem) => void;
  onDelete: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  canApprove: boolean;
  canDelete: boolean;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const theme = useMantineTheme();

  return (
    <MotionCard
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      withBorder
      padding={0}
      radius="xl"
      style={{
        overflow: 'hidden',
        boxShadow: isHovered ? '0 20px 40px rgba(0,0,0,0.15)' : '0 10px 20px rgba(0,0,0,0.05)',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card.Section>
        <Box style={{ position: 'relative', height: 200 }}>
          <img
            src={getThumbnailUrl(image.thumbnail_path, image.file_path)}
            alt={image.original_filename}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              cursor: 'pointer',
            }}
            onClick={() => onPreview(image)}
          />
          
          {/* Gradient Overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)',
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}
          />

          {/* Top Actions */}
          <Group
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}
            gap={4}
          >
            <Tooltip label="Edit" withArrow>
              <ActionIcon
                variant="filled"
                color="blue"
                size="md"
                radius="xl"
                onClick={() => onEdit(image)}
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
              >
                <IconEdit size={18} />
              </ActionIcon>
            </Tooltip>
            
            <Tooltip label={image.is_favorite ? 'Remove favorite' : 'Add to favorites'} withArrow>
              <ActionIcon
                variant="filled"
                color={image.is_favorite ? 'yellow' : 'white'}
                size="md"
                radius="xl"
                onClick={() => onToggleFavorite(image.id)}
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
              >
                {image.is_favorite ? <IconHeartFilled size={18} /> : <IconHeart size={18} />}
              </ActionIcon>
            </Tooltip>
            
            <Menu shadow="lg" width={200} position="bottom-end">
              <Menu.Target>
                <ActionIcon
                  variant="filled"
                  color="white"
                  size="md"
                  radius="xl"
                  style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
                >
                  <IconDotsVertical size={18} color="black" />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                {image.status === 'pending' && canApprove && (
                  <>
                    <Menu.Item
                      color="green"
                      leftSection={<IconCheck size={14} />}
                      onClick={() => onApprove?.(image.id)}
                    >
                      Approve Image
                    </Menu.Item>
                    <Menu.Item
                      color="red"
                      leftSection={<IconX size={14} />}
                      onClick={() => onReject?.(image.id)}
                    >
                      Reject Image
                    </Menu.Item>
                  </>
                )}
                {image.status === 'approved' && (
                  <Menu.Item
                    leftSection={<IconPrinter size={14} />}
                  >
                    Create Print Job
                  </Menu.Item>
                )}
                <Menu.Item
                  leftSection={<IconDownload size={14} />}
                  onClick={() => onDownload(image)}
                >
                  Download
                </Menu.Item>
                <Menu.Item
                  leftSection={<IconEdit size={14} />}
                  onClick={() => onEdit(image)}
                >
                  Edit Details
                </Menu.Item>
                {canDelete && (
                  <Menu.Item
                    color="red"
                    leftSection={<IconTrash size={14} />}
                    onClick={() => onDelete(image.id)}
                  >
                    Delete
                  </Menu.Item>
                )}
              </Menu.Dropdown>
            </Menu>
          </Group>

          {/* Status Badge */}
          <Badge
            size="lg"
            color={getStatusColor(image.status)}
            variant="filled"
            style={{
              position: 'absolute',
              bottom: 10,
              left: 10,
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}
            leftSection={getStatusIcon(image.status)}
          >
            {image.status}
          </Badge>
        </Box>
      </Card.Section>

      <Box p="md">
        <Group justify="space-between" mb={4}>
          <Text fw={600} size="sm" lineClamp={1}>
            {image.original_filename}
          </Text>
        </Group>

        <Group gap="xs">
          <Avatar size="xs" radius="xl" color="blue">
            <IconUser size={12} />
          </Avatar>
          <Text size="xs" c="dimmed">{image.uploader_name}</Text>
          <Text size="xs" c="dimmed">•</Text>
          <Text size="xs" c="dimmed">{dayjs(image.created_at).fromNow()}</Text>
        </Group>

        {image.description && (
          <Text size="xs" c="dimmed" lineClamp={2} mt={4}>
            {image.description}
          </Text>
        )}

        {image.tags && image.tags.length > 0 && (
          <Group gap={4} mt="xs">
            {image.tags.slice(0, 3).map(tag => (
              <Chip key={tag} size="xs" variant="light" radius="sm">
                {tag}
              </Chip>
            ))}
            {image.tags.length > 3 && (
              <Badge size="xs" variant="light" radius="sm">
                +{image.tags.length - 3}
              </Badge>
            )}
          </Group>
        )}
      </Box>
    </MotionCard>
  );
};

// Main Component
export default function UploadPage() {
  const router = useRouter();
  const theme = useMantineTheme();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const [recentUploads, setRecentUploads] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [userRole, setUserRole] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [popularTags, setPopularTags] = useState<Tag[]>([]);
  
  // Modal states
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);
  const [previewImage, setPreviewImage] = useState<ImageItem | null>(null);
  const [editImage, setEditImage] = useState<ImageItem | null>(null);
  const [deleteImage, setDeleteImage] = useState<ImageItem | null>(null);
  const [openedPreview, { open: openPreview, close: closePreview }] = useDisclosure(false);
  const [openedImagePreview, { open: openImagePreview, close: closeImagePreview }] = useDisclosure(false);
  const [openedEdit, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [openedDelete, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [openedReject, { open: openReject, close: closeReject }] = useDisclosure(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectImageId, setRejectImageId] = useState<string>('');

  // Stats
  const [stats, setStats] = useState({
    totalUploads: 0,
    pendingApproval: 0,
    approved: 0,
    storageUsed: 0,
    weeklyGrowth: 12,
  });

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
  const fetchRecentUploads =useCallback(async () => {
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
        ...(searchQuery && { search: searchQuery }),
        sortBy: 'created_at',
        sortOrder: 'desc',
      });

      const response = await fetch(`${API_URL}/api/images?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const data = await response.json();
      if (data.success && data.data?.images) {
        setRecentUploads(data.data.images);
        setTotalPages(data.data.pagination?.pages || 1);
      } else {
        setRecentUploads([]);
      }
    } catch (error) {
      console.error('Failed to fetch recent uploads:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to load recent uploads',
        color: 'red',
      });
      setRecentUploads([]);
    } finally {
      setLoading(false);
    }
  },[page, router, searchQuery]);

  // Load data on mount
  useEffect(() => {
    if (activeTab === 'my-uploads') {
      fetchRecentUploads();
    }
    fetchStats();
    fetchCategories();
    fetchPopularTags();
  }, [activeTab, fetchRecentUploads, page, searchQuery]);


  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const response = await fetch(`${API_URL}/api/images/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const data = await response.json();
      if (data.success) {
        setStats({
          totalUploads: data.data.total || 0,
          pendingApproval: data.data.pending || 0,
          approved: data.data.approved || 0,
          storageUsed: data.data.total_size || 0,
          weeklyGrowth: 12,
        });
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const response = await fetch(`${API_URL}/api/images/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const data = await response.json();
      if (data.success && data.data) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchPopularTags = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const response = await fetch(`${API_URL}/api/images/tags?popular=true&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const data = await response.json();
      if (data.success && data.data) {
        setPopularTags(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    }
  };

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
    
    notifications.show({
      title: 'Files selected',
      message: `${acceptedFiles.length} file(s) ready for upload`,
      color: 'green',
      icon: <IconCircleCheck size={16} />,
    });
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

  const handleUpdateFile = (id: string, data: Partial<UploadedFile>) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...data } : f))
    );
  };

  const handleUploadAll = async () => {
    if (files.length === 0) return;

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
        router.push('/page/login');
        return;
      }
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setFiles(prev => prev.map(f => ({
          ...f,
          uploadProgress: Math.min((f.uploadProgress || 0) + 10, 90)
        })));
      }, 500);

      const response = await fetch(`${API_URL}/api/images/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      clearInterval(progressInterval);

      const data = await response.json();

      if (data.success) {
        setFiles(prev => prev.map(f => ({ ...f, uploadStatus: 'success', uploadProgress: 100 })));
        
        notifications.show({
          title: 'Upload complete!',
          message: `${files.length} file(s) uploaded successfully`,
          color: 'green',
          icon: <IconCircleCheck size={16} />,
        });

        // Clean up and refresh after success
        setTimeout(() => {
          files.forEach(file => {
            if (file.preview) {
              URL.revokeObjectURL(file.preview);
            }
          });
          setFiles([]);
          fetchRecentUploads();
          fetchStats();
        }, 2000);
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (error: any) {
      setFiles(prev => prev.map(f => ({ ...f, uploadStatus: 'error', error: error.message })));
      
      notifications.show({
        title: 'Upload failed',
        message: error.message || 'Something went wrong',
        color: 'red',
        icon: <IconCircleX size={16} />,
      });
    } finally {
      setUploading(false);
    }
  };

  const handlePreview = (file: UploadedFile) => {
    setPreviewFile(file);
    openPreview();
  };

  const handleImagePreview = (image: ImageItem) => {
    setPreviewImage(image);
    openImagePreview();
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
        title: 'Download started',
        message: image.original_filename,
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
        setRecentUploads(prev =>
          prev.map(img =>
            img.id === id ? { ...img, is_favorite: !img.is_favorite } : img
          )
        );
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update favorite',
        color: 'red',
      });
    }
  };

  const handleEditImage = async (id: string, data: any) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/api/images/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.success) {
        setRecentUploads(prev =>
          prev.map(img => (img.id === id ? { ...img, ...data } : img))
        );
        notifications.show({
          title: 'Success',
          message: 'Image updated successfully',
          color: 'green',
        });
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update image',
        color: 'red',
      });
      throw error;
    }
  };

  const handleDeleteImage = async (id: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/api/images/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setRecentUploads(prev => prev.filter(img => img.id !== id));
        notifications.show({
          title: 'Success',
          message: 'Image deleted successfully',
          color: 'green',
        });
        fetchStats();
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete image',
        color: 'red',
      });
      throw error;
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
        setRecentUploads(prev =>
          prev.map(img => (img.id === id ? { ...img, status: 'approved' } : img))
        );
        notifications.show({
          title: 'Approved',
          message: 'Image has been approved',
          color: 'green',
        });
        fetchStats();
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
    if (!rejectImageId || !rejectReason.trim()) return;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/api/images/${rejectImageId}/reject`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: rejectReason }),
      });
      const data = await response.json();
      if (data.success) {
        setRecentUploads(prev =>
          prev.map(img => (img.id === rejectImageId ? { ...img, status: 'rejected' } : img))
        );
        notifications.show({
          title: 'Rejected',
          message: 'Image has been rejected',
          color: 'orange',
        });
        closeReject();
        setRejectReason('');
        setRejectImageId('');
        fetchStats();
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to reject image',
        color: 'red',
      });
    }
  };

  const canApprove = ['admin', 'cashier'].includes(userRole);
  const canDelete = ['admin'].includes(userRole);

  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files]);

  return (
    <Container size="xl" py="xl">
      <Grid gutter="lg">
        {/* Sidebar */}
        <Grid.Col span={{ base: 12, md: 3 }}>
          <MotionCard
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            withBorder
            padding="lg"
            radius="xl"
            style={{ position: 'sticky', top: 20 }}
          >
            <Stack>
              <Title order={4} mb="xs">Navigation</Title>
              
              <NavLink
                label="Upload Files"
                active={activeTab === 'upload'}
                onClick={() => setActiveTab('upload')}
                leftSection={
                  <ThemeIcon color="blue" variant="light" size="sm" radius="xl">
                    <IconUpload size={16} />
                  </ThemeIcon>
                }
                rightSection={
                  files.length > 0 ? (
                    <Badge size="sm" circle color="blue">
                      {files.length}
                    </Badge>
                  ) : null
                }
                style={{ borderRadius: theme.radius.lg }}
              />

              <NavLink
                label="My Uploads"
                active={activeTab === 'my-uploads'}
                onClick={() => setActiveTab('my-uploads')}
                leftSection={
                  <ThemeIcon color="grape" variant="light" size="sm" radius="xl">
                    <IconPhoto size={16} />
                  </ThemeIcon>
                }
                rightSection={
                  <Badge size="sm" circle color="grape">
                    {stats.totalUploads}
                  </Badge>
                }
                style={{ borderRadius: theme.radius.lg }}
              />

              <Divider my="sm" />

              {/* Storage Stats */}
              <Paper
                p="md"
                radius="lg"
                style={{
                  background: `linear-gradient(135deg, ${theme.colors.blue[6]}, ${theme.colors.cyan[6]})`,
                  color: 'white',
                }}
              >
                <Group justify="space-between" mb="xs">
                  <Text size="sm" style={{ opacity: 0.9 }}>Storage Used</Text>
                  <IconCloudUpload size={18} style={{ opacity: 0.9 }} />
                </Group>
                <Text fw={700} size="xl">{formatFileSize(stats.storageUsed)}</Text>
                <Progress
                  value={(stats.storageUsed / (10 * 1024 * 1024 * 1024)) * 100}
                  size="sm"
                  color="white"
                  radius="xl"
                  mt="xs"
                  style={{ background: 'rgba(255,255,255,0.2)' }}
                />
                <Text size="xs" mt={4} style={{ opacity: 0.8 }}>of 10 GB</Text>
              </Paper>

              {/* Quick Stats Grid */}
              <SimpleGrid cols={2} spacing="xs">
                <Paper p="md" radius="lg" withBorder>
                  <Group justify="space-between">
                    <div>
                      <Text size="xs" c="dimmed">Pending</Text>
                      <Text fw={700} size="xl" c="yellow.6">{stats.pendingApproval}</Text>
                    </div>
                    <ThemeIcon color="yellow" variant="light" size="lg" radius="xl">
                      <IconClock size={20} />
                    </ThemeIcon>
                  </Group>
                </Paper>
                <Paper p="md" radius="lg" withBorder>
                  <Group justify="space-between">
                    <div>
                      <Text size="xs" c="dimmed">Approved</Text>
                      <Text fw={700} size="xl" c="green.6">{stats.approved}</Text>
                    </div>
                    <ThemeIcon color="green" variant="light" size="lg" radius="xl">
                      <IconCheck size={20} />
                    </ThemeIcon>
                  </Group>
                </Paper>
              </SimpleGrid>

              {/* Categories */}
              {categories.length > 0 && (
                <>
                  <Divider label="Categories" />
                  <Stack gap="xs">
                    {categories.map((cat) => (
                      <Group key={cat.value} justify="space-between">
                        <Group gap="xs">
                          <ThemeIcon size="sm" variant="light" color={cat.color || 'blue'} radius="xl">
                            {cat.icon || <IconFolder size={12} />}
                          </ThemeIcon>
                          <Text size="sm">{cat.label}</Text>
                        </Group>
                        <Badge size="sm" variant="light">{cat.count || 0}</Badge>
                      </Group>
                    ))}
                  </Stack>
                </>
              )}

              {/* Popular Tags */}
              {popularTags.length > 0 && (
                <>
                  <Divider label="Popular Tags" />
                  <Group gap="xs">
                    {popularTags.map((tag) => (
                      <Chip
                        key={tag.name}
                        size="xs"
                        variant="light"
                        radius="xl"
                        onClick={() => {
                          setSearchQuery(tag.name);
                          setActiveTab('my-uploads');
                        }}
                      >
                        {tag.name} ({tag.count})
                      </Chip>
                    ))}
                  </Group>
                </>
              )}
            </Stack>
          </MotionCard>
        </Grid.Col>

        {/* Main Content */}
        <Grid.Col span={{ base: 12, md: 9 }}>
          <AnimatePresence mode="wait">
            <MotionStack
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header */}
              <Group justify="space-between">
                <div>
                  <Title order={2}>
                    {activeTab === 'upload' ? 'Upload Files' : 'My Uploads'}
                  </Title>
                  <Text c="dimmed" size="sm">
                    {activeTab === 'upload' 
                      ? 'Upload images and documents for printing'
                      : 'View and manage your uploaded files'}
                  </Text>
                </div>
                {activeTab === 'upload' && files.length > 0 && (
                  <Button
                    size="lg"
                    variant="gradient"
                    gradient={{ from: 'blue', to: 'cyan' }}
                    onClick={handleUploadAll}
                    loading={uploading}
                    leftSection={<IconRocket size={20} />}
                    radius="xl"
                  >
                    Upload {files.length} File{files.length !== 1 ? 's' : ''}
                  </Button>
                )}
              </Group>

              {activeTab === 'upload' ? (
                <>
                  {/* Beautiful Dropzone */}
                  <BeautifulDropzone onDrop={handleDrop} loading={uploading} />

                  {/* Selected Files with Animation */}
                  <AnimatePresence>
                    {files.length > 0 && (
                      <MotionBox
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <Paper withBorder p="lg" radius="xl">
                          <Group justify="space-between" mb="md">
                            <Group>
                              <ThemeIcon size="lg" variant="light" color="blue" radius="xl">
                                <IconPhoto size={20} />
                              </ThemeIcon>
                              <div>
                                <Text fw={600}>Selected Files ({files.length})</Text>
                                <Text size="xs" c="dimmed">
                                  Total size: {formatFileSize(files.reduce((acc, f) => acc + f.size, 0))}
                                </Text>
                              </div>
                            </Group>
                            <Button
                              variant="subtle"
                              color="red"
                              onClick={() => {
                                files.forEach(f => f.preview && URL.revokeObjectURL(f.preview));
                                setFiles([]);
                              }}
                              radius="xl"
                            >
                              Clear All
                            </Button>
                          </Group>

                          <ScrollArea h={400} type="hover">
                            <Stack gap="md">
                              {files.map((file, index) => (
                                <ElegantFileCard
                                  key={file.id}
                                  file={file}
                                  index={index}
                                  onRemove={handleRemoveFile}
                                  onUpdate={handleUpdateFile}
                                  onPreview={handlePreview}
                                />
                              ))}
                            </Stack>
                          </ScrollArea>
                        </Paper>
                      </MotionBox>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <>
                  {/* Search Bar */}
                  <TextInput
                    placeholder="Search your uploads..."
                    leftSection={<IconSearch size={18} />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    radius="xl"
                    size="md"
                  />

                  {/* Gallery Grid */}
                  {loading ? (
                    <Center py="xl">
                      <Loader size="lg" />
                    </Center>
                  ) : recentUploads.length === 0 ? (
                    <Paper p="xl" radius="xl" withBorder>
                      <Center>
                        <Stack align="center">
                          <ThemeIcon size={80} radius="xl" color="gray" variant="light">
                            <IconPhoto size={40} />
                          </ThemeIcon>
                          <Text size="lg" fw={500}>No uploads yet</Text>
                          <Button
                            onClick={() => setActiveTab('upload')}
                            leftSection={<IconUpload size={16} />}
                            radius="xl"
                          >
                            Upload your first image
                          </Button>
                        </Stack>
                      </Center>
                    </Paper>
                  ) : (
                    <>
                      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
                        {recentUploads.map((image) => (
                          <ElegantGalleryCard
                            key={image.id}
                            image={image}
                            onPreview={handleImagePreview}
                            onDownload={handleDownload}
                            onToggleFavorite={handleToggleFavorite}
                            onEdit={(img) => {
                              setEditImage(img);
                              openEdit();
                            }}
                            onDelete={(id) => {
                              const img = recentUploads.find(i => i.id === id);
                              if (img) {
                                setDeleteImage(img);
                                openDelete();
                              }
                            }}
                            onApprove={handleApprove}
                            onReject={(id) => {
                              setRejectImageId(id);
                              openReject();
                            }}
                            canApprove={canApprove}
                            canDelete={canDelete}
                          />
                        ))}
                      </SimpleGrid>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <Group justify="center" mt="xl">
                          <Pagination
                            total={totalPages}
                            value={page}
                            onChange={setPage}
                            withEdges
                            radius="xl"
                          />
                        </Group>
                      )}
                    </>
                  )}
                </>
              )}
            </MotionStack>
          </AnimatePresence>
        </Grid.Col>
      </Grid>

      {/* File Preview Modal */}
      <Modal
        opened={openedPreview}
        onClose={closePreview}
        size="xl"
        title="File Preview"
        radius="lg"
      >
        {previewFile && (
          <Stack>
            <Center style={{ backgroundColor: '#f5f5f5', minHeight: 400, borderRadius: theme.radius.lg }}>
              {previewFile.type?.startsWith('image/') ? (
                <img
                  src={previewFile.preview}
                  alt={previewFile.name}
                  style={{ maxWidth: '100%', maxHeight: 400, objectFit: 'contain' }}
                />
              ) : (
                <Stack align="center">
                  {getFileIcon(previewFile)}
                  <Text>Preview not available</Text>
                </Stack>
              )}
            </Center>
            <Divider />
            <Grid>
              <Grid.Col span={6}>
                <Text size="sm"><strong>Name:</strong> {previewFile.name}</Text>
                <Text size="sm"><strong>Size:</strong> {formatFileSize(previewFile.size)}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm"><strong>Type:</strong> {previewFile.type || 'Unknown'}</Text>
                <Text size="sm"><strong>Modified:</strong> {dayjs(previewFile.lastModified).format('MMM D, YYYY')}</Text>
              </Grid.Col>
            </Grid>
          </Stack>
        )}
      </Modal>

      {/* Image Preview Modal */}
      <Modal
        opened={openedImagePreview}
        onClose={closeImagePreview}
        size="xl"
        title="Image Preview"
        radius="lg"
      >
        {previewImage && (
          <Stack>
            <Center style={{ backgroundColor: '#f5f5f5', minHeight: 400, borderRadius: theme.radius.lg }}>
              <img
                src={getImageUrl(previewImage.file_path)}
                alt={previewImage.original_filename}
                style={{ maxWidth: '100%', maxHeight: 400, objectFit: 'contain' }}
              />
            </Center>
            <Divider />
            <Grid>
              <Grid.Col span={6}>
                <Text size="sm"><strong>Filename:</strong> {previewImage.original_filename}</Text>
                <Text size="sm"><strong>Size:</strong> {formatFileSize(previewImage.file_size)}</Text>
                <Text size="sm"><strong>Dimensions:</strong> {previewImage.width} x {previewImage.height}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm"><strong>Uploaded by:</strong> {previewImage.uploader_name}</Text>
                <Text size="sm"><strong>Uploaded:</strong> {dayjs(previewImage.created_at).format('MMM D, YYYY')}</Text>
                <Text size="sm"><strong>Status:</strong> {previewImage.status}</Text>
              </Grid.Col>
            </Grid>
            <Group justify="flex-end">
              <Button
                variant="light"
                onClick={() => handleDownload(previewImage)}
                leftSection={<IconDownload size={16} />}
                radius="xl"
              >
                Download
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Edit Image Modal */}
      <EditImageModal
        opened={openedEdit}
        onClose={closeEdit}
        image={editImage}
        onSave={handleEditImage}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        opened={openedDelete}
        onClose={closeDelete}
        onConfirm={() => deleteImage ? handleDeleteImage(deleteImage.id) : Promise.resolve()}
        itemName={deleteImage?.original_filename || ''}
      />

      {/* Reject Modal */}
      <Modal opened={openedReject} onClose={closeReject} title="Reject Image" radius="lg">
        <Stack>
          <Textarea
            label="Rejection Reason"
            placeholder="Please provide a reason for rejection..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            minRows={3}
            required
            radius="md"
          />
          <Group justify="flex-end">
            <Button variant="light" onClick={closeReject} radius="xl">
              Cancel
            </Button>
            <Button color=" red" onClick={handleReject} radius="xl">
              Reject
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}