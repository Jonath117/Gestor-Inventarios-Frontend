import type { IProductCreate, IProductUpdate } from "../features/product/types/product.types";

const API_URL = import.meta.env.VITE_API_URL;

export const getProducts = async (companyId: number) => {
    const response = await fetch(`${API_URL}/Product`, {
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

export const createProduct = async (companyId: number, productData: IProductCreate) => {
    const response = await fetch(`${API_URL}/Product`, {
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

export const editProduct = async (companyId: number, productData: IProductUpdate) => {
    const response = await fetch(`${API_URL}/Product/${productData.id}`, {
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

export const deactivateProduct = async (companyId: number, productId: number) => {
    const response = await fetch(`${API_URL}/Product/${productId}/deactivate`, {
        method: "PATCH",
        headers: {
            "x-company-id": companyId.toString(),
            "Accept": "application/json",
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error en el servidor");
    }
    return true;
}

export const activateProduct = async (companyId: number, productId: number) => {
    const response = await fetch(`${API_URL}/Product/${productId}/activate`, {
        method: "PATCH",
        headers: {
            "x-company-id": companyId.toString(),
            "Accept": "application/json",
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error en el servidor");
    }
    return true;
}