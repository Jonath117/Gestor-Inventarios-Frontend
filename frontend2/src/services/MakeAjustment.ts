const API_URL = import.meta.env.VITE_API_URL;

export const makeAdjustment = async (companyCen: string, companyId: number, adjustmentData: {
    warehouseCen: string;
    reason: string;
    lines: {
        productCen: string;
        quantity: number;
        adjustmentType: string; // "IN" or "OUT"
    }[]
}) => {
    const response = await fetch(`${API_URL}/inventory/companies/${companyCen}/stock/adjustments`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-company-id": companyId.toString(),
        },
        body: JSON.stringify(adjustmentData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al registrar el ajuste de stock");
    }
    return response.json();
}