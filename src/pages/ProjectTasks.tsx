import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Plus, 
  MoreVertical, 
  Calendar, 
  User,
  AlertCircle,
  CheckCircle2,
  Clock,
  Eye
} from 'lucide-react';
import projectService from '@/services/projectService';
import taskService from '@/services/taskService';
import { CreateTaskForm } from '@/components/tasks/CreateTaskForm';

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'to_do' | 'in_progress' | 'approval' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date: string | null;
  assigned_to: number | null;
  assignedUser?: {
    id: number;
    username: string;
    full_name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

interface Project {
  id: number;
  name: string;
  description: string;
  status: string;
  project_manager_id: number;
}

const COLUMNS = [
  { id: 'to_do', title: 'To Do', color: 'bg-slate-100', icon: AlertCircle },
  { id: 'in_progress', title: 'In Progress', color: 'bg-blue-100', icon: Clock },
  { id: 'approval', title: 'Approval', color: 'bg-orange-100', icon: Eye },
  { id: 'completed', title: 'Completed', color: 'bg-green-100', icon: CheckCircle2 }
];

const PRIORITY_COLORS = {
  high: 'bg-red-100 text-red-800 border-red-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  low: 'bg-green-100 text-green-800 border-green-200'
};

const PRIORITY_ORDER = { high: 3, medium: 2, low: 1 };

export const ProjectTasks = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Group tasks by status and sort To Do by priority
  const tasksByStatus = {
    to_do: tasks
      .filter(task => task.status === 'to_do')
      .sort((a, b) => PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority]),
    in_progress: tasks.filter(task => task.status === 'in_progress'),
    approval: tasks.filter(task => task.status === 'approval'),
    completed: tasks.filter(task => task.status === 'completed')
  };

  useEffect(() => {
    if (projectId) {
      loadProjectAndTasks();
    }
  }, [projectId]);

  const loadProjectAndTasks = async () => {
    try {
      setLoading(true);
      const [projectData, tasksData] = await Promise.all([
        projectService.getProjectById(projectId!),
        taskService.getTasksByProject(projectId!)
      ]);
      setProject(projectData);
      setTasks(tasksData);
    } catch (error) {
      console.error('Failed to load project and tasks:', error);
      toast.error('Failed to load project data');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const taskId = parseInt(draggableId);
    const newStatus = destination.droppableId as Task['status'];

    try {
      await taskService.updateTaskStatus(taskId, newStatus);
      
      // Update local state
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );

      toast.success('Task status updated successfully');
    } catch (error) {
      console.error('Failed to update task status:', error);
      toast.error('Failed to update task status');
    }
  };

  const canManageProject = user && (
    user.role === 'admin' || 
    user.role === 'project_manager' || 
    user.role === 'team_member' ||
    (project && project.project_manager_id === parseInt(user.id))
  );

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString();
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Project not found</h1>
        <Button onClick={() => navigate('/projects')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/projects')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Projects
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
              <p className="text-gray-600 mt-1">{project.description}</p>
            </div>
          </div>
          {canManageProject && (
            <CreateTaskForm 
              projectId={projectId!} 
              onSuccess={loadProjectAndTasks}
            />
          )}
        </div>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {COLUMNS.map(column => {
            const Icon = column.icon;
            const columnTasks = tasksByStatus[column.id as keyof typeof tasksByStatus];
            
            return (
              <div key={column.id} className="flex flex-col">
                <div className={`${column.color} rounded-lg p-4 mb-4`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      <h3 className="font-semibold text-gray-800">{column.title}</h3>
                    </div>
                    <Badge variant="secondary" className="bg-white/50">
                      {columnTasks.length}
                    </Badge>
                  </div>
                </div>

                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`flex-1 space-y-3 min-h-[200px] p-2 rounded-lg transition-colors ${
                        snapshot.isDraggingOver ? 'bg-blue-50 border-2 border-blue-200' : ''
                      }`}
                    >
                      {columnTasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id.toString()}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`cursor-pointer transition-shadow hover:shadow-md ${
                                snapshot.isDragging ? 'shadow-lg rotate-2' : ''
                              }`}
                            >
                              <CardHeader className="pb-2">
                                <div className="flex items-start justify-between">
                                  <CardTitle className="text-sm font-medium line-clamp-2">
                                    {task.title}
                                  </CardTitle>
                                  <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
                                    <MoreVertical className="h-3 w-3" />
                                  </Button>
                                </div>
                              </CardHeader>
                              <CardContent className="pt-0">
                                {task.description && (
                                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                                    {task.description}
                                  </p>
                                )}
                                
                                <div className="flex items-center justify-between">
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs ${PRIORITY_COLORS[task.priority]}`}
                                  >
                                    {task.priority}
                                  </Badge>
                                  
                                  {task.assignedUser && (
                                    <div className="flex items-center gap-1">
                                      <Avatar className="h-6 w-6">
                                        <AvatarFallback className="text-xs">
                                          {getInitials(task.assignedUser.full_name || task.assignedUser.username)}
                                        </AvatarFallback>
                                      </Avatar>
                                    </div>
                                  )}
                                </div>

                                {task.due_date && (
                                  <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                                    <Calendar className="h-3 w-3" />
                                    {formatDate(task.due_date)}
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};