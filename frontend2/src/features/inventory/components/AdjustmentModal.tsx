import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import type { AdjustmentPayload } from "../types/inventory";
import { getProductandWarehouses } from "../../../services/DropDown";
import { useToast } from "../../../components/Toast";
import { Button } from "../../../components/ButtonComponent";

interface Props {
    companyId: number;
    onClose: () => void;
    onSubmit: (data: AdjustmentPayload) => Promise<void>;
}

export const AdjustmentModal = ({ companyId, onClose, onSubmit }: Props) => {
    const toast = useToast();

    const activeCompany = JSON.parse(localStorage.getItem("activeCompany") || "{}");
    const companyCen = activeCompany.companyCen;

    const [form, setForm] = useState({
        productCen: "",
        warehouseCen: "",
        quantity: 0,
        adjustmentType: "IN",
        reason: "",
    });

    const [products, setProducts] = useState<any[]>([]);
    const [warehouses, setWarehouses] = useState<any[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadDropdownData = async () => {
            if (!companyCen) return;
            try {
                const data = await getProductandWarehouses(companyCen, companyId);
                setProducts(data.products);
                setWarehouses(data.warehouses);
            } catch {
                toast.error("Error al cargar catálogo", "No se pudieron cargar los productos y bodegas.");
            } finally {
                setLoadingData(false);
            }
        };
        loadDropdownData();
    }, [companyCen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === "quantity" ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload: AdjustmentPayload = {
                warehouseCen: form.warehouseCen,
                reason: form.reason,
                lines: [
                    {
                        productCen: form.productCen,
                        quantity: form.quantity,
                        adjustmentType: form.adjustmentType
                    }
                ]
            };
            await onSubmit(payload);
            toast.success("Ajuste registrado", "El stock fue actualizado correctamente.");
            onClose();
        } catch (error: any) {
            toast.error("Error al registrar", error.message || "No se pudo registrar el ajuste.");
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
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="text-xs text-gray-400 mb-1 block">Producto</label>
                                    <select
                                        name="productCen"
                                        value={form.productCen}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-[#0f172a] border border-[#374151] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                                    >
                                        <option value="" disabled>Seleccione...</option>
                                        {products.map((p) => (
                                            <option key={p.productCen} value={p.productCen}>{p.sku} - {p.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 mb-1 block">Bodega</label>
                                    <select
                                        name="warehouseCen"
                                        value={form.warehouseCen}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-[#0f172a] border border-[#374151] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                                    >
                                        <option value="" disabled>Seleccione...</option>
                                        {warehouses.map((w) => (
                                            <option key={w.warehouseCen} value={w.warehouseCen}>{w.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 mb-1 block">Tipo Ajuste</label>
                                    <select
                                        name="adjustmentType"
                                        value={form.adjustmentType}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-[#0f172a] border border-[#374151] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                                    >
                                        <option value="IN">Entrada (+)</option>
                                        <option value="OUT">Salida (-)</option>
                                    </select>
                                </div>
                            </div>
                        </>
                    )}

                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">Cantidad</label>
                        <input
                            type="number"
                            name="quantity"
                            value={form.quantity || ""}
                            onChange={handleChange}
                            required
                            min="1"
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
                            placeholder="Ej: Ajuste por inventario físico"
                            className="w-full bg-[#0f172a] border border-[#374151] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                        />
                    </div>
                    <div className="flex justify-between gap-5">
                        <Button variant="danger" size="lg" onClick={onClose} fullWidth={true} >
                            Cancelar
                        </Button>

                        <Button variant="success" size="lg" type="submit" loading={loading} fullWidth={true}>
                            Registrar
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};