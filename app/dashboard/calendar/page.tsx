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
  Modal,
  Stack,
  TextInput,
  Textarea,
  Select,
  Badge,
  Loader,
  Center,
  Card,
  Grid,
  ThemeIcon,
  SimpleGrid,
  Box,
  ActionIcon,
} from '@mantine/core';
import {
  IconCalendar,
  IconCalendarEvent,
  IconClock,
  IconPlus,
  IconEdit,
  IconTrash,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { DatePicker } from '@mantine/dates';
import dayjs from 'dayjs';

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  start: string;
  end: string;
  allDay: boolean;
  type: 'meeting' | 'task' | 'deadline' | 'reminder' | 'holiday';
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  assignedTo: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  recurring: {
    pattern: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endDate: string;
  } | null;
  reminders: { time: number; sent: boolean }[];
  color: string;
}

interface CalendarStats {
  total: number;
  today: number;
  upcoming: number;
  completed: number;
}

const eventColors = {
  meeting: '#228be6',
  task: '#40c057',
  deadline: '#fa5252',
  reminder: '#fd7e14',
  holiday: '#7950f2',
};

const priorityColors = {
  low: 'blue',
  medium: 'yellow',
  high: 'red',
};

// Simple Calendar Grid Component
const SimpleCalendarGrid = ({ 
  currentDate, 
  events, 
  onDateClick,
  onEventClick 
}: { 
  currentDate: Date; 
  events: CalendarEvent[]; 
  onDateClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}) => {
  const startOfMonth = dayjs(currentDate).startOf('month');
  const endOfMonth = dayjs(currentDate).endOf('month');
  const startDay = startOfMonth.day(); // 0 = Sunday, 1 = Monday, etc.
  
  const daysInMonth = endOfMonth.date();
  const days = [];
  
  // Add empty cells for days before month starts
  for (let i = 0; i < startDay; i++) {
    days.push(<Box key={`empty-${i}`} style={{ minHeight: 100 }} />);
  }
  
  // Add cells for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = startOfMonth.date(day);
    const dateStr = date.format('YYYY-MM-DD');
    const dayEvents = events.filter(e => dayjs(e.start).format('YYYY-MM-DD') === dateStr);
    
    days.push(
      <Paper
        key={day}
        withBorder
        p="xs"
        style={{
          minHeight: 100,
          cursor: 'pointer',
          backgroundColor: dateStr === dayjs().format('YYYY-MM-DD') ? '#f0f9ff' : undefined,
        }}
        onClick={() => onDateClick(date.toDate())}
      >
        <Text fw={700} size="sm" mb={4}>{day}</Text>
        <Stack gap={4}>
          {dayEvents.slice(0, 3).map(event => (
            <Badge
              key={event.id}
              color={eventColors[event.type]}
              size="xs"
              style={{ cursor: 'pointer' }}
              onClick={(e) => {
                e.stopPropagation();
                onEventClick(event);
              }}
            >
              {event.title}
            </Badge>
          ))}
          {dayEvents.length > 3 && (
            <Text size="xs" c="dimmed">+{dayEvents.length - 3} more</Text>
          )}
        </Stack>
      </Paper>
    );
  }
  
  return (
    <div>
      {/* Weekday headers */}
      <SimpleGrid cols={7} mb="xs">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <Text key={day} fw={500} size="sm" ta="center">{day}</Text>
        ))}
      </SimpleGrid>
      
      {/* Calendar grid */}
      <SimpleGrid cols={7} spacing="xs">
        {days}
      </SimpleGrid>
    </div>
  );
};

export default function CalendarPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [stats, setStats] = useState<CalendarStats | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState('month');
  
  const [openedAdd, { open: openAdd, close: closeAdd }] = useDisclosure(false);
  const [openedEdit, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [openedView, { open: openView, close: closeView }] = useDisclosure(false);
  const [openedDelete, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    start: new Date().toISOString(),
    end: new Date().toISOString(),
    allDay: false,
    type: 'meeting' as const,
    priority: 'medium' as const,
    assignedTo: [] as string[],
    recurring: null,
    reminders: [] as { time: number; sent: boolean }[],
    color: '#228be6',
  });

  useEffect(() => {
    fetchEvents();
    fetchStats();
  }, [selectedDate, view]);

  const fetchEvents = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const params = new URLSearchParams({
        start: dayjs(selectedDate).startOf('month').toISOString(),
        end: dayjs(selectedDate).endOf('month').toISOString(),
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/calendar/events?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (data.success) {
        setEvents(data.data.events);
      }
    } catch (error) {
      console.log(error);
      setError('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/calendar/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleAddEvent = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/calendar/events`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
      });
      const data = await response.json();
      if (data.success) {
        notifications.show({
          title: 'Success',
          message: 'Event created successfully',
          color: 'green',
        });
        closeAdd();
        fetchEvents();
        fetchStats();
        setNewEvent({
          title: '',
          description: '',
          start: new Date().toISOString(),
          end: new Date().toISOString(),
          allDay: false,
          type: 'meeting',
          priority: 'medium',
          assignedTo: [],
          recurring: null,
          reminders: [],
          color: '#228be6',
        });
      }
    } catch (error) {
      console.log(error);
      notifications.show({
        title: 'Error',
        message: 'Failed to create event',
        color: 'red',
      });
    }
  };

  const handleUpdateEvent = async () => {
    if (!selectedEvent) return;
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/calendar/events/${selectedEvent.id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(selectedEvent),
        }
      );
      const data = await response.json();
      if (data.success) {
        notifications.show({
          title: 'Success',
          message: 'Event updated successfully',
          color: 'green',
        });
        closeEdit();
        fetchEvents();
      }
    } catch (error) {
      console.log(error);
      notifications.show({
        title: 'Error',
        message: 'Failed to update event',
        color: 'red',
      });
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/calendar/events/${selectedEvent.id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (data.success) {
        notifications.show({
          title: 'Success',
          message: 'Event deleted successfully',
          color: 'green',
        });
        closeDelete();
        fetchEvents();
        fetchStats();
      }
    } catch (error) {
      console.log(error);
      notifications.show({
        title: 'Error',
        message: 'Failed to delete event',
        color: 'red',
      });
    }
  };

  const handleDateClick = (date: Date) => {
    setNewEvent({
      ...newEvent,
      start: date.toISOString(),
      end: date.toISOString(),
    });
    openAdd();
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    openView();
  };

  const getTodayEvents = () => {
    const today = dayjs().format('YYYY-MM-DD');
    return events.filter(e => dayjs(e.start).format('YYYY-MM-DD') === today);
  };

  const getUpcomingEvents = () => {
    const now = dayjs();
    return events
      .filter(e => dayjs(e.start).isAfter(now))
      .sort((a, b) => dayjs(a.start).diff(dayjs(b.start)))
      .slice(0, 5);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setSelectedDate(prev => 
      direction === 'prev' 
        ? dayjs(prev).subtract(1, 'month').toDate() 
        : dayjs(prev).add(1, 'month').toDate()
    );
  };

  if (loading) {
    return (
      <Center h="100vh">
        <Loader size="lg" />
      </Center>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" mb="lg">
        <div>
          <Title order={2}>Calendar</Title>
          <Text c="dimmed" size="sm">
            Manage your schedule and events
          </Text>
        </div>
        <Group>
          <Select
            value={view}
            onChange={(value) => setView(value || 'month')}
            data={[
              { value: 'month', label: 'Month' },
              { value: 'week', label: 'Week' },
              { value: 'day', label: 'Day' },
            ]}
            style={{ width: 120 }}
          />
          <Button
            leftSection={<IconPlus size={16} />}
            variant="gradient"
            gradient={{ from: 'blue', to: 'cyan' }}
            onClick={openAdd}
          >
            New Event
          </Button>
        </Group>
      </Group>

      {/* Stats Cards */}
      {stats && (
        <Grid mb="xl">
          <Grid.Col span={{ base: 6, md: 3 }}>
            <Card withBorder>
              <Group justify="space-between">
                <div>
                  <Text size="xs" c="dimmed">Total Events</Text>
                  <Text fw={700} size="xl">{stats.total}</Text>
                </div>
                <ThemeIcon size="lg" color="blue" variant="light">
                  <IconCalendar size={20} />
                </ThemeIcon>
              </Group>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 6, md: 3 }}>
            <Card withBorder>
              <Group justify="space-between">
                <div>
                  <Text size="xs" c="dimmed">Today</Text>
                  <Text fw={700} size="xl">{stats.today}</Text>
                </div>
                <ThemeIcon size="lg" color="green" variant="light">
                  <IconClock size={20} />
                </ThemeIcon>
              </Group>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 6, md: 3 }}>
            <Card withBorder>
              <Group justify="space-between">
                <div>
                  <Text size="xs" c="dimmed">Upcoming</Text>
                  <Text fw={700} size="xl">{stats.upcoming}</Text>
                </div>
                <ThemeIcon size="lg" color="yellow" variant="light">
                  <IconCalendarEvent size={20} />
                </ThemeIcon>
              </Group>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 6, md: 3 }}>
            <Card withBorder>
              <Group justify="space-between">
                <div>
                  <Text size="xs" c="dimmed">Completed</Text>
                  <Text fw={700} size="xl">{stats.completed}</Text>
                </div>
                <ThemeIcon size="lg" color="grape" variant="light">
                  <IconCheck size={20} />
                </ThemeIcon>
              </Group>
            </Card>
          </Grid.Col>
        </Grid>
      )}

      <Grid>
        {/* Calendar */}
        <Grid.Col span={{ base: 12, md: 9 }}>
          <Paper withBorder p="md">
            {/* Calendar Header */}
            <Group justify="space-between" mb="md">
              <Group>
                <ActionIcon variant="subtle" onClick={() => navigateMonth('prev')}>
                  <IconChevronLeft size={18} />
                </ActionIcon>
                <Text fw={500}>{dayjs(selectedDate).format('MMMM YYYY')}</Text>
                <ActionIcon variant="subtle" onClick={() => navigateMonth('next')}>
                  <IconChevronRight size={18} />
                </ActionIcon>
              </Group>
              <Button variant="light" size="xs" onClick={() => setSelectedDate(new Date())}>
                Today
              </Button>
            </Group>

            {/* Calendar Grid */}
            <SimpleCalendarGrid
              currentDate={selectedDate}
              events={events}
              onDateClick={handleDateClick}
              onEventClick={handleEventClick}
            />
          </Paper>
        </Grid.Col>

        {/* Sidebar */}
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Stack>
            {/* Mini Calendar */}
            <Paper withBorder p="md">
          <DatePicker
              value={selectedDate}
              onChange={(date) => {
                if (date) {
                  // If date is a string, convert it to Date object
                  const dateObj = typeof date === 'string' ? new Date(date) : date;
                  setSelectedDate(dateObj);
                }
              }}
            />
            </Paper>

            {/* Today's Events */}
            <Paper withBorder p="md">
              <Title order={5} mb="md">Today&apos;s Events</Title>
              <Stack gap="xs">
                {getTodayEvents().map(event => (
                  <Card
                    key={event.id}
                    withBorder
                    padding="xs"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleEventClick(event)}
                  >
                    <Group gap="xs">
                      <div
                        style={{
                          width: 4,
                          height: 40,
                          backgroundColor: event.color || eventColors[event.type],
                          borderRadius: 2,
                        }}
                      />
                      <div>
                        <Text size="sm" fw={500}>{event.title}</Text>
                        <Text size="xs" c="dimmed">
                          {dayjs(event.start).format('h:mm A')}
                        </Text>
                      </div>
                    </Group>
                  </Card>
                ))}
                {getTodayEvents().length === 0 && (
                  <Text size="sm" c="dimmed" ta="center">
                    No events today
                  </Text>
                )}
              </Stack>
            </Paper>

            {/* Upcoming Events */}
            <Paper withBorder p="md">
              <Title order={5} mb="md">Upcoming</Title>
              <Stack gap="xs">
                {getUpcomingEvents().map(event => (
                  <Group key={event.id} gap="xs">
                    <Badge
                      color={priorityColors[event.priority]}
                      variant="dot"
                    />
                    <div style={{ flex: 1 }}>
                      <Text size="sm">{event.title}</Text>
                      <Text size="xs" c="dimmed">
                        {dayjs(event.start).format('MMM D, h:mm A')}
                      </Text>
                    </div>
                  </Group>
                ))}
              </Stack>
            </Paper>

            {/* Legend */}
            <Paper withBorder p="md">
              <Title order={5} mb="md">Event Types</Title>
              <Stack gap="xs">
                {Object.entries(eventColors).map(([type, color]) => (
                  <Group key={type} gap="xs">
                    <div style={{ width: 12, height: 12, borderRadius: 4, backgroundColor: color }} />
                    <Text size="sm" tt="capitalize">{type}</Text>
                  </Group>
                ))}
              </Stack>
            </Paper>
          </Stack>
        </Grid.Col>
      </Grid>

      {/* Add Event Modal */}
      <Modal opened={openedAdd} onClose={closeAdd} title="Create New Event" size="lg">
        <Stack>
          <TextInput
            label="Title"
            required
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          />
          <Textarea
            label="Description"
            value={newEvent.description}
            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            minRows={3}
          />
          <Grid>
            <Grid.Col span={6}>
              <TextInput
                type="datetime-local"
                label="Start"
                required
                value={dayjs(newEvent.start).format('YYYY-MM-DDTHH:mm')}
                onChange={(e) => setNewEvent({ ...newEvent, start: new Date(e.target.value).toISOString() })}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                type="datetime-local"
                label="End"
                required
                value={dayjs(newEvent.end).format('YYYY-MM-DDTHH:mm')}
                onChange={(e) => setNewEvent({ ...newEvent, end: new Date(e.target.value).toISOString() })}
              />
            </Grid.Col>
          </Grid>
          <Grid>
            <Grid.Col span={6}>
              <Select
                label="Type"
                data={[
                  { value: 'meeting', label: 'Meeting' },
                  { value: 'task', label: 'Task' },
                  { value: 'deadline', label: 'Deadline' },
                  { value: 'reminder', label: 'Reminder' },
                  { value: 'holiday', label: 'Holiday' },
                ]}
                value={newEvent.type}
                onChange={(value) => setNewEvent({ ...newEvent, type: value as any })}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Priority"
                data={[
                  { value: 'low', label: 'Low' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'high', label: 'High' },
                ]}
                value={newEvent.priority}
                onChange={(value) => setNewEvent({ ...newEvent, priority: value as any })}
              />
            </Grid.Col>
          </Grid>
          <TextInput
            type="color"
            label="Color"
            value={newEvent.color}
            onChange={(e) => setNewEvent({ ...newEvent, color: e.target.value })}
          />
          <Group justify="flex-end">
            <Button variant="light" onClick={closeAdd}>Cancel</Button>
            <Button onClick={handleAddEvent}>Create Event</Button>
          </Group>
        </Stack>
      </Modal>

      {/* View Event Modal */}
      <Modal opened={openedView} onClose={closeView} title="Event Details" size="lg">
        {selectedEvent && (
          <Stack>
            <Group>
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 4,
                  backgroundColor: selectedEvent.color || eventColors[selectedEvent.type],
                }}
              />
              <Title order={4}>{selectedEvent.title}</Title>
              <Badge color={priorityColors[selectedEvent.priority]}>
                {selectedEvent.priority} priority
              </Badge>
            </Group>

            <Text size="sm">{selectedEvent.description}</Text>

            <Grid>
              <Grid.Col span={6}>
                <Text size="sm" fw={500}>Start</Text>
                <Text size="sm">{dayjs(selectedEvent.start).format('MMMM D, YYYY h:mm A')}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="sm" fw={500}>End</Text>
                <Text size="sm">{dayjs(selectedEvent.end).format('MMMM D, YYYY h:mm A')}</Text>
              </Grid.Col>
            </Grid>

            <Group>
              <Text size="sm" fw={500}>Status:</Text>
              <Badge
                color={
                  selectedEvent.status === 'completed'
                    ? 'green'
                    : selectedEvent.status === 'in_progress'
                    ? 'blue'
                    : selectedEvent.status === 'cancelled'
                    ? 'red'
                    : 'yellow'
                }
              >
                {selectedEvent.status}
              </Badge>
            </Group>

            <Group justify="flex-end">
              <Button
                variant="light"
                leftSection={<IconEdit size={16} />}
                onClick={() => {
                  closeView();
                  openEdit();
                }}
              >
                Edit
              </Button>
              <Button
                color="red"
                leftSection={<IconTrash size={16} />}
                onClick={() => {
                  closeView();
                  openDelete();
                }}
              >
                Delete
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Edit Event Modal */}
      <Modal opened={openedEdit} onClose={closeEdit} title="Edit Event" size="lg">
        {selectedEvent && (
          <Stack>
            <TextInput
              label="Title"
              value={selectedEvent.title}
              onChange={(e) => setSelectedEvent({ ...selectedEvent, title: e.target.value })}
            />
            <Textarea
              label="Description"
              value={selectedEvent.description}
              onChange={(e) => setSelectedEvent({ ...selectedEvent, description: e.target.value })}
              minRows={3}
            />
            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  type="datetime-local"
                  label="Start"
                  value={dayjs(selectedEvent.start).format('YYYY-MM-DDTHH:mm')}
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, start: new Date(e.target.value).toISOString() })}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  type="datetime-local"
                  label="End"
                  value={dayjs(selectedEvent.end).format('YYYY-MM-DDTHH:mm')}
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, end: new Date(e.target.value).toISOString() })}
                />
              </Grid.Col>
            </Grid>
            <Grid>
              <Grid.Col span={6}>
                <Select
                  label="Type"
                  data={[
                    { value: 'meeting', label: 'Meeting' },
                    { value: 'task', label: 'Task' },
                    { value: 'deadline', label: 'Deadline' },
                    { value: 'reminder', label: 'Reminder' },
                    { value: 'holiday', label: 'Holiday' },
                  ]}
                  value={selectedEvent.type}
                  onChange={(value) => setSelectedEvent({ ...selectedEvent, type: value as any })}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Select
                  label="Priority"
                  data={[
                    { value: 'low', label: 'Low' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'high', label: 'High' },
                  ]}
                  value={selectedEvent.priority}
                  onChange={(value) => setSelectedEvent({ ...selectedEvent, priority: value as any })}
                />
              </Grid.Col>
            </Grid>
            <Select
              label="Status"
              data={[
                { value: 'pending', label: 'Pending' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'completed', label: 'Completed' },
                { value: 'cancelled', label: 'Cancelled' },
              ]}
              value={selectedEvent.status}
              onChange={(value) => setSelectedEvent({ ...selectedEvent, status: value as any })}
            />
            <Group justify="flex-end">
              <Button variant="light" onClick={closeEdit}>Cancel</Button>
              <Button onClick={handleUpdateEvent}>Save Changes</Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal opened={openedDelete} onClose={closeDelete} title="Delete Event">
        <Text mb="lg">
          Are you sure you want to delete &quot;{selectedEvent?.title} &quot;? This action cannot be undone.
        </Text>
        <Group justify="flex-end">
          <Button variant="light" onClick={closeDelete}>Cancel</Button>
          <Button color="red" onClick={handleDeleteEvent}>Delete</Button>
        </Group>
      </Modal>
    </Container>
  );
}