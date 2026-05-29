export interface Ticket {
    ticketCen: string;
    date: string;
    status: string;
    waiterName?: string;
    subTotal: number;
    taxAmount: number;
    total: number;
    customerName?: string;
    warehouseCen: string;
}

export interface TicketItem {
    ticketItemCen: string;
    productCen: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    subTotal: number;
    note?: string;
    status: string;
}

export interface SellableProduct {
    productCen: string;
    sku: string;
    name: string;
    description?: string;
    categoryName: string;
    unitName: string;
    salePrice: number;
    availableStock: number;
    isAvailable: boolean;
}

export interface Warehouse {
    warehouseCen: string;
    name: string;
    description?: string;
}

export interface KdsItem {
    ticketItemCen: string;
    ticketCen: string;
    productName: string;
    quantity: number;
    note?: string;
    status: string;
    sentAt: string;
    station: string;
}

export interface DailySalesDashboard {
    totalSales: number;
    ticketsCount: number;
    averageTicket: number;
}

export interface Waiter{
    waiterCen: string;
    name: string;
    isActive: boolean;
}