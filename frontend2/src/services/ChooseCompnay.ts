const API_URL = import.meta.env.VITE_API_URL;

export const getCompanies = async () => {
    const response = await fetch(`${API_URL}/inventory/companies`, {
        headers: { "Accept": "application/json" }
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Backend: ${errorText}`);
    }

    if (response.status === 204) {
        return [];
    }

    return response.json();
}

export const getCompanyDetails = async (companyCen: string) => {
    const response = await fetch(`${API_URL}/inventory/companies/${companyCen}`, {
        headers: { "Accept": "application/json" }
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Backend: ${errorText}`);
    }

    return response.json();
}