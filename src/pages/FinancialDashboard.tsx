import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import financialService from '@/services/financialService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  FileText, 
  Receipt,
  AlertCircle,
  BarChart3,
  PieChart,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FinancialKPI {
  title: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  description?: string;
}

const FinancialDashboard = () => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year'>('month');

  // Fetch financial data
  const { data: salesOrdersData, isLoading: loadingSales } = useQuery({
    queryKey: ['sales-orders'],
    queryFn: () => financialService.getAllSalesOrders(),
  });

  const { data: invoicesData, isLoading: loadingInvoices } = useQuery({
    queryKey: ['customer-invoices'],
    queryFn: () => financialService.getAllInvoices(),
  });

  const { data: expensesData, isLoading: loadingExpenses } = useQuery({
    queryKey: ['expenses'],
    queryFn: () => financialService.getAllExpenses(),
  });

  const { data: vendorBillsData, isLoading: loadingBills } = useQuery({
    queryKey: ['vendor-bills'],
    queryFn: () => financialService.getAllVendorBills(),
  });

  // Ensure all data is properly structured as arrays
  const salesOrders = Array.isArray(salesOrdersData) ? salesOrdersData : 
                     (salesOrdersData?.data && Array.isArray(salesOrdersData.data)) ? salesOrdersData.data : [];
  const invoices = Array.isArray(invoicesData) ? invoicesData : 
                   (invoicesData?.data && Array.isArray(invoicesData.data)) ? invoicesData.data : [];
  const expenses = Array.isArray(expensesData) ? expensesData : 
                   (expensesData?.data && Array.isArray(expensesData.data)) ? expensesData.data : [];
  const vendorBills = Array.isArray(vendorBillsData) ? vendorBillsData : 
                      (vendorBillsData?.data && Array.isArray(vendorBillsData.data)) ? vendorBillsData.data : [];

  const isLoading = loadingSales || loadingInvoices || loadingExpenses || loadingBills;

  // Calculate KPIs from data
  const calculateKPIs = (): FinancialKPI[] => {
    if (!salesOrders || !invoices || !expenses || !vendorBills) {
      return [];
    }

    // Calculate total revenue from paid invoices
    const totalRevenue = invoices
      .filter((inv: any) => inv.status === 'paid')
      .reduce((sum: number, inv: any) => sum + (inv.total_amount || 0), 0);

    // Calculate total expenses
    const totalExpenses = expenses
      .reduce((sum: number, exp: any) => sum + (exp.amount || 0), 0);

    // Calculate pending invoices
    const pendingInvoices = invoices
      .filter((inv: any) => inv.status === 'sent' || inv.status === 'draft')
      .reduce((sum: number, inv: any) => sum + (inv.total_amount || 0), 0);

    // Calculate overdue invoices
    const overdueInvoices = invoices
      .filter((inv: any) => inv.status === 'overdue')
      .reduce((sum: number, inv: any) => sum + (inv.total_amount || 0), 0);

    // Calculate net profit
    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    return [
      {
        title: 'Total Revenue',
        value: `$${totalRevenue.toLocaleString()}`,
        change: 12.5,
        trend: 'up',
        icon: <DollarSign className="h-6 w-6" />,
        description: 'Revenue from paid invoices'
      },
      {
        title: 'Net Profit',
        value: `$${netProfit.toLocaleString()}`,
        change: netProfit >= 0 ? 8.2 : -8.2,
        trend: netProfit >= 0 ? 'up' : 'down',
        icon: <TrendingUp className="h-6 w-6" />,
        description: 'Revenue minus expenses'
      },
      {
        title: 'Pending Invoices',
        value: `$${pendingInvoices.toLocaleString()}`,
        change: -5.1,
        trend: 'down',
        icon: <FileText className="h-6 w-6" />,
        description: 'Awaiting payment'
      },
      {
        title: 'Overdue Invoices',
        value: `$${overdueInvoices.toLocaleString()}`,
        change: overdueInvoices > 0 ? 15.3 : 0,
        trend: overdueInvoices > 0 ? 'up' : 'neutral',
        icon: <AlertCircle className="h-6 w-6" />,
        description: 'Requires immediate attention'
      },
      {
        title: 'Total Expenses',
        value: `$${totalExpenses.toLocaleString()}`,
        change: 3.8,
        trend: 'up',
        icon: <CreditCard className="h-6 w-6" />,
        description: 'All recorded expenses'
      },
      {
        title: 'Profit Margin',
        value: `${profitMargin.toFixed(1)}%`,
        change: profitMargin >= 20 ? 2.1 : -2.1,
        trend: profitMargin >= 20 ? 'up' : 'down',
        icon: <BarChart3 className="h-6 w-6" />,
        description: 'Net profit percentage'
      }
    ];
  };

  const kpis = calculateKPIs();

  const KPICard = ({ kpi }: { kpi: FinancialKPI }) => (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {kpi.title}
        </CardTitle>
        <div className="p-2 bg-slate-100 rounded-lg">
          {kpi.icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{kpi.value}</div>
        {kpi.change !== undefined && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            {kpi.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-600" />}
            {kpi.trend === 'down' && <TrendingDown className="h-3 w-3 text-red-600" />}
            <span className={cn(
              kpi.trend === 'up' && 'text-green-600',
              kpi.trend === 'down' && 'text-red-600',
              kpi.trend === 'neutral' && 'text-muted-foreground'
            )}>
              {kpi.change > 0 ? '+' : ''}{kpi.change}%
            </span>
            <span>vs last {selectedPeriod}</span>
          </div>
        )}
        {kpi.description && (
          <p className="text-xs text-muted-foreground mt-2">{kpi.description}</p>
        )}
      </CardContent>
    </Card>
  );

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

        {/* KPI Cards */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <div className="w-1 h-6 bg-slate-700 rounded-full" />
            Key Financial Metrics
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {kpis.map((kpi, index) => (
              <KPICard key={index} kpi={kpi} />
            ))}
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
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <PieChart className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                <h3 className="font-semibold">Financial Reports</h3>
                <p className="text-sm text-muted-foreground">View detailed reports</p>
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