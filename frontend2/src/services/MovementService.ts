const API_URL = import.meta.env.VITE_API_URL;

export const createDocument = async (companyCen: string, companyId: number, documentData: any) => {
    const response = await fetch(`${API_URL}/inventory/companies/${companyCen}/documents`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-company-id": companyId.toString(),
        },
        body: JSON.stringify(documentData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error en el servidor");
    }
    return response.json();
}

export const getDocuments = async (companyCen: string, companyId: number, params: { documentType?: string, from?: string, to?: string } = {}) => {
    const queryParams = new URLSearchParams();
    if (params.documentType) queryParams.append("documentType", params.documentType);
    if (params.from) queryParams.append("from", params.from);
    if (params.to) queryParams.append("to", params.to);

    const response = await fetch(`${API_URL}/inventory/companies/${companyCen}/documents?${queryParams.toString()}`, {
        headers: {
            "x-company-id": companyId.toString(),
            "Accept": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Error al obtener los documentos");
    }
    return response.json();
}