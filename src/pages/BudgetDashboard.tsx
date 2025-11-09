import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  PieChart, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  CheckCircle,
  CreditCard,
  Receipt,
  Clock,
  Eye,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  Calendar,
  FileText
} from 'lucide-react';
import financialService from '@/services/financialService';
import { cn } from '@/lib/utils';

interface BudgetSummary {
  projectId: number;
  projectName: string;
  projectStatus: string;
  budget: number;
  spent: number;
  remaining: number;
  usagePercentage: number;
  isOverBudget: boolean;
  isNearBudget: boolean;
}

interface BudgetBreakdown {
  project: {
    id: number;
    name: string;
    budget: number;
  };
  budget: {
    total: number;
    spent: number;
    remaining: number;
    usagePercentage: number;
    isOverBudget: boolean;
  };
  breakdown: {
    vendorBills: {
      total: number;
      percentage: number;
      count: number;
      items: any[];
    };
    expenses: {
      total: number;
      percentage: number;
      count: number;
      items: any[];
    };
    timesheetCosts: {
      total: number;
      percentage: number;
      count: number;
      items: any[];
    };
    customerInvoices: {
      total: number;
      percentage: number;
      count: number;
      items: any[];
    };
  };
  alerts: {
    isOverBudget: boolean;
    isNearBudget: boolean;
    percentageUsed: number;
  };
}

const BudgetDashboard = () => {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch all projects budget summary
  const { data: budgetSummaryResponse = [], isLoading: loadingSummary } = useQuery({
    queryKey: ['budget-summary'],
    queryFn: () => financialService.getAllProjectsBudgetSummary(),
  });

  // Ensure budgetSummary is always an array
  const budgetSummary = Array.isArray(budgetSummaryResponse) ? budgetSummaryResponse : [];

  // Mutations for update and delete operations
  const updateExpenseMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => financialService.updateExpense(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget-breakdown', selectedProject] });
      queryClient.invalidateQueries({ queryKey: ['budget-summary'] });
      setEditDialogOpen(false);
      setEditingItem(null);
    },
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: (id: string) => financialService.deleteExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget-breakdown', selectedProject] });
      queryClient.invalidateQueries({ queryKey: ['budget-summary'] });
    },
  });

  const updateVendorBillMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => financialService.updateVendorBill(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget-breakdown', selectedProject] });
      queryClient.invalidateQueries({ queryKey: ['budget-summary'] });
      setEditDialogOpen(false);
      setEditingItem(null);
    },
  });

  const deleteVendorBillMutation = useMutation({
    mutationFn: (id: string) => financialService.deleteVendorBill(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget-breakdown', selectedProject] });
      queryClient.invalidateQueries({ queryKey: ['budget-summary'] });
    },
  });

  const updateCustomerInvoiceMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => financialService.updateInvoice(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget-breakdown', selectedProject] });
      queryClient.invalidateQueries({ queryKey: ['budget-summary'] });
      setEditDialogOpen(false);
      setEditingItem(null);
    },
  });

  const deleteCustomerInvoiceMutation = useMutation({
    mutationFn: (id: string) => financialService.deleteInvoice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget-breakdown', selectedProject] });
      queryClient.invalidateQueries({ queryKey: ['budget-summary'] });
    },
  });

  // Fetch detailed breakdown for selected project
  const { data: budgetBreakdown, isLoading: loadingBreakdown } = useQuery({
    queryKey: ['budget-breakdown', selectedProject],
    queryFn: () => selectedProject ? financialService.getProjectBudgetBreakdown(selectedProject.toString()) : null,
    enabled: !!selectedProject,
  });

  const getBudgetStatusColor = (usagePercentage: number, isOverBudget: boolean) => {
    if (isOverBudget) return 'text-red-600 bg-red-50 border-red-200';
    if (usagePercentage > 85) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (usagePercentage > 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const getBudgetIcon = (usagePercentage: number, isOverBudget: boolean) => {
    if (isOverBudget) return <AlertTriangle className="h-4 w-4" />;
    if (usagePercentage > 85) return <TrendingUp className="h-4 w-4" />;
    return <CheckCircle className="h-4 w-4" />;
  };

  const getBudgetStatus = (usagePercentage: number, isOverBudget: boolean) => {
    if (isOverBudget) return 'Over Budget';
    if (usagePercentage > 85) return 'Near Budget';
    if (usagePercentage > 50) return 'On Track';
    return 'Under Budget';
  };

  const handleEditItem = (item: any, type: 'expense' | 'vendorBill' | 'customerInvoice') => {
    setEditingItem({ ...item, type });
    setEditDialogOpen(true);
  };

  const handleDeleteItem = (item: any, type: 'expense' | 'vendorBill' | 'customerInvoice') => {
    if (confirm(`Are you sure you want to delete this ${type}?`)) {
      if (type === 'expense') {
        deleteExpenseMutation.mutate(item.id.toString());
      } else if (type === 'vendorBill') {
        deleteVendorBillMutation.mutate(item.id.toString());
      } else if (type === 'customerInvoice') {
        deleteCustomerInvoiceMutation.mutate(item.id.toString());
      }
    }
  };

  const handleUpdateItem = (formData: any) => {
    if (!editingItem) return;
    
    if (editingItem.type === 'expense') {
      updateExpenseMutation.mutate({
        id: editingItem.id.toString(),
        data: {
          description: formData.description,
          amount: parseFloat(formData.amount),
          expense_date: formData.date,
        }
      });
    } else if (editingItem.type === 'vendorBill') {
      updateVendorBillMutation.mutate({
        id: editingItem.id.toString(),
        data: {
          vendor_name: formData.vendor_name,
          amount: parseFloat(formData.amount),
          bill_date: formData.date,
        }
      });
    } else if (editingItem.type === 'customerInvoice') {
      updateCustomerInvoiceMutation.mutate({
        id: editingItem.id.toString(),
        data: {
          customer_name: formData.customer_name,
          amount: parseFloat(formData.amount),
          invoice_date: formData.date,
        }
      });
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (loadingSummary) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading budget data...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 pb-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-xl p-10 mb-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-800 dark:bg-slate-700 rounded-xl shadow-lg">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">Budget Management</h1>
                <p className="text-lg text-slate-600 dark:text-slate-300">Track project budgets and spending</p>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Budget List */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Projects Budget Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {budgetSummary.map((project: BudgetSummary) => (
                <div 
                  key={project.projectId}
                  className={cn(
                    "p-4 rounded-lg border cursor-pointer transition-colors hover:bg-slate-50",
                    selectedProject === project.projectId && "ring-2 ring-slate-200 bg-slate-50"
                  )}
                  onClick={() => setSelectedProject(project.projectId)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{project.projectName}</h3>
                    <Badge className={cn("text-xs", getBudgetStatusColor(project.usagePercentage, project.isOverBudget))}>
                      {getBudgetIcon(project.usagePercentage, project.isOverBudget)}
                      <span className="ml-1">{getBudgetStatus(project.usagePercentage, project.isOverBudget)}</span>
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Budget: ₹{project.budget.toLocaleString()}</span>
                      <span>Spent: ₹{project.spent.toLocaleString()}</span>
                    </div>
                    
                    <Progress 
                      value={Math.min(project.usagePercentage, 100)} 
                      className="h-2"
                    />
                    
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{project.usagePercentage.toFixed(1)}% used</span>
                      <span className={project.remaining < 0 ? 'text-red-600' : 'text-green-600'}>
                        ₹{Math.abs(project.remaining).toLocaleString()} {project.remaining < 0 ? 'over' : 'remaining'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              {budgetSummary.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <PieChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No projects with budgets found</p>
                  <p className="text-sm">Set budgets for your projects to track spending</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Detailed Budget Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Budget Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedProject && budgetBreakdown ? (
                <div className="space-y-6">
                  {/* Project Info */}
                  <div>
                    <h3 className="font-semibold text-lg">{budgetBreakdown.project.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Budget: ₹{budgetBreakdown.budget.total.toLocaleString()}
                    </p>
                  </div>

                  {/* Budget Alerts */}
                  {budgetBreakdown.alerts.isOverBudget && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        This project is over budget by ₹{(budgetBreakdown.budget.spent - budgetBreakdown.budget.total).toLocaleString()}
                      </AlertDescription>
                    </Alert>
                  )}

                  {budgetBreakdown.alerts.isNearBudget && !budgetBreakdown.alerts.isOverBudget && (
                    <Alert className="border-orange-200 bg-orange-50">
                      <TrendingUp className="h-4 w-4 text-orange-600" />
                      <AlertDescription className="text-orange-800">
                        This project is near budget limit ({budgetBreakdown.alerts.percentageUsed.toFixed(1)}% used)
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Revenue Information */}
                  {budgetBreakdown.revenue && (
                    <div className="border rounded-lg p-4 bg-green-50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <Receipt className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-green-800">Project Revenue</h4>
                            <p className="text-xs text-green-600">Customer Invoices</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          {budgetBreakdown.revenue.count}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="font-semibold text-green-800">₹{budgetBreakdown.revenue.total.toLocaleString()}</div>
                        <div className="text-xs text-green-600">
                          {budgetBreakdown.revenue.percentage.toFixed(1)}% of budget
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Spending Categories */}
                  <div className="space-y-4">
                    {/* Customer Invoices */}
                    {budgetBreakdown.breakdown.customerInvoices && (
                    <div className="border rounded-lg">
                      <Button
                        variant="ghost"
                        onClick={() => toggleSection('customerInvoices')}
                        className="w-full flex items-center justify-between p-3 h-auto"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-green-600" />
                          <span className="font-medium">Customer Invoices</span>
                          <Badge variant="outline" className="bg-green-100 text-green-800">{budgetBreakdown.breakdown.customerInvoices?.count || 0}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <div className="font-semibold text-green-800">₹{budgetBreakdown.breakdown.customerInvoices?.total?.toLocaleString() || '0'}</div>
                            <div className="text-xs text-green-600">
                              {budgetBreakdown.breakdown.customerInvoices?.percentage?.toFixed(1) || '0'}% of budget
                            </div>
                          </div>
                          {expandedSection === 'customerInvoices' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </div>
                      </Button>

                      {expandedSection === 'customerInvoices' && (
                        <div className="border-t bg-green-50">
                          {budgetBreakdown.breakdown.customerInvoices?.items?.length > 0 ? (
                            <div className="p-3 space-y-2">
                              {budgetBreakdown.breakdown.customerInvoices.items.map((invoice: any) => (
                                <div key={invoice.id} className="flex items-center justify-between p-2 bg-white rounded border">
                                  <div className="flex-1">
                                    <div className="font-medium text-sm">{invoice.customer_name}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {invoice.invoice_number} • {new Date(invoice.invoice_date).toLocaleDateString()}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-green-800">₹{parseFloat(invoice.amount).toLocaleString()}</span>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleEditItem(invoice, 'customerInvoice')}
                                    >
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleDeleteItem(invoice, 'customerInvoice')}
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-4 text-center text-muted-foreground text-sm">
                              No customer invoices for this project
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    )}

                    {/* Vendor Bills */}
                    <div className="border rounded-lg">
                      <Button
                        variant="ghost"
                        onClick={() => toggleSection('vendorBills')}
                        className="w-full flex items-center justify-between p-3 h-auto"
                      >
                        <div className="flex items-center gap-2">
                          <Receipt className="h-4 w-4 text-slate-600" />
                          <span className="font-medium">Vendor Bills</span>
                          <Badge variant="outline">{budgetBreakdown.breakdown.vendorBills.count}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <div className="font-semibold">₹{budgetBreakdown.breakdown.vendorBills.total.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">
                              {budgetBreakdown.breakdown.vendorBills.percentage.toFixed(1)}% of budget
                            </div>
                          </div>
                          {expandedSection === 'vendorBills' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </div>
                      </Button>
                      
                      {expandedSection === 'vendorBills' && (
                        <div className="border-t bg-slate-50">
                          {budgetBreakdown.breakdown.vendorBills.items.length > 0 ? (
                            <div className="p-3 space-y-2">
                              {budgetBreakdown.breakdown.vendorBills.items.map((bill: any) => (
                                <div key={bill.id} className="flex items-center justify-between p-2 bg-white rounded border">
                                  <div className="flex-1">
                                    <div className="font-medium text-sm">{bill.vendor_name}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {bill.bill_number} • {new Date(bill.bill_date).toLocaleDateString()}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold">₹{parseFloat(bill.amount).toLocaleString()}</span>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleEditItem(bill, 'vendorBill')}
                                    >
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleDeleteItem(bill, 'vendorBill')}
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-4 text-center text-muted-foreground text-sm">
                              No vendor bills for this project
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Expenses */}
                    <div className="border rounded-lg">
                      <Button
                        variant="ghost"
                        onClick={() => toggleSection('expenses')}
                        className="w-full flex items-center justify-between p-3 h-auto"
                      >
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-slate-600" />
                          <span className="font-medium">Expenses</span>
                          <Badge variant="outline">{budgetBreakdown.breakdown.expenses.count}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <div className="font-semibold">₹{budgetBreakdown.breakdown.expenses.total.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">
                              {budgetBreakdown.breakdown.expenses.percentage.toFixed(1)}% of budget
                            </div>
                          </div>
                          {expandedSection === 'expenses' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </div>
                      </Button>
                      
                      {expandedSection === 'expenses' && (
                        <div className="border-t bg-slate-50">
                          {budgetBreakdown.breakdown.expenses.items.length > 0 ? (
                            <div className="p-3 space-y-2">
                              {budgetBreakdown.breakdown.expenses.items.map((expense: any) => (
                                <div key={expense.id} className="flex items-center justify-between p-2 bg-white rounded border">
                                  <div className="flex-1">
                                    <div className="font-medium text-sm">{expense.description || 'No description'}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {expense.expense_number} • {new Date(expense.expense_date).toLocaleDateString()}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold">₹{parseFloat(expense.amount).toLocaleString()}</span>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleEditItem(expense, 'expense')}
                                    >
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleDeleteItem(expense, 'expense')}
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-4 text-center text-muted-foreground text-sm">
                              No expenses for this project
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Timesheet Costs */}
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-slate-600" />
                        <span className="font-medium">Labor Costs</span>
                        <Badge variant="outline">{budgetBreakdown.breakdown.timesheetCosts.count}</Badge>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">₹{budgetBreakdown.breakdown.timesheetCosts.total.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">
                          {budgetBreakdown.breakdown.timesheetCosts.percentage.toFixed(1)}% of budget
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Budget Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Spent</span>
                      <span className="font-semibold">₹{budgetBreakdown.budget.spent.toLocaleString()}</span>
                    </div>
                    <Progress 
                      value={Math.min(budgetBreakdown.budget.usagePercentage, 100)} 
                      className="h-3"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{budgetBreakdown.budget.usagePercentage.toFixed(1)}% of budget used</span>
                      <span className={budgetBreakdown.budget.remaining < 0 ? 'text-red-600' : 'text-green-600'}>
                        ₹{Math.abs(budgetBreakdown.budget.remaining).toLocaleString()} {budgetBreakdown.budget.remaining < 0 ? 'over' : 'remaining'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a project to view budget breakdown</p>
                  <p className="text-sm">Click on a project from the list to see detailed spending</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                Edit {editingItem?.type === 'expense' ? 'Expense' : editingItem?.type === 'vendorBill' ? 'Vendor Bill' : 'Customer Invoice'}
              </DialogTitle>
            </DialogHeader>
            
            {editingItem && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  handleUpdateItem({
                    description: formData.get('description'),
                    vendor_name: formData.get('vendor_name'),
                    customer_name: formData.get('customer_name'),
                    amount: formData.get('amount'),
                    date: formData.get('date'),
                  });
                }}
                className="space-y-4"
              >
                {editingItem.type === 'expense' ? (
                  <>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        defaultValue={editingItem.description || ''}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        step="0.01"
                        defaultValue={editingItem.amount}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="date">Expense Date</Label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        defaultValue={editingItem.expense_date}
                        required
                      />
                    </div>
                  </>
                ) : editingItem.type === 'vendorBill' ? (
                  <>
                    <div>
                      <Label htmlFor="vendor_name">Vendor Name</Label>
                      <Input
                        id="vendor_name"
                        name="vendor_name"
                        defaultValue={editingItem.vendor_name || ''}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        step="0.01"
                        defaultValue={editingItem.amount}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="date">Bill Date</Label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        defaultValue={editingItem.bill_date}
                        required
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <Label htmlFor="customer_name">Customer Name</Label>
                      <Input
                        id="customer_name"
                        name="customer_name"
                        defaultValue={editingItem.customer_name || ''}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        step="0.01"
                        defaultValue={editingItem.amount}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="date">Invoice Date</Label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        defaultValue={editingItem.invoice_date}
                        required
                      />
                    </div>
                  </>
                )}
                
                <div className="flex gap-2">
                  <Button 
                    type="submit" 
                    disabled={updateExpenseMutation.isPending || updateVendorBillMutation.isPending || updateCustomerInvoiceMutation.isPending}
                    className="flex-1"
                  >
                    {(updateExpenseMutation.isPending || updateVendorBillMutation.isPending || updateCustomerInvoiceMutation.isPending) ? 'Updating...' : 'Update'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default BudgetDashboard;