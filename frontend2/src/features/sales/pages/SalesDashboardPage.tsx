import { useEffect, useState } from "react";
import { getDailySales } from "../../../services/SalesService";
import { StatCard } from "../../dashboard/components/StatCard";
import type { DailySalesDashboard } from "../types/sales.types";
import { CurrencyDollarIcon, TicketIcon, ChartBarIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

export const SalesDashboardPage = () => {
    const activeCompany = JSON.parse(localStorage.getItem("activeCompany") || "{}");
    const companyId = activeCompany.id;
    const companyCen = activeCompany.companyCen;

    const [data, setData] = useState<DailySalesDashboard | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        if (!companyCen) return;
        setLoading(true);
        try {
            const result = await getDailySales(companyCen, companyId);
            setData(result);
        } catch (error) {
            console.error("Error sales dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [companyCen]);

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Reporte de Ventas</h1>
                    <p className="text-gray-500">Métricas del día de hoy</p>
                </div>
                <button onClick={fetchData} className="p-2 rounded-lg bg-[#1f2937] text-gray-400 hover:text-white transition-colors">
                    <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <StatCard 
                    title="Venta Total (Hoy)" 
                    value={`$${data?.totalSales.toFixed(2) ?? "0.00"}`} 
                    accent="emerald"
                    subtitle="Ingresos brutos"
                    icon={<CurrencyDollarIcon className="w-6 h-6" />}
                />
                <StatCard 
                    title="Tickets Emitidos" 
                    value={data?.ticketsCount ?? 0} 
                    accent="indigo"
                    subtitle="Órdenes procesadas"
                    icon={<TicketIcon className="w-6 h-6" />}
                />
                <StatCard 
                    title="Promedio por Ticket" 
                    value={`$${data?.averageTicket.toFixed(2) ?? "0.00"}`} 
                    accent="red"
                    subtitle="Valor medio de consumo"
                    icon={<ChartBarIcon className="w-6 h-6" />}
                />
            </div>
            
            {/* Visual feedback of live integration */}
            <div className="bg-[#111827] border border-[#1f2937] p-6 rounded-2xl">
                <h2 className="text-white font-bold mb-4">Estado de Integración</h2>
                <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-gray-400">Conectado a Módulo de Inventario vía HTTP (Descuento de stock en tiempo real activo)</span>
                </div>
            </div>
        </div>
    );
};
