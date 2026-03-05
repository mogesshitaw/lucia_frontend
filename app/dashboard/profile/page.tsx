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
  TextInput,
  PasswordInput,
  Avatar,
  Divider,
  Alert,
  Loader,
  Center,
  Grid,
  Card,
  ThemeIcon,
  SimpleGrid,
  ActionIcon,
  Tooltip,
  Badge,
  Tabs,
  Textarea,
  FileInput,
  Select,
} from '@mantine/core';
import {
  IconUser,
  IconMail,
  IconPhone,
  IconBuilding,
  IconMapPin,
  IconCalendar,
  IconEdit,
  IconCheck,
  IconX,
  IconExclamationCircle,
  IconDeviceFloppy,
  IconLock,
  IconKey,
  IconHistory,
  IconPhoto,
  IconUpload,
  IconBriefcase,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconBrandGithub,
  IconWorld,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/navigation';
import { Dropzone } from '@mantine/dropzone';
import dayjs from 'dayjs';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  bio: string;
  avatar: string | null;
  coverImage: string | null;
  dateOfBirth: string | null;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  social: {
    linkedin: string;
    twitter: string;
    github: string;
    website: string;
  };
  preferences: {
    language: string;
    timezone: string;
    emailNotifications: boolean;
    twoFactorAuth: boolean;
  };
  stats: {
    totalOrders: number;
    totalSpent: number;
    memberSince: string;
    lastLogin: string;
  };
  activity: {
    date: string;
    action: string;
    details: string;
  }[];
}

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>('profile');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setProfile(data.data);
      } else {
        setError('Failed to load profile');
      }
    } catch (error) {
      setError('Error loading profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    
    setSaving(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });
      const data = await response.json();
      if (data.success) {
        notifications.show({
          title: 'Success',
          message: 'Profile updated successfully',
          color: 'green',
        });
        setEditing(false);
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update profile',
        color: 'red',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (file: File | null) => {
    if (!file || !profile) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/avatar`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setProfile({ ...profile, avatar: data.data.avatarUrl });
        notifications.show({
          title: 'Success',
          message: 'Avatar updated successfully',
          color: 'green',
        });
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to upload avatar',
        color: 'red',
      });
    }
  };

  const handleChangePassword = async (oldPassword: string, newPassword: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/change-password`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await response.json();
      if (data.success) {
        notifications.show({
          title: 'Success',
          message: 'Password changed successfully',
          color: 'green',
        });
      } else {
        throw new Error(data.message || 'Failed to change password');
      }
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.message,
        color: 'red',
      });
    }
  };

  if (loading) {
    return (
      <Center h="100vh">
        <Loader size="lg" />
      </Center>
    );
  }

  if (error || !profile) {
    return (
      <Container size="xl" py="xl">
        <Alert icon={<IconExclamationCircle size={16} />} title="Error" color="red">
          {error || 'Failed to load profile'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      {/* Cover Image */}
      <Paper
        withBorder
        style={{
          height: 200,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          position: 'relative',
          marginBottom: 80,
          borderRadius: 8,
        }}
      >
        {editing && (
          <ActionIcon
            style={{ position: 'absolute', top: 10, right: 10 }}
            variant="filled"
            color="white"
            size="lg"
          >
            <IconUpload size={20} />
          </ActionIcon>
        )}
      </Paper>

      {/* Avatar */}
      <Group justify="center" style={{ marginTop: -80 }}>
        <div style={{ position: 'relative' }}>
          <Avatar
            src={profile.avatar}
            size={120}
            radius={120}
            style={{ border: '4px solid white' }}
          />
          {editing && (
            <ActionIcon
              style={{ position: 'absolute', bottom: 0, right: 0 }}
              variant="filled"
              color="blue"
              radius="xl"
              size="lg"
              component="label"
            >
              <IconUpload size={16} />
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => handleAvatarUpload(e.target.files?.[0] || null)}
              />
            </ActionIcon>
          )}
        </div>
      </Group>

      {/* Profile Header */}
      <Stack align="center" mt="md">
        <Group>
          <Title order={2}>
            {profile.firstName} {profile.lastName}
          </Title>
          {!editing ? (
            <Button
              variant="subtle"
              leftSection={<IconEdit size={16} />}
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </Button>
          ) : (
            <Group>
              <Button
                variant="light"
                color="green"
                leftSection={<IconCheck size={16} />}
                onClick={handleSaveProfile}
                loading={saving}
              >
                Save
              </Button>
              <Button
                variant="light"
                color="red"
                leftSection={<IconX size={16} />}
                onClick={() => {
                  setEditing(false);
                  fetchProfile();
                }}
              >
                Cancel
              </Button>
            </Group>
          )}
        </Group>
        <Group gap="xs">
          <Badge size="lg" color="blue">{profile.position || 'No position'}</Badge>
          <Badge size="lg" color="grape">{profile.company || 'No company'}</Badge>
        </Group>
      </Stack>

      {/* Stats Cards */}
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} mt="xl">
        <Card withBorder>
          <Group>
            <ThemeIcon size="lg" color="blue" variant="light">
              <IconBriefcase size={20} />
            </ThemeIcon>
            <div>
              <Text size="xs" c="dimmed">Total Orders</Text>
              <Text fw={700} size="xl">{profile.stats.totalOrders}</Text>
            </div>
          </Group>
        </Card>
        <Card withBorder>
          <Group>
            <ThemeIcon size="lg" color="green" variant="light">
              <IconBuilding size={20} />
            </ThemeIcon>
            <div>
              <Text size="xs" c="dimmed">Total Spent</Text>
              <Text fw={700} size="xl">${profile.stats.totalSpent.toLocaleString()}</Text>
            </div>
          </Group>
        </Card>
        <Card withBorder>
          <Group>
            <ThemeIcon size="lg" color="grape" variant="light">
              <IconCalendar size={20} />
            </ThemeIcon>
            <div>
              <Text size="xs" c="dimmed">Member Since</Text>
              <Text fw={700} size="xl">{dayjs(profile.stats.memberSince).format('MMM YYYY')}</Text>
            </div>
          </Group>
        </Card>
        <Card withBorder>
          <Group>
            <ThemeIcon size="lg" color="orange" variant="light">
              <IconHistory size={20} />
            </ThemeIcon>
            <div>
              <Text size="xs" c="dimmed">Last Login</Text>
              <Text fw={700} size="xl">{dayjs(profile.stats.lastLogin).format('MMM D')}</Text>
            </div>
          </Group>
        </Card>
      </SimpleGrid>

      {/* Tabs */}
      <Tabs value={activeTab} onChange={setActiveTab} mt="xl">
        <Tabs.List>
          <Tabs.Tab value="profile" leftSection={<IconUser size={16} />}>
            Profile Information
          </Tabs.Tab>
          <Tabs.Tab value="security" leftSection={<IconLock size={16} />}>
            Security
          </Tabs.Tab>
          <Tabs.Tab value="activity" leftSection={<IconHistory size={16} />}>
            Activity Log
          </Tabs.Tab>
        </Tabs.List>

        {/* Profile Information Tab */}
        <Tabs.Panel value="profile" pt="xl">
          <Grid>
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Paper withBorder p="xl">
                <Stack>
                  <Title order={3}>Personal Information</Title>
                  
                  <Grid>
                    <Grid.Col span={6}>
                      <TextInput
                        label="First Name"
                        value={profile.firstName}
                        onChange={(e) =>
                          setProfile({ ...profile, firstName: e.target.value })
                        }
                        disabled={!editing}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <TextInput
                        label="Last Name"
                        value={profile.lastName}
                        onChange={(e) =>
                          setProfile({ ...profile, lastName: e.target.value })
                        }
                        disabled={!editing}
                      />
                    </Grid.Col>
                  </Grid>

                  <TextInput
                    label="Email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    disabled={!editing}
                  />

                  <TextInput
                    label="Phone"
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                    disabled={!editing}
                  />

                  <TextInput
                    label="Date of Birth"
                    type="date"
                    value={profile.dateOfBirth || ''}
                    onChange={(e) =>
                      setProfile({ ...profile, dateOfBirth: e.target.value })
                    }
                    disabled={!editing}
                  />

                  <Divider />

                  <Title order={4}>Company Information</Title>

                  <Grid>
                    <Grid.Col span={6}>
                      <TextInput
                        label="Company"
                        value={profile.company}
                        onChange={(e) =>
                          setProfile({ ...profile, company: e.target.value })
                        }
                        disabled={!editing}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <TextInput
                        label="Position"
                        value={profile.position}
                        onChange={(e) =>
                          setProfile({ ...profile, position: e.target.value })
                        }
                        disabled={!editing}
                      />
                    </Grid.Col>
                  </Grid>

                  <Divider />

                  <Title order={4}>Address</Title>

                  <TextInput
                    label="Street Address"
                    value={profile.address.street}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        address: { ...profile.address, street: e.target.value },
                      })
                    }
                    disabled={!editing}
                  />

                  <Grid>
                    <Grid.Col span={4}>
                      <TextInput
                        label="City"
                        value={profile.address.city}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            address: { ...profile.address, city: e.target.value },
                          })
                        }
                        disabled={!editing}
                      />
                    </Grid.Col>
                    <Grid.Col span={4}>
                      <TextInput
                        label="State"
                        value={profile.address.state}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            address: { ...profile.address, state: e.target.value },
                          })
                        }
                        disabled={!editing}
                      />
                    </Grid.Col>
                    <Grid.Col span={4}>
                      <TextInput
                        label="Postal Code"
                        value={profile.address.postalCode}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            address: { ...profile.address, postalCode: e.target.value },
                          })
                        }
                        disabled={!editing}
                      />
                    </Grid.Col>
                  </Grid>

                  <TextInput
                    label="Country"
                    value={profile.address.country}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        address: { ...profile.address, country: e.target.value },
                      })
                    }
                    disabled={!editing}
                  />

                  <Divider />

                  <Title order={4}>Bio</Title>

                  <Textarea
                    label="Bio"
                    value={profile.bio}
                    onChange={(e) =>
                      setProfile({ ...profile, bio: e.target.value })
                    }
                    minRows={4}
                    disabled={!editing}
                  />
                </Stack>
              </Paper>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 4 }}>
              <Paper withBorder p="xl">
                <Stack>
                  <Title order={4}>Social Links</Title>

                  <TextInput
                    label="LinkedIn"
                    value={profile.social.linkedin}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        social: { ...profile.social, linkedin: e.target.value },
                      })
                    }
                    disabled={!editing}
                    leftSection={<IconBrandLinkedin size={16} />}
                  />

                  <TextInput
                    label="Twitter"
                    value={profile.social.twitter}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        social: { ...profile.social, twitter: e.target.value },
                      })
                    }
                    disabled={!editing}
                    leftSection={<IconBrandTwitter size={16} />}
                  />

                  <TextInput
                    label="GitHub"
                    value={profile.social.github}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        social: { ...profile.social, github: e.target.value },
                      })
                    }
                    disabled={!editing}
                    leftSection={<IconBrandGithub size={16} />}
                  />

                  <TextInput
                    label="Website"
                    value={profile.social.website}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        social: { ...profile.social, website: e.target.value },
                      })
                    }
                    disabled={!editing}
                    leftSection={<IconWorld size={16} />}
                  />

                  <Divider />

                  <Title order={4}>Preferences</Title>

                  <Select
                    label="Language"
                    data={[
                      { value: 'en', label: 'English' },
                      { value: 'es', label: 'Spanish' },
                      { value: 'fr', label: 'French' },
                    ]}
                    value={profile.preferences.language}
                    onChange={(value) =>
                      setProfile({
                        ...profile,
                        preferences: { ...profile.preferences, language: value || 'en' },
                      })
                    }
                    disabled={!editing}
                  />

                  <Select
                    label="Timezone"
                    data={[
                      { value: 'America/New_York', label: 'Eastern Time' },
                      { value: 'America/Chicago', label: 'Central Time' },
                      { value: 'America/Denver', label: 'Mountain Time' },
                      { value: 'America/Los_Angeles', label: 'Pacific Time' },
                    ]}
                    value={profile.preferences.timezone}
                    onChange={(value) =>
                      setProfile({
                        ...profile,
                        preferences: { ...profile.preferences, timezone: value || '' },
                      })
                    }
                    disabled={!editing}
                  />
                </Stack>
              </Paper>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        {/* Security Tab */}
        <Tabs.Panel value="security" pt="xl">
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Paper withBorder p="xl">
                <Stack>
                  <Title order={3}>Change Password</Title>
                  
                  <PasswordInput
                    label="Current Password"
                    placeholder="Enter current password"
                  />
                  
                  <PasswordInput
                    label="New Password"
                    placeholder="Enter new password"
                  />
                  
                  <PasswordInput
                    label="Confirm New Password"
                    placeholder="Confirm new password"
                  />
                  
                  <Button
                    variant="gradient"
                    gradient={{ from: 'blue', to: 'cyan' }}
                    leftSection={<IconKey size={16} />}
                  >
                    Update Password
                  </Button>
                </Stack>
              </Paper>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Paper withBorder p="xl">
                <Stack>
                  <Title order={3}>Two-Factor Authentication</Title>
                  
                  <Group>
                    <ThemeIcon size="lg" color={profile.preferences.twoFactorAuth ? 'green' : 'gray'} variant="light">
                      <IconLock size={20} />
                    </ThemeIcon>
                    <div style={{ flex: 1 }}>
                      <Text fw={500}>2FA Status</Text>
                      <Text size="sm" c="dimmed">
                        {profile.preferences.twoFactorAuth
                          ? 'Two-factor authentication is enabled'
                          : 'Two-factor authentication is disabled'}
                      </Text>
                    </div>
                    <Button
                      variant={profile.preferences.twoFactorAuth ? 'light' : 'filled'}
                      color={profile.preferences.twoFactorAuth ? 'red' : 'green'}
                    >
                      {profile.preferences.twoFactorAuth ? 'Disable' : 'Enable'}
                    </Button>
                  </Group>

                  <Divider />

                  <Title order={4}>Active Sessions</Title>
                  
                  <Card withBorder>
                    <Group>
                      <div>
                        <Text fw={500}>Current Session</Text>
                        <Text size="xs" c="dimmed">Chrome on Windows</Text>
                      </div>
                      <Badge color="green">Active</Badge>
                    </Group>
                  </Card>
                  
                  <Button variant="light" color="red">
                    Log Out All Devices
                  </Button>
                </Stack>
              </Paper>
            </Grid.Col>
          </Grid>
        </Tabs.Panel>

        {/* Activity Log Tab */}
        <Tabs.Panel value="activity" pt="xl">
          <Paper withBorder p="xl">
            <Title order={3} mb="lg">Recent Activity</Title>
            
            <Stack>
              {profile.activity.map((activity, index) => (
                <Group key={index} gap="xl">
                  <Text size="sm" c="dimmed" style={{ minWidth: 100 }}>
                    {dayjs(activity.date).format('MMM D, h:mm A')}
                  </Text>
                  <Badge color="blue">{activity.action}</Badge>
                  <Text size="sm">{activity.details}</Text>
                </Group>
              ))}
            </Stack>
          </Paper>
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}