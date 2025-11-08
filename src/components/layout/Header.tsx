import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bell, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="h-18 border-b border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <h2 className="text-lg font-medium text-muted-foreground">
              Welcome back, <span className="text-foreground font-semibold">{user?.full_name || user?.username}</span> ✨
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            className="relative hover:bg-slate-100 hover:text-slate-700"
          >
            <Bell className="h-5 w-5" />
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-slate-700 rounded-full border-2 border-background" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:shadow-md transition-all">
                <Avatar className="border-2 border-slate-200">
                  <AvatarFallback className="bg-slate-800 text-white font-semibold">
                    {user?.full_name ? getInitials(user.full_name) : user?.username?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 border-0 shadow-lg">
              <DropdownMenuLabel className="pb-3">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold">{user?.full_name || user?.username}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-800 text-white capitalize">
                      {user?.role?.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => navigate('/settings')}
                className="cursor-pointer hover:bg-slate-100 hover:text-slate-700"
              >
                <User className="mr-2 h-4 w-4" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleLogout}
                className="cursor-pointer text-destructive hover:bg-destructive/10"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
