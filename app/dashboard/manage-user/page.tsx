/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Title,
  Text,
  Group,
  Button,
  Table,
  Badge,
  ActionIcon,
  TextInput,
  Select,
  Modal,
  Stack,
  Avatar,
  Menu,
  Grid,
  LoadingOverlay,
  Alert,
  PasswordInput,
  Pagination,
  Tooltip,
  Checkbox,
  Center,
  Loader,
  Tabs,
  Card,
  ThemeIcon,
  NumberInput,
  Textarea,
  Divider,
} from '@mantine/core';
import {
  IconSearch,
  IconEdit,
  IconTrash,
  IconUserPlus,
  IconUserOff,
  IconUserCheck,
  IconMail,
  IconPhone,
  IconBuilding,
  IconCalendar,
  IconDotsVertical,
  IconShield,
  IconRefresh,
  IconExclamationCircle,
  IconUsers,
  IconUserCircle,
  IconCash,
  IconPrinter,
  IconLogin,
  IconEye,
  IconLock,
  IconCheck,
  IconX,
  IconFilter,
  IconDownload,
  IconUpload,
  IconBriefcase,
  IconMapPin,
  IconId,
  IconCoin,
  IconCalendarEvent,
  IconAt,
  IconPhoneCall,
  IconHome,
  IconBuildingCommunity,
  IconHeartbeat,
  IconBrush,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Helper function to format relative time
const formatRelativeTime = (dateString: string | null): string => {
  if (!dateString) return 'Never';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
  if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }
  const years = Math.floor(diffInSeconds / 31536000);
  return `${years} year${years > 1 ? 's' : ''} ago`;
};

// Helper function to format date for display
const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'Never';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Updated User interface to match backend
interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  company: string | null;
  role: 'admin' | 'receptionist' | 'cashier' | 'designer' | 'printer' | 'customer';
  status: 'active' | 'inactive' | 'suspended';
  account_type: 'individual' | 'business' | 'designer' | 'reseller';
  email_verified: boolean;
  is_active: boolean;
  is_online: boolean;
  last_login: string | null;
  last_login_ip: string | null;
  last_activity: string | null;
  created_at: string;
  updated_at: string;
  profile_photo_url: string | null;
  bio: string | null;
  preferences: Record<string, any>;
  
  // Customer profile fields
  customer_profile_id?: string;
  customer_code?: string;
  loyalty_points?: number;
  customer_tier?: 'regular' | 'silver' | 'gold' | 'platinum';
  total_orders?: number;
  total_spent?: number;
  credit_limit?: number;
  billing_address?: string;
  shipping_address?: string;
  city?: string;
  country?: string;
  
  // Employee profile fields
  employee_profile_id?: string;
  employee_id?: string;
  department?: string;
  position?: string;
  hire_date?: string;
  salary?: number;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relation?: string;
  address?: string;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface RoleCount {
  role: string;
  count: number;
  color: string;
  icon: React.ReactNode;
}

interface Department {
  value: string;
  label: string;
}

interface CustomerTier {
  value: string;
  label: string;
}

interface Stats {
  total_users: number;
  total_customers: number;
  total_employees: number;
  active_customers: number;
  active_employees: number;
  unverified_customers: number;
  new_users_last_30days: number;
  active_last_7days: number;
  admin_count: number;
  receptionist_count: number;
  cashier_count: number;
  designer_count: number;
  printer_count: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function UserManagementPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
  const [tierFilter, setTierFilter] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>('all');
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
    hasNextPage: false,
    hasPrevPage: false
  });
  
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<User | null>(null);
  const [viewUser, setViewUser] = useState<User | null>(null);
  
  // Modal states
  const [openedAdd, { open: openAdd, close: closeAdd }] = useDisclosure(false);
  const [openedAddEmployee, { open: openAddEmployee, close: closeAddEmployee }] = useDisclosure(false);
  const [openedEdit, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [openedRole, { open: openRole, close: closeRole }] = useDisclosure(false);
  const [openedBulk, { open: openBulk, close: closeBulk }] = useDisclosure(false);
  const [openedDelete, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [openedView, { open: openView, close: closeView }] = useDisclosure(false);
  const [openedImport, { open: openImport, close: closeImport }] = useDisclosure(false);

  // Form states
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    company: '',
    role: 'customer' as 'admin' | 'receptionist' | 'cashier' | 'designer' | 'printer' | 'customer',
    accountType: 'individual' as 'individual' | 'business' | 'designer' | 'reseller',
  });

  const [newEmployee, setNewEmployee] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'receptionist' as 'admin' | 'receptionist' | 'cashier' | 'designer' | 'printer',
    department: '',
    position: '',
    hireDate: new Date().toISOString().split('T')[0],
    salary: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    address: '',
    city: '',
    bankAccountNumber: '',
    bankName: '',
    idCardNumber: '',
  });

  const [roleChangeData, setRoleChangeData] = useState({
    userId: '',
    newRole: 'customer' as 'admin' | 'receptionist' | 'cashier' | 'designer' | 'printer' | 'customer',
  });

  const [bulkAction, setBulkAction] = useState<'activate' | 'deactivate' | 'delete' | null>(null);
  const [importFile, setImportFile] = useState<File | null>(null);

  // Dropdown data
  const [departments, setDepartments] = useState<Department[]>([]);
  const [customerTiers, setCustomerTiers] = useState<CustomerTier[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);

  // Role counts for dashboard
  const [roleCounts, setRoleCounts] = useState<RoleCount[]>([
    { role: 'admin', count: 0, color: 'red', icon: <IconShield size={20} /> },
    { role: 'receptionist', count: 0, color: 'cyan', icon: <IconUserCircle size={20} /> },
    { role: 'cashier', count: 0, color: 'green', icon: <IconCash size={20} /> },
    { role: 'designer', count: 0, color: 'grape', icon: <IconBrush size={20} /> },
    { role: 'printer', count: 0, color: 'orange', icon: <IconPrinter size={20} /> },
    { role: 'customer', count: 0, color: 'blue', icon: <IconUsers size={20} /> },
  ]);

  // Helper function to get auth token
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  };
  // Helper function to make authenticated requests
const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  console.log('fetchWithAuth called:', { endpoint, hasToken: !!token });
  
  if (!token) {
    console.error('No authentication token found');
    router.push('/page/login');
    throw new Error('No authentication token found');
  }

  // Log token preview (first 20 chars) for debugging
  console.log('Token preview:', token.substring(0, 20) + '...');

  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };

  try {
    console.log('Making request to:', url);
    
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    console.log('Response status:', response.status);

    // Try to parse response even if not OK
    let data;
    try {
      data = await response.json();
      console.log('Response data:', data);
    } catch (e) {
      console.error('Failed to parse response as JSON:', e);
      data = { message: 'Invalid response from server' };
    }

    if (response.status === 401) {
      console.log('Token expired or invalid');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      router.push('/page/login?session=expired');
      throw new Error('Session expired. Please login again.');
    }

    if (response.status === 403) {
      console.log('Permission denied - User may not be admin');
    console.log('You do not have permission to access this resource. Admin access required.');
    }

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Fetch error details:', error);
    throw error;
  }
};
  // Check authentication on mount
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push('/page/login');
    } else {
      fetchDropdownData();
      fetchStats();
      fetchUsers(1);
    }
  }, [router]);

  // Fetch dropdown data (departments, tiers)
  const fetchDropdownData = async () => {
    try {
      // Fetch departments
      const deptData = await fetchWithAuth('/api/admin/departments');
      if (deptData.success) {
        setDepartments(deptData.data.departments);
      }

      // Fetch customer tiers
      const tiersData = await fetchWithAuth('/api/admin/customer-tiers');
      if (tiersData.success) {
        setCustomerTiers(tiersData.data.tiers);
      }
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
    }
  };

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      const data = await fetchWithAuth('/api/admin/dashboard/stats');
      if (data.success) {
        setStats(data.data.stats);
        
        // Update role counts from stats
        if (data.data.stats) {
          setRoleCounts(prev => prev.map(r => ({
            ...r,
            count: data.data.stats[`${r.role}_count`] || 0
          })));
        }
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Fetch users
 // Fetch users
const fetchUsers = async (page = pagination.page) => {
  setLoading(true);
  setError(null);
  
  try {
    const params = new URLSearchParams();
    
    // Add basic pagination
    params.append('page', page.toString());
    params.append('limit', pagination.limit.toString());
    
    // Add search query if present
    if (searchQuery) {
      params.append('search', searchQuery);
    }
    
    // Add role filter if present
    if (roleFilter) {
      params.append('role', roleFilter);
    }
    
    // Add status filter if present
    if (statusFilter) {
      params.append('status', statusFilter);
    }
    
    // Add department filter if present
    if (departmentFilter) {
      params.append('department', departmentFilter);
    }
    
    // Add tier filter if present
    if (tierFilter) {
      params.append('tier', tierFilter);
    }
    
    // Add active tab filter if not 'all' and not 'customers'
    if (activeTab && activeTab !== 'all' && activeTab !== 'customers') {
      params.append('role', activeTab);
    }

    let endpoint = '/api/admin/users';
    
    // Use appropriate endpoint based on tab
    if (activeTab === 'customers') {
      endpoint = '/api/admin/customers';
    } else if (['admin', 'receptionist', 'cashier', 'designer', 'printer'].includes(activeTab || '')) {
      endpoint = '/api/admin/employees';
    }

    const data = await fetchWithAuth(`${endpoint}?${params.toString()}`);

    if (data.success) {
      if (data.data) {
        if (Array.isArray(data.data)) {
          setUsers(data.data);
          setPagination({
            page: 1,
            limit: data.data.length,
            total: data.data.length,
            pages: 1,
            hasNextPage: false,
            hasPrevPage: false
          });
        } else if (data.data.users || data.data.employees || data.data.customers) {
          const userList = data.data.users || data.data.employees || data.data.customers;
          setUsers(userList || []);
          if (data.data.pagination) {
            setPagination(data.data.pagination);
          }
        }
      }
    } else {
      setError(data.message || 'Failed to fetch users');
    }
  } catch (error) {
    setError(error instanceof Error ? error.message : 'Failed to fetch users');
  } finally {
    setLoading(false);
  }
};

  // Load users when filters change
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      fetchUsers(1);
    }
  }, [roleFilter, statusFilter, departmentFilter, tierFilter, activeTab]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      const token = getAuthToken();
      if (token) {
        fetchUsers(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    fetchUsers(newPage);
  };

  // Navigate to user registration
  const goToRegistration = () => {
    router.push('/dashboard/manage-user/add_new_user');
  };

  // Open add employee modal
  const handleAddEmployee = () => {
    setNewEmployee({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      role: 'receptionist',
      department: '',
      position: '',
      hireDate: new Date().toISOString().split('T')[0],
      salary: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelation: '',
      address: '',
      city: '',
      bankAccountNumber: '',
      bankName: '',
      idCardNumber: '',
    });
    openAddEmployee();
  };

  // Create employee
  const handleCreateEmployee = async () => {
    // Validation
    if (newEmployee.password !== newEmployee.confirmPassword) {
      notifications.show({
        title: 'Error',
        message: 'Passwords do not match',
        color: 'red',
      });
      return;
    }

    try {
      const data = await fetchWithAuth('/api/admin/employees', {
        method: 'POST',
        body: JSON.stringify(newEmployee),
      });

      if (data.success) {
        notifications.show({
          title: 'Success',
          message: 'Employee created successfully. Login credentials sent to email.',
          color: 'green',
        });
        closeAddEmployee();
        fetchUsers(1);
        fetchStats();
      }
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to create employee',
        color: 'red',
      });
    }
  };

  // Update user
  const handleUpdateUser = async () => {
    if (!editUser) return;

    try {
      const data = await fetchWithAuth(`/api/admin/users/${editUser.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          first_name: editUser.first_name,
          last_name: editUser.last_name,
          phone: editUser.phone,
          company: editUser.company,
        }),
      });

      if (data.success) {
        notifications.show({
          title: 'Success',
          message: 'User updated successfully',
          color: 'green',
        });
        closeEdit();
        fetchUsers(pagination.page);
      }
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to update user',
        color: 'red',
      });
    }
  };

  // Update user status
  const handleStatusChange = async (userId: string, isActive: boolean) => {
    try {
      const data = await fetchWithAuth(`/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive }),
      });

      if (data.success) {
        notifications.show({
          title: 'Success',
          message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
          color: 'green',
        });
        fetchUsers(pagination.page);
        fetchStats();
      }
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to update user status',
        color: 'red',
      });
    }
  };

  // Change user role
  const handleRoleChange = async () => {
    try {
      const data = await fetchWithAuth(`/api/admin/users/${roleChangeData.userId}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role: roleChangeData.newRole }),
      });

      if (data.success) {
        notifications.show({
          title: 'Success',
          message: 'User role updated successfully',
          color: 'green',
        });
        closeRole();
        fetchUsers(pagination.page);
        fetchStats();
      }
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to update user role',
        color: 'red',
      });
    }
  };

  // Delete user
  const handleDeleteUser = async () => {
    if (!deleteConfirmUser) return;

    try {
      const data = await fetchWithAuth(`/api/admin/users/${deleteConfirmUser.id}`, {
        method: 'DELETE',
      });

      if (data.success) {
        notifications.show({
          title: 'Success',
          message: 'User deleted successfully',
          color: 'green',
        });
        closeDelete();
        setDeleteConfirmUser(null);
        
        if (users.length === 1 && pagination.page > 1) {
          fetchUsers(pagination.page - 1);
        } else {
          fetchUsers(pagination.page);
        }
        fetchStats();
      }
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to delete user',
        color: 'red',
      });
    }
  };

  // View user details
  const viewUserDetails = (userId: string) => {
    router.push(`/admin/users/${userId}`);
  };

  // Export users
  const exportUsers = () => {
    const dataStr = JSON.stringify(users, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `users_export_${new Date().toISOString()}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Bulk action handler
  const handleBulkAction = async () => {
    if (!bulkAction || selectedUsers.length === 0) return;

    try {
      const data = await fetchWithAuth('/api/admin/users/bulk', {
        method: 'POST',
        body: JSON.stringify({
          action: bulkAction,
          userIds: selectedUsers,
        }),
      });

      if (data.success) {
        notifications.show({
          title: 'Success',
          message: `Bulk action completed successfully for ${selectedUsers.length} users`,
          color: 'green',
        });
        setSelectedUsers([]);
        closeBulk();
        fetchUsers(pagination.page);
        fetchStats();
      }
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to perform bulk action',
        color: 'red',
      });
    }
  };

  // Helper functions for badges
  const getStatusBadge = (status: string, isActive: boolean) => {
    if (!isActive) return <Badge color="gray">Inactive</Badge>;
    
    const colors: Record<string, string> = {
      active: 'green',
      inactive: 'gray',
      suspended: 'red',
    };
    return <Badge color={colors[status] || 'gray'}>{status}</Badge>;
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'red',
      receptionist: 'cyan',
      cashier: 'green',
      designer: 'grape',
      printer: 'orange',
      customer: 'blue',
    };
    
    const labels: Record<string, string> = {
      admin: 'Admin',
      receptionist: 'Reception',
      cashier: 'Cashier',
      designer: 'Designer',
      printer: 'Printer',
      customer: 'Customer',
    };
    
    return <Badge color={colors[role] || 'gray'}>{labels[role] || role}</Badge>;
  };

  const getVerificationBadge = (verified: boolean) => {
    return verified ? (
      <Badge color="green" variant="light">Verified</Badge>
    ) : (
      <Badge color="yellow" variant="light">Pending</Badge>
    );
  };

  const getOnlineStatus = (isOnline: boolean, lastActivity: string | null) => {
    if (isOnline) {
      return <Badge color="green">Online</Badge>;
    }
    if (lastActivity) {
      const minutes = Math.floor((new Date().getTime() - new Date(lastActivity).getTime()) / 60000);
      if (minutes < 5) {
        return <Badge color="green">Online</Badge>;
      }
      return <Badge color="gray">Offline</Badge>;
    }
    return <Badge color="gray">Offline</Badge>;
  };

  // If no token, show nothing while redirecting
  const token = getAuthToken();
  if (!token) {
    return (
      <Center style={{ height: '100vh' }}>
        <Loader size="lg" />
        <Text ml="md">Redirecting to login...</Text>
      </Center>
    );
  }

  return (
    <Container size="xl" py="xl">
      {/* Header */}
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2}>User Management</Title>
          <Text c="dimmed" size="sm">
            Manage users, employees, customers, roles and permissions
            {pagination.total > 0 && ` • ${pagination.total} total users`}
          </Text>
        </div>
        <Group>
          <Button
            variant="light"
            leftSection={<IconRefresh size={16} />}
            onClick={() => fetchUsers(pagination.page)}
            loading={loading}
          >
            Refresh
          </Button>
          <Button
            variant="light"
            color="blue"
            leftSection={<IconDownload size={16} />}
            onClick={exportUsers}
          >
            Export
          </Button>
          {selectedUsers.length > 0 && (
            <Button
              variant="light"
              color="blue"
              leftSection={<IconUserCheck size={16} />}
              onClick={openBulk}
            >
              Bulk Actions ({selectedUsers.length})
            </Button>
          )}
          <Button
            leftSection={<IconUserPlus size={16} />}
            onClick={goToRegistration}
            variant="gradient"
            gradient={{ from: 'blue', to: 'cyan' }}
          >
            Add Customer
          </Button>
          <Button
            leftSection={<IconBriefcase size={16} />}
            onClick={handleAddEmployee}
            variant="gradient"
            gradient={{ from: 'orange', to: 'red' }}
          >
            Add Employee
          </Button>
        </Group>
      </Group>

      {/* Statistics Cards */}
      {stats && (
        <Grid mb="lg">
          <Grid.Col span={{ base: 6, md: 3 }}>
            <Card withBorder padding="md" radius="md">
              <Group justify="space-between">
                <div>
                  <Text size="xs" c="dimmed">Total Users</Text>
                  <Text fw={700} size="xl">{stats.total_users}</Text>
                </div>
                <ThemeIcon color="blue" variant="light" size="lg" radius="md">
                  <IconUsers size={20} />
                </ThemeIcon>
              </Group>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 6, md: 3 }}>
            <Card withBorder padding="md" radius="md">
              <Group justify="space-between">
                <div>
                  <Text size="xs" c="dimmed">Active Customers</Text>
                  <Text fw={700} size="xl">{stats.active_customers}</Text>
                </div>
                <ThemeIcon color="green" variant="light" size="lg" radius="md">
                  <IconUserCheck size={20} />
                </ThemeIcon>
              </Group>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 6, md: 3 }}>
            <Card withBorder padding="md" radius="md">
              <Group justify="space-between">
                <div>
                  <Text size="xs" c="dimmed">Active Employees</Text>
                  <Text fw={700} size="xl">{stats.active_employees}</Text>
                </div>
                <ThemeIcon color="orange" variant="light" size="lg" radius="md">
                  <IconBriefcase size={20} />
                </ThemeIcon>
              </Group>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 6, md: 3 }}>
            <Card withBorder padding="md" radius="md">
              <Group justify="space-between">
                <div>
                  <Text size="xs" c="dimmed">New (30 days)</Text>
                  <Text fw={700} size="xl">{stats.new_users_last_30days}</Text>
                </div>
                <ThemeIcon color="grape" variant="light" size="lg" radius="md">
                  <IconCalendar size={20} />
                </ThemeIcon>
              </Group>
            </Card>
          </Grid.Col>
        </Grid>
      )}

      {/* Role Statistics Cards */}
      <Grid mb="lg">
        {roleCounts.map((role) => (
          <Grid.Col key={role.role} span={{ base: 6, md: 2 }}>
            <Card withBorder padding="md" radius="md">
              <Group justify="space-between">
                <div>
                  <Text size="xs" c="dimmed" tt="capitalize">
                    {role.role}s
                  </Text>
                  <Text fw={700} size="xl">
                    {role.count}
                  </Text>
                </div>
                <ThemeIcon color={role.color} variant="light" size="lg" radius="md">
                  {role.icon}
                </ThemeIcon>
              </Group>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      {/* Tabs for role filtering */}
      <Tabs value={activeTab} onChange={setActiveTab} mb="md">
        <Tabs.List>
          <Tabs.Tab value="all" leftSection={<IconUsers size={16} />}>
            All Users
          </Tabs.Tab>
          <Tabs.Tab value="customers" leftSection={<IconUserCheck size={16} />}>
            Customers
          </Tabs.Tab>
          <Tabs.Tab value="admin" leftSection={<IconShield size={16} />}>
            Admins
          </Tabs.Tab>
          <Tabs.Tab value="receptionist" leftSection={<IconUserCircle size={16} />}>
            Reception
          </Tabs.Tab>
          <Tabs.Tab value="cashier" leftSection={<IconCash size={16} />}>
            Cashiers
          </Tabs.Tab>
          <Tabs.Tab value="designer" leftSection={<IconBrush size={16} />}>
            Designers
          </Tabs.Tab>
          <Tabs.Tab value="printer" leftSection={<IconPrinter size={16} />}>
            Printers
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>

      {/* Filters */}
      <Paper p="md" withBorder mb="lg">
        <Grid>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <TextInput
              placeholder="Search users..."
              leftSection={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 6, md: 2 }}>
            <Select
              placeholder="Role"
              clearable
              data={[
                { value: 'admin', label: 'Admin' },
                { value: 'receptionist', label: 'Receptionist' },
                { value: 'cashier', label: 'Cashier' },
                { value: 'designer', label: 'Designer' },
                { value: 'printer', label: 'Printer' },
                { value: 'customer', label: 'Customer' },
              ]}
              value={roleFilter}
              onChange={setRoleFilter}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 6, md: 2 }}>
            <Select
              placeholder="Status"
              clearable
              data={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'suspended', label: 'Suspended' },
              ]}
              value={statusFilter}
              onChange={setStatusFilter}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 6, md: 2 }}>
            <Select
              placeholder="Department"
              clearable
              data={departments}
              value={departmentFilter}
              onChange={setDepartmentFilter}
              disabled={activeTab === 'customers'}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 6, md: 3 }}>
            <Select
              placeholder="Customer Tier"
              clearable
              data={customerTiers}
              value={tierFilter}
              onChange={setTierFilter}
              disabled={activeTab !== 'customers'}
            />
          </Grid.Col>
        </Grid>
      </Paper>

      {/* Loading State */}
      {loading && (
        <Center py="xl">
          <Loader size="lg" />
        </Center>
      )}

      {/* Error State */}
      {error && !loading && (
        <Paper p="xl" withBorder mb="lg">
          <Center>
            <Stack align="center" gap="md">
              <IconExclamationCircle size={48} color="red" />
              <Text size="lg" fw={500} c="red">Error Loading Users</Text>
              <Text c="dimmed">{error}</Text>
              <Button onClick={() => fetchUsers(1)}>Try Again</Button>
            </Stack>
          </Center>
        </Paper>
      )}

      {/* Users Table */}
      {!loading && !error && (
        <Paper withBorder>
          {users.length === 0 ? (
            <Center py="xl">
              <Stack align="center" gap="md">
                <IconUserOff size={48} color="gray" />
                <Text size="lg" fw={500}>No Users Found</Text>
                <Text c="dimmed">
                  {searchQuery || roleFilter || statusFilter || activeTab !== 'all'
                    ? 'Try adjusting your filters' 
                    : 'Get started by adding your first user'}
                </Text>
                {!searchQuery && !roleFilter && !statusFilter && activeTab === 'all' && (
                  <Group>
                    <Button leftSection={<IconUserPlus size={16} />} onClick={goToRegistration}>
                      Add Customer
                    </Button>
                    <Button leftSection={<IconBriefcase size={16} />} onClick={handleAddEmployee}>
                      Add Employee
                    </Button>
                  </Group>
                )}
              </Stack>
            </Center>
          ) : (
            <>
              <Table.ScrollContainer minWidth={1200}>
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th style={{ width: 40 }}>
                        <Checkbox
                          onChange={(e) => {
                            if (e.currentTarget.checked) {
                              setSelectedUsers(users.map(u => u.id));
                            } else {
                              setSelectedUsers([]);
                            }
                          }}
                          checked={selectedUsers.length === users.length && users.length > 0}
                          indeterminate={selectedUsers.length > 0 && selectedUsers.length < users.length}
                        />
                      </Table.Th>
                      <Table.Th>User</Table.Th>
                      <Table.Th>Contact</Table.Th>
                      <Table.Th>Role</Table.Th>
                      <Table.Th>Status</Table.Th>
                      <Table.Th>Verification</Table.Th>
                      <Table.Th>Online</Table.Th>
                      <Table.Th>Last Login</Table.Th>
                      <Table.Th style={{ width: 120 }}>Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {users.map((user) => (
                      <Table.Tr key={user.id}>
                        <Table.Td>
                          <Checkbox
                            checked={selectedUsers.includes(user.id)}
                            onChange={(e) => {
                              if (e.currentTarget.checked) {
                                setSelectedUsers([...selectedUsers, user.id]);
                              } else {
                                setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                              }
                            }}
                          />
                        </Table.Td>
                        <Table.Td>
                          <Group gap="sm">
                            <Avatar
                              size="md"
                              radius="xl"
                              src={user.profile_photo_url}
                              name={`${user.first_name} ${user.last_name}`}
                              color="initials"
                            />
                            <div>
                              <Text fw={500}>
                                {user.first_name} {user.last_name}
                              </Text>
                              <Text size="xs" c="dimmed">
                                {user.employee_id || user.customer_code || 'No ID'}
                              </Text>
                              {user.company && (
                                <Text size="xs" c="dimmed">
                                  {user.company}
                                </Text>
                              )}
                            </div>
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Stack gap={4}>
                            <Group gap={4} wrap="nowrap">
                              <IconMail size={14} />
                              <Text size="sm" lineClamp={1}>{user.email}</Text>
                            </Group>
                            {user.phone && (
                              <Group gap={4} wrap="nowrap">
                                <IconPhone size={14} />
                                <Text size="sm">{user.phone}</Text>
                              </Group>
                            )}
                          </Stack>
                        </Table.Td>
                        <Table.Td>
                          <Stack gap={4}>
                            {getRoleBadge(user.role)}
                            {user.department && (
                              <Text size="xs" c="dimmed">{user.department}</Text>
                            )}
                            {user.customer_tier && user.customer_tier !== 'regular' && (
                              <Badge size="xs" color="yellow" variant="light">
                                {user.customer_tier}
                              </Badge>
                            )}
                          </Stack>
                        </Table.Td>
                        <Table.Td>{getStatusBadge(user.status, user.is_active)}</Table.Td>
                        <Table.Td>{getVerificationBadge(user.email_verified)}</Table.Td>
                        <Table.Td>{getOnlineStatus(user.is_online, user.last_activity)}</Table.Td>
                        <Table.Td>
                          {user.last_login ? (
                            <Tooltip label={formatDate(user.last_login)}>
                              <Group gap={4} wrap="nowrap">
                                <IconCalendar size={14} />
                                <Text size="sm">
                                  {formatRelativeTime(user.last_login)}
                                </Text>
                              </Group>
                            </Tooltip>
                          ) : (
                            <Text size="sm" c="dimmed">Never</Text>
                          )}
                        </Table.Td>
                        <Table.Td>
                          <Group gap={4}>
                            <Tooltip label="View Details">
                              <ActionIcon
                                variant="subtle"
                                color="blue"
                                onClick={() => viewUserDetails(user.id)}
                              >
                                <IconEye size={16} />
                              </ActionIcon>
                            </Tooltip>
                            
                            <Menu position="bottom-end" withinPortal>
                              <Menu.Target>
                                <ActionIcon variant="subtle" color="gray">
                                  <IconDotsVertical size={16} />
                                </ActionIcon>
                              </Menu.Target>
                              <Menu.Dropdown>
                                <Menu.Label>User Actions</Menu.Label>
                                
                                {user.is_active ? (
                                  <Menu.Item
                                    leftSection={<IconUserOff size={14} />}
                                    onClick={() => handleStatusChange(user.id, false)}
                                  >
                                    Deactivate
                                  </Menu.Item>
                                ) : (
                                  <Menu.Item
                                    leftSection={<IconUserCheck size={14} />}
                                    onClick={() => handleStatusChange(user.id, true)}
                                  >
                                    Activate
                                  </Menu.Item>
                                )}
                                
                                <Menu.Item
                                  leftSection={<IconShield size={14} />}
                                  onClick={() => {
                                    setRoleChangeData({
                                      userId: user.id,
                                      newRole: user.role,
                                    });
                                    openRole();
                                  }}
                                >
                                  Change Role
                                </Menu.Item>
                                
                                <Menu.Divider />
                                
                                <Menu.Item
                                  color="red"
                                  leftSection={<IconTrash size={14} />}
                                  onClick={() => {
                                    setDeleteConfirmUser(user);
                                    openDelete();
                                  }}
                                >
                                  Delete User
                                </Menu.Item>
                              </Menu.Dropdown>
                            </Menu>
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Table.ScrollContainer>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <Group justify="center" p="md">
                  <Pagination
                    total={pagination.pages}
                    value={pagination.page}
                    onChange={handlePageChange}
                    withEdges
                  />
                </Group>
              )}

              {/* Results summary */}
              <Text size="sm" c="dimmed" ta="center" pb="md">
                Showing {users.length} of {pagination.total} users
              </Text>
            </>
          )}
        </Paper>
      )}

      {/* Add Employee Modal */}
      <Modal 
        opened={openedAddEmployee} 
        onClose={closeAddEmployee} 
        title="Add New Employee" 
        size="xl"
      >
        <Stack>
          <Grid>
            <Grid.Col span={6}>
              <TextInput
                label="First Name"
                placeholder="Enter first name"
                required
                value={newEmployee.firstName}
                onChange={(e) => setNewEmployee({ ...newEmployee, firstName: e.target.value })}
                leftSection={<IconUserCircle size={16} />}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Last Name"
                placeholder="Enter last name"
                required
                value={newEmployee.lastName}
                onChange={(e) => setNewEmployee({ ...newEmployee, lastName: e.target.value })}
                leftSection={<IconUserCircle size={16} />}
              />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={6}>
              <TextInput
                label="Email"
                placeholder="employee@company.com"
                required
                value={newEmployee.email}
                onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                leftSection={<IconAt size={16} />}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Phone"
                placeholder="+251 911 234 567"
                value={newEmployee.phone}
                onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                leftSection={<IconPhoneCall size={16} />}
              />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={6}>
              <PasswordInput
                label="Password"
                placeholder="Enter password"
                required
                value={newEmployee.password}
                onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                leftSection={<IconLock size={16} />}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <PasswordInput
                label="Confirm Password"
                placeholder="Confirm password"
                required
                value={newEmployee.confirmPassword}
                onChange={(e) => setNewEmployee({ ...newEmployee, confirmPassword: e.target.value })}
                leftSection={<IconLock size={16} />}
              />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={6}>
              <Select
                label="Role"
                placeholder="Select role"
                required
                data={[
                  { value: 'admin', label: 'Admin' },
                  { value: 'receptionist', label: 'Receptionist' },
                  { value: 'cashier', label: 'Cashier' },
                  { value: 'designer', label: 'Designer' },
                  { value: 'printer', label: 'Printer' },
                ]}
                value={newEmployee.role}
                onChange={(value) => setNewEmployee({ 
                  ...newEmployee, 
                  role: value as 'admin' | 'receptionist' | 'cashier' | 'designer' | 'printer' 
                })}
                leftSection={<IconShield size={16} />}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Department"
                placeholder="Select department"
                required
                data={departments}
                value={newEmployee.department}
                onChange={(value) => setNewEmployee({ ...newEmployee, department: value || '' })}
                leftSection={<IconBuildingCommunity size={16} />}
              />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={6}>
              <TextInput
                label="Position"
                placeholder="e.g., Senior Designer"
                required
                value={newEmployee.position}
                onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                leftSection={<IconBriefcase size={16} />}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Hire Date"
                type="date"
                required
                value={newEmployee.hireDate}
                onChange={(e) => setNewEmployee({ ...newEmployee, hireDate: e.target.value })}
                leftSection={<IconCalendarEvent size={16} />}
              />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={6}>
              <NumberInput
                label="Salary"
                placeholder="Enter salary"
                value={newEmployee.salary ? parseFloat(newEmployee.salary) : ''}
                onChange={(value) => setNewEmployee({ ...newEmployee, salary: value?.toString() || '' })}
                leftSection={<IconCoin size={16} />}
                decimalScale={2}
                thousandSeparator=","
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="ID Card Number"
                placeholder="Enter ID card number"
                value={newEmployee.idCardNumber}
                onChange={(e) => setNewEmployee({ ...newEmployee, idCardNumber: e.target.value })}
                leftSection={<IconId size={16} />}
              />
            </Grid.Col>
          </Grid>

          <Divider label="Bank Details" labelPosition="center" />

          <Grid>
            <Grid.Col span={6}>
              <TextInput
                label="Bank Account Number"
                placeholder="Enter bank account number"
                value={newEmployee.bankAccountNumber}
                onChange={(e) => setNewEmployee({ ...newEmployee, bankAccountNumber: e.target.value })}
                leftSection={<IconCoin size={16} />}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Bank Name"
                placeholder="Enter bank name"
                value={newEmployee.bankName}
                onChange={(e) => setNewEmployee({ ...newEmployee, bankName: e.target.value })}
                leftSection={<IconBuilding size={16} />}
              />
            </Grid.Col>
          </Grid>

          <Divider label="Emergency Contact" labelPosition="center" />
          
          <Grid>
            <Grid.Col span={6}>
              <TextInput
                label="Contact Name"
                placeholder="Emergency contact name"
                value={newEmployee.emergencyContactName}
                onChange={(e) => setNewEmployee({ ...newEmployee, emergencyContactName: e.target.value })}
                leftSection={<IconHeartbeat size={16} />}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Contact Phone"
                placeholder="Emergency contact phone"
                value={newEmployee.emergencyContactPhone}
                onChange={(e) => setNewEmployee({ ...newEmployee, emergencyContactPhone: e.target.value })}
                leftSection={<IconPhone size={16} />}
              />
            </Grid.Col>
          </Grid>

          <TextInput
            label="Relationship"
            placeholder="e.g., Spouse, Parent"
            value={newEmployee.emergencyContactRelation}
            onChange={(e) => setNewEmployee({ ...newEmployee, emergencyContactRelation: e.target.value })}
          />

          <Divider label="Address" labelPosition="center" />

          <TextInput
            label="Address"
            placeholder="Street address"
            value={newEmployee.address}
            onChange={(e) => setNewEmployee({ ...newEmployee, address: e.target.value })}
            leftSection={<IconHome size={16} />}
          />

          <TextInput
            label="City"
            placeholder="City"
            value={newEmployee.city}
            onChange={(e) => setNewEmployee({ ...newEmployee, city: e.target.value })}
            leftSection={<IconMapPin size={16} />}
          />

          <Alert color="blue" title="Information" mt="md">
            A temporary password will be sent to the employee&apos;s email.
            They will be required to change it on first login.
          </Alert>

          <Group justify="flex-end" mt="xl">
            <Button variant="light" onClick={closeAddEmployee}>Cancel</Button>
            <Button onClick={handleCreateEmployee} color="green">Create Employee</Button>
          </Group>
        </Stack>
      </Modal>

      {/* Edit User Modal */}
      <Modal opened={openedEdit} onClose={closeEdit} title="Edit User" size="lg">
        {editUser && (
          <Stack>
            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="First Name"
                  value={editUser.first_name}
                  onChange={(e) => setEditUser({ ...editUser, first_name: e.target.value })}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Last Name"
                  value={editUser.last_name}
                  onChange={(e) => setEditUser({ ...editUser, last_name: e.target.value })}
                />
              </Grid.Col>
            </Grid>

            <TextInput
              label="Email"
              value={editUser.email}
              disabled
            />

            <TextInput
              label="Phone"
              value={editUser.phone || ''}
              onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })}
            />

            <TextInput
              label="Company"
              value={editUser.company || ''}
              onChange={(e) => setEditUser({ ...editUser, company: e.target.value })}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={closeEdit}>Cancel</Button>
              <Button onClick={handleUpdateUser}>Save Changes</Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Change Role Modal */}
      <Modal opened={openedRole} onClose={closeRole} title="Change User Role" size="md">
        <Stack>
          <Select
            label="New Role"
            data={[
              { value: 'admin', label: 'Admin' },
              { value: 'receptionist', label: 'Receptionist' },
              { value: 'cashier', label: 'Cashier' },
              { value: 'designer', label: 'Designer' },
              { value: 'printer', label: 'Printer' },
              { value: 'customer', label: 'Customer' },
            ]}
            value={roleChangeData.newRole}
            onChange={(value) => setRoleChangeData({
              ...roleChangeData,
              newRole: value as 'admin' | 'receptionist' | 'cashier' | 'designer' | 'printer' | 'customer',
            })}
          />

          <Alert color="yellow" title="Warning">
            Changing user role affects their permissions in the system.
          </Alert>

          <Group justify="flex-end">
            <Button variant="light" onClick={closeRole}>Cancel</Button>
            <Button onClick={handleRoleChange}>Update Role</Button>
          </Group>
        </Stack>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal opened={openedDelete} onClose={closeDelete} title="Confirm Deletion" size="md">
        {deleteConfirmUser && (
          <Stack>
            <Text>
              Are you sure you want to delete user{' '}
              <strong>{deleteConfirmUser.first_name} {deleteConfirmUser.last_name}</strong>?
              This action cannot be undone.
            </Text>

            <Alert color="red" title="Warning">
              This will permanently delete the user account and remove all associated data.
            </Alert>

            <Group justify="flex-end">
              <Button variant="light" onClick={closeDelete}>Cancel</Button>
              <Button color="red" onClick={handleDeleteUser}>Delete User</Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Bulk Actions Modal */}
      <Modal opened={openedBulk} onClose={closeBulk} title="Bulk Actions" size="md">
        <Stack>
          <Text size="sm">
            Selected {selectedUsers.length} user(s). Choose an action:
          </Text>

          <Grid>
            <Grid.Col span={4}>
              <Button
                fullWidth
                variant="light"
                color="green"
                leftSection={<IconUserCheck size={16} />}
                onClick={() => {
                  setBulkAction('activate');
                  handleBulkAction();
                }}
              >
                Activate
              </Button>
            </Grid.Col>
            <Grid.Col span={4}>
              <Button
                fullWidth
                variant="light"
                color="yellow"
                leftSection={<IconUserOff size={16} />}
                onClick={() => {
                  setBulkAction('deactivate');
                  handleBulkAction();
                }}
              >
                Deactivate
              </Button>
            </Grid.Col>
            <Grid.Col span={4}>
              <Button
                fullWidth
                variant="light"
                color="red"
                leftSection={<IconTrash size={16} />}
                onClick={() => {
                  setBulkAction('delete');
                  handleBulkAction();
                }}
              >
                Delete
              </Button>
            </Grid.Col>
          </Grid>

          <Group justify="flex-end">
            <Button variant="light" onClick={closeBulk}>Cancel</Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}