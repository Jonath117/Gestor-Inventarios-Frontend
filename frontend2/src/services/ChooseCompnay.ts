const API_URL = import.meta.env.VITE_API_URL;

import { createHeaders } from "./utils";
import { handleResponse } from "./utils";


export const getCompanies = async () => {
    const response = await fetch(`${API_URL}/inventory/companies`, {
        headers: createHeaders(0)
    });

    return handleResponse(response, "Error al obtener las empresas");
}

export const getCompanyDetails = async (companyCen: string) => {
    const response = await fetch(`${API_URL}/inventory/companies/${companyCen}`, {
        headers: createHeaders(0) // 
    });

    return handleResponse(response, "Error al obtener los detalles de la empresa");
}