import { getKardex } from "../../../services/KardexServices";
import { getProductandWarehouses } from "../../../services/DropDown";
import { useEffect, useState } from "react";
import type { KardexEntry } from "../types/kardex";

export const KardexPage = () => {
    const [kardexEntries, setKardexEntries] = useState<KardexEntry[]>([]);
    const [loading, setLoading] = useState(false);
    
    const [products, setProducts] = useState<any[]>([]); 
    const [selectedProductCen, setSelectedProductCen] = useState<string | "">(""); 

    const activeCompany = JSON.parse(localStorage.getItem("activeCompany") || "{}");
    const companyId = activeCompany.id;
    const companyCen = activeCompany.companyCen;

    useEffect(() => {
        const loadProducts = async () => {
            if (!companyCen) return;
            try {
                const data = await getProductandWarehouses(companyCen, companyId);
                setProducts(data.products);
            } catch (error) {
                console.error("Error al cargar productos:", error);
            }
        };
        loadProducts();
    }, [companyCen]);

    useEffect(() => {
        const fetchKardex = async () => {
            if (!selectedProductCen || !companyCen) return; 
            
            setLoading(true);
            try {
                const data = await getKardex(companyCen, companyId, selectedProductCen);
                setKardexEntries(data);
            } catch (error) {
                console.error("Error al obtener el kardex:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchKardex();
    }, [selectedProductCen, companyCen]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("es-ES", { 
            day: "2-digit", month: "short", year: "numeric", 
            hour: "2-digit", minute: "2-digit" 
        });
    };

    return(
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-2xl md:text-4xl text-center font-extrabold text-white tracking-tight mb-10">
                Historial de Movimientos (Kardex)
            </h1>

            
            <div className="mb-6 bg-[#111827] p-4 rounded-xl border border-[#1f2937] flex items-center gap-4 shadow-sm">
                <label className="text-sm font-medium text-gray-300">Seleccionar Producto:</label>
                <select 
                    value={selectedProductCen} 
                    onChange={(e) => setSelectedProductCen(e.target.value)}
                    className="bg-[#0f172a] border border-[#374151] text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors w-72"
                >
                    <option value="" disabled>-- Elija un producto --</option>
                    {products.map(p => (
                        <option key={p.productCen} value={p.productCen}>
                            {p.sku} - {p.name}
                        </option>
                    ))}
                </select>
            </div>

        
            <div className="bg-[#111827] border border-[#1f2937] rounded-xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-[#1f2937] text-gray-300 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">Fecha</th>
                                <th className="px-6 py-4">Bodega</th>
                                <th className="px-6 py-4">Tipo</th>
                                <th className="px-6 py-4 text-right">Cant.</th>
                                <th className="px-6 py-4 text-right">Balance</th>
                                <th className="px-6 py-4">Referencia</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1f2937]">
                            {!selectedProductCen ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 text-base">
                                        Seleccione un producto arriba para ver su historial
                                    </td>
                                </tr>
                            ) : loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        Cargando historial...
                                    </td>
                                </tr>
                            ) : kardexEntries.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        No se encontraron movimientos para este producto.
                                    </td>
                                </tr>
                            ) : (
                                kardexEntries.map((entry) => (
                                    <tr key={entry.movementCen} className="hover:bg-[#1f2937]/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">{formatDate(entry.date)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{entry.warehouseName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                                {entry.movementType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-white">{entry.quantity}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right font-semibold text-emerald-400">{entry.balance}</td>
                                        <td className="px-6 py-4 min-w-50">{entry.referenceCen}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}