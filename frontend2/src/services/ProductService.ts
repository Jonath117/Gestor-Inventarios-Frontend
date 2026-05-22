import type { IProductCreate, IProductUpdate } from "../features/product/types/product.types";

const API_URL = import.meta.env.VITE_API_URL;

export const getProducts = async (companyCen: string, companyId: number) => {
    const response = await fetch(`${API_URL}/inventory/companies/${companyCen}/products`, {
        headers: {
            "x-company-id": companyId.toString(),
            "Accept": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Error al obtener los productos");
    }
    return response.json();
}

export const createProduct = async (companyCen: string, companyId: number, productData: IProductCreate) => {
    const response = await fetch(`${API_URL}/inventory/companies/${companyCen}/products`, {
        method: "POST",
        headers: {
            "x-company-id": companyId.toString(),
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify(productData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear el producto");
    }
    return response.json();
}

export const editProduct = async (companyCen: string, companyId: number, productData: IProductUpdate) => {
    const response = await fetch(`${API_URL}/inventory/companies/${companyCen}/products/${productData.productCen}`, {
        method: "PUT",
        headers: {
            "x-company-id": companyId.toString(),
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify(productData),
    });

    if (!response.ok) {
        throw new Error("Error al editar el producto");
    }
    return response.json();
}

export const updateProductStatus = async (companyCen: string, companyId: number, productCen: string, status: string) => {
    const response = await fetch(`${API_URL}/inventory/companies/${companyCen}/products/${productCen}/status`, {
        method: "PATCH",
        headers: {
            "x-company-id": companyId.toString(),
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify({ status }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error en el servidor");
    }
    return true;
}

export const getSellableProducts = async (companyCen: string, companyId: number, params: any = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}/inventory/companies/${companyCen}/sellable-products?${queryParams}`, {
        headers: {
            "x-company-id": companyId.toString(),
            "Accept": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Error al obtener los productos vendibles");
    }
    return response.json();
}