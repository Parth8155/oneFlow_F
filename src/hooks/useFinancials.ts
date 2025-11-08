import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import financialService from '@/services/financialService';

// Project Analytics
export const useProjectFinancialAnalytics = (projectId: string) => {
  return useQuery({
    queryKey: ['financials', 'analytics', projectId],
    queryFn: async () => {
      try {
        return await financialService.getProjectFinancialAnalytics(projectId);
      } catch (error) {
        console.error('Failed to fetch project financial analytics:', error);
        throw error;
      }
    },
    enabled: !!projectId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useProjectRevenue = (projectId: string) => {
  return useQuery({
    queryKey: ['financials', 'revenue', projectId],
    queryFn: async () => {
      try {
        return await financialService.getProjectRevenue(projectId);
      } catch (error) {
        console.error('Failed to fetch project revenue:', error);
        throw error;
      }
    },
    enabled: !!projectId,
    staleTime: 10 * 60 * 1000,
  });
};

export const useProjectCost = (projectId: string) => {
  return useQuery({
    queryKey: ['financials', 'cost', projectId],
    queryFn: async () => {
      try {
        return await financialService.getProjectCost(projectId);
      } catch (error) {
        console.error('Failed to fetch project cost:', error);
        throw error;
      }
    },
    enabled: !!projectId,
    staleTime: 10 * 60 * 1000,
  });
};

export const useProjectProfit = (projectId: string) => {
  return useQuery({
    queryKey: ['financials', 'profit', projectId],
    queryFn: async () => {
      try {
        return await financialService.getProjectProfit(projectId);
      } catch (error) {
        console.error('Failed to fetch project profit:', error);
        throw error;
      }
    },
    enabled: !!projectId,
    staleTime: 10 * 60 * 1000,
  });
};

export const useBudgetUsage = (projectId: string) => {
  return useQuery({
    queryKey: ['financials', 'budget', projectId],
    queryFn: async () => {
      try {
        return await financialService.getBudgetUsage(projectId);
      } catch (error) {
        console.error('Failed to fetch budget usage:', error);
        throw error;
      }
    },
    enabled: !!projectId,
    staleTime: 10 * 60 * 1000,
  });
};

// Sales Orders
export const useSalesOrders = () => {
  return useQuery({
    queryKey: ['financials', 'sales-orders'],
    queryFn: async () => {
      try {
        return await financialService.getAllSalesOrders();
      } catch (error) {
        console.error('Failed to fetch sales orders:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateSalesOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      try {
        return await financialService.createSalesOrder(data);
      } catch (error) {
        console.error('Failed to create sales order:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financials', 'sales-orders'] });
    },
  });
};

// Purchase Orders
export const usePurchaseOrders = () => {
  return useQuery({
    queryKey: ['financials', 'purchase-orders'],
    queryFn: async () => {
      try {
        return await financialService.getAllPurchaseOrders();
      } catch (error) {
        console.error('Failed to fetch purchase orders:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreatePurchaseOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      try {
        return await financialService.createPurchaseOrder(data);
      } catch (error) {
        console.error('Failed to create purchase order:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financials', 'purchase-orders'] });
    },
  });
};

// Customer Invoices
export const useCustomerInvoices = () => {
  return useQuery({
    queryKey: ['financials', 'invoices'],
    queryFn: async () => {
      try {
        return await financialService.getAllInvoices();
      } catch (error) {
        console.error('Failed to fetch customer invoices:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateCustomerInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      try {
        return await financialService.createInvoice(data);
      } catch (error) {
        console.error('Failed to create customer invoice:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financials', 'invoices'] });
    },
  });
};

// Vendor Bills
export const useVendorBills = () => {
  return useQuery({
    queryKey: ['financials', 'vendor-bills'],
    queryFn: async () => {
      try {
        return await financialService.getAllVendorBills();
      } catch (error) {
        console.error('Failed to fetch vendor bills:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateVendorBill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      try {
        return await financialService.createVendorBill(data);
      } catch (error) {
        console.error('Failed to create vendor bill:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financials', 'vendor-bills'] });
    },
  });
};

// Expenses
export const useExpenses = () => {
  return useQuery({
    queryKey: ['financials', 'expenses'],
    queryFn: async () => {
      try {
        return await financialService.getAllExpenses();
      } catch (error) {
        console.error('Failed to fetch expenses:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      try {
        return await financialService.createExpense(data);
      } catch (error) {
        console.error('Failed to create expense:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financials', 'expenses'] });
    },
  });
};
