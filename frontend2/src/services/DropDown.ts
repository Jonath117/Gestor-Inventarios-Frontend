const API_URL = import.meta.env.VITE_API_URL;

import { createHeaders } from "./utils";
import { handleResponse } from "./utils";

export const getProductandWarehouses = async (companyCen: string, companyId: number) => {
    const [productsResponse, warehousesResponse] = await Promise.all([
        fetch(`${API_URL}/inventory/companies/${companyCen}/products`, {
            headers: createHeaders(companyId),
        }),
        fetch(`${API_URL}/inventory/companies/${companyCen}/warehouses`, {
            headers: createHeaders(companyId),
        }),
    ]);
    
    return {
        products: await handleResponse(productsResponse, "Error al obtener los productos"),
        warehouses: await handleResponse(warehousesResponse, "Error al obtener los almacenes"),
    }

}