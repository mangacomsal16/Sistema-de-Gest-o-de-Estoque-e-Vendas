// Tipos compartilhados entre os serviços e a interface.
export type Role = 'ADMIN' | 'MANAGER' | 'CASHIER';
export type PaymentMethod = 'CASH' | 'CARD' | 'PIX';
export type StockStatus = 'IN_STOCK' | 'LOW' | 'OUT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  productCount?: number;
  createdAt?: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  description?: string | null;
  price: number;
  costPrice?: number | null;
  stock: number;
  minStock: number;
  active: boolean;
  categoryId: string;
  category?: Category;
  status: StockStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SaleItem {
  id: string;
  productId: string;
  product?: { name: string; sku: string };
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  total: number;
  paymentMethod: PaymentMethod;
  user?: { name: string };
  items: SaleItem[];
  createdAt: string;
}

export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface DashboardStats {
  totalRevenue: number;
  salesCount: number;
  todayRevenue: number;
  todaySalesCount: number;
  totalStockUnits: number;
  productCount: number;
  lowStockCount: number;
  revenueByDay: { date: string; revenue: number; sales: number }[];
  salesByPaymentMethod: { method: PaymentMethod; total: number }[];
  lowStockProducts: (Pick<Product, 'id' | 'name' | 'sku' | 'stock' | 'minStock' | 'price' | 'status'> & {
    category: { id: string; name: string; color: string };
  })[];
  recentSales: {
    id: string;
    total: number;
    paymentMethod: PaymentMethod;
    itemCount: number;
    user?: { name: string };
    createdAt: string;
  }[];
  topProducts: { productId: string; name: string; quantity: number; revenue: number }[];
}

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  status?: StockStatus;
  page?: number;
  pageSize?: number;
}
