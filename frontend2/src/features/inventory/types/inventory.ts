export interface StockItem {
    productId: number;
    sku: string;
    productName: string;
    warehouseName: string;
    currentStock: number;
    unitOfMeasure: string;
    minStockAlert: number;
    lastUpdated: string;
}

export interface AdjustmentPayload {
    productId: number;
    warehouseId: number;
    quantity: number;
    reason: string;
}