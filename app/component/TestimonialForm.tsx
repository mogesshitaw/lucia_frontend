'use client';

import { useState } from 'react';
import {
  Modal,
  TextInput,
  Textarea,
  Rating,
  Button,
  Group,
  Stack,
  FileInput,
  Alert,
  Text,
  Paper,
  Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconStar, IconCheck, IconX } from '@tabler/icons-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface TestimonialFormProps {
  opened: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function TestimonialForm({ opened, onClose, onSuccess }: TestimonialFormProps) {
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_role: '',
    company: '',
    content: '',
    rating: 5,
    email: '',
    avatar_url: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.customer_name.trim()) {
      newErrors.customer_name = 'Name is required';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Testimonial content is required';
    }
    
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) formDataToSend.append(key, value as string);
    });
    if (avatarFile) {
      formDataToSend.append('avatar', avatarFile);
    }

    try {
      const response = await fetch(`${API_URL}/api/testimonials/submit`, {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        notifications.show({
          title: 'Thank You!',
          message: 'Your testimonial has been submitted and will be reviewed shortly.',
          color: 'green',
          icon: <IconCheck size={16} />,
        });
        
        // Reset form
        setFormData({
          customer_name: '',
          customer_role: '',
          company: '',
          content: '',
          rating: 5,
          email: '',
          avatar_url: '',
        });
        setAvatarFile(null);
        
        onSuccess?.();
        onClose();
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to submit testimonial',
        color: 'red',
        icon: <IconX size={16} />,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group>
          <IconStar size={24} className="text-yellow-500" />
          <Title order={3}>Share Your Experience</Title>
        </Group>
      }
      size="lg"
      radius="lg"
      centered
    >
      <Paper p="md">
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <Alert color="blue" variant="light">
              <Text size="sm">
                Your feedback helps us improve and serves others in choosing the right printing services.
                Thank you for sharing!
              </Text>
            </Alert>

            <TextInput
              label="Your Name"
              placeholder="Enter your full name"
              required
              value={formData.customer_name}
              onChange={(e) => handleChange('customer_name', e.target.value)}
              error={errors.customer_name}
            />

            <TextInput
              label="Your Role (Optional)"
              placeholder="e.g., Business Owner, Marketing Manager"
              value={formData.customer_role}
              onChange={(e) => handleChange('customer_role', e.target.value)}
            />

            <TextInput
              label="Company (Optional)"
              placeholder="Your company or organization"
              value={formData.company}
              onChange={(e) => handleChange('company', e.target.value)}
            />

            <TextInput
              label="Email (Optional)"
              placeholder="For verification purposes"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={errors.email}
            />

            <div>
              <Text size="sm" fw={500} mb={4}>Rating</Text>
              <Rating
                value={formData.rating}
                onChange={(value) => handleChange('rating', value)}
                size="lg"
              />
            </div>

            <Textarea
              label="Your Testimonial"
              placeholder="Tell us about your experience with our services..."
              required
              minRows={4}
              value={formData.content}
              onChange={(e) => handleChange('content', e.target.value)}
              error={errors.content}
            />

            <FileInput
              label="Profile Photo (Optional)"
              placeholder="Upload a photo (JPEG, PNG)"
              accept="image/jpeg,image/png,image/gif,image/webp"
              value={avatarFile}
              onChange={setAvatarFile}
              clearable
            />

            <Text size="xs" c="dimmed">
              Your testimonial will be reviewed before being published. We respect your privacy.
            </Text>

            <Group justify="flex-end">
              <Button variant="light" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" loading={loading} color="blue">
                Submit Testimonial
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Modal>
  );
}