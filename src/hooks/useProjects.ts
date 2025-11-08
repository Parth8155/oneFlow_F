import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import projectService from '@/services/projectService';

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      try {
        const response = await projectService.getAllProjects();
        return response.projects; // Extract the projects array from the response
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProjectById = (id: string) => {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: async () => {
      try {
        return await projectService.getProjectById(id);
      } catch (error) {
        console.error(`Failed to fetch project ${id}:`, error);
        throw error;
      }
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      try {
        return await projectService.createProject(data);
      } catch (error) {
        console.error('Failed to create project:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useUpdateProject = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      try {
        return await projectService.updateProject(id, data);
      } catch (error) {
        console.error(`Failed to update project ${id}:`, error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects', id] });
    },
  });
};

export const useDeleteProject = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        return await projectService.deleteProject(id);
      } catch (error) {
        console.error(`Failed to delete project ${id}:`, error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useProjectMembers = (projectId: string) => {
  return useQuery({
    queryKey: ['projects', projectId, 'members'],
    queryFn: async () => {
      try {
        return await projectService.getProjectMembers(projectId);
      } catch (error) {
        console.error(`Failed to fetch members for project ${projectId}:`, error);
        throw error;
      }
    },
    enabled: !!projectId,
  });
};

export const useAddProjectMember = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      try {
        return await projectService.addProjectMember(projectId, userId);
      } catch (error) {
        console.error(`Failed to add member to project ${projectId}:`, error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'members'] });
    },
  });
};

export const useRemoveProjectMember = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      try {
        return await projectService.removeProjectMember(projectId, userId);
      } catch (error) {
        console.error(`Failed to remove member from project ${projectId}:`, error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'members'] });
    },
  });
};
