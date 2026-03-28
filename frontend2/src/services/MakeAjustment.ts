const API_URL = import.meta.env.VITE_API_URL;

export const makeAdjustment = async (companyId: number, adjustmentData: {
    productId: number;
    warehouseId: number;
    quantity: number;
    reason: string;
}) => {
    const response = await fetch(`${API_URL}/Adjustment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-company-id": companyId.toString(),
        },
        body: JSON.stringify(adjustmentData),
    });

    if (!response.ok) {
        throw new Error("Error al registrar el ajuste de stock");
    }
    return response.json();
}