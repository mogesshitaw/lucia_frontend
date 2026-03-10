/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { Container, Title, Text, Button, Grid, Card, Group, ThemeIcon, Badge, Avatar, SimpleGrid, ActionIcon, Tooltip, Image, Spoiler, Tabs, Center, Paper, Skeleton, Stack } from '@mantine/core';
import { motion, useScroll, useTransform, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState, useRef } from 'react';
import {
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
  ChevronRight,
  Star,
  Palette,
  CheckCircle,
  Phone,
  ArrowRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Quote,
  Printer,
  Zap,
  Gem,
  Link as LinkIcon,
  Bookmark,
  Camera,
  Car,
  Coffee,
  FileText,
  Flame,
  Key,
  Layers,
  Lightbulb,
  Package,
  Pen,
  Scissors,
  Shirt,
  ShoppingBag,
  Tag,
  Wine,
} from 'lucide-react';
import CountUp from 'react-countup';
import Footer from './component/footer';
import { useMediaQuery } from '@mantine/hooks';
import confetti from 'canvas-confetti';
import { Variants } from 'framer-motion';
import { TestimonialForm } from './component/TestimonialForm';
import { IconStar } from '@tabler/icons-react';
import Link from 'next/link';

// ==================== TYPES ====================
interface Testimonial {
  id: string;
  customer_name: string;
  customer_role: string | null;
  company: string | null;
  content: string;
  rating: number;
  avatar: string | null;
  created_at: string;
}

// ==================== COMPONENTS ====================
const MotionDiv = motion.div;
const MotionSection = motion.section;
const MotionText = motion(Text as any);
const MotionCard = motion(Card as any);

// ==================== STUNNING WELCOME TEXT COMPONENT ====================
const StunningWelcomeText = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <MotionDiv
      className="relative mb-12"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
    >
      {/* Static Gradient Orbs */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-gradient-to-r from-red-500/30 to-orange-500/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-3xl" />

      {/* Main Welcome Text */}
      <div className="relative text-center">
        {/* Animated Word "Welcome" */}
        <motion.div
          className="overflow-hidden mb-4"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <motion.div
            className="inline-block"
            animate={{
              textShadow: isHovered 
                ? [
                    '0 0 20px rgba(239,68,68,0.5)',
                    '0 0 40px rgba(249,115,22,0.5)',
                    '0 0 20px rgba(239,68,68,0.5)',
                  ]
                : '0 0 0px rgba(0,0,0,0)',
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Text
              size="xl"
              fw={300}
              className="text-3xl md:text-4xl lg:text-5xl tracking-[0.3em] uppercase mb-2"
              style={{ 
                fontFamily: 'Montserrat, sans-serif',
                background: 'linear-gradient(135deg, #ef4444, #f97316, #f59e0b, #ef4444)',
                backgroundSize: '300% 300%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              <motion.span
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                WELCOME TO
              </motion.span>
            </Text>
          </motion.div>
        </motion.div>

        {/* Main Brand Name */}
        <div className="relative perspective-1000">
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-6"
            style={{
              fontFamily: 'Montserrat, sans-serif',
            }}
          >
            <span className="relative inline-block">
              {/* Gradient Text */}
              <span className="bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
                LUCIA
              </span>
              
              {/* Floating Particles around text */}
              {[...Array(8)].map((_, i) => (
                <motion.span
                  key={i}
                  className="absolute w-1 h-1 bg-orange-500 rounded-full"
                  style={{
                    left: `${(i * 12)}%`,
                    top: `${Math.sin(i) * 50}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2 + i * 0.3,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </span>
          </motion.h1>

          {/* Second Line with Staggered Animation */}
          <motion.div
            className="overflow-hidden"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <Title
              order={2}
              className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white"
            >
              <motion.span
                className="inline-block"
                animate={{
                  color: isHovered ? ['#ef4444', '#f97316', '#f59e0b', '#ef4444'] : '#000',
                }}
                transition={{ duration: 3, repeat: isHovered ? Infinity : 0 }}
              >
                Printing & Advertising
              </motion.span>
            </Title>
          </motion.div>
        </div>

        {/* Animated Underline with Glow */}
        <motion.div
          className="relative h-1 mx-auto mt-8 overflow-hidden rounded-full"
          style={{ width: '60%' }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 blur-md"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
              delay: 0.5,
            }}
          />
        </motion.div>

        {/* Floating Icons */}
        <motion.div
          className="absolute -left-12 top-1/2 text-red-500"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Printer size={40} />
        </motion.div>

        <motion.div
          className="absolute -right-12 top-1/2 text-orange-500"
          animate={{
            y: [0, 20, 0],
            rotate: [0, -10, 10, 0],
          }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          <Sparkles size={40} />
        </motion.div>

        <motion.div
          className="absolute left-1/4 -bottom-12 text-yellow-500"
          animate={{
            x: [0, 20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 4.5, repeat: Infinity }}
        >
          <Zap size={32} />
        </motion.div>

        <motion.div
          className="absolute right-1/4 -bottom-12 text-purple-500"
          animate={{
            x: [0, -20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Gem size={32} />
        </motion.div>

        {/* Light Rays Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-orange-500 to-transparent"
            animate={{
              rotate: [0, 45, 0],
              scale: [1, 1.5, 1],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </div>
      </div>
    </MotionDiv>
  );
};

// ==================== ANIMATED BACKGROUND WAVES ====================
const AnimatedWaves = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute bottom-0 left-0 w-full h-auto"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <motion.path
          fill="rgba(239,68,68,0.1)"
          fillOpacity="1"
          d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          animate={{
            d: [
              "M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              "M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,138.7C672,117,768,107,864,122.7C960,139,1056,181,1152,186.7C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              "M0,224L48,208C96,192,192,160,288,149.3C384,139,480,149,576,165.3C672,181,768,203,864,197.3C960,192,1056,160,1152,138.7C1248,117,1344,107,1392,112L1440,117L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              "M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
            ]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </svg>
    </div>
  );
};

// Custom hook for scroll animations
const useScrollAnimation = (threshold = 0.1) => {
  const [ref, inView] = useInView({ threshold, triggerOnce: true });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return { 
    ref,
    controls,
    inView 
  };
};

// Floating particles animation
const FloatingParticles = () => {
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<Array<{
    id: number;
    startX: number;
    startY: number;
    moveX: number;
    moveY: number;
    duration: number;
    size: number;
    color: string;
    rotation: number;
    shape: 'circle' | 'square' | 'triangle';
  }>>([]);

  useEffect(() => {
    setMounted(true);
    
    const colors = ['rgba(239,68,68,0.2)', 'rgba(249,115,22,0.2)', 'rgba(245,158,11,0.2)', 'rgba(34,197,94,0.2)', 'rgba(59,130,246,0.2)', 'rgba(168,85,247,0.2)'];
    const shapes = ['circle', 'square', 'triangle'] as const;
    
    const newParticles = [...Array(30)].map((_, i) => ({
      id: i,
      startX: Math.random() * (typeof window !== 'undefined' ? window.innerWidth - 100 : 1000) + 50,
      startY: Math.random() * (typeof window !== 'undefined' ? window.innerHeight - 100 : 800) + 50,
      moveX: (Math.random() - 0.5) * 150,
      moveY: (Math.random() - 0.5) * 150,
      duration: 15 + Math.random() * 15,
      size: 3 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
    }));
    
    setParticles(newParticles);

    const handleResize = () => {
      setParticles(prev => prev.map(p => ({
        ...p,
        startX: Math.random() * (window.innerWidth - 100) + 50,
        startY: Math.random() * (window.innerHeight - 100) + 50,
      })));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!mounted || particles.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => {
        const shapeClass = 
          p.shape === 'circle' ? 'rounded-full' :
          p.shape === 'square' ? 'rounded-md' :
          'triangle-shape';
        
        return (
          <motion.div
            key={p.id}
            className={`absolute ${shapeClass}`}
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              rotate: p.rotation,
              ...(p.shape === 'triangle' && {
                width: 0,
                height: 0,
                backgroundColor: 'transparent',
                borderLeft: `${p.size}px solid transparent`,
                borderRight: `${p.size}px solid transparent`,
                borderBottom: `${p.size * 1.5}px solid ${p.color}`,
              }),
            }}
            initial={{
              x: p.startX,
              y: p.startY,
            }}
            animate={{
              x: [p.startX, p.startX + p.moveX, p.startX - p.moveX, p.startX],
              y: [p.startY, p.startY + p.moveY, p.startY - p.moveY, p.startY],
              rotate: [p.rotation, p.rotation + 180, p.rotation + 360],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        );
      })}
    </div>
  );
};

// Animated Counter with Confetti
const AnimatedCounter = ({ value, label, icon, suffix = '' }: { value: number; label: string; icon: React.ReactNode; suffix?: string }) => {
  const counterRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ef4444', '#f97316', '#f59e0b'],
          });
        }
      },
      { threshold: 0.5 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <MotionDiv
      ref={counterRef}
      className="text-center"
      whileHover={{ scale: 1.1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <div className="text-6xl font-bold mb-2 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
        {inView && <CountUp end={value} duration={2.5} separator="," suffix={suffix} />}
      </div>
      <div className="flex items-center justify-center gap-2 text-lg text-gray-600 dark:text-gray-400">
        <span>{icon}</span>
        <span>{label}</span>
      </div>
    </MotionDiv>
  );
};

// Animated Gradient Border Card
const GradientBorderCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`relative group ${className}`}>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-xy" />
      <div className="relative bg-white dark:bg-gray-900 rounded-lg p-6">
        {children}
      </div>
    </div>
  );
};

// Parallax Background
const ParallaxBackground = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -200]);
  const y3 = useTransform(scrollY, [0, 1000], [0, 100]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0.5]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 bg-red-500/10 rounded-full filter blur-3xl"
        style={{ y: y1, opacity }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/10 rounded-full filter blur-3xl"
        style={{ y: y2, opacity }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 w-48 h-48 bg-yellow-500/10 rounded-full filter blur-3xl"
        style={{ y: y3, opacity }}
      />
    </div>
  );
};

// 3D Rotating Cube
const RotatingCube = () => {
  return (
    <div className="perspective-1000 w-32 h-32 mx-auto">
      <motion.div
        className="relative w-full h-full"
        animate={{
          rotateX: [0, 360],
          rotateY: [0, 360],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front face */}
        <div 
          className="absolute w-full h-full bg-gradient-to-br from-red-500/30 to-orange-500/30 border-2 border-red-500 flex items-center justify-center text-center p-2 text-xs font-bold text-white"
          style={{ transform: 'rotateY(0deg) translateZ(60px)' }}
        >
          LUCIA
        </div>
        {/* Back face */}
        <div 
          className="absolute w-full h-full bg-gradient-to-br from-orange-500/30 to-yellow-500/30 border-2 border-orange-500 flex items-center justify-center text-center p-2 text-xs font-bold text-white"
          style={{ transform: 'rotateY(180deg) translateZ(60px)' }}
        >
          PRINTING
        </div>
        {/* Right face */}
        <div 
          className="absolute w-full h-full bg-gradient-to-br from-yellow-500/30 to-green-500/30 border-2 border-yellow-500 flex items-center justify-center text-center p-2 text-xs font-bold text-white"
          style={{ transform: 'rotateY(90deg) translateZ(60px)' }}
        >
          ADVERTISING
        </div>
        {/* Left face */}
        <div 
          className="absolute w-full h-full bg-gradient-to-br from-green-500/30 to-blue-500/30 border-2 border-green-500 flex items-center justify-center text-center p-2 text-xs font-bold text-white"
          style={{ transform: 'rotateY(-90deg) translateZ(60px)' }}
        >
          QUALITY
        </div>
        {/* Top face */}
        <div 
          className="absolute w-full h-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 border-2 border-blue-500 flex items-center justify-center text-center p-2 text-xs font-bold text-white"
          style={{ transform: 'rotateX(90deg) translateZ(60px)' }}
        >
          SINCE 2010
        </div>
        {/* Bottom face */}
        <div 
          className="absolute w-full h-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 border-2 border-purple-500 flex items-center justify-center text-center p-2 text-xs font-bold text-white"
          style={{ transform: 'rotateX(-90deg) translateZ(60px)' }}
        >
          PREMIUM
        </div>
      </motion.div>
    </div>
  );
};

export default function HomePage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [activeTab, setActiveTab] = useState<string | null>('all');
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const heroBlur = useTransform(scrollYProgress, [0, 0.5], [0, 10]);
  
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { ref: servicesRef, controls: servicesControls } = useScrollAnimation(0.1);
  const { ref: whyUsRef, controls: whyUsControls } = useScrollAnimation(0.1);
  const { ref: processRef, controls: processControls } = useScrollAnimation(0.1);
  const { ref: statsRef, controls: statsControls } = useScrollAnimation(0.1);
  const { ref: testimonialsRef, controls: testimonialsControls } = useScrollAnimation(0.1);
  const { ref: worksRef, controls: worksControls } = useScrollAnimation(0.1);
  
  // FIXED: Properly typed testimonials state
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);
  const [testimonialFormOpened, setTestimonialFormOpened] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // Fetch testimonials from API
  const fetchTestimonials = async () => {
    try {
      const response = await fetch(`${API_URL}/api/testimonials/public?limit=6&featured=true`);
      const data = await response.json();
      if (data.success) {
        setTestimonials(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
    } finally {
      setTestimonialsLoading(false);
    }
  };

  // Call it in useEffect
  useEffect(() => {
    fetchTestimonials();
  }, []);

  // Add proper typing to your variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const stats = [
    { value: 5000, label: 'Projects Completed', suffix: '+', icon: <CheckCircle size={24} /> },
    { value: 1200, label: 'Happy Clients', suffix: '+', icon: <Users size={24} /> },
    { value: 13, label: 'Years Experience', suffix: '', icon: <Clock size={24} /> },
    { value: 24, label: 'Hour Support', suffix: '/7', icon: <Headphones size={24} /> },
  ];

  const featuredServices = [
    // Apparel Printing
    {
      icon: <Printer size={32} />,
      title: 'DTF Printing',
      desc: 'Direct to Film printing for vibrant, durable designs on any fabric. Perfect for custom apparel and promotional items.',
      gradient: 'from-purple-500 to-pink-500',
      badge: 'Most Popular',
      features: ['Any Fabric Type', 'Vibrant Colors', 'Wash Durable', 'No Minimum'],
      link: '/page/services/dtf',
    },
    {
      icon: <Shirt size={32} />,
      title: 'T-Shirt Printing',
      desc: 'Custom t-shirts using DTF, screen printing, and DTG methods for any occasion.',
      gradient: 'from-red-500 to-pink-500',
      badge: 'Best Seller',
      features: ['Multiple Methods', 'All Colors', 'Bulk Discounts', 'Fast Delivery'],
      link: '/page/services/tshirt',
    },
    {
      icon: <Shirt size={32} />,
      title: 'Hoodies & Sweatshirts',
      desc: 'Comfortable custom hoodies for teams, events, and corporate wear.',
      gradient: 'from-blue-500 to-purple-500',
      badge: 'Comfort',
      features: ['Premium Blanks', 'All Sizes', 'Embroidery Option', 'Bulk Pricing'],
      link: '/page/services/hoodies',
    },
    {
      icon: <Shirt size={32} />,
      title: 'Custom Hats & Caps',
      desc: 'Personalized headwear with embroidery or printed designs.',
      gradient: 'from-blue-500 to-cyan-500',
      badge: 'Trending',
      features: ['Embroidery', 'Printed Options', 'Adjustable', 'Bulk Orders'],
      link: '/page/services/hats',
    },
    
    // Large Format
    {
      icon: <Megaphone size={32} />,
      title: 'Banner Printing',
      desc: 'Large format banners for indoor and outdoor advertising.',
      gradient: 'from-red-500 to-orange-500',
      badge: 'Popular',
      features: ['Indoor/Outdoor', 'Multiple Sizes', 'Weather Resistant', 'Fast Production'],
      link: '/page/services/banners',
    },
    {
      icon: <Camera size={32} />,
      title: 'Posters',
      desc: 'High-quality posters for events, advertising, and art prints.',
      gradient: 'from-purple-500 to-pink-500',
      badge: 'Popular',
      features: ['Multiple Sizes', 'High Resolution', 'UV Resistant', 'Lamination'],
      link: '/page/services/posters',
    },
    {
      icon: <Car size={32} />,
      title: 'Vehicle Wraps',
      desc: 'Full and partial vehicle wraps for mobile advertising.',
      gradient: 'from-blue-500 to-indigo-500',
      badge: 'Professional',
      features: ['Full/Partial Wraps', 'Commercial Vehicles', 'Professional Install', '5-Year Durability'],
      link: '/page/services/wraps',
    },
    {
      icon: <Lightbulb size={32} />,
      title: 'Light Box',
      desc: 'LED illuminated signs for eye-catching displays.',
      gradient: 'from-yellow-500 to-amber-500',
      badge: 'Premium',
      features: ['LED Illumination', 'Custom Sizes', 'Energy Efficient', 'Long Lifespan'],
      link: '/page/services/light-box',
    },
    
    // Stickers & Labels
    {
      icon: <Tag size={32} />,
      title: 'Custom Stickers',
      desc: 'Die-cut and kiss-cut stickers in various finishes.',
      gradient: 'from-yellow-500 to-orange-500',
      badge: 'Popular',
      features: ['Custom Shapes', 'Weather Resistant', 'Matte/Glossy', 'Bulk Orders'],
      link: '/page/services/stickers',
    },
    {
      icon: <Bookmark size={32} />,
      title: 'Product Labels',
      desc: 'Custom labels for packaging, branding, and products.',
      gradient: 'from-green-500 to-teal-500',
      badge: 'Business',
      features: ['Barcode Ready', 'Water Resistant', 'Custom Sizes', 'Bulk Rolls'],
      link: '/page/services/labels',
    },
    
    // Drinkware
    {
      icon: <Coffee size={32} />,
      title: 'Mug Printing',
      desc: 'Custom printed mugs for gifts, events, and promotions.',
      gradient: 'from-orange-500 to-red-500',
      badge: 'Gift Idea',
      features: ['Full Color', 'Dishwasher Safe', 'Various Sizes', 'Bulk Pricing'],
      link: '/page/services/mugs',
    },
    {
      icon: <Wine size={32} />,
      title: 'Bottle Printing',
      desc: 'Custom printed water bottles, tumblers, and glassware.',
      gradient: 'from-blue-500 to-indigo-500',
      badge: 'Eco-Friendly',
      features: ['Stainless Steel', 'Glass Options', 'Insulated', 'Dishwasher Safe'],
      link: '/page/services/bottles',
    },
    
    // Print & Promo
    {
      icon: <FileText size={32} />,
      title: 'Business Cards',
      desc: 'Premium business cards with various finishes and effects.',
      gradient: 'from-gray-500 to-gray-700',
      badge: 'Essential',
      features: ['Premium Paper', 'Foil Options', 'Spot UV', 'Embossing'],
      link: '/page/services/business-cards',
    },
    {
      icon: <FileText size={32} />,
      title: 'Flyers & Brochures',
      desc: 'Marketing materials for your business promotions.',
      gradient: 'from-blue-500 to-cyan-500',
      badge: 'Marketing',
      features: ['Multiple Sizes', 'Folding Options', 'Glossy/Matte', 'Bulk Pricing'],
      link: '/page/services/flyers',
    },
    {
      icon: <Package size={32} />,
      title: 'Custom Packaging',
      desc: 'Custom boxes and packaging for your products.',
      gradient: 'from-blue-500 to-indigo-500',
      badge: 'Premium',
      features: ['Custom Sizes', 'Full Color', 'Structural Design', 'Eco Options'],
      link: '/page/services/packaging',
    },
    {
      icon: <Pen size={32} />,
      title: 'Custom Pens',
      desc: 'Promotional pens with your logo for giveaways.',
      gradient: 'from-yellow-500 to-orange-500',
      badge: 'Budget Friendly',
      features: ['Custom Logo', 'Multiple Colors', 'Bulk Pricing', 'Fast Delivery'],
      link: '/page/services/pens',
    },
    {
      icon: <Key size={32} />,
      title: 'Custom Keychains',
      desc: 'Custom keychains for lasting brand impressions.',
      gradient: 'from-purple-500 to-pink-500',
      badge: 'Popular',
      features: ['Custom Shapes', 'Multiple Materials', 'Bulk Pricing', 'Fast Turnaround'],
      link: '/page/services/keychains',
    },
    
    // Specialty Services
    {
      icon: <Layers size={32} />,
      title: 'Screen Printing',
      desc: 'Traditional screen printing for bulk orders.',
      gradient: 'from-blue-500 to-cyan-500',
      badge: 'Best for Bulk',
      features: ['Bulk Orders', 'Spot Colors', 'Pantone Matching', 'Cost Effective'],
      link: '/page/services/screen-printing',
    },
    {
      icon: <Sparkles size={32} />,
      title: 'Embroidery',
      desc: 'Professional embroidery for a premium, textured look.',
      gradient: 'from-green-500 to-emerald-500',
      badge: 'Premium',
      features: ['3D Puff Option', 'Thread Matching', 'Digitizing', 'Bulk Discounts'],
      link: '/page/services/embroidery',
    },
    {
      icon: <ShoppingBag size={32} />,
      title: 'Tote Bags',
      desc: 'Eco-friendly custom tote bags for retail and events.',
      gradient: 'from-green-500 to-emerald-500',
      badge: 'Eco-Friendly',
      features: ['Eco Materials', 'Reusable', 'Custom Printing', 'Bulk Pricing'],
      link: '/page/services/totes',
    },
    {
      icon: <Flame size={32} />,
      title: 'Laser Engraving',
      desc: 'Precision laser engraving on various materials.',
      gradient: 'from-gray-500 to-gray-700',
      badge: 'Precision',
      features: ['Multiple Materials', 'High Precision', 'Permanent Marking', 'Photos Possible'],
      link: '/page/services/engraving',
    },
    {
      icon: <Scissors size={32} />,
      title: 'Custom Cutout',
      desc: 'Precision die-cut shapes, letters, and designs.',
      gradient: 'from-green-500 to-teal-500',
      badge: 'Versatile',
      features: ['Custom Shapes', 'Multiple Materials', 'Precision Cutting', 'Small to Bulk'],
      link: '/page/services/cutout',
    },
    {
      icon: <Palette size={32} />,
      title: 'Graphic Design',
      desc: 'Professional design services for all your needs.',
      gradient: 'from-orange-500 to-red-500',
      badge: 'Creative',
      features: ['Logo Design', 'Brand Identity', 'Print Ready Files', 'Revisions'],
      link: '/page/services/design',
    },
  ];

  const whyChooseUs = [
    { icon: <Truck size={28} />, title: 'Lightning Fast', desc: 'Fast & Quality & Services at Affordable', color: 'from-blue-500 to-cyan-500' },
    { icon: <Award size={28} />, title: 'Premium Quality', desc: 'Permium Digital Printing with Sharp Details & Vibrant Colors', color: 'from-yellow-500 to-orange-500' },
    { icon: <Headphones size={28} />, title: '24/7 Support', desc: 'Good & Creative Design', color: 'from-green-500 to-emerald-500' },
    { icon: <DollarSign size={28} />, title: 'Best Price', desc: 'Our Commitment to Quality , Timely Delivery Make us trusted partner for growing brands and established institutions', color: 'from-purple-500 to-pink-500' },
    { icon: <Shield size={28} />, title: '100% Satisfaction', desc: 'We use High Quality MAterials & Finishes', color: 'from-red-500 to-orange-500' },
    { icon: <Sparkles size={28} />, title: 'Eco-Friendly', desc: 'Sustainable printing practices', color: 'from-green-500 to-teal-500' },
  ];

  const processSteps = [
    { step: 1, title: 'Upload Design', desc: 'Drag & drop your files', icon: <Upload />, color: 'from-blue-500 to-cyan-500' },
    { step: 2, title: 'Get Quote', desc: 'Instant price calculation', icon: <DollarSign />, color: 'from-green-500 to-emerald-500' },
    { step: 3, title: 'Approve & Pay', desc: 'Secure payment options', icon: <CheckCircle />, color: 'from-yellow-500 to-orange-500' },
    { step: 4, title: 'Print & Ship', desc: 'Track your order live', icon: <Truck />, color: 'from-purple-500 to-pink-500' },
  ];

  const recentWorks = [
    { title: 'Corporate Branding', image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400', category: 'branding' },
    { title: 'Event Banners', image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=400', category: 'banners' },
    { title: 'Custom T-Shirts', image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400', category: 'apparel' },
    { title: 'Product Labels', image: 'https://images.unsplash.com/photo-1622542796254-5b9c46ab0c2f?w=400', category: 'labels' },
    { title: 'Vehicle Wraps', image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', category: 'wraps' },
    { title: 'Business Cards', image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=400', category: 'print' },
    { title: 'Billboard Design', image: 'https://images.unsplash.com/photo-1563207153-f403bf289096?w=400', category: 'outdoor' },
    { title: 'Packaging Design', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400', category: 'packaging' },
  ];

  const filteredWorks = activeTab === 'all' 
    ? recentWorks 
    : recentWorks.filter(work => work.category === activeTab);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <>
      <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 relative overflow-hidden">
        <FloatingParticles />
        <ParallaxBackground />
        <AnimatedWaves />

        {/* ================= HERO SECTION ================= */}
        <MotionSection
          className="relative min-h-screen flex items-center justify-center overflow-hidden"
          style={{ opacity: heroOpacity, scale: heroScale, filter: `blur(${heroBlur}px)` }}
        >
          {/* Background Video with Overlay */}
          <div className="absolute inset-0">
            <video
              ref={videoRef}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="/images/ad_video.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/80 to-transparent" />
            
            {/* Video Controls */}
            <div className="absolute bottom-8 right-8 flex gap-2 z-20">
              <Tooltip label={isMuted ? "Unmute" : "Mute"}>
                <ActionIcon
                  size="lg"
                  variant="filled"
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
                  onClick={toggleMute}
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </ActionIcon>
              </Tooltip>
              <Tooltip label={isPlaying ? "Pause" : "Play"}>
                <ActionIcon
                  size="lg"
                  variant="filled"
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
                  onClick={togglePlay}
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </ActionIcon>
              </Tooltip>
            </div>
          </div>

          <Container size="lg" className="relative z-10">
            <MotionDiv
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-center md:text-left max-w-4xl"
            >
              {/* ===== STUNNING WELCOME TEXT ===== */}
              <StunningWelcomeText />

              <MotionText
                size="xl"
                className="text-gray-200 mb-8 max-w-2xl text-lg md:text-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
              >
                From DTF apparel printing to custom signage, we deliver premium quality results 
                with lightning-fast turnaround. Join <span className="text-red-400 font-bold">5000+</span> satisfied customers.
              </MotionText>

              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.8 }}
                className="flex flex-wrap gap-4 justify-center md:justify-start"
              >
                <Button
                  size="xl"
                  radius="xl"
                  variant="gradient"
                  gradient={{ from: 'red', to: 'orange' }}
                  className="shadow-2xl hover:shadow-3xl transition-shadow duration-300 px-8 h-14"
                  rightSection={<ArrowRight size={20} />}
                >
                  Explore Services
                </Button>
                <Button
                  size="xl"
                  radius="xl"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white/10 backdrop-blur-sm px-8 h-14"
                  leftSection={<Upload size={20} />}
                >
                  Upload Design
                </Button>
              </MotionDiv>

              {/* Rotating Cube */}
              <div className="absolute bottom-20 right-0 hidden lg:block">
                <RotatingCube />
              </div>
            </MotionDiv>
          </Container>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
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

        {/* ================= FEATURED SERVICES ================= */}
        <MotionSection
          ref={servicesRef}  
          animate={servicesControls}
          initial="hidden"
          variants={containerVariants}
          className="py-32 relative"
        >
          <Container size="lg">
            <MotionDiv variants={itemVariants} className="text-center mb-16">
              <Badge size="lg" color="red" className="mb-4 animate-pulse">Our Services</Badge>
              <Title order={2} className="text-4xl md:text-5xl font-bold mb-4">
                Premium Printing
                <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent"> Solutions</span>
              </Title>
              <Text size="xl" c="dimmed" className="max-w-2xl mx-auto">
                Discover our comprehensive range of professional printing services
              </Text>
            </MotionDiv>

            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="xl">
              {featuredServices.map((service, index) => (
                <MotionCard
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="relative overflow-hidden group cursor-pointer"
                  padding="xl"
                  radius="lg"
                  withBorder
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  {service.badge && (
                    <Badge
                      className="absolute top-4 right-4 animate-pulse"
                      variant="gradient"
                      gradient={{ from: 'red', to: 'orange' }}
                    >
                      {service.badge}
                    </Badge>
                  )}

                  <ThemeIcon
                    size={70}
                    radius="xl"
                    variant="gradient"
                    gradient={{ from: service.gradient.split(' ')[0].replace('from-', ''), to: service.gradient.split(' ')[1].replace('to-', '') }}
                    className="mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300"
                  >
                    {service.icon}
                  </ThemeIcon>

                  <Title order={4} className="mb-2">{service.title}</Title>
                  <Text size="sm" c="dimmed" className="mb-4">{service.desc}</Text>

                  <div className="space-y-2 mb-4">
                    {service.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle size={14} className="text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="subtle"
                    color="red"
                    size="compact"
                    rightSection={<ChevronRight size={16} />}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    Learn More
                  </Button>
                </MotionCard>
              ))}
            </SimpleGrid>
          </Container>
        </MotionSection>

        {/* ================= WHY CHOOSE US ================= */}
        <MotionSection
          ref={whyUsRef}
          animate={whyUsControls}
          initial="hidden"
          variants={containerVariants}
          className="py-32 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <motion.div
              className="absolute top-0 left-0 w-64 h-64 bg-red-500 rounded-full filter blur-3xl"
              animate={{
                x: [0, 100, 0],
                y: [0, 50, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <motion.div
              className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500 rounded-full filter blur-3xl"
              animate={{
                x: [0, -100, 0],
                y: [0, -50, 0],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </div>

          <Container size="lg" className="relative z-10">
            <MotionDiv variants={itemVariants} className="text-center mb-16">
              <Badge size="lg" variant="gradient" gradient={{ from: 'red', to: 'orange' }} className="mb-4 animate-pulse">
                Why Us
              </Badge>
              <Title order={2} className="text-4xl md:text-5xl font-bold mb-4 text-white">
                Why Choose Lucia Printing?
              </Title>
              <Text size="xl" className="text-gray-300 max-w-2xl mx-auto">
                We combine cutting-edge technology with exceptional service
              </Text>
            </MotionDiv>

            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl">
              {whyChooseUs.map((item, i) => (
                <MotionCard
                  key={i}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white/10 backdrop-blur-lg border-0 hover:bg-white/20 transition-all duration-300"
                  padding="xl"
                  radius="lg"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  <Group>
                    <ThemeIcon size={50} radius="xl" variant="gradient" gradient={{ from: item.color.split(' ')[0].replace('from-', ''), to: item.color.split(' ')[1].replace('to-', '') }}>
                      {item.icon}
                    </ThemeIcon>
                    <div>
                      <Title order={4} className="text-white mb-1">{item.title}</Title>
                      <Text size="sm" className="text-gray-300">{item.desc}</Text>
                    </div>
                  </Group>
                </MotionCard>
              ))}
            </SimpleGrid>
          </Container>
        </MotionSection>

        {/* ================= PROCESS SECTION ================= */}
        <MotionSection
          ref={processRef}
          animate={processControls}
          initial="hidden"
          variants={containerVariants}
          className="py-32"
        >
          <Container size="lg">
            <MotionDiv variants={itemVariants} className="text-center mb-16">
              <Badge size="lg" color="red" className="mb-4 animate-pulse">Simple Process</Badge>
              <Title order={2} className="text-4xl md:text-5xl font-bold mb-4">
                How It Works
              </Title>
              <Text size="xl" c="dimmed" className="max-w-2xl mx-auto">
                Four simple steps to bring your ideas to life
              </Text>
            </MotionDiv>

            <Grid gutter="xl">
              {processSteps.map((step, i) => (
                <Grid.Col key={i} span={{ base: 12, md: 6, lg: 3 }}>
                  <MotionDiv
                    variants={itemVariants}
                    whileHover={{ y: -10 }}
                    className="relative"
                  >
                    <GradientBorderCard>
                      <div className="text-center">
                        <div className="relative inline-block mb-6">
                          <motion.div
                            className={`w-24 h-24 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto`}
                            animate={{
                              rotate: [0, 360],
                            }}
                            transition={{
                              duration: 20,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          >
                            {step.step}
                          </motion.div>
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                            <CheckCircle size={16} className="text-white" />
                          </div>
                        </div>
                        
                        <ThemeIcon
                          size={50}
                          radius="xl"
                          variant="gradient"
                          gradient={{ from: step.color.split(' ')[0].replace('from-', ''), to: step.color.split(' ')[1].replace('to-', '') }}
                          className="mx-auto mb-4"
                        >
                          {step.icon}
                        </ThemeIcon>

                        <Title order={4} className="mb-2">{step.title}</Title>
                        <Text size="sm" c="dimmed">{step.desc}</Text>
                      </div>
                    </GradientBorderCard>

                    {i < processSteps.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-12 text-red-500">
                        <motion.div
                          animate={{ x: [0, 10, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          <ChevronRight size={32} />
                        </motion.div>
                      </div>
                    )}
                  </MotionDiv>
                </Grid.Col>
              ))}
            </Grid>
          </Container>
        </MotionSection>

        {/* ================= STATS SECTION ================= */}
        <MotionSection
          ref={statsRef}
          animate={statsControls}
          initial="hidden"
          variants={containerVariants}
          className="py-20 bg-gradient-to-r from-red-600 to-orange-600 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }} />
          </div>

          <Container size="lg" className="relative z-10">
            <SimpleGrid cols={{ base: 2, lg: 4 }} spacing="xl">
              {stats.map((stat, index) => (
                <AnimatedCounter
                  key={index}
                  value={stat.value}
                  label={stat.label}
                  icon={stat.icon}
                  suffix={stat.suffix}
                />
              ))}
            </SimpleGrid>
          </Container>
        </MotionSection>

        {/* ================= TESTIMONIALS ================= */}
        <MotionSection
          ref={testimonialsRef}
          animate={testimonialsControls}
          initial="hidden"
          variants={containerVariants}
          className="py-32"
        >
          <Container size="lg">
            <Group justify="space-between" align="center" mb="xl">
              <MotionDiv variants={itemVariants}>
                <Badge size="lg" color="red" className="mb-4 animate-pulse">Testimonials</Badge>
                <Title order={2} className="text-4xl md:text-5xl font-bold mb-4">
                  What Our Clients Say
                </Title>
                <Text size="xl" c="dimmed" className="max-w-2xl">
                  Don&apos;t just take our word for it - hear from our satisfied customers
                </Text>
              </MotionDiv>
              
              <Button
                variant="light"
                color="blue"
                onClick={() => setTestimonialFormOpened(true)}
                radius="xl"
              >
                Share Your Experience
              </Button>
            </Group>

            {testimonialsLoading ? (
              <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="xl">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} height={300} radius="lg" />
                ))}
              </SimpleGrid>
            ) : testimonials.length > 0 ? (
              <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="xl">
                {testimonials.map((testimonial) => (
                  <MotionCard
                    key={testimonial.id}
                    variants={itemVariants}
                    whileHover={{ y: -10 }}
                    padding="xl"
                    radius="lg"
                    withBorder
                    className="relative hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="absolute top-4 right-4 text-yellow-400 flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <Star size={16} fill="currentColor" />
                        </motion.div>
                      ))}
                    </div>

                    <Group mb="md">
                      <Avatar 
                        src={testimonial.avatar || undefined} 
                        size="lg" 
                        radius="xl"
                        color="blue"
                      >
                        {testimonial.customer_name?.charAt(0)}
                      </Avatar>
                      <div>
                        <Text fw={600}>{testimonial.customer_name}</Text>
                        <Text size="sm" c="dimmed">{testimonial.customer_role || 'Customer'}</Text>
                        {testimonial.company && (
                          <Text size="xs" c="dimmed">{testimonial.company}</Text>
                        )}
                      </div>
                    </Group>

                    <Spoiler maxHeight={80} showLabel="Read more" hideLabel="Hide">
                      <Text size="lg" className="italic">&quot;{testimonial.content}&quot;</Text>
                    </Spoiler>

                    <div className="absolute bottom-4 left-4 text-red-500 opacity-10">
                      <Quote size={40} />
                    </div>
                  </MotionCard>
                ))}
              </SimpleGrid>
            ) : (
              <Paper p="xl" radius="lg" withBorder>
                <Center>
                  <Stack align="center">
                    <Text size="lg" c="dimmed">No testimonials yet</Text>
                    <Button
                      variant="light"
                      color="blue"
                      onClick={() => setTestimonialFormOpened(true)}
                    >
                      Be the first to share your experience
                    </Button>
                  </Stack>
                </Center>
              </Paper>
            )}
          </Container>
        </MotionSection>

        {/* ================= RECENT WORKS ================= */}
        <MotionSection
          ref={worksRef}
          animate={worksControls}
          initial="hidden"
          variants={containerVariants}
          className="py-20 bg-gray-50 dark:bg-gray-900"
        >
          <Container size="lg">
            <MotionDiv variants={itemVariants} className="text-center mb-12">
              <Badge size="lg" color="red" className="mb-4 animate-pulse">Portfolio</Badge>
              <Title order={2} className="text-4xl md:text-5xl font-bold mb-4">
                Recent Projects
              </Title>
              <Text size="xl" c="dimmed" className="max-w-2xl mx-auto">
                Check out some of our latest work
              </Text>
            </MotionDiv>

            <Tabs value={activeTab} onChange={setActiveTab} className="mb-8">
              <Tabs.List grow>
                <Tabs.Tab value="all">All</Tabs.Tab>
                <Tabs.Tab value="branding">Branding</Tabs.Tab>
                <Tabs.Tab value="banners">Banners</Tabs.Tab>
                <Tabs.Tab value="apparel">Apparel</Tabs.Tab>
                <Tabs.Tab value="labels">Labels</Tabs.Tab>
                <Tabs.Tab value="wraps">Wraps</Tabs.Tab>
              </Tabs.List>
            </Tabs>

            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
              {filteredWorks.map((work, index) => (
                <MotionDiv
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  className="relative group overflow-hidden rounded-xl"
                >
                  <img
                    src={work.image}
                    alt={work.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 text-white">
                      <Text fw={600}>{work.title}</Text>
                      <Badge color="red" size="sm" className="mt-2">{work.category}</Badge>
                    </div>
                  </div>
                </MotionDiv>
              ))}
            </SimpleGrid>
          </Container>
        </MotionSection>

        {/* ================= CTA SECTION ================= */}
        <section className="py-32 bg-gradient-to-r from-gray-900 to-gray-800 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }} />
          </div>

          <Container size="lg" className="relative z-10 text-center">
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Badge size="lg" variant="gradient" gradient={{ from: 'red', to: 'orange' }} className="mb-6 animate-pulse">
                Limited Time Offer
              </Badge>

              <Title className="text-5xl md:text-6xl font-bold mb-6">
                Ready to Print Your Idea?
              </Title>

              <Text size="xl" className="text-gray-300 mb-10 max-w-2xl mx-auto">
                Get <span className="text-red-400 font-bold">20% off</span> your first order + free design consultation
              </Text>

              <Group justify="center" gap="md">
                <Button
                  size="xl"
                  radius="xl"
                  variant="gradient"
                  gradient={{ from: 'red', to: 'orange' }}
                  className="shadow-2xl px-12 h-14"
                  rightSection={<ArrowRight size={20} />}
                >
                  Start Your Project
                </Button>
                <Button
                  size="xl"
                  radius="xl"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white/10 h-14"
                  leftSection={<Phone size={20} />}
                >
                  Call Us Now
                </Button>
              </Group>
            </MotionDiv>
          </Container>
        </section>

        {/* ================= FOOTER ================= */}
        <Footer />

        {/* ================= FLOATING ACTIONS ================= */}
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

        {/* Testimonial Form Modal */}
        <TestimonialForm
          opened={testimonialFormOpened}
          onClose={() => setTestimonialFormOpened(false)}
          onSuccess={fetchTestimonials}
        />
    
        <style jsx>{`
          .triangle-shape {
            clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
          }
          .perspective-1000 {
            perspective: 1000px;
          }
          @keyframes gradient-xy {
            0%, 100% {
              background-size: 400% 400%;
              background-position: left top;
            }
            25% {
              background-size: 400% 400%;
              background-position: right top;
            }
            50% {
              background-size: 400% 400%;
              background-position: right bottom;
            }
            75% {
              background-size: 400% 400%;
              background-position: left bottom;
            }
          }
          .animate-gradient-xy {
            animation: gradient-xy 3s ease infinite;
          }
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}</style>
      </div>
    </>
  );
}