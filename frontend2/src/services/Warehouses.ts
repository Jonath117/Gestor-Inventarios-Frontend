const API_URL = import.meta.env.VITE_API_URL;

import { createHeaders } from "./utils";
import { handleResponse } from "./utils";

export const getWarehouses = async (companyCen: string, companyId: number) => {
    const warehousesResponse = await fetch(`${API_URL}/inventory/companies/${companyCen}/warehouses`, {
        headers: createHeaders(companyId),
    });

    return await handleResponse(warehousesResponse, "Error al obtener los almacenes");
};