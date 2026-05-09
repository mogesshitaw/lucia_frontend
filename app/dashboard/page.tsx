/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Title,
  Text,
  Stack,
  Group,
  Button,
  Avatar,
  Alert,
  Loader,
  Center,
  Grid,
  Card,
  ThemeIcon,
  SimpleGrid,
  Badge,
  Divider,
  RingProgress,
  Image,
  Box,
} from '@mantine/core';
import {
  IconUser,
  IconExclamationCircle,
  IconCalendar,
  IconTrendingUp,
  IconEye,
  IconMessage,
  IconBell,
  IconClock,
  IconTag,
  IconHeart,
  IconNews,
  IconVideo,
  IconArticle,
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface User {
  id: string;
  username: string;
  full_name: string | null;
  role: string;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
}

interface Announcement {
  id: string;
  title: string;
  description: string;
  detailed_content?: string;
  bullet_points?: string[];
  cta?: string;
  cta_link?: string;
  date: string;
  read_time: number;
  type: string;
  priority: string;
  image_url?: string;
  image?: string;
  tags?: string[];
  views: number;
  likes: number;
  comments: number;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

interface DashboardStats {
  totalAnnouncements: number;
  featuredAnnouncements: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  publishedCount: number;
  draftCount: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalAnnouncements: 0,
    featuredAnnouncements: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    publishedCount: 0,
    draftCount: 0,
  });

  useEffect(() => {
    fetchUserData();
    fetchAnnouncements();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/page/login');
        return;
      }

      const response = await fetch(`${API_URL}/auth/me`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/page/login');
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.user) {
        setUser(data.user);
      } else {
        setError(data.error || 'Failed to load user data');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setError('Error loading user data');
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/announcements?limit=10&page=1`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        const announcementsData = data.data.announcements || data.data || [];
        setAnnouncements(announcementsData);
        
        const totalAnnouncements = announcementsData.length;
        const featuredAnnouncements = announcementsData.filter((a: Announcement) => a.is_featured).length;
        const totalViews = announcementsData.reduce((sum: number, a: Announcement) => sum + (a.views || 0), 0);
        const totalLikes = announcementsData.reduce((sum: number, a: Announcement) => sum + (a.likes || 0), 0);
        const totalComments = announcementsData.reduce((sum: number, a: Announcement) => sum + (a.comments || 0), 0);
        
        setStats({
          totalAnnouncements,
          featuredAnnouncements,
          totalViews,
          totalLikes,
          totalComments,
          publishedCount: announcementsData.filter((a: Announcement) => a.is_published).length,
          draftCount: announcementsData.filter((a: Announcement) => !a.is_published).length,
        });
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
      notifications.show({
        title: 'Warning',
        message: 'Could not load announcements',
        color: 'yellow',
      });
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = dayjs().hour();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getDisplayName = () => {
    if (user?.full_name) return user.full_name;
    if (user?.username) return user.username;
    return 'User';
  };

  const getTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'news':
        return <IconNews size={16} />;
      case 'video':
        return <IconVideo size={16} />;
      case 'article':
        return <IconArticle size={16} />;
      default:
        return <IconBell size={16} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'green';
      default:
        return 'blue';
    }
  };

  if (loading) {
    return (
      <Center h="100vh">
        <Loader size="lg" />
      </Center>
    );
  }

  if (error) {
    return (
      <Container size="xl" py="xl">
        <Alert icon={<IconExclamationCircle size={16} />} title="Error" color="red">
          {error}
        </Alert>
        <Group justify="center" mt="md">
          <Button onClick={() => {
            fetchUserData();
            fetchAnnouncements();
          }}>Try Again</Button>
        </Group>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      {/* Welcome Section */}
      <Paper 
        withBorder 
        p="xl" 
        radius="md"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <Group justify="space-between" align="center">
          <div>
            <Text size="sm" c="white" opacity={0.8}>
              Welcome back,
            </Text>
            <Title order={1} c="white" mt={5}>
              {getGreeting()}, {getDisplayName()}!
            </Title>
            <Text c="white" opacity={0.8} mt={10}>
              Here&apos;s what&apos;s happening with your announcements today.
            </Text>
            <Group mt="md">
              <Badge size="lg" color="white" variant="light">
                Total Announcements: {stats.totalAnnouncements}
              </Badge>
            </Group>
          </div>
          
          <Avatar
            size={80}
            radius={80}
            color="white"
            style={{
              border: '3px solid white',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
            }}
          >
            <IconUser size={40} color="white" />
          </Avatar>
        </Group>
      </Paper>

      {/* Stats Cards */}
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} mt="xl">
        <Card withBorder shadow="sm" radius="md">
          <Group justify="space-between" align="flex-start">
            <div>
              <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                Total Announcements
              </Text>
              <Text fw={700} size="xl" mt={5}>
                {stats.totalAnnouncements}
              </Text>
            </div>
            <ThemeIcon size="lg" variant="light" color="blue">
              <IconBell size={20} />
            </ThemeIcon>
          </Group>
        </Card>

        <Card withBorder shadow="sm" radius="md">
          <Group justify="space-between" align="flex-start">
            <div>
              <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                Featured
              </Text>
              <Text fw={700} size="xl" mt={5}>
                {stats.featuredAnnouncements}
              </Text>
            </div>
            <ThemeIcon size="lg" variant="light" color="yellow">
              <IconTrendingUp size={20} />
            </ThemeIcon>
          </Group>
        </Card>

        <Card withBorder shadow="sm" radius="md">
          <Group justify="space-between" align="flex-start">
            <div>
              <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                Total Views
              </Text>
              <Text fw={700} size="xl" mt={5}>
                {stats.totalViews.toLocaleString()}
              </Text>
            </div>
            <ThemeIcon size="lg" variant="light" color="green">
              <IconEye size={20} />
            </ThemeIcon>
          </Group>
        </Card>

        <Card withBorder shadow="sm" radius="md">
          <Group justify="space-between" align="flex-start">
            <div>
              <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                Engagement
              </Text>
              <Text fw={700} size="xl" mt={5}>
                {(stats.totalLikes + stats.totalComments).toLocaleString()}
              </Text>
              <Group gap="xs" mt={5}>
                <IconHeart size={12} /> {stats.totalLikes}
                <IconMessage size={12} /> {stats.totalComments}
              </Group>
            </div>
            <ThemeIcon size="lg" variant="light" color="grape">
              <IconMessage size={20} />
            </ThemeIcon>
          </Group>
        </Card>
      </SimpleGrid>

      {/* Main Content Grid */}
      <Grid mt="xl">
        {/* Recent Announcements Section */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card withBorder shadow="sm" radius="md" p="xl">
            <Group justify="space-between" mb="lg">
              <Title order={3}>Recent Announcements</Title>
              <Button 
                variant="light" 
                size="sm"
                onClick={() => router.push('/announcements')}
              >
                View All
              </Button>
            </Group>
            
            <Divider mb="lg" />
            
            {announcements.length > 0 ? (
              <Stack>
                {announcements.slice(0, 5).map((announcement) => (
                  <Paper 
                    key={announcement.id} 
                    withBorder 
                    p="md" 
                    radius="md"
                    style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                    onClick={() => router.push(`/announcements/${announcement.id}`)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateX(5px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    <Group align="flex-start" wrap="nowrap">
                      {announcement.image && (
                        <Image
                          src={announcement.image}
                          width={80}
                          height={80}
                          radius="md"
                          style={{ objectFit: 'cover' }}
                          alt={announcement.title}
                        />
                      )}
                      <div style={{ flex: 1 }}>
                        <Group gap="xs" mb={5} wrap="wrap">
                          <Group gap="xs">
                            {getTypeIcon(announcement.type)}
                            <Badge size="sm" variant="light" color="blue">
                              {announcement.type || 'General'}
                            </Badge>
                          </Group>
                          <Badge size="sm" color={getPriorityColor(announcement.priority)}>
                            {announcement.priority || 'Medium'} Priority
                          </Badge>
                          {announcement.is_featured && (
                            <Badge size="sm" color="yellow" variant="filled">
                              Featured
                            </Badge>
                          )}
                        </Group>
                        
                        <Text fw={600} size="md" mt={5}>
                          {announcement.title}
                        </Text>
                        
                        <Text size="sm" c="dimmed" lineClamp={2} mt={5}>
                          {announcement.description}
                        </Text>
                        
                        <Group gap="md" mt="md">
                          <Group gap="xs">
                            <IconCalendar size={14} />
                            <Text size="xs" c="dimmed">
                              {dayjs(announcement.date).format('MMM D, YYYY')}
                            </Text>
                          </Group>
                          
                          <Group gap="xs">
                            <IconClock size={14} />
                            <Text size="xs" c="dimmed">
                              {announcement.read_time} min read
                            </Text>
                          </Group>
                          
                          <Group gap="xs">
                            <IconEye size={14} />
                            <Text size="xs" c="dimmed">
                              {announcement.views || 0} views
                            </Text>
                          </Group>
                          
                          <Group gap="xs">
                            <IconHeart size={14} />
                            <Text size="xs" c="dimmed">
                              {announcement.likes || 0}
                            </Text>
                          </Group>
                        </Group>
                        
                        {announcement.tags && announcement.tags.length > 0 && (
                          <Group gap="xs" mt="md">
                            <IconTag size={14} />
                            {announcement.tags.slice(0, 3).map((tag, idx) => (
                              <Badge key={idx} size="xs" variant="outline">
                                {tag}
                              </Badge>
                            ))}
                          </Group>
                        )}
                      </div>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            ) : (
              <Center py="xl">
                <Stack align="center">
                  <IconBell size={48} opacity={0.3} />
                  <Text c="dimmed" ta="center">
                    No announcements yet
                  </Text>
                  <Button 
                    variant="light" 
                    size="sm"
                    onClick={() => router.push('/announcements/create')}
                  >
                    Create First Announcement
                  </Button>
                </Stack>
              </Center>
            )}
          </Card>
        </Grid.Col>

        {/* Sidebar Section */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack>
            {/* Engagement Stats Card */}
            <Card withBorder shadow="sm" radius="md" p="xl">
              <Title order={4} mb="md">Engagement Overview</Title>
              <Stack>
                <div>
                  <Text size="xs" c="dimmed" mb={5}>Publication Rate</Text>
                  <RingProgress
                    size={120}
                    thickness={8}
                    roundCaps
                    sections={[
                      { value: (stats.publishedCount / (stats.totalAnnouncements || 1)) * 100, color: 'teal' },
                    ]}
                    label={
                      <Text ta="center" fw={700} size="xl">
                        {Math.round((stats.publishedCount / (stats.totalAnnouncements || 1)) * 100)}%
                      </Text>
                    }
                  />
                </div>
                <Divider />
                <Group justify="space-between">
                  <Text size="sm">Published</Text>
                  <Badge color="teal">{stats.publishedCount}</Badge>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Drafts</Text>
                  <Badge color="gray">{stats.draftCount}</Badge>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Featured</Text>
                  <Badge color="yellow">{stats.featuredAnnouncements}</Badge>
                </Group>
              </Stack>
            </Card>

            {/* User Info Card - FIXED: Removed nested Badge inside Text */}
            <Card withBorder shadow="sm" radius="md" p="xl">
              <Title order={4} mb="md">Account Information</Title>
              <Stack>
                <Group>
                  <ThemeIcon size="sm" variant="light" color="blue">
                    <IconUser size={14} />
                  </ThemeIcon>
                  <Text size="sm">Username: <strong>{user?.username}</strong></Text>
                </Group>
                {user?.full_name && (
                  <Group>
                    <ThemeIcon size="sm" variant="light" color="green">
                      <IconUser size={14} />
                    </ThemeIcon>
                    <Text size="sm">Full Name: <strong>{user.full_name}</strong></Text>
                  </Group>
                )}
                <Group>
                  <ThemeIcon size="sm" variant="light" color="grape">
                    <IconUser size={14} />
                  </ThemeIcon>
                  <Box>
                    <Text size="sm" component="span">Role: </Text>
                    <Badge size="sm" color="grape">{user?.role}</Badge>
                  </Box>
                </Group>
                {user?.last_login && (
                  <Group>
                    <ThemeIcon size="sm" variant="light" color="orange">
                      <IconCalendar size={14} />
                    </ThemeIcon>
                    <Text size="sm">Last Login: {dayjs(user.last_login).format('MMM D, YYYY')}</Text>
                  </Group>
                )}
                <Divider />
                <Button 
                  variant="light" 
                  fullWidth 
                  onClick={() => router.push('/profile')}
                >
                  View Full Profile
                </Button>
              </Stack>
            </Card>

            {/* Quick Actions Card */}
            <Card withBorder shadow="sm" radius="md" p="xl">
              <Title order={4} mb="md">Quick Actions</Title>
              <Stack>
                <Button 
                  variant="filled" 
                  fullWidth
                  leftSection={<IconBell size={16} />}
                  onClick={() => router.push('/announcements/create')}
                >
                  Create New Announcement
                </Button>
                <Button 
                  variant="light" 
                  fullWidth
                  leftSection={<IconEye size={16} />}
                  onClick={() => router.push('/announcements')}
                >
                  View All Announcements
                </Button>
                <Button 
                  variant="light" 
                  fullWidth
                  color="grape"
                  leftSection={<IconBell size={16} />}
                  onClick={() => router.push('/announcements?featured=true')}
                >
                  View Featured
                </Button>
              </Stack>
            </Card>

            {/* Announcement Types Distribution */}
            {announcements.length > 0 && (
              <Card withBorder shadow="sm" radius="md" p="xl">
                <Title order={4} mb="md">Announcement Types</Title>
                <Stack>
                  {Object.entries(
                    announcements.reduce((acc: any, curr) => {
                      const type = curr.type || 'General';
                      acc[type] = (acc[type] || 0) + 1;
                      return acc;
                    }, {})
                  ).map(([type, count]) => (
                    <Group key={type} justify="space-between">
                      <Group gap="xs">
                        {getTypeIcon(type)}
                        <Text size="sm" tt="capitalize">{type}</Text>
                      </Group>
                      <Badge>{count as number}</Badge>
                    </Group>
                  ))}
                </Stack>
              </Card>
            )}
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  );
}