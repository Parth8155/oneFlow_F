import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  name: string;
  status: 'planned' | 'in_progress' | 'completed' | 'on_hold';
  progress: number;
  dueDate: string;
  teamSize: number;
}

const statusConfig = {
  planned: { label: 'Planned', className: 'bg-muted text-muted-foreground' },
  in_progress: { label: 'In Progress', className: 'bg-primary text-primary-foreground' },
  completed: { label: 'Completed', className: 'bg-success text-success-foreground' },
  on_hold: { label: 'On Hold', className: 'bg-warning text-warning-foreground' },
};

export const ProjectCard = ({ name, status, progress, dueDate, teamSize }: ProjectCardProps) => {
  const statusInfo = statusConfig[status];

  return (
    <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{name}</CardTitle>
          <Badge className={cn(statusInfo.className)}>
            {statusInfo.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{dueDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{teamSize} members</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
