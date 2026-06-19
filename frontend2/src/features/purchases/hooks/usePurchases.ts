import { useState, useEffect, useCallback } from "react";
import { getPurchaseOrders, createPurchaseOrder, getSuppliers } from "../api/purchases.api";
import type { PurchaseOrderList, PurchaseOrderCreate, Supplier } from "../types/purchases.types";
import { useToast } from "../../../components/Toast";

export const usePurchases = (companyCen: string, companyId: number) => {
    const [orders, setOrders] = useState<PurchaseOrderList[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const toast = useToast();

    const fetchOrdersAndSuppliers = useCallback(async () => {
        if (!companyCen) return;
        
        try {
            setIsLoading(true);
            const [ordersData, suppliersData] = await Promise.all([
                getPurchaseOrders(companyCen, companyId),
                getSuppliers(companyCen, companyId)
            ]);
            setOrders(ordersData.items || []);
            setSuppliers(suppliersData);
        } catch (error: any) {
            toast.error("Error", "No se pudieron cargar las órdenes de compra");
        } finally {
            setIsLoading(false);
        }
    }, [companyCen, companyId, toast]);

    useEffect(() => {
        fetchOrdersAndSuppliers();
    }, [fetchOrdersAndSuppliers]);

    const createOrder = async (data: PurchaseOrderCreate, onSuccess: () => void) => {
        try {
            await createPurchaseOrder(companyCen, companyId, data);
            toast.success("Éxito", "Orden de compra creada correctamente");
            fetchOrdersAndSuppliers();
            onSuccess();
        } catch (error: any) {
            toast.error("Error", error.message);
        }
    };

    const getSupplierName = (cen: string) => {
        const supplier = suppliers.find(s => s.supplierCen === cen);
        return supplier ? supplier.name : cen;
    };

    return {
        orders,
        isLoading,
        createOrder,
        getSupplierName,
        refreshOrders: fetchOrdersAndSuppliers
    };
};
