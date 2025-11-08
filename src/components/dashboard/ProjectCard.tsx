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
  planned: { label: 'Planned', className: 'bg-slate-100 text-slate-700 border-slate-300' },
  in_progress: { label: 'In Progress', className: 'bg-slate-800 text-white border-slate-700' },
  completed: { label: 'Completed', className: 'bg-slate-700 text-white border-slate-600' },
  on_hold: { label: 'On Hold', className: 'bg-slate-600 text-white border-slate-500' },
};

export const ProjectCard = ({ name, status, progress, dueDate, teamSize }: ProjectCardProps) => {
  const statusInfo = statusConfig[status];

  return (
    <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-0 shadow-md bg-gradient-to-br from-white via-white to-slate-50 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold group-hover:text-slate-700 transition-colors">{name}</CardTitle>
          <Badge className={cn('border', statusInfo.className)}>
            {statusInfo.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground font-medium">Progress</span>
            <span className="font-bold text-slate-700">{progress}%</span>
          </div>
          <div className="space-y-1">
            <Progress value={progress} className="h-3 bg-slate-200" />
            <div className="w-full bg-slate-200 rounded-full h-1">
              {/* eslint-disable-next-line react/no-unknown-property, @typescript-eslint/ban-ts-comment */}
              {/* Inline width used for the progress bar; acceptable here for dynamic progress */}
              <div 
                className="bg-gradient-to-r from-slate-700 to-slate-600 h-1 rounded-full transition-all duration-500" 
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
