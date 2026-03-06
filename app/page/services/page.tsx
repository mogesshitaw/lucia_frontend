// app/page/services/page.tsx
'use client';

import { Container, Title, Text, SimpleGrid, Card, ThemeIcon, Badge, Button, Group } from '@mantine/core';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Printer,
  Shirt,
  Megaphone,
  Tag,
  Coffee,
  Wine,
  Lightbulb,
  Sparkle,
  Flame,
  Snowflake,
  Scissors,
  Layers,
  Car,
  FileText,
  Package,
  Gift,
  PenTool,
  Key,
  Pen,
  ShoppingBag,
  Camera,
  Palette,
  Bookmark,
  Sparkles,
  Award,
  Phone,
  ArrowRight,
} from 'lucide-react';

const MotionDiv = motion.div;

// All services data
const services = [
  {
    category: 'Apparel Printing',
    icon: <Shirt size={24} />,
    color: 'red',
    items: [
      { title: 'DTF Printing', href: '/page/services/dtf', icon: <Printer size={20} />, badge: 'Popular', description: 'Direct to Film printing for any fabric' },
      { title: 'T-Shirt Printing', href: '/page/services/tshirt', icon: <Shirt size={20} />, badge: 'Best Seller', description: 'Custom t-shirts for any occasion' },
      { title: 'Custom Hats', href: '/page/services/hats', icon: <Shirt size={20} />, badge: 'Trending', description: 'Personalized caps and beanies' },
      { title: 'Screen Printing', href: '/page/services/screen-printing', icon: <Layers size={20} />, description: 'Bulk orders with spot colors' },
      { title: 'Embroidery', href: '/page/services/embroidery', icon: <Sparkles size={20} />, badge: 'Premium', description: 'Professional embroidered logos' },
      { title: 'Hoodies', href: '/page/services/hoodies', icon: <Shirt size={20} />, description: 'Custom hoodies & sweatshirts' },
      { title: 'Tote Bags', href: '/page/services/totes', icon: <ShoppingBag size={20} />, badge: 'Eco', description: 'Eco-friendly custom bags' },
    ],
  },
  {
    category: 'Large Format',
    icon: <Megaphone size={24} />,
    color: 'orange',
    items: [
      { title: 'Banner Printing', href: '/page/services/banners', icon: <Megaphone size={20} />, badge: 'Popular', description: 'Indoor/outdoor banners' },
      { title: 'Posters', href: '/page/services/posters', icon: <Camera size={20} />, description: 'High-quality poster printing' },
      { title: 'Vehicle Wraps', href: '/page/services/wraps', icon: <Car size={20} />, badge: 'Professional', description: 'Full & partial vehicle wraps' },
      { title: 'Light Box', href: '/page/services/light-box', icon: <Lightbulb size={20} />, badge: 'Premium', description: 'LED illuminated signs' },
      { title: 'Neo Light', href: '/page/services/neo-light', icon: <Sparkle size={20} />, badge: 'Trending', description: 'Flexible LED neon signs' },
      { title: 'Cutout', href: '/page/services/cutout', icon: <Scissors size={20} />, description: 'Custom die-cut shapes' },
    ],
  },
  {
    category: 'Stickers & Labels',
    icon: <Tag size={24} />,
    color: 'yellow',
    items: [
      { title: 'Custom Stickers', href: '/page/services/stickers', icon: <Tag size={20} />, badge: 'Popular', description: 'Die-cut & kiss-cut stickers' },
      { title: 'Product Labels', href: '/page/services/labels', icon: <Bookmark size={20} />, badge: 'Business', description: 'Custom product labels' },
      { title: 'Frosted Glass', href: '/page/services/frosted', icon: <Snowflake size={20} />, badge: 'Elegant', description: 'Privacy & decorative glass' },
    ],
  },
  {
    category: 'Drinkware',
    icon: <Coffee size={24} />,
    color: 'orange',
    items: [
      { title: 'Mug Printing', href: '/page/services/mugs', icon: <Coffee size={20} />, badge: 'Gift Idea', description: 'Custom ceramic mugs' },
      { title: 'Bottle Printing', href: '/page/services/bottles', icon: <Wine size={20} />, badge: 'Eco', description: 'Custom water bottles & tumblers' },
    ],
  },
  {
    category: 'Print & Promo',
    icon: <FileText size={24} />,
    color: 'blue',
    items: [
      { title: 'Business Cards', href: '/page/services/business-cards', icon: <FileText size={20} />, badge: 'Essential', description: 'Premium business cards' },
      { title: 'Flyers & Brochures', href: '/page/services/flyers', icon: <FileText size={20} />, description: 'Marketing materials' },
      { title: 'Custom Packaging', href: '/page/services/packaging', icon: <Package size={20} />, badge: 'Premium', description: 'Custom boxes & packaging' },
      { title: 'Custom Pens', href: '/page/services/pens', icon: <Pen size={20} />, description: 'Promotional pens' },
      { title: 'Keychains', href: '/page/services/keychains', icon: <Key size={20} />, description: 'Custom keychains' },
    ],
  },
  {
    category: 'Specialty',
    icon: <Award size={24} />,
    color: 'purple',
    items: [
      { title: 'Laser Engraving', href: '/page/services/engraving', icon: <Flame size={20} />, badge: 'Precision', description: 'Engraving on various materials' },
      { title: 'Graphic Design', href: '/page/services/design', icon: <Palette size={20} />, badge: 'Creative', description: 'Professional design services' },
    ],
  },
];

export default function ServicesMainPage() {
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
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge size="lg" variant="white" className="mb-4 bg-white/20 text-white border-0">
              Our Services
            </Badge>
            <Title order={1} className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Professional Printing <span className="text-yellow-300">Services</span>
            </Title>
            <Text size="xl" className="max-w-3xl mx-auto text-white/90 mb-8">
              From custom apparel to large format printing, we offer a comprehensive range of 
              high-quality printing solutions for businesses and individuals.
            </Text>
            <Button
              size="lg"
              variant="white"
              color="red"
              component={Link}
              href="/contact"
              rightSection={<ArrowRight size={20} />}
            >
              Get a Quote
            </Button>
          </MotionDiv>
        </Container>
      </section>

      {/* Services by Category */}
      <Container size="lg" className="py-16">
        {services.map((category, idx) => (
          <MotionDiv
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="mb-16 last:mb-0"
          >
            <Group gap="sm" className="mb-6">
              <ThemeIcon size={40} radius="xl" color={category.color} variant="light">
                {category.icon}
              </ThemeIcon>
              <Title order={2} className="text-2xl md:text-3xl font-bold">
                {category.category}
              </Title>
            </Group>

            <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg">
              {category.items.map((service, index) => (
                <Card
                  key={index}
                  component={Link}
                  href={service.href}
                  withBorder
                  padding="lg"
                  radius="lg"
                  className="hover:shadow-lg transition-shadow group"
                >
                  <Card.Section className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                    <Group justify="space-between" align="center">
                      <ThemeIcon size={50} radius="xl" color={category.color} variant="light">
                        {service.icon}
                      </ThemeIcon>
                      {service.badge && (
                        <Badge color={category.color} variant="light" size="sm">
                          {service.badge}
                        </Badge>
                      )}
                    </Group>
                  </Card.Section>

                  <Text fw={600} size="lg" className="mt-3 mb-2">
                    {service.title}
                  </Text>
                  
                  <Text size="sm" c="dimmed" className="mb-3">
                    {service.description}
                  </Text>

                  <Button
                    variant="subtle"
                    color={category.color}
                    size="compact"
                    rightSection={<ArrowRight size={14} />}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Learn More
                  </Button>
                </Card>
              ))}
            </SimpleGrid>
          </MotionDiv>
        ))}
      </Container>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <Container size="lg">
          <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl p-12 text-center text-white">
            <Title order={2} className="text-3xl md:text-4xl font-bold mb-4">
              Can't Find What You're Looking For?
            </Title>
            <Text size="xl" className="mb-8 max-w-2xl mx-auto text-white/90">
              Contact us for custom printing solutions tailored to your specific needs.
            </Text>
            <Group justify="center" gap="md">
              <Button
                size="lg"
                variant="white"
                color="red"
                component={Link}
                href="/contact"
              >
                Contact Us
              </Button>
              <Button
                size="lg"
                variant="outline"
                color="white"
                component={Link}
                href="/upload"
              >
                Upload Design
              </Button>
            </Group>
          </div>
        </Container>
      </section>
    </div>
  );
}