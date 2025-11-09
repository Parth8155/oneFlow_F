import { AppLayout } from '@/components/layout/AppLayout';
import { CreateProjectForm } from '@/components/projects/CreateProjectForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, FolderKanban, Search, Filter, X, Edit, Trash2, Users, Calendar, DollarSign, ListTodo } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import projectService, { Project } from '@/services/projectService';

const Projects = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await projectService.getAllProjects();
      setProjects(response.projects);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to load projects',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: number) => {
    try {
      await projectService.deleteProject(projectId.toString());
      toast({
        title: 'Success',
        description: 'Project deleted successfully',
      });
      loadProjects(); // Reload projects
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.details || 'Failed to delete project',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'planned': return 'bg-yellow-100 text-yellow-800';
      case 'on_hold': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-8 pb-8">
        {/* Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent/5 rounded-2xl" />
          <div className="relative p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <FolderKanban className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-foreground">Projects</h1>
                  <p className="text-muted-foreground mt-1 text-lg">
                    Manage and track all your projects in one place
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="bg-accent hover:bg-accent/90 text-white shadow-lg hover:shadow-xl transition-all"
              >
                {showCreateForm ? (
                  <>
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    New Project
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Create Project Form */}
        {showCreateForm && (
          <CreateProjectForm
            onSuccess={() => {
              setShowCreateForm(false);
              loadProjects();
            }}
            onCancel={() => setShowCreateForm(false)}
          />
        )}

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search projects..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 bg-background border-border/50 focus:border-accent focus:ring-accent/20"
            />
          </div>
          <Button variant="outline" className="h-12 border-border/50 hover:border-accent hover:text-accent">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
        
        {/* Projects Content */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <Card className="border-0 shadow-md bg-gradient-to-br from-white via-white to-accent/5">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <FolderKanban className="h-8 w-8 text-accent" />
              </div>
            </CardHeader>
            <CardContent className="text-center py-12">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {searchTerm ? 'No Projects Found' : 'No Projects Yet'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm 
                  ? `No projects match your search for "${searchTerm}"`
                  : 'Create your first project to get started with project management.'
                }
              </p>
              {!searchTerm && (
                <Button 
                  onClick={() => setShowCreateForm(true)}
                  className="bg-accent hover:bg-accent/90 text-white"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Project
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-foreground mb-2">
                        {project.name}
                      </CardTitle>
                      <Badge className={getStatusBadgeColor(project.status)}>
                        {project.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/projects/${project.id}/tasks`)}
                        title="View Tasks"
                      >
                        <ListTodo className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Project</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{project.name}"? This action cannot be undone and will remove all associated data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteProject(project.id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {project.description || 'No description provided'}
                  </p>
                  
                  <div className="space-y-2 text-sm">
                    {project.projectManager && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Manager:</span>
                        <span className="font-medium">{project.projectManager.full_name || project.projectManager.username}</span>
                      </div>
                    )}
                    
                    {project.deadline && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Deadline:</span>
                        <span className="font-medium">{new Date(project.deadline).toLocaleDateString()}</span>
                      </div>
                    )}
                    
                    {project.budget > 0 && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Budget:</span>
                        <span className="font-medium">₹{project.budget.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Projects;
