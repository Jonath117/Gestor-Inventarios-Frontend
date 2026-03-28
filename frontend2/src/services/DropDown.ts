const API_URL = import.meta.env.VITE_API_URL;

export const getProductandWarehouses = async (companyId: number) => {
    const [productsResponse, warehousesResponse] = await Promise.all([
        fetch(`${API_URL}/LookUp/lookup-products`, {
            headers: {
                "x-company-id": companyId.toString(),
                "Accept": "application/json",
            },
        }),
        fetch(`${API_URL}/LookUp/lookup-warehouses`, {
            headers: {
                "x-company-id": companyId.toString(),
                "Accept": "application/json",
            },
        }),
    ]);

    if (!productsResponse.ok) {
        throw new Error("Error al obtener los productos");
    }
    if (!warehousesResponse.ok) {
        throw new Error("Error al obtener las bodegas");
    }

    const products = await productsResponse.json();
    const warehouses = await warehousesResponse.json();

    return { products, warehouses };
}