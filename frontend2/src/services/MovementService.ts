import type { IRegisterMovement } from "../features/in-out/types/index.ts";
const API_URL = import.meta.env.VITE_API_URL;

export const registerMovement = async (companyId: number, movementData: IRegisterMovement) => {
    const { productId, warehouseId, movementType, quantity, reference, reason } = movementData;

    const response = await fetch(`${API_URL}/Movement`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-company-id": companyId.toString(),
        },
        body: JSON.stringify({
            productId,
            warehouseId,
            movementType,
            quantity,
            reference,
            reason,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error en el servidor");
    }
    return response.json();
}