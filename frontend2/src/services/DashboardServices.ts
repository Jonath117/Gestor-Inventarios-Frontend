const API_URL = import.meta.env.VITE_API_URL;

import { createHeaders } from "./utils";
import { handleResponse } from "./utils";

export const getDashboard = async (companyCen: string, companyId: number) => {
    const response = await fetch(
        `${API_URL}/inventory/companies/${companyCen}/dashboard`,
        {
            headers: createHeaders(companyId),
        }
    );

    return handleResponse(response, "Error al obtener los datos del dashboard");
}