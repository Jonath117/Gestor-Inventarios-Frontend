import { useState, useEffect } from "react";
import type { IProductCreate, IProductUpdate, Product } from "../types/product.types";
import { Button } from "../../../components/ButtonComponent";
import { getCategories } from "../../../services/CategoryService";
import { getUnits } from "../../../services/UnitsService";
import { useToast } from "../../../components/Toast";

interface Props {
    initialData?: Product | null;
    companyId: number;
    companyCen: string;
    onSubmit: (data: any) => Promise<void>;
    onCancel: () => void;
}

export const ProductForm = ({ initialData, companyId, companyCen, onSubmit, onCancel }: Props) => {
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const [categories, setCategories] = useState<any[]>([]);
    const [units, setUnits] = useState<any[]>([]);

    const [form, setForm] = useState<IProductCreate>({
        sku: "",
        name: "",
        description: "",
        costPrice: 0,
        salePrice: 0,
        reorderLevel: 1,
        categoryCen: "",
        unitCen: "",
        stationCode: "",
    });

    useEffect(() => {
        const loadCatalogs = async () => {
            if (!companyCen) return;
            try {
                setLoading(true);
                const data = await getCategories(companyCen, companyId);
                const data2 = await getUnits(companyCen, companyId);
                setCategories(data);
                setUnits(data2);
            } catch (err: any) {
                toast.error("Error al obtener las categorias y unidades", err.message);
            } finally {
                setLoading(false);
            }
        };
        loadCatalogs();

        if (initialData) {
            setForm({
                sku: initialData.sku,
                name: initialData.name,
                description: initialData.description || "",
                costPrice: initialData.costPrice || 0,
                salePrice: initialData.salePrice,
                reorderLevel: initialData.reorderLevel,
                categoryCen: initialData.categoryCen || "",
                unitCen: initialData.unitCen || "",
                stationCode: initialData.stationCode || "",
            });
        }
    }, [initialData, companyCen, companyId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: ["costPrice", "salePrice", "reorderLevel"].includes(name)
                ? Number(value)
                : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (initialData) {
                await onSubmit({ productCen: initialData.productCen, ...form } as IProductUpdate);
            } else {
                await onSubmit(form);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#111827] border border-[#1f2937] rounded-2xl shadow-xl overflow-hidden max-w-3xl mx-auto p-6 lg:p-8">
            <h2 className="text-xl font-bold text-white mb-6 border-b border-[#1f2937] pb-4">
                {initialData ? "Editar Producto" : "Registrar Nuevo Producto"}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Fila 1: SKU y Nombre */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">Código SKU *</label>
                        <input required name="sku" value={form.sku} onChange={handleChange} placeholder="Ej: BEB-001"
                            className="w-full bg-[#0f172a] border border-[#374151] text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 uppercase" />
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">Nombre del Producto *</label>
                        <input required name="name" value={form.name} onChange={handleChange} placeholder="Ej: Coca Cola 2L"
                            className="w-full bg-[#0f172a] border border-[#374151] text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500" />
                    </div>
                </div>

                {/* Fila 2: Categoría y Unidad */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">Categoría *</label>
                        <select required name="categoryCen" value={form.categoryCen || ""} onChange={handleChange}
                            className="w-full bg-[#0f172a] border border-[#374151] text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500">
                            <option value="" disabled>Seleccione...</option>
                            {categories.map(c => <option key={c.categoryCen} value={c.categoryCen}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">Unidad de Medida *</label>
                        <select required name="unitCen" value={form.unitCen || ""} onChange={handleChange}
                            className="w-full bg-[#0f172a] border border-[#374151] text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500">
                            <option value="" disabled>Seleccione...</option>
                            {units.map(u => <option key={u.unitCen} value={u.unitCen}>{u.name}</option>)}
                        </select>
                    </div>
                </div>

                {/* Fila 3: Precios y Alertas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">Costo de Compra (Bs)</label>
                        <input type="number" step="0.01" min="0" required name="costPrice" value={form.costPrice} onChange={handleChange}
                            className="w-full bg-[#0f172a] border border-[#374151] text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500" />
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">Precio de Venta (Bs) *</label>
                        <input type="number" step="0.01" min="0" required name="salePrice" value={form.salePrice} onChange={handleChange}
                            className="w-full bg-[#0f172a] border border-[#374151] text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500" />
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">Nivel de Reorden *</label>
                        <input type="number" min="1" required name="reorderLevel" value={form.reorderLevel} onChange={handleChange}
                            className="w-full bg-[#0f172a] border border-[#374151] text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500" />
                    </div>
                </div>

                {/* Fila 4: Descripción */}
                <div>
                    <label className="text-xs text-gray-400 mb-1 block">Descripción (Opcional)</label>
                    <textarea name="description" value={form.description} onChange={handleChange} rows={2}
                        className="w-full bg-[#0f172a] border border-[#374151] text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 resize-none" />
                </div>

                {/* Fila 5: Station Code */}
                <div>
                    <label className="text-xs text-gray-400 mb-1 block">Código de Estación (Opcional)</label>
                    <input name="stationCode" value={form.stationCode} onChange={handleChange} placeholder="Ej: ST-01"
                        className="w-full bg-[#0f172a] border border-[#374151] text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500" />
                </div>

                {/* Botones */}
                <div className="flex justify-between gap-3 mt-4">
                    <Button variant="danger" type="button" onClick={onCancel} disabled={loading} fullWidth={true}>
                        Cancelar
                    </Button>
                    <Button variant="success" type="submit" loading={loading} loadingText="Guardando..." fullWidth={true}>
                        {initialData ? "Actualizar Producto" : "Guardar Producto"}
                    </Button>
                </div>
            </form>
        </div>
    );
};