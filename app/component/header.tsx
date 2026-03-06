'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Group,
  Text,
  Button,
  Avatar,
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
} from '@mantine/core';
import {
  IconMenu2,
  IconChevronDown,
  IconUser,
  IconSearch,
  IconHome,
  IconPackage,
  IconPhoto,
  IconSun,
  IconMoon,
  IconLanguage,
  IconLogout,
  IconInfoCircle,
  IconPhone,
  IconBell,
  IconSpeakerphone,
  IconShirt,
  IconTags,
  IconDeviceLaptop,
  IconCup,
  IconLamp,
  IconFlame,
  IconSnowflake,
  IconScissors,
  IconPrinter,
  IconCar,
  IconFileText,
  IconBox,
  IconGift,
  IconBrush,
  IconStar,
} from '@tabler/icons-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MotionDiv = motion.div;

// Services dropdown items organized by category
const serviceCategories = [
  {
    category: 'Apparel Printing',
    icon: <IconShirt size={16} />,
    items: [
      { label: 'DTF Printing', href: '/page/services/dtf', icon: '🖨️', badge: 'Popular' },
      { label: 'T-Shirt Printing', href: '/page/services/tshirt', icon: '👕', badge: 'Best Seller' },
      { label: 'Custom Hats & Caps', href: '/page/services/hats', icon: '🧢', badge: 'Trending' },
      { label: 'Hoodies & Sweatshirts', href: '/page/services/hoodies', icon: '👚' },
      { label: 'Screen Printing', href: '/page/services/screen-printing', icon: '🖨️' },
      { label: 'Embroidery', href: '/page/services/embroidery', icon: '🧵', badge: 'Premium' },
      { label: 'Tote Bags', href: '/page/services/totes', icon: '👜', badge: 'Eco' },
    ],
  },
  {
    category: 'Large Format',
    icon: <IconPrinter size={16} />,
    items: [
      { label: 'Banner Printing', href: '/page/services/banners', icon: '📋', badge: 'Popular' },
      { label: 'Posters', href: '/page/services/posters', icon: '🖼️' },
      { label: 'Vehicle Wraps', href: '/page/services/wraps', icon: '🚗', badge: 'Professional' },
      { label: 'Light Box', href: '/page/services/light-box', icon: '💡', badge: 'Premium' },
      { label: 'Neo Light (LED Neon)', href: '/page/services/neo-light', icon: '✨', badge: 'Trending' },
      { label: 'Cutout Letters', href: '/page/services/cutout', icon: '✂️' },
    ],
  },
  {
    category: 'Stickers & Labels',
    icon: <IconTags size={16} />,
    items: [
      { label: 'Custom Stickers', href: '/page/services/stickers', icon: '🏷️', badge: 'Popular' },
      { label: 'Product Labels', href: '/page/services/labels', icon: '📦', badge: 'Business' },
      { label: 'Frosted Glass', href: '/page/services/frosted', icon: '❄️', badge: 'Elegant' },
    ],
  },
  {
    category: 'Drinkware',
    icon: <IconCup size={16} />,
    items: [
      { label: 'Mug Printing', href: '/page/services/mugs', icon: '☕', badge: 'Gift Idea' },
      { label: 'Bottle Printing', href: '/page/services/bottles', icon: '🧴', badge: 'Eco' },
    ],
  },
  {
    category: 'Print & Promo',
    icon: <IconFileText size={16} />,
    items: [
      { label: 'Business Cards', href: '/page/services/business-cards', icon: '💳', badge: 'Essential' },
      { label: 'Flyers & Brochures', href: '/page/services/flyers', icon: '📄' },
      { label: 'Custom Packaging', href: '/page/services/packaging', icon: '📦', badge: 'Premium' },
      { label: 'Custom Pens', href: '/page/services/pens', icon: '✒️' },
      { label: 'Keychains', href: '/page/services/keychains', icon: '🔑' },
    ],
  },
  {
    category: 'Specialty',
    icon: <IconStar size={16} />,
    items: [
      { label: 'Laser Engraving', href: '/page/services/engraving', icon: '🔥', badge: 'Precision' },
      { label: 'Graphic Design', href: '/page/services/design', icon: '🎨', badge: 'Creative' },
    ],
  },
];

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

// Mock auth state
const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      setIsLoggedIn(false);
    };
    checkAuth();
  }, []);
  return { isLoggedIn, user: isLoggedIn ? { name: 'John Doe' } : null };
};

// Navigation Links
const navLinks = [
  { href: '/', label: 'Home', icon: IconHome },
  { href: '/page/services', label: 'Services', icon: IconPackage, hasDropdown: true },
  { href: '/page/gallery', label: 'Gallery', icon: IconPhoto },
  { href: '/page/aboutus', label: 'About Us', icon: IconInfoCircle },
  { href: '/page/announcements', label: 'News', icon: IconBell },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [language, setLanguage] = useState<'en' | 'am'>('en');
  const [announcementCount, setAnnouncementCount] = useState(4);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';
  const pathname = usePathname();
  const { isLoggedIn } = useAuth();
  
  const { scrollY } = useScroll();
  const headerHeight = useTransform(scrollY, [0, 100], [80, 80]);
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.95]);
  const headerBlur = useTransform(scrollY, [0, 100], [0, 10]);

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

  const translations = {
    en: {
      home: 'Home',
      services: 'Services',
      gallery: 'Gallery',
      about: 'About',
      announcements: 'Announcements',
      login: 'Login',
      search: 'Search',
      dashboard: 'Dashboard',
      logout: 'Logout',
      printingServices: 'Our Printing Services',
      viewAll: 'View All Services',
      viewAllAnnouncements: 'View All Announcements',
      latestAnnouncements: 'Latest Announcements',
      allServices: 'All Services',
      categories: 'Categories',
    },
    am: {
      home: 'መነሻ',
      services: 'አገልግሎቶች',
      gallery: 'ማዕከለ-ስዕላት',
      about: 'ስለ እኛ',
      announcements: 'ማስታወቂያዎች',
      login: 'ግባ',
      search: 'ፈልግ',
      dashboard: 'ዳሽቦርድ',
      logout: 'ውጣ',
      printingServices: 'የህትመት አገልግሎቶች',
      viewAll: 'ሁሉንም አገልግሎቶች ተመልከት',
      viewAllAnnouncements: 'ሁሉንም ማስታወቂያዎች ተመልከት',
      latestAnnouncements: 'የቅርብ ጊዜ ማስታወቂያዎች',
      allServices: 'ሁሉም አገልግሎቶች',
      categories: 'ምድቦች',
    },
  };

  const t = translations[language];

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
                 {language === 'en' ? 'Printing & Advertising' : 'ማተሚያ እና ማስታወቂያ'}
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
          {!isLoggedIn && (
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
                            <span>{t.services}</span>
                          </Group>
                        </Button>
                      </Menu.Target>

                      <Menu.Dropdown>
                        <ScrollArea.Autosize mah={500} type="scroll">
                          <div className="p-2">
                            {/* Header */}
                            <div className="px-3 py-2 mb-2 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg">
                              <Text fw={700} size="lg" className="text-red-600 dark:text-red-400">
                                {t.printingServices}
                              </Text>
                              <Text size="xs" c="dimmed">
                                Choose from our wide range of professional printing services
                              </Text>
                            </div>

                            {/* Services by Category */}
                            <div className="grid grid-cols-2 gap-4">
                              {serviceCategories.map((category, idx) => (
                                <div key={idx} className="space-y-1">
                                  <div className="flex items-center gap-1 px-3 py-1">
                                    <span className="text-red-500">{category.icon}</span>
                                    <Text fw={600} size="sm" className="text-gray-700 dark:text-gray-300">
                                      {category.category}
                                    </Text>
                                  </div>
                                  <div className="space-y-0.5">
                                    {category.items.map((item, itemIdx) => (
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
                                              color={
                                                item.badge === 'Popular' ? 'red' :
                                                item.badge === 'Best Seller' ? 'orange' :
                                                item.badge === 'Trending' ? 'pink' :
                                                item.badge === 'Premium' ? 'grape' :
                                                item.badge === 'Eco' ? 'green' :
                                                item.badge === 'Professional' ? 'blue' :
                                                item.badge === 'Gift Idea' ? 'yellow' :
                                                item.badge === 'Essential' ? 'gray' : 'red'
                                              }
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
                                  </div>
                                </div>
                              ))}
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
                                <Text fw={600}>{t.viewAll}</Text>
                              </Menu.Item>
                            </div>
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
                    {link.label === 'Home' ? t.home : 
                     link.label === 'Gallery' ? t.gallery :
                     link.label === 'About Us' ? t.about :
                     link.label === 'Announcements' ? t.announcements : 
                     link.label}
                  </Button>
                );
              })}
            </Group>
          )}

          {/* Right Section - Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Announcements Button */}
            <Menu shadow="lg" width={320} position="bottom-end">
              <Menu.Target>
                <Indicator
                  inline
                  label={announcementCount}
                  size={14}
                  color="red"
                  offset={4}
                  disabled={announcementCount === 0}
                >
                  <Tooltip label={t.announcements} withArrow position="bottom">
                    <ActionIcon
                      size="md"
                      variant="subtle"
                      className={scrolled 
                        ? 'text-gray-700 dark:text-gray-300' 
                        : 'text-white'
                      }
                    >
                      <IconBell size={18} /> 
                    </ActionIcon>
                  </Tooltip>
                </Indicator>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>{t.latestAnnouncements}</Menu.Label>
                {announcementItems.map((item) => (
                  <Menu.Item
                    key={item.href}
                    component={Link}
                    href={item.href}
                    leftSection={<span className="text-xl">{item.icon}</span>}
                    rightSection={
                      <Badge color={item.color} size="xs">
                        {item.badge}
                      </Badge>
                    }
                  >
                    <Text size="sm">{item.label}</Text>
                  </Menu.Item>
                ))}
                <Menu.Divider />
                <Menu.Item
                  component={Link}
                  href="/page/announcements"
                  leftSection={<IconSpeakerphone size={16} />}
                  rightSection={<IconChevronDown size={16} />}
                >
                  {t.viewAllAnnouncements}
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>

            {/* Search Button */}
            <div className="hidden sm:block">
              <Tooltip label={t.search} withArrow position="bottom">
                <ActionIcon
                  size="md"
                  variant="subtle"
                  className={scrolled 
                    ? 'text-gray-700 dark:text-gray-300' 
                    : 'text-white'
                  }
                >
                  <IconSearch size={18} />
                </ActionIcon>
              </Tooltip>
            </div>

            {/* Dark/Light Mode Toggle */}
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

            {/* Language Selector */}
            <Menu shadow="md" width={100} position="bottom-end">
              <Menu.Target>
                <Button
                  variant="subtle"
                  size="xs"
                  leftSection={<IconLanguage size={16} />}
                  rightSection={<IconChevronDown size={12} />}
                  className={scrolled 
                    ? 'text-gray-700 dark:text-gray-300' 
                    : 'text-white'
                  }
                  styles={{
                    root: {
                      minWidth: '60px',
                      padding: '4px 8px',
                    },
                  }}
                >
                  {language === 'en' ? 'EN' : 'አማ'}
                </Button>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  onClick={() => setLanguage('en')}
                  className={language === 'en' ? 'bg-red-50 text-red-600' : ''}
                >
                  English
                </Menu.Item>
                <Menu.Item
                  onClick={() => setLanguage('am')}
                  className={language === 'am' ? 'bg-red-50 text-red-600' : ''}
                >
                  አማርኛ
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>

            {/* Conditional Login/Dashboard Button */}
            {!isLoggedIn ? (
              <Button
                variant={scrolled ? 'filled' : 'outline'}
                color="red"
                size="xs"
                radius="xl"
                component={Link}
                href="/page/login"
                leftSection={<IconUser size={16} />}
                className={!scrolled ? 'border-2 border-white text-white hover:bg-white/10' : ''}
                styles={{
                  root: {
                    minWidth: '70px',
                    height: '36px',
                  },
                }}
              >
                <span className="hidden xs:inline">{t.login}</span>
                <span className="xs:hidden">Login</span>
              </Button>
            ) : (
              <Menu shadow="lg" width={180} position="bottom-end">
                <Menu.Target>
                  <Button
                    variant={scrolled ? 'light' : 'outline'}
                    color="red"
                    radius="xl"
                    size="xs"
                    rightSection={<IconChevronDown size={14} />}
                    className={!scrolled ? 'border-2 border-white text-white hover:bg-white/10' : ''}
                    styles={{
                      root: {
                        minWidth: '90px',
                        height: '36px',
                      },
                    }}
                  >
                    <Group gap={4}>
                      <Avatar size="sm" radius="xl" color="red">JD</Avatar>
                      <span className="hidden sm:inline">{t.dashboard}</span>
                    </Group>
                  </Button>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Label>{t.dashboard}</Menu.Label>
                  <Menu.Item component={Link} href="/dashboard" leftSection={<IconPackage size={14} />}>
                    {t.dashboard}
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item leftSection={<IconLogout size={14} />} color="red">
                    {t.logout}
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            )}

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
              <Text size="xs" c="dimmed">{language === 'en' ? 'Menu' : 'ምናሌ'}</Text>
            </div>
          </Group>
        }
      >
        <ScrollArea h="calc(100vh - 100px)" type="scroll">
          <Stack gap="lg" pr="md">
            {/* Quick Actions */}
            <Group grow>
              <Button 
                variant="light" 
                color="red" 
                leftSection={<IconSearch size={18} />}
                onClick={() => setDrawerOpened(false)}
              >
                {t.search}
              </Button>
              <Button 
                variant="light" 
                leftSection={<IconLanguage size={18} />}
                onClick={() => {
                  setLanguage(prev => prev === 'en' ? 'am' : 'en');
                }}
              >
                {language === 'en' ? 'አማርኛ' : 'English'}
              </Button>
            </Group>

            {/* Announcements Section */}
            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              <Group justify="space-between" mb="xs">
                <Group gap="xs">
                  <IconBell size={18} className="text-red-600" />
                  <Text fw={600} size="sm">{t.announcements}</Text>
                </Group>
                <Badge color="red" size="sm">{announcementCount} New</Badge>
              </Group>
              <Stack gap="xs">
                {announcementItems.slice(0, 2).map((item) => (
                  <Button
                    key={item.href}
                    variant="subtle"
                    fullWidth
                    justify="space-between"
                    leftSection={<span className="text-xl">{item.icon}</span>}
                    rightSection={<Badge color={item.color} size="xs">{item.badge}</Badge>}
                    component={Link}
                    href={item.href}
                    onClick={() => setDrawerOpened(false)}
                    size="sm"
                  >
                    {item.label}
                  </Button>
                ))}
                <Button
                  variant="light"
                  color="red"
                  size="xs"
                  component={Link}
                  href="/page/announcements"
                  onClick={() => setDrawerOpened(false)}
                >
                  {t.viewAllAnnouncements}
                </Button>
              </Stack>
            </div>

            {/* Navigation Links */}
            {!isLoggedIn ? (
              <>
                <Divider label={t.services} labelPosition="center" />
                
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
                    {t.home}
                  </Button>

                  {/* Services with nested menu */}
                  <Menu shadow="lg" width="100%" position="bottom">
                    <Menu.Target>
                      <Button
                        variant="subtle"
                        fullWidth
                        justify="space-between"
                        leftSection={<IconPackage size={18} />}
                        rightSection={<IconChevronDown size={16} />}
                      >
                        {t.services}
                      </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <ScrollArea.Autosize mah={400} type="scroll">
                        {serviceCategories.map((category, idx) => (
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
                                    <Badge size="xs" variant="light">{item.badge}</Badge>
                                  )
                                }
                                onClick={() => setDrawerOpened(false)}
                              >
                                {item.label}
                              </Menu.Item>
                            ))}
                            {idx < serviceCategories.length - 1 && <Menu.Divider />}
                          </div>
                        ))}
                      </ScrollArea.Autosize>
                      <Menu.Divider />
                      <Menu.Item
                        component={Link}
                        href="/page/services"
                        leftSection={<IconPackage size={16} />}
                        onClick={() => setDrawerOpened(false)}
                      >
                        {t.viewAll}
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
                    {t.gallery}
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
                    {t.about}
                  </Button>
                </Stack>

                <Divider />

                <Button
                  fullWidth
                  variant="filled"
                  color="red"
                  size="lg"
                  leftSection={<IconUser size={18} />}
                  component={Link}
                  href="/page/login"
                  onClick={() => setDrawerOpened(false)}
                >
                  {t.login}
                </Button>
              </>
            ) : (
              <>
                <Divider label={t.dashboard} labelPosition="center" />
                <Button
                  fullWidth
                  variant="light"
                  color="red"
                  size="lg"
                  leftSection={<IconPackage size={18} />}
                  component={Link}
                  href="/dashboard"
                  onClick={() => setDrawerOpened(false)}
                >
                  {t.dashboard}
                </Button>
                <Button
                  fullWidth
                  variant="outline"
                  color="red"
                  size="lg"
                  leftSection={<IconLogout size={18} />}
                  onClick={() => setDrawerOpened(false)}
                >
                  {t.logout}
                </Button>
              </>
            )}
          </Stack>
        </ScrollArea>
      </Drawer>
    </MotionDiv>
  );
}