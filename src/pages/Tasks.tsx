import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Plus, CheckSquare, Search, Filter, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const Tasks = () => {
  const taskStats = [
    { label: 'To Do', count: 12, color: 'bg-muted/50 text-muted-foreground' },
    { label: 'In Progress', count: 8, color: 'bg-accent/10 text-accent' },
    { label: 'Review', count: 3, color: 'bg-warning/10 text-warning' },
    { label: 'Done', count: 24, color: 'bg-success/10 text-success' },
  ];

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
                  <CheckSquare className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-foreground">Tasks</h1>
                  <p className="text-muted-foreground mt-1 text-lg">
                    View and manage all your tasks
                  </p>
                </div>
              </div>
              <Button className="bg-accent hover:bg-accent/90 text-white shadow-lg hover:shadow-xl transition-all">
                <Plus className="mr-2 h-4 w-4" />
                New Task
              </Button>
            </div>
          </div>
        </div>

        {/* Task Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {taskStats.map((stat) => (
            <Card key={stat.label} className="border-0 shadow-md bg-gradient-to-br from-white to-accent/5">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-foreground">{stat.count}</div>
                <Badge className={stat.color + ' border-0 mt-2'}>
                  {stat.label}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search tasks..." 
              className="pl-10 h-12 bg-background border-border/50 focus:border-accent focus:ring-accent/20"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="h-12 border-border/50 hover:border-accent hover:text-accent">
              <Calendar className="mr-2 h-4 w-4" />
              Due Date
            </Button>
            <Button variant="outline" className="h-12 border-border/50 hover:border-accent hover:text-accent">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>
        
        {/* Tasks Interface - Coming Soon */}
        <Card className="border-0 shadow-md bg-gradient-to-br from-white via-white to-accent/5">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
              <CheckSquare className="h-8 w-8 text-accent" />
            </div>
          </CardHeader>
          <CardContent className="text-center py-12">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Advanced Task Management
            </h3>
            <p className="text-muted-foreground mb-6">
              Kanban boards, task assignments, time tracking, and collaboration features 
              are being developed. Stay tuned for powerful task management capabilities.
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

export default Tasks;
