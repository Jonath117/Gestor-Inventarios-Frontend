export interface Product {
    id: number;
    sku: string;
    name: string;
    description?: string;
    price: number;
    salePrice: number;
    minStockAlert: number;
    isActive: boolean;
    isSoldOut: boolean;
    categoryId: number;
    categoryName: string;
    unitId: number;
    unitName: string;
}

export interface IProductCreate {
    sku: string;
    name: string;
    description?: string;
    price: number;
    salePrice: number;
    minStockAlert: number;
    categoryId: number;
    unitId: number;
    isActive: boolean;
}

export interface IProductUpdate {
    id: number;
    sku: string;
    name: string;
    description?: string;
    price: number;
    salePrice: number;
    minStockAlert: number;
    categoryId: number;
    unitId: number;
    isActive: boolean;
}