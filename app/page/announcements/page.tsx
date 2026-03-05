/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Container, Title, Text, Button, Grid, Card, Group, ThemeIcon, Badge, SimpleGrid, Stack, Divider, ActionIcon, Tooltip, Paper, Alert, Pagination, Timeline, TextInput } from '@mantine/core';
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
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import CountUp from 'react-countup';

const MotionDiv = motion.div;
const MotionSection = motion.section;
const MotionCard = motion(Card as any );
// const MotionContainer = motion(Container);
// const MotionTitle = motion(Title);
// const MotionText = motion(Text as any);
// const MotionButton = motion(Button as any );


// Floating particles animation - FIXED VERSION
const FloatingParticles = () => {
  // Generate particles directly in useState initializer
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

  // No need for mounted check - if particles array is empty (it won't be), render nothing
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
const AnnouncementCard = ({ announcement, index }: { announcement: any; index: number }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const getTypeIcon = (type: string) => {
    switch(type) {
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
    switch(type) {
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
    switch(priority) {
      case 'high': return <Badge color="red" variant="filled">High Priority</Badge>;
      case 'medium': return <Badge color="yellow" variant="filled">Medium Priority</Badge>;
      case 'low': return <Badge color="blue" variant="filled">Low Priority</Badge>;
      default: return null;
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
                    <Text size="sm" c="dimmed">{announcement.date}</Text>
                    <Text size="sm" c="dimmed">•</Text>
                    <Text size="sm" c="dimmed">{announcement.readTime} min read</Text>
                  </Group>
                </div>
              </Group>
            </Group>

            {/* Description */}
            <Text size="lg" className="text-gray-700 dark:text-gray-300">
              {announcement.description}
            </Text>

            {/* Tags */}
            <Group gap="xs">
              {announcement.tags.map((tag: string, i: number) => (
                <Badge key={i} variant="light" color="gray" size="sm">
                  #{tag}
                </Badge>
              ))}
            </Group>

            {/* Stats */}
            <Group gap="lg">
              <Group gap={4}>
                <Eye size={16} className="text-gray-500" />
                <Text size="sm" c="dimmed">{announcement.views} views</Text>
              </Group>
              <Group gap={4}>
                <Heart size={16} className="text-gray-500" />
                <Text size="sm" c="dimmed">{announcement.likes} likes</Text>
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
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLiked(!isLiked);
                }}
              >
                {isLiked ? 'Liked' : 'Like'}
              </Button>
              <Button
                variant="light"
                color="blue"
                size="sm"
                leftSection={<Share2 size={16} />}
                onClick={(e) => e.stopPropagation()}
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
                  <Text>{announcement.detailedContent}</Text>

                  {announcement.bulletPoints && (
                    <ul className="list-disc list-inside space-y-2">
                      {announcement.bulletPoints.map((point: string, i: number) => (
                        <li key={i} className="text-gray-700 dark:text-gray-300">{point}</li>
                      ))}
                    </ul>
                  )}

                  {announcement.cta && (
                    <Button
                      variant="gradient"
                      gradient={{ from: 'red', to: 'orange' }}
                      component={Link}
                      href={announcement.ctaLink}
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
const FeaturedAnnouncement = ({ announcement }: { announcement: any }) => {
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
    src={announcement.image}
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
            <Text size="sm">{announcement.date}</Text>
            <Text size="sm">•</Text>
            <Clock size={18} />
            <Text size="sm">{announcement.readTime} min read</Text>
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
              href={announcement.link || '#'}
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
const CategoryFilter = ({ categories, activeCategory, setActiveCategory }: { categories: string[]; activeCategory: string; setActiveCategory: (category: string) => void }) => {
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
          />
        </Group>
      </Group>
    </Paper>
  );
};

// Newsletter Subscription Component
const NewsletterSubscribe = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail('');
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
const AnnouncementStats = () => {
  const stats = [
    { icon: <Bell size={24} />, value: 156, label: 'Total Announcements', color: 'from-blue-500 to-cyan-500' },
    { icon: <Gift size={24} />, value: 45, label: 'Active Offers', color: 'from-green-500 to-emerald-500' },
    { icon: <Calendar size={24} />, value: 12, label: 'Upcoming Events', color: 'from-purple-500 to-pink-500' },
    { icon: <Users size={24} />, value: 2500, label: 'Subscribers', color: 'from-orange-500 to-red-500' },
  ];

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
            {stat.icon}
          </ThemeIcon>
          <Title order={3} className="text-2xl font-bold">
            {typeof stat.value === 'number' ? <CountUp end={stat.value} duration={2} /> : stat.value}
          </Title>
          <Text size="sm" c="dimmed">{stat.label}</Text>
        </MotionCard>
      ))}
    </SimpleGrid>
  );
};

// Timeline Component
const AnnouncementTimeline = () => {
  const events = [
    { date: '2024-03-15', title: 'New DTF Printing Service Launch', type: 'launch' },
    { date: '2024-03-10', title: 'Spring Sale - 20% Off', type: 'sale' },
    { date: '2024-03-05', title: 'Holiday Hours Announcement', type: 'info' },
    { date: '2024-02-28', title: 'New Website Feature', type: 'update' },
    { date: '2024-02-20', title: 'Customer Appreciation Day', type: 'event' },
  ];

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
            <Text c="dimmed" size="sm">{event.date}</Text>
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

  const [activeCategory, setActiveCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showSearch, setShowSearch] = useState(false);

  const categories = ['Promotion', 'Event', 'News', 'Offer', 'Update', 'Alert'];

  // Announcements data
  const announcements = [
    {
      id: 1,
      title: '🎉 Grand Opening: New DTF Printing Service',
      description: 'We are excited to announce the launch of our new DTF (Direct to Film) printing service. Get vibrant, durable prints on any fabric!',
      detailedContent: 'Direct to Film (DTF) printing is revolutionizing the apparel industry. Unlike traditional methods, DTF allows for printing on any fabric type with exceptional vibrancy and durability. Our new service includes:',
      bulletPoints: [
        'Print on cotton, polyester, blends, and more',
        'No minimum order quantity',
        '24-hour turnaround available',
        'Free design consultation',
        'Bulk discounts for orders over 50 pieces'
      ],
      cta: 'Get Started Today',
      ctaLink: '/services/dtf',
      date: 'March 15, 2024',
      readTime: 3,
      type: 'promotion',
      priority: 'high',
      image: '/images/service1.jpg',
      tags: ['DTF', 'NewService', 'Printing'],
      views: 1245,
      likes: 89,
      comments: 23,
    },
    {
      id: 2,
      title: '🎪 Spring Sale Extravaganza - 20% Off Everything!',
      description: 'Spring has sprung and we\'re celebrating with our biggest sale of the year! Enjoy 20% off all printing services for a limited time.',
      detailedContent: 'Our Spring Sale runs from March 20th to April 15th. This is the perfect time to stock up on all your printing needs. Whether you need custom t-shirts for your team, banners for an event, or business cards for your company, now is the time to order!',
      bulletPoints: [
        '20% off all printing services',
        'Free shipping on orders over $100',
        'Buy 5 t-shirts, get 1 free',
        'Free design consultation with every order',
        'Extended hours for in-person consultations'
      ],
      cta: 'Shop Now',
      ctaLink: '/services',
      date: 'March 10, 2024',
      readTime: 2,
      type: 'offer',
      priority: 'high',
      image: '/images/service1.jpg',
      tags: ['Sale', 'Discount', 'Spring'],
      views: 2341,
      likes: 156,
      comments: 34,
    },
    {
      id: 3,
      title: '⏰ Holiday Hours: Easter Weekend',
      description: 'Please note our modified hours during the Easter holiday weekend. Plan your visits and orders accordingly.',
      detailedContent: 'Our offices will be operating on modified hours during the Easter weekend. Here\'s our schedule:',
      bulletPoints: [
        'Good Friday (March 29): 9:00 AM - 2:00 PM',
        'Holy Saturday (March 30): CLOSED',
        'Easter Sunday (March 31): CLOSED',
        'Easter Monday (April 1): 10:00 AM - 4:00 PM',
        'Regular hours resume Tuesday, April 2'
      ],
      cta: 'View Full Schedule',
      ctaLink: '/contact',
      date: 'March 5, 2024',
      readTime: 1,
      type: 'alert',
      priority: 'medium',
      image: '/images/service1.jpg',
      tags: ['Holiday', 'Hours', 'Easter'],
      views: 876,
      likes: 45,
      comments: 12,
    },
    {
      id: 4,
      title: '🏆 Customer Appreciation Day - March 25th',
      description: 'Join us for a day of celebration, refreshments, and exclusive discounts as we thank our amazing customers!',
      detailedContent: 'We\'re throwing a party and you\'re invited! Come celebrate with us at our Addis Ababa location for a day of fun, food, and fantastic deals.',
      bulletPoints: [
        'Free refreshments and snacks',
        'Live printing demonstrations',
        'Exclusive one-day-only discounts',
        'Meet our design team',
        'Raffle prizes including free printing packages'
      ],
      cta: 'RSVP Now',
      ctaLink: '/events/customer-appreciation',
      date: 'February 28, 2024',
      readTime: 2,
      type: 'event',
      priority: 'medium',
      image: '/images/service1.jpg',
      tags: ['Event', 'Customer', 'Appreciation'],
      views: 654,
      likes: 78,
      comments: 15,
    },
    {
      id: 5,
      title: '✨ New Website Features: Real-Time Order Tracking',
      description: 'We\'ve enhanced our website with new features including real-time order tracking, instant chat support, and a faster upload system.',
      detailedContent: 'We\'re constantly working to improve your experience. Our latest updates include:',
      bulletPoints: [
        'Real-time order tracking - know exactly where your order is at any time',
        'Instant chat support - get answers immediately',
        'Faster file upload system - upload large files in seconds',
        'New design preview tool - see your design before printing',
        'Mobile app coming soon!'
      ],
      cta: 'Try It Now',
      ctaLink: '/features',
      date: 'February 20, 2024',
      readTime: 2,
      type: 'update',
      priority: 'low',
      image: '/images/service1.jpg',
      tags: ['Website', 'Update', 'Features'],
      views: 543,
      likes: 67,
      comments: 8,
    },
    {
      id: 6,
      title: '🎨 Free Design Workshop: March 30th',
      description: 'Learn the basics of design for print in our free workshop. Perfect for small business owners and marketing professionals.',
      detailedContent: 'Join our lead designer for a 2-hour workshop covering essential design principles for print materials. You\'ll learn:',
      bulletPoints: [
        'Understanding resolution and DPI',
        'Color modes: RGB vs CMYK',
        'File formats and when to use them',
        'Designing for different materials',
        'Common mistakes to avoid'
      ],
      cta: 'Reserve Your Spot',
      ctaLink: '/workshops',
      date: 'February 15, 2024',
      readTime: 2,
      type: 'event',
      priority: 'low',
      image: '/images/service1.jpg',
      tags: ['Workshop', 'Design', 'Free'],
      views: 432,
      likes: 56,
      comments: 9,
    },
    {
      id: 7,
      title: '🌿 Eco-Friendly Printing Initiative',
      description: 'We\'re proud to announce our new eco-friendly printing options, using sustainable materials and environmentally conscious processes.',
      detailedContent: 'As part of our commitment to sustainability, we\'re introducing new eco-friendly options for all our services.',
      bulletPoints: [
        'Recycled paper options for all print jobs',
        'Soy-based inks available',
        'Carbon-neutral shipping',
        'Eco-friendly packaging materials',
        'Tree planted for every order over $100'
      ],
      cta: 'Learn More',
      ctaLink: '/eco-friendly',
      date: 'February 10, 2024',
      readTime: 2,
      type: 'news',
      priority: 'medium',
      image: '/images/service1.jpg',
      tags: ['Eco', 'Sustainability', 'Green'],
      views: 789,
      likes: 98,
      comments: 14,
    },
    {
      id: 8,
      title: '🚀 New Location Opening in Adama',
      description: 'We\'re expanding! Our new branch in Adama opens April 1st, bringing our quality printing services closer to you.',
      detailedContent: 'We\'re thrilled to announce the opening of our second location in Adama. This expansion allows us to serve our customers in the Oromia region more effectively.',
      bulletPoints: [
        'Convenient location in downtown Adama',
        'Same great services and quality',
        'Local team ready to help',
        'Grand opening specials available',
        'Free consultations throughout April'
      ],
      cta: 'Get Directions',
      ctaLink: '/locations/adama',
      date: 'February 5, 2024',
      readTime: 2,
      type: 'news',
      priority: 'high',
      image: '/images/service1.jpg',
      tags: ['Expansion', 'NewLocation', 'Adama'],
      views: 1023,
      likes: 134,
      comments: 21,
    },
  ];

  // Filtered announcements
  const filteredAnnouncements = activeCategory === 'all' 
    ? announcements 
    : announcements.filter(a => a.type.toLowerCase() === activeCategory.toLowerCase());

  // Featured announcement (first one)
  const featuredAnnouncement = announcements[0];

  // Pagination
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredAnnouncements.length / itemsPerPage);
  const paginatedAnnouncements = filteredAnnouncements.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 relative overflow-hidden">
      <FloatingParticles />

      {/* Hero Section */}
      <MotionSection
        ref={heroRef}
        className="relative min-h-[40vh] flex items-center justify-center overflow-hidden"
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
      >
        {/* Background Image Container - FIXED */}
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
        <AnnouncementStats />
      </Container>

      {/* Featured Announcement */}
      <Container size="lg" className="pb-12">
        <FeaturedAnnouncement announcement={featuredAnnouncement} />
      </Container>

      {/* Main Content */}
      <Container size="lg" className="pb-20">
        <Grid gutter="xl">
          {/* Left Column - Announcements List */}
          <Grid.Col span={{ base: 12, lg: 8 }}>
            <Stack gap="xl">
              {/* Category Filter */}
              <CategoryFilter
                categories={categories}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
              />

              {/* Announcements List */}
              <Stack gap="md">
                {paginatedAnnouncements.map((announcement, index) => (
                  <AnnouncementCard key={announcement.id} announcement={announcement} index={index} />
                ))}
              </Stack>

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
              <AnnouncementTimeline />

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
                  <Button
                    variant="light"
                    color="purple"
                    fullWidth
                    justify="space-between"
                    rightSection={<ChevronRight size={16} />}
                    component={Link}
                    href="/rss"
                  >
                    RSS Feed
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
                component={Link}
                href="https://facebook.com/luciaprinting"
                leftSection={<Facebook size={20} />}
              >
                Facebook
              </Button>
              <Button
                size="xl"
                variant="white"
                color="red"
                component={Link}
                href="https://twitter.com/luciaprinting"
                leftSection={<Twitter size={20} />}
              >
                Twitter
              </Button>
              <Button
                size="xl"
                variant="white"
                color="red"
                component={Link}
                href="https://instagram.com/luciaprinting"
                leftSection={<Instagram size={20} />}
              >
                Instagram
              </Button>
              <Button
                size="xl"
                variant="white"
                color="red"
                component={Link}
                href="https://t.me/luciaprinting"
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
            component={Link}
            href="#subscribe"
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