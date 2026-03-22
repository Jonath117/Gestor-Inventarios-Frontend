export const getCompanies = async () => {
    const response = await fetch("http://localhost:5153/api/company", {
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