import api from './api';

export interface Timesheet {
  id: string;
  taskId: string;
  userId: string;
  date: string;
  hours: number;
  description: string;
  billable: boolean;
}

export interface CreateTimesheetRequest {
  taskId: string;
  date: string;
  hours: number;
  description: string;
  billable: boolean;
}

class TimesheetService {
  async getAllTimesheets(filters?: any) {
    const response = await api.get<Timesheet[]>('/timesheets', { params: filters });
    return response.data;
  }

  async getTimesheetById(id: string) {
    const response = await api.get<Timesheet>(`/timesheets/${id}`);
    return response.data;
  }

  async createTimesheet(data: CreateTimesheetRequest) {
    const response = await api.post<Timesheet>('/timesheets', data);
    return response.data;
  }

  async updateTimesheet(id: string, data: Partial<Timesheet>) {
    const response = await api.put<Timesheet>(`/timesheets/${id}`, data);
    return response.data;
  }

  async deleteTimesheet(id: string) {
    await api.delete(`/timesheets/${id}`);
  }
}

export default new TimesheetService();
