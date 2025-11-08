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
  Users,
  Shield
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
    label: 'Settings',
    icon: <Settings className="h-5 w-5" />,
    href: '/settings',
  },
  {
    label: 'Admin',
    icon: <Shield className="h-5 w-5" />,
    href: '/admin',
    roles: ['admin'],
  },
];

export const Sidebar = () => {
  const { user } = useAuth();

  const filteredNavItems = navItems.filter((item) => {
    if (!item.roles) return true;
    return user?.role && item.roles.includes(user.role);
  });

  return (
    <aside className="w-64 bg-background border-r border-border/50 shadow-sm">
      <div className="flex h-18 items-center px-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">O</span>
          </div>
          <h1 className="text-xl font-bold text-foreground">OneFlow</h1>
        </div>
      </div>
      <nav className="p-4 space-y-2">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
                'text-muted-foreground hover:text-foreground hover:bg-slate-100',
                isActive && 'bg-slate-800 text-white shadow-lg hover:bg-slate-700 hover:text-white'
              )
            }
          >
            <div className={cn(
              'transition-transform group-hover:scale-110',
              'flex items-center justify-center'
            )}>
              {item.icon}
            </div>
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      
      {/* Footer */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-slate-700 rounded-full animate-pulse" />
            <span>All systems operational</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
