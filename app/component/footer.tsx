'use client';

import { useState, FormEvent } from 'react';
import {
  Container,
  Grid,
  Text,
  Title,
  Group,
  Stack,
  TextInput,
  Button,
  ActionIcon,
  Divider,
  ThemeIcon,
  List,
  Paper,
  SimpleGrid,
} from '@mantine/core';
import {
  IconBrandFacebook,
  IconBrandTelegram,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconBrandYoutube,
  IconPhone,
  IconMail,
  IconMapPin,
  IconClock,
  IconSend,
  IconChevronRight,
  IconCertificate,
  IconHeart,
  IconCopyright,
  IconLanguage,
} from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, MotionProps } from 'framer-motion';

// Type definitions
type Language = 'en' | 'am';

interface FooterProps {
  language?: Language;
  onLanguageChange?: (lang: Language) => void;
}

interface QuickLink {
  label: string;
  href: string;
}

interface ServiceItem {
  label: string;
  href: string;
  icon: string;
}

interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  hours: string;
}

interface SocialLink {
  icon: React.ComponentType<{ size?: number }>;
  href: string;
  label: string;
  color: string;
}

interface PaymentMethod {
  name: string;
  icon: string;
}

interface Translations {
  about: string;
  aboutText: string;
  quickLinks: string;
  ourServices: string;
  contactInfo: string;
  newsletter: string;
  newsletterText: string;
  subscribe: string;
  enterEmail: string;
  subscribed: string;
  followUs: string;
  paymentMethods: string;
  copyright: string;
  privacy: string;
  terms: string;
  faq: string;
  careers: string;
}

interface TooltipProps {
  children: React.ReactNode;
  label: string;
  withArrow?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const MotionDiv = motion.div;

// Quick links data
const quickLinks: Record<Language, QuickLink[]> = {
  en: [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/page/aboutus' },
    { label: 'Services', href: '/page/services' },
    { label: 'Gallery', href: '/page/gallery' },
    { label: 'Announcements', href: '/page/announcements' },
    { label: 'Contact Us', href: '/page/contact' },
  ],
  am: [
    { label: 'መነሻ', href: '/' },
    { label: 'ስለ እኛ', href: '/page/aboutus' },
    { label: 'አገልግሎቶች', href: '/page/services' },
    { label: 'ማዕከለ-ስዕላት', href: '/page/gallery' },
    { label: 'ማስታወቂያዎች', href: '/page/announcements' },
    { label: 'ያግኙን', href: '/page/contact' },
  ],
};

// Services data
const services: Record<Language, ServiceItem[]> = {
  en: [
    { label: 'DTF Printing', href: '/page/services/dtf', icon: '🖨️' },
    { label: 'T-Shirt Printing', href: '/page/services/tshirt', icon: '👕' },
    { label: 'Custom Stickers', href: '/page/services/stickers', icon: '🏷️' },
    { label: 'Banners & Signage', href: '/page/services/banners', icon: '📋' },
    { label: 'Vehicle Wraps', href: '/page/services/wraps', icon: '🚗' },
    { label: 'Business Cards', href: '/page/services/cards', icon: '💳' },
  ],
  am: [
    { label: 'ዲቲኤፍ ህትመት', href: '/page/services/dtf', icon: '🖨️' },
    { label: 'ቲሸርት ህትመት', href: '/page/services/tshirt', icon: '👕' },
    { label: 'ስቲከር', href: '/page/services/stickers', icon: '🏷️' },
    { label: 'ባነር እና ምልክቶች', href: '/page/services/banners', icon: '📋' },
    { label: 'የመኪና መሸፈኛ', href: '/page/services/wraps', icon: '🚗' },
    { label: 'ቢዝነስ ካርድ', href: '/page/services/cards', icon: '💳' },
  ],
};

// Contact info
const contactInfo: Record<Language, ContactInfo> = {
  en: {
    phone: '+251 911 234 567',
    email: 'info@luciyaprinting.com',
    address: 'Bole Road, Addis Ababa, Ethiopia',
    hours: 'Mon-Fri: 8:30 AM - 6:00 PM, Sat: 9:00 AM - 2:00 PM',
  },
  am: {
    phone: '+251 911 234 567',
    email: 'info@luciyaprinting.com',
    address: 'ቦሌ መንገድ፣ አዲስ አበባ፣ ኢትዮጵያ',
    hours: 'ሰኞ-አርብ፡ 8:30 እስከ 6:00፣ ቅዳሜ፡ 9:00 እስከ 2:00',
  },
};

// Social media links
const socialLinks: SocialLink[] = [
  { icon: IconBrandFacebook, href: 'https://facebook.com/luciaprinting', label: 'Facebook', color: '#1877F2' },
  { icon: IconBrandTelegram, href: 'https://t.me/luciaprinting', label: 'Telegram', color: '#0088cc' },
  { icon: IconBrandInstagram, href: 'https://instagram.com/luciaprinting', label: 'Instagram', color: '#E4405F' },
  { icon: IconBrandLinkedin, href: 'https://linkedin.com/company/luciaprinting', label: 'LinkedIn', color: '#0A66C2' },
  { icon: IconBrandTwitter, href: 'https://twitter.com/luciaprinting', label: 'Twitter', color: '#1DA1F2' },
  { icon: IconBrandYoutube, href: 'https://youtube.com/@luciaprinting', label: 'YouTube', color: '#FF0000' },
];

// Payment methods
const paymentMethods: PaymentMethod[] = [
  { name: 'Telebirr', icon: '📱' },
  { name: 'CBE', icon: '🏦' },
  { name: 'Visa', icon: '💳' },
  { name: 'Mastercard', icon: '💳' },
  { name: 'Amole', icon: '📱' },
  { name: 'Cash', icon: '💵' },
];

// Custom Tooltip component with proper typing
const Tooltip: React.FC<TooltipProps> = ({ children, label, withArrow = false, position = 'top' }) => {
  const positionClasses = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-gray-900',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-900',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-gray-900',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-gray-900',
  };

  return (
    <div className="relative group">
      {children}
      <div className={`absolute ${positionClasses[position]} hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-50`}>
        {label}
        {withArrow && (
          <div className={`absolute ${arrowClasses[position]} border-4 border-transparent`} />
        )}
      </div>
    </div>
  );
};

export default function Footer({ language = 'en', onLanguageChange }: FooterProps) {
  const [email, setEmail] = useState<string>('');
  const [subscribed, setSubscribed] = useState<boolean>(false);
  const currentYear: number = new Date().getFullYear();

  const translations: Record<Language, Translations> = {
    en: {
      about: 'About Lucia Printing',
      aboutText: 'Your trusted partner for professional printing and advertising solutions in Ethiopia. Quality prints, fast delivery, exceptional service.',
      quickLinks: 'Quick Links',
      ourServices: 'Our Services',
      contactInfo: 'Contact Info',
      newsletter: 'Newsletter',
      newsletterText: 'Subscribe to get updates on promotions and new services',
      subscribe: 'Subscribe',
      enterEmail: 'Enter your email',
      subscribed: 'Subscribed! Thank you for subscribing.',
      followUs: 'Follow Us',
      paymentMethods: 'Payment Methods',
      copyright: 'Lucia Printing & Advertising. All rights reserved.',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      faq: 'FAQ',
      careers: 'Careers',
    },
    am: {
      about: 'ስለ ሉሲያ ህትመት',
      aboutText: 'በኢትዮጵያ ውስጥ ለሙያዊ ህትመት እና ማስታወቂያ መፍትሄዎች የታመነ አጋርዎ። ጥራት ያለው ህትመት፣ ፈጣን አቅርቦት፣ ልዩ አገልግሎት።',
      quickLinks: 'ፈጣን አገናኞች',
      ourServices: 'አገልግሎቶች',
      contactInfo: 'መረጃ ያግኙ',
      newsletter: 'ዜና መፅሄት',
      newsletterText: 'ስለ ማስተዋወቂያዎች እና አዳዲስ አገልግሎቶች ለማወቅ ይመዝገቡ',
      subscribe: 'ይመዝገቡ',
      enterEmail: 'ኢሜይልዎን ያስገቡ',
      subscribed: 'ተመዝግበዋል! ስለተመዘገቡ እናመሰግናለን።',
      followUs: 'ይከተሉን',
      paymentMethods: 'የክፍያ ዘዴዎች',
      copyright: 'ሉሲያ ህትመት እና ማስታወቂያ። መብቱ በህግ የተጠበቀ ነው።',
      privacy: 'የግላዊነት ፖሊሲ',
      terms: 'የአገልግሎት ውል',
      faq: 'በተደጋጋሚ የሚጠየቁ ጥያቄዎች',
      careers: 'ስራዎች',
    },
  };

  const t: Translations = translations[language];

  const handleSubscribe = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail('');
    }
  };

  const handleLanguageToggle = (): void => {
    if (onLanguageChange) {
      onLanguageChange(language === 'en' ? 'am' : 'en');
    }
  };

  const scrollToTop = (): void => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const motionProps: MotionProps = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
  };

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-6">
      <Container size="xl">
        {/* Main Footer Content */}
        <Grid gutter={40}>
          {/* About Section */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <MotionDiv {...motionProps} transition={{ duration: 0.5 }}>
              <Group gap="sm" mb="md">
                <div className="w-[50px] h-[50px] rounded-full overflow-hidden border-2 border-red-500">
                  <Image
                    src="/images/logo.jpg"
                    alt="Lucia Printing"
                    width={50}
                    height={50}
                    className="object-cover"
                  />
                </div>
                <div>
                  <Title order={3} className="text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Lucia
                  </Title>
                  <Text size="sm" className="text-red-400">
                    {language === 'en' ? 'Printing & Advertising' : 'ማተሚያ እና ማስታወቂያ'}
                  </Text>
                </div>
              </Group>
              
              <Text className="text-gray-400 leading-relaxed mb-6">
                {t.aboutText}
              </Text>

              {/* Social Links */}
              <div>
                <Text fw={600} mb="sm">{t.followUs}</Text>
                <Group gap="xs">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <Tooltip key={index} label={social.label} withArrow position="top">
                        <ActionIcon
                          component="a"
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          size="lg"
                          variant="filled"
                          className="bg-gray-800 hover:bg-red-600 transition-colors duration-300"
                          style={{ '--hover-bg': social.color } as React.CSSProperties}
                        >
                          <Icon size={18} />
                        </ActionIcon>
                      </Tooltip>
                    );
                  })}
                </Group>
              </div>
            </MotionDiv>
          </Grid.Col>

          {/* Quick Links */}
          <Grid.Col span={{ base: 6, md: 2 }}>
            <MotionDiv {...motionProps} transition={{ duration: 0.5, delay: 0.1 }}>
              <Title order={4} size="md" mb="md" className="text-white">
                {t.quickLinks}
              </Title>
              <List spacing="xs" styles={{ item: { color: '#9CA3AF' } }}>
                {quickLinks[language].map((link) => (
                  <List.Item key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-red-400 transition-colors duration-300 flex items-center gap-1"
                    >
                      <IconChevronRight size={14} />
                      {link.label}
                    </Link>
                  </List.Item>
                ))}
              </List>
            </MotionDiv>
          </Grid.Col>

          {/* Services */}
          <Grid.Col span={{ base: 6, md: 3 }}>
            <MotionDiv {...motionProps} transition={{ duration: 0.5, delay: 0.2 }}>
              <Title order={4} size="md" mb="md" className="text-white">
                {t.ourServices}
              </Title>
              <SimpleGrid cols={2} spacing="xs">
                {services[language].map((service) => (
                  <Link
                    key={service.href}
                    href={service.href}
                    className="text-gray-400 hover:text-red-400 transition-colors duration-300 flex items-center gap-2"
                  >
                    <span className="text-lg">{service.icon}</span>
                    <span className="text-sm">{service.label}</span>
                  </Link>
                ))}
              </SimpleGrid>
            </MotionDiv>
          </Grid.Col>

          {/* Contact & Newsletter */}
          <Grid.Col span={{ base: 12, md: 3 }}>
            <MotionDiv {...motionProps} transition={{ duration: 0.5, delay: 0.3 }}>
              <Title order={4} size="md" mb="md" className="text-white">
                {t.contactInfo}
              </Title>
              
              <Stack gap="sm" className="text-gray-400">
                <Group gap="sm" wrap="nowrap">
                  <IconPhone size={18} className="text-red-400 flex-shrink-0" />
                  <Text size="sm">{contactInfo[language].phone}</Text>
                </Group>
                <Group gap="sm" wrap="nowrap">
                  <IconMail size={18} className="text-red-400 flex-shrink-0" />
                  <Text size="sm">{contactInfo[language].email}</Text>
                </Group>
                <Group gap="sm" wrap="nowrap">
                  <IconMapPin size={18} className="text-red-400 flex-shrink-0" />
                  <Text size="sm">{contactInfo[language].address}</Text>
                </Group>
                <Group gap="sm" wrap="nowrap">
                  <IconClock size={18} className="text-red-400 flex-shrink-0" />
                  <Text size="sm">{contactInfo[language].hours}</Text>
                </Group>
              </Stack>

              {/* Newsletter */}
              <div className="mt-6">
                <Title order={5} size="sm" mb="xs" className="text-white">
                  {t.newsletter}
                </Title>
                <Text size="xs" className="text-gray-500 mb-3">
                  {t.newsletterText}
                </Text>
                
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <TextInput
                    placeholder={t.enterEmail}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    size="sm"
                    className="flex-1"
                    styles={{
                      input: {
                        backgroundColor: '#1F2937',
                        border: 'none',
                        color: 'white',
                        '&::placeholder': {
                          color: '#6B7280',
                        },
                      },
                    }}
                  />
                  <Button
                    type="submit"
                    color="red"
                    size="sm"
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <IconSend size={16} />
                  </Button>
                </form>
                
                {subscribed && (
                  <Text size="xs" className="text-green-400 mt-2">
                    {t.subscribed}
                  </Text>
                )}
              </div>
            </MotionDiv>
          </Grid.Col>
        </Grid>

        {/* Payment Methods */}
        <Divider className="my-8 border-gray-800" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <Text size="sm" className="text-gray-500 mb-2">{t.paymentMethods}</Text>
            <Group gap="xs">
              {paymentMethods.map((method, index) => (
                <Tooltip key={index} label={method.name} withArrow position="top">
                  <Paper
                    className="bg-gray-800 px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    <Text size="sm" className="text-gray-300">{method.icon} {method.name}</Text>
                  </Paper>
                </Tooltip>
              ))}
            </Group>
          </div>

          {/* Trust Badges */}
          <Group gap="md">
            <Tooltip label="Quality Certified" withArrow>
              <ThemeIcon size="lg" variant="filled" color="red" className="bg-red-600">
                <IconCertificate size={20} />
              </ThemeIcon>
            </Tooltip>
            <Tooltip label="Ethiopia Made" withArrow>
              <ThemeIcon size="lg" variant="filled" color="red" className="bg-red-600">
                <IconHeart size={20} />
              </ThemeIcon>
            </Tooltip>
          </Group>
        </div>

        {/* Bottom Bar */}
        <Divider className="my-8 border-gray-800" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <Text size="sm" className="text-gray-500 flex items-center gap-1">
            <IconCopyright size={14} />
            {currentYear} {t.copyright}
          </Text>
          
          <Group gap="lg">
            <Link href="/privacy" className="text-gray-500 hover:text-red-400 text-sm transition-colors">
              {t.privacy}
            </Link>
            <Link href="/terms" className="text-gray-500 hover:text-red-400 text-sm transition-colors">
              {t.terms}
            </Link>
            <Link href="/faq" className="text-gray-500 hover:text-red-400 text-sm transition-colors">
              {t.faq}
            </Link>
            <Link href="/careers" className="text-gray-500 hover:text-red-400 text-sm transition-colors">
              {t.careers}
            </Link>
          </Group>

          {/* Language Switch */}
          {onLanguageChange && (
            <Button
              variant="subtle"
              size="xs"
              leftSection={<IconLanguage size={14} />}
              onClick={handleLanguageToggle}
              className="text-gray-500 hover:text-red-400"
            >
              {language === 'en' ? 'አማርኛ' : 'English'}
            </Button>
          )}
        </div>

        {/* Back to Top Button */}
        <div className="flex justify-end mt-4">
          <Button
            variant="subtle"
            size="sm"
            onClick={scrollToTop}
            className="text-gray-500 hover:text-red-400"
            leftSection={<IconChevronRight size={16} className="rotate-[-90deg]" />}
          >
            {language === 'en' ? 'Back to Top' : 'ወደ ላይ ተመለስ'}
          </Button>
        </div>
      </Container>

      <style jsx>{`
        @media (max-width: 640px) {
          .grid {
            gap: 30px;
          }
        }
      `}</style>
    </footer>
  );
}