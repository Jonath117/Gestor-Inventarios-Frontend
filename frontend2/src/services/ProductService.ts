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
