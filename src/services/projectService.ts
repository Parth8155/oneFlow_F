import api from './api';

export interface Project {
  id: number;
  name: string;
  description: string | null;
  status: 'planned' | 'in_progress' | 'completed' | 'on_hold';
  project_manager_id: number | null;
  deadline: string | null;
  budget: number;
  created_at: string;
  updated_at: string;
  projectManager?: {
    id: number;
    username: string;
    full_name: string;
    email: string;
  };
  members?: Array<{
    id: number;
    user: {
      id: number;
      username: string;
      full_name: string;
      email: string;
      role: string;
    };
    assigned_at: string;
  }>;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  deadline?: string;
  budget?: number;
}

export interface ProjectResponse {
  projects: Project[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

class ProjectService {
  async getAllProjects(filters?: any): Promise<ProjectResponse> {
    const response = await api.get<ProjectResponse>('/projects', { params: filters });
    return response.data;
  }

  async getProjectById(id: string) {
    const response = await api.get<Project>(`/projects/${id}`);
    return response.data;
  }

  async createProject(data: CreateProjectRequest) {
    const response = await api.post<{ message: string; project: Project }>('/projects', data);
    return response.data.project;
  }

  async updateProject(id: string, data: Partial<Project>) {
    const response = await api.put<Project>(`/projects/${id}`, data);
    return response.data;
  }

  async deleteProject(id: string) {
    await api.delete(`/projects/${id}`);
  }

  async getProjectMembers(id: string) {
    const response = await api.get(`/projects/${id}/members`);
    return response.data;
  }

  async addProjectMember(projectId: string, userId: string) {
    const response = await api.post(`/projects/${projectId}/members`, { userId });
    return response.data;
  }

  async removeProjectMember(projectId: string, userId: string) {
    await api.delete(`/projects/${projectId}/members/${userId}`);
  }
}

export default new ProjectService();
