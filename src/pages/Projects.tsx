import { AppLayout } from '@/components/layout/AppLayout';
import { CreateProjectForm } from '@/components/projects/CreateProjectForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Plus, FolderKanban, Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const Projects = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
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
            onSuccess={() => setShowCreateForm(false)}
            onCancel={() => setShowCreateForm(false)}
          />
        )}

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search projects..." 
              className="pl-10 h-12 bg-background border-border/50 focus:border-accent focus:ring-accent/20"
            />
          </div>
          <Button variant="outline" className="h-12 border-border/50 hover:border-accent hover:text-accent">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
        
        {/* Projects Grid - Coming Soon */}
        <Card className="border-0 shadow-md bg-gradient-to-br from-white via-white to-accent/5">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
              <FolderKanban className="h-8 w-8 text-accent" />
            </div>
          </CardHeader>
          <CardContent className="text-center py-12">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Project Management Interface
            </h3>
            <p className="text-muted-foreground mb-6">
              Advanced project tracking and management features are coming soon. 
              You'll be able to create, manage, and track all your projects here.
            </p>
            <div className="flex justify-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-accent/70 rounded-full animate-pulse delay-75" />
              <div className="w-2 h-2 bg-accent/50 rounded-full animate-pulse delay-150" />
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Projects;
