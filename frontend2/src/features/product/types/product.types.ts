export interface Product {
    productCen: string;
    sku: string;
    name: string;
    description?: string;
    categoryCen: string;
    categoryName: string;
    unitCen: string;
    unitName: string;
    salePrice: number;
    costPrice?: number;
    reorderLevel: number;
    status: string;
    stationCode?: string;
}

export interface IProductCreate {
    sku: string;
    name: string;
    description?: string;
    categoryCen: string;
    unitCen: string;
    salePrice: number;
    costPrice?: number;
    reorderLevel: number;
    stationCode?: string;
}

export interface IProductUpdate {
    productCen: string;
    sku: string;
    name: string;
    description?: string;
    categoryCen: string;
    unitCen: string;
    salePrice: number;
    costPrice?: number;
    reorderLevel: number;
    stationCode?: string;
}