import { useEffect, useState } from "react";
import { getStock } from "../../../services/GetStock";
import { makeAdjustment } from "../../../services/MakeAjustment";
import { StockTable } from "../components/StockTable";
import { AdjustmentModal } from "../components/AdjustmentModal";
import type { StockItem, AdjustmentPayload } from "../types/inventory";
import { FunnelIcon } from "@heroicons/react/24/outline";
import { Button } from "../../../components/ButtonComponent";

export const InventoryPage = () => {
    const companyId = JSON.parse(localStorage.getItem("activeCompany") || "{}").id;

    const [stock, setStock] = useState<StockItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [warehouseFilter, setWarehouseFilter] = useState<string>("");
    const [showModal, setShowModal] = useState(false);

    const fetchStock = () => {
        setLoading(true);
        getStock(companyId)
            .then(setStock)
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchStock();
    }, [companyId]);

    const handleAdjustment = async (data: AdjustmentPayload) => {
        await makeAdjustment(companyId, data);
        fetchStock();
    };

    const warehouses = [...new Set(stock.map((i) => i.warehouseName))];

    const filtered = warehouseFilter
        ? stock.filter((i) => i.warehouseName === warehouseFilter)
        : stock;

    const lowStockCount = stock.filter((i) => i.currentStock <= i.minStockAlert).length;

    return (
        <div className="min-h-screen px-8 py-8">

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">Inventario</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {stock.length} productos
                        {lowStockCount > 0 && (
                            <span className="ml-2 text-red-400">· {lowStockCount} con stock bajo</span>
                        )}
                    </p>
                </div>

                <Button variant="primary" size="lg" onClick={() => setShowModal(true)}>
                    Registrar Ajuste
                </Button>

            </div>

            <div className="flex items-center gap-3 mb-5">
                <FunnelIcon className="w-7 h-7 text-gray-500" />
                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={() => setWarehouseFilter("")}
                        className={`px-5 py-2 rounded-lg text-medium font-medium transition-colors ${warehouseFilter === ""
                            ? "bg-indigo-600 text-white"
                            : "bg-[#1f2937] text-gray-400 hover:text-white"
                            }`}
                    > Todas las bodegas
                    </button>
                    {warehouses.map((w) => (
                        <button
                            key={w}
                            onClick={() => setWarehouseFilter(w)}
                            className={`px-5 py-2 rounded-lg text-medium font-medium transition-colors ${warehouseFilter === w
                                ? "bg-indigo-600 text-white"
                                : "bg-[#1f2937] text-gray-400 hover:text-white"
                                }`}
                        >
                            {w}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64 text-gray-500">
                    Cargando inventario...
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-gray-500">
                    No hay productos para mostrar.
                </div>
            ) : (
                <StockTable items={filtered} />
            )}

            {showModal && (
                <AdjustmentModal
                    companyId={companyId}
                    onClose={() => setShowModal(false)}
                    onSubmit={handleAdjustment}
                />
            )}
        </div>
    );
};