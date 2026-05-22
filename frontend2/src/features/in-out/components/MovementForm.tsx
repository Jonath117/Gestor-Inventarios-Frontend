import { useState, useEffect } from "react";
import { createDocument } from "../../../services/MovementService";
import { getProductandWarehouses } from "../../../services/DropDown";
import { Button } from "../../../components/ButtonComponent";
import { useToast } from "../../../components/Toast";

export const MovementForm = () => {
    const [form, setForm] = useState({
        productCen: "",
        warehouseCen: "",
        movementType: "IN",
        quantity: "",
        reference: "",
        reason: "",
    });

    const [products, setProducts] = useState<any[]>([]);
    const [warehouses, setWarehouses] = useState<any[]>([]);

    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const activeCompany = JSON.parse(localStorage.getItem("activeCompany") || "{}");
    const companyId = activeCompany.id;
    const companyCen = activeCompany.companyCen;

    const blockInvalidChars = (e: React.KeyboardEvent) => {
        if (["e", "E", ".", ","].includes(e.key)) {
            e.preventDefault();
        }
    };

    useEffect(() => {
        const loadCatalogs = async () => {
            if (companyCen) {
                try {
                    const data = await getProductandWarehouses(companyCen, companyId);
                    setProducts(data.products);
                    setWarehouses(data.warehouses);
                } catch (error: any) {
                    toast.error("Error al cargar catálogos", error.message);
                }
            }
        };
        loadCatalogs();
    }, [companyCen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (Number(form.quantity) <= 0) {
            toast.error("Error al registrar el movimiento", "La cantidad debe ser mayor a 0");
            return;
        }

        setLoading(true);

        try {
            const documentType = form.movementType === "IN" ? "PURCHASE" : "SALE";
            
            const documentData = {
                warehouseCen: form.warehouseCen,
                documentType: documentType,
                source: "FRONTEND_MANUAL",
                referenceCen: form.reference,
                reason: form.reason,
                items: [
                    {
                        productCen: form.productCen,
                        quantity: Number(form.quantity)
                    }
                ]
            };

            await createDocument(companyCen, companyId, documentData);

            toast.success("Movimiento registrado con éxito", "El movimiento se ha registrado correctamente.");

            setForm(prev => ({
                ...prev,
                productCen: "",
                quantity: "",
                reference: "",
                reason: ""
            }));

        } catch (error: any) {
            toast.error("Error al registrar el movimiento", error.message);
        } finally {
            setLoading(false);
        }
    };

    const isIncome = form.movementType === "IN";
    const tabActiveIncome = isIncome ? "bg-emerald-600/20 text-emerald-400 border-emerald-500/50" : "bg-transparent text-gray-400 border-transparent hover:text-gray-300";
    const tabActiveOutcome = !isIncome ? "bg-rose-600/20 text-rose-400 border-rose-500/50" : "bg-transparent text-gray-400 border-transparent hover:text-gray-300";

    return (
        <div className="bg-[#111827] border border-[#1f2937] rounded-2xl shadow-xl overflow-hidden max-w-2xl mx-auto">
            {/* TABS */}
            <div className="flex border-b border-[#1f2937] bg-[#0f172a]/50">
                <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, movementType: "IN" }))}
                    className={`flex-1 py-4 text-medium sm:text-medium font-semibold border-b-2 transition-colors ${tabActiveIncome}`}
                >
                    Entrada (Compra)
                </button>
                <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, movementType: "OUT" }))}
                    className={`flex-1 py-4 text-medium sm:text-medium font-semibold border-b-2 transition-colors ${tabActiveOutcome}`}
                >
                    Salida (Venta/Baja)
                </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-6 flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">Producto</label>
                        <select name="productCen" value={form.productCen} onChange={handleChange} required
                            className="w-full bg-[#0f172a] border border-[#374151] text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors">
                            <option value="" disabled>Seleccione un producto...</option>
                            {products.map(p => <option key={p.productCen} value={p.productCen}>{p.sku} - {p.name}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">Bodega</label>
                        <select name="warehouseCen" value={form.warehouseCen} onChange={handleChange} required
                            className="w-full bg-[#0f172a] border border-[#374151] text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors">
                            <option value="" disabled>Seleccione bodega...</option>
                            {warehouses.map(w => <option key={w.warehouseCen} value={w.warehouseCen}>{w.name}</option>)}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">Cantidad</label>
                        <input type="number" name="quantity" value={form.quantity} onChange={handleChange} required min="1" step="1" onKeyDown={blockInvalidChars}
                            className="w-full bg-[#0f172a] border border-[#374151] text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors" />
                    </div>

                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">
                            {isIncome ? "Nro. de Factura Proveedor" : "Nro. de Ticket / Pedido"}
                        </label>
                        <input type="text" name="reference" value={form.reference} onChange={handleChange} required placeholder={isIncome ? "Ej: FAC-9900" : "Ej: T-0012"}
                            className="w-full bg-[#0f172a] border border-[#374151] text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors" />
                    </div>
                </div>

                {/* FILA 3: Motivo */}
                <div>
                    <label className="text-xs text-gray-400 mb-1 block">Motivo</label>
                    <textarea name="reason" value={form.reason} onChange={handleChange} required rows={2}
                        placeholder={isIncome ? "Ej: Compra mensual a distribuidor" : "Ej: Venta al cliente final o merma"}
                        className="w-full bg-[#0f172a] border border-[#374151] text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none" />
                </div>

                {/* Botón Submit */}
                <Button
                    variant={isIncome ? "success" : "danger"}
                    type="submit"
                    loading={loading}
                    loadingText={`Registrar ${isIncome ? "Entrada" : "Salida"}`}
                    fullWidth
                    size="lg"
                >
                    {`Registrar ${isIncome ? "Entrada" : "Salida"}`}
                </Button>
            </form>
        </div>
    );
};