import { useEffect, useState } from "react";
import { getKdsItems, updateKdsStatus } from "../../../services/SalesService";
import type { KdsItem } from "../../sales/types/sales.types";
import { Button } from "../../../components/ButtonComponent";
import { useToast } from "../../../components/Toast";
import { CheckCircleIcon, FireIcon } from "@heroicons/react/24/outline";

export const KdsPage = () => {
    const activeCompany = JSON.parse(localStorage.getItem("activeCompany") || "{}");
    const companyId = activeCompany.id;
    const companyCen = activeCompany.companyCen;

    const [items, setItems] = useState<KdsItem[]>([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const fetchKds = async () => {
        try {
            const data = await getKdsItems(companyCen, companyId);
            const arrayData = Array.isArray(data) ? data : (data?.data ?? data?.items ?? []);
            
            console.log("KDS Items recibidos:", arrayData); 
            
            setItems(arrayData);
        } catch (error: any) {
            console.error("Error KDS:", error);
        }
    };

    useEffect(() => {
        if (companyCen) {
            fetchKds();
            const interval = setInterval(fetchKds, 5000);
            return () => clearInterval(interval);
        }
    }, [companyCen]);

    const handleStatusUpdate = async (itemCen: string, newStatus: string) => {
        try {
            setLoading(true);
            await updateKdsStatus(companyCen, companyId, itemCen, newStatus);
            toast.success("KDS", `Ítem marcado como ${newStatus}`);
            fetchKds();
        } catch (error: any) {
            toast.error("Error", error.message);
        } finally {
            setLoading(false);
        }
    };


    const normalize = (s: string) => s?.toLowerCase().trim();

    const pendingItems   = items.filter(i => {
        const s = normalize(i.status);
        return s === 'pending' || s === 'created' || s === 'open';
    });
    
    const preparingItems = items.filter(i => normalize(i.status) === 'preparing');
    const readyItems     = items.filter(i => normalize(i.status) === 'ready');

    return (
        <div className="p-6 h-[calc(100vh-100px)] flex flex-col gap-6">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <FireIcon className="w-8 h-8 text-orange-500" />
                Kitchen Display System (KDS)
            </h1>

            <div className="flex-1 grid grid-cols-3 gap-6 overflow-hidden">
                {/* PENDIENTES */}
                <div className="bg-[#111827] border border-[#1f2937] rounded-2xl flex flex-col overflow-hidden">
                    <div className="p-4 bg-gray-500/10 border-b border-[#1f2937] flex justify-between items-center">
                        <h2 className="text-gray-400 font-bold uppercase text-sm tracking-widest">Pendientes</h2>
                        <span className="bg-gray-500/20 text-gray-300 px-2 py-0.5 rounded-full text-xs">{pendingItems.length}</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                        {pendingItems.map(item => (
                            <div key={item.ticketItemCen} className="bg-[#0f172a] border border-[#1f2937] rounded-xl p-4 shadow-lg border-l-4 border-l-gray-500">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-white font-bold text-lg">{item.productName}</span>
                                    <span className="text-gray-500 text-xs font-mono">#{item.ticketCen.slice(-4)}</span>
                                </div>
                                <div className="text-2xl font-black text-indigo-400 mb-3">x{item.quantity}</div>
                                {item.note && <div className="text-xs text-orange-400 bg-orange-400/10 p-2 rounded mb-4">Nota: {item.note}</div>}
                                <Button variant="primary" fullWidth onClick={() => handleStatusUpdate(item.ticketItemCen, "preparing")} loading={loading}>
                                    Empezar Preparación
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* EN PREPARACIÓN */}
                <div className="bg-[#111827] border border-[#1f2937] rounded-2xl flex flex-col overflow-hidden">
                    <div className="p-4 bg-orange-500/10 border-b border-[#1f2937] flex justify-between items-center">
                        <h2 className="text-orange-400 font-bold uppercase text-sm tracking-widest">En Preparación</h2>
                        <span className="bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded-full text-xs">{preparingItems.length}</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                        {preparingItems.map(item => (
                            <div key={item.ticketItemCen} className="bg-[#0f172a] border border-[#1f2937] rounded-xl p-4 shadow-lg border-l-4 border-l-orange-500">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-white font-bold text-lg">{item.productName}</span>
                                    <span className="text-gray-500 text-xs font-mono">#{item.ticketCen.slice(-4)}</span>
                                </div>
                                <div className="text-2xl font-black text-orange-400 mb-3">x{item.quantity}</div>
                                <Button variant="success" fullWidth onClick={() => handleStatusUpdate(item.ticketItemCen, "ready")} loading={loading}>
                                    Marcar como Listo
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* LISTOS */}
                <div className="bg-[#111827] border border-[#1f2937] rounded-2xl flex flex-col overflow-hidden">
                    <div className="p-4 bg-emerald-500/10 border-b border-[#1f2937] flex justify-between items-center">
                        <h2 className="text-emerald-400 font-bold uppercase text-sm tracking-widest">Listos / Entregados</h2>
                        <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full text-xs">{readyItems.length}</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 opacity-60">
                        {readyItems.map(item => (
                            <div key={item.ticketItemCen} className="bg-[#0f172a] border border-[#1f2937] rounded-xl p-4 border-l-4 border-l-emerald-500">
                                <div className="flex justify-between items-start">
                                    <span className="text-gray-300 font-bold">{item.productName}</span>
                                    <CheckCircleIcon className="w-5 h-5 text-emerald-500" />
                                </div>
                                <div className="text-gray-500 text-sm">Comanda entregada</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};