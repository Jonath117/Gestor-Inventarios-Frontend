import { useState, useEffect } from "react";
import { registerMovement } from "../../../services/MovementService"; 
import { getProductandWarehouses } from "../../../services/DropDown"; 
import type { MovementFormData } from "../types";

export const MovementForm = () => {
    const [form, setForm] = useState<MovementFormData>({
        productId: "",
        warehouseId: "",
        movementType: "IN",
        quantity: "",
        reference: "",
        reason: "",
    });

    const [products, setProducts] = useState<any[]>([]);
    const [warehouses, setWarehouses] = useState<any[]>([]);
    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

    const blockInvalidChars = (e: React.KeyboardEvent) => {
    if (["e", "E", ".", ","].includes(e.key)) {
        e.preventDefault();
        }
    };

    useEffect(() => {
        const loadCatalogs = async () => {
            const companyId = JSON.parse(localStorage.getItem("activeCompany") || "{}").id;
            if (companyId) {
                const data = await getProductandWarehouses(companyId);
                setProducts(data.products);
                setWarehouses(data.warehouses);
            }
        };
        loadCatalogs();
        
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        let newValue: string | number = value;

        if (name === "quantity") {
            
            if (value === "") {
                newValue = "";
            } else {
                
                const num = Math.floor(Number(value));
                
                newValue = Math.max(1, num);
            }
        } else if (name === "productId" || name === "warehouseId") {
            newValue = Number(value);
        }

        setForm(prev => ({
            ...prev,
            [name]: newValue
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const companyId = JSON.parse(localStorage.getItem("activeCompany") || "{}").id;
            
            await registerMovement(
                companyId,
                form.productId as number,
                form.warehouseId as number,
                form.movementType,
                form.quantity as number,
                form.reference,
                form.reason
            );

            setMessage({ text: "Movimiento registrado con éxito.", type: "success" });
                
            
            setForm(prev => ({ ...prev, productId: "", quantity: "", reference: "", reason: "" }));
        } catch (error) {
            setMessage({ text: "Error al registrar el movimiento.", type: "error" });
        } finally {
            setLoading(false);
            }
    };

    
    const isIncome = form.movementType === "IN";
    const activeColor = isIncome ? "bg-emerald-600 hover:bg-emerald-500" : "bg-rose-600 hover:bg-rose-500";
    const tabActiveIncome = isIncome ? "bg-emerald-600/20 text-emerald-400 border-emerald-500/50" : "bg-transparent text-gray-400 border-transparent hover:text-gray-300";
    const tabActiveOutcome = !isIncome ? "bg-rose-600/20 text-rose-400 border-rose-500/50" : "bg-transparent text-gray-400 border-transparent hover:text-gray-300";

    return (
        <div className="bg-[#111827] border border-[#1f2937] rounded-2xl shadow-xl overflow-hidden max-w-2xl mx-auto">
            
            
            <div className="flex border-b border-[#1f2937] bg-[#0f172a]/50">
                <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, movementType: "IN" }))}
                    className={`flex-1 py-4 text-sm font-semibold border-b-2 transition-colors ${tabActiveIncome}`}
                >
                    Entrada de Producto (Compra)
                </button>
                <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, movementType: "OUT" }))}
                    className={`flex-1 py-4 text-sm font-semibold border-b-2 transition-colors ${tabActiveOutcome}`}
                >
                    Salida de Producto (Venta)
                </button>
            </div>

 
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-5">
                    
                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">Producto</label>
                        <select name="productId" value={form.productId} onChange={handleChange} required
                            className="w-full bg-[#0f172a] border border-[#374151] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors">
                            <option value="" disabled>Seleccione un producto...</option>
                            {products.map(p => <option key={p.id} value={p.id}>{p.sku} - {p.name}</option>)}
                        </select>
                    </div>

            
                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">Bodega</label>
                        <select name="warehouseId" value={form.warehouseId} onChange={handleChange} required
                            className="w-full bg-[#0f172a] border border-[#374151] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors">
                            <option value="" disabled>Seleccione bodega...</option>
                            {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-5">

                
                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">Cantidad</label>
                        <input type="number" name="quantity" value={form.quantity} onChange={handleChange} required min="1" step="1" onKeyDown={blockInvalidChars}
                            className="w-full bg-[#0f172a] border border-[#374151] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors" />
                    </div>

                    
                    <div>
                        <label className="text-xs text-gray-400 mb-1 block">
                            {isIncome ? "Nro. de Factura Proveedor" : "Nro. de Ticket / Pedido"}
                        </label>
                        <input type="text" name="reference" value={form.reference} onChange={handleChange} required placeholder={isIncome ? "Ej: FAC-9900" : "Ej: T-0012"}
                            className="w-full bg-[#0f172a] border border-[#374151] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors" />
                    </div>
                </div>

             
                <div>
                    <label className="text-xs text-gray-400 mb-1 block">Motivo</label>
                    <textarea name="reason" value={form.reason} onChange={handleChange} required rows={2}
                        placeholder={isIncome ? "Ej: Compra mensual a distribuidor" : "Ej: Venta al cliente final"}
                        className="w-full bg-[#0f172a] border border-[#374151] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none" />
                </div>

        
                {message && (
                    <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                        {message.text}
                    </div>
                )}

          
                <button type="submit" disabled={loading}
                    className={`w-full py-3 rounded-lg text-white font-medium transition-colors disabled:opacity-50 mt-2 ${activeColor}`}>
                    {loading ? "Procesando..." : `Registrar ${isIncome ? "Entrada" : "Salida"}`}
                </button>
            </form>
        </div>
    );
};