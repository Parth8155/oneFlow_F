import { useQuery } from '@tanstack/react-query';
import analyticsService from '@/services/analyticsService';

export const useDashboardAnalytics = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['analytics', 'dashboard'],
    queryFn: async () => {
      try {
        return await analyticsService.getDashboardAnalytics();
      } catch (error) {
        console.error('Failed to fetch dashboard analytics:', error);
        throw error;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: options?.enabled,
  });
};

export const useProjectAnalytics = (projectId: string) => {
  return useQuery({
    queryKey: ['analytics', 'project', projectId],
    queryFn: async () => {
      try {
        return await analyticsService.getProjectAnalytics(projectId);
      } catch (error) {
        console.error(`Failed to fetch project analytics for ${projectId}:`, error);
        throw error;
      }
    },
    enabled: !!projectId,
    staleTime: 10 * 60 * 1000,
  });
};

export const useTeamAnalytics = () => {
  return useQuery({
    queryKey: ['analytics', 'team'],
    queryFn: async () => {
      try {
        return await analyticsService.getTeamAnalytics();
      } catch (error) {
        console.error('Failed to fetch team analytics:', error);
        throw error;
      }
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useFinancialAnalytics = () => {
  return useQuery({
    queryKey: ['analytics', 'financial'],
    queryFn: async () => {
      try {
        return await analyticsService.getFinancialAnalytics();
      } catch (error) {
        console.error('Failed to fetch financial analytics:', error);
        throw error;
      }
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useTaskAnalytics = () => {
  return useQuery({
    queryKey: ['analytics', 'task'],
    queryFn: async () => {
      try {
        return await analyticsService.getTaskAnalytics();
      } catch (error) {
        console.error('Failed to fetch task analytics:', error);
        throw error;
      }
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useReportGeneration = (type: string) => {
  return useQuery({
    queryKey: ['analytics', 'report', type],
    queryFn: async () => {
      try {
        return await analyticsService.generateReport(type);
      } catch (error) {
        console.error(`Failed to generate ${type} report:`, error);
        throw error;
      }
    },
    enabled: !!type,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};
