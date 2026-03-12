/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Container, Title, Text, Button, Grid, Group, ThemeIcon, Badge, SimpleGrid, Stack, Divider, Paper, List, useMantineColorScheme } from '@mantine/core';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle,
  Printer,
  Shirt,
  Megaphone,
  Tag,
  Coffee,
  Car,
  Package,
  FileText,
  Palette,
  Sparkles,
  Award,
  Flame,
  Snowflake,
  Scissors,
  Camera,
  Key,
  Pen,
  ShoppingBag,
} from 'lucide-react';

const iconMap: Record<string, any> = {
  Printer, Shirt, Megaphone, Tag, Coffee, Car, Package, FileText, Palette,
  Sparkles, Award, Flame, Snowflake, Scissors, Camera, Key, Pen, ShoppingBag,
};

const MotionDiv = motion.div;

export default function DynamicServicePage({ service }: { service: any }) {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  
  const IconComponent = iconMap[service.icon_name] || Printer;

  // Debug logs
  console.log('Service data:', service);
  console.log('Features:', service.features);
  console.log('Applications:', service.applications);
  console.log('Process Steps:', service.process_steps);
  console.log('Specifications:', service.specifications);
  console.log('Materials:', service.materials);
  console.log('Formats:', service.formats);
  console.log('Colors:', service.colors);
  console.log('FAQs:', service.faqs);

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
        
        <Container size="lg" className="relative z-10">
          <Grid gutter={50} align="center">
            <Grid.Col span={{ base: 12, md: 8 }}>
              <MotionDiv
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {service.badge && (
                  <Badge size="lg" variant="white" className="mb-4 bg-white/20 text-white border-0">
                    {service.badge}
                  </Badge>
                )}
                <Title order={1} className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  {service.title}
                </Title>
                <Text size="xl" className="text-white/90 mb-8 max-w-2xl">
                  {service.short_description}
                </Text>
                <Group>
                  <Button
                    size="lg"
                    variant="white"
                    color="red"
                    component={Link}
                    href="https://t.me/Luciachale"
                    rightSection={<ArrowRight size={20} />}
                  >
                    Start Your Project
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    color="white"
                    component={Link}
                    href="/page/contact"
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
                  <IconComponent size={40} />
                </ThemeIcon>
                <Text fw={700} size="xl" className="text-white">Starting From</Text>
                <Text fw={800} size="3xl" className="text-white mb-2">{service.price_range}</Text>
                <Text size="sm" className="text-white/80">Min Order: {service.min_order}</Text>
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
              <Title order={2} className={`text-3xl md:text-4xl font-bold mb-6 transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                About This Service
              </Title>
              <Text size="lg" className={`mb-6 transition-colors duration-300 ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {service.full_description}
              </Text>
              
              {service.features && service.features.length > 0 && (
                <SimpleGrid cols={2} spacing="md" className="mb-8">
                  {service.features.map((feature: string, index: number) => (
                    <Paper 
                      key={index} 
                      p="md" 
                      withBorder 
                      className={`transition-colors duration-300 ${
                        isDark 
                          ? 'bg-gray-800 border-gray-700' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <Group>
                        <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                        <Text className={isDark ? 'text-gray-200' : 'text-gray-700'}>
                          {feature}
                        </Text>
                      </Group>
                    </Paper>
                  ))}
                </SimpleGrid>
              )}
            </MotionDiv>
          </Grid.Col>

          {service.specifications && service.specifications.length > 0 && (
            <Grid.Col span={{ base: 12, md: 5 }}>
              <MotionDiv
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className={`rounded-2xl p-8 transition-colors duration-300 ${
                  isDark 
                    ? 'bg-gradient-to-br from-red-900/20 to-orange-900/20' 
                    : 'bg-gradient-to-br from-red-50 to-orange-50'
                }`}
              >
                <Title order={3} className={`text-2xl font-bold mb-6 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Quick Specs
                </Title>
                <Stack gap="md">
                  {service.specifications.map((spec: any, index: number) => (
                    <Group 
                      key={index} 
                      justify="space-between" 
                      className={`border-b pb-2 transition-colors duration-300 ${
                        isDark 
                          ? 'border-gray-700' 
                          : 'border-gray-200'
                      }`}
                    >
                      <Text c="dimmed">{spec.label}</Text>
                      <Text fw={600} className={isDark ? 'text-gray-200' : 'text-gray-900'}>
                        {spec.value}
                      </Text>
                    </Group>
                  ))}
                </Stack>
              </MotionDiv>
            </Grid.Col>
          )}
        </Grid>
      </Container>

      {/* Applications Section */}
      {service.applications && service.applications.length > 0 && (
        <section className={`py-16 transition-colors duration-300 ${
          isDark ? 'bg-gray-900/50' : 'bg-gray-50'
        }`}>
          <Container size="lg">
            <MotionDiv
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Badge size="lg" color="red" className="mb-4">Applications</Badge>
              <Title order={2} className={`text-3xl md:text-4xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Perfect For
              </Title>
            </MotionDiv>

            <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
              {service.applications.map((app: string, index: number) => (
                <MotionDiv
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Paper 
                    p="xl" 
                    withBorder 
                    className={`text-center hover:shadow-lg transition-all duration-300 ${
                      isDark 
                        ? 'bg-gray-800 border-gray-700 hover:shadow-gray-800/50' 
                        : 'bg-white border-gray-200 hover:shadow-gray-200/50'
                    }`}
                  >
                    <ThemeIcon size={50} radius="xl" color="red" variant="light" className="mx-auto mb-4">
                      <CheckCircle size={24} />
                    </ThemeIcon>
                    <Text className={isDark ? 'text-gray-200' : 'text-gray-700'}>
                      {app}
                    </Text>
                  </Paper>
                </MotionDiv>
              ))}
            </SimpleGrid>
          </Container>
        </section>
      )}

      {/* Process Section */}
      {service.process_steps && service.process_steps.length > 0 && (
        <Container size="lg" className="py-16">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge size="lg" color="red" className="mb-4">Process</Badge>
            <Title order={2} className={`text-3xl md:text-4xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              How It Works
            </Title>
          </MotionDiv>

          <Grid gutter={30}>
            {service.process_steps.map((step: any, index: number) => {
              const StepIcon = iconMap[step.icon_name] || Printer;
              return (
                <Grid.Col key={index} span={{ base: 12, md: 6, lg: 3 }}>
                  <MotionDiv
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="relative"
                  >
                    <Paper 
                      p="xl" 
                      withBorder 
                      className={`text-center h-full transition-all duration-300 ${
                        isDark 
                          ? 'bg-gray-800 border-gray-700' 
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="relative inline-block mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto">
                          {step.step_number || index + 1}
                        </div>
                      </div>
                      <ThemeIcon
                        size={50}
                        radius="xl"
                        color="red"
                        variant="light"
                        className="mx-auto mb-4"
                      >
                        <StepIcon size={24} />
                      </ThemeIcon>
                      <Title order={4} className={`mb-2 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {step.title}
                      </Title>
                      <Text size="sm" c="dimmed">{step.description}</Text>
                    </Paper>
                  </MotionDiv>
                </Grid.Col>
              );
            })}
          </Grid>
        </Container>
      )}

      {/* Materials & Specifications */}
      {(service.materials?.length > 0 || service.formats?.length > 0 || service.colors?.length > 0) && (
        <section className={`py-16 transition-colors duration-300 ${
          isDark ? 'bg-gray-900/50' : 'bg-gray-50'
        }`}>
          <Container size="lg">
            <Grid gutter={50}>
              {service.materials?.length > 0 && (
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <MotionDiv
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <Badge size="lg" color="red" className="mb-4">Materials</Badge>
                    <Title order={3} className={`text-2xl font-bold mb-4 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      Available Materials
                    </Title>
                    <List
                      spacing="sm"
                      size="lg"
                      icon={<CheckCircle size={20} className="text-green-500" />}
                      className={isDark ? 'text-gray-300' : 'text-gray-700'}
                    >
                      {service.materials.map((material: string, index: number) => (
                        <List.Item key={index}>{material}</List.Item>
                      ))}
                    </List>
                  </MotionDiv>
                </Grid.Col>
              )}

              {service.formats?.length > 0 && (
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <MotionDiv
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <Badge size="lg" color="red" className="mb-4">File Formats</Badge>
                    <Title order={3} className={`text-2xl font-bold mb-4 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      Accepted Formats
                    </Title>
                    <List
                      spacing="sm"
                      size="lg"
                      icon={<CheckCircle size={20} className="text-green-500" />}
                      className={isDark ? 'text-gray-300' : 'text-gray-700'}
                    >
                      {service.formats.map((format: string, index: number) => (
                        <List.Item key={index}>{format}</List.Item>
                      ))}
                    </List>
                  </MotionDiv>
                </Grid.Col>
              )}

              {service.colors?.length > 0 && (
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <MotionDiv
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <Badge size="lg" color="red" className="mb-4">Colors</Badge>
                    <Title order={3} className={`text-2xl font-bold mb-4 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      Available Colors
                    </Title>
                    <List
                      spacing="sm"
                      size="lg"
                      icon={<CheckCircle size={20} className="text-green-500" />}
                      className={isDark ? 'text-gray-300' : 'text-gray-700'}
                    >
                      {service.colors.map((color: string, index: number) => (
                        <List.Item key={index}>{color}</List.Item>
                      ))}
                    </List>
                  </MotionDiv>
                </Grid.Col>
              )}
            </Grid>
          </Container>
        </section>
      )}

      {/* FAQ Section */}
      {service.faqs && service.faqs.length > 0 && (
        <Container size="lg" className="py-16">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge size="lg" color="red" className="mb-4">FAQ</Badge>
            <Title order={2} className={`text-3xl md:text-4xl font-bold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Frequently Asked Questions
            </Title>
          </MotionDiv>

          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
            {service.faqs.map((faq: any, index: number) => (
              <MotionDiv
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Paper 
                  p="xl" 
                  withBorder 
                  className={`transition-all duration-300 ${
                    isDark 
                      ? 'bg-gray-800 border-gray-700' 
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <Text fw={700} size="lg" className={`mb-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {faq.question}
                  </Text>
                  <Text c="dimmed">{faq.answer}</Text>
                </Paper>
              </MotionDiv>
            ))}
          </SimpleGrid>
        </Container>
      )}

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
              href="https://t.me/Luciachale"
            >
              Upload Your Design on Telegram
            </Button>
            <Button
              size="xl"
              variant="outline"
              color="white"
              component={Link}
              href="/page/contact"
            >
              Contact Us
            </Button>
          </Group>
        </MotionDiv>
      </Container>
    </div>
  );
}