import { AppLayout } from '@/components/layout/AppLayout';

const Financials = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financials</h1>
          <p className="text-muted-foreground mt-1">
            Manage financial documents and track project budgets
          </p>
        </div>
        
        <div className="text-center py-12">
          <p className="text-muted-foreground">Financial management interface coming soon...</p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Financials;
