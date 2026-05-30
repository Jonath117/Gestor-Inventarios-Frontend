import { createHeaders } from "./utils";
import { handleResponse } from "./utils";

const API_URL = import.meta.env.VITE_API_URL;

export const getCategories = async (companyCen: string, companyId: number) => {
    const response = await fetch(`${API_URL}/inventory/companies/${companyCen}/categories`, {
        headers: createHeaders(companyId),
    });

    return handleResponse(response, "Error al obtener las categorías");
}

export const createCategory = async (companyCen: string, companyId: number, data: { name: string, description?: string }) => {
    const response = await fetch(`${API_URL}/inventory/companies/${companyCen}/categories`, {
        method: "POST",
        headers: createHeaders(companyId, true),
        body: JSON.stringify(data),
    });

    return handleResponse(response, "Error al crear la categoría");
}

export const updateCategory = async (companyCen: string, companyId: number, data: { categoryCen: string, name: string, description?: string }) => {
    const response = await fetch(`${API_URL}/inventory/companies/${companyCen}/categories/${data.categoryCen}`, {
        method: "PUT",
        headers: createHeaders(companyId, true),
        body: JSON.stringify({ name: data.name, description: data.description }),
    });

    return handleResponse(response, "Error al actualizar la categoría");
};
