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
} from '@tabler/icons-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MotionDiv = motion.div;

// Navigation Links (Updated with About and Contact)
const navLinks = [
  { href: '/', label: 'Home', icon: IconHome },
  { href: '/page/services', label: 'Services', icon: IconPackage },
  { href: '/page/gallery', label: 'Gallery', icon: IconPhoto },
  { href: '/page/aboutus', label: 'About Us', icon: IconInfoCircle },
  { href: '/page/announcements', label: 'News', icon: IconBell },
  
];

// Services Dropdown Items
const serviceDropdownItems = [
  { label: 'DTF Printing', href: '/page/services/dtf', icon: '🖨️' },
  { label: 'T-Shirt Printing', href: '/page/services/tshirt', icon: '👕' },
  { label: 'Custom Stickers', href: '/page/services/stickers', icon: '🏷️' },
  { label: 'Banners & Signage', href: '/page/services/banners', icon: '📋' },
  { label: 'Vehicle Wraps', href: '/page/services/wraps', icon: '🚗' },
  { label: 'Business Cards', href: '/page/services/cards', icon: '💳' },
];

// Announcement Items
const announcementItems = [
  { 
    label: 'New Year Sale', 
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
    label: '20% Off First Order', 
    href: '/page/announcements/first-order-discount', 
    icon: '💰',
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
      contact: 'Contact',
      announcements: 'Announcements',
      login: 'Login',
      search: 'Search',
      dashboard: 'Dashboard',
      logout: 'Logout',
      printingServices: 'Printing Services',
      viewAll: 'View All Services',
      viewAllAnnouncements: 'View All Announcements',
      latestAnnouncements: 'Latest Announcements',
    },
    am: {
      home: 'መነሻ',
      services: 'አገልግሎቶች',
      gallery: 'ማዕከለ-ስዕላት',
      about: 'ስለ እኛ',
      contact: 'ያግኙን',
      announcements: 'ማስታወቂያዎች',
      login: 'ግባ',
      search: 'ፈልግ',
      dashboard: 'ዳሽቦርድ',
      logout: 'ውጣ',
      printingServices: 'የህትመት አገልግሎቶች',
      viewAll: 'ሁሉንም አገልግሎቶች ተመልከት',
      viewAllAnnouncements: 'ሁሉንም ማስታወቂያዎች ተመልከት',
      latestAnnouncements: 'የቅርብ ጊዜ ማስታወቂያዎች',
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
                 {/* Logo Text - Hidden on mobile, shown on sm and up */}
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

              {/* Mobile: Show only first letter or short name */}
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

          {/* Desktop Navigation - All links including About and Contact */}
          {!isLoggedIn && (
            <Group gap="xl" visibleFrom="md">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                
                if (link.label === 'Services') {
                  return (
                    <Menu
                      key={link.label}
                      trigger="hover"
                      openDelay={100}
                      closeDelay={400}
                      shadow="lg"
                      width={280}
                      position="bottom"
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
                        <Menu.Label>{t.printingServices}</Menu.Label>
                        {serviceDropdownItems.map((item) => (
                          <Menu.Item
                            key={item.href}
                            component={Link}
                            href={item.href}
                            leftSection={<span className="text-xl">{item.icon}</span>}
                          >
                            {item.label}
                          </Menu.Item>
                        ))}
                        <Menu.Divider />
                        <Menu.Item
                          component={Link}
                          href="/page/services"
                          leftSection={<IconPackage size={16} />}
                          rightSection={<IconChevronDown size={16} />}
                        >
                          {t.viewAll}
                        </Menu.Item>
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
                     link.label === 'Contact Us' ? t.contact : 
                     link.label}
                  </Button>
                );
              })}
            </Group>
          )}

          {/* Right Section - Actions */}
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

            {/* Search Button - Hidden on mobile */}
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

            {/* Language Selector - Simplified on mobile */}
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
        <Stack gap="lg">
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
                setDrawerOpened(false);
              }}
            >
              {language === 'en' ? 'አማርኛ' : 'English'}
            </Button>
          </Group>

          {/* Announcements Section in Mobile */}
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
                    <Menu.Label>{t.printingServices}</Menu.Label>
                    {serviceDropdownItems.map((item) => (
                      <Menu.Item
                        key={item.href}
                        component={Link}
                        href={item.href}
                        leftSection={<span className="text-xl">{item.icon}</span>}
                        onClick={() => setDrawerOpened(false)}
                      >
                        {item.label}
                      </Menu.Item>
                    ))}
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
                  href="/page/about"
                  onClick={() => setDrawerOpened(false)}
                >
                  {t.about}
                </Button>

                <Button
                  variant="subtle"
                  fullWidth
                  justify="space-between"
                  leftSection={<IconPhone size={18} />}
                  component={Link}
                  href="/page/contact"
                  onClick={() => setDrawerOpened(false)}
                >
                  {t.contact}
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
      </Drawer>
    </MotionDiv>
  );
}