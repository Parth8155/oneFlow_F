import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
}

export const KPICard = ({ title, value, icon: Icon, trend, description }: KPICardProps) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md bg-gradient-to-br from-white to-accent/5">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="p-2 rounded-lg bg-accent/10">
          <Icon className="h-5 w-5 text-accent" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground mb-2">{value}</div>
        {trend && (
          <div className="flex items-center gap-2">
            <div className={cn(
              "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
              trend.isPositive 
                ? "bg-accent/10 text-accent" 
                : "bg-destructive/10 text-destructive"
            )}>
              <span>{trend.isPositive ? '↗' : '↙'}</span>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </div>
            <span className="text-xs text-muted-foreground">vs last month</span>
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-2">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};
