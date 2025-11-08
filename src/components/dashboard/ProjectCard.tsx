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
  planned: { label: 'Planned', className: 'bg-muted/50 text-muted-foreground border-muted' },
  in_progress: { label: 'In Progress', className: 'bg-accent/10 text-accent border-accent/20' },
  completed: { label: 'Completed', className: 'bg-success/10 text-success border-success/20' },
  on_hold: { label: 'On Hold', className: 'bg-warning/10 text-warning border-warning/20' },
};

export const ProjectCard = ({ name, status, progress, dueDate, teamSize }: ProjectCardProps) => {
  const statusInfo = statusConfig[status];

  return (
    <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-0 shadow-md bg-gradient-to-br from-white via-white to-accent/5 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold group-hover:text-accent transition-colors">{name}</CardTitle>
          <Badge className={cn('border', statusInfo.className)}>
            {statusInfo.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground font-medium">Progress</span>
            <span className="font-bold text-accent">{progress}%</span>
          </div>
          <div className="space-y-1">
            <Progress value={progress} className="h-3 bg-accent/10" />
            <div className="w-full bg-accent/10 rounded-full h-1">
              <div 
                className="bg-gradient-to-r from-accent to-accent/80 h-1 rounded-full transition-all duration-500" 
                style={{ width: `${progress}%` } as React.CSSProperties}
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="p-1 rounded bg-muted/30">
              <Calendar className="h-3 w-3" />
            </div>
            <span className="font-medium">{dueDate}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="p-1 rounded bg-muted/30">
              <Users className="h-3 w-3" />
            </div>
            <span className="font-medium">{teamSize} members</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
