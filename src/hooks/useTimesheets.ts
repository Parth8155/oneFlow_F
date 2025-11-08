import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import timesheetService from '@/services/timesheetService';

export const useTimesheets = (filters?: any) => {
  return useQuery({
    queryKey: ['timesheets', filters],
    queryFn: async () => {
      try {
        return await timesheetService.getAllTimesheets(filters);
      } catch (error) {
        console.error('Failed to fetch timesheets:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useTimesheetById = (id: string) => {
  return useQuery({
    queryKey: ['timesheets', id],
    queryFn: async () => {
      try {
        return await timesheetService.getTimesheetById(id);
      } catch (error) {
        console.error(`Failed to fetch timesheet ${id}:`, error);
        throw error;
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateTimesheet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      try {
        return await timesheetService.createTimesheet(data);
      } catch (error) {
        console.error('Failed to create timesheet:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timesheets'] });
    },
  });
};

export const useUpdateTimesheet = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      try {
        return await timesheetService.updateTimesheet(id, data);
      } catch (error) {
        console.error(`Failed to update timesheet ${id}:`, error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timesheets'] });
      queryClient.invalidateQueries({ queryKey: ['timesheets', id] });
    },
  });
};

export const useDeleteTimesheet = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        return await timesheetService.deleteTimesheet(id);
      } catch (error) {
        console.error(`Failed to delete timesheet ${id}:`, error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timesheets'] });
    },
  });
};
