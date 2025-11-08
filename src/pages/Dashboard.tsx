import { AppLayout } from '@/components/layout/AppLayout';
import { KPICard } from '@/components/dashboard/KPICard';
import { ProjectCard } from '@/components/dashboard/ProjectCard';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardAnalytics, useProjects } from '@/hooks';
import { FolderKanban, CheckSquare, DollarSign, TrendingUp, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: analytics, isLoading: analyticsLoading, error: analyticsError } = useDashboardAnalytics();
  const { data: projects, isLoading: projectsLoading, error: projectsError } = useProjects();

  // Transform analytics data for KPI cards
  const kpiData = analytics ? [
    { 
      title: 'Active Projects', 
      value: analytics.activeProjects || 0, 
      icon: FolderKanban, 
      trend: { value: analytics.projectGrowth || 0, isPositive: (analytics.projectGrowth || 0) >= 0 } 
    },
    { 
      title: 'Open Tasks', 
      value: analytics.openTasks || 0, 
      icon: CheckSquare, 
      trend: { value: analytics.taskGrowth || 0, isPositive: (analytics.taskGrowth || 0) >= 0 } 
    },
    { 
      title: 'Total Revenue', 
      value: `$${analytics.totalRevenue?.toLocaleString() || '0'}`, 
      icon: DollarSign, 
      trend: { value: analytics.revenueGrowth || 0, isPositive: (analytics.revenueGrowth || 0) >= 0 } 
    },
    { 
      title: 'Team Efficiency', 
      value: `${analytics.teamEfficiency || 0}%`, 
      icon: TrendingUp, 
      trend: { value: analytics.efficiencyGrowth || 0, isPositive: (analytics.efficiencyGrowth || 0) >= 0 } 
    },
  ] : [];

  // Transform projects data for ProjectCard components
  const projectCards = projects?.map(project => ({
    name: project.name,
    status: project.status as 'planned' | 'in_progress' | 'completed' | 'on_hold',
    progress: 0, // TODO: Calculate progress based on tasks completion
    dueDate: project.deadline ? new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No due date',
    teamSize: project.members?.length || 0,
  })) || [];

  const isLoading = analyticsLoading || projectsLoading;
  const hasError = analyticsError || projectsError;

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </AppLayout>
    );
  }

  if (hasError) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-destructive mb-2">Error Loading Dashboard</h2>
            <p className="text-muted-foreground">Please try refreshing the page or contact support if the problem persists.</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8 pb-8">
        {/* Header Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-800/10 via-transparent to-slate-800/10 rounded-2xl" />
          <div className="relative p-6 space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-800 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  Good morning, {user?.full_name || user?.username || 'User'}! 👋
                </h1>
                <p className="text-muted-foreground mt-1 text-lg">
                  {user?.role === 'admin' && 'System overview and key metrics'}
                  {user?.role === 'project_manager' && 'Your project portfolio at a glance'}
                  {user?.role === 'team_member' && 'Your tasks and assignments'}
                  {user?.role === 'sales_finance' && 'Financial overview and analytics'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <div className="w-1 h-6 bg-blue-600 rounded-full" />
            Key Metrics
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {kpiData.map((kpi) => (
              <KPICard key={kpi.title} {...kpi} />
            ))}
          </div>
        </div>

        {/* Projects Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <div className="w-1 h-6 bg-slate-700 rounded-full" />
              All Projects
            </h2>
            <button 
              onClick={() => navigate('/projects')}
              className="text-slate-700 hover:text-slate-600 font-medium text-sm flex items-center gap-1 group cursor-pointer"
            >
              Manage Projects
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projectCards.map((project) => (
              <ProjectCard key={project.name} {...project} />
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
