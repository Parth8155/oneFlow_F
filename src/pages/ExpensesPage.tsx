import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import financialService from '@/services/financialService';
import { 
  CreditCard, 
  Plus, 
  Search, 
  Filter, 
  DollarSign,
  Calendar,
  Tag,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  PieChart,
  Edit,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const ExpensesPage = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const queryClient = useQueryClient();

  // Form state for creating/editing expenses
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'office_supplies',
    description: '',
    expense_date: new Date().toISOString().split('T')[0],
  });

  // Fetch expenses
  const { data: expensesData, isLoading, error } = useQuery({
    queryKey: ['expenses'],
    queryFn: () => financialService.getAllExpenses(),
  });

  // Ensure expenses is always an array
  const expenses = Array.isArray(expensesData) ? expensesData : 
                   (expensesData?.expenses && Array.isArray(expensesData.expenses)) ? expensesData.expenses : [];

  // Create expense mutation
  const createMutation = useMutation({
    mutationFn: (data: any) => financialService.createExpense(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      setIsCreateDialogOpen(false);
      resetForm();
    },
  });

  // Update expense mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      financialService.updateExpense(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      setIsEditDialogOpen(false);
      setEditingExpense(null);
      resetForm();
    },
  });

  // Delete expense mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => financialService.deleteExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      amount: '',
      category: 'office_supplies',
      description: '',
      expense_date: new Date().toISOString().split('T')[0],
    });
    setEditingExpense(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingExpense) {
      // Update existing expense
      updateMutation.mutate({
        id: editingExpense.id,
        data: {
          description: formData.title || formData.description,
          amount: parseFloat(formData.amount),
          expense_date: formData.expense_date,
          type: formData.category,
          is_billable: false,
        },
      });
    } else {
      // Create new expense
      createMutation.mutate({
        description: formData.title || formData.description,
        amount: parseFloat(formData.amount),
        expense_date: formData.expense_date,
        type: formData.category,
        is_billable: false,
      });
    }
  };

  const handleEditExpense = (expense: any) => {
    setEditingExpense(expense);
    setFormData({
      title: expense.description || '',
      amount: expense.amount?.toString() || '',
      category: expense.type || 'office_supplies',
      description: expense.description || '',
      expense_date: expense.expense_date || new Date().toISOString().split('T')[0],
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteExpense = (expenseId: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      deleteMutation.mutate(expenseId);
    }
  };

  // Define expense categories
  const expenseCategories = [
    { value: 'office_supplies', label: 'Office Supplies' },
    { value: 'travel', label: 'Travel' },
    { value: 'meals', label: 'Meals & Entertainment' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'software', label: 'Software' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'training', label: 'Training' },
    { value: 'other', label: 'Other' },
  ];

  // Filter expenses
  const filteredExpenses = expenses.filter((expense: any) => {
    const matchesSearch = expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.partner?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || expense.type === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Calculate expense statistics
  const totalExpenses = expenses.reduce((sum: number, expense: any) => sum + (parseFloat(expense.amount) || 0), 0);
  // Group expenses by category for summary
  const expensesByCategory = expenses.reduce((acc: any, expense: any) => {
    const category = expense.type || 'other';
    acc[category] = (acc[category] || 0) + (parseFloat(expense.amount) || 0);
    return acc;
  }, {});

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      office_supplies: 'bg-blue-100 text-blue-800',
      travel: 'bg-green-100 text-green-800',
      meals: 'bg-orange-100 text-orange-800',
      equipment: 'bg-purple-100 text-purple-800',
      software: 'bg-indigo-100 text-indigo-800',
      utilities: 'bg-yellow-100 text-yellow-800',
      marketing: 'bg-pink-100 text-pink-800',
      training: 'bg-emerald-100 text-emerald-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || colors.other;
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading expenses...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-800 rounded-lg">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
              <p className="text-muted-foreground">Track and manage business expenses</p>
            </div>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-slate-800 hover:bg-slate-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="Enter expense title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {expenseCategories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="expense_date">Expense Date</Label>
                  <Input
                    id="expense_date"
                    type="date"
                    value={formData.expense_date}
                    onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    placeholder="Optional description"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button type="submit" disabled={createMutation.isPending} className="flex-1">
                    {createMutation.isPending ? 'Adding...' : 'Add Expense'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Edit Expense Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Expense</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="Enter expense title"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-amount">Amount</Label>
                <Input
                  id="edit-amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="edit-expense_date">Expense Date</Label>
                <Input
                  id="edit-expense_date"
                  type="date"
                  value={formData.expense_date}
                  onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Optional description"
                />
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" disabled={updateMutation.isPending} className="flex-1">
                  {updateMutation.isPending ? 'Updating...' : 'Update Expense'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Expenses</p>
                  <p className="text-xl font-bold">₹{totalExpenses.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Tag className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Categories</p>
                  <p className="text-xl font-bold">{Object.keys(expensesByCategory).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Expenses by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-3">
              {Object.entries(expensesByCategory).map(([category, amount]: [string, any]) => (
                <div key={category} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Badge className={getCategoryColor(category)}>
                      {expenseCategories.find(cat => cat.value === category)?.label || category}
                    </Badge>
                  </div>
                  <span className="font-semibold">₹{(parseFloat(amount) || 0).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search expenses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {expenseCategories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Expenses Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredExpenses.map((expense: any) => (
            <Card key={expense.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold truncate">
                    {expense.description || `Expense ${expense.id}`}
                  </CardTitle>
                  <Badge className={getCategoryColor(expense.type || 'other')}>
                    {expenseCategories.find(cat => cat.value === expense.type)?.label || 'Other'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-red-600" />
                  <span className="font-semibold text-red-600">₹{(parseFloat(expense.amount) || 0).toLocaleString()}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{expense.date ? format(new Date(expense.date), 'MMM dd, yyyy') : 'No date'}</span>
                </div>
                
                {expense.partner && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Tag className="h-4 w-4" />
                    <span>{expense.partner}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-muted-foreground">
                    {expense.type?.replace('_', ' ').toUpperCase()}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditExpense(expense)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredExpenses.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No expenses found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || categoryFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Add your first expense to get started'
                }
              </p>
              {!searchTerm && categoryFilter === 'all' && (
                <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-slate-800 hover:bg-slate-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Expense
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default ExpensesPage;