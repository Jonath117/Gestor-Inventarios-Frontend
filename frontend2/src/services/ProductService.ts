export const getProducts = async (companyId: number) => {
    const response = await fetch("http://localhost:5153/api/Product", {
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
