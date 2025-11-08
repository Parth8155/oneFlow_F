import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

const Team = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Team</h1>
            <p className="text-muted-foreground mt-1">
              Manage team members and their roles
            </p>
          </div>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        </div>
        
        <div className="text-center py-12">
          <p className="text-muted-foreground">Team management interface coming soon...</p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Team;
