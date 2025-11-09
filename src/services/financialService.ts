import api from './api';

export interface FinancialDocument {
  id: string;
  type: 'sales_order' | 'purchase_order' | 'customer_invoice' | 'vendor_bill' | 'expense';
  projectId?: string;
  amount: number;
  status: string;
  date: string;
  partner: string;
  description: string;
}

export interface ProjectFinancials {
  revenue: number;
  cost: number;
  profit: number;
  budgetUsage: number;
}

class FinancialService {
  // Project Financial Analytics
  async getProjectFinancialAnalytics(projectId: string) {
    const response = await api.get(`/financial/projects/${projectId}/analytics`);
    return response.data;
  }

  async getProjectFinancialDocuments(projectId: string) {
    const response = await api.get<FinancialDocument[]>(
      `/financial/projects/${projectId}/documents`
    );
    return response.data;
  }

  async getProjectRevenue(projectId: string) {
    const response = await api.get(`/financial/projects/${projectId}/revenue`);
    return response.data;
  }

  async getProjectCost(projectId: string) {
    const response = await api.get(`/financial/projects/${projectId}/cost`);
    return response.data;
  }

  async getProjectProfit(projectId: string) {
    const response = await api.get(`/financial/projects/${projectId}/profit`);
    return response.data;
  }

  async getBudgetUsage(projectId: string) {
    const response = await api.get(`/financial/projects/${projectId}/budget-usage`);
    return response.data;
  }

  async getProjectBudgetBreakdown(projectId: string) {
    const response = await api.get(`/financial/projects/${projectId}/budget-breakdown`);
    return response.data.data || response.data;
  }

  async getAllProjectsBudgetSummary() {
    const response = await api.get(`/financial/budget-summary`);
    return response.data.data || response.data;
  }

  // Sales Orders
  async getAllSalesOrders(filters?: any) {
    const response = await api.get<FinancialDocument[]>('/sales-orders', {
      params: filters,
    });
    return response.data;
  }

  async createSalesOrder(data: any) {
    const response = await api.post<FinancialDocument>('/sales-orders', data);
    return response.data;
  }

  // Purchase Orders
  async getAllPurchaseOrders(filters?: any) {
    const response = await api.get<FinancialDocument[]>('/purchase-orders', {
      params: filters,
    });
    return response.data;
  }

  async createPurchaseOrder(data: any) {
    const response = await api.post<FinancialDocument>('/purchase-orders', data);
    return response.data;
  }

  // Customer Invoices
  async getAllInvoices(filters?: any) {
    const response = await api.get<FinancialDocument[]>('/customer-invoices', {
      params: filters,
    });
    return response.data;
  }

  async createInvoice(data: any) {
    const response = await api.post<FinancialDocument>('/customer-invoices', data);
    return response.data;
  }

  async updateInvoice(id: string, data: any) {
    const response = await api.put<FinancialDocument>(`/customer-invoices/${id}`, data);
    return response.data;
  }

  async deleteInvoice(id: string) {
    const response = await api.delete(`/customer-invoices/${id}`);
    return response.data;
  }

  // Vendor Bills
  async getAllVendorBills(filters?: any) {
    const response = await api.get<FinancialDocument[]>('/vendor-bills', {
      params: filters,
    });
    return response.data;
  }

  async createVendorBill(data: any) {
    const response = await api.post<FinancialDocument>('/vendor-bills', data);
    return response.data;
  }

  async updateVendorBill(id: string, data: any) {
    const response = await api.put(`/vendor-bills/${id}`, data);
    return response.data;
  }

  async deleteVendorBill(id: string) {
    await api.delete(`/vendor-bills/${id}`);
  }

  // Expenses
  async getAllExpenses(filters?: any) {
    const response = await api.get('/expenses', {
      params: filters,
    });
    return response.data.expenses || response.data;
  }

  async createExpense(data: any) {
    const response = await api.post('/expenses', data);
    return response.data.expense || response.data;
  }

  async updateExpense(id: string, data: any) {
    const response = await api.put(`/expenses/${id}`, data);
    return response.data.expense || response.data;
  }

  async deleteExpense(id: string) {
    await api.delete(`/expenses/${id}`);
  }
}

export default new FinancialService();
