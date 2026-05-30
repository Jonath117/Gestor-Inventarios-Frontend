import { createHeaders } from "./utils";
import { handleResponse } from "./utils";

const API_URL = import.meta.env.VITE_API_URL;

export const createDocument = async (companyCen: string, companyId: number, documentData: any) => {
    const response = await fetch(`${API_URL}/inventory/companies/${companyCen}/documents`, {
        method: "POST",
        headers: createHeaders(companyId, true),
        body: JSON.stringify(documentData),
    });

    return handleResponse(response, "Error al crear el documento");
}

export const getDocuments = async (companyCen: string, companyId: number, params: { documentType?: string, from?: string, to?: string } = {}) => {
    const queryParams = new URLSearchParams();
    if (params.documentType) queryParams.append("documentType", params.documentType);
    if (params.from) queryParams.append("from", params.from);
    if (params.to) queryParams.append("to", params.to);

    const response = await fetch(`${API_URL}/inventory/companies/${companyCen}/documents?${queryParams.toString()}`, {
        headers: createHeaders(companyId),
    });

    return handleResponse(response, "Error al obtener los documentos");
}