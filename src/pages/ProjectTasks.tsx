import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Plus, 
  MoreVertical, 
  Calendar, 
  User,
  Users,
  AlertCircle,
  CheckCircle2,
  Clock,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import projectService from '@/services/projectService';
import taskService from '@/services/taskService';
import { adminService } from '@/services/adminService';
import { CreateTaskForm } from '@/components/tasks/CreateTaskForm';
import { EditTaskForm } from '@/components/tasks/EditTaskForm';

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
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [teamDialogOpen, setTeamDialogOpen] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [currentMembers, setCurrentMembers] = useState<any[]>([]);
  const [logHoursDialogOpen, setLogHoursDialogOpen] = useState(false);
  const [selectedTaskForLogging, setSelectedTaskForLogging] = useState<Task | null>(null);
  const [hoursToLog, setHoursToLog] = useState('');
  const [hoursDescription, setHoursDescription] = useState('');

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

    // Prevent team members from moving tasks to completed status
    if (user?.role === 'team_member' && newStatus === 'completed') {
      toast.error('Only admins and project managers can mark tasks as completed');
      return;
    }

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
    (project && project.project_manager_id === parseInt(user.id))
  );

  const canLogHours = (task: Task) => {
    // Only team members can log hours - admins and managers can only view the data
    return user && user.role === 'team_member';
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await taskService.deleteTask(taskId.toString());
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      toast.success('Task deleted successfully');
    } catch (error: any) {
      console.error('Failed to delete task:', error);
      
      // Handle specific error cases
      if (error.response?.status === 409) {
        const message = error.response?.data?.message || 'Cannot delete task: Task has existing timesheet entries';
        toast.error(message);
      } else if (error.response?.status === 403) {
        toast.error('Permission denied: Only project managers can delete tasks');
      } else if (error.response?.status === 404) {
        toast.error('Task not found');
      } else {
        toast.error('Failed to delete task');
      }
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setEditDialogOpen(true);
  };

  const handleLogHours = (task: Task) => {
    setSelectedTaskForLogging(task);
    setLogHoursDialogOpen(true);
  };

  const handleLogHoursSubmit = async () => {
    if (!selectedTaskForLogging || !hoursToLog || parseFloat(hoursToLog) <= 0) {
      toast.error('Please enter valid hours');
      return;
    }

    try {
      await taskService.logWorkingHours(
        selectedTaskForLogging.id,
        parseFloat(hoursToLog),
        hoursDescription || undefined
      );
      
      toast.success(`Logged ${hoursToLog} hours successfully`);
      setLogHoursDialogOpen(false);
      setHoursToLog('');
      setHoursDescription('');
      setSelectedTaskForLogging(null);
      loadProjectAndTasks(); // Refresh tasks to show updated hours
    } catch (error) {
      console.error('Failed to log hours:', error);
      toast.error('Failed to log hours');
    }
  };

  const loadTeamData = async () => {
    try {
      setLoadingUsers(true);
      const [allUsers, currentProjectMembers] = await Promise.all([
        adminService.getAllUsers(),
        projectService.getProjectMembers(projectId!)
      ]);
      
      // Filter to only show team_member role users
      const teamMembers = allUsers.filter((user: any) => user.role === 'team_member');
      setAvailableUsers(teamMembers);
      
      // Handle current members response structure
      const members = Array.isArray(currentProjectMembers) ? currentProjectMembers : (currentProjectMembers?.members || currentProjectMembers?.data || []);
      setCurrentMembers(members);
    } catch (error) {
      console.error('Failed to load team data:', error);
      toast.error('Failed to load team data');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleAddTeamMember = async () => {
    if (!selectedUserId) {
      toast.error('Please select a team member');
      return;
    }

    try {
      await projectService.addProjectMember(projectId!, selectedUserId);
      toast.success('Team member added successfully');
      setSelectedUserId('');
      loadTeamData(); // Refresh the team data
    } catch (error: any) {
      console.error('Failed to add team member:', error);
      toast.error(error?.message || 'Failed to add team member');
    }
  };

  const handleRemoveTeamMember = async (userId: string) => {
    try {
      await projectService.removeProjectMember(projectId!, userId);
      toast.success('Team member removed successfully');
      loadTeamData(); // Refresh the team data
    } catch (error: any) {
      console.error('Failed to remove team member:', error);
      toast.error(error?.message || 'Failed to remove team member');
    }
  };

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
            <div className="flex gap-3">
              <Dialog open={teamDialogOpen} onOpenChange={setTeamDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setTeamDialogOpen(true);
                      loadTeamData();
                    }}
                    className="flex items-center gap-2"
                  >
                    <Users className="h-4 w-4" />
                    Manage Team
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Manage Project Team</DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-6">
                    {/* Add Team Member Section */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Add Team Member</Label>
                      <div className="flex gap-2">
                        <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder={loadingUsers ? "Loading..." : "Select team member"} />
                          </SelectTrigger>
                          <SelectContent>
                            {availableUsers
                              .filter(user => !currentMembers.some(member => (member.user?.id || member.id) === user.id))
                              .map((user: any) => (
                                <SelectItem key={user.id} value={user.id.toString()}>
                                  {user.full_name || user.username}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <Button 
                          onClick={handleAddTeamMember}
                          disabled={!selectedUserId || loadingUsers}
                        >
                          Add
                        </Button>
                      </div>
                    </div>

                    {/* Current Team Members */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Current Team Members</Label>
                      <div className="space-y-2">
                        {currentMembers.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No team members assigned yet.</p>
                        ) : (
                          <>
                            {currentMembers
                              .filter(member => (member.user?.role || member.role) === 'team_member')
                              .map((member: any) => (
                                <div key={member.user?.id || member.id} className="flex items-center justify-between p-2 border rounded">
                                  <span className="text-sm">
                                    {member.user?.full_name || member.user?.username || member.full_name || member.username}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveTeamMember((member.user?.id || member.id).toString())}
                                    className="text-destructive hover:text-destructive"
                                  >
                                    Remove
                                  </Button>
                                </div>
                              ))}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <CreateTaskForm 
                projectId={projectId!} 
                onSuccess={loadProjectAndTasks}
              />
            </div>
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
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
                                        <MoreVertical className="h-3 w-3" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-40">
                                      <DropdownMenuItem 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleEditTask(task);
                                        }}
                                        className="cursor-pointer"
                                      >
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Task
                                      </DropdownMenuItem>
                                      {canLogHours(task) && (
                                        <DropdownMenuItem 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleLogHours(task);
                                          }}
                                          className="cursor-pointer"
                                        >
                                          <Clock className="mr-2 h-4 w-4" />
                                          Log Hours
                                        </DropdownMenuItem>
                                      )}
                                      <DropdownMenuSeparator />
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <DropdownMenuItem 
                                            onSelect={(e) => e.preventDefault()}
                                            className="cursor-pointer text-destructive focus:text-destructive"
                                          >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete Task
                                          </DropdownMenuItem>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>Delete Task</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              Are you sure you want to delete "{task.title}"? This action cannot be undone.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                              onClick={() => handleDeleteTask(task.id)}
                                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                            >
                                              Delete
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
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

                                {/* Tracking Information */}
                                <div className="mt-3 pt-2 border-t border-gray-100 space-y-1">
                                  {/* Hours worked */}
                                  {task.total_hours_worked !== undefined && task.total_hours_worked > 0 && (
                                    <div className="flex items-center gap-1 text-xs text-gray-600">
                                      <Clock className="h-3 w-3" />
                                      <span>{task.total_hours_worked}h worked</span>
                                      {task.estimated_hours && (
                                        <span className="text-gray-400">/ {task.estimated_hours}h est.</span>
                                      )}
                                    </div>
                                  )}
                                  
                                  {/* Timesheet descriptions */}
                                  {task.timesheets && task.timesheets.length > 0 && (
                                    <div className="space-y-1">
                                      {task.timesheets.map((timesheet) => (
                                        <div key={timesheet.id} className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                                          <div className="flex items-center gap-1 mb-1">
                                            <Clock className="h-3 w-3" />
                                            <span className="font-medium">{timesheet.hours}h</span>
                                            <span>by {timesheet.user.full_name || timesheet.user.username}</span>
                                            <span className="text-gray-400">on {new Date(timesheet.date).toLocaleDateString()}</span>
                                          </div>
                                          {timesheet.description && (
                                            <div className="text-xs text-gray-700 italic">
                                              "{timesheet.description}"
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  
                                  {/* Last modified */}
                                  {task.lastModifiedBy && task.last_modified_at && (
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                      <User className="h-3 w-3" />
                                      <span>Updated by {task.lastModifiedBy.full_name || task.lastModifiedBy.username}</span>
                                    </div>
                                  )}
                                  
                                  {/* Created by */}
                                  {task.createdBy && (
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                      <Plus className="h-3 w-3" />
                                      <span>Created by {task.createdBy.full_name || task.createdBy.username}</span>
                                    </div>
                                  )}
                                </div>
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

      {editingTask && (
        <EditTaskForm
          task={editingTask}
          projectId={projectId!}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSuccess={loadProjectAndTasks}
        />
      )}

      {/* Log Hours Dialog */}
      <Dialog open={logHoursDialogOpen} onOpenChange={setLogHoursDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Log Working Hours</DialogTitle>
          </DialogHeader>
          
          {selectedTaskForLogging && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Task</Label>
                <p className="text-sm text-gray-600 mt-1">{selectedTaskForLogging.title}</p>
              </div>
              
              <div>
                <Label htmlFor="hours">Hours Worked</Label>
                <Input
                  id="hours"
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="24"
                  value={hoursToLog}
                  onChange={(e) => setHoursToLog(e.target.value)}
                  placeholder="e.g. 2.5"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  value={hoursDescription}
                  onChange={(e) => setHoursDescription(e.target.value)}
                  placeholder="What did you work on?"
                  rows={3}
                  className="mt-1"
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleLogHoursSubmit}
                  className="flex-1"
                  disabled={!hoursToLog || parseFloat(hoursToLog) <= 0}
                >
                  Log Hours
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setLogHoursDialogOpen(false);
                    setHoursToLog('');
                    setHoursDescription('');
                    setSelectedTaskForLogging(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};