import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import taskService from '@/services/taskService';
import projectService from '@/services/projectService';

interface Task {
  id: number;
  title: string;
  description: string | null;
  priority: 'low' | 'medium' | 'high';
  status: 'to_do' | 'in_progress' | 'approval' | 'completed';
  due_date: string | null;
  assigned_to: number | null;
  assignedUser?: {
    id: number;
    full_name: string;
    username: string;
  };
}

interface EditTaskFormProps {
  task: Task;
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const EditTaskForm = ({ task, projectId, open, onOpenChange, onSuccess }: EditTaskFormProps) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(task.priority);
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [assignedTo, setAssignedTo] = useState<string>(task.assigned_to?.toString() || '');
  const [loading, setLoading] = useState(false);
  const [projectMembers, setProjectMembers] = useState<any[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const { user } = useAuth();

  // Initialize date and time from task due_date
  useEffect(() => {
    if (task.due_date) {
      const dueDateTime = new Date(task.due_date);
      const dateString = dueDateTime.toISOString().split('T')[0];
      const timeString = dueDateTime.toTimeString().slice(0, 5);
      setDueDate(dateString);
      setDueTime(timeString);
    }
  }, [task.due_date]);

  // Fetch project members when dialog opens
  useEffect(() => {
    if (open && projectId) {
      const fetchProjectMembers = async () => {
        try {
          setLoadingMembers(true);
          const response = await projectService.getProjectMembers(projectId);
          // Ensure we have an array - handle different response structures
          const members = Array.isArray(response) ? response : (response?.members || response?.data || []);
          setProjectMembers(members);
        } catch (error) {
          console.error('Failed to fetch project members:', error);
          toast.error('Failed to load project members');
          setProjectMembers([]); // Set empty array on error
        } finally {
          setLoadingMembers(false);
        }
      };

      fetchProjectMembers();
    }
  }, [open, projectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Task title is required');
      return;
    }

    if (!assignedTo) {
      toast.error('Please assign the task to a team member');
      return;
    }

    // Validate due date is not in the past
    if (dueDate) {
      let selectedDateTime = new Date(dueDate);
      
      // If time is provided, set it on the selected date
      if (dueTime) {
        const [hours, minutes] = dueTime.split(':');
        selectedDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      }
      
      const now = new Date();
      
      if (selectedDateTime < now) {
        toast.error('Due date and time cannot be in the past');
        return;
      }
    }

    try {
      setLoading(true);
      
      // Combine date and time if both are provided
      let combinedDueDate = undefined;
      if (dueDate) {
        if (dueTime) {
          combinedDueDate = `${dueDate}T${dueTime}:00`;
        } else {
          combinedDueDate = `${dueDate}T23:59:59`;
        }
      }

      const taskData = {
        title: title.trim(),
        description: description.trim() || null,
        priority,
        due_date: combinedDueDate,
        assigned_to: parseInt(assignedTo)
      };

      await taskService.updateTask(task.id.toString(), taskData);

      toast.success('Task updated successfully!');
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      console.error('Failed to update task:', error);
      toast.error(error?.message || 'Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-foreground">
                Task Title *
              </Label>
              <Input
                id="title"
                type="text"
                placeholder="Enter task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="h-12 px-4 rounded-xl border-border/50 bg-background focus:border-accent focus:ring-accent/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-foreground">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Enter task description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="px-4 py-3 rounded-xl border-border/50 bg-background focus:border-accent focus:ring-accent/20 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">
                  Priority
                </Label>
                <Select value={priority} onValueChange={(value: 'high' | 'medium' | 'low') => setPriority(value)}>
                  <SelectTrigger className="h-12 px-4 rounded-xl border-border/50 bg-background focus:border-accent focus:ring-accent/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate" className="text-sm font-medium text-foreground">
                  Due Date
                </Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="h-12 px-4 rounded-xl border-border/50 bg-background focus:border-accent focus:ring-accent/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueTime" className="text-sm font-medium text-foreground">
                  Due Time (Optional)
                </Label>
                <Input
                  id="dueTime"
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  className="h-12 px-4 rounded-xl border-border/50 bg-background focus:border-accent focus:ring-accent/20"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">
                  Assign To *
                </Label>
                {loadingMembers ? (
                  <div className="h-12 px-4 rounded-xl border-border/50 bg-background flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span className="text-muted-foreground">Loading members...</span>
                  </div>
                ) : (
                  <Select value={assignedTo} onValueChange={setAssignedTo}>
                    <SelectTrigger className="h-12 px-4 rounded-xl border-border/50 bg-background focus:border-accent focus:ring-accent/20">
                      <SelectValue placeholder="Select team member" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.isArray(projectMembers) && projectMembers
                        .filter((member: any) => (member.user?.role || member.role) === 'team_member')
                        .map((member: any) => (
                          <SelectItem key={member.user?.id || member.id} value={(member.user?.id || member.id)?.toString()}>
                            {member.user?.full_name || member.user?.username || member.full_name || member.username}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="h-12 px-6 rounded-xl border-border/50 hover:bg-accent/5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="h-12 px-6 rounded-xl bg-accent hover:bg-accent/90 text-white font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Task'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};