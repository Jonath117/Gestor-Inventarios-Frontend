import { getKardex } from "../../../services/KardexServices";
import { getProductandWarehouses } from "../../../services/DropDown";
import { useEffect, useState } from "react";
import type { KardexEntry } from "../types/kardex";

export const KardexPage = () => {
    const [kardexEntries, setKardexEntries] = useState<KardexEntry[]>([]);
    const [loading, setLoading] = useState(false);
    
    const [products, setProducts] = useState<any[]>([]); 
    const [selectedProductId, setSelectedProductId] = useState<number | "">(""); 

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const storedCompany = localStorage.getItem("activeCompany");
                if (!storedCompany) return; 
                const companyId = JSON.parse(storedCompany).id;
                
                const data = await getProductandWarehouses(companyId);
                setProducts(data.products);
            } catch (error) {
                console.error("Error al cargar productos:", error);
            }
        };
        loadProducts();
    }, []);

    useEffect(() => {
        const fetchKardex = async () => {
            if (!selectedProductId) return; 
            
            setLoading(true);
            try {
                const storedCompany = localStorage.getItem("activeCompany");
                if (!storedCompany) return;
                const companyId = JSON.parse(storedCompany).id;
                
                const data = await getKardex(companyId, Number(selectedProductId));
                setKardexEntries(data);
            } catch (error) {
                console.error("Error al obtener el kardex:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchKardex();
    }, [selectedProductId]);

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
                    value={selectedProductId} 
                    onChange={(e) => setSelectedProductId(Number(e.target.value))}
                    className="bg-[#0f172a] border border-[#374151] text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors w-72"
                >
                    <option value="" disabled>-- Elija un producto --</option>
                    {products.map(p => (
                        <option key={p.id} value={p.id}>
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
                                <th className="px-6 py-4 text-right">Stock Ant.</th>
                                <th className="px-6 py-4 text-right">Nuevo Stock</th>
                                <th className="px-6 py-4">Motivo</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1f2937]">
                            {!selectedProductId ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500 text-base">
                                        Seleccione un producto arriba para ver su historial
                                    </td>
                                </tr>
                            ) : loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                        Cargando historial...
                                    </td>
                                </tr>
                            ) : kardexEntries.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                        No se encontraron movimientos para este producto.
                                    </td>
                                </tr>
                            ) : (
                                kardexEntries.map((entry) => (
                                    <tr key={entry.id} className="hover:bg-[#1f2937]/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">{formatDate(entry.date)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{entry.wareHouseName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                                {entry.movementType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-white">{entry.quantity}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-gray-500">{entry.previousStock}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right font-semibold text-emerald-400">{entry.newStock}</td>
                                        <td className="px-6 py-4 min-w-50">{entry.reason}</td>
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