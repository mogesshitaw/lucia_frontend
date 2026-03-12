/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Container, Title, Text, Button, Grid, Card, Group, ThemeIcon, Badge, Avatar, SimpleGrid, Stack, ActionIcon, Tooltip } from '@mantine/core';
import { motion, useScroll, useTransform, useAnimation, useInView } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import {
  Heart,
  Award,
  Users,
  Zap,
  Shield,
  Star,
  Phone,
  TrendingUp,
  Leaf,
  Printer,
  Cpu,
  Flame,
  MessageCircle,
  DollarSign,
  Trophy,
} from 'lucide-react';
import CountUp from 'react-countup';
import Image from 'next/image';
import Link from 'next/link';

const MotionDiv = motion.div;
const MotionSection = motion.section;

// For Mantine components, use motion.create instead of motion()
// const MotionContainer = motion.create(Container);
// const MotionTitle = motion.create(Title as any );
// const MotionText = motion.create(Text as any );
const MotionCard = motion.create(Card as any);

// Custom hook for scroll animations - FIXED VERSION
const useScrollAnimation = (threshold = 0.1) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { 
    once: true, 
    amount: threshold // Use 'amount' instead of 'threshold' for the version you're using
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [inView, controls]);

  return { ref, controls, inView };
};

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
            opacity: 0.2,
          }}
          animate={{
            y: [0, -30, 0, 30, 0],
            x: [0, 30, 0, -30, 0],
            scale: [1, 1.2, 1, 0.8, 1],
            opacity: [0.2, 0.4, 0.2, 0.4, 0.2],
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
// Animated Counter
const AnimatedCounter = ({ value, label, suffix = '', duration = 2 }: { value: number; label: string; suffix?: string; duration?: number }) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <MotionDiv
      ref={ref}
      className="text-center"
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
        {isInView && <CountUp end={value} duration={duration} separator="," suffix={suffix} />}
      </div>
      <div className="text-gray-600 dark:text-gray-400">{label}</div>
    </MotionDiv>
  );
};

// Timeline Item
const TimelineItem = ({ year, title, description, icon, index }: { year: string; title: string; description: string; icon: React.ReactNode; index: number }) => {
  return (
    <MotionDiv
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="relative mb-8"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white">
            {icon}
          </div>
        </div>
        <div className="flex-grow">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <Badge size="lg" variant="gradient" gradient={{ from: 'red', to: 'orange' }}>
                {year}
              </Badge>
              <Title order={4}>{title}</Title>
            </div>
            <Text c="dimmed">{description}</Text>
          </div>
        </div>
      </div>
    </MotionDiv>
  );
};

// Team Member Card
const TeamMember = ({ name, role, bio, image, index }: { name: string; role: string; bio: string; image: string; index: number }) => {
  return (
    <MotionCard
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="relative overflow-hidden group"
      padding="xl"
      radius="lg"
      withBorder
    >
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 text-center">
        <div className="relative inline-block mb-4">
          <Avatar src={image} size={120} radius="xl" className="border-4 border-red-500" />
          <motion.div
            className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-2 border-white"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        </div>
        
        <Title order={3} className="mb-1">{name}</Title>
        <Badge size="lg" color="red" className="mb-3">{role}</Badge>
        <Text size="sm" c="dimmed" className="mb-4">{bio}</Text>
        
        <Group justify="center" gap="xs">
          <ActionIcon variant="subtle" color="gray" size="lg" component="a" href="#" target="_blank">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.99h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.99C18.343 21.128 22 16.991 22 12z"/>
            </svg>
          </ActionIcon>
          <ActionIcon variant="subtle" color="gray" size="lg" component="a" href="#" target="_blank">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.104c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0021.645-3.188 13.94 13.94 0 001.464-6.108c0-.21-.005-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          </ActionIcon>
          <ActionIcon variant="subtle" color="gray" size="lg" component="a" href="#" target="_blank">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </ActionIcon>
        </Group>
      </div>
    </MotionCard>
  );
};

// Value Card
const ValueCard = ({ icon, title, description, color }: { icon: React.ReactNode; title: string; description: string; color: string }) => {
  return (
    <MotionCard
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="relative overflow-hidden group"
      padding="xl"
      radius="lg"
      withBorder
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
      
      <ThemeIcon
        size={60}
        radius="xl"
        variant="gradient"
        gradient={{ from: color.split(' ')[0].replace('from-', ''), to: color.split(' ')[1].replace('to-', '') }}
        className="mb-4 group-hover:scale-110 transition-transform duration-300"
      >
        {icon}
      </ThemeIcon>
      
      <Title order={4} className="mb-2">{title}</Title>
      <Text size="sm" c="dimmed">{description}</Text>
    </MotionCard>
  );
};

// Achievement Card
const AchievementCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
    >
      <Group>
        <ThemeIcon size={50} radius="xl" color="red" variant="light">
          {icon}
        </ThemeIcon>
        <div>
          <Title order={3} className="text-red-600 dark:text-red-400">{title}</Title>
          <Text c="dimmed">{description}</Text>
        </div>
      </Group>
    </MotionDiv>
  );
};

export default function AboutPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  // Fixed: Destructure ref and controls from the hook
  const { ref: storyRef, controls: storyControls } = useScrollAnimation(0.2);
  const { ref: timelineRef, controls: timelineControls } = useScrollAnimation(0.2);
  const { ref: valuesRef, controls: valuesControls } = useScrollAnimation(0.2);
  const { ref: teamRef, controls: teamControls } = useScrollAnimation(0.2);
  const { ref: achievementsRef, controls: achievementsControls } = useScrollAnimation(0.2);
  const { ref: ctaRef, controls: ctaControls } = useScrollAnimation(0.2);

  const stats = [
    { value: 5000, label: 'Projects Completed', suffix: '+' },
    { value: 1200, label: 'Happy Clients', suffix: '+' },
    { value: 13, label: 'Years Experience', suffix: '' },
    { value: 24, label: 'Hour Support', suffix: '/7' },
  ];

  const timeline = [
    {
      year: '2010',
      title: 'The Beginning',
      description: 'Lucia Printing was founded with a single printer and a vision to provide quality printing services in Ethiopia.',
      icon: <Flame size={24} />,
    },
    {
      year: '2013',
      title: 'Expansion',
      description: 'Moved to a larger facility and added large format printing capabilities.',
      icon: <TrendingUp size={24} />,
    },
    {
      year: '2015',
      title: 'DTF Technology',
      description: 'Introduced DTF printing technology, revolutionizing apparel printing in the region.',
      icon: <Printer size={24} />,
    },
    {
      year: '2018',
      title: 'Digital Transformation',
      description: 'Launched online ordering system and real-time chat support.',
      icon: <Cpu size={24} />,
    },
    {
      year: '2020',
      title: 'Sustainability',
      description: 'Adopted eco-friendly printing practices and materials.',
      icon: <Leaf size={24} />,
    },
    {
      year: '2023',
      title: 'Today',
      description: 'Serving thousands of satisfied customers with state-of-the-art printing solutions.',
      icon: <Award size={24} />,
    },
  ];

  const teamMembers = [
    {
      name: 'Abebe Kebede',
      role: 'Founder & CEO',
      bio: 'With over 15 years of experience in the printing industry, Abebe leads the company with passion and vision.',
      image: 'https://i.pravatar.cc/150?img=1',
    },
    {
      name: 'Tigist Haile',
      role: 'Creative Director',
      bio: 'Award-winning designer with a keen eye for detail and creativity.',
      image: 'https://i.pravatar.cc/150?img=2',
    },
    {
      name: 'Dawit Mekonnen',
      role: 'Production Manager',
      bio: 'Ensures every print meets our high quality standards with precision and care.',
      image: 'https://i.pravatar.cc/150?img=3',
    },
    {
      name: 'Sara Mohammed',
      role: 'Customer Success',
      bio: 'Dedicated to ensuring every client has an exceptional experience.',
      image: 'https://i.pravatar.cc/150?img=4',
    },
  ];

  const values = [
    {
      icon: <Heart size={24} />,
      title: 'Passion',
      description: 'We love what we do and it shows in every print we deliver.',
      color: 'from-red-500 to-orange-500',
    },
    {
      icon: <Award size={24} />,
      title: 'Quality',
      description: 'We never compromise on quality, using the best materials and technology.',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: <Users size={24} />,
      title: 'Community',
      description: 'We believe in building lasting relationships with our clients and community.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: <Zap size={24} />,
      title: 'Innovation',
      description: 'Always embracing new technologies and techniques to serve you better.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <Shield size={24} />,
      title: 'Integrity',
      description: 'Honest, transparent, and reliable in everything we do.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: <Leaf size={24} />,
      title: 'Sustainability',
      description: 'Committed to environmentally responsible printing practices.',
      color: 'from-teal-500 to-green-500',
    },
  ];

  const achievements = [
    {
      icon: <Award size={24} />,
      title: 'Best Printing Service 2023',
      description: 'Ethiopian Business Awards',
    },
    {
      icon: <Trophy size={24} />,
      title: 'Innovation in Printing',
      description: 'African Tech Summit',
    },
    {
      icon: <Heart size={24} />,
      title: 'Community Impact Award',
      description: 'Addis Ababa Chamber of Commerce',
    },
    {
      icon: <Star size={24} />,
      title: 'Customer Excellence',
      description: '5-Star Rating from 1200+ Clients',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 relative overflow-hidden">
      <FloatingParticles />

      {/* Hero Section */}
      <MotionSection
        ref={heroRef}
        className="relative min-h-[60vh] flex items-center justify-center overflow-hidden"
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
          <Image
            src="/images/bg-2.jpg"
            alt="About Lucia Printing"
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
              About Us
            </Badge>
            
            <Title className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              Crafting <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Excellence</span>
            </Title>
            
            <Text size="xl" className="max-w-3xl mx-auto text-gray-200">
              For over a decade, we&apos;ve been transforming ideas into stunning printed realities, 
              serving businesses and individuals across Ethiopia with passion and precision.
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

      {/* Stats Section */}
      <Container size="lg" className="py-20">
        <SimpleGrid cols={{ base: 2, md: 4 }} spacing="xl">
          {stats.map((stat, index) => (
            <AnimatedCounter key={index} value={stat.value} label={stat.label} suffix={stat.suffix} />
          ))}
        </SimpleGrid>
      </Container>

      {/* Our Story Section */}
      <MotionSection
        ref={storyRef}
        animate={storyControls}
        initial="hidden"
        className="py-20 bg-gray-50 dark:bg-gray-900/50"
      >
        <Container size="lg">
          <Grid gutter={50} align="center">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <MotionDiv
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Badge size="lg" color="red" className="mb-4">Our Story</Badge>
                <Title order={2} className="text-4xl md:text-5xl font-bold mb-6">
                  More Than Just <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Printing</span>
                </Title>
                
                <Stack gap="md">
                  <Text size="lg">
                    Founded in 2010, Lucia Printing started as a small print shop with a big dream: 
                    to provide exceptional quality printing services to businesses and individuals in Ethiopia.
                  </Text>
                  <Text size="lg">
                    What began with a single printer has grown into a full-service printing and advertising 
                    company, serving thousands of satisfied customers across the nation.
                  </Text>
                  <Text size="lg">
                    Today, we combine cutting-edge technology with artisanal craftsmanship to deliver 
                    prints that not only meet but exceed expectations.
                  </Text>
                </Stack>

                <Group mt="xl">
                  <Button
                    size="lg"
                    variant="gradient"
                    gradient={{ from: 'red', to: 'orange' }}
                    component={Link}
                    href="/contact"
                  >
                    Get in Touch
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    color="red"
                    component={Link}
                    href="/services"
                  >
                    Explore Services
                  </Button>
                </Group>
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
                    alt="Printing Shop"
                    width={600}
                    height={400}
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
                
                {/* Floating Card */}
                <MotionDiv
                  className="absolute -bottom-10 -left-10 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <Group>
                    <ThemeIcon size={50} radius="xl" color="red" variant="light">
                      <Heart size={24} />
                    </ThemeIcon>
                    <div>
                      <Text fw={700} size="xl" className="text-red-600">13+</Text>
                      <Text c="dimmed">Years of Excellence</Text>
                    </div>
                  </Group>
                </MotionDiv>
              </MotionDiv>
            </Grid.Col>
          </Grid>
        </Container>
      </MotionSection>

      {/* Timeline Section */}
      <MotionSection
        ref={timelineRef}
        animate={timelineControls}
        initial="hidden"
        className="py-20"
      >
        <Container size="lg">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge size="lg" color="red" className="mb-4">Our Journey</Badge>
            <Title order={2} className="text-4xl md:text-5xl font-bold mb-4">
              The Road to <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Success</span>
            </Title>
            <Text size="xl" c="dimmed" className="max-w-2xl mx-auto">
              A decade of growth, innovation, and dedication to excellence
            </Text>
          </MotionDiv>

          <div className="max-w-3xl mx-auto">
            {timeline.map((item, index) => (
              <TimelineItem key={index} {...item} index={index} />
            ))}
          </div>
        </Container>
      </MotionSection>

      {/* Values Section */}
      <MotionSection
        ref={valuesRef}
        animate={valuesControls}
        initial="hidden"
        className="py-20 bg-gray-50 dark:bg-gray-900/50"
      >
        <Container size="lg">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge size="lg" color="red" className="mb-4">Our Values</Badge>
            <Title order={2} className="text-4xl md:text-5xl font-bold mb-4">
              What Drives <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Us</span>
            </Title>
            <Text size="xl" c="dimmed" className="max-w-2xl mx-auto">
              The principles that guide every print we make and every relationship we build
            </Text>
          </MotionDiv>

          <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="xl">
            {values.map((value, index) => (
              <ValueCard key={index} {...value} />
            ))}
          </SimpleGrid>
        </Container>
      </MotionSection>

      {/* Team Section */}
      <MotionSection
        ref={teamRef}
        animate={teamControls}
        initial="hidden"
        className="py-20"
      >
        <Container size="lg">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge size="lg" color="red" className="mb-4">Our Team</Badge>
            <Title order={2} className="text-4xl md:text-5xl font-bold mb-4">
              The People Behind <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">the Prints</span>
            </Title>
            <Text size="xl" c="dimmed" className="max-w-2xl mx-auto">
              Meet the passionate individuals who bring your ideas to life
            </Text>
          </MotionDiv>

          <SimpleGrid cols={{ base: 1, md: 2, lg: 4 }} spacing="xl">
            {teamMembers.map((member, index) => (
              <TeamMember key={index} {...member} index={index} />
            ))}
          </SimpleGrid>
        </Container>
      </MotionSection>

      {/* Achievements Section */}
      <MotionSection
        ref={achievementsRef}
        animate={achievementsControls}
        initial="hidden"
        className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white"
      >
        <Container size="lg">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge size="lg" variant="gradient" gradient={{ from: 'red', to: 'orange' }} className="mb-4">
              Achievements
            </Badge>
            <Title order={2} className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Recognition & <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Awards</span>
            </Title>
            <Text size="xl" className="text-gray-300 max-w-2xl mx-auto">
              Our commitment to excellence has been recognized by industry leaders
            </Text>
          </MotionDiv>

          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
            {achievements.map((achievement, index) => (
              <AchievementCard key={index} {...achievement} />
            ))}
          </SimpleGrid>
        </Container>
      </MotionSection>

      {/* CTA Section */}
      <MotionSection
        ref={ctaRef}
        animate={ctaControls}
        initial="hidden"
        className="py-20"
      >
        <Container size="lg">
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
                Let&apos;s bring your vision to life with our premium printing services
              </Text>

              <Group justify="center" gap="md">
                <Button
                  size="xl"
                  variant="white"
                  color="red"
                  component={Link}
                  href="/page/contact"
                >
                  Contact Us
                </Button>
                <Button
                  size="xl"
                  variant="outline"
                  color="white"
                  component={Link}
                  href="/page/services"
                >
                  View Services
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
      </MotionSection>

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
    </div>
  );
}