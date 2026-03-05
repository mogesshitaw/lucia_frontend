/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Container, Title, Text, Button, Grid, Card, Group, ThemeIcon, Badge, SimpleGrid, Stack, Divider, ActionIcon, Tooltip, Paper, Modal, Rating } from '@mantine/core';
import { motion, useScroll, useTransform, useAnimation, useInView } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

// Missing imports for ScrollArea and Avatar
import { ScrollArea } from '@mantine/core';
import { Avatar } from '@mantine/core';
import { Calendar, Phone } from 'lucide-react';
import { Quote } from 'lucide-react';
import {
  Camera,
  Heart,
  Share2,
  Download,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  X,
  Filter,
  Grid3x3,
  LayoutList,
  Award,
  Users,
  Star,
  Eye,
  MessageCircle,
  DollarSign,
  ArrowRight,
  Play,
  Pause,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const MotionDiv = motion.div;
const MotionSection = motion.section;
const MotionCard = motion(Card as any);



// Floating particles animation
const FloatingParticles = () => {
  // Generate particles directly in useState initializer
  const [particles] = useState(() => {
    const colors = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];
    
    return [...Array(30)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: 10 + Math.random() * 20,
      delay: Math.random() * 10,
    }));
  });

  // No need for mounted check
  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            left: `${p.x}%`,
            top: `${p.y}%`,
            opacity: 0.15,
          }}
          animate={{
            y: [0, -30, 0, 30, 0],
            x: [0, 30, 0, -30, 0],
            scale: [1, 1.2, 1, 0.8, 1],
            opacity: [0.15, 0.3, 0.15, 0.3, 0.15],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

// Gallery Item Component
const GalleryItem = ({ item, index, onOpen }: { item: any; index: number; onOpen: (item: any) => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  return (
    <MotionCard
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="relative overflow-hidden group cursor-pointer"
      padding={0}
      radius="lg"
      withBorder
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onOpen(item)}
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Category Badge */}
        <Badge
          className="absolute top-4 left-4"
          variant="gradient"
          gradient={{ from: item.categoryColor?.split(' ')[0] || 'red', to: item.categoryColor?.split(' ')[1] || 'orange' }}
        >
          {item.category}
        </Badge>

        {/* Like Button */}
        <motion.div
          className="absolute top-4 right-4"
          initial={{ scale: 0 }}
          animate={{ scale: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ActionIcon
            variant="filled"
            color={isLiked ? 'red' : 'white'}
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className="shadow-lg"
          >
            <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
          </ActionIcon>
        </motion.div>

        {/* Content Overlay */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 p-4 text-white"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Title order={4} className="mb-1">{item.title}</Title>
          <Text size="sm" className="text-gray-200 mb-2">{item.description}</Text>
          
          <Group gap="xs">
            <Group gap={4}>
              <Eye size={14} />
              <Text size="xs">{item.views || '2.5k'}</Text>
            </Group>
            <Group gap={4}>
              <Heart size={14} />
              <Text size="xs">{item.likes || 124}</Text>
            </Group>
            <Group gap={4}>
              <MessageCircle size={14} />
              <Text size="xs">{item.comments || 18}</Text>
            </Group>
          </Group>
        </motion.div>
      </div>
    </MotionCard>
  );
};

// Featured Item Component
const FeaturedItem = ({ item, index }: { item: any; index: number }) => {
  return (
    <MotionCard
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      padding={0}
      radius="lg"
      withBorder
      className="overflow-hidden"
    >
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <div className="relative h-64 md:h-full">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
            
            <Badge
              size="lg"
              variant="gradient"
              gradient={{ from: 'red', to: 'orange' }}
              className="absolute top-4 left-4"
            >
              Featured Project
            </Badge>
          </div>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Stack p="xl" gap="md">
            <Group>
              <ThemeIcon size={40} radius="xl" color="red" variant="light">
                <Award size={20} />
              </ThemeIcon>
              <div>
                <Text fw={700} size="xl">{item.title}</Text>
                <Text c="dimmed">{item.category}</Text>
              </div>
            </Group>

            <Text size="lg">{item.description}</Text>

            <Divider />

            <Grid>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">Client</Text>
                <Text fw={500}>{item.client || 'Confidential'}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">Date</Text>
                <Text fw={500}>{item.date || '2024'}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">Techniques</Text>
                <Text fw={500}>{item.techniques || 'Various'}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" c="dimmed">Size</Text>
                <Text fw={500}>{item.size || 'Various'}</Text>
              </Grid.Col>
            </Grid>

            <Group gap="xs">
              {item.tags?.map((tag: string, i: number) => (
                <Badge key={i} variant="light" color="red" size="sm">
                  {tag}
                </Badge>
              ))}
            </Group>

            <Button
              variant="light"
              color="red"
              rightSection={<ArrowRight size={16} />}
              component={Link}
              href={`/project/${item.id}`}
              className="mt-2"
            >
              View Full Project
            </Button>
          </Stack>
        </Grid.Col>
      </Grid>
    </MotionCard>
  );
};

// Video Item Component
const VideoItem = ({ item, index, onOpen }: { item: any; index: number; onOpen: (item: any) => void }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <MotionCard
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      viewport={{ once: true }}
      className="relative overflow-hidden group cursor-pointer"
      padding={0}
      radius="lg"
      withBorder
      onClick={() => onOpen(item)}
    >
      <div className="relative aspect-video overflow-hidden">
        <video
          ref={videoRef}
          src={item.video}
          className="w-full h-full object-cover"
          loop
          muted
          playsInline
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Category Badge */}
        <Badge
          className="absolute top-4 left-4"
          variant="gradient"
          gradient={{ from: 'purple', to: 'pink' }}
        >
          Video
        </Badge>

        {/* Play Button */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
        >
          <ActionIcon
            size={60}
            radius="xl"
            variant="filled"
            color="red"
            onClick={togglePlay}
            className="shadow-2xl"
          >
            {isPlaying ? <Pause size={30} /> : <Play size={30} />}
          </ActionIcon>
        </motion.div>

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <Title order={4} className="mb-1">{item.title}</Title>
          <Text size="sm" className="text-gray-200">{item.description}</Text>
        </div>
      </div>
    </MotionCard>
  );
};

// Category Filter Component
const CategoryFilter = ({ categories, activeCategory, setActiveCategory }: { categories: string[]; activeCategory: string; setActiveCategory: (category: string) => void }) => {
  return (
    <Paper p="md" radius="lg" withBorder className="sticky top-20 z-10 bg-white/80 backdrop-blur-md">
      <Group justify="space-between">
        <Group gap="xs">
          <Filter size={20} />
          <Text fw={600}>Filter:</Text>
        </Group>
        
        <ScrollArea  scrollbarSize={8}
            offsetScrollbars
            className="w-full overflow-x-auto" >
          <Group gap="xs" wrap="nowrap">
            <Button
              variant={activeCategory === 'all' ? 'filled' : 'light'}
              color="red"
              radius="xl"
              size="sm"
              onClick={() => setActiveCategory('all')}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? 'filled' : 'light'}
                color="red"
                radius="xl"
                size="sm"
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Button>
            ))}
          </Group>
        </ScrollArea>

        <Group gap="xs">
          <ActionIcon variant="light" color="gray" radius="xl" size="lg">
            <Grid3x3 size={18} />
          </ActionIcon>
          <ActionIcon variant="light" color="gray" radius="xl" size="lg">
            <LayoutList size={18} />
          </ActionIcon>
        </Group>
      </Group>
    </Paper>
  );
};

// Lightbox Component
const Lightbox = ({ item, opened, onClose, onNext, onPrev, hasNext, hasPrev }: { item: any; opened: boolean; onClose: () => void; onNext: () => void; onPrev: () => void; hasNext: boolean; hasPrev: boolean }) => {
  const [zoom, setZoom] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [liked, setLiked] = useState(false);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size={fullscreen ? '100%' : '90%'}
      padding={0}
      radius={0}
      withCloseButton={false}
      styles={{
        body: {
          height: fullscreen ? '100vh' : '90vh',
          backgroundColor: 'black',
        },
      }}
    >
      <div className="relative h-full bg-black text-white">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/70 to-transparent p-4">
          <Group justify="space-between">
            <Group>
              <Badge size="lg" variant="gradient" gradient={{ from: 'red', to: 'orange' }}>
                {item?.category}
              </Badge>
              <Text fw={600} size="lg">{item?.title}</Text>
            </Group>
            <Group>
              <ActionIcon variant="subtle" color="white" onClick={() => setZoom(Math.min(zoom + 0.5, 3))}>
                <ZoomIn size={20} />
              </ActionIcon>
              <ActionIcon variant="subtle" color="white" onClick={() => setZoom(Math.max(zoom - 0.5, 0.5))}>
                <ZoomOut size={20} />
              </ActionIcon>
              <ActionIcon variant="subtle" color="white" onClick={() => setFullscreen(!fullscreen)}>
                {fullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
              </ActionIcon>
              <ActionIcon variant="subtle" color="white" onClick={onClose}>
                <X size={20} />
              </ActionIcon>
            </Group>
          </Group>
        </div>

        {/* Image */}
        <div className="h-full flex items-center justify-center">
          {item?.type === 'video' ? (
            <video
              src={item.video}
              controls
              className="max-h-full max-w-full"
              style={{ transform: `scale(${zoom})` }}
            />
          ) : (
            <motion.div
              animate={{ scale: zoom }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              <Image
                src={item?.image || ''}
                alt={item?.title || ''}
                width={1200}
                height={800}
                className="max-h-full max-w-full object-contain"
              />
            </motion.div>
          )}
        </div>

        {/* Navigation */}
        {hasPrev && (
          <ActionIcon
            className="absolute left-4 top-1/2 transform -translate-y-1/2"
            size="xl"
            radius="xl"
            variant="filled"
            color="white"
            onClick={onPrev}
          >
            <ChevronLeft size={24} />
          </ActionIcon>
        )}
        {hasNext && (
          <ActionIcon
            className="absolute right-4 top-1/2 transform -translate-y-1/2"
            size="xl"
            radius="xl"
            variant="filled"
            color="white"
            onClick={onNext}
          >
            <ChevronRight size={24} />
          </ActionIcon>
        )}

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/70 to-transparent p-4">
          <Group justify="space-between">
            <Stack gap={4}>
              <Text size="sm" className="text-gray-300">{item?.description}</Text>
              <Group gap="lg">
                <Group gap={4}>
                  <Calendar size={14} />
                  <Text size="xs">{item?.date || '2024'}</Text>
                </Group>
                <Group gap={4}>
                  <Eye size={14} />
                  <Text size="xs">{item?.views || '2.5k'}</Text>
                </Group>
                <Group gap={4}>
                  <Heart size={14} />
                  <Text size="xs">{item?.likes || 124}</Text>
                </Group>
              </Group>
            </Stack>
            <Group>
              <ActionIcon
                variant="subtle"
                color="white"
                onClick={() => setLiked(!liked)}
              >
                <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
              </ActionIcon>
              <ActionIcon variant="subtle" color="white">
                <Share2 size={20} />
              </ActionIcon>
              <ActionIcon variant="subtle" color="white">
                <Download size={20} />
              </ActionIcon>
            </Group>
          </Group>
        </div>
      </div>
    </Modal>
  );
};

// Stats Card
const StatsCard = ({ icon, value, label, color }: { icon: React.ReactNode; value: string; label: string; color: string }) => {
  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      padding="lg"
      radius="lg"
      withBorder
      className="text-center"
    >
      <ThemeIcon
        size={50}
        radius="xl"
        variant="gradient"
        gradient={{ from: color.split(' ')[0].replace('from-', ''), to: color.split(' ')[1].replace('to-', '') }}
        className="mx-auto mb-3"
      >
        {icon}
      </ThemeIcon>
      <Title order={3} className="text-2xl font-bold">{value}</Title>
      <Text size="sm" c="dimmed">{label}</Text>
    </MotionCard>
  );
};

// Testimonial Card
const TestimonialCard = ({ testimonial, index }: { testimonial: any; index: number }) => {
  return (
    <MotionCard
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      padding="xl"
      radius="lg"
      withBorder
      className="relative"
    >
      <Quote className="absolute top-4 right-4 text-red-200 dark:text-red-800/30" size={40} />
      
      <Group mb="md">
        <Avatar src={testimonial.avatar} size="lg" radius="xl" />
        <div>
          <Text fw={600}>{testimonial.name}</Text>
          <Text size="sm" c="dimmed">{testimonial.role}</Text>
        </div>
      </Group>

      <Rating value={testimonial.rating} readOnly mb="md" />

      <Text size="lg" className="italic mb-4">&quot;{testimonial.content}&quot;</Text>

      <Text size="sm" c="dimmed">{testimonial.project}</Text>
    </MotionCard>
  );
};

export default function GalleryPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const [activeTab, setActiveTab] = useState<string | null>('all');
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Gallery items
  const galleryItems = [
    // Apparel Category
    {
      id: 1,
      title: 'Custom DTF T-Shirts',
      description: 'Vibrant DTF prints on premium cotton t-shirts for a local sports team.',
      image: '/images/service1.jpg',
      category: 'Apparel',
      categoryColor: 'from-purple-500 to-pink-500',
      tags: ['DTF', 'T-Shirts', 'Sports'],
      client: 'Addis Sports Club',
      date: '2024',
      techniques: 'DTF Printing',
      size: 'Various',
      views: '3.2k',
      likes: 245,
      comments: 32,
    },
    {
      id: 2,
      title: 'Corporate Polo Shirts',
      description: 'Embroidered polo shirts for a leading insurance company.',
      image: '/images/service1.jpg',
      category: 'Apparel',
      categoryColor: 'from-purple-500 to-pink-500',
      tags: ['Embroidery', 'Corporate', 'Uniforms'],
      client: 'Ethio Insurance',
      date: '2024',
      techniques: 'Embroidery',
      size: 'M-XXL',
      views: '1.8k',
      likes: 156,
      comments: 14,
    },
    {
      id: 3,
      title: 'Custom Hoodies',
      description: 'Comfortable hoodies for a university event.',
      image: '/images/service1.jpg',
      category: 'Apparel',
      categoryColor: 'from-purple-500 to-pink-500',
      tags: ['Hoodies', 'University', 'Screen Printing'],
      client: 'AAU Students',
      date: '2023',
      techniques: 'Screen Printing',
      size: 'S-2XL',
      views: '2.1k',
      likes: 189,
      comments: 23,
    },
    {
      id: 4,
      title: 'Team Jerseys',
      description: 'Full set of soccer jerseys with player names and numbers.',
      image: '/images/service1.jpg',
      category: 'Apparel',
      categoryColor: 'from-purple-500 to-pink-500',
      tags: ['Jerseys', 'Sports', 'Sublimation'],
      client: 'St. George FC',
      date: '2024',
      techniques: 'Sublimation',
      size: 'Youth-Adult',
      views: '4.5k',
      likes: 312,
      comments: 45,
    },

    // Banners & Signage
    {
      id: 5,
      title: 'Trade Show Banner',
      description: 'Large format banner for an international trade show.',
      image: '/images/service1.jpg',
      category: 'Banners',
      categoryColor: 'from-red-500 to-orange-500',
      tags: ['Trade Show', 'Large Format', 'Retractable'],
      client: 'Ethio Telecom',
      date: '2024',
      techniques: 'UV Printing',
      size: '3m x 2m',
      views: '2.8k',
      likes: 167,
      comments: 12,
    },
    {
      id: 6,
      title: 'Storefront Signage',
      description: 'Illuminated signage for a new restaurant.',
      image: '/images/service1.jpg',
      category: 'Banners',
      categoryColor: 'from-red-500 to-orange-500',
      tags: ['Signage', 'Illuminated', 'Acrylic'],
      client: 'Yod Abyssinia',
      date: '2024',
      techniques: 'CNC Routing',
      size: '2m x 1m',
      views: '3.1k',
      likes: 234,
      comments: 28,
    },
    {
      id: 7,
      title: 'Event Backdrop',
      description: 'Custom printed backdrop for a corporate event.',
      image: '/images/service1.jpg',
      category: 'Banners',
      categoryColor: 'from-red-500 to-orange-500',
      tags: ['Backdrop', 'Events', 'Step & Repeat'],
      client: 'Dashen Bank',
      date: '2023',
      techniques: 'Dye Sublimation',
      size: '4m x 2.5m',
      views: '2.2k',
      likes: 145,
      comments: 9,
    },
    {
      id: 8,
      title: 'Outdoor Billboard',
      description: 'Massive billboard for a major advertising campaign.',
      image: '/images/service1.jpg',
      category: 'Banners',
      categoryColor: 'from-red-500 to-orange-500',
      tags: ['Billboard', 'Outdoor', 'Vinyl'],
      client: 'Pepsi Ethiopia',
      date: '2024',
      techniques: 'Large Format',
      size: '6m x 3m',
      views: '5.2k',
      likes: 423,
      comments: 56,
    },

    // Stickers & Labels
    {
      id: 9,
      title: 'Product Labels',
      description: 'Custom labels for a local honey producer.',
      image: '/images/service1.jpg',
      category: 'Stickers',
      categoryColor: 'from-yellow-500 to-orange-500',
      tags: ['Labels', 'Food', 'Waterproof'],
      client: 'Ethio Honey',
      date: '2024',
      techniques: 'Flexo Printing',
      size: '5cm x 5cm',
      views: '1.5k',
      likes: 98,
      comments: 7,
    },
    {
      id: 10,
      title: 'Die-Cut Stickers',
      description: 'Custom shaped stickers for a music festival.',
      image: '/images/service1.jpg',
      category: 'Stickers',
      categoryColor: 'from-yellow-500 to-orange-500',
      tags: ['Die-Cut', 'Festival', 'Vinyl'],
      client: 'Jazz Amba',
      date: '2023',
      techniques: 'Kiss-Cut',
      size: 'Various',
      views: '2.3k',
      likes: 178,
      comments: 15,
    },
    {
      id: 11,
      title: 'Bumper Stickers',
      description: 'Durable outdoor stickers for a car dealership.',
      image: '/images/service1.jpg',
      category: 'Stickers',
      categoryColor: 'from-yellow-500 to-orange-500',
      tags: ['Bumper', 'Outdoor', 'UV Resistant'],
      client: 'Nyala Motors',
      date: '2024',
      techniques: 'Screen Printing',
      size: '20cm x 5cm',
      views: '1.2k',
      likes: 87,
      comments: 6,
    },
    {
      id: 12,
      title: 'Window Decals',
      description: 'Frosted window decals for office privacy.',
       image: '/images/service1.jpg',
        category: 'Stickers',
      categoryColor: 'from-yellow-500 to-orange-500',
      tags: ['Window', 'Frosted', 'Privacy'],
      client: 'Commercial Bank',
      date: '2023',
      techniques: 'Perforated Vinyl',
      size: '1m x 1.5m',
      views: '1.9k',
      likes: 134,
      comments: 11,
    },

    // Packaging
    {
      id: 13,
      title: 'Custom Boxes',
      description: 'Branded packaging boxes for a cosmetics line.',
       image: '/images/service1.jpg',
      category: 'Packaging',
      categoryColor: 'from-blue-500 to-cyan-500',
      tags: ['Boxes', 'Cosmetics', 'Eco-Friendly'],
      client: 'Habesha Beauty',
      date: '2024',
      techniques: 'Offset Printing',
      size: '15cm x 10cm',
      views: '2.7k',
      likes: 201,
      comments: 19,
    },
    {
      id: 14,
      title: 'Gift Boxes',
      description: 'Luxury gift boxes for a chocolate company.',
       image: '/images/service1.jpg',
      category: 'Packaging',
      categoryColor: 'from-blue-500 to-cyan-500',
      tags: ['Gift', 'Luxury', 'Rigid'],
      client: 'Kokeb Chocolates',
      date: '2023',
      techniques: 'Foil Stamping',
      size: '20cm x 15cm',
      views: '1.8k',
      likes: 156,
      comments: 13,
    },
    {
      id: 15,
      title: 'Food Packaging',
      description: 'Custom printed food packaging for a restaurant chain.',
       image: '/images/service2.jpg',
      category: 'Packaging',
      categoryColor: 'from-blue-500 to-cyan-500',
      tags: ['Food', 'Takeaway', 'Kraft'],
      client: 'Kategna Restaurant',
      date: '2024',
      techniques: 'Flexo',
      size: 'Various',
      views: '2.4k',
      likes: 178,
      comments: 21,
    },

    // Vehicle Wraps
    {
      id: 16,
      title: 'Full Vehicle Wrap',
      description: 'Complete wrap for a delivery van.',
       image: '/images/service2.jpg',
      category: 'Vehicle Wraps',
      categoryColor: 'from-green-500 to-teal-500',
      tags: ['Van', 'Full Wrap', 'Fleet'],
      client: 'Ethio Express',
      date: '2024',
      techniques: 'Cast Vinyl',
      size: 'Full Van',
      views: '3.8k',
      likes: 289,
      comments: 34,
    },
    {
      id: 17,
      title: 'Partial Wrap',
      description: 'Eye-catching partial wrap for a food truck.',
       image: '/images/service2.jpg',
      category: 'Vehicle Wraps',
      categoryColor: 'from-green-500 to-teal-500',
      tags: ['Food Truck', 'Partial Wrap', 'Colorful'],
      client: 'Tasty Bites',
      date: '2023',
      techniques: 'Calendared Vinyl',
      size: 'Partial',
      views: '2.9k',
      likes: 234,
      comments: 27,
    },

    // Corporate
    {
      id: 18,
      title: 'Business Cards',
      description: 'Premium business cards with foil stamping.',
       image: '/images/service2.jpg',
      category: 'Corporate',
      categoryColor: 'from-gray-500 to-gray-700',
      tags: ['Business Cards', 'Foil', 'Premium'],
      client: 'Multiple Clients',
      date: '2024',
      techniques: 'Offset + Foil',
      size: 'Standard',
      views: '2.2k',
      likes: 167,
      comments: 14,
    },
    {
      id: 19,
      title: 'Corporate Brochures',
      description: 'Multi-page brochures for a real estate company.',
       image: '/images/service2.jpg',
      category: 'Corporate',
      categoryColor: 'from-gray-500 to-gray-700',
      tags: ['Brochures', 'Real Estate', 'Marketing'],
      client: 'Sunshine Properties',
      date: '2024',
      techniques: 'Digital Printing',
      size: 'A4',
      views: '1.6k',
      likes: 123,
      comments: 8,
    },
    {
      id: 20,
      title: 'Company Stationery',
      description: 'Complete stationery set for a law firm.',
       image: '/images/service1.jpg',
      category: 'Corporate',
      categoryColor: 'from-gray-500 to-gray-700',
      tags: ['Stationery', 'Letterhead', 'Envelopes'],
      client: 'Deloitte Legal',
      date: '2023',
      techniques: 'Offset',
      size: 'Various',
      views: '1.3k',
      likes: 98,
      comments: 5,
    },
  ];

  // Featured projects
  const featuredItems = [
    galleryItems[0], // DTF T-Shirts
    galleryItems[5], // Storefront Signage
    galleryItems[8], // Product Labels
    galleryItems[15], // Full Vehicle Wrap
  ];

  // Videos
  const videoItems = [
    {
      id: 'v1',
      title: 'Printing Process',
      description: 'Behind the scenes of our DTF printing process',
      video: 'https://example.com/video1.mp4',
      category: 'Process',
      views: '5.2k',
      likes: 423,
    },
    {
      id: 'v2',
      title: 'Vehicle Wrap Installation',
      description: 'Time-lapse of a full vehicle wrap installation',
      video: 'https://example.com/video2.mp4',
      category: 'Installation',
      views: '3.8k',
      likes: 312,
    },
    {
      id: 'v3',
      title: 'Customer Testimonial',
      description: 'Happy client shares their experience',
      video: 'https://example.com/video3.mp4',
      category: 'Testimonials',
      views: '2.1k',
      likes: 189,
    },
  ];

  // Categories for filter
  const categories = ['Apparel', 'Banners', 'Stickers', 'Packaging', 'Vehicle Wraps', 'Corporate'];

  // Stats
  const stats = [
    { icon: <Camera size={24} />, value: '500+', label: 'Projects', color: 'from-red-500 to-orange-500' },
    { icon: <Users size={24} />, value: '200+', label: 'Happy Clients', color: 'from-blue-500 to-cyan-500' },
    { icon: <Award size={24} />, value: '15+', label: 'Awards', color: 'from-yellow-500 to-orange-500' },
    { icon: <Star size={24} />, value: '4.9', label: 'Avg Rating', color: 'from-green-500 to-emerald-500' },
  ];

  // Testimonials
  const testimonials = [
    {
      name: 'Abebe Kebede',
      role: 'Marketing Manager',
      avatar: 'https://i.pravatar.cc/150?img=1',
      rating: 5,
      content: 'The quality of their work is exceptional. Our banners and signage have never looked better.',
      project: 'Trade Show Materials',
    },
    {
      name: 'Tigist Haile',
      role: 'Business Owner',
      avatar: 'https://i.pravatar.cc/150?img=2',
      rating: 5,
      content: 'They helped us create beautiful packaging that really stands out on the shelves.',
      project: 'Product Packaging',
    },
    {
      name: 'Dawit Mekonnen',
      role: 'Event Coordinator',
      avatar: 'https://i.pravatar.cc/150?img=3',
      rating: 5,
      content: 'Fast turnaround and amazing quality. Our event materials were perfect.',
      project: 'Event Branding',
    },
  ];

  // Filtered items
  const filteredItems = activeCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  const handleItemOpen = (item: any) => {
    setCurrentItem(item);
    setCurrentIndex(galleryItems.findIndex(i => i.id === item.id));
    setLightboxOpen(true);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % galleryItems.length;
    setCurrentIndex(nextIndex);
    setCurrentItem(galleryItems[nextIndex]);
  };

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    setCurrentIndex(prevIndex);
    setCurrentItem(galleryItems[prevIndex]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 relative overflow-hidden">
      <FloatingParticles />

      {/* Hero Section */}
      <MotionSection
        ref={heroRef}
        className="relative min-h-[50vh] flex items-center justify-center overflow-hidden"
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/80" />
          <Image
            src="/images/bg-2.jpg"
            alt="Our Gallery"
            fill
            className="object-cover"
            priority
          />
        </div>

        <Container size="lg" className="relative z-10 text-center text-white">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge size="lg" variant="gradient" gradient={{ from: 'red', to: 'orange' }} className="mb-6">
              Our Portfolio
            </Badge>
            
            <Title className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              Creative <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Gallery</span>
            </Title>
            
            <Text size="xl" className="max-w-3xl mx-auto text-gray-200">
              Explore our collection of stunning prints, designs, and projects. 
              See the quality and craftsmanship that sets us apart.
            </Text>
          </MotionDiv>
        </Container>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <motion.div
              className="w-1 h-2 bg-white rounded-full mt-2"
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          </div>
        </motion.div>
      </MotionSection>

      {/* Stats Section */}
      <Container size="lg" className="py-20">
        <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </SimpleGrid>
      </Container>

      {/* Featured Projects */}
      <Container size="lg" className="pb-20">
        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge size="lg" color="red" className="mb-4">Featured Work</Badge>
          <Title order={2} className="text-4xl md:text-5xl font-bold mb-4">
            Featured <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Projects</span>
          </Title>
          <Text size="xl" c="dimmed" className="max-w-2xl mx-auto">
            Take a closer look at some of our most impressive work
          </Text>
        </MotionDiv>

        <Stack gap="xl">
          {featuredItems.map((item, index) => (
            <FeaturedItem key={item.id} item={item} index={index} />
          ))}
        </Stack>
      </Container>

      {/* Gallery Section */}
      <MotionSection className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <Container size="lg">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge size="lg" color="red" className="mb-4">Our Work</Badge>
            <Title order={2} className="text-4xl md:text-5xl font-bold mb-4">
              Project <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Gallery</span>
            </Title>
            <Text size="xl" c="dimmed" className="max-w-2xl mx-auto">
              Browse through our complete collection of projects
            </Text>
          </MotionDiv>

          {/* Category Filter */}
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {filteredItems.map((item, index) => (
              <GalleryItem
                key={item.id}
                item={item}
                index={index}
                onOpen={handleItemOpen}
              />
            ))}
          </div>

          {filteredItems.length === 0 && (
            <Paper p="xl" radius="lg" withBorder className="text-center mt-8">
              <Text size="lg" c="dimmed">No items found in this category.</Text>
              <Button
                variant="subtle"
                color="red"
                onClick={() => setActiveCategory('all')}
                className="mt-4"
              >
                View All Items
              </Button>
            </Paper>
          )}
        </Container>
      </MotionSection>

      {/* Videos Section */}
      <Container size="lg" className="py-20">
        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge size="lg" color="red" className="mb-4">Behind the Scenes</Badge>
          <Title order={2} className="text-4xl md:text-5xl font-bold mb-4">
            Process <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Videos</span>
          </Title>
          <Text size="xl" c="dimmed" className="max-w-2xl mx-auto">
            See our printing process in action
          </Text>
        </MotionDiv>

        <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
          {videoItems.map((item, index) => (
            <VideoItem
              key={item.id}
              item={item}
              index={index}
              onOpen={() => {}}
            />
          ))}
        </SimpleGrid>
      </Container>

      {/* Testimonials Section */}
      <MotionSection className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <Container size="lg">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge size="lg" color="red" className="mb-4">Client Feedback</Badge>
            <Title order={2} className="text-4xl md:text-5xl font-bold mb-4">
              What Our <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Clients Say</span>
            </Title>
            <Text size="xl" c="dimmed" className="max-w-2xl mx-auto">
              Don&apos;t just take our word for it
            </Text>
          </MotionDiv>

          <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} index={index} />
            ))}
          </SimpleGrid>
        </Container>
      </MotionSection>

      {/* CTA Section */}
      <Container size="lg" className="py-20">
        <MotionDiv
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl p-12 text-center text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }} />
          </div>

          <div className="relative z-10">
            <Title order={2} className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Create Something Beautiful?
            </Title>
            
            <Text size="xl" className="mb-8 max-w-2xl mx-auto">
              Let&apos;s bring your vision to life with our expert printing services
            </Text>

            <Group justify="center" gap="md">
              <Button
                size="xl"
                variant="white"
                color="red"
                component={Link}
                href="/contact"
              >
                Start Your Project
              </Button>
              <Button
                size="xl"
                variant="outline"
                color="white"
                component={Link}
                href="/services"
              >
                View Services
              </Button>
            </Group>
          </div>

          {/* Floating Elements */}
          <motion.div
            className="absolute top-10 left-10 w-20 h-20 bg-white/20 rounded-full"
            animate={{
              y: [0, 20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ repeat: Infinity, duration: 3 }}
          />
          <motion.div
            className="absolute bottom-10 right-10 w-32 h-32 bg-white/20 rounded-full"
            animate={{
              y: [0, -20, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ repeat: Infinity, duration: 4 }}
          />
        </MotionDiv>
      </Container>

      {/* Lightbox Modal */}
      {currentItem && (
        <Lightbox
          item={currentItem}
          opened={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          onNext={handleNext}
          onPrev={handlePrev}
          hasNext={currentIndex < galleryItems.length - 1}
          hasPrev={currentIndex > 0}
        />
      )}

      {/* Floating Actions */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        <Tooltip label="Chat with us" position="left">
          <ActionIcon
            size="lg"
            radius="xl"
            variant="filled"
            color="blue"
            className="shadow-lg hover:scale-110 transition-transform"
            component={Link}
            href="/chat"
          >
            <MessageCircle size={20} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Get quote" position="left">
          <ActionIcon
            size="lg"
            radius="xl"
            variant="filled"
            color="green"
            className="shadow-lg hover:scale-110 transition-transform"
            component={Link}
            href="/quote"
          >
            <DollarSign size={20} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Call now" position="left">
          <ActionIcon
            size="lg"
            radius="xl"
            variant="filled"
            color="red"
            className="shadow-lg hover:scale-110 transition-transform"
            component="a"
            href="tel:+251911234567"
          >
            <Phone size={20} />
          </ActionIcon>
        </Tooltip>
      </div>
    </div>
  );
}
