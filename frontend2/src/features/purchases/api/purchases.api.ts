import { createHeaders, handleResponse } from "../../../services/utils";
import type { 
    PurchaseOrderCreate, 
    PurchaseOrderList, 
    PagedResult, 
    Supplier, 
    PurchaseOrderDetail 
} from "../types/purchases.types";

const API_URL = import.meta.env.VITE_API_URL_PURCHASES;

export const getPurchaseOrders = async (
    companyCen: string, 
    companyId: number, 
    params: any = {}
): Promise<PagedResult<PurchaseOrderList>> => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}/purchases/companies/${companyCen}/orders?${queryParams}`, {
        headers: createHeaders(companyId),
    });

    return handleResponse(response, "Error al obtener las órdenes de compra");
};

export const createPurchaseOrder = async (
    companyCen: string, 
    companyId: number, 
    data: PurchaseOrderCreate
) => {
    const response = await fetch(`${API_URL}/purchases/companies/${companyCen}/orders`, {
        method: "POST",
        headers: createHeaders(companyId, true),
        body: JSON.stringify(data),
    });

    return handleResponse(response, "Error al crear la orden de compra");
};

export const getPurchaseOrderDetail = async (
    companyCen: string, 
    companyId: number, 
    orderCen: string
): Promise<PurchaseOrderDetail> => {
    const response = await fetch(`${API_URL}/purchases/companies/${companyCen}/orders/${orderCen}`, {
        headers: createHeaders(companyId),
    });

    return handleResponse(response, "Error al obtener el detalle de la orden");
};

export const confirmPurchaseOrder = async (
    companyCen: string, 
    companyId: number, 
    orderCen: string
) => {
    const response = await fetch(`${API_URL}/purchases/companies/${companyCen}/orders/${orderCen}/confirm`, {
        method: "POST",
        headers: createHeaders(companyId),
    });

    return handleResponse(response, "Error al confirmar la orden de compra");
};

export const getSuppliers = async (
    companyCen: string, 
    companyId: number
): Promise<Supplier[]> => {
    const response = await fetch(`${API_URL}/purchases/companies/${companyCen}/suppliers`, {
        headers: createHeaders(companyId),
    });

    return handleResponse(response, "Error al obtener los proveedores");
};
