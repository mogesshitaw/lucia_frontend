/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useCallback } from 'react';
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
  Alert,
  Pagination,
  Tooltip,
  Card,
  ThemeIcon,
  SimpleGrid,
  Loader,
  Center,
  Textarea,
  NumberInput,
  Progress,
  Tabs,
  Divider,
  MultiSelect,
  Checkbox,
  Radio,
  Timeline,
  Spoiler,
  Combobox,
  InputBase,
  useCombobox,
} from '@mantine/core';
import {
  IconSearch,
  IconEye,
  IconEdit,
  IconTrash,
  IconUserPlus,
  IconMail,
  IconPhone,
  IconCurrencyDollar,
  IconTag,
  IconSourceCode,
  IconChartLine,
  IconCheck,
  IconX,
  IconClock,
  IconRefresh,
  IconExclamationCircle,
  IconDotsVertical,
  IconDownload,
  IconUpload,
  IconBrandWhatsapp,
  IconBrandTelegram,
  IconMessage,
  IconFilter,
  IconHistory,
  IconNote,
  IconStar,
  IconFileExport,
  IconFileImport,
  IconBell,
  IconPlus,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import Link from 'next/link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { DatePickerInput } from '@mantine/dates';

// Extend dayjs with relativeTime plugin
dayjs.extend(relativeTime);

interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  source: 'website' | 'referral' | 'social' | 'email' | 'call' | 'walk_in' | 'other';
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  score: number;
  tags: string[];
  notes: Note[];
  estimatedValue: number;
  probability: number;
  expectedCloseDate: string | null;
  assignedTo: {
    id: string;
    name: string;
    avatar: string;
  } | null;
  lastContact: string | null;
  nextFollowUp: string | null;
  createdAt: string;
  updatedAt: string;
  convertedToCustomer: boolean;
  convertedAt: string | null;
  activities: Activity[];
}

interface Note {
  id: string;
  content: string;
  createdBy: string;
  createdAt: string;
  type: 'note' | 'call' | 'email' | 'meeting';
}

interface Activity {
  id: string;
  type: 'status_change' | 'note_added' | 'contact' | 'email_sent' | 'call_made' | 'meeting_scheduled';
  description: string;
  createdAt: string;
  createdBy: string;
}

interface LeadStats {
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  proposal: number;
  negotiation: number;
  won: number;
  lost: number;
  totalValue: number;
  conversionRate: number;
  avgScore: number;
  avgResponseTime: number;
  leadsBySource: Record<string, number>;
  leadsByPriority: Record<string, number>;
}

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

const leadSources = [
  { value: 'website', label: 'Website', color: 'blue' },
  { value: 'referral', label: 'Referral', color: 'green' },
  { value: 'social', label: 'Social Media', color: 'violet' },
  { value: 'email', label: 'Email Campaign', color: 'cyan' },
  { value: 'call', label: 'Phone Call', color: 'orange' },
  { value: 'walk_in', label: 'Walk-in', color: 'grape' },
  { value: 'other', label: 'Other', color: 'gray' },
];

const leadStatuses = [
  { value: 'new', label: 'New', color: 'blue' },
  { value: 'contacted', label: 'Contacted', color: 'cyan' },
  { value: 'qualified', label: 'Qualified', color: 'green' },
  { value: 'proposal', label: 'Proposal', color: 'yellow' },
  { value: 'negotiation', label: 'Negotiation', color: 'orange' },
  { value: 'won', label: 'Won', color: 'grape' },
  { value: 'lost', label: 'Lost', color: 'red' },
];

const priorityColors = {
  low: 'blue',
  medium: 'yellow',
  high: 'orange',
  urgent: 'red',
};

// Custom Tag Combobox Component for creating new tags
function TagCombobox({ 
  value, 
  onChange, 
  availableTags, 
  setAvailableTags,
  label,
  placeholder 
}: { 
  value: string[]; 
  onChange: (value: string[]) => void; 
  availableTags: string[];
  setAvailableTags: React.Dispatch<React.SetStateAction<string[]>>;
  label: string;
  placeholder: string;
}) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [search, setSearch] = useState('');

  const exactOptionMatch = availableTags.some((item) => item === search);
  const filteredOptions = exactOptionMatch
    ? availableTags
    : availableTags.filter((item) => item.toLowerCase().includes(search.toLowerCase().trim()));

  const options = filteredOptions.map((item) => (
    <Combobox.Option value={item} key={item}>
      <Group gap="xs">
        <Checkbox
          checked={value.includes(item)}
          onChange={() => {}}
          aria-hidden
          tabIndex={-1}
          style={{ pointerEvents: 'none' }}
        />
        <span>{item}</span>
      </Group>
    </Combobox.Option>
  ));

  const handleValueSelect = (val: string) => {
    const newValue = value.includes(val)
      ? value.filter((v) => v !== val)
      : [...value, val];
    onChange(newValue);
  };

  const handleCreateTag = () => {
    const newTag = search.trim();
    if (newTag && !availableTags.includes(newTag)) {
      setAvailableTags((prev) => [...prev, newTag]);
      onChange([...value, newTag]);
    }
    setSearch('');
    combobox.closeDropdown();
  };

  const selectedTags = value.map((tag) => (
    <Badge key={tag} variant="light" size="sm" mr="xs">
      {tag}
    </Badge>
  ));

  return (
    <Stack gap="xs">
      <Text size="sm" fw={500}>{label}</Text>
      <Combobox store={combobox} onOptionSubmit={handleValueSelect}>
        <Combobox.Target>
          <InputBase
            component="button"
            type="button"
            pointer
            rightSection={<Combobox.Chevron />}
            onClick={() => combobox.toggleDropdown()}
            rightSectionPointerEvents="none"
            multiline
          >
            {value.length > 0 ? (
              <Group gap={4} mt={4}>
                {selectedTags}
              </Group>
            ) : (
              <span style={{ color: '#868e96' }}>{placeholder}</span> // Fixed: Use span instead of InputBase.Placeholder
            )}
          </InputBase>
        </Combobox.Target>

        <Combobox.Dropdown>
          <Combobox.Search
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
            placeholder="Search tags"
          />
          <Combobox.Options>
            {options}
            {!exactOptionMatch && search.trim().length > 0 && (
              <Combobox.Option value={search} onClick={handleCreateTag}>
                <Group gap="xs">
                  <IconPlus size={14} />
                  <span>Create &quot;{search}&quot;</span>
                </Group>
              </Combobox.Option>
            )}
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    </Stack>
  );
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    source: '',
    priority: '',
    assignedTo: '',
    tags: [] as string[],
    dateRange: [null, null] as [string | null, string | null],
    minValue: '',
    maxValue: '',
  });
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  
  const [openedAdd, { open: openAdd, close: closeAdd }] = useDisclosure(false);
  const [openedEdit, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [openedView, { open: openView, close: closeView }] = useDisclosure(false);
  const [openedDelete, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [openedConvert, { open: openConvert, close: closeConvert }] = useDisclosure(false);
  const [openedNotes, { open: openNotes, close: closeNotes }] = useDisclosure(false);
  const [openedBulk, { open: openBulk, close: closeBulk }] = useDisclosure(false);
  const [openedExport, { open: openExport, close: closeExport }] = useDisclosure(false);
  const [openedImport, { open: openImport, close: closeImport }] = useDisclosure(false);
  const [openedActivity, { open: openActivity, close: closeActivity }] = useDisclosure(false);

  const [newLead, setNewLead] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    source: 'website' as const,
    priority: 'medium' as const,
    tags: [] as string[],
    notes: '',
    estimatedValue: 0,
    probability: 50,
    assignedTo: '',
  });

  const [newNote, setNewNote] = useState({
    content: '',
    type: 'note' as const,
  });

  const [bulkAction, setBulkAction] = useState({
    status: '',
    priority: '',
    assignedTo: '',
    tags: [] as string[],
  });

  // Fetch leads with filters
  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      // Add basic pagination
      params.append('page', page.toString());
      params.append('limit', '10');
      
      // Add filters only if they have values
      if (filters.search) {
        params.append('search', filters.search);
      }
      
      if (filters.status) {
        params.append('status', filters.status);
      }
      
      if (filters.source) {
        params.append('source', filters.source);
      }
      
      if (filters.priority) {
        params.append('priority', filters.priority);
      }
      
      if (filters.assignedTo) {
        params.append('assignedTo', filters.assignedTo);
      }
      
      if (filters.minValue) {
        params.append('minValue', filters.minValue);
      }
      
      if (filters.maxValue) {
        params.append('maxValue', filters.maxValue);
      }
      
      // Add active tab filter
      if (activeTab && activeTab !== 'all') {
        params.append('status', activeTab);
      }
      
      // Add tags if any
      if (filters.tags.length > 0) {
        params.append('tags', filters.tags.join(','));
      }
      
      // Add date range if both dates are present
      if (filters.dateRange[0] && filters.dateRange[1]) {
        params.append('startDate', filters.dateRange[0]);
        params.append('endDate', filters.dateRange[1]);
      }

      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/leads?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      const data = await response.json();
      if (data.success) {
        setLeads(data.data.leads);
        setTotalPages(data.data.pagination.pages);
      }
    } catch (error) {
      console.error('Failed to fetch leads:', error);
      setError('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  }, [page, filters, activeTab]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/leads/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  }, []);

  // Fetch team members
  const fetchTeamMembers = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users?role=sales`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setTeamMembers(data.data.users);
      }
    } catch (error) {
      console.error('Failed to fetch team members:', error);
    }
  }, []);

  // Fetch available tags
  const fetchTags = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/leads/tags`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setAvailableTags(data.data.tags);
      }
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchLeads();
    fetchStats();
    fetchTeamMembers();
    fetchTags();
  }, [fetchLeads, fetchStats, fetchTeamMembers, fetchTags]);

  // Add new lead
  const handleAddLead = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/leads`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newLead),
      });
      const data = await response.json();
      if (data.success) {
        notifications.show({
          title: 'Success',
          message: 'Lead added successfully',
          color: 'green',
        });
        closeAdd();
        fetchLeads();
        fetchStats();
        setNewLead({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          company: '',
          position: '',
          source: 'website',
          priority: 'medium',
          tags: [],
          notes: '',
          estimatedValue: 0,
          probability: 50,
          assignedTo: '',
        });
      }
    } catch (error) {
      console.error('Failed to add lead:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to add lead',
        color: 'red',
      });
    }
  };

  // Update lead
  const handleUpdateLead = async () => {
    if (!selectedLead) return;
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/leads/${selectedLead.id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(selectedLead),
        }
      );
      const data = await response.json();
      if (data.success) {
        notifications.show({
          title: 'Success',
          message: 'Lead updated successfully',
          color: 'green',
        });
        closeEdit();
        fetchLeads();
      }
    } catch (error) {
      console.error('Failed to update lead:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to update lead',
        color: 'red',
      });
    }
  };

  // Delete lead
  const handleDeleteLead = async () => {
    if (!selectedLead) return;
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/leads/${selectedLead.id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (data.success) {
        notifications.show({
          title: 'Success',
          message: 'Lead deleted successfully',
          color: 'green',
        });
        closeDelete();
        fetchLeads();
        fetchStats();
      }
    } catch (error) {
      console.error('Failed to delete lead:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to delete lead',
        color: 'red',
      });
    }
  };

  // Convert lead to customer
  const handleConvertToCustomer = async () => {
    if (!selectedLead) return;
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/leads/${selectedLead.id}/convert`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (data.success) {
        notifications.show({
          title: 'Success',
          message: 'Lead converted to customer successfully',
          color: 'green',
        });
        closeConvert();
        fetchLeads();
        fetchStats();
      }
    } catch (error) {
      console.error('Failed to convert lead:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to convert lead',
        color: 'red',
      });
    }
  };

  // Update lead status
  const handleStatusChange = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/leads/${id}/status`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        }
      );
      const data = await response.json();
      if (data.success) {
        notifications.show({
          title: 'Success',
          message: `Lead status updated to ${leadStatuses.find(s => s.value === status)?.label}`,
          color: 'green',
        });
        fetchLeads();
        fetchStats();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to update status',
        color: 'red',
      });
    }
  };

  // Add note to lead
  const handleAddNote = async () => {
    if (!selectedLead || !newNote.content) return;
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/leads/${selectedLead.id}/notes`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newNote),
        }
      );
      const data = await response.json();
      if (data.success) {
        notifications.show({
          title: 'Success',
          message: 'Note added successfully',
          color: 'green',
        });
        closeNotes();
        fetchLeads();
        setNewNote({ content: '', type: 'note' });
      }
    } catch (error) {
      console.error('Failed to add note:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to add note',
        color: 'red',
      });
    }
  };

  // Bulk update leads
  const handleBulkUpdate = async () => {
    if (selectedLeads.length === 0) return;
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/leads/bulk`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            leadIds: selectedLeads,
            ...bulkAction,
          }),
        }
      );
      const data = await response.json();
      if (data.success) {
        notifications.show({
          title: 'Success',
          message: `Updated ${selectedLeads.length} leads successfully`,
          color: 'green',
        });
        closeBulk();
        setSelectedLeads([]);
        setBulkAction({ status: '', priority: '', assignedTo: '', tags: [] });
        fetchLeads();
      }
    } catch (error) {
      console.error('Failed to bulk update leads:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to update leads',
        color: 'red',
      });
    }
  };

  // Export leads
  const handleExport = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/leads/export?format=csv`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads-export-${dayjs().format('YYYY-MM-DD')}.csv`;
      a.click();
      
      notifications.show({
        title: 'Success',
        message: 'Leads exported successfully',
        color: 'green',
      });
      closeExport();
    } catch (error) {
      console.error('Failed to export leads:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to export leads',
        color: 'red',
      });
    }
  };

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'yellow';
    if (score >= 40) return 'orange';
    return 'red';
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = leadStatuses.find(s => s.value === status);
    return (
      <Badge color={statusConfig?.color || 'gray'}>
        {statusConfig?.label || status}
      </Badge>
    );
  };

  // Get source badge
  const getSourceBadge = (source: string) => {
    const sourceConfig = leadSources.find(s => s.value === source);
    return (
      <Badge color={sourceConfig?.color || 'gray'} variant="light">
        {sourceConfig?.label || source}
      </Badge>
    );
  };

  // Toggle lead selection
  const toggleLeadSelection = (leadId: string) => {
    setSelectedLeads(prev =>
      prev.includes(leadId)
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  // Select all leads
  const toggleSelectAll = () => {
    if (selectedLeads.length === leads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(leads.map(lead => lead.id));
    }
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      source: '',
      priority: '',
      assignedTo: '',
      tags: [],
      dateRange: [null, null],
      minValue: '',
      maxValue: '',
    });
    setPage(1);
  };

  if (loading && leads.length === 0) {
    return (
      <Center h="100vh">
        <Loader size="lg" />
      </Center>
    );
  }

  return (
    <Container size="xl" py="xl">
      {/* Header */}
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2}>Lead Management</Title>
          <Text c="dimmed" size="sm">
            Track and manage your sales pipeline
          </Text>
        </div>
        <Group>
          {selectedLeads.length > 0 && (
            <>
              <Badge size="lg" color="blue">{selectedLeads.length} selected</Badge>
              <Button
                variant="light"
                leftSection={<IconEdit size={16} />}
                onClick={openBulk}
              >
                Bulk Edit
              </Button>
            </>
          )}
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Button variant="light">Actions</Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<IconFileExport size={14} />} onClick={openExport}>
                Export
              </Menu.Item>
              <Menu.Item leftSection={<IconFileImport size={14} />} onClick={openImport}>
                Import
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <Button
            variant="gradient"
            gradient={{ from: 'blue', to: 'cyan' }}
            leftSection={<IconUserPlus size={16} />}
            onClick={openAdd}
          >
            Add Lead
          </Button>
        </Group>
      </Group>

      {/* Stats Cards */}
      {stats && (
        <SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 8 }} mb="xl">
          <Card withBorder padding="sm">
            <Text size="xs" c="dimmed">Total</Text>
            <Text fw={700} size="xl">{stats.total}</Text>
          </Card>
          <Card withBorder padding="sm">
            <Text size="xs" c="dimmed">New</Text>
            <Text fw={700} size="xl" c="blue">{stats.new}</Text>
          </Card>
          <Card withBorder padding="sm">
            <Text size="xs" c="dimmed">Contacted</Text>
            <Text fw={700} size="xl" c="cyan">{stats.contacted}</Text>
          </Card>
          <Card withBorder padding="sm">
            <Text size="xs" c="dimmed">Qualified</Text>
            <Text fw={700} size="xl" c="green">{stats.qualified}</Text>
          </Card>
          <Card withBorder padding="sm">
            <Text size="xs" c="dimmed">Proposal</Text>
            <Text fw={700} size="xl" c="yellow">{stats.proposal || 0}</Text>
          </Card>
          <Card withBorder padding="sm">
            <Text size="xs" c="dimmed">Negotiation</Text>
            <Text fw={700} size="xl" c="orange">{stats.negotiation || 0}</Text>
          </Card>
          <Card withBorder padding="sm">
            <Text size="xs" c="dimmed">Won</Text>
            <Text fw={700} size="xl" c="grape">{stats.won}</Text>
          </Card>
          <Card withBorder padding="sm">
            <Text size="xs" c="dimmed">Value</Text>
            <Text fw={700} size="xl">${(stats.totalValue / 1000).toFixed(1)}K</Text>
          </Card>
        </SimpleGrid>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onChange={setActiveTab} mb="lg">
        <Tabs.List>
          <Tabs.Tab value="all">All Leads</Tabs.Tab>
          <Tabs.Tab value="new">New</Tabs.Tab>
          <Tabs.Tab value="contacted">Contacted</Tabs.Tab>
          <Tabs.Tab value="qualified">Qualified</Tabs.Tab>
          <Tabs.Tab value="proposal">Proposal</Tabs.Tab>
          <Tabs.Tab value="negotiation">Negotiation</Tabs.Tab>
          <Tabs.Tab value="won">Won</Tabs.Tab>
          <Tabs.Tab value="lost">Lost</Tabs.Tab>
        </Tabs.List>
      </Tabs>

      {/* Search and Filters */}
      <Paper withBorder p="md" mb="lg">
        <Stack>
          <Group>
            <TextInput
              placeholder="Search leads..."
              leftSection={<IconSearch size={16} />}
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              style={{ flex: 1 }}
            />
            <Button
              variant={showFilters ? 'filled' : 'light'}
              leftSection={<IconFilter size={16} />}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters
            </Button>
            {(filters.status || filters.source || filters.priority || filters.tags.length > 0) && (
              <Button variant="subtle" onClick={clearFilters}>
                Clear
              </Button>
            )}
          </Group>

          {showFilters && (
            <Grid>
              <Grid.Col span={{ base: 12, md: 3 }}>
                <Select
                  label="Status"
                  placeholder="All statuses"
                  clearable
                  data={leadStatuses}
                  value={filters.status}
                  onChange={(value) => setFilters({ ...filters, status: value || '' })}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 3 }}>
                <Select
                  label="Source"
                  placeholder="All sources"
                  clearable
                  data={leadSources}
                  value={filters.source}
                  onChange={(value) => setFilters({ ...filters, source: value || '' })}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 3 }}>
                <Select
                  label="Priority"
                  placeholder="All priorities"
                  clearable
                  data={[
                    { value: 'low', label: 'Low' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'high', label: 'High' },
                    { value: 'urgent', label: 'Urgent' },
                  ]}
                  value={filters.priority}
                  onChange={(value) => setFilters({ ...filters, priority: value || '' })}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 3 }}>
                <Select
                  label="Assigned To"
                  placeholder="Anyone"
                  clearable
                  data={teamMembers.map(m => ({ value: m.id, label: m.name }))}
                  value={filters.assignedTo}
                  onChange={(value) => setFilters({ ...filters, assignedTo: value || '' })}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TagCombobox
                  label="Tags"
                  placeholder="Filter by tags"
                  value={filters.tags}
                  onChange={(value) => setFilters({ ...filters, tags: value })}
                  availableTags={availableTags}
                  setAvailableTags={setAvailableTags}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <DatePickerInput
                  type="range"
                  label="Date Range"
                  placeholder="Select date range"
                  value={filters.dateRange}
                  onChange={(value) => setFilters({ ...filters, dateRange: value })}
                  clearable
                />
              </Grid.Col>
            </Grid>
          )}
        </Stack>
      </Paper>

      {/* Leads Table */}
      <Paper withBorder>
        {leads.length === 0 ? (
          <Center p="xl">
            <Stack align="center">
              <IconUserPlus size={48} color="gray" />
              <Text size="lg" fw={500}>No leads found</Text>
              <Button onClick={openAdd}>Add your first lead</Button>
            </Stack>
          </Center>
        ) : (
          <>
            <Table.ScrollContainer minWidth={1400}>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th style={{ width: 40 }}>
                      <Checkbox
                        checked={selectedLeads.length === leads.length}
                        indeterminate={selectedLeads.length > 0 && selectedLeads.length < leads.length}
                        onChange={toggleSelectAll}
                      />
                    </Table.Th>
                    <Table.Th>Lead</Table.Th>
                    <Table.Th>Contact</Table.Th>
                    <Table.Th>Source</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Priority</Table.Th>
                    <Table.Th>Score</Table.Th>
                    <Table.Th>Value</Table.Th>
                    <Table.Th>Next Follow-up</Table.Th>
                    <Table.Th>Assigned To</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {leads.map((lead) => (
                    <Table.Tr key={lead.id}>
                      <Table.Td>
                        <Checkbox
                          checked={selectedLeads.includes(lead.id)}
                          onChange={() => toggleLeadSelection(lead.id)}
                        />
                      </Table.Td>
                      <Table.Td>
                        <Group gap="sm">
                          <Avatar
                            size="md"
                            name={`${lead.firstName} ${lead.lastName}`}
                            color="initials"
                          />
                          <div>
                            <Text fw={500}>
                              {lead.firstName} {lead.lastName}
                            </Text>
                            <Text size="xs" c="dimmed">{lead.position || 'No position'}</Text>
                            <Text size="xs" c="dimmed">{lead.company || 'No company'}</Text>
                          </div>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Stack gap={4}>
                          <Group gap={4}>
                            <IconMail size={14} />
                            <Text size="sm">{lead.email}</Text>
                          </Group>
                          {lead.phone && (
                            <Group gap={4}>
                              <IconPhone size={14} />
                              <Text size="sm">{lead.phone}</Text>
                            </Group>
                          )}
                        </Stack>
                      </Table.Td>
                      <Table.Td>{getSourceBadge(lead.source)}</Table.Td>
                      <Table.Td>{getStatusBadge(lead.status)}</Table.Td>
                      <Table.Td>
                        <Badge color={priorityColors[lead.priority]}>
                          {lead.priority}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Tooltip label={`Score: ${lead.score}`}>
                          <Progress
                            value={lead.score}
                            color={getScoreColor(lead.score)}
                            size="lg"
                            w={60}
                          />
                        </Tooltip>
                      </Table.Td>
                      <Table.Td>
                        <Text fw={500}>${lead.estimatedValue.toLocaleString()}</Text>
                        <Text size="xs" c="dimmed">{lead.probability}% probability</Text>
                      </Table.Td>
                      <Table.Td>
                        {lead.nextFollowUp ? (
                          <Stack gap={4}>
                            <Text size="sm">{dayjs(lead.nextFollowUp).format('MMM D')}</Text>
                            <Badge size="xs" color="blue">
                              {dayjs(lead.nextFollowUp).fromNow()}
                            </Badge>
                          </Stack>
                        ) : (
                          <Text size="sm" c="dimmed">Not scheduled</Text>
                        )}
                      </Table.Td>
                      <Table.Td>
                        {lead.assignedTo ? (
                          <Group gap="xs">
                            <Avatar src={lead.assignedTo.avatar} size="sm" radius="xl" />
                            <Text size="sm">{lead.assignedTo.name}</Text>
                          </Group>
                        ) : (
                          <Text size="sm" c="dimmed">Unassigned</Text>
                        )}
                      </Table.Td>
                      <Table.Td>
                        <Group gap={4}>
                          <Tooltip label="View Details">
                            <ActionIcon
                              variant="subtle"
                              color="blue"
                              onClick={() => {
                                setSelectedLead(lead);
                                openView();
                              }}
                            >
                              <IconEye size={16} />
                            </ActionIcon>
                          </Tooltip>
                          
                          <Tooltip label="Edit">
                            <ActionIcon
                              variant="subtle"
                              color="green"
                              onClick={() => {
                                setSelectedLead(lead);
                                openEdit();
                              }}
                            >
                              <IconEdit size={16} />
                            </ActionIcon>
                          </Tooltip>
                          
                          <Menu shadow="md" width={200}>
                            <Menu.Target>
                              <ActionIcon variant="subtle">
                                <IconDotsVertical size={16} />
                              </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                              <Menu.Label>Update Status</Menu.Label>
                              {leadStatuses.map((status) => (
                                <Menu.Item
                                  key={status.value}
                                  onClick={() => handleStatusChange(lead.id, status.value)}
                                  leftSection={
                                    <div style={{
                                      width: 8,
                                      height: 8,
                                      borderRadius: '50%',
                                      backgroundColor: `var(--mantine-color-${status.color}-6)`,
                                    }} />
                                  }
                                >
                                  {status.label}
                                </Menu.Item>
                              ))}
                              <Menu.Divider />
                              <Menu.Item
                                leftSection={<IconMessage size={14} />}
                                onClick={() => {
                                  setSelectedLead(lead);
                                  openNotes();
                                }}
                              >
                                Add Note
                              </Menu.Item>
                              <Menu.Item
                                leftSection={<IconHistory size={14} />}
                                onClick={() => {
                                  setSelectedLead(lead);
                                  openActivity();
                                }}
                              >
                                View Activity
                              </Menu.Item>
                              <Menu.Divider />
                              {!lead.convertedToCustomer && (
                                <Menu.Item
                                  color="green"
                                  leftSection={<IconCheck size={14} />}
                                  onClick={() => {
                                    setSelectedLead(lead);
                                    openConvert();
                                  }}
                                >
                                  Convert to Customer
                                </Menu.Item>
                              )}
                              <Menu.Item
                                color="red"
                                leftSection={<IconTrash size={14} />}
                                onClick={() => {
                                  setSelectedLead(lead);
                                  openDelete();
                                }}
                              >
                                Delete
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

            {totalPages > 1 && (
              <Group justify="center" p="md">
                <Pagination
                  total={totalPages}
                  value={page}
                  onChange={setPage}
                  withEdges
                />
              </Group>
            )}
          </>
        )}
      </Paper>

      {/* Add Lead Modal */}
      <Modal opened={openedAdd} onClose={closeAdd} title="Add New Lead" size="lg">
        <Stack>
          <Grid>
            <Grid.Col span={6}>
              <TextInput
                label="First Name"
                required
                value={newLead.firstName}
                onChange={(e) => setNewLead({ ...newLead, firstName: e.target.value })}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Last Name"
                required
                value={newLead.lastName}
                onChange={(e) => setNewLead({ ...newLead, lastName: e.target.value })}
              />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={6}>
              <TextInput
                label="Email"
                required
                type="email"
                value={newLead.email}
                onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Phone"
                value={newLead.phone}
                onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
              />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={6}>
              <TextInput
                label="Company"
                value={newLead.company}
                onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Position"
                value={newLead.position}
                onChange={(e) => setNewLead({ ...newLead, position: e.target.value })}
              />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={6}>
              <Select
                label="Source"
                data={leadSources}
                value={newLead.source}
                onChange={(value) => setNewLead({ ...newLead, source: value as any })}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Priority"
                data={[
                  { value: 'low', label: 'Low' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'high', label: 'High' },
                  { value: 'urgent', label: 'Urgent' },
                ]}
                value={newLead.priority}
                onChange={(value) => setNewLead({ ...newLead, priority: value as any })}
              />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={6}>
              <NumberInput
                label="Estimated Value"
                min={0}
                value={newLead.estimatedValue}
                onChange={(val) => setNewLead({ ...newLead, estimatedValue: Number(val) || 0 })}
                leftSection="$"
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                label="Probability (%)"
                min={0}
                max={100}
                value={newLead.probability}
                onChange={(val) => setNewLead({ ...newLead, probability: Number(val) || 0 })}
              />
            </Grid.Col>
          </Grid>

          <TagCombobox
            label="Tags"
            placeholder="Add tags"
            value={newLead.tags}
            onChange={(value) => setNewLead({ ...newLead, tags: value })}
            availableTags={availableTags}
            setAvailableTags={setAvailableTags}
          />

          <Select
            label="Assign To"
            placeholder="Select team member"
            clearable
            data={teamMembers.map(m => ({ value: m.id, label: m.name }))}
            value={newLead.assignedTo}
            onChange={(value) => setNewLead({ ...newLead, assignedTo: value || '' })}
          />

          <Textarea
            label="Notes"
            value={newLead.notes}
            onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
            minRows={3}
          />

          <Group justify="flex-end">
            <Button variant="light" onClick={closeAdd}>Cancel</Button>
            <Button onClick={handleAddLead}>Add Lead</Button>
          </Group>
        </Stack>
      </Modal>

      {/* View Lead Modal */}
      <Modal opened={openedView} onClose={closeView} title="Lead Details" size="lg">
        {selectedLead && (
          <Stack>
            <Group>
              <Avatar
                size="xl"
                name={`${selectedLead.firstName} ${selectedLead.lastName}`}
                color="initials"
              />
              <div style={{ flex: 1 }}>
                <Group justify="space-between">
                  <Title order={3}>
                    {selectedLead.firstName} {selectedLead.lastName}
                  </Title>
                  {selectedLead.convertedToCustomer && (
                    <Badge color="green" size="lg">Converted to Customer</Badge>
                  )}
                </Group>
                <Text c="dimmed">{selectedLead.position} at {selectedLead.company}</Text>
              </div>
            </Group>

            <Divider />

            <Grid>
              <Grid.Col span={6}>
                <Text fw={500}>Email</Text>
                <Text>{selectedLead.email}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text fw={500}>Phone</Text>
                <Text>{selectedLead.phone || 'Not provided'}</Text>
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={4}>
                <Text fw={500}>Source</Text>
                {getSourceBadge(selectedLead.source)}
              </Grid.Col>
              <Grid.Col span={4}>
                <Text fw={500}>Status</Text>
                {getStatusBadge(selectedLead.status)}
              </Grid.Col>
              <Grid.Col span={4}>
                <Text fw={500}>Priority</Text>
                <Badge color={priorityColors[selectedLead.priority]}>
                  {selectedLead.priority}
                </Badge>
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={6}>
                <Text fw={500}>Lead Score</Text>
                <Group>
                  <Progress
                    value={selectedLead.score}
                    color={getScoreColor(selectedLead.score)}
                    size="lg"
                    style={{ flex: 1 }}
                  />
                  <Text fw={700}>{selectedLead.score}</Text>
                </Group>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text fw={500}>Estimated Value</Text>
                <Text fw={700} size="xl">${selectedLead.estimatedValue.toLocaleString()}</Text>
                <Text size="sm" c="dimmed">{selectedLead.probability}% probability</Text>
              </Grid.Col>
            </Grid>

            {selectedLead.tags.length > 0 && (
              <>
                <Divider />
                <Text fw={500}>Tags</Text>
                <Group>
                  {selectedLead.tags.map(tag => (
                    <Badge key={tag} variant="light">{tag}</Badge>
                  ))}
                </Group>
              </>
            )}

            {selectedLead.assignedTo && (
              <>
                <Divider />
                <Text fw={500}>Assigned To</Text>
                <Group>
                  <Avatar src={selectedLead.assignedTo.avatar} size="sm" radius="xl" />
                  <Text>{selectedLead.assignedTo.name}</Text>
                </Group>
              </>
            )}

            {selectedLead.notes.length > 0 && (
              <>
                <Divider />
                <Group justify="space-between">
                  <Text fw={500}>Recent Notes</Text>
                  <Button
                    variant="subtle"
                    size="xs"
                    onClick={() => {
                      closeView();
                      openNotes();
                    }}
                  >
                    Add Note
                  </Button>
                </Group>
                <Stack gap="xs">
                  {selectedLead.notes.slice(0, 3).map(note => (
                    <Paper key={note.id} withBorder p="xs">
                      <Group justify="space-between">
                        <Text size="sm">{note.content}</Text>
                        <Text size="xs" c="dimmed">{dayjs(note.createdAt).fromNow()}</Text>
                      </Group>
                    </Paper>
                  ))}
                </Stack>
              </>
            )}

            <Divider />

            <Grid>
              <Grid.Col span={6}>
                <Text fw={500}>Created</Text>
                <Text>{dayjs(selectedLead.createdAt).format('MMMM D, YYYY')}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text fw={500}>Last Contact</Text>
                <Text>{selectedLead.lastContact ? dayjs(selectedLead.lastContact).format('MMMM D, YYYY') : 'Never'}</Text>
              </Grid.Col>
            </Grid>

            {selectedLead.expectedCloseDate && (
              <Grid>
                <Grid.Col span={6}>
                  <Text fw={500}>Expected Close Date</Text>
                  <Text>{dayjs(selectedLead.expectedCloseDate).format('MMMM D, YYYY')}</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text fw={500}>Next Follow-up</Text>
                  <Text>{selectedLead.nextFollowUp ? dayjs(selectedLead.nextFollowUp).format('MMMM D, YYYY') : 'Not scheduled'}</Text>
                </Grid.Col>
              </Grid>
            )}

            <Group justify="flex-end">
              <Button
                variant="light"
                onClick={() => {
                  closeView();
                  openEdit();
                }}
              >
                Edit
              </Button>
              <Button
                variant="light"
                color="blue"
                onClick={() => {
                  closeView();
                  openActivity();
                }}
              >
                View Activity
              </Button>
              {!selectedLead.convertedToCustomer && (
                <Button
                  color="green"
                  onClick={() => {
                    closeView();
                    openConvert();
                  }}
                >
                  Convert to Customer
                </Button>
              )}
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Edit Lead Modal */}
      <Modal opened={openedEdit} onClose={closeEdit} title="Edit Lead" size="lg">
        {selectedLead && (
          <Stack>
            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="First Name"
                  required
                  value={selectedLead.firstName}
                  onChange={(e) => setSelectedLead({ ...selectedLead, firstName: e.target.value })}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Last Name"
                  required
                  value={selectedLead.lastName}
                  onChange={(e) => setSelectedLead({ ...selectedLead, lastName: e.target.value })}
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Email"
                  required
                  type="email"
                  value={selectedLead.email}
                  onChange={(e) => setSelectedLead({ ...selectedLead, email: e.target.value })}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Phone"
                  value={selectedLead.phone}
                  onChange={(e) => setSelectedLead({ ...selectedLead, phone: e.target.value })}
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Company"
                  value={selectedLead.company}
                  onChange={(e) => setSelectedLead({ ...selectedLead, company: e.target.value })}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Position"
                  value={selectedLead.position}
                  onChange={(e) => setSelectedLead({ ...selectedLead, position: e.target.value })}
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={6}>
                <Select
                  label="Source"
                  data={leadSources}
                  value={selectedLead.source}
                  onChange={(value) => setSelectedLead({ ...selectedLead, source: value as any })}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Select
                  label="Priority"
                  data={[
                    { value: 'low', label: 'Low' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'high', label: 'High' },
                    { value: 'urgent', label: 'Urgent' },
                  ]}
                  value={selectedLead.priority}
                  onChange={(value) => setSelectedLead({ ...selectedLead, priority: value as any })}
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={6}>
                <Select
                  label="Status"
                  data={leadStatuses}
                  value={selectedLead.status}
                  onChange={(value) => setSelectedLead({ ...selectedLead, status: value as any })}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Select
                  label="Assign To"
                  placeholder="Select team member"
                  clearable
                  data={teamMembers.map(m => ({ value: m.id, label: m.name }))}
                  value={selectedLead.assignedTo?.id || ''}
                  onChange={(value) => {
                    const assignedUser = teamMembers.find(m => m.id === value);
                    setSelectedLead({
                      ...selectedLead,
                      assignedTo: assignedUser ? { id: assignedUser.id, name: assignedUser.name, avatar: assignedUser.avatar } : null
                    });
                  }}
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={6}>
                <NumberInput
                  label="Estimated Value"
                  min={0}
                  value={selectedLead.estimatedValue}
                  onChange={(val) => setSelectedLead({ ...selectedLead, estimatedValue: Number(val) || 0 })}
                  leftSection="$"
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <NumberInput
                  label="Probability (%)"
                  min={0}
                  max={100}
                  value={selectedLead.probability}
                  onChange={(val) => setSelectedLead({ ...selectedLead, probability: Number(val) || 0 })}
                />
              </Grid.Col>
            </Grid>

            <Grid>
              <Grid.Col span={6}>
                <DatePickerInput
                  label="Expected Close Date"
                  placeholder="Select date"
                  clearable
                  value={selectedLead.expectedCloseDate ? new Date(selectedLead.expectedCloseDate) : null}
                  onChange={(date) => {
                    if (selectedLead) {
                      setSelectedLead({
                        ...selectedLead,
                        expectedCloseDate: date ? date.toString() : null
                      });
                    }
                  }}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <DatePickerInput
                  label="Next Follow-up"
                  placeholder="Select date"
                  clearable
                  value={selectedLead.nextFollowUp ? new Date(selectedLead.nextFollowUp) : null}
                  onChange={(date) => {
                    if (selectedLead) {
                      setSelectedLead({
                        ...selectedLead,
                        nextFollowUp: date ? date.toString() : null
                      });
                    }
                  }}
                />
              </Grid.Col>
            </Grid>

            <TagCombobox
              label="Tags"
              placeholder="Add tags"
              value={selectedLead.tags}
              onChange={(value) => setSelectedLead({ ...selectedLead, tags: value })}
              availableTags={availableTags}
              setAvailableTags={setAvailableTags}
            />

            <Group justify="flex-end">
              <Button variant="light" onClick={closeEdit}>Cancel</Button>
              <Button onClick={handleUpdateLead}>Save Changes</Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Add Note Modal */}
      <Modal opened={openedNotes} onClose={closeNotes} title="Add Note" size="md">
        <Stack>
          <Radio.Group
            label="Note Type"
            value={newNote.type}
            onChange={(value) => setNewNote({ ...newNote, type: value as any })}
          >
            <Group mt="xs">
              <Radio value="note" label="General Note" />
              <Radio value="call" label="Phone Call" />
              <Radio value="email" label="Email" />
              <Radio value="meeting" label="Meeting" />
            </Group>
          </Radio.Group>

          <Textarea
            label="Note"
            placeholder="Enter your note..."
            value={newNote.content}
            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
            minRows={4}
            required
          />

          <Group justify="flex-end">
            <Button variant="light" onClick={closeNotes}>Cancel</Button>
            <Button onClick={handleAddNote}>Add Note</Button>
          </Group>
        </Stack>
      </Modal>

      {/* Activity Modal */}
      <Modal opened={openedActivity} onClose={closeActivity} title="Activity History" size="lg">
        {selectedLead && (
          <Stack>
            {selectedLead.activities && selectedLead.activities.length > 0 ? (
              <Timeline active={selectedLead.activities.length - 1} bulletSize={24} lineWidth={2}>
                {selectedLead.activities.map((activity) => (
                  <Timeline.Item
                    key={activity.id}
                    bullet={
                      <ThemeIcon
                        size={24}
                        radius="xl"
                        color={
                          activity.type === 'status_change' ? 'blue' :
                          activity.type === 'note_added' ? 'green' :
                          activity.type === 'call_made' ? 'orange' :
                          activity.type === 'email_sent' ? 'violet' :
                          'gray'
                        }
                        variant="filled"
                      >
                        {activity.type === 'status_change' ? <IconRefresh size={14} /> :
                         activity.type === 'note_added' ? <IconNote size={14} /> :
                         activity.type === 'call_made' ? <IconPhone size={14} /> :
                         activity.type === 'email_sent' ? <IconMail size={14} /> :
                         <IconClock size={14} />}
                      </ThemeIcon>
                    }
                  >
                    <Text size="sm">{activity.description}</Text>
                    <Text size="xs" c="dimmed">{dayjs(activity.createdAt).format('MMM D, YYYY h:mm A')}</Text>
                  </Timeline.Item>
                ))}
              </Timeline>
            ) : (
              <Text c="dimmed" ta="center">No activity recorded yet</Text>
            )}
          </Stack>
        )}
      </Modal>

      {/* Convert Modal */}
      <Modal opened={openedConvert} onClose={closeConvert} title="Convert to Customer" size="md">
        <Text mb="lg">
          Are you sure you want to convert <b>{selectedLead?.firstName} {selectedLead?.lastName}</b> to a customer?
          This will create a customer account and move the lead to won status.
        </Text>
        <Group justify="flex-end">
          <Button variant="light" onClick={closeConvert}>Cancel</Button>
          <Button color="green" onClick={handleConvertToCustomer}>Convert</Button>
        </Group>
      </Modal>

      {/* Delete Modal */}
      <Modal opened={openedDelete} onClose={closeDelete} title="Delete Lead">
        <Text mb="lg">
          Are you sure you want to delete this lead? This action cannot be undone.
        </Text>
        <Group justify="flex-end">
          <Button variant="light" onClick={closeDelete}>Cancel</Button>
          <Button color="red" onClick={handleDeleteLead}>Delete</Button>
        </Group>
      </Modal>

      {/* Bulk Edit Modal */}
      <Modal opened={openedBulk} onClose={closeBulk} title="Bulk Edit Leads" size="lg">
        <Stack>
          <Text size="sm" c="dimmed">
            You are about to update {selectedLeads.length} leads. Leave fields empty to keep unchanged.
          </Text>

          <Select
            label="Change Status"
            placeholder="Select new status"
            clearable
            data={leadStatuses}
            value={bulkAction.status}
            onChange={(value) => setBulkAction({ ...bulkAction, status: value || '' })}
          />

          <Select
            label="Change Priority"
            placeholder="Select new priority"
            clearable
            data={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
              { value: 'urgent', label: 'Urgent' },
            ]}
            value={bulkAction.priority}
            onChange={(value) => setBulkAction({ ...bulkAction, priority: value || '' })}
          />

          <Select
            label="Reassign To"
            placeholder="Select team member"
            clearable
            data={teamMembers.map(m => ({ value: m.id, label: m.name }))}
            value={bulkAction.assignedTo}
            onChange={(value) => setBulkAction({ ...bulkAction, assignedTo: value || '' })}
          />

          <MultiSelect
            label="Add Tags"
            placeholder="Select tags to add"
            data={availableTags}
            value={bulkAction.tags}
            onChange={(value) => setBulkAction({ ...bulkAction, tags: value })}
            searchable
          />

          <Group justify="flex-end">
            <Button variant="light" onClick={closeBulk}>Cancel</Button>
            <Button color="blue" onClick={handleBulkUpdate}>Update {selectedLeads.length} Leads</Button>
          </Group>
        </Stack>
      </Modal>

      {/* Export Modal */}
      <Modal opened={openedExport} onClose={closeExport} title="Export Leads" size="md">
        <Stack>
          <Text>Choose export format:</Text>
          <Radio.Group>
            <Group mt="xs">
              <Radio value="csv" label="CSV" checked />
              <Radio value="excel" label="Excel" disabled />
              <Radio value="pdf" label="PDF" disabled />
            </Group>
          </Radio.Group>

          <Text size="sm" c="dimmed">
            The export will include all leads matching your current filters.
          </Text>

          <Group justify="flex-end">
            <Button variant="light" onClick={closeExport}>Cancel</Button>
            <Button onClick={handleExport}>Export</Button>
          </Group>
        </Stack>
      </Modal>

      {/* Import Modal */}
      <Modal opened={openedImport} onClose={closeImport} title="Import Leads" size="lg">
        <Stack>
          <Alert icon={<IconExclamationCircle size={16} />} color="blue">
            Please prepare your CSV file with the following columns: first_name, last_name, email, phone, company, position, source, priority
          </Alert>

          <Paper
            withBorder
            p="xl"
            style={{ borderStyle: 'dashed' }}
          >
            <Center>
              <Stack align="center">
                <IconUpload size={48} color="gray" />
                <Text>Drag and drop your CSV file here or click to browse</Text>
                <Button variant="light">Select File</Button>
              </Stack>
            </Center>
          </Paper>

          <Group justify="flex-end">
            <Button variant="light" onClick={closeImport}>Cancel</Button>
            <Button disabled>Import</Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}