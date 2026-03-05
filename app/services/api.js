class ApiService {
  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    this.refreshPromise = null;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    // Add authorization token
    const token = localStorage.getItem('accessToken');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
      credentials: 'include' // Important for cookies
    };

    try {
      let response = await fetch(url, config);
      
      // Handle token expiration
      if (response.status === 401) {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (refreshToken && !this.refreshPromise) {
          this.refreshPromise = this.refreshAccessToken(refreshToken);
          
          try {
            const { accessToken } = await this.refreshPromise;
            localStorage.setItem('accessToken', accessToken);
            
            // Retry original request with new token
            headers.Authorization = `Bearer ${accessToken}`;
            response = await fetch(url, {
              ...config,
              headers
            });
          } catch (refreshError) {
            // Refresh failed, clear tokens and redirect to login
            this.clearTokens();
            window.location.href = 'page/login';
            throw new Error('Session expired. Please login again.');
          } finally {
            this.refreshPromise = null;
          }
        } else {
          this.clearTokens();
          window.location.href = 'page/login';
          throw new Error('Authentication required');
        }
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  async refreshAccessToken(refreshToken) {
    const response = await fetch(`${this.baseURL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refreshToken }),
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    return data.data;
  }

  clearTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  // Auth endpoints
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });

    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }

    return response;
  }

  async verifyEmail(email, code) {
    return this.request('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ email, code })
    });
  }

  async resendVerification(email) {
    return this.request('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }

  async logout() {
    await this.request('/auth/logout', {
      method: 'POST'
    });
    this.clearTokens();
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Admin endpoints
  async createEmployee(employeeData) {
    return this.request('/admin/employees', {
      method: 'POST',
      body: JSON.stringify(employeeData)
    });
  }

  async getEmployees(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/employees?${queryString}`);
  }

  async getCustomers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/customers?${queryString}`);
  }

  async getUserById(id) {
    return this.request(`/admin/users/${id}`);
  }

  async updateUserStatus(id, isActive) {
    return this.request(`/admin/users/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive })
    });
  }

  async deleteUser(id) {
    return this.request(`/admin/users/${id}`, {
      method: 'DELETE'
    });
  }

  async getDashboardStats() {
    return this.request('/admin/dashboard/stats');
  }

  async getRoles() {
    return this.request('/admin/roles');
  }

  async getDepartments() {
    return this.request('/admin/departments');
  }

  async getCustomerTiers() {
    return this.request('/admin/customer-tiers');
  }
  
  async getImages() {
    return this.request(`/images`);
  }
}


const apiService = new ApiService();
export default apiService;