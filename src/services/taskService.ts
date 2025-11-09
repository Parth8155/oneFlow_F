import api from './api';

export interface Task {
  id: number;
  project_id: number;
  title: string;
  description: string;
  status: 'to_do' | 'in_progress' | 'approval' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assigned_to: number | null;
  due_date: string | null;
  created_by?: number;
  last_modified_by?: number;
  last_modified_at?: string;
  total_hours_worked?: number;
  estimated_hours?: number;
  assignedUser?: {
    id: number;
    username: string;
    full_name: string;
    email: string;
  };
  createdBy?: {
    id: number;
    username: string;
    full_name: string;
    email: string;
  };
  lastModifiedBy?: {
    id: number;
    username: string;
    full_name: string;
    email: string;
  };
  timesheets?: TimesheetEntry[];
  created_at: string;
  updated_at: string;
}

export interface CreateTaskRequest {
  project_id: number;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  assigned_to?: number;
  due_date?: string;
}

export interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  text: string;
  createdAt: string;
}

export interface TimesheetEntry {
  id: number;
  task_id: number;
  user_id: number;
  project_id: number;
  hours: number;
  date: string;
  description?: string;
  is_billable: boolean;
  user: {
    id: number;
    username: string;
    full_name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
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
    const response = await api.post('/tasks', data);
    return response.data;
  }

  async getTasksByProject(projectId: string) {
    const response = await api.get<Task[]>(`/projects/${projectId}/tasks`);
    return response.data;
  }

  async updateTask(id: string, data: Partial<Task>) {
    const response = await api.put<Task>(`/tasks/${id}`, data);
    return response.data;
  }

  async updateTaskStatus(id: number, status: Task['status']) {
    const response = await api.put<Task>(`/tasks/${id}`, { status });
    return response.data;
  }

  async deleteTask(id: string) {
    await api.delete(`/tasks/${id}`);
  }

  async logWorkingHours(id: number, hours: number, description?: string) {
    const response = await api.post<{ task: Task; hoursLogged: number }>(`/tasks/${id}/log-hours`, {
      hours,
      description
    });
    return response.data;
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
