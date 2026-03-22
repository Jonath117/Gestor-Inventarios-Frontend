export const getCategories = async (companyId: number) => {
    const response = await fetch("http://localhost:5153/api/Category", {
        headers: {
            "x-company-id": companyId.toString(),
            "Accept": "application/json",
        },
    }); 

    if (!response.ok) throw new Error("Error al cargar categorías");
    if (response.status === 204) return [];
    
    return response.json();
}

export const createCategory = async (companyId: number, data: { name: string, description?: string }) => {
    const response = await fetch("http://localhost:5153/api/Category", {
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

export const updateCategory = async (companyId: number, data: { id: number, name: string, description?: string }) => {
    const response = await fetch("http://localhost:5153/api/Category", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "x-company-id": companyId.toString(),
        },
        body: JSON.stringify(data), 
    });
    
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Error al actualizar la categoría");
    }
    return response.json();
};
