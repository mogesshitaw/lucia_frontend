/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Container, Title, Text, Button, Grid, Card, Group, ThemeIcon, Badge, SimpleGrid, Stack, ActionIcon, Tooltip, Paper, TextInput, Textarea, Select, Radio, Checkbox, Alert } from '@mantine/core';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useRef } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  DollarSign,
  Headphones,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  ChevronRight,
  Copy,
  ExternalLink,
  Navigation,
  Calendar,
  User,
  FileText,
  HelpCircle,
  RefreshCw,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const MotionDiv = motion.div;
const MotionSection = motion.section;
const MotionCard = motion(Card as any );

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

// Contact Info Card
const ContactInfoCard = ({ icon, title, content, link, color }: { icon: React.ReactNode; title: string; content: string; link?: string; color: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="relative overflow-hidden group"
      padding="xl"
      radius="lg"
      withBorder
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
      
      <Group>
        <ThemeIcon
          size={50}
          radius="xl"
          variant="gradient"
          gradient={{ from: color.split(' ')[0].replace('from-', ''), to: color.split(' ')[1].replace('to-', '') }}
        >
          {icon}
        </ThemeIcon>
        <div className="flex-1">
          <Text size="sm" c="dimmed">{title}</Text>
          {link ? (
            <Link href={link} className="text-lg font-semibold hover:text-red-600 transition-colors">
              {content}
            </Link>
          ) : (
            <Text fw={600} size="lg">{content}</Text>
          )}
        </div>
        <Tooltip label={copied ? 'Copied!' : 'Copy'} withArrow>
          <ActionIcon
            variant="subtle"
            color={copied ? 'green' : 'gray'}
            onClick={handleCopy}
            className="hover:scale-110 transition-transform"
          >
            {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
          </ActionIcon>
        </Tooltip>
      </Group>
    </MotionCard>
  );
};

// Social Media Card
const SocialCard = ({ icon, label, href, color, username }: { icon: React.ReactNode; label: string; href: string; color: string; username: string }) => {
  return (
    <MotionCard
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05 }}
      component={Link}
      href={href}
      target="_blank"
      className="relative overflow-hidden group cursor-pointer"
      padding="lg"
      radius="lg"
      withBorder
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
      
      <Stack align="center" gap="xs">
        <ThemeIcon
          size={50}
          radius="xl"
          variant="gradient"
          gradient={{ from: color.split(' ')[0].replace('from-', ''), to: color.split(' ')[1].replace('to-', '') }}
        >
          {icon}
        </ThemeIcon>
        <Text fw={600} size="lg">{label}</Text>
        <Text size="sm" c="dimmed" className="text-center">{username}</Text>
      </Stack>
    </MotionCard>
  );
};

// Office Location Card
const OfficeCard = ({ city, address, phone, email, hours, image, index }: { city: string; address: string; phone: string; email: string; hours: string; image: string; index: number }) => {
  return (
    <MotionCard
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      padding="xl"
      radius="lg"
      withBorder
      className="overflow-hidden"
    >
      <Grid>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <div className="relative h-48 md:h-full rounded-lg overflow-hidden">
            <Image
              src="/images/service2.jpg"
              alt={city}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <Badge
              size="lg"
              variant="gradient"
              gradient={{ from: 'red', to: 'orange' }}
              className="absolute top-4 left-4"
            >
              {city}
            </Badge>
          </div>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap="md">
            <Group>
              <ThemeIcon size={40} radius="xl" color="red" variant="light">
                <MapPin size={20} />
              </ThemeIcon>
              <div>
                <Text size="sm" c="dimmed">Address</Text>
                <Text fw={500}>{address}</Text>
              </div>
            </Group>

            <Group>
              <ThemeIcon size={40} radius="xl" color="blue" variant="light">
                <Phone size={20} />
              </ThemeIcon>
              <div>
                <Text size="sm" c="dimmed">Phone</Text>
                <Link href={`tel:${phone}`} className="text-blue-600 hover:underline">
                  {phone}
                </Link>
              </div>
            </Group>

            <Group>
              <ThemeIcon size={40} radius="xl" color="green" variant="light">
                <Mail size={20} />
              </ThemeIcon>
              <div>
                <Text size="sm" c="dimmed">Email</Text>
                <Link href={`mailto:${email}`} className="text-green-600 hover:underline">
                  {email}
                </Link>
              </div>
            </Group>

            <Group>
              <ThemeIcon size={40} radius="xl" color="orange" variant="light">
                <Clock size={20} />
              </ThemeIcon>
              <div>
                <Text size="sm" c="dimmed">Business Hours</Text>
                <Text>{hours}</Text>
              </div>
            </Group>

            <Button
              variant="light"
              color="red"
              rightSection={<Navigation size={16} />}
              component={Link}
              href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
              target="_blank"
              className="mt-2"
            >
              Get Directions
            </Button>
          </Stack>
        </Grid.Col>
      </Grid>
    </MotionCard>
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
        <Group gap="sm">
          <ThemeIcon size={30} radius="xl" color="red" variant="light">
            <HelpCircle size={16} />
          </ThemeIcon>
          <Text fw={600} size="lg">{faq.question}</Text>
        </Group>
        <motion.div
          animate={{ rotate: opened ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronRight size={20} className="transform rotate-90" />
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: opened ? 'auto' : 0, opacity: opened ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <Text c="dimmed" className="pb-4 pl-9">{faq.answer}</Text>
      </motion.div>
    </MotionDiv>
  );
};

export default function ContactPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
    urgency: 'normal',
    newsletter: false,
  });

  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as any;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    // Simulate form submission
    setTimeout(() => {
      setFormStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: '',
        urgency: 'normal',
        newsletter: false,
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => setFormStatus('idle'), 5000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: <Phone size={24} />,
      title: 'Phone Number',
      content: '+251 911 234 567',
      link: 'tel:+251911234567',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <Mail size={24} />,
      title: 'Email Address',
      content: 'info@luciyaprinting.com',
      link: 'mailto:info@luciyaprinting.com',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: <MapPin size={24} />,
      title: 'Main Office',
      content: 'Bole Road, Addis Ababa, Ethiopia',
      color: 'from-red-500 to-orange-500',
    },
    {
      icon: <Clock size={24} />,
      title: 'Business Hours',
      content: 'Mon-Fri: 8:30 AM - 6:00 PM, Sat: 9:00 AM - 2:00 PM',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  const socialMedia = [
    {
      icon: <Facebook size={24} />,
      label: 'Facebook',
      href: 'https://facebook.com/luciaprinting',
      color: 'from-blue-600 to-blue-800',
      username: '@luciaprinting',
    },
    {
      icon: <Twitter size={24} />,
      label: 'Twitter',
      href: 'https://twitter.com/luciaprinting',
      color: 'from-sky-400 to-sky-600',
      username: '@luciaprinting',
    },
    {
      icon: <Instagram size={24} />,
      label: 'Instagram',
      href: 'https://instagram.com/luciaprinting',
      color: 'from-pink-500 to-purple-600',
      username: '@luciaprinting',
    },
    {
      icon: <Linkedin size={24} />,
      label: 'LinkedIn',
      href: 'https://linkedin.com/company/luciaprinting',
      color: 'from-blue-700 to-blue-900',
      username: 'lucia-printing',
    },
    {
      icon: <Youtube size={24} />,
      label: 'YouTube',
      href: 'https://youtube.com/@luciaprinting',
      color: 'from-red-600 to-red-800',
      username: '@luciaprinting',
    },
    {
      icon: <MessageCircle size={24} />,
      label: 'Telegram',
      href: 'https://t.me/luciaprinting',
      color: 'from-sky-500 to-blue-600',
      username: '@luciaprinting',
    },
  ];

  const offices = [
    {
      city: 'Addis Ababa',
      address: 'Bole Road, Near Bole International Airport, Addis Ababa, Ethiopia',
      phone: '+251 911 234 567',
      email: 'addis@luciyaprinting.com',
      hours: 'Mon-Fri: 8:30 AM - 6:00 PM, Sat: 9:00 AM - 2:00 PM',
      image: 'https://images.unsplash.com/photo-1577415124269-fc1140a69e91?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
    {
      city: 'Adama',
      address: 'Adama City, Main Street, Near Municipality, Adama, Ethiopia',
      phone: '+251 922 345 678',
      email: 'adama@luciyaprinting.com',
      hours: 'Mon-Fri: 8:30 AM - 5:30 PM, Sat: 9:00 AM - 1:00 PM',
      image: 'https://images.unsplash.com/photo-1577415124269-fc1140a69e91?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    },
  ];

  const faqs = [
    {
      question: 'How quickly can I expect a response?',
      answer: 'We typically respond to all inquiries within 2-4 hours during business hours. For urgent matters, we recommend calling us directly.',
    },
    {
      question: 'Do you offer emergency printing services?',
      answer: 'Yes! We offer rush orders and emergency printing services. Please call us directly for immediate assistance with urgent projects.',
    },
    {
      question: 'Can I visit your facility to discuss my project?',
      answer: 'Absolutely! We welcome walk-ins during business hours. You can also schedule a consultation with our design team by calling ahead.',
    },
    {
      question: 'Do you offer virtual consultations?',
      answer: 'Yes, we offer video consultations via Zoom, Google Meet, or Telegram. Just let us know your preference when scheduling.',
    },
    {
      question: 'What languages do you support?',
      answer: 'Our team is fluent in English and Amharic. We can also arrange for translation services for other languages if needed.',
    },
    {
      question: 'Do you have parking available?',
      answer: 'Yes, both our locations have free parking available for customers visiting our facilities.',
    },
  ];

  const serviceOptions = [
    { value: 'dtf', label: 'DTF Printing' },
    { value: 'tshirt', label: 'T-Shirt Printing' },
    { value: 'banners', label: 'Banners & Signage' },
    { value: 'stickers', label: 'Custom Stickers' },
    { value: 'design', label: 'Design Services' },
    { value: 'other', label: 'Other / Not Sure' },
  ];

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
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/80" />
          <Image
            src="/images/bg-2.jpg"
            alt="Contact Us"
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
              Get In Touch
            </Badge>
            
            <Title className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              Contact <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Us</span>
            </Title>
            
            <Text size="xl" className="max-w-3xl mx-auto text-gray-200">
              Have a question or ready to start your project? We&apos;re here to help! 
              Reach out to us through any of the channels below.
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

      {/* Contact Info Cards */}
      <Container size="lg" className="py-20">
        <SimpleGrid cols={{ base: 1, md: 2, lg: 4 }} spacing="md">
          {contactInfo.map((info, index) => (
            <ContactInfoCard key={index} {...info} />
          ))}
        </SimpleGrid>
      </Container>

      {/* Contact Form & Map Section */}
      <Container size="lg" className="pb-20">
        <Grid gutter={30}>
          {/* Contact Form */}
          <Grid.Col span={{ base: 12, lg: 7 }}>
            <MotionCard
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              padding="xl"
              radius="lg"
              withBorder
            >
              <Title order={2} className="text-3xl font-bold mb-2">
                Send Us a <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Message</span>
              </Title>
              <Text c="dimmed" className="mb-6">
                Fill out the form below and we&apos;ll get back to you within 24 hours.
              </Text>

              {formStatus === 'success' && (
                <Alert
                  icon={<CheckCircle size={16} />}
                  title="Message Sent!"
                  color="green"
                  className="mb-6"
                  withCloseButton
                  onClose={() => setFormStatus('idle')}
                >
                  Thank you for contacting us. We&apos;ll respond to your inquiry shortly.
                </Alert>
              )}

              {formStatus === 'error' && (
                <Alert
                  icon={<AlertCircle size={16} />}
                  title="Something went wrong"
                  color="red"
                  className="mb-6"
                  withCloseButton
                  onClose={() => setFormStatus('idle')}
                >
                  Please try again or call us directly for immediate assistance.
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Stack gap="md">
                  <Grid>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                      <TextInput
                        label="Your Name"
                        placeholder="John Doe"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        leftSection={<User size={16} />}
                        size="md"
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                      <TextInput
                        label="Email Address"
                        placeholder="john@example.com"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        leftSection={<Mail size={16} />}
                        size="md"
                      />
                    </Grid.Col>
                  </Grid>

                  <Grid>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                      <TextInput
                        label="Phone Number"
                        placeholder="+251 911 234 567"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        leftSection={<Phone size={16} />}
                        size="md"
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                      <Select
                        label="Service Interested In"
                        placeholder="Select a service"
                        name="service"
                        data={serviceOptions}
                        value={formData.service}
                        onChange={(value: any) => setFormData(prev => ({ ...prev, service: value || '' }))}
                        leftSection={<FileText size={16} />}
                        size="md"
                      />
                    </Grid.Col>
                  </Grid>

                  <Radio.Group
                    name="urgency"
                    label="How urgent is your project?"
                    value={formData.urgency}
                    onChange={(value: any) => setFormData(prev => ({ ...prev, urgency: value }))}
                  >
                    <Group mt="xs">
                      <Radio value="low" label="Not urgent (planning ahead)" />
                      <Radio value="normal" label="Normal (within a week)" />
                      <Radio value="urgent" label="Urgent (need ASAP)" />
                    </Group>
                  </Radio.Group>

                  <Textarea
                    label="Your Message"
                    placeholder="Tell us about your project or question..."
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    minRows={5}
                    size="md"
                  />

                  <Checkbox
                    label="Subscribe to our newsletter for updates and promotions"
                    name="newsletter"
                    checked={formData.newsletter}
                    onChange={handleChange}
                  />

                  <Button
                    type="submit"
                    size="lg"
                    variant="gradient"
                    gradient={{ from: 'red', to: 'orange' }}
                    rightSection={formStatus === 'submitting' ? <RefreshCw className="animate-spin" size={18} /> : <Send size={18} />}
                    disabled={formStatus === 'submitting'}
                    loading={formStatus === 'submitting'}
                    className="mt-4"
                  >
                    {formStatus === 'submitting' ? 'Sending...' : 'Send Message'}
                  </Button>
                </Stack>
              </form>
            </MotionCard>
          </Grid.Col>

          {/* Map & Quick Info */}
          <Grid.Col span={{ base: 12, lg: 5 }}>
            <Stack gap="md">
              <MotionCard
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                padding="xl"
                radius="lg"
                withBorder
                className="overflow-hidden"
              >
                <Title order={3} className="text-xl font-bold mb-4">
                  Visit Our Main Office
                </Title>
                
                <div className="relative h-64 rounded-lg overflow-hidden mb-4">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.797123456789!2d38.763456!3d9.012345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOcKwMDAnNDQuNCJOIDM4wrA0NSc0OC40IkU!5e0!3m2!1sen!2set!4v1234567890123!5m2!1sen!2set"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0"
                  />
                </div>

                <Stack gap="sm">
                  <Group>
                    <ThemeIcon size={36} radius="xl" color="red" variant="light">
                      <MapPin size={18} />
                    </ThemeIcon>
                    <div>
                      <Text size="sm" c="dimmed">Address</Text>
                      <Text size="sm">Bole Road, Addis Ababa, Ethiopia</Text>
                    </div>
                  </Group>
                  
                  <Group>
                    <ThemeIcon size={36} radius="xl" color="blue" variant="light">
                      <Phone size={18} />
                    </ThemeIcon>
                    <div>
                      <Text size="sm" c="dimmed">Phone</Text>
                      <Text size="sm">+251 911 234 567</Text>
                    </div>
                  </Group>
                  
                  <Group>
                    <ThemeIcon size={36} radius="xl" color="green" variant="light">
                      <Mail size={18} />
                    </ThemeIcon>
                    <div>
                      <Text size="sm" c="dimmed">Email</Text>
                      <Text size="sm">info@luciyaprinting.com</Text>
                    </div>
                  </Group>
                </Stack>

                <Button
                  fullWidth
                  variant="light"
                  color="red"
                  rightSection={<ExternalLink size={16} />}
                  component={Link}
                  href="https://maps.google.com/?q=Bole+Road+Addis+Ababa+Ethiopia"
                  target="_blank"
                  className="mt-4"
                >
                  Open in Google Maps
                </Button>
              </MotionCard>

              <MotionCard
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                padding="xl"
                radius="lg"
                withBorder
              >
                <Title order={3} className="text-xl font-bold mb-4">
                  Quick Response Guarantee
                </Title>
                
                <Stack gap="md">
                  <Group>
                    <ThemeIcon size={40} radius="xl" color="green" variant="light">
                      <CheckCircle size={20} />
                    </ThemeIcon>
                    <div>
                      <Text fw={600}>24-Hour Response</Text>
                      <Text size="sm" c="dimmed">We reply to all inquiries within 24 hours</Text>
                    </div>
                  </Group>

                  <Group>
                    <ThemeIcon size={40} radius="xl" color="blue" variant="light">
                      <Headphones size={20} />
                    </ThemeIcon>
                    <div>
                      <Text fw={600}>Live Chat Support</Text>
                      <Text size="sm" c="dimmed">Instant messaging during business hours</Text>
                    </div>
                  </Group>

                  <Group>
                    <ThemeIcon size={40} radius="xl" color="orange" variant="light">
                      <Calendar size={20} />
                    </ThemeIcon>
                    <div>
                      <Text fw={600}>Free Consultation</Text>
                      <Text size="sm" c="dimmed">Schedule a free project consultation</Text>
                    </div>
                  </Group>
                </Stack>
              </MotionCard>
            </Stack>
          </Grid.Col>
        </Grid>
      </Container>

      {/* Offices Section */}
      <MotionSection className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <Container size="lg">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge size="lg" color="red" className="mb-4">Our Locations</Badge>
            <Title order={2} className="text-4xl md:text-5xl font-bold mb-4">
              Visit Us at Any of Our <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Offices</span>
            </Title>
            <Text size="xl" c="dimmed" className="max-w-2xl mx-auto">
              We have multiple locations to serve you better
            </Text>
          </MotionDiv>

          <Stack gap="xl">
            {offices.map((office, index) => (
              <OfficeCard key={index} {...office} index={index} />
            ))}
          </Stack>
        </Container>
      </MotionSection>

      {/* Social Media Section */}
      <Container size="lg" className="py-20">
        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge size="lg" color="red" className="mb-4">Connect With Us</Badge>
          <Title order={2} className="text-4xl md:text-5xl font-bold mb-4">
            Follow Us on <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Social Media</span>
          </Title>
          <Text size="xl" c="dimmed" className="max-w-2xl mx-auto">
            Stay updated with our latest work, promotions, and news
          </Text>
        </MotionDiv>

        <SimpleGrid cols={{ base: 2, md: 3, lg: 6 }} spacing="md">
          {socialMedia.map((social, index) => (
            <SocialCard key={index} {...social} />
          ))}
        </SimpleGrid>
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
              Find quick answers to common questions about contacting us
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
              Prefer to Talk Directly?
            </Title>
            
            <Text size="xl" className="mb-8 max-w-2xl mx-auto">
              Our team is available by phone during business hours
            </Text>

            <Group justify="center" gap="md">
              <Button
                size="xl"
                variant="white"
                color="red"
                component="a"
                href="tel:+251911234567"
                leftSection={<Phone size={20} />}
              >
                Call +251 911 234 567
              </Button>
              <Button
                size="xl"
                variant="outline"
                color="white"
                component={Link}
                href="/services"
              >
                Explore Services
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