// app/page/services/ServiceTemplate.tsx
'use client';

import { Container, Title, Text, Button, Grid, Card, Group, ThemeIcon, Badge, SimpleGrid, Stack, Divider, ActionIcon, Tooltip, Paper, List, Image } from '@mantine/core';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Printer,
  Upload,
  MessageCircle,
  DollarSign,
  Truck,
  Shield,
  Star,
  Heart,
  Award,
  Users,
  Headphones,
  Sparkles,
  Zap,
  Package,
  Camera,
  Palette,
  Ruler,
  Scissors,
  FileText,
  ShoppingBag,
  Coffee,
  Car,
  Shirt,
  Tag,
  Key,
  Pen,
  Lightbulb,
  Flame,
  Snowflake,
  CupSoda,
  Wine,
  Sparkle,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';

const MotionDiv = motion.div;

interface ServiceTemplateProps {
  service: {
    id: string;
    title: string;
    shortDescription: string;
    fullDescription: string;
    icon: React.ReactNode;
    gradient: string;
    badge?: string;
    features: string[];
    applications: string[];
    process: { step: number; title: string; description: string }[];
    specs: { label: string; value: string }[];
    priceRange: string;
    minOrder: string;
    turnaround: string;
    materials: string[];
    formats: string[];
    colors: string[];
    gallery: { src: string; alt: string }[];
    faqs: { question: string; answer: string }[];
    relatedServices: { title: string; href: string; icon: React.ReactNode }[];
  };
}

export default function ServiceTemplate({ service }: ServiceTemplateProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black-200 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-l from-red-200 to-orange-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }} />
        </div>
        
        <Container size="lg" className="relative z-10">
          <Grid gutter={50} align="center">
            <Grid.Col span={{ base: 12, md: 8 }}>
              <MotionDiv
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Badge size="lg" variant="white" className="mb-4 bg-white/20 text-white border-0">
                  {service.badge || 'Premium Service'}
                </Badge>
                <Title order={1} className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  {service.title}
                </Title>
                <Text size="xl" className="text-white/90 mb-8 max-w-2xl">
                  {service.shortDescription}
                </Text>
                <Group>
                  <Button
                    size="lg"
                    variant="white"
                    color="red"
                    component={Link}
                    href="/upload"
                    rightSection={<ArrowRight size={20} />}
                  >
                    Start Your Project
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    color="white"
                    component={Link}
                    href="/contact"
                  >
                    Contact Us
                  </Button>
                </Group>
              </MotionDiv>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <MotionDiv
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center"
              >
                <ThemeIcon size={80} radius="xl" variant="white" className="mx-auto mb-4">
                  {service.icon}
                </ThemeIcon>
                <Text fw={700} size="xl" className="text-white">Starting From</Text>
                <Text fw={800} size="3xl" className="text-white mb-2">{service.priceRange}</Text>
                <Text size="sm" className="text-white/80">Min Order: {service.minOrder}</Text>
                <Divider className="my-4 border-white/20" />
                <Text size="sm" className="text-white/80">Turnaround: {service.turnaround}</Text>
              </MotionDiv>
            </Grid.Col>
          </Grid>
        </Container>
      </section>

      {/* Overview Section */}
      <Container size="lg" className="py-16">
        <Grid gutter={50}>
          <Grid.Col span={{ base: 12, md: 7 }}>
            <MotionDiv
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge size="lg" color="red" className="mb-4">Overview</Badge>
              <Title order={2} className="text-3xl md:text-4xl font-bold mb-6">
                About This Service
              </Title>
              <Text size="lg" className="text-gray-600 dark:text-gray-400 mb-6">
                {service.fullDescription}
              </Text>
              
              <SimpleGrid cols={2} spacing="md" className="mb-8">
                {service.features.map((feature, index) => (
                  <Paper key={index} p="md" withBorder className="bg-gray-50 dark:bg-gray-800">
                    <Group>
                      <CheckCircle size={20} className="text-green-500" />
                      <Text>{feature}</Text>
                    </Group>
                  </Paper>
                ))}
              </SimpleGrid>
            </MotionDiv>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 5 }}>
            <MotionDiv
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl p-8"
            >
              <Title order={3} className="text-2xl font-bold mb-6">Quick Specs</Title>
              <Stack gap="md">
                {service.specs.map((spec, index) => (
                  <Group key={index} justify="space-between" className="border-b border-gray-200 dark:border-gray-700 pb-2">
                    <Text c="dimmed">{spec.label}</Text>
                    <Text fw={600}>{spec.value}</Text>
                  </Group>
                ))}
              </Stack>
            </MotionDiv>
          </Grid.Col>
        </Grid>
      </Container>

      {/* Applications Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <Container size="lg">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge size="lg" color="red" className="mb-4">Applications</Badge>
            <Title order={2} className="text-3xl md:text-4xl font-bold mb-4">
              Perfect For
            </Title>
            <Text size="xl" c="dimmed" className="max-w-2xl mx-auto">
              Ideal applications for {service.title}
            </Text>
          </MotionDiv>

          <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
            {service.applications.map((app, index) => (
              <MotionDiv
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Paper p="xl" withBorder className="text-center hover:shadow-lg transition-shadow">
                  <ThemeIcon size={50} radius="xl" color="red" variant="light" className="mx-auto mb-4">
                    <Star size={24} />
                  </ThemeIcon>
                  <Text>{app}</Text>
                </Paper>
              </MotionDiv>
            ))}
          </SimpleGrid>
        </Container>
      </section>

      {/* Process Section */}
      <Container size="lg" className="py-16">
        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge size="lg" color="red" className="mb-4">Process</Badge>
          <Title order={2} className="text-3xl md:text-4xl font-bold mb-4">
            How It Works
          </Title>
          <Text size="xl" c="dimmed" className="max-w-2xl mx-auto">
            Simple steps to get your {service.title.toLowerCase()} project done
          </Text>
        </MotionDiv>

        <Grid gutter={30}>
          {service.process.map((step, index) => (
            <Grid.Col key={index} span={{ base: 12, md: 6, lg: 3 }}>
              <MotionDiv
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <Paper p="xl" withBorder className="text-center h-full">
                  <div className="relative inline-block mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto">
                      {step.step}
                    </div>
                  </div>
                  <Title order={4} className="mb-2">{step.title}</Title>
                  <Text size="sm" c="dimmed">{step.description}</Text>
                </Paper>
                {index < service.process.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-8 text-red-500">
                    <ArrowRight size={32} />
                  </div>
                )}
              </MotionDiv>
            </Grid.Col>
          ))}
        </Grid>
      </Container>

      {/* Materials & Specifications */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <Container size="lg">
          <Grid gutter={50}>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <MotionDiv
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Badge size="lg" color="red" className="mb-4">Materials</Badge>
                <Title order={3} className="text-2xl font-bold mb-4">Available Materials</Title>
                <List
                  spacing="sm"
                  size="lg"
                  icon={<CheckCircle size={20} className="text-green-500" />}
                >
                  {service.materials.map((material, index) => (
                    <List.Item key={index}>{material}</List.Item>
                  ))}
                </List>
              </MotionDiv>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <MotionDiv
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Badge size="lg" color="red" className="mb-4">File Formats</Badge>
                <Title order={3} className="text-2xl font-bold mb-4">Accepted Formats</Title>
                <List
                  spacing="sm"
                  size="lg"
                  icon={<CheckCircle size={20} className="text-green-500" />}
                >
                  {service.formats.map((format, index) => (
                    <List.Item key={index}>{format}</List.Item>
                  ))}
                </List>
              </MotionDiv>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <MotionDiv
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Badge size="lg" color="red" className="mb-4">Colors</Badge>
                <Title order={3} className="text-2xl font-bold mb-4">Available Colors</Title>
                <List
                  spacing="sm"
                  size="lg"
                  icon={<CheckCircle size={20} className="text-green-500" />}
                >
                  {service.colors.map((color, index) => (
                    <List.Item key={index}>{color}</List.Item>
                  ))}
                </List>
              </MotionDiv>
            </Grid.Col>
          </Grid>
        </Container>
      </section>

      {/* FAQ Section */}
      <Container size="lg" className="py-16">
        <MotionDiv
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge size="lg" color="red" className="mb-4">FAQ</Badge>
          <Title order={2} className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </Title>
        </MotionDiv>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
          {service.faqs.map((faq, index) => (
            <MotionDiv
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Paper p="xl" withBorder>
                <Text fw={700} size="lg" className="mb-2">{faq.question}</Text>
                <Text c="dimmed">{faq.answer}</Text>
              </Paper>
            </MotionDiv>
          ))}
        </SimpleGrid>
      </Container>

      {/* Related Services */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <Container size="lg">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge size="lg" color="red" className="mb-4">Related Services</Badge>
            <Title order={2} className="text-3xl md:text-4xl font-bold mb-4">
              You Might Also Like
            </Title>
          </MotionDiv>

          <SimpleGrid cols={{ base: 1, md: 2, lg: 4 }} spacing="lg">
            {service.relatedServices.map((related, index) => (
              <MotionDiv
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Paper
                  component={Link}
                  href={related.href}
                  p="xl"
                  withBorder
                  className="text-center hover:shadow-lg transition-shadow"
                >
                  <ThemeIcon size={50} radius="xl" color="red" variant="light" className="mx-auto mb-4">
                    {related.icon}
                  </ThemeIcon>
                  <Text fw={600}>{related.title}</Text>
                </Paper>
              </MotionDiv>
            ))}
          </SimpleGrid>
        </Container>
      </section>

      {/* CTA Section */}
      <Container size="lg" className="py-16">
        <MotionDiv
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl p-12 text-center text-white"
        >
          <Title order={2} className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your {service.title} Project?
          </Title>
          <Text size="xl" className="mb-8 max-w-2xl mx-auto text-white/90">
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
        </MotionDiv>
      </Container>
    </div>
  );
}