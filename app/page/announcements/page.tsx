/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Container, Title, Text, Button, Grid, Card, Group, ThemeIcon, Badge, SimpleGrid, Stack, Divider, ActionIcon, Tooltip, Paper, Alert, Pagination, Timeline, TextInput, Loader, Center, Skeleton } from '@mantine/core';
import { motion, useScroll, useTransform, useAnimation, useInView } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import {
  Bell,
  Calendar,
  Clock,
  Eye,
  Heart,
  Share2,
  Bookmark,
  Tag,
  Gift,
  Megaphone,
  AlertCircle,
  Info,
  CheckCircle,
  Rocket,
  MessageCircle,
  Phone,
  ChevronRight,
  Filter,
  Search,
  Newspaper,
  Users,
  Facebook,
  Twitter,
  Instagram,
  Send,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import CountUp from 'react-countup';
import { notifications } from '@mantine/notifications';

const MotionDiv = motion.div;
const MotionSection = motion.section;
const MotionCard = motion(Card as any);

// API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Types
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
  image: string | null;
  tags: string[];
  views: number;
  likes: number;
  comments: number;
  is_featured: boolean;
}

interface Stats {
  icon?: string;
  label: string;
  value: number;
  color: string;
}

interface TimelineEvent {
  date: string;
  title: string;
  type: string;
}

// Floating particles animation
const FloatingParticles = () => {
  const [particles] = useState(() => {
    const colors = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];
    
    return [...Array(20)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: 10 + Math.random() * 20,
      delay: Math.random() * 10,
    }));
  });

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
            y: [0, -20, 0, 20, 0],
            x: [0, 20, 0, -20, 0],
            scale: [1, 1.2, 1, 0.8, 1],
            opacity: [0.15, 0.25, 0.15, 0.25, 0.15],
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

// Announcement Card Component
const AnnouncementCard = ({ announcement, index, onLike }: { announcement: Announcement; index: number; onLike: (id: string) => void }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [likeCount, setLikeCount] = useState(announcement.likes);

  const getTypeIcon = (type: string) => {
    switch(type.toLowerCase()) {
      case 'promotion': return <Gift size={24} />;
      case 'event': return <Calendar size={24} />;
      case 'news': return <Newspaper size={24} />;
      case 'offer': return <Tag size={24} />;
      case 'update': return <Bell size={24} />;
      case 'alert': return <AlertCircle size={24} />;
      default: return <Megaphone size={24} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch(type.toLowerCase()) {
      case 'promotion': return 'from-green-500 to-emerald-500';
      case 'event': return 'from-blue-500 to-cyan-500';
      case 'news': return 'from-purple-500 to-pink-500';
      case 'offer': return 'from-orange-500 to-red-500';
      case 'update': return 'from-yellow-500 to-amber-500';
      case 'alert': return 'from-red-500 to-rose-500';
      default: return 'from-gray-500 to-gray-700';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch(priority.toLowerCase()) {
      case 'high': return <Badge color="red" variant="filled">High Priority</Badge>;
      case 'medium': return <Badge color="yellow" variant="filled">Medium Priority</Badge>;
      case 'low': return <Badge color="blue" variant="filled">Low Priority</Badge>;
      default: return null;
    }
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(`${API_URL}/api/announcements/${announcement.id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': localStorage.getItem('sessionId') || Math.random().toString(36).substring(7),
        },
      });
      const data = await response.json();
      if (data.success) {
        setIsLiked(data.liked);
        setLikeCount(prev => data.liked ? prev + 1 : prev - 1);
        if (data.sessionId) {
          localStorage.setItem('sessionId', data.sessionId);
        }
      }
    } catch (error) {
      console.error('Error liking announcement:', error);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: announcement.title,
        text: announcement.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      notifications.show({
        title: 'Link Copied',
        message: 'Announcement link copied to clipboard',
        color: 'blue',
      });
    }
  };

  return (
    <MotionCard
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="relative overflow-hidden group cursor-pointer"
      padding="xl"
      radius="lg"
      withBorder
      onClick={() => setShowDetails(!showDetails)}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getTypeColor(announcement.type)} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

      {/* Priority Badge */}
      <div className="absolute top-4 right-4">
        {getPriorityBadge(announcement.priority)}
      </div>

      <Grid>
        {/* Image Section */}
        {announcement.image && (
          <Grid.Col span={{ base: 12, md: 4 }}>
            <div className="relative h-48 md:h-64 rounded-lg overflow-hidden">
              <Image
                src={announcement.image}
                alt={announcement.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              
              {/* Type Badge */}
              <Badge
                size="lg"
                variant="gradient"
                gradient={{ from: getTypeColor(announcement.type).split(' ')[0].replace('from-', ''), to: getTypeColor(announcement.type).split(' ')[1].replace('to-', '') }}
                className="absolute top-4 left-4"
              >
                {announcement.type}
              </Badge>
            </div>
          </Grid.Col>
        )}

        {/* Content Section */}
        <Grid.Col span={{ base: 12, md: announcement.image ? 8 : 12 }}>
          <Stack gap="md">
            {/* Header */}
            <Group justify="space-between">
              <Group>
                <ThemeIcon
                  size={50}
                  radius="xl"
                  variant="gradient"
                  gradient={{ from: getTypeColor(announcement.type).split(' ')[0].replace('from-', ''), to: getTypeColor(announcement.type).split(' ')[1].replace('to-', '') }}
                >
                  {getTypeIcon(announcement.type)}
                </ThemeIcon>
                <div>
                  <Title order={3} className="mb-1">{announcement.title}</Title>
                  <Group gap="xs">
                    <Text size="sm" c="dimmed">{new Date(announcement.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</Text>
                    <Text size="sm" c="dimmed">•</Text>
                    <Text size="sm" c="dimmed">{announcement.read_time} min read</Text>
                  </Group>
                </div>
              </Group>
            </Group>

            {/* Description */}
            <Text size="lg" className="text-gray-700 dark:text-gray-300">
              {announcement.description}
            </Text>

            {/* Tags */}
            {announcement.tags && announcement.tags.length > 0 && (
              <Group gap="xs">
                {announcement.tags.map((tag: string, i: number) => (
                  <Badge key={i} variant="light" color="gray" size="sm">
                    #{tag}
                  </Badge>
                ))}
              </Group>
            )}

            {/* Stats */}
            <Group gap="lg">
              <Group gap={4}>
                <Eye size={16} className="text-gray-500" />
                <Text size="sm" c="dimmed">{announcement.views} views</Text>
              </Group>
              <Group gap={4}>
                <Heart size={16} className="text-gray-500" />
                <Text size="sm" c="dimmed">{likeCount} likes</Text>
              </Group>
              <Group gap={4}>
                <MessageCircle size={16} className="text-gray-500" />
                <Text size="sm" c="dimmed">{announcement.comments} comments</Text>
              </Group>
            </Group>

            {/* Action Buttons */}
            <Group gap="xs">
              <Button
                variant="light"
                color="red"
                size="sm"
                leftSection={<Bookmark size={16} />}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSaved(!isSaved);
                }}
              >
                {isSaved ? 'Saved' : 'Save'}
              </Button>
              <Button
                variant="light"
                color="pink"
                size="sm"
                leftSection={<Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />}
                onClick={handleLike}
              >
                {isLiked ? 'Liked' : 'Like'}
              </Button>
              <Button
                variant="light"
                color="blue"
                size="sm"
                leftSection={<Share2 size={16} />}
                onClick={handleShare}
              >
                Share
              </Button>
              <Button
                variant="subtle"
                color="gray"
                size="sm"
                rightSection={<ChevronRight size={16} className={`transform transition-transform ${showDetails ? 'rotate-90' : ''}`} />}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetails(!showDetails);
                }}
              >
                {showDetails ? 'Show Less' : 'Read More'}
              </Button>
            </Group>

            {/* Detailed Content */}
            {showDetails && (
              <MotionDiv
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <Divider my="md" />
                
                <Stack gap="md">
                  <Text>{announcement.detailed_content}</Text>

                  {announcement.bullet_points && announcement.bullet_points.length > 0 && (
                    <ul className="list-disc list-inside space-y-2">
                      {announcement.bullet_points.map((point: string, i: number) => (
                        <li key={i} className="text-gray-700 dark:text-gray-300">{point}</li>
                      ))}
                    </ul>
                  )}

                  {announcement.cta && (
                    <Button
                      variant="gradient"
                      gradient={{ from: 'red', to: 'orange' }}
                      component={Link}
                      href={announcement.cta_link || '#'}
                      className="mt-2"
                    >
                      {announcement.cta}
                    </Button>
                  )}
                </Stack>
              </MotionDiv>
            )}
          </Stack>
        </Grid.Col>
      </Grid>
    </MotionCard>
  );
};

// Featured Announcement Component
const FeaturedAnnouncement = ({ announcement }: { announcement: Announcement | null }) => {
  if (!announcement) return null;

  return (
    <MotionCard
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="relative overflow-hidden"
      padding={0}
      radius="lg"
      withBorder
    >
      <div className="relative h-[400px] w-full">
        <Image
          src={announcement.image || '/images/placeholder.jpg'}
          alt={announcement.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
        
        {/* Featured Badge */}
        <Badge
          size="xl"
          variant="gradient"
          gradient={{ from: 'red', to: 'orange' }}
          className="absolute top-6 left-6 z-10"
        >
          ⭐ Featured Announcement
        </Badge>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-10">
          <Group gap="xs" className="mb-4">
            <Calendar size={18} />
            <Text size="sm">{new Date(announcement.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</Text>
            <Text size="sm">•</Text>
            <Clock size={18} />
            <Text size="sm">{announcement.read_time} min read</Text>
          </Group>

          <Title order={2} className="text-3xl md:text-4xl font-bold mb-4">
            {announcement.title}
          </Title>

          <Text size="lg" className="mb-6 max-w-3xl text-gray-200">
            {announcement.description}
          </Text>

          <Group>
            <Button
              size="lg"
              variant="gradient"
              gradient={{ from: 'red', to: 'orange' }}
              component={Link}
              href={`/announcements/${announcement.id}`}
            >
              Learn More
            </Button>
            <Button
              size="lg"
              variant="outline"
              color="white"
            >
              Share
            </Button>
          </Group>
        </div>
      </div>
    </MotionCard>
  );
};

// Category Filter Component
const CategoryFilter = ({ categories, activeCategory, setActiveCategory, onSearch }: { 
  categories: string[]; 
  activeCategory: string; 
  setActiveCategory: (category: string) => void;
  onSearch: (query: string) => void;
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <Paper p="md" radius="lg" withBorder className="sticky top-20 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
      <Group justify="space-between">
        <Group gap="xs">
          <Filter size={20} />
          <Text fw={600}>Filter by:</Text>
        </Group>
        
        <Group gap="xs" wrap="wrap">
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

        <Group gap="xs">
          <TextInput
            placeholder="Search announcements..."
            leftSection={<Search size={16} />}
            size="sm"
            className="w-64"
            value={searchQuery}
            onChange={handleSearch}
            rightSection={searchQuery ? <X size={16} className="cursor-pointer" onClick={() => {
              setSearchQuery('');
              onSearch('');
            }} /> : null}
          />
        </Group>
      </Group>
    </Paper>
  );
};

// Newsletter Subscription Component
const NewsletterSubscribe = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/announcements/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (data.success) {
        setSubscribed(true);
        setEmail('');
        setTimeout(() => setSubscribed(false), 3000);
        notifications.show({
          title: 'Success!',
          message: data.message,
          color: 'green',
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to subscribe',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      padding="xl"
      radius="lg"
      withBorder
      className="bg-gradient-to-br from-red-600 to-orange-600 text-white"
    >
      <Stack align="center" gap="md">
        <ThemeIcon size={60} radius="xl" variant="white" className="text-red-600">
          <Bell size={30} />
        </ThemeIcon>

        <Title order={3} className="text-center">Stay Updated</Title>
        
        <Text ta="center" className="text-white/90">
          Subscribe to our newsletter and never miss an announcement
        </Text>

        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <Group gap="xs">
            <TextInput
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              size="lg"
              className="flex-1"
              styles={{
                input: {
                  backgroundColor: 'white',
                  border: 'none',
                  color: 'black',
                },
              }}
            />
            <Button
              type="submit"
              size="lg"
              variant="white"
              color="red"
              loading={loading}
            >
              Subscribe
            </Button>
          </Group>
        </form>

        {subscribed && (
          <Alert icon={<CheckCircle size={16} />} color="green" className="mt-4">
            Successfully subscribed!
          </Alert>
        )}
      </Stack>
    </MotionCard>
  );
};

// Announcement Stats Component
const AnnouncementStats = ({ stats }: { stats: Stats[] }) => {
  const getIcon = (iconName?: string) => {
    switch(iconName) {
      case 'Bell': return <Bell size={24} />;
      case 'Gift': return <Gift size={24} />;
      case 'Calendar': return <Calendar size={24} />;
      case 'Users': return <Users size={24} />;
      default: return <Bell size={24} />;
    }
  };

  return (
    <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
      {stats.map((stat, index) => (
        <MotionCard
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
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
            gradient={{ from: stat.color.split(' ')[0].replace('from-', ''), to: stat.color.split(' ')[1].replace('to-', '') }}
            className="mx-auto mb-3"
          >
            {getIcon(stat.icon)}
          </ThemeIcon>
          <Title order={3} className="text-2xl font-bold">
            <CountUp end={stat.value} duration={2} />
          </Title>
          <Text size="sm" c="dimmed">{stat.label}</Text>
        </MotionCard>
      ))}
    </SimpleGrid>
  );
};

// Timeline Component
const AnnouncementTimeline = ({ events }: { events: TimelineEvent[] }) => {
  return (
    <MotionCard
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      padding="xl"
      radius="lg"
      withBorder
    >
      <Title order={3} className="mb-6">Announcement Timeline</Title>
      
      <Timeline active={events.length - 1} bulletSize={24} lineWidth={2}>
        {events.map((event, index) => (
          <Timeline.Item
            key={index}
            title={event.title}
            bullet={
              <ThemeIcon
                size={24}
                radius="xl"
                color={
                  event.type === 'launch' ? 'green' :
                  event.type === 'sale' ? 'orange' :
                  event.type === 'info' ? 'blue' :
                  event.type === 'update' ? 'purple' :
                  'red'
                }
                variant="filled"
              >
                {event.type === 'launch' ? <Rocket size={14} /> :
                 event.type === 'sale' ? <Tag size={14} /> :
                 event.type === 'info' ? <Info size={14} /> :
                 event.type === 'update' ? <Bell size={14} /> :
                 <Calendar size={14} />}
              </ThemeIcon>
            }
          >
            <Text c="dimmed" size="sm">{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Text>
          </Timeline.Item>
        ))}
      </Timeline>
    </MotionCard>
  );
};

export default function AnnouncementsPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [stats, setStats] = useState<Stats[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [timelineLoading, setTimelineLoading] = useState(true);

  const [activeCategory, setActiveCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsPerPage] = useState(5);

  // Fetch announcements
  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: itemsPerPage.toString(),
          ...(activeCategory !== 'all' && { type: activeCategory.toLowerCase() }),
          ...(searchQuery && { search: searchQuery }),
        });

        const response = await fetch(`${API_URL}/api/announcements?${params}`);
        const data = await response.json();
        
        if (data.success) {
          setAnnouncements(data.data.announcements);
          setTotalPages(data.data.pagination.pages);
        }
      } catch (error) {
        console.error('Failed to fetch announcements:', error);
        notifications.show({
          title: 'Error',
          message: 'Failed to load announcements',
          color: 'red',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [activeCategory, currentPage, searchQuery, itemsPerPage]);

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/announcements/stats`);
        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Fetch timeline
  useEffect(() => {
    const fetchTimeline = async () => {
      setTimelineLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/announcements/timeline`);
        const data = await response.json();
        if (data.success) {
          setTimelineEvents(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch timeline:', error);
      } finally {
        setTimelineLoading(false);
      }
    };

    fetchTimeline();
  }, []);

  // Fetch types for filter
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await fetch(`${API_URL}/api/announcements/types`);
        const data = await response.json();
        if (data.success) {
          setTypes(data.data.map((t: any) => t.type));
        }
      } catch (error) {
        console.error('Failed to fetch types:', error);
      }
    };

    fetchTypes();
  }, []);

  const handleLike = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/api/announcements/${id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': localStorage.getItem('sessionId') || Math.random().toString(36).substring(7),
        },
      });
      const data = await response.json();
      if (data.success && data.sessionId) {
        localStorage.setItem('sessionId', data.sessionId);
      }
    } catch (error) {
      console.error('Error liking announcement:', error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const featuredAnnouncement = announcements.find(a => a.is_featured) || announcements[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 relative overflow-hidden">
      <FloatingParticles />

      {/* Hero Section */}
      <MotionSection
        ref={heroRef}
        className="relative min-h-[40vh] flex items-center justify-center overflow-hidden"
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/80 z-10" />
          <div className="relative w-full h-full">
            <Image
              src="/images/bg-2.jpg"
              alt="Announcements"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        <Container size="lg" className="relative z-20 text-center text-white">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge size="lg" variant="gradient" gradient={{ from: 'red', to: 'orange' }} className="mb-6">
              Stay Informed
            </Badge>
            
            <Title className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              Announcements & <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Updates</span>
            </Title>
            
            <Text size="xl" className="max-w-3xl mx-auto text-gray-200">
              Stay up to date with the latest news, promotions, and events from Lucia Printing.
              Never miss an important update!
            </Text>
          </MotionDiv>
        </Container>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer z-20"
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
      <Container size="lg" className="py-12">
        {statsLoading ? (
          <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} height={120} radius="lg" />
            ))}
          </SimpleGrid>
        ) : (
          <AnnouncementStats stats={stats} />
        )}
      </Container>

      {/* Featured Announcement */}
      {!loading && featuredAnnouncement && (
        <Container size="lg" className="pb-12">
          <FeaturedAnnouncement announcement={featuredAnnouncement} />
        </Container>
      )}

      {/* Main Content */}
      <Container size="lg" className="pb-20">
        <Grid gutter="xl">
          {/* Left Column - Announcements List */}
          <Grid.Col span={{ base: 12, lg: 8 }}>
            <Stack gap="xl">
              {/* Category Filter */}
              <CategoryFilter
                categories={['Promotion', 'Event', 'News', 'Offer', 'Update', 'Alert']}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                onSearch={handleSearch}
              />

              {/* Announcements List */}
              {loading ? (
                <Stack gap="md">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} height={300} radius="lg" />
                  ))}
                </Stack>
              ) : announcements.length === 0 ? (
                <Paper p="xl" radius="lg" withBorder>
                  <Center>
                    <Stack align="center">
                      <Bell size={48} className="text-gray-400" />
                      <Text size="lg" c="dimmed">No announcements found</Text>
                      <Button
                        variant="light"
                        color="red"
                        onClick={() => {
                          setActiveCategory('all');
                          setSearchQuery('');
                          setCurrentPage(1);
                        }}
                      >
                        Clear Filters
                      </Button>
                    </Stack>
                  </Center>
                </Paper>
              ) : (
                <Stack gap="md">
                  {announcements.map((announcement, index) => (
                    <AnnouncementCard 
                      key={announcement.id} 
                      announcement={announcement} 
                      index={index}
                      onLike={handleLike}
                    />
                  ))}
                </Stack>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <Group justify="center" mt="xl">
                  <Pagination
                    total={totalPages}
                    value={currentPage}
                    onChange={setCurrentPage}
                    color="red"
                    size="lg"
                    radius="xl"
                    withEdges
                  />
                </Group>
              )}
            </Stack>
          </Grid.Col>

          {/* Right Column - Sidebar */}
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <Stack gap="lg">
              {/* Newsletter Subscription */}
              <NewsletterSubscribe />

              {/* Timeline */}
              {timelineLoading ? (
                <Skeleton height={300} radius="lg" />
              ) : (
                <AnnouncementTimeline events={timelineEvents} />
              )}

              {/* Quick Links */}
              <MotionCard
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                padding="xl"
                radius="lg"
                withBorder
              >
                <Title order={4} className="mb-4">Quick Links</Title>
                <Stack gap="xs">
                  <Button
                    variant="light"
                    color="red"
                    fullWidth
                    justify="space-between"
                    rightSection={<ChevronRight size={16} />}
                    component={Link}
                    href="/promotions"
                  >
                    Current Promotions
                  </Button>
                  <Button
                    variant="light"
                    color="blue"
                    fullWidth
                    justify="space-between"
                    rightSection={<ChevronRight size={16} />}
                    component={Link}
                    href="/events"
                  >
                    Upcoming Events
                  </Button>
                  <Button
                    variant="light"
                    color="green"
                    fullWidth
                    justify="space-between"
                    rightSection={<ChevronRight size={16} />}
                    component={Link}
                    href="/archive"
                  >
                    Announcement Archive
                  </Button>
                </Stack>
              </MotionCard>

              {/* Tags Cloud */}
              <MotionCard
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                padding="xl"
                radius="lg"
                withBorder
              >
                <Title order={4} className="mb-4">Popular Tags</Title>
                <Group gap="xs">
                  {['DTF', 'Sale', 'NewService', 'Event', 'Holiday', 'Update', 'Eco', 'Workshop', 'Expansion'].map((tag) => (
                    <Badge
                      key={tag}
                      variant="light"
                      color="red"
                      size="lg"
                      className="cursor-pointer hover:bg-red-100 transition-colors"
                      onClick={() => handleSearch(tag)}
                    >
                      #{tag}
                    </Badge>
                  ))}
                </Group>
              </MotionCard>
            </Stack>
          </Grid.Col>
        </Grid>
      </Container>

      {/* CTA Section */}
      <Container size="lg" className="py-12">
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
              Never Miss an Update!
            </Title>
            
            <Text size="xl" className="mb-8 max-w-2xl mx-auto">
              Follow us on social media for real-time updates and exclusive content
            </Text>

            <Group justify="center" gap="md">
              <Button
                size="xl"
                variant="white"
                color="red"
                component="a"
                href="https://facebook.com"
                target="_blank"
                leftSection={<Facebook size={20} />}
              >
                Facebook
              </Button>
              <Button
                size="xl"
                variant="white"
                color="red"
                component="a"
                href="https://twitter.com"
                target="_blank"
                leftSection={<Twitter size={20} />}
              >
                Twitter
              </Button>
              <Button
                size="xl"
                variant="white"
                color="red"
                component="a"
                href="https://instagram.com"
                target="_blank"
                leftSection={<Instagram size={20} />}
              >
                Instagram
              </Button>
              <Button
                size="xl"
                variant="white"
                color="red"
                component="a"
                href="https://t.me"
                target="_blank"
                leftSection={<Send size={20} />}
              >
                Telegram
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

      {/* Floating Actions */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        <Tooltip label="Subscribe" position="left">
          <ActionIcon
            size="lg"
            radius="xl"
            variant="filled"
            color="red"
            className="shadow-lg hover:scale-110 transition-transform"
            component="a"
            href="#newsletter"
          >
            <Bell size={20} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Contact" position="left">
          <ActionIcon
            size="lg"
            radius="xl"
            variant="filled"
            color="blue"
            className="shadow-lg hover:scale-110 transition-transform"
            component={Link}
            href="/contact"
          >
            <MessageCircle size={20} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Call now" position="left">
          <ActionIcon
            size="lg"
            radius="xl"
            variant="filled"
            color="green"
            className="shadow-lg hover:scale-110 transition-transform"
            component="a"
            href="tel:+251911234567"
          >
            <Phone size={20} />
          </ActionIcon>
        </Tooltip>
      </div>

      <style jsx>{`
        .triangle-shape {
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
        }
      `}</style>
    </div>
  );
}