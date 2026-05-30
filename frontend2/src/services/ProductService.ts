import type { IProductCreate, IProductUpdate } from "../features/product/types/product.types";
import { createHeaders } from "./utils";
import { handleResponse } from "./utils";

const API_URL = import.meta.env.VITE_API_URL;

export const getProducts = async (companyCen: string, companyId: number) => {
    const response = await fetch(`${API_URL}/inventory/companies/${companyCen}/products`, {
        headers: createHeaders(companyId),
    });

    return handleResponse(response, "Error al obtener los productos");
}

export const createProduct = async (companyCen: string, companyId: number, productData: IProductCreate) => {
    const response = await fetch(`${API_URL}/inventory/companies/${companyCen}/products`, {
        method: "POST",
        headers: createHeaders(companyId, true),
        body: JSON.stringify(productData),
    });

    return handleResponse(response, "Error al crear el producto");
}

export const editProduct = async (companyCen: string, companyId: number, productData: IProductUpdate) => {
    const response = await fetch(`${API_URL}/inventory/companies/${companyCen}/products/${productData.productCen}`, {
        method: "PUT",
        headers: createHeaders(companyId, true),
        body: JSON.stringify(productData),
    });

    return handleResponse(response, "Error al editar el producto");
}

export const updateProductStatus = async (companyCen: string, companyId: number, productCen: string, status: string) => {
    const response = await fetch(`${API_URL}/inventory/companies/${companyCen}/products/${productCen}/status`, {
        method: "PATCH",
        headers: createHeaders(companyId, true),
        body: JSON.stringify({ status }),
    });

    return handleResponse(response, "Error al actualizar el estado del producto");
}

export const getSellableProducts = async (companyCen: string, companyId: number, params: any = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}/inventory/companies/${companyCen}/sellable-products?${queryParams}`, {
        headers: createHeaders(companyId),
    });

    return handleResponse(response, "Error al obtener los productos vendibles");
}