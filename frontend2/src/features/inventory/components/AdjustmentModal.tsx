import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import type { AdjustmentPayload } from "../types/inventory";
import { getProductandWarehouses } from "../../../services/DropDown";
import { useToast } from "../../../components/Toast";

interface Props {
    companyId: number;
    onClose: () => void;
    onSubmit: (data: AdjustmentPayload) => Promise<void>;
}

export const AdjustmentModal = ({ companyId, onClose, onSubmit }: Props) => {
    const toast = useToast(); 

    const [form, setForm] = useState<AdjustmentPayload>({
        productId: 0,
        warehouseId: 0,
        quantity: 0,
        reason: "",
    });

    const [products, setProducts] = useState<any[]>([]);
    const [warehouses, setWarehouses] = useState<any[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadDropdownData = async () => {
            try {
                const data = await getProductandWarehouses(companyId);
                setProducts(data.products);
                setWarehouses(data.warehouses);
            } catch {
                toast.error("Error al cargar catálogo", "No se pudieron cargar los productos y bodegas.");
            } finally {
                setLoadingData(false);
            }
        };
        loadDropdownData();
    }, [companyId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === "reason" ? value : Number(value),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(form);
            toast.success("Ajuste registrado", "El stock fue actualizado correctamente.");
            onClose();
        } catch {
            toast.error("Error al registrar", "No se pudo registrar el ajuste. Intenta nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-[#111827] border border-[#1f2937] rounded-2xl w-full max-w-md mx-4 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#1f2937]">
                    <h2 className="text-white font-semibold text-lg">Registrar Ajuste de Stock</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
                    {loadingData ? (
                        <div className="flex items-center justify-center gap-2 py-6 text-sm text-gray-400">
                            <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                            Cargando catálogo...
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-gray-400 mb-1 block">Producto</label>
                                <select
                                    name="productId"
                                    value={form.productId || ""}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-[#0f172a] border border-[#374151] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                                >
                                    <option value="" disabled>Seleccione...</option>
                                    {products.map((p) => (
                                        <option key={p.id} value={p.id}>{p.sku} - {p.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 mb-1 block">Bodega</label>
                                <select
                                    name="warehouseId"
                                    value={form.warehouseId || ""}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-[#0f172a] border border-[#374151] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                                >
                                    <option value="" disabled>Seleccione...</option>
                                    {warehouses.map((w) => (
                                        <option key={w.id} value={w.id}>{w.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">Cantidad</label>
                        <input
                            type="number"
                            name="quantity"
                            value={form.quantity || ""}
                            onChange={handleChange}
                            required
                            className="w-full bg-[#0f172a] border border-[#374151] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">Motivo</label>
                        <textarea
                            name="reason"
                            value={form.reason}
                            onChange={handleChange}
                            required
                            rows={3}
                            placeholder="Ej: Compra inicial de inventario"
                            className="w-full bg-[#0f172a] border border-[#374151] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                        />
                    </div>

                    <div className="flex gap-3 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 rounded-lg border border-[#374151] text-gray-400 hover:text-white hover:border-gray-500 text-sm transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading || loadingData}
                            className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Registrando..." : "Registrar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};