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
import financialService, { SalesOrderRecord, SalesOrdersResponse } from '@/services/financialService';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Trash2,
  IndianRupee,
  Calendar,
  User,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';

const SalesOrdersPage = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const queryClient = useQueryClient();

  // Form state for creating/editing sales orders
  const [formData, setFormData] = useState({
    order_number: '',
    customer_name: '',
    amount: '',
    status: 'draft' as const,
    order_date: new Date().toISOString().split('T')[0],
    description: ''
  });

  // Fetch sales orders
  const { data: salesOrdersData, isLoading, error } = useQuery<SalesOrdersResponse>({
    queryKey: ['sales-orders'],
    queryFn: () => financialService.getAllSalesOrders(),
  });

  const salesOrders: SalesOrderRecord[] = salesOrdersData?.salesOrders ?? [];

  // Create sales order mutation
  const createMutation = useMutation({
    mutationFn: (data: any) => financialService.createSalesOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales-orders'] });
      setIsCreateDialogOpen(false);
      resetForm();
    },
  });

  const resetForm = () => {
    setFormData({
      order_number: '',
      customer_name: '',
      amount: '',
      status: 'draft',
      order_date: new Date().toISOString().split('T')[0],
      description: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      amount: parseFloat(formData.amount),
    });
  };

  const formatAmount = (value: SalesOrderRecord['amount']) => {
    const numericValue = typeof value === 'string' ? parseFloat(value) : value ?? 0;
    if (Number.isNaN(numericValue)) {
      return '₹0.00';
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericValue);
  };

  const formatOrderDate = (dateString?: string | null) => {
    if (!dateString) {
      return 'No date';
    }
    const parsedDate = parseISO(dateString);
    if (Number.isNaN(parsedDate.getTime())) {
      return 'No date';
    }
    return format(parsedDate, 'MMM dd, yyyy');
  };

  const searchTermLower = searchTerm.trim().toLowerCase();

  const filteredOrders = salesOrders.filter((order) => {
    const matchesSearch =
      !searchTermLower ||
      order.customer_name.toLowerCase().includes(searchTermLower) ||
      order.order_number.toLowerCase().includes(searchTermLower);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading sales orders...</p>
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
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Sales Orders</h1>
              <p className="text-muted-foreground">Manage and track sales orders</p>
            </div>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-slate-800 hover:bg-slate-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Order
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create Sales Order</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="order_number">Order Number</Label>
                  <Input
                    id="order_number"
                    value={formData.order_number}
                    onChange={(e) => setFormData({ ...formData, order_number: e.target.value })}
                    required
                    placeholder="SO-2024-001"
                  />
                </div>
                
                <div>
                  <Label htmlFor="customer_name">Customer Name</Label>
                  <Input
                    id="customer_name"
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    required
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
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="order_date">Order Date</Label>
                  <Input
                    id="order_date"
                    type="date"
                    value={formData.order_date}
                    onChange={(e) => setFormData({ ...formData, order_date: e.target.value })}
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
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button type="submit" disabled={createMutation.isPending} className="flex-1">
                    {createMutation.isPending ? 'Creating...' : 'Create Order'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by customer name or order number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-destructive">
                {(error as Error)?.message ?? 'Failed to load sales orders.'}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Sales Orders Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">
                    {order.order_number || `SO-${String(order.id).padStart(4, '0')}`}
                  </CardTitle>
                  <Badge className={cn(getStatusColor(order.status))}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{order.customer_name}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <IndianRupee className="h-4 w-4 text-green-600" />
                  <span className="font-semibold">{formatAmount(order.amount)}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{formatOrderDate(order.order_date)}</span>
                </div>
                
                {order.description && (
                  <div className="text-sm text-muted-foreground">
                    <p className="truncate">{order.description}</p>
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-muted-foreground">
                    Sales Order
                  </span>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No sales orders found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Create your first sales order to get started'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-slate-800 hover:bg-slate-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Order
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default SalesOrdersPage;