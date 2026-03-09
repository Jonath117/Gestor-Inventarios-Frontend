import type { StockItem } from "../types/inventory";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface Props {
    items: StockItem[];
}

export const StockTable = ({ items }: Props) => {
    const fmt = (date: string) =>
        new Date(date).toLocaleDateString("es-ES", {
            day: "2-digit", month: "short", year: "numeric",
        });

    return (
        <div className="overflow-x-auto rounded-xl border border-[#1f2937]">
            <table className="w-full text-sm">
                <thead>
                    <tr className="bg-[#0f172a] text-gray-400 uppercase text-xs tracking-wider">
                        <th className="px-5 py-3 text-left">SKU</th>
                        <th className="px-5 py-3 text-left">Producto</th>
                        <th className="px-5 py-3 text-left">Bodega</th>
                        <th className="px-5 py-3 text-right">Stock</th>
                        <th className="px-5 py-3 text-left">Unidad</th>
                        <th className="px-5 py-3 text-right">Mín. Alerta</th>
                        <th className="px-5 py-3 text-left">Actualizado</th>
                        <th className="px-5 py-3 text-center">Estado</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#1f2937]">
                    {items.map((item, i) => {
                        const isLow = item.currentStock <= item.minStockAlert;
                        return (
                            <tr
                                key={`${item.productId}-${item.warehouseName}-${i}`}
                                className="bg-[#111827] hover:bg-[#1a2232] transition-colors"
                            >
                                <td className="px-5 py-3 font-mono text-indigo-400">{item.sku}</td>
                                <td className="px-5 py-3 font-medium text-white">{item.productName}</td>
                                <td className="px-5 py-3 text-gray-400">{item.warehouseName}</td>
                                <td className="px-5 py-3 text-right font-semibold text-white">
                                    {item.currentStock.toFixed(0)}
                                </td>
                                <td className="px-5 py-3 text-gray-400 text-xs">{item.unitOfMeasure}</td>
                                <td className="px-5 py-3 text-right text-gray-400">{item.minStockAlert}</td>
                                <td className="px-5 py-3 text-gray-500 text-xs">{fmt(item.lastUpdated)}</td>
                                <td className="px-5 py-3 text-center">
                                    {isLow ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 text-xs font-medium">
                                            <ExclamationTriangleIcon className="w-3 h-3" />
                                            Bajo
                                        </span>
                                    ) : (
                                        <span className="inline-flex px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium">
                                            OK
                                        </span>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};