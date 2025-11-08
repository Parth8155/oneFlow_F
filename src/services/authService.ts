import api from './api';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    username: string;
    email: string;
    full_name: string;
    role: 'admin' | 'project_manager' | 'team_member' | 'sales_finance';
    hourly_rate: number;
    created_at: string;
    updated_at: string;
  };
  token: string;
  message: string;
}

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    
    // Store token (backend returns single token, not separate access/refresh)
    localStorage.setItem('accessToken', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }

  async getProfile() {
    const response = await api.get('/auth/me');
    return response.data;
  }

  async updateProfile(data: any) {
    const response = await api.put('/auth/profile', data);
    return response.data;
  }

  async changePassword(oldPassword: string, newPassword: string) {
    const response = await api.put('/auth/password', {
      current_password: oldPassword,
      new_password: newPassword,
    });
    return response.data;
  }
}

export default new AuthService();
