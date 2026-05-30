import { createHeaders } from "./utils";
import { handleResponse } from "./utils";

const API_URL = import.meta.env.VITE_API_URL;

export const getStock = async (companyCen: string, companyId: number, params: { productCen?: string, warehouseCen?: string } = {}) => {
    const queryParams = new URLSearchParams();
    if (params.productCen) queryParams.append("productCen", params.productCen);
    if (params.warehouseCen) queryParams.append("warehouseCen", params.warehouseCen);

    const url = `${API_URL}/inventory/companies/${companyCen}/stock?${queryParams.toString()}`;

    const response = await fetch(url, {
        headers: createHeaders(companyId),
    });

    return handleResponse(response, "Error al obtener el stock");
}



