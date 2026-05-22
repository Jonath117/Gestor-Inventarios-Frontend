const API_URL = import.meta.env.VITE_API_URL;

export const getCategories = async (companyCen: string, companyId: number) => {
    const response = await fetch(`${API_URL}/inventory/companies/${companyCen}/categories`, {
        headers: {
            "x-company-id": companyId.toString(),
            "Accept": "application/json",
        },
    });

    if (!response.ok) throw new Error("Error al cargar categorías");
    if (response.status === 204) return [];

    return response.json();
}

export const createCategory = async (companyCen: string, companyId: number, data: { name: string, description?: string }) => {
    const response = await fetch(`${API_URL}/inventory/companies/${companyCen}/categories`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-company-id": companyId.toString(),
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Error al crear la categoría");
    }
    return response.json();
}

export const updateCategory = async (companyCen: string, companyId: number, data: { categoryCen: string, name: string, description?: string }) => {
    const response = await fetch(`${API_URL}/inventory/companies/${companyCen}/categories/${data.categoryCen}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "x-company-id": companyId.toString(),
        },
        body: JSON.stringify({ name: data.name, description: data.description }),
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Error al actualizar la categoría");
    }
    return response.json();
};
