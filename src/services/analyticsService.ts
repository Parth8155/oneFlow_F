import api from './api';

class AnalyticsService {
  async getDashboardAnalytics(filters?: any) {
    const response = await api.get('/analytics', { params: filters });
    return response.data;
  }

  async getProjectAnalytics(projectId: string) {
    const response = await api.get(`/analytics/projects/${projectId}`);
    return response.data;
  }

  async getTeamAnalytics(filters?: any) {
    const response = await api.get('/analytics/team', { params: filters });
    return response.data;
  }

  async getFinancialAnalytics(filters?: any) {
    const response = await api.get('/analytics/financial', { params: filters });
    return response.data;
  }

  async getTaskAnalytics(filters?: any) {
    const response = await api.get('/analytics/tasks', { params: filters });
    return response.data;
  }

  async generateReport(type: string, filters?: any) {
    const response = await api.get(`/analytics/reports/${type}`, { params: filters });
    return response.data;
  }
}

export default new AnalyticsService();
