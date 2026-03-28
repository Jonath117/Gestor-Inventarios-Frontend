const API_URL = import.meta.env.VITE_API_URL;

export const getDashboard = async (companyId: number) => {
    const response = await fetch(
        `${API_URL}/inventory/dashboard`,
        {
            headers: {
                "x-company-id": companyId.toString(),
            },
        }
    );

    if (!response.ok) {
        throw new Error("Error al obtener el dashboard");
    }

    return response.json();
}