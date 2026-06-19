export interface PurchaseOrderItem {
  productCen: string;
  quantity: number;
}

export interface PurchaseOrderCreate {
  supplierCen: string;
  warehouseCen: string;
  items: PurchaseOrderItem[];
}

export interface PurchaseOrderList {
  orderCen: string;
  status: number;
  createdAt: string;
  confirmedAt?: string;
  supplierCen: string;
  itemCount: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export interface Supplier {
  supplierCen: string;
  name: string;
}

export interface PurchaseOrderDetailItem {
  productCen: string;
  quantity: number;
}

export interface PurchaseOrderDetail {
  orderCen: string;
  status: number;
  supplierCen: string;
  warehouseCen: string;
  createdAt: string;
  confirmedAt?: string;
  items: PurchaseOrderDetailItem[];
}

export interface Warehouse {
    warehouseCen: string;
    name: string; 
}