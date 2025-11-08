import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  DollarSign, 
  BarChart3, 
  Settings,
  Users
} from 'lucide-react';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  roles?: string[];
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
    href: '/dashboard',
  },
  {
    label: 'Projects',
    icon: <FolderKanban className="h-5 w-5" />,
    href: '/projects',
    roles: ['admin', 'project_manager', 'team_member'],
  },
  {
    label: 'Tasks',
    icon: <CheckSquare className="h-5 w-5" />,
    href: '/tasks',
  },
  {
    label: 'Financials',
    icon: <DollarSign className="h-5 w-5" />,
    href: '/financials',
    roles: ['admin', 'project_manager', 'sales_finance'],
  },
  {
    label: 'Analytics',
    icon: <BarChart3 className="h-5 w-5" />,
    href: '/analytics',
    roles: ['admin', 'project_manager'],
  },
  {
    label: 'Team',
    icon: <Users className="h-5 w-5" />,
    href: '/team',
    roles: ['admin', 'project_manager'],
  },
  {
    label: 'Settings',
    icon: <Settings className="h-5 w-5" />,
    href: '/settings',
  },
];

export const Sidebar = () => {
  const { user } = useAuth();

  const filteredNavItems = navItems.filter((item) => {
    if (!item.roles) return true;
    return user?.role && item.roles.includes(user.role);
  });

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border">
      <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
        <h1 className="text-xl font-bold text-sidebar-foreground">OneFlow</h1>
      </div>
      <nav className="p-4 space-y-1">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                isActive && 'bg-sidebar-primary text-sidebar-primary-foreground'
              )
            }
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
