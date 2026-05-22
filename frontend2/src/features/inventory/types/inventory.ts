export interface StockItem {
    productCen: string;
    sku: string;
    productName: string;
    warehouseCen: string;
    warehouseName: string;
    quantity: number;
    unitName: string;
    lastUpdated: string;
}

export interface AdjustmentPayload {
    warehouseCen: string;
    reason: string;
    lines: {
        productCen: string;
        quantity: number;
        adjustmentType: string;
    }[];
}