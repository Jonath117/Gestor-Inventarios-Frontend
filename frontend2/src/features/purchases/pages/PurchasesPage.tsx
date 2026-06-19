import { useState } from "react";
import { Button } from "../../../components/ButtonComponent";
import { PurchaseForm } from "../components/PurchaseForm";
import { PurchaseOrderDetailView } from "../components/PurchaseOrderDetailView";
import { usePurchases } from "../hooks/usePurchases";

export const PurchasesPage = () => {
    const activeCompany = JSON.parse(localStorage.getItem("activeCompany") || "{}");
    const currentCompanyId = activeCompany.id;
    const currentCompanyCen = activeCompany.companyCen;

    const { orders, isLoading, createOrder, getSupplierName, refreshOrders } = usePurchases(currentCompanyCen, currentCompanyId);

    const [viewState, setViewState] = useState<"LIST" | "CREATE" | "DETAIL">("LIST");
    const [selectedOrderCen, setSelectedOrderCen] = useState<string | null>(null);

    const handleCreateSubmit = (data: any) => {
        createOrder(data, () => {
            setViewState("LIST");
        });
    };

    const handleViewDetail = (orderCen: string) => {
        setSelectedOrderCen(orderCen);
        setViewState("DETAIL");
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Compras a Proveedores</h1>

                {viewState === "LIST" && (
                    <Button variant="primary" size="lg" onClick={() => setViewState("CREATE")}>
                        + Nueva Orden
                    </Button>
                )}
            </div>

            {viewState === "CREATE" && (
                <div className="mt-4">
                    <PurchaseForm 
                        companyId={currentCompanyId}
                        companyCen={currentCompanyCen}
                        onSubmit={handleCreateSubmit}
                        onCancel={() => setViewState("LIST")}
                    />
                </div>
            )}

            {viewState === "DETAIL" && selectedOrderCen && (
                <div className="mt-4">
                    <PurchaseOrderDetailView 
                        companyId={currentCompanyId}
                        companyCen={currentCompanyCen}
                        orderCen={selectedOrderCen}
                        onBack={() => setViewState("LIST")}
                        onConfirmed={() => {
                            setViewState("LIST");
                            refreshOrders();
                        }}
                    />
                </div>
            )}

            {viewState === "LIST" && (
                isLoading ? (
                    <p className="text-gray-400 text-center mt-10">Cargando órdenes...</p>
                ) : (
                    <div className="overflow-x-auto bg-[#111827] rounded-xl border border-[#1f2937] shadow-lg">
                        <table className="w-full text-left border-collapse min-w-200">
                            <thead className="bg-[#1f2937] text-gray-400 uppercase text-xs tracking-wider">
                                <tr className="border-b border-[#374151]">
                                    <th className="p-4 font-semibold">CEN de Orden</th>
                                    <th className="p-4 font-semibold">Proveedor</th>
                                    <th className="p-4 font-semibold">Fecha Creación</th>
                                    <th className="p-4 font-semibold text-center">Items</th>
                                    <th className="p-4 font-semibold text-center">Estado</th>
                                    <th className="p-4 font-semibold text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1f2937]">
                                {orders.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-6 text-center text-gray-500 italic">
                                            No hay órdenes de compra registradas.
                                        </td>
                                    </tr>
                                ) : (
                                    orders.map(order => (
                                        <tr key={order.orderCen} className="hover:bg-[#1f2937]/50 transition-colors">
                                            <td className="p-4 text-md text-gray-400 font-medium">{order.orderCen}</td>
                                            {/* Se muestra el nombre del proveedor en lugar del CEN */}
                                            <td className="p-4 text-md text-gray-400">{getSupplierName(order.supplierCen)}</td>
                                            <td className="p-4 text-md text-gray-400">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 text-md text-center text-gray-400">{order.itemCount}</td>
                                            <td className="p-4 text-center">
                                                {order.status === 2 ? (
                                                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-md px-2 py-1 rounded-full">Confirmada</span>
                                                ) : order.status === 1 ? (
                                                    <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-md px-2 py-1 rounded-full">Pendiente</span>
                                                ) : (
                                                    <span className="bg-red-500/10 text-red-400 border border-red-500/20 text-md px-2 py-1 rounded-full">Cancelada</span>
                                                )}
                                            </td>
                                            <td className="p-4 text-center flex justify-center gap-2">
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    onClick={() => handleViewDetail(order.orderCen)}
                                                    fullWidth={true}
                                                >
                                                    Ver Detalles
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )
            )}
        </div>
    );
};
