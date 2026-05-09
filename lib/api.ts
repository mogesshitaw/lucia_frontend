/* eslint-disable @typescript-eslint/no-explicit-any */
// /lib/api.ts
import axios from 'axios';
import { notifications } from '@mantine/notifications';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor - FIXED: Use consistent token key
api.interceptors.request.use((config: any) => {
  if (typeof window !== 'undefined') {
    // Use 'token' consistently (not 'accessToken')
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`token ${token}`)
    }
  }
  return config;
});

// Response interceptor - FIXED: Better error handling
api.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    // Don't show notification for 404 on public endpoints
    const isPublicEndpoint = error.config?.url?.includes('/public/');
    const isNotFound = error.response?.status === 404;
    
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/login') && 
            !window.location.pathname.includes('/register')) {
          window.location.href = '/page/login';
        }
      }
    }
    
    // Show notification for errors (except 404 on public endpoints)
    if (!isNotFound || !isPublicEndpoint) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.error || error.response?.data?.message || 'An error occurred',
        color: 'red',
      });
    }
    
    return Promise.reject(error);
  }
);

// Types based on your backend response structure
export interface User {
  id: string;
  username: string;
  full_name?: string;
  role: string;
  is_active?: boolean;
  last_login?: string;
  created_at?: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
  message?: string;
}

export interface Order {
  id: number;
  order_number: string;
  customer_id: number;
  customer_name?: string;
  customer_phone?: string;
  telegram_chat_id?: number;
  telegram_message_id?: number;
  status: 'pending' | 'quoted' | 'printing' | 'completed' | 'delivered';
  material_type?: string;
  width?: number;
  height?: number;
  quantity: number;
  unit_price?: number;
  total_price?: number;
  customer_message?: string;
  admin_reply?: string;
  file_path?: string;
  file_name?: string;
  created_at: string;
  replied_at?: string;
  completed_at?: string;
}

export interface Customer {
  id: number;
  telegram_id?: string;
  name: string;
  phone?: string;
  username?: string;
  total_orders: number;
  total_spent: number;
  last_order_date?: string;
  created_at?: string;
}

// Auth API - FIXED: Match backend response structure
export const authApi = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
  
  register: async (data: { username: string; password: string; full_name?: string }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};

// Orders API
export const ordersApi = {
  getAll: (params?: { status?: string; page?: number; limit?: number }) => 
    api.get('/orders', { params }),
  
  getById: (id: number) => api.get(`/orders/${id}`),
  
  create: (data: Partial<Order>) => api.post('/orders', data),
  
  update: (id: number, data: Partial<Order>) => api.patch(`/orders/${id}`, data),
  
  delete: (id: number) => api.delete(`/orders/${id}`),
  
  getStats: () => api.get('/orders/stats/summary'),
  
  getByStatus: (status: string) => api.get('/orders', { params: { status } }),
  
  updateStatus: (id: number, status: Order['status']) => 
    api.patch(`/orders/${id}`, { status }),
};

// Customers API
export const customersApi = {
  getAll: (params?: { page?: number; search?: string; limit?: number }) => 
    api.get('/customers', { params }),
  
  getById: (id: number) => api.get(`/customers/${id}`),
  
  create: (data: Partial<Customer>) => api.post('/customers', data),
  
  update: (id: number, data: Partial<Customer>) => api.patch(`/customers/${id}`, data),
  
  delete: (id: number) => api.delete(`/customers/${id}`),
  
  getOrders: (id: number) => api.get(`/customers/${id}/orders`),
  
  getStats: () => api.get('/customers/stats'),
};

// Telegram API
export const telegramApi = {
  getContacts: () => api.get('/telegram/contacts'),
  
  getContactById: (id: number) => api.get(`/telegram/contacts/${id}`),
  
  getMessages: (chatId: number, limit?: number) => 
    api.get('/telegram/messages', { params: { chatId, limit } }),
  
  sendMessage: (chatId: number, message: string, replyToMessageId?: number) =>
    api.post('/telegram/send', { chatId, message, replyToMessageId }),
  
  reply: (data: { chatId: number; message: string; replyToMessageId?: number; orderId?: number }) =>
    api.post('/telegram/reply', data),
  
  getStatus: () => api.get('/telegram/status'),
  
  // downloadFilምe: (fileId: string) => api.get(`/telegram/download/${fileId}`, { responseType: 'blob' }),


downloadFile: async (filePath: string, fileName: string) => {
    try {
      const response = await api.get(`/telegram/download-file`, {
        params: { filePath },
        responseType: 'blob'
      });
      
      // ፋይሉን ለማውረድ ሊንክ ይፍጠሩ
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('File download error:', error);
      return false;
    }
  },

};

// Telegram Contacts API
export const telegramContactsApi = {
  getAll: (params?: { page?: number; limit?: number; search?: string }) => 
    api.get('/telegram/contacts', { params }),
  
  getById: (id: number) => api.get(`/telegram/contacts/${id}`),
  
  getMessages: (id: number, limit?: number, offset?: number) => 
    api.get(`/telegram/contacts/${id}/messages`, { params: { limit, offset } }),
  
  sendMessage: (id: number, message: string, replyToMessageId?: number) =>
    api.post(`/telegram/contacts/${id}/send`, { message, replyToMessageId }),
  
  getUnreadCount: () => api.get('/telegram/unread/count'),
  
  syncContacts: () => api.post('/telegram/contacts/sync'),
  
  syncAllContacts: () => api.post('/telegram/contacts/sync-all'),
  syncAllMessages: () => api.post('/telegram/messages/sync-all'),
  getSyncStatus: () => api.get('/telegram/sync-status'),
};

// Helper functions - FIXED: Use consistent 'token' key
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem('token');
  const expiry = localStorage.getItem('tokenExpiry');
  
  if (!token) return false;
  
  if (expiry) {
    const now = Date.now();
    if (now > parseInt(expiry)) {
      clearAuthData();
      return false;
    }
  }
  
  return true;
};

export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr) as User;
  } catch {
    return null;
  }
};

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

export const setAuthData = (token: string, user: User, expiresIn?: number) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  
  if (expiresIn) {
    const expiryTime = Date.now() + (expiresIn * 1000);
    localStorage.setItem('tokenExpiry', expiryTime.toString());
  }
};

export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('tokenExpiry');
};

export const setupAuthHeader = () => {
  const token = getToken();
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Initialize auth header on module load
if (typeof window !== 'undefined') {
  setupAuthHeader();
}