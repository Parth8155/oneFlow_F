import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';

const Financials = () => {
  return (
    <AppLayout>
      <div className="space-y-8 pb-8">
        {/* Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent/5 rounded-2xl" />
          <div className="relative p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <DollarSign className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Financials</h1>
                <p className="text-muted-foreground mt-1 text-lg">
                  Manage financial documents and track project budgets
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <Card className="border-0 shadow-md bg-gradient-to-br from-white via-white to-accent/5">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
              <DollarSign className="h-8 w-8 text-accent" />
            </div>
          </CardHeader>
          <CardContent className="text-center py-12">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Financial Management System
            </h3>
            <p className="text-muted-foreground mb-6">
              Comprehensive financial tracking, budgets, invoices, and reporting tools are in development.
            </p>
            <div className="flex justify-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-accent/70 rounded-full animate-pulse delay-75" />
              <div className="w-2 h-2 bg-accent/50 rounded-full animate-pulse delay-150" />
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Financials;
