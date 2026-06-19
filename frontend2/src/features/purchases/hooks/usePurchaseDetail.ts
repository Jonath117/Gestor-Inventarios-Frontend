import { useState, useEffect, useCallback } from "react";
import { getPurchaseOrderDetail, confirmPurchaseOrder, getSuppliers } from "../api/purchases.api";
import { getWarehouses } from "../../../services/Warehouses";
import { getProducts } from "../../../services/ProductService";
import type { PurchaseOrderDetail, Supplier } from "../types/purchases.types";
import type { Product } from "../../product/types/product.types";
import { useToast } from "../../../components/Toast";

interface Warehouse {
    warehouseCen: string;
    name: string;
}

export const usePurchaseDetail = (companyCen: string, companyId: number, orderCen: string) => {
    const [detail, setDetail] = useState<PurchaseOrderDetail | null>(null);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const toast = useToast();

    const fetchDetailData = useCallback(async () => {
        if (!companyCen || !orderCen) return;
        
        try {
            setIsLoading(true);
            const [detailData, suppliersData, warehousesData, productsData] = await Promise.all([
                getPurchaseOrderDetail(companyCen, companyId, orderCen),
                getSuppliers(companyCen, companyId),
                getWarehouses(companyCen, companyId),
                getProducts(companyCen, companyId)
            ]);
            setDetail(detailData);
            setSuppliers(suppliersData);
            setWarehouses(warehousesData);
            setProducts(productsData);
        } catch (error: any) {
            toast.error("Error", "No se pudo cargar el detalle de la orden");
        } finally {
            setIsLoading(false);
        }
    }, [companyCen, companyId, orderCen, toast]);

    useEffect(() => {
        fetchDetailData();
    }, [fetchDetailData]);

    const confirmOrder = async (onConfirmed: () => void) => {
        const confirmed = await toast.confirm("¿Confirmar orden?", "Al confirmar, el inventario se actualizará automáticamente con los productos recibidos. Esta acción no se puede deshacer.");
        if (confirmed) {
            try {
                await confirmPurchaseOrder(companyCen, companyId, orderCen);
                toast.success("Éxito", "Orden confirmada correctamente y stock actualizado.");
                onConfirmed();
            } catch (error: any) {
                toast.error("Error", error.message);
            }
        }
    };

    const getSupplierName = (cen: string) => {
        const s = suppliers.find(x => x.supplierCen === cen);
        return s ? s.name : cen;
    };

    const getWarehouseName = (cen: string) => {
        const w = warehouses.find(x => x.warehouseCen === cen);
        return w ? w.name : cen;
    };

    const getProductName = (cen: string) => {
        const p = products.find(x => x.productCen === cen);
        return p ? p.name : cen;
    };

    return {
        detail,
        isLoading,
        confirmOrder,
        getSupplierName,
        getWarehouseName,
        getProductName
    };
};
