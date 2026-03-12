/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Title,
  Text,
  SimpleGrid,
  Card,
  ThemeIcon,
  Badge,
  Button,
  Group,
  Loader,
  Center,
  Paper,
  Stack,
  useMantineColorScheme,
} from '@mantine/core';
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
  Star,
} from 'lucide-react';

const MotionDiv = motion.div;

// Icon mapping
const iconMap: Record<string, any> = {
  Printer, Shirt, Megaphone, Tag, Coffee, Wine, Lightbulb, Sparkle, Flame,
  Snowflake, Scissors, Layers, Car, FileText, Package, Gift, PenTool, Key,
  Pen, ShoppingBag, Camera, Palette, Bookmark, Sparkles, Award, Star,
};

// API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Types
interface Service {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  icon_name: string;
  badge: string | null;
  category: string;
  category_name?: string;
  gradient_from: string;
  gradient_to: string;
  price_range: string;
  is_featured: boolean;
  is_popular: boolean;
  is_new: boolean;
}

interface Category {
  name: string;
  slug: string;
  icon_name: string;
  services: Service[];
}

export default function ServicesMainPage() {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/public/services?limit=100`);
        const data = await response.json();
        
        if (data.success) {
          const services = data.data;
          
          // Group services by category
          const grouped = services.reduce((acc: Record<string, Category>, service: Service) => {
            const categorySlug = service.category || 'uncategorized';
            const categoryName = service.category_name || 
              (service.category ? service.category.split('-').map((word: string) => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ') : 'Other Services');
            
            if (!acc[categorySlug]) {
              acc[categorySlug] = {
                name: categoryName,
                slug: categorySlug,
                icon_name: getCategoryIcon(categorySlug),
                services: [],
              };
            }
            acc[categorySlug].services.push(service);
            return acc;
          }, {});
  
          // Convert to array and sort with proper typing
          const categoryList = (Object.values(grouped) as Category[]).sort((a: Category, b: Category) => {
            const order: Record<string, number> = {
              'apparel-printing': 1,
              'large-format': 2,
              'stickers-labels': 3,
              'drinkware': 4,
              'print-promo': 5,
              'specialty': 6,
            };
            return (order[a.slug] || 999) - (order[b.slug] || 999);
          });

          setCategories(categoryList);
        } else {
          setError('Failed to load services');
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        setError('Failed to load services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Get category icon based on slug
  const getCategoryIcon = (slug: string): string => {
    const icons: Record<string, string> = {
      'apparel-printing': 'Shirt',
      'large-format': 'Megaphone',
      'stickers-labels': 'Tag',
      'drinkware': 'Coffee',
      'print-promo': 'FileText',
      'specialty': 'Award',
    };
    return icons[slug] || 'Star';
  };

  // Get color based on category
  const getCategoryColor = (slug: string): string => {
    const colors: Record<string, string> = {
      'apparel-printing': 'red',
      'large-format': 'orange',
      'stickers-labels': 'yellow',
      'drinkware': 'orange',
      'print-promo': 'blue',
      'specialty': 'purple',
    };
    return colors[slug] || 'red';
  };

  // Get icon component from name
  const getIconComponent = (iconName: string, size: number = 24) => {
    const Icon = iconMap[iconName] || Star;
    return <Icon size={size} />;
  };

  if (loading) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        isDark 
          ? 'bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950' 
          : 'bg-gradient-to-b from-gray-50 to-white'
      }`}>
        <Container size="lg" className="py-20">
          <Center>
            <Stack align="center">
              <Loader size="lg" color="red" />
              <Text c="dimmed">Loading services...</Text>
            </Stack>
          </Center>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        isDark 
          ? 'bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950' 
          : 'bg-gradient-to-b from-gray-50 to-white'
      }`}>
        <Container size="lg" className="py-20">
          <Paper 
            withBorder 
            p="xl" 
            radius="lg" 
            className={`text-center transition-colors duration-300 ${
              isDark 
                ? 'bg-gray-900 border-gray-800' 
                : 'bg-white border-gray-200'
            }`}
          >
            <Text c="red" size="lg" fw={600}>Error</Text>
            <Text c="dimmed" mt="xs">{error}</Text>
            <Button
              variant="light"
              color="red"
              onClick={() => window.location.reload()}
              className="mt-4"
            >
              Try Again
            </Button>
          </Paper>
        </Container>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950' 
        : 'bg-gradient-to-b from-gray-50 to-white'
    }`}>
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
        {categories.map((category, idx) => {
          const categoryColor = getCategoryColor(category.slug);
          const CategoryIcon = iconMap[category.icon_name] || Star;
          
          return (
            <MotionDiv
              key={category.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="mb-16 last:mb-0"
            >
              <Group gap="sm" className="mb-6">
                <ThemeIcon size={40} radius="xl" color={categoryColor} variant="light">
                  <CategoryIcon size={20} />
                </ThemeIcon>
                <Title order={2} className={`text-2xl md:text-3xl font-bold transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {category.name}
                </Title>
                <Badge color={categoryColor} variant="light" size="lg">
                  {category.services.length} Services
                </Badge>
              </Group>

              <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg">
                {category.services.map((service, index) => {
                  const ServiceIcon = iconMap[service.icon_name] || Printer;
                  
                  return (
                    <Card
                      key={service.id}
                      component={Link}
                      href={`/page/services/${service.slug}`}
                      withBorder
                      padding="lg"
                      radius="lg"
                      className={`hover:shadow-lg transition-all duration-300 group ${
                        isDark 
                          ? 'bg-gray-900 border-gray-800 hover:shadow-gray-800/50' 
                          : 'bg-white border-gray-200 hover:shadow-gray-200/50'
                      }`}
                    >
                      <Card.Section className={`p-4 transition-colors duration-300 ${
                        isDark 
                          ? 'bg-gradient-to-br from-gray-800 to-gray-900' 
                          : 'bg-gradient-to-br from-gray-50 to-gray-100'
                      }`}>
                        <Group justify="space-between" align="center">
                          <ThemeIcon size={50} radius="xl" color={categoryColor} variant="light">
                            <ServiceIcon size={24} />
                          </ThemeIcon>
                          <Group gap={4}>
                            {service.is_new && (
                              <Badge size="xs" color="green" variant="light">NEW</Badge>
                            )}
                            {service.is_popular && (
                              <Badge size="xs" color="orange" variant="light">HOT</Badge>
                            )}
                            {service.badge && (
                              <Badge size="xs" color={categoryColor} variant="light">
                                {service.badge}
                              </Badge>
                            )}
                          </Group>
                        </Group>
                      </Card.Section>

                      <Text fw={600} size="lg" className={`mt-3 mb-2 transition-colors duration-300 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {service.title}
                      </Text>
                      
                      <Text size="sm" c="dimmed" className="mb-3 line-clamp-2">
                        {service.short_description}
                      </Text>

                      {service.price_range && (
                        <Text size="sm" fw={600} className="text-red-600 dark:text-red-400 mb-2">
                          {service.price_range}
                        </Text>
                      )}

                      <Button
                        variant="subtle"
                        color={categoryColor}
                        size="compact"
                        rightSection={<ArrowRight size={14} />}
                        className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                          isDark ? 'text-gray-300 hover:text-white' : ''
                        }`}
                        fullWidth
                      >
                        Learn More
                      </Button>
                    </Card>
                  );
                })}
              </SimpleGrid>
            </MotionDiv>
          );
        })}
      </Container>

      {/* CTA Section */}
      <section className={`py-16 transition-colors duration-300 ${
        isDark ? 'bg-gray-900/50' : 'bg-gray-50'
      }`}>
        <Container size="lg">
          <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl p-12 text-center text-white">
            <Title order={2} className="text-3xl md:text-4xl font-bold mb-4">
              Can&apos;t Find What You&apos;re Looking For?
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
                href="/page/contact"
              >
                Contact Us
              </Button>
              <Button
                size="lg"
                variant="outline"
                color="white"
                component={Link}
                href="https://t.me/Luciachale"
              >
                Upload Design on Telegram
              </Button>
            </Group>
          </div>
        </Container>
      </section>
    </div>
  );
}