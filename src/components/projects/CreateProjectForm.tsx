import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateProject } from '@/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Plus, Loader2, X, Search, Check, Upload, Image as ImageIcon } from 'lucide-react';
import projectService from '@/services/projectService';

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CreateProjectFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CreateProjectForm = ({ onSuccess, onCancel }: CreateProjectFormProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [budget, setBudget] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [projectManagerId, setProjectManagerId] = useState<string | undefined>(undefined);
  const [availableManagers, setAvailableManagers] = useState([]);
  const [loadingManagers, setLoadingManagers] = useState(true);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const createProjectMutation = useCreateProject();

  useEffect(() => {
    const loadManagers = async () => {
      try {
        setLoadingManagers(true);
        const managers = await projectService.getAvailableManagers();
        setAvailableManagers(managers);
        
        // Set current user as default manager if they are a project manager and in the list
        if (user && user.role === 'project_manager' && managers.length > 0) {
          const userInList = managers.find((m: any) => m.id === user.id);
          if (userInList) {
            setProjectManagerId(user.id.toString());
          }
        }
      } catch (error) {
        console.error('Failed to load managers:', error);
        toast.error('Failed to load available managers');
        setAvailableManagers([]);
      } finally {
        setLoadingManagers(false);
      }
    };

    if (user) {
      loadManagers();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Project name is required');
      return;
    }

    if (!projectManagerId) {
      toast.error('Project manager is required');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      if (description.trim()) formData.append('description', description.trim());
      if (deadline) formData.append('deadline', deadline);
      if (budget) formData.append('budget', budget);
      formData.append('priority', priority);
      if (projectManagerId) formData.append('project_manager_id', projectManagerId);
      if (image) formData.append('image', image);

      await createProjectMutation.mutateAsync(formData);

      toast.success('Project created successfully!');
      setName('');
      setDescription('');
      setDeadline('');
      setBudget('');
      setPriority('medium');
      setImage(null);
      setImagePreview(null);
      // Reset to default manager if current user is a project manager
      if (user && user.role === 'project_manager') {
        const userInList = availableManagers.find((m: any) => m.id === user.id);
        if (userInList) {
          setProjectManagerId(user.id.toString());
        } else {
          setProjectManagerId(undefined);
        }
      } else {
        setProjectManagerId(undefined);
      }

      onSuccess?.();
    } catch (error: any) {
      console.error('Failed to create project:', error);
      toast.error(error?.message || 'Failed to create project');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
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

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                Project Manager *
              </Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="h-12 px-4 rounded-xl border-border/50 bg-background hover:bg-background focus:border-accent focus:ring-accent/20 justify-between text-left font-normal w-full"
                  >
                    {projectManagerId && availableManagers.length > 0
                      ? (() => {
                          const selectedManager = availableManagers.find((manager: any) => manager.id.toString() === projectManagerId);
                          return selectedManager 
                            ? `${selectedManager.full_name || selectedManager.username} (${selectedManager.role.replace('_', ' ')})`
                            : "Select a project manager";
                        })()
                      : "Select a project manager"}
                    <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search project managers..." />
                    <CommandEmpty>
                      {loadingManagers ? "Loading project managers..." : "No project managers found."}
                    </CommandEmpty>
                    <CommandGroup>
                      {availableManagers.map((manager: any) => (
                        <CommandItem
                          key={manager.id}
                          value={`${manager.full_name || manager.username} ${manager.role}`}
                          onSelect={() => {
                            setProjectManagerId(manager.id.toString());
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              projectManagerId === manager.id.toString() ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {manager.full_name || manager.username}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {manager.role.replace('_', ' ')} • {manager.email}
                            </span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

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
              <Label className="text-sm font-medium text-foreground">
                Upload Image
              </Label>
              <div className="flex items-center gap-3">
                {imagePreview ? (
                  <div className="relative h-20 w-20 rounded-md overflow-hidden">
                    <img src={imagePreview} alt="Image preview" className="object-cover w-full h-full" />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={removeImage}
                      className="absolute top-0 right-0 rounded-full bg-black/30 hover:bg-black/40"
                    >
                      <X className="h-4 w-4 text-white" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    asChild
                    className="h-20 w-20 rounded-md border-border/50 bg-background hover:bg-background focus:border-accent focus:ring-accent/20"
                  >
                    <label className="cursor-pointer flex items-center justify-center h-full">
                      <Upload className="h-10 w-10 text-accent" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        aria-label="Upload project image"
                      />
                    </label>
                  </Button>
                )}
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