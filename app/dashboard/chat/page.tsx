/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import {
  Container,
  Grid,
  Paper,
  Text,
  Title,
  Group,
  Avatar,
  TextInput,
  Button,
  Stack,
  ScrollArea,
  Badge,
  ActionIcon,
  Loader,
  Center,
  Indicator,
} from '@mantine/core';
import {
  IconSend,
  IconPaperclip,
  IconFile,
  IconSearch,
  IconCheck,
  IconChecklist,
  IconClock,
  IconPhone,
  IconVideo,
  IconInfoCircle,
  IconMessage,
  IconMoodSmile,
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

interface User {
  id: string;
  name: string;
  avatar: string;
  role: string;
  online: boolean;
  lastSeen: string;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  read: boolean;
  delivered: boolean;
  failed?: boolean;
}

interface Conversation {
  id: string;
  participants: User[];
  lastMessage: Message;
  unreadCount: number;
  updatedAt: string;
}

export default function ChatPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Define handleWebSocketMessage first
  const handleWebSocketMessage = useCallback((data: any) => {
    if (!currentUser) return;
    
    switch (data.type) {
      case 'new_message':
        if (data.message.conversationId === selectedConversation?.id) {
          setMessages(prev => [...prev, data.message]);
        } else {
          // Update conversations list with new message
          setConversations(prev =>
            prev.map(conv =>
              conv.id === data.message.conversationId
                ? {
                    ...conv,
                    lastMessage: data.message,
                    unreadCount: conv.unreadCount + 1,
                  }
                : conv
            )
          );
        }
        break;
      case 'typing':
        if (data.userId !== currentUser?.id) {
          setTypingUsers(prev =>
            data.typing
              ? [...prev, data.userId]
              : prev.filter(id => id !== data.userId)
          );
        }
        break;
      case 'read':
        setMessages(prev =>
          prev.map(msg =>
            msg.senderId !== currentUser?.id ? { ...msg, read: true } : msg
          )
        );
        break;
    }
  }, [selectedConversation, currentUser]);

  // Fetch current user
  const fetchCurrentUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setCurrentUser({
          id: data.data.user.id,
          name: `${data.data.user.first_name} ${data.data.user.last_name}`,
          avatar: data.data.user.profile_photo_url || '',
          role: data.data.user.role,
          online: true,
          lastSeen: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Failed to fetch current user', error);
    }
  }, []);

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setConversations(data.data.conversations);
      }
    } catch (error) {
      console.error(error);
      setError('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch messages
  const fetchMessages = useCallback(async (conversationId: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chat/messages/${conversationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (data.success) {
        setMessages(data.data.messages);
      }
    } catch (error) {
      console.error('Failed to fetch messages', error);
    }
  }, []);

  // Mark as read
  const markAsRead = useCallback(async (conversationId: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chat/read/${conversationId}`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      // Update unread count in conversations list
      setConversations(prev =>
        prev.map(conv =>
          conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
        )
      );
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  }, []);

  // Initial setup
  useEffect(() => {
    fetchCurrentUser();
    fetchConversations();
  }, [fetchCurrentUser, fetchConversations]);

  // WebSocket connection
  useEffect(() => {
    if (!currentUser) return;

    wsRef.current = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/chat`);
    
    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleWebSocketMessage(data);
    };

    wsRef.current.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      wsRef.current?.close();
    };
  }, [currentUser, handleWebSocketMessage]);

  // Load messages when conversation changes
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
      markAsRead(selectedConversation.id);
    }
  }, [selectedConversation, fetchMessages, markAsRead]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation || !currentUser) return;

    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      senderId: currentUser.id,
      content: messageInput,
      timestamp: new Date().toISOString(),
      type: 'text',
      read: false,
      delivered: false,
    };

    setMessages(prev => [...prev, tempMessage]);
    setMessageInput('');

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chat/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            conversationId: selectedConversation.id,
            content: messageInput,
            type: 'text',
          }),
        }
      );
      const data = await response.json();
      if (data.success) {
        // Replace temp message with real one
        setMessages(prev =>
          prev.map(msg =>
            msg.id === tempMessage.id ? data.data.message : msg
          )
        );
      }
    } catch (error) {
      console.error(error);
      // Mark message as failed
      setMessages(prev =>
        prev.map(msg =>
          msg.id === tempMessage.id ? { ...msg, failed: true } : msg
        )
      );
      notifications.show({
        title: 'Error',
        message: 'Failed to send message',
        color: 'red',
      });
    }
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || !selectedConversation) return;

    const formData = new FormData();
    formData.append('file', files[0]);
    formData.append('conversationId', selectedConversation.id);

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chat/upload`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );
      const data = await response.json();
      if (data.success) {
        setMessages(prev => [...prev, data.data.message]);
      }
    } catch (error) {
      console.error(error);
      notifications.show({
        title: 'Error',
        message: 'Failed to upload file',
        color: 'red',
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participants.some(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  if (loading) {
    return (
      <Center h="100vh">
        <Loader size="lg" />
      </Center>
    );
  }

  return (
    <Container size="xl" py="xl" h="calc(100vh - 100px)">
      <Paper withBorder h="100%" style={{ overflow: 'hidden' }}>
        <Grid h="100%" gutter={0}>
          {/* Conversations List */}
          <Grid.Col span={{ base: 12, md: 4 }} style={{ borderRight: '1px solid #dee2e6' }}>
            <Stack h="100%" gap={0}>
              {/* Header */}
              <Paper p="md" withBorder={false}>
                <Group justify="space-between">
                  <Title order={3}>Messages</Title>
                  <Badge size="lg">{conversations.length} chats</Badge>
                </Group>
                <TextInput
                  placeholder="Search conversations..."
                  leftSection={<IconSearch size={16} />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  mt="md"
                />
              </Paper>

              {/* Conversations */}
              <ScrollArea h="calc(100vh - 300px)" offsetScrollbars>
                <Stack gap={0}>
                  {filteredConversations.map((conv) => {
                    const otherUser = conv.participants.find(p => p.id !== currentUser?.id);
                    if (!otherUser) return null;

                    return (
                      <Paper
                        key={conv.id}
                        p="md"
                        withBorder={false}
                        style={{
                          cursor: 'pointer',
                          backgroundColor: selectedConversation?.id === conv.id ? '#f1f3f5' : 'transparent',
                        }}
                        onClick={() => setSelectedConversation(conv)}
                      >
                        <Group>
                          <Indicator
                            position="bottom-end"
                            offset={7}
                            color={otherUser.online ? 'green' : 'gray'}
                            withBorder
                          >
                            <Avatar src={otherUser.avatar} size="lg" radius="xl">
                              {otherUser.name.charAt(0)}
                            </Avatar>
                          </Indicator>
                          <div style={{ flex: 1 }}>
                            <Group justify="space-between">
                              <Text fw={500}>{otherUser.name}</Text>
                              <Text size="xs" c="dimmed">
                                {conv.lastMessage && formatTime(conv.lastMessage.timestamp)}
                              </Text>
                            </Group>
                            <Group justify="space-between">
                              <Text size="sm" c="dimmed" lineClamp={1}>
                                {conv.lastMessage?.content || 'No messages yet'}
                              </Text>
                              {conv.unreadCount > 0 && (
                                <Badge color="red" size="sm" circle>
                                  {conv.unreadCount}
                                </Badge>
                              )}
                            </Group>
                          </div>
                        </Group>
                      </Paper>
                    );
                  })}
                </Stack>
              </ScrollArea>
            </Stack>
          </Grid.Col>

          {/* Chat Area */}
          <Grid.Col span={{ base: 12, md: 8 }}>
            {selectedConversation ? (
              <Stack h="100%" gap={0}>
                {/* Chat Header */}
                <Paper p="md" withBorder={false} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <Group justify="space-between">
                    <Group>
                      <Avatar
                        src={selectedConversation.participants.find(p => p.id !== currentUser?.id)?.avatar}
                        size="md"
                        radius="xl"
                      />
                      <div>
                        <Text fw={500}>
                          {selectedConversation.participants.find(p => p.id !== currentUser?.id)?.name}
                        </Text>
                        {typingUsers.length > 0 ? (
                          <Text size="xs" c="dimmed">Typing...</Text>
                        ) : (
                          <Text size="xs" c="dimmed">
                            {selectedConversation.participants.find(p => p.id !== currentUser?.id)?.online
                              ? 'Online'
                              : 'Offline'}
                          </Text>
                        )}
                      </div>
                    </Group>
                    <Group>
                      <ActionIcon variant="subtle">
                        <IconPhone size={18} />
                      </ActionIcon>
                      <ActionIcon variant="subtle">
                        <IconVideo size={18} />
                      </ActionIcon>
                      <ActionIcon variant="subtle">
                        <IconInfoCircle size={18} />
                      </ActionIcon>
                    </Group>
                  </Group>
                </Paper>

                {/* Messages */}
                <ScrollArea h="calc(100vh - 400px)" p="md">
                  <Stack>
                    {messages.map((msg, index) => {
                      const isCurrentUser = msg.senderId === currentUser?.id;
                      const showAvatar = index === 0 || messages[index - 1]?.senderId !== msg.senderId;

                      return (
                        <Group
                          key={msg.id}
                          justify={isCurrentUser ? 'flex-end' : 'flex-start'}
                          align="flex-end"
                          gap="xs"
                        >
                          {!isCurrentUser && showAvatar && (
                            <Avatar
                              src={selectedConversation.participants.find(p => p.id === msg.senderId)?.avatar}
                              size="sm"
                              radius="xl"
                            />
                          )}
                          {!isCurrentUser && !showAvatar && <div style={{ width: 36 }} />}
                          
                          <Paper
                            p="xs"
                            style={{
                              maxWidth: '70%',
                              backgroundColor: isCurrentUser ? '#228be6' : '#f1f3f5',
                              color: isCurrentUser ? 'white' : 'inherit',
                            }}
                          >
                            {msg.type === 'text' && <Text>{msg.content}</Text>}
                            {msg.type === 'image' && msg.fileUrl && (
                              <Image
                                src={msg.fileUrl}
                                alt="attachment"
                                width={200}
                                height={200}
                                style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 4, objectFit: 'cover' }}
                              />
                            )}
                            {msg.type === 'file' && (
                              <Group>
                                <IconFile size={16} />
                                <Text size="sm">{msg.fileName}</Text>
                              </Group>
                            )}
                          </Paper>

                          {isCurrentUser && (
                            <Group gap={4}>
                              {msg.read ? (
                                <IconChecklist size={14} color="blue" />
                              ) : msg.delivered ? (
                                <IconCheck size={14} color="gray" />
                              ) : (
                                <IconClock size={14} color="gray" />
                              )}
                            </Group>
                          )}
                        </Group>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </Stack>
                </ScrollArea>

                {/* Message Input */}
                <Paper p="md" withBorder={false} style={{ borderTop: '1px solid #dee2e6' }}>
                  <Group align="flex-end">
                    <ActionIcon
                      variant="subtle"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <IconPaperclip size={20} />
                    </ActionIcon>
                    <ActionIcon variant="subtle" onClick={() => setShowEmoji(!showEmoji)}>
                      <IconMoodSmile size={20} />
                    </ActionIcon>
                    <TextInput
                      placeholder="Type a message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      style={{ flex: 1 }}
                    />
                    <Button onClick={sendMessage} disabled={!messageInput.trim()}>
                      <IconSend size={16} />
                    </Button>
                  </Group>
                  <input
                    type="file"
                    hidden
                    ref={fileInputRef}
                    onChange={(e) => handleFileUpload(e.target.files)}
                  />
                </Paper>
              </Stack>
            ) : (
              <Center h="100%">
                <Stack align="center">
                  <IconMessage size={48} color="gray" />
                  <Text size="lg" c="dimmed">Select a conversation to start chatting</Text>
                </Stack>
              </Center>
            )}
          </Grid.Col>
        </Grid>
      </Paper>
    </Container>
  );
}