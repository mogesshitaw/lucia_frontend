'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Title,
  Text,
  SimpleGrid,
  Card,
  Badge,
  Group,
  Stack,
  TextInput,
  Select,
  Pagination,
  Center,
  Loader,
  Paper,
  ThemeIcon,
  Button,
  Modal,
  ActionIcon,
  Tooltip,
  Box,
  Image as MantineImage,
  Spoiler,
  Divider,
  Chip,
} from '@mantine/core';
import {
  IconSearch,
  IconPhoto,
  IconEye,
  IconDownload,
  IconHeart,
  IconHeartFilled,
  IconX,
  IconChevronLeft,
  IconChevronRight,
  IconCategory,
  IconCalendar,
  IconUser,
  IconTags,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Types
interface ServiceImage {
  id: string;
  service_id: string;
  image_path: string;
  thumbnail_path: string | null;
  alt_text: string | null;
  is_primary: boolean;
  display_order: number;
  created_at: string;
  service?: {
    id: string;
    title: string;
    slug: string;
    category: string;
    badge: string | null;
    icon_name: string;
  };
}

interface Service {
  id: string;
  title: string;
  slug: string;
  category: string;
  category_name?: string;
  badge: string | null;
  icon_name: string;
  image_count?: number;
}

interface Category {
  value: string;
  label: string;
  count: number;
}

const MotionDiv = motion.div;

export default function GalleryPage() {
  const [images, setImages] = useState<ServiceImage[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalImages, setTotalImages] = useState(0);
  
  // Lightbox state
  const [lightboxOpened, setLightboxOpened] = useState(false);
  const [currentImage, setCurrentImage] = useState<ServiceImage | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Categories state
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Favorites state (local storage)
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Fetch images
  const fetchImages = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        ...(searchQuery && { search: searchQuery }),
        ...(selectedService && { service_id: selectedService }),
        ...(selectedCategory && { category: selectedCategory }),
      });

      const response = await fetch(`${API_URL}/api/public/gallery/images?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setImages(data.data.images || []);
        setTotalPages(data.data.pagination?.pages || 1);
        setTotalImages(data.data.pagination?.total || 0);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch services for filter
  const fetchServices = async () => {
    try {
      const response = await fetch(`${API_URL}/api/public/services?limit=100`);
      const data = await response.json();
      if (data.success) {
        setServices(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  // Fetch categories with counts
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/api/public/gallery/categories`);
      const data = await response.json();
      if (data.success) {
        setCategories(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('galleryFavorites');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  // Save favorites to localStorage
  const toggleFavorite = (imageId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(imageId)) {
      newFavorites.delete(imageId);
    } else {
      newFavorites.add(imageId);
    }
    setFavorites(newFavorites);
    localStorage.setItem('galleryFavorites', JSON.stringify([...newFavorites]));
  };

  useEffect(() => {
    fetchImages();
    fetchServices();
    fetchCategories();
  }, [page, searchQuery, selectedService, selectedCategory]);

  // Get image URL
  const getImageUrl = (path: string) => {
    if (!path) return 'https://placehold.co/600x400?text=No+Image';
    let cleanPath = path.replace(/\\/g, '/');
    cleanPath = cleanPath.replace(/^\/+/, '');
    if (!cleanPath.startsWith('uploads/')) {
      cleanPath = `uploads/${cleanPath}`;
    }
    return `${API_URL}/${cleanPath}`;
  };

  // Open lightbox
  const openLightbox = (image: ServiceImage, index: number) => {
    setCurrentImage(image);
    setCurrentIndex(index);
    setLightboxOpened(true);
  };

  // Navigate lightbox
  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (!images.length) return;
    
    let newIndex = currentIndex;
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
    } else {
      newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
    }
    
    setCurrentIndex(newIndex);
    setCurrentImage(images[newIndex]);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpened) return;
      
      if (e.key === 'ArrowLeft') {
        navigateLightbox('prev');
      } else if (e.key === 'ArrowRight') {
        navigateLightbox('next');
      } else if (e.key === 'Escape') {
        setLightboxOpened(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpened, currentIndex]);

  // Get service icon emoji
  const getServiceIcon = (iconName: string) => {
    const icons: Record<string, string> = {
      Printer: '🖨️',
      Shirt: '👕',
      Megaphone: '📢',
      Camera: '📷',
      Car: '🚗',
      Lightbulb: '💡',
      Sparkles: '✨',
      Tag: '🏷️',
      Snowflake: '❄️',
      Coffee: '☕',
      Wine: '🍷',
      FileText: '📄',
      Package: '📦',
      Pen: '✒️',
      Key: '🔑',
      Flame: '🔥',
      Scissors: '✂️',
      Palette: '🎨',
    };
    return icons[iconName] || '🖼️';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-red-600 to-orange-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }} />
        </div>
        
        <Container size="lg" className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge size="lg" variant="white" className="mb-4 bg-white/20 text-white border-0">
              Service Gallery
            </Badge>
            <Title order={1} className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Our Work <span className="text-yellow-300">Showcase</span>
            </Title>
            <Text size="xl" className="max-w-3xl mx-auto text-white/90 mb-8">
              Browse through images of our completed projects across all printing services
            </Text>
          </motion.div>
        </Container>
      </section>

      <Container size="xl" className="py-12">
        {/* Filters Bar */}
        <Paper withBorder p="md" radius="lg" className="mb-8">
          <Stack gap="md">
            <Group justify="space-between">
              <Group>
                <ThemeIcon size="lg" radius="xl" color="red" variant="light">
                  <IconPhoto size={20} />
                </ThemeIcon>
                <div>
                  <Text fw={600}>Service Gallery</Text>
                  <Text size="xs" c="dimmed">{totalImages} images</Text>
                </div>
              </Group>
            </Group>

            <Group grow>
              <TextInput
                placeholder="Search images..."
                leftSection={<IconSearch size={16} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                radius="md"
                size="md"
              />
              
              <Select
                placeholder="Filter by Service"
                leftSection={<IconCategory size={16} />}
                data={[
                  { value: '', label: 'All Services' },
                  ...services.map(s => ({ 
                    value: s.id, 
                    label: `${getServiceIcon(s.icon_name)} ${s.title}` 
                  })),
                ]}
                value={selectedService}
                onChange={setSelectedService}
                clearable
                searchable
                radius="md"
                size="md"
              />
            </Group>

            {/* Category Chips */}
            {categories.length > 0 && (
              <Group gap="xs">
                <Text size="sm" fw={500}>Categories:</Text>
                <Chip
                  size="sm"
                  variant="light"
                  checked={selectedCategory === null}
                  onChange={() => setSelectedCategory(null)}
                  color="red"
                >
                  All
                </Chip>
                {categories.map((cat) => (
                  <Chip
                    key={cat.value}
                    size="sm"
                    variant="light"
                    checked={selectedCategory === cat.value}
                    onChange={() => setSelectedCategory(cat.value)}
                    color="red"
                  >
                    {cat.label} ({cat.count})
                  </Chip>
                ))}
              </Group>
            )}
          </Stack>
        </Paper>

        {/* Gallery Grid */}
        {loading ? (
          <Center py="xl">
            <Stack align="center">
              <Loader size="lg" color="red" />
              <Text c="dimmed">Loading gallery...</Text>
            </Stack>
          </Center>
        ) : images.length === 0 ? (
          <Paper p="xl" withBorder className="text-center">
            <ThemeIcon size={60} radius="xl" color="gray" variant="light" className="mx-auto mb-4">
              <IconPhoto size={30} />
            </ThemeIcon>
            <Title order={3} className="mb-2">No Images Found</Title>
            <Text c="dimmed" className="mb-6">
              {searchQuery || selectedService || selectedCategory
                ? 'No images match your filters. Try adjusting your search.'
                : 'No service images have been uploaded yet.'}
            </Text>
            {(searchQuery || selectedService || selectedCategory) && (
              <Button
                variant="light"
                color="red"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedService(null);
                  setSelectedCategory(null);
                }}
              >
                Clear Filters
              </Button>
            )}
          </Paper>
        ) : (
          <>
            <AnimatePresence mode="wait">
              <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg">
                {images.map((image, index) => {
                  const service = services.find(s => s.id === image.service_id);
                  return (
                    <GalleryCard
                      key={image.id}
                      image={image}
                      service={service}
                      index={index}
                      isFavorite={favorites.has(image.id)}
                      onFavoriteToggle={toggleFavorite}
                      onClick={() => openLightbox(image, index)}
                      getImageUrl={getImageUrl}
                      getServiceIcon={getServiceIcon}
                    />
                  );
                })}
              </SimpleGrid>
            </AnimatePresence>

            {/* Pagination */}
            {totalPages > 1 && (
              <Group justify="center" mt="xl">
                <Pagination
                  total={totalPages}
                  value={page}
                  onChange={setPage}
                  withEdges
                  radius="xl"
                  color="red"
                />
              </Group>
            )}
          </>
        )}
      </Container>

      {/* Lightbox Modal */}
      <Modal
        opened={lightboxOpened}
        onClose={() => setLightboxOpened(false)}
        size="xl"
        padding={0}
        radius="lg"
        withCloseButton={false}
        centered
      >
        {currentImage && (
          <Box className="relative" style={{ minHeight: '60vh' }}>
            {/* Navigation */}
            <ActionIcon
              className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10"
              size="xl"
              radius="xl"
              variant="filled"
              color="white"
              style={{ opacity: 0.8 }}
              onClick={() => navigateLightbox('prev')}
            >
              <IconChevronLeft size={24} color="black" />
            </ActionIcon>
            
            <ActionIcon
              className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10"
              size="xl"
              radius="xl"
              variant="filled"
              color="white"
              style={{ opacity: 0.8 }}
              onClick={() => navigateLightbox('next')}
            >
              <IconChevronRight size={24} color="black" />
            </ActionIcon>

            {/* Close button */}
            <ActionIcon
              className="absolute right-2 top-2 z-10"
              size="lg"
              radius="xl"
              variant="filled"
              color="white"
              onClick={() => setLightboxOpened(false)}
            >
              <IconX size={18} color="black" />
            </ActionIcon>

            {/* Image */}
            <div className="relative min-h-[60vh] flex items-center justify-center bg-black/5 p-4">
              <img
                src={getImageUrl(currentImage.image_path)}
                alt={currentImage.alt_text || 'Gallery image'}
                className="max-w-full max-h-[70vh] object-contain"
              />
            </div>

            {/* Image Info */}
            <Paper p="md" withBorder className="border-t">
              <Stack>
                <Group justify="space-between">
                  <div>
                    <Group gap="xs" mb={4}>
                      <Text fw={600} size="lg">
                        {currentImage.alt_text || 'Service Image'}
                      </Text>
                      {currentImage.is_primary && (
                        <Badge color="red" variant="light">Primary</Badge>
                      )}
                    </Group>
                    
                    {currentImage.service && (
                      <Link 
                        href={`/page/services/${currentImage.service.slug}`}
                        className="no-underline"
                      >
                        <Badge 
                          size="lg" 
                          variant="gradient"
                          gradient={{ from: 'red', to: 'orange' }}
                          className="cursor-pointer hover:opacity-80 transition-opacity"
                        >
                          {getServiceIcon(currentImage.service.icon_name)} {currentImage.service.title}
                        </Badge>
                      </Link>
                    )}
                  </div>
                  
                  <Group>
                    <Tooltip label={favorites.has(currentImage.id) ? 'Remove from favorites' : 'Add to favorites'}>
                      <ActionIcon
                        size="lg"
                        variant="light"
                        color={favorites.has(currentImage.id) ? 'red' : 'gray'}
                        onClick={() => toggleFavorite(currentImage.id)}
                      >
                        {favorites.has(currentImage.id) ? <IconHeartFilled size={20} /> : <IconHeart size={20} />}
                      </ActionIcon>
                    </Tooltip>
                    
                    <Tooltip label="Download">
                      <ActionIcon
                        size="lg"
                        variant="light"
                        color="blue"
                        component="a"
                        href={getImageUrl(currentImage.image_path)}
                        download
                        target="_blank"
                      >
                        <IconDownload size={20} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Group>

                <Divider />

                <Group gap="lg">
                  <Group gap="xs">
                    <IconCalendar size={14} className="text-gray-500" />
                    <Text size="sm" c="dimmed">
                      {dayjs(currentImage.created_at).format('MMMM D, YYYY')}
                    </Text>
                  </Group>
                  
                  <Group gap="xs">
                    <IconEye size={14} className="text-gray-500" />
                    <Text size="sm" c="dimmed">High Quality</Text>
                  </Group>
                </Group>

                {currentImage.service?.badge && (
                  <Badge color="orange" variant="light" size="lg">
                    {currentImage.service.badge}
                  </Badge>
                )}
              </Stack>
            </Paper>
          </Box>
        )}
      </Modal>
    </div>
  );
}

// Gallery Card Component
function GalleryCard({ 
  image, 
  service, 
  index, 
  isFavorite, 
  onFavoriteToggle, 
  onClick,
  getImageUrl,
  getServiceIcon 
}: any) {
  return (
    <MotionDiv
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -5 }}
    >
      <Card withBorder padding="lg" radius="lg" className="group cursor-pointer" onClick={onClick}>
        <Card.Section className="relative overflow-hidden">
          <div className="relative h-48 overflow-hidden">
            <img
              src={getImageUrl(image.thumbnail_path || image.image_path)}
              alt={image.alt_text || 'Gallery image'}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          
          {/* Favorite button */}
          <ActionIcon
            className="absolute top-2 right-2"
            variant="filled"
            color={isFavorite ? 'red' : 'white'}
            radius="xl"
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteToggle(image.id);
            }}
          >
            {isFavorite ? <IconHeartFilled size={16} /> : <IconHeart size={16} />}
          </ActionIcon>

          {/* Primary badge */}
          {image.is_primary && (
            <Badge
              className="absolute bottom-2 left-2"
              color="red"
              variant="filled"
              size="sm"
            >
              Primary
            </Badge>
          )}
        </Card.Section>

        <Stack gap="xs" mt="md">
          <Group justify="space-between">
            <Text fw={600} size="sm" lineClamp={1}>
              {image.alt_text || 'Service Image'}
            </Text>
          </Group>
          
          {service && (
            <Link 
              href={`/page/services/${service.slug}`}
              className="no-underline"
              onClick={(e) => e.stopPropagation()}
            >
              <Badge 
                variant="light" 
                color="red"
                className="cursor-pointer hover:opacity-80 transition-opacity"
                leftSection={getServiceIcon(service.icon_name)}
              >
                {service.title}
              </Badge>
            </Link>
          )}
        </Stack>
      </Card>
    </MotionDiv>
  );
}