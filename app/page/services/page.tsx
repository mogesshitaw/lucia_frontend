/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Container, Title, Text, Button, Grid, Card, Group, ThemeIcon, Badge, SimpleGrid, Stack, Divider, ActionIcon, Tooltip, Tabs, Paper, Modal } from '@mantine/core';
import { motion, useScroll, useTransform, useAnimation, useInView } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import {
  // Core business icons
  Megaphone,
  Upload,
  MessageCircle,
  Award,
  Truck,
  Headphones,
  DollarSign,
  Sparkles,
  Shield,
  Clock,
  Users,
  Star,
  Heart,
  Zap,
  CheckCircle,
  
  // Navigation & actions
  ChevronRight,
  ArrowRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronDown,
  
  // Social & contact
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  
  // Printing & design
  Printer,
  Palette,
  Scissors,
  Ruler,
  Camera,
  PenTool,
  Eye,
  Layers,
  
  // Technology
  Smartphone,
  Monitor,
  Cpu,
  Globe,
  TrendingUp,
  
  // Packaging & products
  Box,
  Package,
  Gift,
  Coffee,
  FileText,
  
  // UI elements
  Quote,
  ThumbsUp,
  Share2,
  Bookmark,
  Bell,
  Settings,
  RefreshCw,
  
  // Nature & effects
  Wind,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Droplets,
  Flame,
  Leaf,
  TreePine,
  Flower,
  
  // Animals (for kids products)
  Bird,
  Fish,
  Cat,
  Dog,
  Rabbit,
  Turtle,

  
  // Service category icons
  Shirt,
  Tag,
  Car,
  Pen,
  Key,
  
  // Alternative for Bag - use ShoppingBag or Package
  ShoppingBag, // Add this instead of Bag
  
  // For Image component conflict
  Image as LucideImage,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Types
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
}

const MotionDiv = motion.div;
const MotionSection = motion.section;
const MotionCard = motion(Card as any );

// Custom hook for scroll animations


// Floating particles animation
const FloatingParticles = () => {
  // Generate particles directly in useState initializer
  const [particles] = useState<Particle[]>(() => {
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
// Service Card Component
const ServiceCard = ({ service, index }: { service: any; index: number }) => {
  const [opened, setOpened] = useState(false);
  
  return (
    <>
      <MotionCard
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        viewport={{ once: true }}
        whileHover={{ y: -10, scale: 1.02 }}
        className="relative overflow-hidden group cursor-pointer"
        padding="xl"
        radius="lg"
        withBorder
        onClick={() => setOpened(true)}
      >
        {/* Background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
        
        {/* Badge */}
        {service.badge && (
          <Badge
            className="absolute top-4 right-4 animate-pulse"
            variant="gradient"
            gradient={{ from: 'red', to: 'orange' }}
          >
            {service.badge}
          </Badge>
        )}

        {/* Icon */}
        <ThemeIcon
          size={80}
          radius="xl"
          variant="gradient"
          gradient={{ from: service.gradient.split(' ')[0].replace('from-', ''), to: service.gradient.split(' ')[1].replace('to-', '') }}
          className="mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300"
        >
          {service.icon}
        </ThemeIcon>

        {/* Title */}
        <Title order={3} className="mb-2">{service.title}</Title>
        
        {/* Description */}
        <Text size="sm" c="dimmed" className="mb-4 line-clamp-2">
          {service.description}
        </Text>

        {/* Features */}
        <div className="space-y-2 mb-4">
          {service.features.slice(0, 3).map((feature: string, i: number) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
              <span className="truncate">{feature}</span>
            </div>
          ))}
        </div>

        {/* Price Range */}
        {service.priceRange && (
          <div className="mb-4">
            <Text size="sm" c="dimmed">Starting from</Text>
            <Text fw={700} size="xl" className="text-red-600 dark:text-red-400">
              {service.priceRange}
            </Text>
          </div>
        )}

        {/* Learn More Button */}
        <Button
          variant="subtle"
          color="red"
          fullWidth
          rightSection={<ArrowRight size={16} />}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          Learn More
        </Button>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-red-500/50 rounded-lg transition-all duration-300 pointer-events-none" />
      </MotionCard>

      {/* Service Details Modal */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={service.title}
        size="lg"
        radius="md"
        centered
      >
        <div className="space-y-6">
          <div className={`w-full h-2 bg-gradient-to-r ${service.gradient} rounded-full`} />
          
          <Group>
            <ThemeIcon
              size={60}
              radius="xl"
              variant="gradient"
              gradient={{ from: service.gradient.split(' ')[0].replace('from-', ''), to: service.gradient.split(' ')[1].replace('to-', '') }}
            >
              {service.icon}
            </ThemeIcon>
            <div>
              <Title order={3}>{service.title}</Title>
              <Text c="dimmed">{service.category}</Text>
            </div>
          </Group>

          <Text size="lg">{service.fullDescription}</Text>

          <Divider label="Features" labelPosition="center" />

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            {service.features.map((feature: string, i: number) => (
              <Paper key={i} p="md" withBorder className="bg-gray-50 dark:bg-gray-800">
                <Group>
                  <CheckCircle size={20} className="text-green-500" />
                  <Text>{feature}</Text>
                </Group>
              </Paper>
            ))}
          </SimpleGrid>

          <Divider label="Specifications" labelPosition="center" />

          <Grid>
            <Grid.Col span={6}>
              <Text fw={600}>Min Order</Text>
              <Text c="dimmed">{service.minOrder || '1 piece'}</Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text fw={600}>Turnaround</Text>
              <Text c="dimmed">{service.turnaround || '2-3 days'}</Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text fw={600}>Materials</Text>
              <Text c="dimmed">{service.materials || 'Multiple options'}</Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text fw={600}>File Formats</Text>
              <Text c="dimmed">{service.formats || 'AI, PSD, PDF, PNG'}</Text>
            </Grid.Col>
          </Grid>

          <Divider />

          <Group justify="space-between">
            <div>
              <Text size="sm" c="dimmed">Starting Price</Text>
              <Text fw={700} size="xl" className="text-red-600">{service.priceRange}</Text>
            </div>
            <Button
              size="lg"
              variant="gradient"
              gradient={{ from: 'red', to: 'orange' }}
              component={Link}
              href="/upload"
            >
              Start Your Project
            </Button>
          </Group>
        </div>
      </Modal>
    </>
  );
};

// Category Card Component
const CategoryCard = ({ category, index }: { category: any; index: number }) => {
  return (
    <MotionCard
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05 }}
      className="relative overflow-hidden group cursor-pointer"
      padding="xl"
      radius="lg"
      withBorder
      component={Link}
      href={`/services/${category.slug}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
      
      <ThemeIcon
        size={60}
        radius="xl"
        variant="gradient"
        gradient={{ from: category.gradient.split(' ')[0].replace('from-', ''), to: category.gradient.split(' ')[1].replace('to-', '') }}
        className="mb-4"
      >
        {category.icon}
      </ThemeIcon>
      
      <Title order={4} className="mb-2">{category.title}</Title>
      <Text size="sm" c="dimmed" className="mb-3">{category.count} Services</Text>
      
      <Group gap="xs">
        {category.tags.slice(0, 3).map((tag: string, i: number) => (
          <Badge key={i} size="sm" variant="light" color="red">
            {tag}
          </Badge>
        ))}
      </Group>
    </MotionCard>
  );
};

// Process Step Component
const ProcessStep = ({ step, index }: { step: any; index: number }) => {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="relative"
    >
      <Paper p="xl" radius="lg" withBorder className="text-center hover:shadow-xl transition-shadow">
        <div className="relative inline-block mb-4">
          <div className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto`}>
            {step.step}
          </div>
          {index < 3 && (
            <div className="hidden lg:block absolute top-1/2 -right-16 text-red-500">
              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <ArrowRight size={32} />
              </motion.div>
            </div>
          )}
        </div>
        
        <ThemeIcon
          size={50}
          radius="xl"
          variant="light"
          color="red"
          className="mx-auto mb-4"
        >
          {step.icon}
        </ThemeIcon>
        
        <Title order={4} className="mb-2">{step.title}</Title>
        <Text size="sm" c="dimmed">{step.description}</Text>
      </Paper>
    </MotionDiv>
  );
};

// FAQ Item Component
const FAQItem = ({ faq, index }: { faq: any; index: number }) => {
  const [opened, setOpened] = useState(false);

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="border-b border-gray-200 dark:border-gray-700 last:border-0"
    >
      <button
        onClick={() => setOpened(!opened)}
        className="w-full py-4 flex items-center justify-between text-left focus:outline-none"
      >
        <Text fw={600} size="lg">{faq.question}</Text>
        <motion.div
          animate={{ rotate: opened ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: opened ? 'auto' : 0, opacity: opened ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <Text c="dimmed" className="pb-4">{faq.answer}</Text>
      </motion.div>
    </MotionDiv>
  );
};

export default function ServicesPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const [activeTab, setActiveTab] = useState<string | null>('all');

  // Service categories
  const categories = [
    { id: 'all', label: 'All Services', icon: <Layers size={20} /> },
    { id: 'apparel', label: 'Apparel', icon: <Shirt size={20} /> },
    { id: 'large-format', label: 'Large Format', icon: <Printer size={20} /> },
    { id: 'stickers', label: 'Stickers & Labels', icon: <Tag size={20} /> },
    { id: 'print', label: 'Print', icon: <FileText size={20} /> },
    { id: 'packaging', label: 'Packaging', icon: <Package size={20} /> },
    { id: 'promotional', label: 'Promotional', icon: <Gift size={20} /> },
    { id: 'design', label: 'Design', icon: <PenTool size={20} /> },
  ];

  // All services data
  const allServices = [
    {
      id: 'dtf-printing',
      title: 'DTF Printing',
      category: 'apparel',
      icon: <Printer size={32} />,
      description: 'Direct to Film printing for vibrant, durable designs on any fabric.',
      fullDescription: 'DTF (Direct to Film) printing is our most popular service, offering vibrant colors and exceptional durability on any fabric type. Perfect for custom apparel, sportswear, and promotional items.',
      gradient: 'from-purple-500 to-pink-500',
      badge: 'Most Popular',
      features: [
        'Any fabric type',
        'Vibrant colors',
        'Wash durable',
        'No minimum order',
        'Fast turnaround',
        'High resolution',
      ],
      priceRange: '$15 - $50',
      minOrder: '1 piece',
      turnaround: '2-3 days',
      materials: 'Cotton, Polyester, Blends',
      formats: 'PNG, AI, PSD, PDF',
      tags: ['Apparel', 'Custom', 'Bulk'],
    },
    {
      id: 'screen-printing',
      title: 'Screen Printing',
      category: 'apparel',
      icon: <Layers size={32} />,
      description: 'Traditional screen printing for bulk orders with excellent color payoff.',
      fullDescription: 'Screen printing is the industry standard for bulk orders, offering excellent color payoff and cost-effectiveness for larger quantities. Ideal for team uniforms, events, and merchandise.',
      gradient: 'from-blue-500 to-cyan-500',
      badge: 'Best for Bulk',
      features: [
        'Bulk orders',
        'Spot colors',
        'Pantone matching',
        'Cost effective',
        'Durable prints',
        'Specialty inks',
      ],
      priceRange: '$8 - $30',
      minOrder: '12 pieces',
      turnaround: '5-7 days',
      materials: 'Cotton, Polyester',
      formats: 'AI, EPS, PDF',
      tags: ['Bulk', 'Uniforms', 'Events'],
    },
    {
      id: 'embroidery',
      title: 'Embroidery',
      category: 'apparel',
      icon: <Sparkles size={32} />,
      description: 'Professional embroidery for caps, polos, and corporate wear.',
      fullDescription: 'Add a touch of class with our professional embroidery service. Perfect for corporate wear, caps, jackets, and bags. We offer digitizing services and thread matching.',
      gradient: 'from-green-500 to-emerald-500',
      badge: 'Premium',
      features: [
        '3D puff option',
        'Thread matching',
        'Digitizing included',
        'Any design',
        'Multiple placements',
        'Bulk discounts',
      ],
      priceRange: '$12 - $45',
      minOrder: '6 pieces',
      turnaround: '5-7 days',
      materials: 'Polo shirts, Caps, Jackets',
      formats: 'AI, PNG, JPG',
      tags: ['Corporate', 'Premium', 'Uniforms'],
    },
    {
      id: 'banners',
      title: 'Banners & Signs',
      category: 'large-format',
      icon: <Megaphone size={32} />,
      description: 'Large format printing for indoor and outdoor banners.',
      fullDescription: 'Make a big impression with our large format banners and signs. Perfect for events, retail displays, trade shows, and outdoor advertising. Various materials and finishes available.',
      gradient: 'from-red-500 to-orange-500',
      badge: 'Most Popular',
      features: [
        'Indoor/outdoor',
        'Multiple sizes',
        'Grommets included',
        'Weather resistant',
        'Fast production',
        'Installation available',
      ],
      priceRange: '$25 - $200',
      minOrder: '1 piece',
      turnaround: '1-2 days',
      materials: 'Vinyl, Mesh, Fabric',
      formats: 'AI, PDF, TIFF',
      tags: ['Events', 'Retail', 'Outdoor'],
    },
    {
      id: 'vehicle-wraps',
      title: 'Vehicle Wraps',
      category: 'large-format',
      icon: <Car size={32} />,
      description: 'Full and partial vehicle wraps for mobile advertising.',
      fullDescription: 'Turn your fleet into moving billboards with our professional vehicle wrap service. Full wraps, partial wraps, and decals available with professional installation.',
      gradient: 'from-blue-500 to-indigo-500',
      badge: 'Professional',
      features: [
        'Full/partial wraps',
        'Commercial vehicles',
        'Removable vinyl',
        'Design service',
        'Professional install',
        '5-year durability',
      ],
      priceRange: '$500 - $3000',
      minOrder: '1 vehicle',
      turnaround: '3-5 days',
      materials: 'Cast vinyl, Calendared vinyl',
      formats: 'AI, PDF, EPS',
      tags: ['Vehicles', 'Advertising', 'Fleet'],
    },
    {
      id: 'stickers',
      title: 'Custom Stickers',
      category: 'stickers',
      icon: <Tag size={32} />,
      description: 'Die-cut and kiss-cut stickers in various finishes.',
      fullDescription: 'From die-cut to kiss-cut, we produce high-quality custom stickers perfect for branding, products, and promotions. Choose from various shapes, sizes, and finishes.',
      gradient: 'from-yellow-500 to-orange-500',
      badge: 'Popular',
      features: [
        'Custom shapes',
        'Matte/glossy',
        'Weather resistant',
        'Small to bulk orders',
        'Fast turnaround',
        'Easy application',
      ],
      priceRange: '$10 - $100',
      minOrder: '10 pieces',
      turnaround: '2-3 days',
      materials: 'Vinyl, Paper, Clear',
      formats: 'AI, PNG, PDF',
      tags: ['Branding', 'Products', 'Promo'],
    },
    {
      id: 'labels',
      title: 'Product Labels',
      category: 'stickers',
      icon: <Bookmark size={32} />,
      description: 'Custom product labels for packaging and branding.',
      fullDescription: 'Professional product labels for your packaging needs. Various materials and adhesives available for different applications, from food products to industrial items.',
      gradient: 'from-green-500 to-teal-500',
      badge: 'Business',
      features: [
        'Barcode ready',
        'Water resistant',
        'Custom sizes',
        'Multiple materials',
        'Bulk rolls',
        'FDA compliant',
      ],
      priceRange: '$20 - $150',
      minOrder: '100 pieces',
      turnaround: '3-4 days',
      materials: 'Paper, Vinyl, Clear',
      formats: 'AI, PDF, EPS',
      tags: ['Packaging', 'Products', 'Retail'],
    },
    {
      id: 'business-cards',
      title: 'Business Cards',
      category: 'print',
      icon: <FileText size={32} />,
      description: 'Premium business cards with various finishes.',
      fullDescription: 'Make a lasting impression with our premium business cards. Choose from various paper stocks, finishes, and special effects like foil stamping and embossing.',
      gradient: 'from-gray-500 to-gray-700',
      badge: 'Essential',
      features: [
        'Premium paper',
        'Foil options',
        'Spot UV',
        'Embossing',
        'Rounded corners',
        'Matching sets',
      ],
      priceRange: '$25 - $80',
      minOrder: '100 pieces',
      turnaround: '2-3 days',
      materials: 'Matte, Gloss, Textured',
      formats: 'AI, PDF, INDD',
      tags: ['Corporate', 'Networking', 'Branding'],
    },
    {
      id: 'flyers',
      title: 'Flyers & Brochures',
      category: 'print',
      icon: <FileText size={32} />,
      description: 'Marketing materials for your business promotions.',
      fullDescription: 'Professional flyers and brochures for your marketing campaigns. Various sizes, folds, and paper options available to suit your needs.',
      gradient: 'from-blue-500 to-cyan-500',
      badge: 'Marketing',
      features: [
        'Multiple sizes',
        'Folding options',
        'Glossy/matte',
        'Bulk pricing',
        'Design service',
        'Fast turnaround',
      ],
      priceRange: '$30 - $200',
      minOrder: '50 pieces',
      turnaround: '2-3 days',
      materials: 'Gloss, Matte, Recycled',
      formats: 'AI, PDF, INDD',
      tags: ['Marketing', 'Events', 'Promo'],
    },
    {
      id: 'posters',
      title: 'Posters',
      category: 'large-format',
      icon: <LucideImage size={32} />,
      description: 'High-quality posters for events and advertising.',
      fullDescription: 'Vibrant posters for events, promotions, and advertising. Various sizes and paper options available for indoor and outdoor use.',
      gradient: 'from-purple-500 to-pink-500',
      badge: 'Popular',
      features: [
        'Multiple sizes',
        'High resolution',
        'UV resistant',
        'Fast printing',
        'Bulk orders',
        'Lamination',
      ],
      priceRange: '$15 - $150',
      minOrder: '1 piece',
      turnaround: '1-2 days',
      materials: 'Gloss, Matte, Vinyl',
      formats: 'AI, PDF, TIFF',
      tags: ['Events', 'Advertising', 'Art'],
    },
    {
      id: 'mugs',
      title: 'Custom Mugs',
      category: 'promotional',
      icon: <Coffee size={32} />,
      description: 'Personalized mugs for gifts and promotions.',
      fullDescription: 'Create memorable promotional items with our custom mug printing. Perfect for corporate gifts, events, and everyday use. Dishwasher safe and durable.',
      gradient: 'from-orange-500 to-red-500',
      badge: 'Gift Idea',
      features: [
        'Full color',
        'Dishwasher safe',
        'Various sizes',
        'Bulk pricing',
        'Fast turnaround',
        'Gift packaging',
      ],
      priceRange: '$8 - $25',
      minOrder: '6 pieces',
      turnaround: '3-4 days',
      materials: 'Ceramic, Enamel',
      formats: 'AI, PNG, PDF',
      tags: ['Gifts', 'Promo', 'Events'],
    },
    {
      id: 'tshirts',
      title: 'T-Shirt Printing',
      category: 'apparel',
      icon: <Shirt size={32} />,
      description: 'Custom t-shirts for events, teams, and business.',
      fullDescription: 'High-quality custom t-shirt printing for any occasion. Choose from multiple printing methods including DTF, screen printing, and DTG for the perfect result.',
      gradient: 'from-red-500 to-pink-500',
      badge: 'Most Popular',
      features: [
        'Multiple methods',
        'All colors',
        'Bulk discounts',
        'Design help',
        'Fast delivery',
        'Quality guarantee',
      ],
      priceRange: '$12 - $35',
      minOrder: '1 piece',
      turnaround: '2-4 days',
      materials: 'Cotton, Polyester, Blends',
      formats: 'AI, PNG, PDF',
      tags: ['Apparel', 'Events', 'Teams'],
    },
    {
      id: 'hoodies',
      title: 'Hoodies & Sweatshirts',
      category: 'apparel',
      icon: <Shirt size={32} />,
      description: 'Comfortable custom hoodies for any season.',
      fullDescription: 'Stay warm and stylish with our custom hoodies and sweatshirts. Perfect for teams, events, and corporate wear. Various styles and colors available.',
      gradient: 'from-blue-500 to-purple-500',
      badge: 'Comfort',
      features: [
        'Premium blanks',
        'All sizes',
        'Embroidery option',
        'Bulk pricing',
        'Fast turnaround',
        'Quality materials',
      ],
      priceRange: '$25 - $60',
      minOrder: '6 pieces',
      turnaround: '3-5 days',
      materials: 'Cotton, Fleece, Blends',
      formats: 'AI, PNG, PDF',
      tags: ['Apparel', 'Teams', 'Events'],
    },
    {
      id: 'caps',
      title: 'Caps & Hats',
      category: 'apparel',
      icon: <Camera size={32} />,
      description: 'Custom headwear for teams and promotions.',
      fullDescription: 'Custom caps and hats for your team, event, or promotion. Choose from various styles and colors with embroidery or printed options.',
      gradient: 'from-green-500 to-teal-500',
      badge: 'Trending',
      features: [
        'Embroidery',
        'Printed options',
        'Adjustable',
        'Bulk orders',
        'Fast delivery',
        'Quality guarantee',
      ],
      priceRange: '$15 - $40',
      minOrder: '12 pieces',
      turnaround: '4-6 days',
      materials: 'Cotton, Polyester, Wool',
      formats: 'AI, PNG, PDF',
      tags: ['Headwear', 'Teams', 'Promo'],
    },
    {
      id: 'totes',
      title: 'Tote Bags',
      category: 'promotional',
      icon: <Dog size={32} />,
      description: 'Eco-friendly custom tote bags.',
      fullDescription: 'Eco-friendly custom tote bags perfect for retail, events, and promotional giveaways. Various materials and printing options available.',
      gradient: 'from-green-500 to-emerald-500',
      badge: 'Eco-Friendly',
      features: [
        'Eco materials',
        'Reusable',
        'Custom printing',
        'Bulk pricing',
        'Fast turnaround',
        'Durable',
      ],
      priceRange: '$10 - $30',
      minOrder: '25 pieces',
      turnaround: '3-5 days',
      materials: 'Cotton, Canvas, Non-woven',
      formats: 'AI, PNG, PDF',
      tags: ['Eco', 'Promo', 'Retail'],
    },
    {
      id: 'pens',
      title: 'Custom Pens',
      category: 'promotional',
      icon: <Pen size={32} />,
      description: 'Promotional pens with your logo.',
      fullDescription: 'Classic promotional pens with your logo. Perfect for giveaways, trade shows, and everyday use. Various colors and styles available.',
      gradient: 'from-yellow-500 to-orange-500',
      badge: 'Budget Friendly',
      features: [
        'Custom logo',
        'Multiple colors',
        'Bulk pricing',
        'Fast delivery',
        'Various styles',
        'Refillable',
      ],
      priceRange: '$0.50 - $5',
      minOrder: '100 pieces',
      turnaround: '5-7 days',
      materials: 'Plastic, Metal',
      formats: 'AI, PNG, PDF',
      tags: ['Promo', 'Giveaways', 'Office'],
    },
    {
      id: 'keychains',
      title: 'Keychains',
      category: 'promotional',
      icon: <Key size={32} />,
      description: 'Custom keychains for lasting impressions.',
      fullDescription: 'Custom keychains that keep your brand in sight every day. Various materials and designs available for promotional use.',
      gradient: 'from-purple-500 to-pink-500',
      badge: 'Popular',
      features: [
        'Custom shapes',
        'Multiple materials',
        'Bulk pricing',
        'Fast turnaround',
        'Durable',
        'Great giveaways',
      ],
      priceRange: '$2 - $15',
      minOrder: '50 pieces',
      turnaround: '4-6 days',
      materials: 'Acrylic, Metal, Leather',
      formats: 'AI, PNG, PDF',
      tags: ['Promo', 'Giveaways', 'Souvenirs'],
    },
    {
      id: 'packaging',
      title: 'Custom Packaging',
      category: 'packaging',
      icon: <Box size={32} />,
      description: 'Custom boxes and packaging for your products.',
      fullDescription: 'Elevate your brand with custom packaging solutions. From product boxes to shipping mailers, we create packaging that protects and promotes.',
      gradient: 'from-blue-500 to-indigo-500',
      badge: 'Premium',
      features: [
        'Custom sizes',
        'Full color print',
        'Various materials',
        'Structural design',
        'Bulk pricing',
        'Eco options',
      ],
      priceRange: '$100 - $1000',
      minOrder: '100 pieces',
      turnaround: '7-10 days',
      materials: 'Cardboard, Kraft, Rigid',
      formats: 'AI, PDF, CAD',
      tags: ['Products', 'Retail', 'Shipping'],
    },
    {
      id: 'design',
      title: 'Graphic Design',
      category: 'design',
      icon: <PenTool size={32} />,
      description: 'Professional design services for all your needs.',
      fullDescription: 'Our professional designers help bring your vision to life. From logos to complete branding packages, we provide creative solutions that stand out.',
      gradient: 'from-orange-500 to-red-500',
      badge: 'Creative',
      features: [
        'Logo design',
        'Brand identity',
        'Print ready files',
        'Unlimited revisions',
        'Fast turnaround',
        'Commercial use',
      ],
      priceRange: '$50 - $500',
      minOrder: '1 project',
      turnaround: '2-5 days',
      materials: 'Digital files',
      formats: 'AI, PSD, PDF, JPG',
      tags: ['Creative', 'Branding', 'Digital'],
    },
  ];

  // Filter services based on selected category
  const filteredServices = activeTab === 'all' 
    ? allServices 
    : allServices.filter(service => service.category === activeTab);

  // Process steps
  const processSteps = [
    {
      step: 1,
      title: 'Upload Design',
      description: 'Upload your files or describe your project',
      icon: <Upload size={24} />,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      step: 2,
      title: 'Get Quote',
      description: 'Receive instant pricing based on specs',
      icon: <DollarSign size={24} />,
      color: 'from-green-500 to-emerald-500',
    },
    {
      step: 3,
      title: 'Approve Proof',
      description: 'Review and approve digital proof',
      icon: <Eye size={24} />,
      color: 'from-yellow-500 to-orange-500',
    },
    {
      step: 4,
      title: 'Production',
      description: 'We print with quality materials',
      icon: <Printer size={24} />,
      color: 'from-red-500 to-pink-500',
    },
    {
      step: 5,
      title: 'Quality Check',
      description: 'Rigorous quality inspection',
      icon: <CheckCircle size={24} />,
      color: 'from-purple-500 to-indigo-500',
    },
    {
      step: 6,
      title: 'Delivery',
      description: 'Fast shipping to your location',
      icon: <Truck size={24} />,
      color: 'from-teal-500 to-green-500',
    },
  ];

  // FAQ data
  const faqs = [
    {
      question: 'What file formats do you accept?',
      answer: 'We accept various file formats including AI, PSD, PDF, PNG, JPG, and TIFF. For best results, we recommend vector files (AI, EPS, PDF) for logos and designs with text.',
    },
    {
      question: 'What is your turnaround time?',
      answer: 'Turnaround time varies by service. Standard orders take 2-3 business days, while rush orders can be completed in 24 hours. Large bulk orders may require additional time.',
    },
    {
      question: 'Do you offer design services?',
      answer: 'Yes! Our professional design team can help create or refine your artwork. We offer logo design, brand identity packages, and file preparation services.',
    },
    {
      question: 'What is the minimum order quantity?',
      answer: 'Minimum order quantities vary by service. DTF printing and banners have no minimum, while screen printing and embroidery have minimums of 12-24 pieces.',
    },
    {
      question: 'Do you ship nationwide?',
      answer: 'Yes, we ship to all cities in Ethiopia. Delivery times vary by location. We also offer local pickup from our Addis Ababa location.',
    },
    {
      question: 'How do I ensure print quality?',
      answer: 'Our online upload tool automatically checks your file resolution and provides recommendations. For best results, use high-resolution images (300 DPI) and vector files when possible.',
    },
  ];

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
       alt="Printing Services"
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
              Our Services
            </Badge>
            
            <Title className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              Professional <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Printing</span> Services
            </Title>
            
            <Text size="xl" className="max-w-3xl mx-auto text-gray-200">
              From custom apparel to large format printing, we offer a comprehensive range of 
              high-quality printing solutions for businesses and individuals.
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

      {/* Categories Tabs */}
      <Container size="lg" className="py-12">
        <Tabs value={activeTab} onChange={setActiveTab} variant="pills" radius="xl">
          <Tabs.List grow className="flex-wrap gap-2">
            {categories.map((category) => (
              <Tabs.Tab key={category.id} value={category.id} leftSection={category.icon}>
                {category.label}
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs>
      </Container>

      {/* Services Grid */}
      <Container size="lg" className="pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredServices.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>

        {filteredServices.length === 0 && (
          <Paper p="xl" radius="lg" withBorder className="text-center">
            <Text size="lg" c="dimmed">No services found in this category.</Text>
            <Button
              variant="subtle"
              color="red"
              onClick={() => setActiveTab('all')}
              className="mt-4"
            >
              View All Services
            </Button>
          </Paper>
        )}
      </Container>

      {/* Process Section */}
      <MotionSection className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <Container size="lg">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge size="lg" color="red" className="mb-4">Simple Process</Badge>
            <Title order={2} className="text-4xl md:text-5xl font-bold mb-4">
              How It <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Works</span>
            </Title>
            <Text size="xl" c="dimmed" className="max-w-2xl mx-auto">
              From design to delivery in six simple steps
            </Text>
          </MotionDiv>

          <SimpleGrid cols={{ base: 1, md: 2, lg: 3, xl: 6 }} spacing="lg">
            {processSteps.map((step, index) => (
              <ProcessStep key={index} step={step} index={index} />
            ))}
          </SimpleGrid>
        </Container>
      </MotionSection>

      {/* Why Choose Us Section */}
      <Container size="lg" className="py-20">
        <Grid gutter={50} align="center">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <MotionDiv
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge size="lg" color="red" className="mb-4">Why Choose Us</Badge>
              <Title order={2} className="text-4xl md:text-5xl font-bold mb-6">
                Quality You Can <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Trust</span>
              </Title>
              
              <Stack gap="md">
                <Group>
                  <ThemeIcon size={40} radius="xl" color="red" variant="light">
                    <Award size={20} />
                  </ThemeIcon>
                  <div>
                    <Text fw={600}>Premium Quality</Text>
                    <Text size="sm" c="dimmed">Top-grade materials and latest printing technology</Text>
                  </div>
                </Group>
                
                <Group>
                  <ThemeIcon size={40} radius="xl" color="red" variant="light">
                    <Clock size={20} />
                  </ThemeIcon>
                  <div>
                    <Text fw={600}>Fast Turnaround</Text>
                    <Text size="sm" c="dimmed">Most orders completed in 2-3 business days</Text>
                  </div>
                </Group>
                
                <Group>
                  <ThemeIcon size={40} radius="xl" color="red" variant="light">
                    <Headphones size={20} />
                  </ThemeIcon>
                  <div>
                    <Text fw={600}>Expert Support</Text>
                    <Text size="sm" c="dimmed">Dedicated team to help with your projects</Text>
                  </div>
                </Group>
                
                <Group>
                  <ThemeIcon size={40} radius="xl" color="red" variant="light">
                    <DollarSign size={20} />
                  </ThemeIcon>
                  <div>
                    <Text fw={600}>Competitive Pricing</Text>
                    <Text size="sm" c="dimmed">Best value for premium quality printing</Text>
                  </div>
                </Group>
              </Stack>
            </MotionDiv>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <MotionDiv
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/logo.jpg"
                  alt="Printing Process"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              
              {/* Stats Overlay */}
              <MotionDiv
                className="absolute -bottom-10 -left-10 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <Group>
                  <ThemeIcon size={50} radius="xl" color="red" variant="light">
                    <CheckCircle size={24} />
                  </ThemeIcon>
                  <div>
                    <Text fw={700} size="xl" className="text-red-600">99.9%</Text>
                    <Text c="dimmed">Satisfaction Rate</Text>
                  </div>
                </Group>
              </MotionDiv>
            </MotionDiv>
          </Grid.Col>
        </Grid>
      </Container>

      {/* FAQ Section */}
      <MotionSection className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <Container size="lg">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge size="lg" color="red" className="mb-4">FAQ</Badge>
            <Title order={2} className="text-4xl md:text-5xl font-bold mb-4">
              Frequently Asked <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Questions</span>
            </Title>
            <Text size="xl" c="dimmed" className="max-w-2xl mx-auto">
              Find answers to common questions about our services
            </Text>
          </MotionDiv>

          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Paper p="xl" radius="lg" withBorder>
                {faqs.slice(0, 3).map((faq, index) => (
                  <FAQItem key={index} faq={faq} index={index} />
                ))}
              </Paper>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Paper p="xl" radius="lg" withBorder>
                {faqs.slice(3, 6).map((faq, index) => (
                  <FAQItem key={index} faq={faq} index={index} />
                ))}
              </Paper>
            </Grid.Col>
          </Grid>
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
              Ready to Start Your Project?
            </Title>
            
            <Text size="xl" className="mb-8 max-w-2xl mx-auto">
              Get a free quote within 24 hours. Our team is ready to help!
            </Text>

            <Group justify="center" gap="md">
              <Button
                size="xl"
                variant="white"
                color="red"
                component={Link}
                href="/upload"
              >
                Upload Your Design
              </Button>
              <Button
                size="xl"
                variant="outline"
                color="white"
                component={Link}
                href="/contact"
              >
                Contact Us
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
        <Tooltip label="Chat with us" position="left">
          <ActionIcon
            size="lg"
            radius="xl"
            variant="filled"
            color="blue"
            className="shadow-lg hover:scale-110 transition-transform"
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
          >
            <Phone size={20} />
          </ActionIcon>
        </Tooltip>
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}