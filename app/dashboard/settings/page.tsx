'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Tabs,
  Paper,
  Title,
  Text,
  Stack,
  Group,
  Button,
  TextInput,
  PasswordInput,
  Switch,
  Select,
  MultiSelect,
  Avatar,
  Divider,
  Alert,
  Loader,
  Center,
  Card,
  ThemeIcon,
  SimpleGrid,
  ActionIcon,
  Tooltip,
  Notification,
  Grid,
} from '@mantine/core';
import {
  IconUser,
  IconBell,
  IconLock,
  IconPalette,
  IconBuilding,
  IconMail,
  IconPhone,
  IconWorld,
  IconCurrencyDollar,
  IconLanguage,
  IconDeviceFloppy,
  IconShield,
  IconKey,
  IconEye,
  IconEyeOff,
  IconCheck,
  IconX,
  IconExclamationCircle,
  IconRefresh,
  IconTrash,
  IconDownload,
  IconUpload,
  IconBrandGoogle,
  IconBrandFacebook,
  IconBrandTwitter,
  IconBrandGithub,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/navigation';
import { Dropzone } from '@mantine/dropzone';

interface SystemSettings {
  company: {
    name: string;
    email: string;
    phone: string;
    website: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
    taxId: string;
    logo: string | null;
  };
  localization: {
    language: string;
    timezone: string;
    dateFormat: string;
    timeFormat: string;
    currency: string;
    currencyPosition: 'left' | 'right';
    thousandSeparator: string;
    decimalSeparator: string;
    decimals: number;
  };
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
    orderCreated: boolean;
    orderUpdated: boolean;
    orderCompleted: boolean;
    paymentReceived: boolean;
    paymentFailed: boolean;
    newUserRegistered: boolean;
    imageUploaded: boolean;
    imageApproved: boolean;
    imageRejected: boolean;
    lowStock: boolean;
    systemUpdates: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
    passwordExpiry: number;
    requireStrongPassword: boolean;
    ipWhitelist: string[];
    allowedDomains: string[];
    mfaMethods: ('email' | 'sms' | 'authenticator')[];
  };
  integrations: {
    google: boolean;
    facebook: boolean;
    twitter: boolean;
    github: boolean;
    slack: boolean;
    discord: boolean;
    stripe: boolean;
    paypal: boolean;
    mailchimp: boolean;
  };
  backup: {
    autoBackup: boolean;
    backupFrequency: 'daily' | 'weekly' | 'monthly';
    backupRetention: number;
    lastBackup: string | null;
    backupLocation: string;
  };
}

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>('general');
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setSettings(data.data);
      } else {
        setError('Failed to load settings');
      }
    } catch (error) {
      setError('Error loading settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!settings) return;
    
    setSaving(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      const data = await response.json();
      if (data.success) {
        notifications.show({
          title: 'Success',
          message: 'Settings saved successfully',
          color: 'green',
        });
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to save settings',
        color: 'red',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (files: File[]) => {
    if (files.length === 0 || !settings) return;

    const formData = new FormData();
    formData.append('logo', files[0]);

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/logo`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setSettings({
          ...settings,
          company: { ...settings.company, logo: data.data.logoUrl },
        });
        notifications.show({
          title: 'Success',
          message: 'Logo uploaded successfully',
          color: 'green',
        });
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to upload logo',
        color: 'red',
      });
    }
  };

  const handleBackup = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/backup`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        notifications.show({
          title: 'Success',
          message: 'Backup created successfully',
          color: 'green',
        });
        fetchSettings();
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to create backup',
        color: 'red',
      });
    }
  };

  const handleRestore = async () => {
    // Implement restore functionality
  };

  if (loading) {
    return (
      <Center h="100vh">
        <Loader size="lg" />
      </Center>
    );
  }

  if (error || !settings) {
    return (
      <Container size="xl" py="xl">
        <Alert icon={<IconExclamationCircle size={16} />} title="Error" color="red">
          {error || 'Failed to load settings'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2}>System Settings</Title>
          <Text c="dimmed" size="sm">
            Configure your application settings and preferences
          </Text>
        </div>
        <Group>
          <Button
            variant="light"
            leftSection={<IconRefresh size={16} />}
            onClick={fetchSettings}
          >
            Reset
          </Button>
          <Button
            variant="gradient"
            gradient={{ from: 'blue', to: 'cyan' }}
            leftSection={<IconDeviceFloppy size={16} />}
            onClick={handleSaveSettings}
            loading={saving}
          >
            Save Changes
          </Button>
        </Group>
      </Group>

      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List mb="xl">
          <Tabs.Tab value="general" leftSection={<IconBuilding size={16} />}>
            General
          </Tabs.Tab>
          <Tabs.Tab value="localization" leftSection={<IconWorld size={16} />}>
            Localization
          </Tabs.Tab>
          <Tabs.Tab value="notifications" leftSection={<IconBell size={16} />}>
            Notifications
          </Tabs.Tab>
          <Tabs.Tab value="security" leftSection={<IconShield size={16} />}>
            Security
          </Tabs.Tab>
          <Tabs.Tab value="integrations" leftSection={<IconBrandGoogle size={16} />}>
            Integrations
          </Tabs.Tab>
          <Tabs.Tab value="backup" leftSection={<IconDownload size={16} />}>
            Backup
          </Tabs.Tab>
        </Tabs.List>

        {/* General Settings */}
        <Tabs.Panel value="general">
          <Paper withBorder p="xl">
            <Stack>
              <Title order={3}>Company Information</Title>
              
              <Group align="flex-start">
                <Stack style={{ flex: 1 }}>
                  <TextInput
                    label="Company Name"
                    value={settings.company.name}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        company: { ...settings.company, name: e.target.value },
                      })
                    }
                  />
                  <TextInput
                    label="Company Email"
                    value={settings.company.email}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        company: { ...settings.company, email: e.target.value },
                      })
                    }
                  />
                  <TextInput
                    label="Company Phone"
                    value={settings.company.phone}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        company: { ...settings.company, phone: e.target.value },
                      })
                    }
                  />
                  <TextInput
                    label="Website"
                    value={settings.company.website}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        company: { ...settings.company, website: e.target.value },
                      })
                    }
                  />
                </Stack>

                <Stack align="center" style={{ width: 200 }}>
                  <Avatar
                    src={settings.company.logo}
                    size={120}
                    radius="md"
                  />
                  <Dropzone
                    onDrop={handleLogoUpload}
                    accept={['image/png', 'image/jpeg', 'image/gif']}
                    maxSize={5 * 1024 * 1024}
                    style={{ width: '100%' }}
                  >
                    <Group justify="center">
                      <IconUpload size={16} />
                      <Text size="sm">Upload Logo</Text>
                    </Group>
                  </Dropzone>
                </Stack>
              </Group>

              <TextInput
                label="Address"
                value={settings.company.address}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    company: { ...settings.company, address: e.target.value },
                  })
                }
              />

              <Grid>
                <Grid.Col span={4}>
                  <TextInput
                    label="City"
                    value={settings.company.city}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        company: { ...settings.company, city: e.target.value },
                      })
                    }
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <TextInput
                    label="Country"
                    value={settings.company.country}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        company: { ...settings.company, country: e.target.value },
                      })
                    }
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <TextInput
                    label="Postal Code"
                    value={settings.company.postalCode}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        company: { ...settings.company, postalCode: e.target.value },
                      })
                    }
                  />
                </Grid.Col>
              </Grid>

              <TextInput
                label="Tax ID / VAT Number"
                value={settings.company.taxId}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    company: { ...settings.company, taxId: e.target.value },
                  })
                }
              />
            </Stack>
          </Paper>
        </Tabs.Panel>

        {/* Localization Settings */}
        <Tabs.Panel value="localization">
          <Paper withBorder p="xl">
            <Stack>
              <Title order={3}>Localization Settings</Title>

              <Grid>
                <Grid.Col span={6}>
                  <Select
                    label="Language"
                    data={[
                      { value: 'en', label: 'English' },
                      { value: 'es', label: 'Spanish' },
                      { value: 'fr', label: 'French' },
                      { value: 'de', label: 'German' },
                      { value: 'it', label: 'Italian' },
                      { value: 'pt', label: 'Portuguese' },
                      { value: 'ru', label: 'Russian' },
                      { value: 'zh', label: 'Chinese' },
                      { value: 'ja', label: 'Japanese' },
                      { value: 'ko', label: 'Korean' },
                    ]}
                    value={settings.localization.language}
                    onChange={(value) =>
                      setSettings({
                        ...settings,
                        localization: { ...settings.localization, language: value || 'en' },
                      })
                    }
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <Select
                    label="Timezone"
                    data={[
                      { value: 'UTC', label: 'UTC' },
                      { value: 'America/New_York', label: 'Eastern Time' },
                      { value: 'America/Chicago', label: 'Central Time' },
                      { value: 'America/Denver', label: 'Mountain Time' },
                      { value: 'America/Los_Angeles', label: 'Pacific Time' },
                      { value: 'Europe/London', label: 'London' },
                      { value: 'Europe/Paris', label: 'Paris' },
                      { value: 'Asia/Tokyo', label: 'Tokyo' },
                      { value: 'Asia/Shanghai', label: 'Shanghai' },
                      { value: 'Australia/Sydney', label: 'Sydney' },
                    ]}
                    value={settings.localization.timezone}
                    onChange={(value) =>
                      setSettings({
                        ...settings,
                        localization: { ...settings.localization, timezone: value || 'UTC' },
                      })
                    }
                  />
                </Grid.Col>
              </Grid>

              <Grid>
                <Grid.Col span={6}>
                  <Select
                    label="Date Format"
                    data={[
                      { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                      { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                      { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
                    ]}
                    value={settings.localization.dateFormat}
                    onChange={(value) =>
                      setSettings({
                        ...settings,
                        localization: { ...settings.localization, dateFormat: value || 'MM/DD/YYYY' },
                      })
                    }
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <Select
                    label="Time Format"
                    data={[
                      { value: '12', label: '12-hour' },
                      { value: '24', label: '24-hour' },
                    ]}
                    value={settings.localization.timeFormat}
                    onChange={(value) =>
                      setSettings({
                        ...settings,
                        localization: { ...settings.localization, timeFormat: value || '12' },
                      })
                    }
                  />
                </Grid.Col>
              </Grid>

              <Grid>
                <Grid.Col span={4}>
                  <Select
                    label="Currency"
                    data={[
                      { value: 'USD', label: 'USD ($)' },
                      { value: 'EUR', label: 'EUR (€)' },
                      { value: 'GBP', label: 'GBP (£)' },
                      { value: 'JPY', label: 'JPY (¥)' },
                      { value: 'CNY', label: 'CNY (¥)' },
                    ]}
                    value={settings.localization.currency}
                    onChange={(value) =>
                      setSettings({
                        ...settings,
                        localization: { ...settings.localization, currency: value || 'USD' },
                      })
                    }
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <Select
                    label="Currency Position"
                    data={[
                      { value: 'left', label: '$100' },
                      { value: 'right', label: '100$' },
                    ]}
                    value={settings.localization.currencyPosition}
                    onChange={(value) =>
                      setSettings({
                        ...settings,
                        localization: { ...settings.localization, currencyPosition: value as 'left' | 'right' },
                      })
                    }
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <Select
                    label="Decimal Places"
                    data={[
                      { value: '0', label: '0 (100)' },
                      { value: '1', label: '1 (100.0)' },
                      { value: '2', label: '2 (100.00)' },
                      { value: '3', label: '3 (100.000)' },
                    ]}
                    value={settings.localization.decimals.toString()}
                    onChange={(value) =>
                      setSettings({
                        ...settings,
                        localization: { ...settings.localization, decimals: parseInt(value || '2') },
                      })
                    }
                  />
                </Grid.Col>
              </Grid>

              <Grid>
                <Grid.Col span={6}>
                  <TextInput
                    label="Thousand Separator"
                    value={settings.localization.thousandSeparator}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        localization: { ...settings.localization, thousandSeparator: e.target.value },
                      })
                    }
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    label="Decimal Separator"
                    value={settings.localization.decimalSeparator}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        localization: { ...settings.localization, decimalSeparator: e.target.value },
                      })
                    }
                  />
                </Grid.Col>
              </Grid>
            </Stack>
          </Paper>
        </Tabs.Panel>

        {/* Notification Settings */}
        <Tabs.Panel value="notifications">
          <Paper withBorder p="xl">
            <Stack>
              <Title order={3}>Notification Preferences</Title>

              <Card withBorder>
                <Stack>
                  <Title order={5}>Notification Channels</Title>
                  <Switch
                    label="Email Notifications"
                    checked={settings.notifications.emailNotifications}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, emailNotifications: e.currentTarget.checked },
                      })
                    }
                  />
                  <Switch
                    label="Push Notifications"
                    checked={settings.notifications.pushNotifications}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, pushNotifications: e.currentTarget.checked },
                      })
                    }
                  />
                  <Switch
                    label="SMS Notifications"
                    checked={settings.notifications.smsNotifications}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, smsNotifications: e.currentTarget.checked },
                      })
                    }
                  />
                </Stack>
              </Card>

              <Card withBorder>
                <Stack>
                  <Title order={5}>Order Notifications</Title>
                  <Switch
                    label="Order Created"
                    checked={settings.notifications.orderCreated}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, orderCreated: e.currentTarget.checked },
                      })
                    }
                  />
                  <Switch
                    label="Order Updated"
                    checked={settings.notifications.orderUpdated}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, orderUpdated: e.currentTarget.checked },
                      })
                    }
                  />
                  <Switch
                    label="Order Completed"
                    checked={settings.notifications.orderCompleted}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, orderCompleted: e.currentTarget.checked },
                      })
                    }
                  />
                </Stack>
              </Card>

              <Card withBorder>
                <Stack>
                  <Title order={5}>Payment Notifications</Title>
                  <Switch
                    label="Payment Received"
                    checked={settings.notifications.paymentReceived}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, paymentReceived: e.currentTarget.checked },
                      })
                    }
                  />
                  <Switch
                    label="Payment Failed"
                    checked={settings.notifications.paymentFailed}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, paymentFailed: e.currentTarget.checked },
                      })
                    }
                  />
                </Stack>
              </Card>

              <Card withBorder>
                <Stack>
                  <Title order={5}>User Notifications</Title>
                  <Switch
                    label="New User Registered"
                    checked={settings.notifications.newUserRegistered}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, newUserRegistered: e.currentTarget.checked },
                      })
                    }
                  />
                </Stack>
              </Card>

              <Card withBorder>
                <Stack>
                  <Title order={5}>Image Notifications</Title>
                  <Switch
                    label="Image Uploaded"
                    checked={settings.notifications.imageUploaded}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, imageUploaded: e.currentTarget.checked },
                      })
                    }
                  />
                  <Switch
                    label="Image Approved"
                    checked={settings.notifications.imageApproved}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, imageApproved: e.currentTarget.checked },
                      })
                    }
                  />
                  <Switch
                    label="Image Rejected"
                    checked={settings.notifications.imageRejected}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, imageRejected: e.currentTarget.checked },
                      })
                    }
                  />
                </Stack>
              </Card>

              <Card withBorder>
                <Stack>
                  <Title order={5}>System Notifications</Title>
                  <Switch
                    label="Low Stock Alert"
                    checked={settings.notifications.lowStock}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, lowStock: e.currentTarget.checked },
                      })
                    }
                  />
                  <Switch
                    label="System Updates"
                    checked={settings.notifications.systemUpdates}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, systemUpdates: e.currentTarget.checked },
                      })
                    }
                  />
                </Stack>
              </Card>
            </Stack>
          </Paper>
        </Tabs.Panel>

        {/* Security Settings */}
        <Tabs.Panel value="security">
          <Paper withBorder p="xl">
            <Stack>
              <Title order={3}>Security Settings</Title>

              <Card withBorder>
                <Stack>
                  <Title order={5}>Authentication</Title>
                  <Switch
                    label="Enable Two-Factor Authentication"
                    checked={settings.security.twoFactorAuth}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        security: { ...settings.security, twoFactorAuth: e.currentTarget.checked },
                      })
                    }
                  />
                  <MultiSelect
                    label="2FA Methods"
                    data={[
                      { value: 'email', label: 'Email' },
                      { value: 'sms', label: 'SMS' },
                      { value: 'authenticator', label: 'Authenticator App' },
                    ]}
                    value={settings.security.mfaMethods}
                    onChange={(value) =>
                      setSettings({
                        ...settings,
                        security: { ...settings.security, mfaMethods: value as ('email' | 'sms' | 'authenticator')[] },
                      })
                    }
                    disabled={!settings.security.twoFactorAuth}
                  />
                </Stack>
              </Card>

              <Card withBorder>
                <Stack>
                  <Title order={5}>Session & Password</Title>
                  <Select
                    label="Session Timeout (minutes)"
                    data={[
                      { value: '15', label: '15 minutes' },
                      { value: '30', label: '30 minutes' },
                      { value: '60', label: '1 hour' },
                      { value: '120', label: '2 hours' },
                      { value: '240', label: '4 hours' },
                      { value: '480', label: '8 hours' },
                    ]}
                    value={settings.security.sessionTimeout.toString()}
                    onChange={(value) =>
                      setSettings({
                        ...settings,
                        security: { ...settings.security, sessionTimeout: parseInt(value || '30') },
                      })
                    }
                  />
                  <Select
                    label="Max Login Attempts"
                    data={[
                      { value: '3', label: '3 attempts' },
                      { value: '5', label: '5 attempts' },
                      { value: '10', label: '10 attempts' },
                    ]}
                    value={settings.security.maxLoginAttempts.toString()}
                    onChange={(value) =>
                      setSettings({
                        ...settings,
                        security: { ...settings.security, maxLoginAttempts: parseInt(value || '5') },
                      })
                    }
                  />
                  <Select
                    label="Password Expiry (days)"
                    data={[
                      { value: '0', label: 'Never' },
                      { value: '30', label: '30 days' },
                      { value: '60', label: '60 days' },
                      { value: '90', label: '90 days' },
                    ]}
                    value={settings.security.passwordExpiry.toString()}
                    onChange={(value) =>
                      setSettings({
                        ...settings,
                        security: { ...settings.security, passwordExpiry: parseInt(value || '0') },
                      })
                    }
                  />
                  <Switch
                    label="Require Strong Password"
                    checked={settings.security.requireStrongPassword}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        security: { ...settings.security, requireStrongPassword: e.currentTarget.checked },
                      })
                    }
                  />
                </Stack>
              </Card>

              <Card withBorder>
                <Stack>
                  <Title order={5}>Access Control</Title>
                  <MultiSelect
                    label="IP Whitelist"
                    placeholder="Enter IP addresses"
                    data={[]}
                    value={settings.security.ipWhitelist}
                    onChange={(value) =>
                      setSettings({
                        ...settings,
                        security: { ...settings.security, ipWhitelist: value },
                      })
                    }
                    // creatable
                    // getCreateLabel={(query) => `+ Add ${query}`}
                    // onCreate={(query) => {
                    //   setSettings({
                    //     ...settings,
                    //     security: { ...settings.security, ipWhitelist: [...settings.security.ipWhitelist, query] },
                    //   });
                    //   return query;
                    // }}
                  />
                  <MultiSelect
                    label="Allowed Domains"
                    placeholder="Enter domains"
                    data={[]}
                    value={settings.security.allowedDomains}
                    onChange={(value) =>
                      setSettings({
                        ...settings,
                        security: { ...settings.security, allowedDomains: value },
                      })
                    }
                    // creatable
                    // getCreateLabel={(query) => `+ Add ${query}`}
                    // onCreate={(query) => {
                    //   setSettings({
                    //     ...settings,
                    //     security: { ...settings.security, allowedDomains: [...settings.security.allowedDomains, query] },
                    //   });
                    //   return query;
                    // }}
                  />
                </Stack>
              </Card>
            </Stack>
          </Paper>
        </Tabs.Panel>

        {/* Integrations Settings */}
        <Tabs.Panel value="integrations">
          <Paper withBorder p="xl">
            <Stack>
              <Title order={3}>Integrations</Title>

              <SimpleGrid cols={2}>
                <Card withBorder>
                  <Group>
                    <ThemeIcon size="lg" color="blue" variant="light">
                      <IconBrandGoogle size={20} />
                    </ThemeIcon>
                    <div style={{ flex: 1 }}>
                      <Text fw={500}>Google</Text>
                      <Text size="xs" c="dimmed">Google Analytics, Calendar, Drive</Text>
                    </div>
                    <Switch
                      checked={settings.integrations.google}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          integrations: { ...settings.integrations, google: e.currentTarget.checked },
                        })
                      }
                    />
                  </Group>
                </Card>

                <Card withBorder>
                  <Group>
                    <ThemeIcon size="lg" color="blue" variant="light">
                      <IconBrandFacebook size={20} />
                    </ThemeIcon>
                    <div style={{ flex: 1 }}>
                      <Text fw={500}>Facebook</Text>
                      <Text size="xs" c="dimmed">Facebook Login, Messenger</Text>
                    </div>
                    <Switch
                      checked={settings.integrations.facebook}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          integrations: { ...settings.integrations, facebook: e.currentTarget.checked },
                        })
                      }
                    />
                  </Group>
                </Card>

                <Card withBorder>
                  <Group>
                    <ThemeIcon size="lg" color="blue" variant="light">
                      <IconBrandTwitter size={20} />
                    </ThemeIcon>
                    <div style={{ flex: 1 }}>
                      <Text fw={500}>Twitter</Text>
                      <Text size="xs" c="dimmed">Twitter Login, Feeds</Text>
                    </div>
                    <Switch
                      checked={settings.integrations.twitter}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          integrations: { ...settings.integrations, twitter: e.currentTarget.checked },
                        })
                      }
                    />
                  </Group>
                </Card>

                <Card withBorder>
                  <Group>
                    <ThemeIcon size="lg" color="blue" variant="light">
                      <IconBrandGithub size={20} />
                    </ThemeIcon>
                    <div style={{ flex: 1 }}>
                      <Text fw={500}>GitHub</Text>
                      <Text size="xs" c="dimmed">GitHub Login, Repositories</Text>
                    </div>
                    <Switch
                      checked={settings.integrations.github}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          integrations: { ...settings.integrations, github: e.currentTarget.checked },
                        })
                      }
                    />
                  </Group>
                </Card>
              </SimpleGrid>

              <SimpleGrid cols={2}>
                <Card withBorder>
                  <Group>
                    <ThemeIcon size="lg" color="purple" variant="light">
                      <IconBrandGithub size={20} /> {/* Replace with Stripe icon */}
                    </ThemeIcon>
                    <div style={{ flex: 1 }}>
                      <Text fw={500}>Stripe</Text>
                      <Text size="xs" c="dimmed">Payment Processing</Text>
                    </div>
                    <Switch
                      checked={settings.integrations.stripe}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          integrations: { ...settings.integrations, stripe: e.currentTarget.checked },
                        })
                      }
                    />
                  </Group>
                </Card>

                <Card withBorder>
                  <Group>
                    <ThemeIcon size="lg" color="blue" variant="light">
                      <IconBrandGithub size={20} /> {/* Replace with PayPal icon */}
                    </ThemeIcon>
                    <div style={{ flex: 1 }}>
                      <Text fw={500}>PayPal</Text>
                      <Text size="xs" c="dimmed">Payment Processing</Text>
                    </div>
                    <Switch
                      checked={settings.integrations.paypal}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          integrations: { ...settings.integrations, paypal: e.currentTarget.checked },
                        })
                      }
                    />
                  </Group>
                </Card>
              </SimpleGrid>
            </Stack>
          </Paper>
        </Tabs.Panel>

        {/* Backup Settings */}
        <Tabs.Panel value="backup">
          <Paper withBorder p="xl">
            <Stack>
              <Title order={3}>Backup Settings</Title>

              <Card withBorder>
                <Stack>
                  <Title order={5}>Backup Configuration</Title>
                  <Switch
                    label="Enable Automatic Backups"
                    checked={settings.backup.autoBackup}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        backup: { ...settings.backup, autoBackup: e.currentTarget.checked },
                      })
                    }
                  />
                  
                  {settings.backup.autoBackup && (
                    <>
                      <Select
                        label="Backup Frequency"
                        data={[
                          { value: 'daily', label: 'Daily' },
                          { value: 'weekly', label: 'Weekly' },
                          { value: 'monthly', label: 'Monthly' },
                        ]}
                        value={settings.backup.backupFrequency}
                        onChange={(value) =>
                          setSettings({
                            ...settings,
                            backup: { ...settings.backup, backupFrequency: value as 'daily' | 'weekly' | 'monthly' },
                          })
                        }
                      />
                      <Select
                        label="Backup Retention"
                        data={[
                          { value: '7', label: '7 days' },
                          { value: '30', label: '30 days' },
                          { value: '90', label: '90 days' },
                          { value: '365', label: '1 year' },
                        ]}
                        value={settings.backup.backupRetention.toString()}
                        onChange={(value) =>
                          setSettings({
                            ...settings,
                            backup: { ...settings.backup, backupRetention: parseInt(value || '30') },
                          })
                        }
                      />
                    </>
                  )}
                </Stack>
              </Card>

              <Card withBorder>
                <Stack>
                  <Title order={5}>Backup Location</Title>
                  <TextInput
                    label="Backup Path"
                    value={settings.backup.backupLocation}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        backup: { ...settings.backup, backupLocation: e.target.value },
                      })
                    }
                  />
                </Stack>
              </Card>

              <Card withBorder>
                <Stack>
                  <Title order={5}>Manual Backup</Title>
                  <Group>
                    <Button
                      variant="light"
                      leftSection={<IconDownload size={16} />}
                      onClick={handleBackup}
                    >
                      Create Backup Now
                    </Button>
                    <Button
                      variant="light"
                      color="yellow"
                      leftSection={<IconUpload size={16} />}
                      onClick={handleRestore}
                    >
                      Restore from Backup
                    </Button>
                  </Group>
                  {settings.backup.lastBackup && (
                    <Text size="sm" c="dimmed">
                      Last backup: {new Date(settings.backup.lastBackup).toLocaleString()}
                    </Text>
                  )}
                </Stack>
              </Card>
            </Stack>
          </Paper>
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}