import { createHeaders } from "./utils";
import { handleResponse } from "./utils";

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
        headers: createHeaders(companyId, true),
        body: JSON.stringify(adjustmentData),
    });

    return handleResponse(response, "Error al realizar el ajuste de stock");
}