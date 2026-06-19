import { Button } from "../../../components/ButtonComponent";
import { usePurchaseDetail } from "../hooks/usePurchaseDetail";

interface PurchaseOrderDetailProps {
    companyId: number;
    companyCen: string;
    orderCen: string;
    onBack: () => void;
    onConfirmed: () => void;
}

export const PurchaseOrderDetailView = ({ companyId, companyCen, orderCen, onBack, onConfirmed }: PurchaseOrderDetailProps) => {
    const {
        detail,
        isLoading,
        confirmOrder,
        getSupplierName,
        getWarehouseName,
        getProductName
    } = usePurchaseDetail(companyCen, companyId, orderCen);

    if (isLoading) return <p className="text-gray-400 text-center mt-10">Cargando detalles...</p>;
    if (!detail) return <p className="text-red-400 text-center mt-10">No se pudo cargar la orden.</p>;

    return (
        <div className="bg-[#111827] p-6 rounded-xl border border-[#1f2937] text-white">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-xl font-bold">Detalle de Orden: {detail.orderCen}</h2>
                    {/* Mostrar Nombres en lugar de CENs */}
                    <p className="text-gray-400 mt-1">Proveedor: {getSupplierName(detail.supplierCen)}</p>
                    <p className="text-gray-400">Almacén: {getWarehouseName(detail.warehouseCen)}</p>
                    <p className="text-gray-400">Estado: {detail.status === 1 ? "Confirmada" : "Pendiente"}</p>
                </div>
                <Button variant="primary" onClick={onBack}>Volver</Button>
            </div>

            <div className="border-t border-[#374151] pt-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Productos en la Orden</h3>
                <div className="overflow-x-auto bg-[#1f2937] rounded-lg">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#374151] text-gray-300 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="p-3">Producto</th>
                                <th className="p-3 text-right">Cantidad</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#374151]">
                            {detail.items.map((item, idx) => (
                                <tr key={idx}>
                                    <td className="p-3 text-gray-200">{getProductName(item.productCen)}</td>
                                    <td className="p-3 text-right text-gray-200">{item.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {detail.status === 1 && (
                <div className="flex justify-end gap-3 border-t border-[#374151] pt-4">
                    <Button variant="success" onClick={() => confirmOrder(onConfirmed)}>
                        Confirmar Orden (Ingresar Stock)
                    </Button>
                </div>
            )}
        </div>
    );
};
