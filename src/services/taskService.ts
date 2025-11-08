import api from './api';

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: 'new' | 'in_progress' | 'blocked' | 'done';
  priority: 'low' | 'medium' | 'high';
  assigneeId: string;
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
}

export interface CreateTaskRequest {
  projectId: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  assigneeId: string;
  dueDate: string;
  estimatedHours: number;
}

export interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  text: string;
  createdAt: string;
}

class TaskService {
  async getAllTasks(filters?: any) {
    const response = await api.get<Task[]>('/tasks', { params: filters });
    return response.data;
  }

  async getTaskById(id: string) {
    const response = await api.get<Task>(`/tasks/${id}`);
    return response.data;
  }

  async createTask(data: CreateTaskRequest) {
    const response = await api.post<Task>('/tasks', data);
    return response.data;
  }

  async updateTask(id: string, data: Partial<Task>) {
    const response = await api.put<Task>(`/tasks/${id}`, data);
    return response.data;
  }

  async deleteTask(id: string) {
    await api.delete(`/tasks/${id}`);
  }

  async getTaskComments(taskId: string) {
    const response = await api.get<TaskComment[]>(`/tasks/${taskId}/comments`);
    return response.data;
  }

  async addTaskComment(taskId: string, text: string) {
    const response = await api.post<TaskComment>(`/tasks/${taskId}/comments`, { text });
    return response.data;
  }

  async uploadTaskAttachment(taskId: string, file: File) {
    const formData = new FormData();
    formData.append('attachment', file);
    
    const response = await api.post(`/tasks/${taskId}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }
}

export default new TaskService();
