import { useEffect, useState } from "react";
import { getDashboard } from "../../../services/DashboardServices";
import { StatCard } from "../components/StatCard";
import type { DashboardData } from "../types/dashboard";
import {
    CubeIcon,
    CircleStackIcon,
    ExclamationTriangleIcon,
    ArrowPathIcon,
} from "@heroicons/react/24/outline";

export const DashboardPage = () => {
    const [dashboard, setDashboard] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const companyId = JSON.parse(localStorage.getItem("activeCompany") || "{}").id;
    const companyName = JSON.parse(localStorage.getItem("activeCompany") || "{}").name;

    const fetchData = () => {
        setLoading(true);
        getDashboard(companyId)
            .then((data) => {
                setDashboard(data);
                setLastUpdated(new Date());
            })
            .catch((error) => console.error("Error al obtener el dashboard:", error))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchData();
    }, [companyId]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#0d1117]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-500 text-sm">Cargando dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0d1117] px-8 py-8">

            {/* Header */}
            <div className="flex items-start justify-between mb-10">
                <div>
                    <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-1">
                        {companyName || "Empresa"}
                    </p>
                    <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Resumen general del inventario
                    </p>
                </div>

                <button
                    onClick={fetchData}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1f2937] border border-[#374151] text-gray-400 hover:text-white text-xs transition-colors"
                >
                    <ArrowPathIcon className="w-4 h-4" />
                    Actualizar
                </button>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
                <StatCard
                    title="Total Productos"
                    value={dashboard?.totalProducts ?? 0}
                    accent="indigo"
                    subtitle="Productos registrados"
                    icon={<CubeIcon className="w-6 h-6" />}
                />
                <StatCard
                    title="Stock Total"
                    value={dashboard?.totalStockQuantity ?? 0}
                    accent="emerald"
                    subtitle="Unidades en todas las bodegas"
                    icon={<CircleStackIcon className="w-6 h-6" />}
                />
                <StatCard
                    title="Alertas de Stock Bajo"
                    value={dashboard?.lowStockAlerts ?? 0}
                    accent="red"
                    subtitle={
                        (dashboard?.lowStockAlerts ?? 0) > 0
                            ? "Requieren atención inmediata"
                            : "Todo en orden"
                    }
                    icon={<ExclamationTriangleIcon className="w-6 h-6" />}
                />
            </div>

            {/* Alerta visible si hay stock bajo */}
            {(dashboard?.lowStockAlerts ?? 0) > 0 && (
                <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    <ExclamationTriangleIcon className="w-5 h-5 shrink-0" />
                    <span>
                        <strong>{dashboard?.lowStockAlerts}</strong> producto(s) están por debajo del stock mínimo.
                        Revisa el inventario para tomar acción.
                    </span>
                </div>
            )}

            {/* Footer timestamp */}
            {lastUpdated && (
                <p className="text-xs text-gray-600 mt-8">
                    Última actualización: {lastUpdated.toLocaleTimeString("es-ES")}
                </p>
            )}
        </div>
    );
};