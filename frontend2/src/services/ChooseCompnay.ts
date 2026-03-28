const API_URL = import.meta.env.VITE_API_URL;

export const getCompanies = async () => {
    const response = await fetch(`${API_URL}/company`, {
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