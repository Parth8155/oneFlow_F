import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import taskService from '@/services/taskService';

export const useTasks = (filters?: any) => {
  return useQuery({
    queryKey: ['tasks', filters],
    queryFn: async () => {
      try {
        return await taskService.getAllTasks(filters);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useTaskById = (id: string) => {
  return useQuery({
    queryKey: ['tasks', id],
    queryFn: async () => {
      try {
        return await taskService.getTaskById(id);
      } catch (error) {
        console.error(`Failed to fetch task ${id}:`, error);
        throw error;
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      try {
        return await taskService.createTask(data);
      } catch (error) {
        console.error('Failed to create task:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useUpdateTask = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      try {
        return await taskService.updateTask(id, data);
      } catch (error) {
        console.error(`Failed to update task ${id}:`, error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', id] });
    },
  });
};

export const useDeleteTask = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        return await taskService.deleteTask(id);
      } catch (error) {
        console.error(`Failed to delete task ${id}:`, error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useTaskComments = (taskId: string) => {
  return useQuery({
    queryKey: ['tasks', taskId, 'comments'],
    queryFn: async () => {
      try {
        return await taskService.getTaskComments(taskId);
      } catch (error) {
        console.error(`Failed to fetch comments for task ${taskId}:`, error);
        throw error;
      }
    },
    enabled: !!taskId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useAddTaskComment = (taskId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (text: string) => {
      try {
        return await taskService.addTaskComment(taskId, text);
      } catch (error) {
        console.error(`Failed to add comment to task ${taskId}:`, error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', taskId, 'comments'] });
    },
  });
};

export const useUploadTaskAttachment = (taskId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      try {
        return await taskService.uploadTaskAttachment(taskId, file);
      } catch (error) {
        console.error(`Failed to upload attachment to task ${taskId}:`, error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', taskId] });
    },
  });
};
