/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Group,
  Text,
  Button,
  Menu,
  Drawer,
  Stack,
  ActionIcon,
  Divider,
  Tooltip,
  Badge,
  Indicator,
  useMantineColorScheme,
  ScrollArea,
  Loader,
} from '@mantine/core';
import {
  IconMenu2,
  IconChevronDown,
  IconSearch,
  IconHome,
  IconPackage,
  IconPhoto,
  IconSun,
  IconMoon,
  IconInfoCircle,
  IconBell,
  IconSpeakerphone,
  IconShirt,
  IconTags,
  IconPrinter,
  IconCar,
  IconFileText,
  IconBox,
  IconGift,
  IconBrush,
  IconStar,
  IconCup,
  IconLamp,
  IconFlame,
  IconSnowflake,
  IconScissors,
} from '@tabler/icons-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MotionDiv = motion.div;

// API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL ||'https://lucia-backend-iumb.onrender.com'|| 'http://localhost:5000';

// Icon mapping for category icons
const iconMap: Record<string, any> = {
  Shirt: IconShirt,
  ShoppingBag: IconGift,
  Megaphone: IconPrinter,
  Camera: IconPhoto,
  Car: IconCar,
  Lightbulb: IconLamp,
  Sparkles: IconStar,
  Tag: IconTags,
  Snowflake: IconSnowflake,
  Coffee: IconCup,
  Wine: IconCup,
  FileText: IconFileText,
  Package: IconBox,
  Pen: IconBrush,
  Key: IconTags,
  Flame: IconFlame,
  Printer: IconPrinter,
  Scissors: IconScissors,
  Palette: IconBrush,
};

// Emoji fallbacks for icons
const iconEmojis: Record<string, string> = {
  Shirt: '👕',
  ShoppingBag: '🛍️',
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
  Printer: '🖨️',
  Scissors: '✂️',
  Palette: '🎨',
};

// Badge color mapping
const badgeColorMap: Record<string, string> = {
  'Most Popular': 'red',
  'Popular': 'red',
  'Best Seller': 'orange',
  'Trending': 'pink',
  'Premium': 'grape',
  'Eco-Friendly': 'green',
  'Eco': 'green',
  'Professional': 'blue',
  'Gift Idea': 'yellow',
  'Essential': 'gray',
  'Creative': 'violet',
  'Precision': 'cyan',
  'Elegant': 'teal',
  'Versatile': 'lime',
  'Marketing': 'indigo',
  'Business': 'cyan',
  'Budget Friendly': 'green',
};

// Announcement Items
const announcementItems = [
  { 
    label: 'New Year Sale - 20% Off', 
    href: '/page/announcements/new-year-sale', 
    icon: '🎉',
    badge: 'NEW',
    color: 'red'
  },
  { 
    label: 'DTF Printing Launch', 
    href: '/page/announcements/dtf-launch', 
    icon: '🖨️',
    badge: 'HOT',
    color: 'orange'
  },
  { 
    label: 'Holiday Hours', 
    href: '/page/announcements/holiday-hours', 
    icon: '📅',
    badge: 'INFO',
    color: 'blue'
  },
  { 
    label: 'Free Delivery on Orders > 1000 ETB', 
    href: '/page/announcements/free-delivery', 
    icon: '🚚',
    badge: 'OFFER',
    color: 'green'
  },
];

// Navigation Links
const navLinks = [
  { href: '/', label: 'Home', icon: IconHome },
  { href: '/page/services', label: 'Services', icon: IconPackage, hasDropdown: true },
  { href: '/page/gallery', label: 'Gallery', icon: IconPhoto },
  { href: '/page/aboutus', label: 'About Us', icon: IconInfoCircle },
  { href: '/page/announcements', label: 'Annoncements', icon: IconBell },
];

// Types
interface Category {
  id: string;
  name: string;
  slug: string;
  icon_name: string;
  display_order: number;
}

interface Service {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  icon_name: string;
  badge: string | null;
  category: string;
  is_featured: boolean;
  is_popular: boolean;
  is_new: boolean;
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [announcementCount] = useState(4);
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';
  const pathname = usePathname();
  
  const { scrollY } = useScroll();
  const headerHeight = useTransform(scrollY, [0, 100], [80, 80]);
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.95]);
  const headerBlur = useTransform(scrollY, [0, 100], [0, 10]);

  // Fetch categories and services
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch categories
        const categoriesResponse = await fetch(`${API_URL}/api/public/services/categories/all`);
        const categoriesData = await categoriesResponse.json();
        
        if (categoriesData.success) {
          setCategories(categoriesData.data);
        }

        // Fetch all active services
        const servicesResponse = await fetch(`${API_URL}/api/public/services`);
        const servicesData = await servicesResponse.json();
        
        if (servicesData.success) {
          setServices(servicesData.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return pathname === href;
    return pathname.startsWith(href);
  };

  // Group services by category
  const servicesByCategory = categories.map(category => {
    const categoryServices = services
      .filter(service => service.category === category.slug)
      .map(service => ({
        label: service.title,
        href: `/page/services/${service.slug}`,
        icon: iconEmojis[service.icon_name] || '🖨️',
        badge: service.badge || (service.is_popular ? 'Popular' : service.is_new ? 'New' : null),
      }));
    
    return {
      category: category.name,
      icon: iconMap[category.icon_name] || IconPackage,
      items: categoryServices,
    };
  }).filter(cat => cat.items.length > 0);

  // If no categories with services, use fallback
  const displayCategories = servicesByCategory.length > 0 ? servicesByCategory : [
    {
      category: 'All Services',
      icon: IconPackage,
      items: services.map(service => ({
        label: service.title,
        href: `/page/services/${service.slug}`,
        icon: iconEmojis[service.icon_name] || '🖨️',
        badge: service.badge || (service.is_popular ? 'Popular' : service.is_new ? 'New' : null),
      })),
    },
  ];

  return (
    <MotionDiv
      style={{
        height: headerHeight,
        opacity: headerOpacity,
        backdropFilter: `blur(${headerBlur}px)`,
      }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/90 dark:bg-gray-900/90 shadow-xl border-b border-gray-200 dark:border-gray-800' 
          : 'bg-transparent'
      }`}
    >
      <Container size="xl" className="h-full">
        <Group justify="space-between" align="center" className="h-full">
          {/* Logo Section */}
          <Group gap="xs">
            <Link href="/" className="flex items-center gap-2 no-underline">
              <div className="relative">
                <div className="w-[45px] h-[45px] rounded-full overflow-hidden border-2 border-black">
                  <Image
                    src="/images/logo.jpg"
                    alt="Lucia Printing Logo"
                    width={45}
                    height={45}
                    className="object-cover"
                    priority
                  />
                </div>
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              </div>

              {/* Logo Text */}
              <div className="hidden sm:flex flex-col min-w-0">
                <Text
                  size="lg"
                  fw={800}
                  className={`leading-tight truncate ${
                    scrolled 
                      ? 'text-gray-900 dark:text-white' 
                      : 'text-white'
                  }`}
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  Lucia
                </Text>
                <Text
                  size="sm"
                  fw={600}
                  className={`leading-tight truncate ${
                    scrolled 
                      ? 'text-red-600 dark:text-red-400' 
                      : 'text-red-400'
                  }`}
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  Printing & Advertising
                </Text>
              </div>

              {/* Mobile: Short logo */}
              <div className="sm:hidden flex flex-col">
                <Text
                  size="md"
                  fw={800}
                  className={`leading-tight ${
                    scrolled 
                      ? 'text-gray-900 dark:text-white' 
                      : 'text-white'
                  }`}
                >
                  L
                </Text>
              </div>
            </Link>
          </Group>

          {/* Desktop Navigation */}
          <Group gap="xl" visibleFrom="md">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              
              if (link.hasDropdown) {
                return (
                  <Menu
                    key={link.label}
                    trigger="hover"
                    openDelay={100}
                    closeDelay={400}
                    shadow="lg"
                    width={600}
                    position="bottom"
                    withinPortal
                  >
                    <Menu.Target>
                      <Button
                        variant="subtle"
                        rightSection={<IconChevronDown size={16} />}
                        className={`font-medium ${
                          scrolled 
                            ? active ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400'
                            : active ? 'text-red-400' : 'text-white hover:text-red-400'
                        }`}
                        styles={{
                          root: {
                            '&:hover': {
                              backgroundColor: 'transparent',
                            },
                          },
                        }}
                      >
                        <Group gap="xs">
                          <Icon size={18} />
                          <span>Services</span>
                        </Group>
                      </Button>
                    </Menu.Target>

                    <Menu.Dropdown>
                      <ScrollArea.Autosize mah={500} type="scroll">
                        <div className="p-2">
                          {/* Header */}
                          <div className="px-3 py-2 mb-2 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg">
                            <Text fw={700} size="lg" className="text-red-600 dark:text-red-400">
                              Our Printing Services
                            </Text>
                            <Text size="xs" c="dimmed">
                              {loading ? 'Loading...' : 'Choose from our wide range of professional printing services'}
                            </Text>
                          </div>

                          {/* Loading State */}
                          {loading ? (
                            <div className="py-8 text-center">
                              <Loader size="sm" />
                              <Text size="sm" c="dimmed" mt="xs">Loading...</Text>
                            </div>
                          ) : (
                            <>
                              {/* Services by Category */}
                              <div className="grid grid-cols-2 gap-4">
                                {displayCategories.map((category, idx) => {
                                  const CategoryIcon = category.icon;
                                  return (
                                    <div key={idx} className="space-y-1">
                                      <div className="flex items-center gap-1 px-3 py-1">
                                        <CategoryIcon size={14} className="text-red-500" />
                                        <Text fw={600} size="sm" className="text-gray-700 dark:text-gray-300">
                                          {category.category}
                                        </Text>
                                      </div>
                                      <div className="space-y-0.5">
                                        {category.items.slice(0, 5).map((item, itemIdx) => (
                                          <Menu.Item
                                            key={itemIdx}
                                            component={Link}
                                            href={item.href}
                                            leftSection={<span className="text-lg w-6">{item.icon}</span>}
                                            rightSection={
                                              item.badge && (
                                                <Badge 
                                                  size="xs" 
                                                  variant="light" 
                                                  color={badgeColorMap[item.badge] || 'red'}
                                                >
                                                  {item.badge}
                                                </Badge>
                                              )
                                            }
                                            className="text-sm"
                                          >
                                            {item.label}
                                          </Menu.Item>
                                        ))}
                                        {category.items.length > 5 && (
                                          <Text size="xs" c="dimmed" className="px-3 pt-1">
                                            +{category.items.length - 5} more
                                          </Text>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Footer Link */}
                              <div className="mt-4 pt-2 border-t border-gray-200 dark:border-gray-700">
                                <Menu.Item
                                  component={Link}
                                  href="/page/services"
                                  leftSection={<IconPackage size={16} />}
                                  rightSection={<IconChevronDown size={16} />}
                                  className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20"
                                >
                                  <Text fw={600}>View All Services</Text>
                                </Menu.Item>
                              </div>
                            </>
                          )}
                        </div>
                      </ScrollArea.Autosize>
                    </Menu.Dropdown>
                  </Menu>
                );
              }

              return (
                <Button
                  key={link.label}
                  variant="subtle"
                  component={Link}
                  href={link.href}
                  className={`font-medium ${
                    scrolled 
                      ? active ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400'
                      : active ? 'text-red-400' : 'text-white hover:text-red-400'
                  }`}
                  styles={{
                    root: {
                      '&:hover': {
                        backgroundColor: 'transparent',
                      },
                    },
                  }}
                  leftSection={<Icon size={18} />}
                >
                  {link.label}
                </Button>
              );
            })}
              <Tooltip label={dark ? 'Light mode' : 'Dark mode'} withArrow position="bottom">
              <ActionIcon
                size="md"
                variant="subtle"
                onClick={() => toggleColorScheme()}
                className={scrolled 
                  ? 'text-gray-700 dark:text-gray-300' 
                  : 'text-white'
                }
              >
                {dark ? <IconSun size={18} /> : <IconMoon size={18} />}
              </ActionIcon>
            </Tooltip>
          </Group>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-0 sm:gap-0">
          

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <ActionIcon
                size="md"
                variant="subtle"
                onClick={() => setDrawerOpened(true)}
                className={`md:hidden ${scrolled ? 'text-gray-700' : 'text-white'}`}
              >
                <IconMenu2 size={20} />
              </ActionIcon>
            </div>
          </div>
        </Group>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        position="right"
        size="100%"
        padding="md"
        hiddenFrom="md"
        title={
          <Group gap="xs">
            <div className="w-[30px] h-[30px] rounded-full overflow-hidden border border-gray-300">
              <Image
                src="/images/logo.jpg"
                alt="Lucia Printing Logo"
                width={30}
                height={30}
                className="object-cover"
              />
            </div>
            <div>
              <Text fw={700} size="sm">Lucia Printing</Text>
              <Text size="xs" c="dimmed">Menu</Text>
            </div>
          </Group>
        }
      >
        <ScrollArea h="calc(100vh - 100px)" type="scroll">
          <Stack gap="lg" pr="md">
            <Stack gap="xs">
              <Button
                variant="subtle"
                fullWidth
                justify="space-between"
                leftSection={<IconHome size={18} />}
                component={Link}
                href="/"
                onClick={() => setDrawerOpened(false)}
              >
                Home
              </Button>

              {/* Services with nested menu - Mobile version */}
              <Menu shadow="lg" width="100%" position="bottom">
                <Menu.Target>
                  <Button
                    variant="subtle"
                    fullWidth
                    justify="space-between"
                    leftSection={<IconPackage size={18} />}
                    rightSection={<IconChevronDown size={16} />}
                  >
                    Services
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <ScrollArea.Autosize mah={400} type="scroll">
                    {loading ? (
                      <div className="py-4 text-center">
                        <Loader size="sm" />
                        <Text size="xs" c="dimmed" mt="xs">Loading...</Text>
                      </div>
                    ) : (
                      displayCategories.map((category, idx) => (
                        <div key={idx}>
                          <Menu.Label>{category.category}</Menu.Label>
                          {category.items.map((item, itemIdx) => (
                            <Menu.Item
                              key={itemIdx}
                              component={Link}
                              href={item.href}
                              leftSection={<span className="text-lg">{item.icon}</span>}
                              rightSection={
                                item.badge && (
                                  <Badge size="xs" variant="light" color={badgeColorMap[item.badge] || 'red'}>
                                    {item.badge}
                                  </Badge>
                                )
                              }
                              onClick={() => setDrawerOpened(false)}
                            >
                              {item.label}
                            </Menu.Item>
                          ))}
                          {idx < displayCategories.length - 1 && <Menu.Divider />}
                        </div>
                      ))
                    )}
                  </ScrollArea.Autosize>
                  <Menu.Divider />
                  <Menu.Item
                    component={Link}
                    href="/page/services"
                    leftSection={<IconPackage size={16} />}
                    onClick={() => setDrawerOpened(false)}
                  >
                    View All Services
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>

              <Button
                variant="subtle"
                fullWidth
                justify="space-between"
                leftSection={<IconPhoto size={18} />}
                component={Link}
                href="/page/gallery"
                onClick={() => setDrawerOpened(false)}
              >
                Gallery
              </Button>

              <Button
                variant="subtle"
                fullWidth
                justify="space-between"
                leftSection={<IconInfoCircle size={18} />}
                component={Link}
                href="/page/aboutus"
                onClick={() => setDrawerOpened(false)}
              >
                About Us
              </Button>
                <Button
                variant="subtle"
                fullWidth
                justify="space-between"
                leftSection={<IconPhoto size={18} />}
                component={Link}
                href="/page/announcements"
                onClick={() => setDrawerOpened(false)}
              >
                Announcements
              </Button>

            </Stack>
          </Stack>
        </ScrollArea>
      </Drawer>
    </MotionDiv>
  );
}