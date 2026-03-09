export const makeAdjustment = async (companyId: number, adjustmentData: {
    productId: number;
    warehouseId: number;
    quantity: number;
    reason: string;
}) => {
    const response = await fetch("http://localhost:5290/api/Adjustment", {
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