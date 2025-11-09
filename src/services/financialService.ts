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

export interface BudgetSummaryRecord {
  projectId: number;
  projectName: string;
  projectStatus?: string;
  budget: number;
  spent: number;
  remaining: number;
  usagePercentage: number;
  isOverBudget: boolean;
  isNearBudget: boolean;
}

export interface BudgetBreakdownCategory {
  total: number;
  percentage: number;
  count: number;
  items: any[];
}

export interface BudgetBreakdownResponse {
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
  revenue?: BudgetBreakdownCategory;
  breakdown: {
    customerInvoices: BudgetBreakdownCategory;
    vendorBills: BudgetBreakdownCategory;
    expenses: BudgetBreakdownCategory;
    timesheetCosts: BudgetBreakdownCategory;
  };
  alerts: {
    isOverBudget: boolean;
    isNearBudget: boolean;
    percentageUsed: number;
  };
}

export interface SalesOrderRecord {
  id: number;
  order_number: string;
  customer_name: string;
  amount: number | string;
  description?: string | null;
  status: 'draft' | 'confirmed' | 'cancelled';
  order_date: string;
  project?: {
    id: number;
    name: string;
  } | null;
  createdBy?: {
    id: number;
    username: string;
    full_name?: string | null;
  } | null;
}

export interface SalesOrdersResponse {
  salesOrders: SalesOrderRecord[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  grouped?: unknown;
}

const toNumber = (value: unknown): number => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === 'string') {
    const cleaned = value.replace(/,/g, '').trim();
    if (!cleaned) {
      return 0;
    }
    const parsed = Number.parseFloat(cleaned);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  if (typeof value === 'bigint') {
    return Number(value);
  }

  return 0;
};

const toBoolean = (value: unknown): boolean => {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    const normalized = value.toLowerCase();
    return normalized === 'true' || normalized === 't' || normalized === '1';
  }
  if (typeof value === 'number') {
    return value === 1;
  }
  return Boolean(value);
};

const normalizeSummaryEntry = (entry: any): BudgetSummaryRecord => ({
  projectId: Number(entry?.projectId ?? entry?.project_id ?? entry?.id ?? 0),
  projectName: entry?.projectName ?? entry?.project_name ?? entry?.name ?? 'Unknown Project',
  projectStatus: entry?.projectStatus ?? entry?.project_status ?? entry?.status,
  budget: toNumber(entry?.budget),
  spent: toNumber(entry?.spent),
  remaining: toNumber(entry?.remaining),
  usagePercentage: toNumber(entry?.usagePercentage ?? entry?.usage_percentage),
  isOverBudget: toBoolean(entry?.isOverBudget ?? entry?.is_over_budget),
  isNearBudget: toBoolean(entry?.isNearBudget ?? entry?.is_near_budget),
});

const normalizeItems = (items: unknown, amountKey: 'amount' | 'cost'): any[] => {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.map((raw) => {
    const item = typeof raw?.toJSON === 'function' ? raw.toJSON() : raw;
    return {
      ...item,
      [amountKey]: toNumber(item?.[amountKey]),
    };
  });
};

const normalizeBreakdownCategory = (
  category: any,
  amountKey: 'amount' | 'cost'
): BudgetBreakdownCategory => ({
  total: toNumber(category?.total),
  percentage: toNumber(category?.percentage),
  count: Number(category?.count ?? 0),
  items: normalizeItems(category?.items, amountKey),
});

const extractArray = (value: any): any[] | null => {
  if (Array.isArray(value)) {
    return value;
  }

  if (value && typeof value === 'object') {
    const possibleKeys = ['data', 'items', 'results', 'rows', 'list'];
    for (const key of possibleKeys) {
      if (Array.isArray(value[key])) {
        return value[key];
      }
    }
  }

  return null;
};

const extractObject = (value: any): any => {
  if (!value) {
    return null;
  }

  if (value && typeof value === 'object' && !Array.isArray(value)) {
    if (value.data && typeof value.data === 'object' && !Array.isArray(value.data)) {
      return value.data;
    }
  }

  return value;
};

const normalizeBudgetBreakdown = (raw: any): BudgetBreakdownResponse | null => {
  if (!raw) {
    return null;
  }

  const source = extractObject(raw);

  if (!source) {
    return null;
  }

  return {
    project: {
      id: Number(source?.project?.id ?? 0),
      name: source?.project?.name ?? 'Unknown Project',
      budget: toNumber(source?.project?.budget ?? source?.budget?.total),
    },
    budget: {
      total: toNumber(source?.budget?.total),
      spent: toNumber(source?.budget?.spent),
      remaining: toNumber(source?.budget?.remaining),
      usagePercentage: toNumber(source?.budget?.usagePercentage),
      isOverBudget: toBoolean(source?.budget?.isOverBudget),
    },
    revenue: source?.revenue
      ? {
          total: toNumber(source.revenue.total),
          percentage: toNumber(source.revenue.percentage),
          count: Number(source.revenue.count ?? 0),
          items: normalizeItems(source.revenue.items, 'amount'),
        }
      : undefined,
    breakdown: {
      customerInvoices: normalizeBreakdownCategory(source?.breakdown?.customerInvoices, 'amount'),
      vendorBills: normalizeBreakdownCategory(source?.breakdown?.vendorBills, 'amount'),
      expenses: normalizeBreakdownCategory(source?.breakdown?.expenses, 'amount'),
      timesheetCosts: normalizeBreakdownCategory(source?.breakdown?.timesheetCosts, 'cost'),
    },
    alerts: {
      isOverBudget: toBoolean(source?.alerts?.isOverBudget),
      isNearBudget: toBoolean(source?.alerts?.isNearBudget),
      percentageUsed: toNumber(source?.alerts?.percentageUsed),
    },
  };
};

class FinancialService {
  // Project Financial Documents
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

  async getProjectBudgetBreakdown(projectId: string): Promise<BudgetBreakdownResponse> {
    const response = await api.get(`/financial/projects/${projectId}/budget-breakdown`);
    const rawPayload = response.data ?? null;
    const breakdown = normalizeBudgetBreakdown(rawPayload);

    if (!breakdown) {
      throw new Error('Unable to load project budget breakdown.');
    }

    return breakdown;
  }

  async getAllProjectsBudgetSummary(): Promise<BudgetSummaryRecord[]> {
    const response = await api.get(`/financial/budget-summary`);
    const payload = response.data ?? null;

    const arrayCandidate =
      extractArray(payload?.data) ??
      extractArray(payload?.results) ??
      extractArray(payload) ??
      extractArray(payload?.payload);

    if (!arrayCandidate) {
      const message = payload?.message || 'Invalid budget summary response.';
      throw new Error(message);
    }

    return arrayCandidate.map(normalizeSummaryEntry);
  }

  // Sales Orders
  async getAllSalesOrders(filters?: Record<string, unknown>): Promise<SalesOrdersResponse> {
    const response = await api.get('/sales-orders', {
      params: filters,
    });

    const data = response.data;

    if (Array.isArray(data)) {
      return { salesOrders: data };
    }

    if (Array.isArray(data?.salesOrders)) {
      return {
        salesOrders: data.salesOrders,
        pagination: data.pagination,
        grouped: data.grouped,
      };
    }

    if (Array.isArray(data?.data)) {
      return {
        salesOrders: data.data,
        pagination: data.pagination,
        grouped: data.grouped,
      };
    }

    return {
      salesOrders: [],
      pagination: data?.pagination,
      grouped: data?.grouped,
    };
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
