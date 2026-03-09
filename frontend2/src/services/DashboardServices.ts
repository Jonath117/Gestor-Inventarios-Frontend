export const getDashboard = async (companyId: number) => {
    const response = await fetch(
        "http://localhost:5290/api/inventory/dashboard",
        {
            headers: {
                "x-company-id": companyId.toString(),
            },
        }
    );

    if(!response.ok){
        throw new Error("Error al obtener el dashboard");
    }

    return response.json();
}