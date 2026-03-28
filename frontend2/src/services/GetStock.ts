const API_URL = import.meta.env.VITE_API_URL;

export const getStock = async (companyId: number, warehouseId?: number) => {
    const url = warehouseId
        ? `${API_URL}/GetStock?warehouseId=${warehouseId}`
        : `${API_URL}/GetStock`;

    const response = await fetch(url, {
        headers: {
            "x-company-id": companyId.toString(),
            "Accept": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Error al obtener el stock");
    }
    return response.json();
}



