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
    categoryName: string; 
    unitName: string;     
}

export interface ProductCreate {
    sku: string;
    name: string;
    description?: string;
    price: number;
    salePrice: number;
    minStockAlert: number;
    categoryId: number; 
    unitId: number;     
}