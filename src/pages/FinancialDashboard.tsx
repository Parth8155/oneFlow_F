import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import financialService from '@/services/financialService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DollarSign,
  CreditCard,
  FileText,
  Receipt,
  BarChart3,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const FinancialDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year'>('month');

  // Fetch financial data
  const { data: salesOrdersData, isLoading: loadingSales, error: salesOrdersError } = useQuery({
    queryKey: ['sales-orders'],
    queryFn: () => financialService.getAllSalesOrders(),
    retry: 1,
  });

  const { data: invoicesData, isLoading: loadingInvoices } = useQuery({
    queryKey: ['customer-invoices'],
    queryFn: () => financialService.getAllInvoices(),
  });

  const { data: expensesData, isLoading: loadingExpenses } = useQuery({
    queryKey: ['expenses'],
    queryFn: () => financialService.getAllExpenses(),
  });

  // Helper function to safely extract array data from API responses
  const extractArrayData = (data: any): any[] => {
    if (Array.isArray(data)) return data;
    if (data?.data && Array.isArray(data.data)) return data.data;
    if (data?.results && Array.isArray(data.results)) return data.results;
    if (data?.salesOrders && Array.isArray(data.salesOrders)) return data.salesOrders;
    if (data?.invoices && Array.isArray(data.invoices)) return data.invoices;
    if (data?.expenses && Array.isArray(data.expenses)) return data.expenses;
    if (data?.vendorBills && Array.isArray(data.vendorBills)) return data.vendorBills;
    return [];
  };

  // Ensure all data is properly structured as arrays
  const salesOrders = extractArrayData(salesOrdersData);
  const invoices = extractArrayData(invoicesData);
  const expenses = extractArrayData(expensesData);

  const isLoading = loadingSales || loadingInvoices || loadingExpenses;



  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading financial data...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Check if user is authenticated
  if (!user) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-destructive mb-2">Authentication Required</h2>
            <p className="text-muted-foreground">Please log in to view financial data.</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8 pb-8">
        {/* Header Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-800/10 via-transparent to-slate-800/10 rounded-2xl" />
          <div className="relative p-6 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-800 rounded-lg">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Financial Dashboard
                  </h1>
                  <p className="text-muted-foreground mt-1 text-lg">
                    Comprehensive financial overview and insights
                  </p>
                </div>
              </div>
              
              {/* Period Selector */}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div className="flex bg-slate-100 rounded-lg p-1">
                  {(['month', 'quarter', 'year'] as const).map((period) => (
                    <Button
                      key={period}
                      variant={selectedPeriod === period ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setSelectedPeriod(period)}
                      className={cn(
                        'text-xs',
                        selectedPeriod === period && 'bg-slate-800 text-white'
                      )}
                    >
                      {period.charAt(0).toUpperCase() + period.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <div className="w-1 h-6 bg-slate-700 rounded-full" />
            Financial Summary
          </h2>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Sales Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{salesOrders.length}</div>
                <p className="text-xs text-muted-foreground">Total orders</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{invoices.length}</div>
                <p className="text-xs text-muted-foreground">Total invoices</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{expenses.length}</div>
                <p className="text-xs text-muted-foreground">Expense entries</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <div className="w-1 h-6 bg-blue-600 rounded-full" />
            Quick Actions
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <FileText className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                <h3 className="font-semibold">Create Sales Order</h3>
                <p className="text-sm text-muted-foreground">Generate new sales order</p>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <Receipt className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                <h3 className="font-semibold">Create Invoice</h3>
                <p className="text-sm text-muted-foreground">Generate customer invoice</p>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <CreditCard className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                <h3 className="font-semibold">Record Expense</h3>
                <p className="text-sm text-muted-foreground">Add new expense</p>
              </CardContent>
            </Card>
            
            <Card 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate('/budget')}
            >
              <CardContent className="p-6 text-center">
                <BarChart3 className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                <h3 className="font-semibold">Budget Tracking</h3>
                <p className="text-sm text-muted-foreground">Monitor project budgets</p>
              </CardContent>
            </Card>

            {/* Test button to create sample sales order */}
            <Card
              className="cursor-pointer hover:shadow-md transition-shadow bg-blue-50 border-blue-200"
              onClick={async () => {
                try {
                  // First try to seed data
                  await fetch('http://localhost:3000/api/sales-orders?seed=true', {
                    method: 'GET',
                    headers: {
                      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                      'Content-Type': 'application/json'
                    }
                  });

                  toast.success('Test sales orders created!');
                  // Refetch data by reloading
                  window.location.reload();
                } catch (error: any) {
                  console.error('Seed error:', error);
                  toast.error('Failed to create test orders: ' + (error.message || 'Unknown error'));
                }
              }}
            >
              <CardContent className="p-6 text-center">
                <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-blue-800">Create Test Orders</h3>
                <p className="text-sm text-blue-600">Add sample sales orders</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <div className="w-1 h-6 bg-green-600 rounded-full" />
            Recent Financial Activity
          </h2>
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground py-8">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Recent activity will appear here</p>
                <p className="text-sm">Track your latest financial transactions and updates</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default FinancialDashboard;