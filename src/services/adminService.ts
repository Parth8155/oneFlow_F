import api from './api';

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string | null;
  role: 'project_manager' | 'team_member' | 'sales_finance' | 'admin';
  hourly_rate: number;
  logged_out: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  full_name?: string;
  role: 'project_manager' | 'team_member' | 'sales_finance' | 'admin';
  hourly_rate?: number;
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  full_name?: string;
  role?: 'project_manager' | 'team_member' | 'sales_finance' | 'admin';
  hourly_rate?: number;
  logged_out?: boolean;
}

export const adminService = {
  // Get all users
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get('/admin/users');
    return response.data.users;
  },

  // Create a new user
  createUser: async (userData: CreateUserData): Promise<User> => {
    const response = await api.post('/admin/users', userData);
    return response.data.user;
  },

  // Update a user
  updateUser: async (id: number, userData: UpdateUserData): Promise<User> => {
    const response = await api.put(`/admin/users/${id}`, userData);
    return response.data.user;
  },

  // Delete a user
  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/admin/users/${id}`);
  },

  // Force logout a user
  forceLogoutUser: async (id: number): Promise<void> => {
    await api.post(`/admin/users/${id}/logout`);
  },
};