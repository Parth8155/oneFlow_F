import { AppLayout } from '@/components/layout/AppLayout';
import { KPICard } from '@/components/dashboard/KPICard';
import { ProjectCard } from '@/components/dashboard/ProjectCard';
import { useAuth } from '@/contexts/AuthContext';
import { FolderKanban, CheckSquare, DollarSign, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  // Mock data - will be replaced with API calls
  const kpiData = [
    { title: 'Active Projects', value: 12, icon: FolderKanban, trend: { value: 8, isPositive: true } },
    { title: 'Open Tasks', value: 34, icon: CheckSquare, trend: { value: 5, isPositive: false } },
    { title: 'Total Revenue', value: '$125k', icon: DollarSign, trend: { value: 12, isPositive: true } },
    { title: 'Team Efficiency', value: '94%', icon: TrendingUp, trend: { value: 3, isPositive: true } },
  ];

  const projects = [
    {
      name: 'Website Redesign',
      status: 'in_progress' as const,
      progress: 65,
      dueDate: 'Dec 15, 2024',
      teamSize: 5,
    },
    {
      name: 'Mobile App Development',
      status: 'in_progress' as const,
      progress: 40,
      dueDate: 'Jan 30, 2025',
      teamSize: 8,
    },
    {
      name: 'Marketing Campaign',
      status: 'planned' as const,
      progress: 10,
      dueDate: 'Feb 20, 2025',
      teamSize: 3,
    },
    {
      name: 'Infrastructure Upgrade',
      status: 'completed' as const,
      progress: 100,
      dueDate: 'Nov 30, 2024',
      teamSize: 4,
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-8 pb-8">
        {/* Header Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent/5 rounded-2xl" />
          <div className="relative p-6 space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-accent" />
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
            <div className="w-1 h-6 bg-accent rounded-full" />
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
              <div className="w-1 h-6 bg-accent rounded-full" />
              Recent Projects
            </h2>
            <button className="text-accent hover:text-accent/80 font-medium text-sm flex items-center gap-1 group">
              View all 
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.name} {...project} />
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
