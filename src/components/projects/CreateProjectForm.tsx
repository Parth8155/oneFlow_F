import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateProject } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Plus, Loader2, X } from 'lucide-react';

interface CreateProjectFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CreateProjectForm = ({ onSuccess, onCancel }: CreateProjectFormProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [budget, setBudget] = useState('');
  const { user } = useAuth();
  const createProjectMutation = useCreateProject();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Project name is required');
      return;
    }

    try {
      const projectData = {
        name: name.trim(),
        description: description.trim() || undefined,
        deadline: deadline || undefined,
        budget: budget ? parseFloat(budget) : undefined,
      };

      await createProjectMutation.mutateAsync(projectData);

      toast.success('Project created successfully!');
      setName('');
      setDescription('');
      setDeadline('');
      setBudget('');

      onSuccess?.();
    } catch (error: any) {
      console.error('Failed to create project:', error);
      toast.error(error?.message || 'Failed to create project');
    }
  };

  const canCreateProject = user?.role === 'admin' || user?.role === 'project_manager';

  if (!canCreateProject) {
    return null;
  }

  return (
    <Card className="border-0 shadow-md bg-gradient-to-br from-white via-white to-accent/5 mb-8">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
            <div className="w-1 h-6 bg-accent rounded-full" />
            Create New Project
          </CardTitle>
          {onCancel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-foreground">
                Project Name *
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter project name"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                placeholder="Enter project description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="px-4 py-3 rounded-xl border-border/50 bg-background focus:border-accent focus:ring-accent/20 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deadline" className="text-sm font-medium text-foreground">
                  Deadline
                </Label>
                <Input
                  id="deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="h-12 px-4 rounded-xl border-border/50 bg-background focus:border-accent focus:ring-accent/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget" className="text-sm font-medium text-foreground">
                  Budget ($)
                </Label>
                <Input
                  id="budget"
                  type="number"
                  placeholder="0.00"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  min="0"
                  step="0.01"
                  className="h-12 px-4 rounded-xl border-border/50 bg-background focus:border-accent focus:ring-accent/20"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="px-6"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={createProjectMutation.isPending}
              className="px-6 bg-accent hover:bg-accent/90 text-white"
            >
              {createProjectMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Project
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};