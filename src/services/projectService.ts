import api from './api';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planned' | 'in_progress' | 'completed' | 'on_hold';
  startDate: string;
  endDate: string;
  budget: number;
  progress: number;
  managerId: string;
  teamMembers: string[];
}

export interface CreateProjectRequest {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
}

class ProjectService {
  async getAllProjects(filters?: any) {
    const response = await api.get<Project[]>('/projects', { params: filters });
    return response.data;
  }

  async getProjectById(id: string) {
    const response = await api.get<Project>(`/projects/${id}`);
    return response.data;
  }

  async createProject(data: CreateProjectRequest) {
    const response = await api.post<Project>('/projects', data);
    return response.data;
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
