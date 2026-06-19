import { useState, useEffect } from "react";
import { getSuppliers } from "../api/purchases.api";
import { getWarehouses } from "../../../services/Warehouses";
import { getStock } from "../../../services/GetStock";
import type { PurchaseOrderItem, Supplier, Warehouse } from "../types/purchases.types";

export const usePurchaseForm = (companyCen: string, companyId: number) => {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [products, setProducts] = useState<{productCen: string, name: string}[]>([]);

    const [supplierCen, setSupplierCen] = useState("");
    const [warehouseCen, setWarehouseCen] = useState(""); 
    
    const [items, setItems] = useState<(PurchaseOrderItem & { name: string })[]>([]);
    const [selectedProduct, setSelectedProduct] = useState("");
    const [quantity, setQuantity] = useState<number>(1);

    // Cargar proveedores y bodegas iniciales
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [suppliersData, warehousesData] = await Promise.all([
                    getSuppliers(companyCen, companyId),
                    getWarehouses(companyCen, companyId)
                ]);
                setSuppliers(suppliersData);
                setWarehouses(warehousesData);
            } catch (error) {
                console.error("Error fetching initial form data", error);
            }
        };
        fetchInitialData();
    }, [companyCen, companyId]);

    // Cargar productos de acuerdo al almacén seleccionado
    useEffect(() => {
        const fetchProductsByWarehouse = async () => {
            if (!warehouseCen) {
                setProducts([]);
                return;
            }
            try {
                // Se usa getStock para traer los productos asignados a la bodega
                const stockData = await getStock(companyCen, companyId, { warehouseCen });
                // Mapear la respuesta para obtener productCen y productName únicos
                const uniqueProducts = Array.from(new Map(stockData.map((item: any) => 
                    [item.productCen, { productCen: item.productCen, name: item.productName }]
                )).values()) as {productCen: string, name: string}[];
                
                setProducts(uniqueProducts);
            } catch (error) {
                console.error("Error fetching products by warehouse", error);
            }
        };
        fetchProductsByWarehouse();
        
        // Limpiar selección de producto al cambiar de bodega
        setSelectedProduct("");
        setItems([]); 
    }, [warehouseCen, companyCen, companyId]);

    const handleAddItem = () => {
        if (!selectedProduct || quantity <= 0) return;
        const product = products.find(p => p.productCen === selectedProduct);
        if (!product) return;

        setItems(prev => {
            const existing = prev.find(i => i.productCen === selectedProduct);
            if (existing) {
                return prev.map(i => i.productCen === selectedProduct ? { ...i, quantity: i.quantity + quantity } : i);
            }
            return [...prev, { productCen: selectedProduct, name: product.name, quantity }];
        });
        setSelectedProduct("");
        setQuantity(1);
    };

    const handleRemoveItem = (productCen: string) => {
        setItems(prev => prev.filter(i => i.productCen !== productCen));
    };

    return {
        suppliers,
        warehouses,
        products,
        
        supplierCen,
        setSupplierCen,
        warehouseCen,
        setWarehouseCen,
        
        items,
        selectedProduct,
        setSelectedProduct,
        quantity,
        setQuantity,
        
        handleAddItem,
        handleRemoveItem
    };
};
