/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import {
  Modal,
  Stack,
  TextInput,
  Textarea,
  Rating,
  Button,
  Group,
  Text,
  Alert,
  FileInput,
  Avatar,
  Center,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX, IconStar, IconUser, IconBuilding, IconBriefcase } from '@tabler/icons-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface TestimonialFormProps {
  opened: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function TestimonialForm({ opened, onClose, onSuccess }: TestimonialFormProps) {
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      customer_name: '',
      customer_role: '',
      company: '',
      content: '',
      rating: 5,
      email: '',
    },
    validate: {
      customer_name: (value) => (value.length < 2 ? 'Name must be at least 2 characters' : null),
      content: (value) => (value.length < 10 ? 'Testimonial must be at least 10 characters' : null),
      email: (value) => {
        if (value && !/^\S+@\S+\.\S+$/.test(value)) {
          return 'Invalid email format';
        }
        return null;
      },
    },
  });

  const handleAvatarChange = (file: File | null) => {
    setAvatarFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setAvatarPreview(null);
    }
  };

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);

    const formData = new FormData();
    formData.append('customer_name', values.customer_name);
    formData.append('customer_role', values.customer_role || '');
    formData.append('company', values.company || '');
    formData.append('content', values.content);
    formData.append('rating', values.rating.toString());
    formData.append('email', values.email || '');
    
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }

    try {
      const response = await fetch(`${API_URL}/api/testimonials/submit`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        notifications.show({
          title: 'Thank You!',
          message: 'Your testimonial has been submitted and will be reviewed shortly.',
          color: 'green',
          icon: <IconCheck size={16} />,
        });
        form.reset();
        setAvatarFile(null);
        setAvatarPreview(null);
        onClose();
        if (onSuccess) onSuccess();
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

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Share Your Experience"
      size="lg"
      radius="lg"
      centered
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Alert color="blue" variant="light">
            <Text size="sm">
              We&apos;d love to hear about your experience with Lucia Printing! 
              Your testimonial will be reviewed and may be featured on our website.
            </Text>
          </Alert>

          <Center>
            <div className="relative">
              <Avatar
                src={avatarPreview}
                size={80}
                radius="xl"
                color="blue"
              >
                <IconUser size={40} />
              </Avatar>
            </div>
          </Center>

          <FileInput
            label="Profile Photo (Optional)"
            placeholder="Upload a photo"
            accept="image/png,image/jpeg,image/gif,image/webp"
            onChange={handleAvatarChange}
            clearable
          />

          <TextInput
            label="Your Name"
            placeholder="Enter your full name"
            required
            leftSection={<IconUser size={16} />}
            {...form.getInputProps('customer_name')}
          />

          <TextInput
            label="Your Email (Optional)"
            placeholder="Enter your email"
            leftSection={<IconBriefcase size={16} />}
            description="We'll send you a thank you email when your testimonial is approved"
            {...form.getInputProps('email')}
          />

          <TextInput
            label="Your Role (Optional)"
            placeholder="e.g., Business Owner, Marketing Manager"
            leftSection={<IconBriefcase size={16} />}
            {...form.getInputProps('customer_role')}
          />

          <TextInput
            label="Company (Optional)"
            placeholder="e.g., Your Company Name"
            leftSection={<IconBuilding size={16} />}
            {...form.getInputProps('company')}
          />

          <div>
            <Text size="sm" fw={500} mb={4}>Rating</Text>
            <Rating
              value={form.values.rating}
              onChange={(value) => form.setFieldValue('rating', value)}
              size="lg"
              fractions={2}
            />
          </div>

          <Textarea
            label="Your Testimonial"
            placeholder="Tell us about your experience..."
            required
            minRows={4}
            {...form.getInputProps('content')}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
              variant="gradient"
              gradient={{ from: 'red', to: 'orange' }}
            >
              Submit Testimonial
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}