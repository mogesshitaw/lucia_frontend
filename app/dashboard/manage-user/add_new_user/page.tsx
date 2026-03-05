/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Title,
  Text,
  Group,
  Button,
  Stack,
  Grid,
  TextInput,
  PasswordInput,
  Select,
  Checkbox,
  Anchor,
  Divider,
  Card,
  ThemeIcon,
  Alert,
  Progress,
  List,
  Avatar,
  Tooltip,
  ActionIcon,
  Modal,
  Radio,
  RadioGroup,
  SimpleGrid,
  Badge,
  Stepper,
  Switch,
  Textarea,
  FileInput,
  TagsInput,
} from '@mantine/core';
import {
  IconMail,
  IconLock,
  IconUser,
  IconPhone,
  IconBuilding,
  IconDeviceFloppy,
  IconArrowRight,
  IconArrowLeft,
  IconCheck,
  IconX,
  IconEye,
  IconEyeOff,
  IconUsers,
  IconUserCircle,
  IconCash,
  IconPrinter,
  IconShield,
  IconLogin,
  IconBrandFacebook,
  IconBrandGoogle,
  IconBrandTwitter,
  IconAlertCircle,
  IconCircleCheck,
  IconCircleX,
  IconReceipt,
  IconUserCheck,
  IconCalendar,
  IconMapPin,
  IconWorld,
  IconBriefcase,
  IconCertificate,
  IconSchool,
  IconDeviceLaptop,
  IconPhoto,
  IconUpload,
  IconSend,
  IconTrash,
  IconRefresh,
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Role type matching your user management system
export type UserRole = 'customer' | 'reception' | 'cashier' | 'printer' | 'admin';

interface RoleOption {
  value: UserRole;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  permissions: string[];
}

interface AdminUserData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  
  // Professional Information
  company: string;
  position: string;
  department: string;
  employeeId: string;
  hireDate: Date | null;
  
  // Account Settings
  role: UserRole;
  status: 'active' | 'inactive' | 'suspended';
  accountType: 'individual' | 'business';
  emailVerified: boolean;
  
  // Permissions
  permissions: string[];
  
  // Additional Info
  address: string;
  city: string;
  country: string;
  postalCode: string;
  notes: string;
  
  // Preferences
  language: string;
  timezone: string;
  receiveNotifications: boolean;
  
  // Profile
  profileImage: File | null;
}

interface PasswordStrength {
  score: number;
  hasMinLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Role definitions with permissions
const ROLES: RoleOption[] = [
  {
    value: 'customer',
    label: 'Customer',
    description: 'Regular customer - can place orders and track shipments',
    icon: <IconUsers size={24} />,
    color: 'blue',
    permissions: [
      'Place print orders',
      'Track order status',
      'View order history',
      'Save designs',
      'Request quotes',
      'Download invoices',
    ],
  },
  {
    value: 'reception',
    label: 'Reception',
    description: 'Front desk - handles walk-in customers and order intake',
    icon: <IconUserCircle size={24} />,
    color: 'cyan',
    permissions: [
      'Create orders for walk-in customers',
      'Accept design files',
      'Process payments',
      'Manage customer inquiries',
      'Schedule pickups',
      'View customer information',
    ],
  },
  {
    value: 'cashier',
    label: 'Cashier',
    description: 'Handles payments and financial transactions',
    icon: <IconCash size={24} />,
    color: 'green',
    permissions: [
      'Process payments',
      'Issue receipts',
      'Handle refunds',
      'View transactions',
      'Close daily cash register',
      'Generate financial reports',
    ],
  },
  {
    value: 'printer',
    label: 'Printer',
    description: 'Production staff - manages printing operations',
    icon: <IconPrinter size={24} />,
    color: 'orange',
    permissions: [
      'View production queue',
      'Update order status',
      'Print designs',
      'Quality control',
      'Manage printer settings',
      'Request materials',
    ],
  },
  {
    value: 'admin',
    label: 'Administrator',
    description: 'Full system access and user management',
    icon: <IconShield size={24} />,
    color: 'red',
    permissions: [
      'Full system access',
      'User management',
      'Role management',
      'System settings',
      'View all orders',
      'Financial reports',
      'Access audit logs',
    ],
  },
];

// Languages
const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'am', label: 'Amharic' },
  { value: 'om', label: 'Oromo' },
  { value: 'ti', label: 'Tigrinya' },
  { value: 'ar', label: 'Arabic' },
];

// Timezones
const TIMEZONES = [
  { value: 'Africa/Addis_Ababa', label: 'Addis Ababa (EAT)' },
  { value: 'Africa/Nairobi', label: 'Nairobi (EAT)' },
  { value: 'Africa/Cairo', label: 'Cairo (EET)' },
  { value: 'Africa/Johannesburg', label: 'Johannesburg (SAST)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'America/New_York', label: 'New York (EST)' },
];

export default function AdminCreateUserPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  const [roleModalOpened, setRoleModalOpened] = useState(false);
  const [selectedRoleForInfo, setSelectedRoleForInfo] = useState<RoleOption | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Form data
  const [formData, setFormData] = useState<AdminUserData>({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    
    // Professional Information
    company: '',
    position: '',
    department: '',
    employeeId: '',
    hireDate: null,
    
    // Account Settings
    role: 'customer',
    status: 'active',
    accountType: 'individual',
    emailVerified: false,
    
    // Permissions
    permissions: [],
    
    // Additional Info
    address: '',
    city: '',
    country: 'Ethiopia',
    postalCode: '',
    notes: '',
    
    // Preferences
    language: 'en',
    timezone: 'Africa/Addis_Ababa',
    receiveNotifications: true,
    
    // Profile
    profileImage: null,
  });

  // Check password strength
  useEffect(() => {
    const password = formData.password;
    const strength: PasswordStrength = {
      score: 0,
      hasMinLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };

    // Calculate score
    let score = 0;
    if (strength.hasMinLength) score++;
    if (strength.hasUpperCase) score++;
    if (strength.hasLowerCase) score++;
    if (strength.hasNumber) score++;
    if (strength.hasSpecialChar) score++;
    strength.score = score;

    setPasswordStrength(strength);
  }, [formData.password]);

  const getPasswordStrengthColor = () => {
    if (passwordStrength.score <= 2) return 'red';
    if (passwordStrength.score <= 3) return 'yellow';
    if (passwordStrength.score <= 4) return 'blue';
    return 'green';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength.score <= 2) return 'Weak';
    if (passwordStrength.score <= 3) return 'Fair';
    if (passwordStrength.score <= 4) return 'Good';
    return 'Strong';
  };

  // Handle profile image upload
  const handleImageUpload = (file: File | null) => {
    setFormData({ ...formData, profileImage: file });
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  // Validate email format
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Validate phone format
  const validatePhone = (phone: string) => {
    const re = /^\+?[\d\s-]{10,}$/;
    return phone === '' || re.test(phone);
  };

  // Validate current step
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      // Step 1: Personal Information
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!validateEmail(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
      if (formData.phone && !validatePhone(formData.phone)) {
        newErrors.phone = 'Invalid phone format';
      }
    } else if (step === 1) {
      // Step 2: Professional Information
      if (formData.accountType === 'business' && !formData.company.trim()) {
        newErrors.company = 'Company name is required for business accounts';
      }
    } else if (step === 2) {
      // Step 3: Account Security
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (passwordStrength.score < 3) {
        newErrors.password = 'Password is too weak';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    } else if (step === 3) {
      // Step 4: Role Selection
      if (!formData.role) {
        newErrors.role = 'Please select a role';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  // Handle form reset
  const handleReset = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      company: '',
      position: '',
      department: '',
      employeeId: '',
      hireDate: null,
      role: 'customer',
      status: 'active',
      accountType: 'individual',
      emailVerified: false,
      permissions: [],
      address: '',
      city: '',
      country: 'Ethiopia',
      postalCode: '',
      notes: '',
      language: 'en',
      timezone: 'Africa/Addis_Ababa',
      receiveNotifications: true,
      profileImage: null,
    });
    setPreviewImage(null);
    setActiveStep(0);
    setErrors({});
  };

  // Handle create user
  const handleCreateUser = async () => {
    if (!validateStep(3)) return;

    setLoading(true);
    try {
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'profileImage' && value instanceof File) {
          submitData.append('profileImage', value);
        } else if (key === 'permissions' && Array.isArray(value)) {
          submitData.append('permissions', JSON.stringify(value));
        } else if (key === 'hireDate' && value) {
          submitData.append('hireDate', value.toISOString());
        } else if (value !== null && value !== undefined) {
          submitData.append(key, String(value));
        }
      });

      const response = await fetch(`${API_URL}/api/admin/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: submitData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        notifications.show({
          title: 'Success',
          message: `User ${formData.firstName} ${formData.lastName} created successfully`,
          color: 'green',
          icon: <IconCircleCheck size={16} />,
        });

        // Redirect to user management
        setTimeout(() => {
          router.push('/admin/users');
        }, 1500);
      } else {
        throw new Error(data.message || 'Failed to create user');
      }
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.message || 'An error occurred',
        color: 'red',
        icon: <IconCircleX size={16} />,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle send invitation email
  const handleSendInvitation = async () => {
    if (!formData.email) {
      notifications.show({
        title: 'Error',
        message: 'Email is required to send invitation',
        color: 'red',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/users/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        notifications.show({
          title: 'Invitation Sent',
          message: `Invitation email sent to ${formData.email}`,
          color: 'green',
        });
      } else {
        throw new Error(data.message || 'Failed to send invitation');
      }
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.message,
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  // Get role badge color
  const getRoleColor = (role: UserRole) => {
    const roleColors: Record<UserRole, string> = {
      customer: 'blue',
      reception: 'cyan',
      cashier: 'green',
      printer: 'orange',
      admin: 'red',
    };
    return roleColors[role];
  };

  // Render step content
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Stack gap="md">
              <Text size="lg" fw={600}>Personal Information</Text>
              
              <Grid>
                <Grid.Col span={6}>
                  <TextInput
                    label="First Name"
                    placeholder="Enter first name"
                    required
                    leftSection={<IconUser size={16} />}
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    error={errors.firstName}
                    size="md"
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    label="Last Name"
                    placeholder="Enter last name"
                    required
                    leftSection={<IconUser size={16} />}
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    error={errors.lastName}
                    size="md"
                  />
                </Grid.Col>
              </Grid>

              <TextInput
                label="Email Address"
                placeholder="user@example.com"
                required
                leftSection={<IconMail size={16} />}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
                size="md"
              />

              <TextInput
                label="Phone Number"
                placeholder="+251 911 234 567"
                leftSection={<IconPhone size={16} />}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                error={errors.phone}
                size="md"
              />

              <RadioGroup
                label="Account Type"
                value={formData.accountType}
                onChange={(value) => setFormData({ ...formData, accountType: value as 'individual' | 'business' })}
                size="md"
              >
                <Group mt="xs">
                  <Radio value="individual" label="Individual" />
                  <Radio value="business" label="Business" />
                </Group>
              </RadioGroup>

              {formData.accountType === 'business' && (
                <TextInput
                  label="Company Name"
                  placeholder="Enter company name"
                  leftSection={<IconBuilding size={16} />}
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  error={errors.company}
                  size="md"
                />
              )}

              <FileInput
                label="Profile Picture"
                placeholder="Upload profile picture"
                accept="image/png,image/jpeg,image/jpg"
                leftSection={<IconPhoto size={16} />}
                onChange={handleImageUpload}
                size="md"
              />
              
              {previewImage && (
                <Group>
                  <Avatar src={previewImage} size="xl" radius="xl" />
                  <Button
                    variant="light"
                    color="red"
                    size="xs"
                    leftSection={<IconTrash size={14} />}
                    onClick={() => handleImageUpload(null)}
                  >
                    Remove
                  </Button>
                </Group>
              )}
            </Stack>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Stack gap="md">
              <Text size="lg" fw={600}>Professional Information</Text>
              
              <TextInput
                label="Position/Job Title"
                placeholder="e.g., Manager, Designer, etc."
                leftSection={<IconBriefcase size={16} />}
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                size="md"
              />

              <TextInput
                label="Department"
                placeholder="e.g., Sales, Production, etc."
                leftSection={<IconBuilding size={16} />}
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                size="md"
              />

              <Grid>
                <Grid.Col span={6}>
                  <TextInput
                    label="Employee ID"
                    placeholder="EMP001"
                    leftSection={<IconCertificate size={16} />}
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    size="md"
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <TextInput
                    label="Hire Date"
                    placeholder="YYYY-MM-DD"
                    leftSection={<IconCalendar size={16} />}
                    value={formData.hireDate ? formData.hireDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      hireDate: e.target.value ? new Date(e.target.value) : null 
                    })}
                    size="md"
                    type="date"
                  />
                </Grid.Col>
              </Grid>

              <Divider label="Address Information" labelPosition="center" my="sm" />

              <TextInput
                label="Address"
                placeholder="Street address"
                leftSection={<IconMapPin size={16} />}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                size="md"
              />

              <Grid>
                <Grid.Col span={4}>
                  <TextInput
                    label="City"
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    size="md"
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <TextInput
                    label="Country"
                    placeholder="Country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    size="md"
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <TextInput
                    label="Postal Code"
                    placeholder="Postal code"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    size="md"
                  />
                </Grid.Col>
              </Grid>
            </Stack>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Stack gap="md">
              <Text size="lg" fw={600}>Account Security</Text>
              
              <PasswordInput
                label="Password"
                placeholder="Create a strong password"
                required
                leftSection={<IconLock size={16} />}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                error={errors.password}
                size="md"
                visibilityToggleIcon={({ reveal }) =>
                  reveal ? <IconEyeOff size={16} /> : <IconEye size={16} />
                }
              />

              {formData.password && (
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Text size="sm">Password Strength:</Text>
                    <Text size="sm" fw={500} c={getPasswordStrengthColor()}>
                      {getPasswordStrengthText()}
                    </Text>
                  </Group>
                  <Progress
                    value={(passwordStrength.score / 5) * 100}
                    color={getPasswordStrengthColor()}
                    size="sm"
                    radius="xl"
                  />
                  <SimpleGrid cols={2} spacing="xs" mt="xs">
                    <Group gap={4}>
                      {passwordStrength.hasMinLength ? (
                        <IconCheck size={14} color="green" />
                      ) : (
                        <IconX size={14} color="red" />
                      )}
                      <Text size="xs">Min 8 characters</Text>
                    </Group>
                    <Group gap={4}>
                      {passwordStrength.hasUpperCase ? (
                        <IconCheck size={14} color="green" />
                      ) : (
                        <IconX size={14} color="red" />
                      )}
                      <Text size="xs">Uppercase letter</Text>
                    </Group>
                    <Group gap={4}>
                      {passwordStrength.hasLowerCase ? (
                        <IconCheck size={14} color="green" />
                      ) : (
                        <IconX size={14} color="red" />
                      )}
                      <Text size="xs">Lowercase letter</Text>
                    </Group>
                    <Group gap={4}>
                      {passwordStrength.hasNumber ? (
                        <IconCheck size={14} color="green" />
                      ) : (
                        <IconX size={14} color="red" />
                      )}
                      <Text size="xs">Number</Text>
                    </Group>
                    <Group gap={4}>
                      {passwordStrength.hasSpecialChar ? (
                        <IconCheck size={14} color="green" />
                      ) : (
                        <IconX size={14} color="red" />
                      )}
                      <Text size="xs">Special character</Text>
                    </Group>
                  </SimpleGrid>
                </Stack>
              )}

              <PasswordInput
                label="Confirm Password"
                placeholder="Re-enter password"
                required
                leftSection={<IconLock size={16} />}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                error={errors.confirmPassword}
                size="md"
                visibilityToggleIcon={({ reveal }) =>
                  reveal ? <IconEyeOff size={16} /> : <IconEye size={16} />
                }
              />

              <Divider my="sm" />

              <Switch
                label="Email Verified"
                description="Mark this user's email as verified"
                checked={formData.emailVerified}
                onChange={(e) => setFormData({ ...formData, emailVerified: e.target.checked })}
                size="md"
              />
            </Stack>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Stack gap="md">
              <Text size="lg" fw={600}>Role & Permissions</Text>
              
              <Select
                label="Account Status"
                placeholder="Select status"
                data={[
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                  { value: 'suspended', label: 'Suspended' },
                ]}
                value={formData.status}
                onChange={(value) => setFormData({ 
                  ...formData, 
                  status: value as 'active' | 'inactive' | 'suspended' 
                })}
                size="md"
              />

              <Text size="sm" fw={500} mb="xs">Select Role:</Text>
              <SimpleGrid cols={1} spacing="sm">
                {ROLES.map((role) => (
                  <Card
                    key={role.value}
                    withBorder
                    padding="md"
                    radius="md"
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      formData.role === role.value ? 'border-2 border-blue-500 bg-blue-50' : ''
                    }`}
                    onClick={() => setFormData({ ...formData, role: role.value })}
                  >
                    <Group>
                      <ThemeIcon size="lg" radius="xl" color={role.color} variant="light">
                        {role.icon}
                      </ThemeIcon>
                      <div style={{ flex: 1 }}>
                        <Group justify="space-between">
                          <Text fw={600}>{role.label}</Text>
                          <Badge color={role.color} variant="dot">
                            {role.permissions.length} permissions
                          </Badge>
                        </Group>
                        <Text size="xs" c="dimmed" lineClamp={2}>
                          {role.description}
                        </Text>
                      </div>
                      <Tooltip label="View permissions">
                        <ActionIcon
                          variant="subtle"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRoleForInfo(role);
                            setRoleModalOpened(true);
                          }}
                        >
                          <IconEye size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </Card>
                ))}
              </SimpleGrid>

              {errors.role && (
                <Text c="red" size="sm">
                  {errors.role}
                </Text>
              )}
            </Stack>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Stack gap="md">
              <Text size="lg" fw={600}>Preferences & Notes</Text>
              
              <Grid>
                <Grid.Col span={6}>
                  <Select
                    label="Language"
                    data={LANGUAGES}
                    value={formData.language}
                    onChange={(value) => setFormData({ ...formData, language: value || 'en' })}
                    size="md"
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <Select
                    label="Timezone"
                    data={TIMEZONES}
                    value={formData.timezone}
                    onChange={(value) => setFormData({ ...formData, timezone: value || 'Africa/Addis_Ababa' })}
                    size="md"
                  />
                </Grid.Col>
              </Grid>

              <Switch
                label="Receive Notifications"
                description="User will receive email notifications"
                checked={formData.receiveNotifications}
                onChange={(e) => setFormData({ ...formData, receiveNotifications: e.target.checked })}
                size="md"
              />

              <Textarea
                label="Additional Notes"
                placeholder="Any additional information about this user..."
                minRows={4}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                size="md"
              />

              <Divider my="sm" />

              <Card withBorder padding="md" radius="md" className="bg-blue-50">
                <Text size="sm" fw={500} mb="xs">Review Information:</Text>
                <SimpleGrid cols={2} spacing="xs">
                  <Text size="xs" c="dimmed">Name:</Text>
                  <Text size="xs">{formData.firstName} {formData.lastName}</Text>
                  
                  <Text size="xs" c="dimmed">Email:</Text>
                  <Text size="xs">{formData.email}</Text>
                  
                  <Text size="xs" c="dimmed">Role:</Text>
                  <Badge color={getRoleColor(formData.role)} size="xs">
                    {ROLES.find(r => r.value === formData.role)?.label}
                  </Badge>
                  
                  <Text size="xs" c="dimmed">Status:</Text>
                  <Badge color={formData.status === 'active' ? 'green' : formData.status === 'inactive' ? 'gray' : 'red'} size="xs">
                    {formData.status}
                  </Badge>
                  
                  <Text size="xs" c="dimmed">Account Type:</Text>
                  <Text size="xs" tt="capitalize">{formData.accountType}</Text>
                </SimpleGrid>
              </Card>
            </Stack>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2}>Create New User</Title>
          <Text c="dimmed" size="sm">
            Create a new user account with specific role and permissions
          </Text>
        </div>
        <Group>
          <Button
            variant="light"
            leftSection={<IconRefresh size={16} />}
            onClick={handleReset}
          >
            Reset Form
          </Button>
          <Button
            variant="light"
            color="blue"
            leftSection={<IconSend size={16} />}
            onClick={handleSendInvitation}
            loading={loading}
          >
            Send Invitation
          </Button>
          <Button
            component={Link}
            href="/admin/users"
            variant="subtle"
          >
            Cancel
          </Button>
        </Group>
      </Group>

      <Grid gutter="xl">
        {/* Main Form */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card withBorder shadow="sm" padding="xl" radius="lg">
            <Stepper
              active={activeStep}
              onStepClick={setActiveStep}
              size="sm"
              color="blue"
              mb="xl"
              allowNextStepsSelect={false}
            >
              <Stepper.Step label="Step 1" description="Personal Info" />
              <Stepper.Step label="Step 2" description="Professional" />
              <Stepper.Step label="Step 3" description="Security" />
              <Stepper.Step label="Step 4" description="Role" />
              <Stepper.Step label="Step 5" description="Preferences" />
            </Stepper>

            <AnimatePresence mode="wait">
              {renderStepContent()}
            </AnimatePresence>

            <Group justify="space-between" mt="xl">
              <Button
                variant="light"
                onClick={prevStep}
                disabled={activeStep === 0}
                leftSection={<IconArrowLeft size={16} />}
              >
                Back
              </Button>

              {activeStep === 4 ? (
                <Button
                  color="green"
                  onClick={handleCreateUser}
                  loading={loading}
                  rightSection={<IconDeviceFloppy size={16} />}
                >
                  Create User
                </Button>
              ) : (
                <Button
                  color="blue"
                  onClick={nextStep}
                  rightSection={<IconArrowRight size={16} />}
                >
                  Continue
                </Button>
              )}
            </Group>
          </Card>
        </Grid.Col>

        {/* Sidebar - Help & Tips */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack>
            <Card withBorder shadow="sm" padding="lg" radius="lg">
              <Group mb="md">
                <ThemeIcon size="lg" radius="xl" color="blue" variant="light">
                  <IconAlertCircle size={20} />
                </ThemeIcon>
                <Text fw={600}>Creating New User</Text>
              </Group>
              
              <List
                spacing="xs"
                size="sm"
                icon={
                  <ThemeIcon color="blue" size={20} radius="xl" variant="light">
                    <IconCheck size={12} />
                  </ThemeIcon>
                }
              >
                <List.Item>Fill in all required fields marked with *</List.Item>
                <List.Item>Use a strong password for security</List.Item>
                <List.Item>Select appropriate role for permissions</List.Item>
                <List.Item>Verify email address before sending invitations</List.Item>
                <List.Item>Add notes for internal reference</List.Item>
              </List>
            </Card>

            <Card withBorder shadow="sm" padding="lg" radius="lg">
              <Group mb="md">
                <ThemeIcon size="lg" radius="xl" color="green" variant="light">
                  <IconShield size={20} />
                </ThemeIcon>
                <Text fw={600}>Role Permissions</Text>
              </Group>
              
              <Text size="sm" c="dimmed" mb="xs">
                Each role has specific permissions:
              </Text>
              
              <Stack gap="xs">
                {ROLES.map((role) => (
                  <Group key={role.value} justify="space-between">
                    <Group gap="xs">
                      <ThemeIcon size="sm" radius="xl" color={role.color} variant="light">
                        {role.icon}
                      </ThemeIcon>
                      <Text size="sm">{role.label}</Text>
                    </Group>
                    <Badge size="sm" color={role.color}>
                      {role.permissions.length} perms
                    </Badge>
                  </Group>
                ))}
              </Stack>
              
              <Button
                variant="light"
                fullWidth
                mt="md"
                size="xs"
                onClick={() => {
                  setSelectedRoleForInfo(ROLES[0]);
                  setRoleModalOpened(true);
                }}
              >
                View Detailed Permissions
              </Button>
            </Card>

            <Card withBorder shadow="sm" padding="lg" radius="lg">
              <Group mb="md">
                <ThemeIcon size="lg" radius="xl" color="yellow" variant="light">
                  <IconBulb size={20} />
                </ThemeIcon>
                <Text fw={600}>Quick Tips</Text>
              </Group>
              
              <Stack gap="xs">
                <Text size="sm">• Use employee ID for internal tracking</Text>
                <Text size="sm">• Set timezone for accurate scheduling</Text>
                <Text size="sm">• Verify email before sending invitations</Text>
                <Text size="sm">• Add profile picture for better recognition</Text>
                <Text size="sm">• Department helps with organization</Text>
              </Stack>
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>

      {/* Role Permissions Modal */}
      <Modal
        opened={roleModalOpened}
        onClose={() => setRoleModalOpened(false)}
        title={`${selectedRoleForInfo?.label} Permissions`}
        size="lg"
      >
        {selectedRoleForInfo && (
          <Stack>
            <Group>
              <ThemeIcon size="xl" radius="xl" color={selectedRoleForInfo.color} variant="light">
                {selectedRoleForInfo.icon}
              </ThemeIcon>
              <div>
                <Text fw={600}>{selectedRoleForInfo.label}</Text>
                <Text size="xs" c="dimmed">{selectedRoleForInfo.description}</Text>
              </div>
            </Group>

            <Divider my="sm" />

            <Text fw={500} size="sm">Permissions:</Text>
            <SimpleGrid cols={2} spacing="xs">
              {selectedRoleForInfo.permissions.map((permission, index) => (
                <Group key={index} gap="xs">
                  <ThemeIcon color={selectedRoleForInfo.color} size="sm" radius="xl" variant="light">
                    <IconCheck size={12} />
                  </ThemeIcon>
                  <Text size="sm">{permission}</Text>
                </Group>
              ))}
            </SimpleGrid>

            <Alert color="blue" title="Note" mt="md">
              Additional custom permissions can be assigned after user creation.
            </Alert>
          </Stack>
        )}
      </Modal>
    </Container>
  );
}

// Missing IconBulb component
const IconBulb = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size || 24}
    height={props.size || 24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M12 2v4" />
    <path d="M12 9v1" />
    <path d="M19 6l-2 2" />
    <path d="M5 6l2 2" />
    <path d="M19 14l-2-2" />
    <path d="M5 14l2-2" />
    <path d="M12 22v-4" />
    <path d="M8 18c-2.2 0-4-1.8-4-4 0-2.5 2-5 4-6 2-1 4-1 6 0 2 1 4 3.5 4 6 0 2.2-1.8 4-4 4" />
  </svg>
);