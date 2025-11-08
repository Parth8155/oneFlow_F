import { AppLayout } from '@/components/layout/AppLayout';

const Analytics = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Track performance metrics and generate reports
          </p>
        </div>
        
        <div className="text-center py-12">
          <p className="text-muted-foreground">Analytics dashboard coming soon...</p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Analytics;
