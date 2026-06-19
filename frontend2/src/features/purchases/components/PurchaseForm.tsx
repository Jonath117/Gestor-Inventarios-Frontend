import { Button } from "../../../components/ButtonComponent";
import type { PurchaseOrderCreate } from "../types/purchases.types";
import { usePurchaseForm } from "../hooks/usePurchaseForm";
import { useToast } from "../../../components/Toast";

interface PurchaseFormProps {
    companyId: number;
    companyCen: string;
    onSubmit: (data: PurchaseOrderCreate) => void;
    onCancel: () => void;
}

export const PurchaseForm = ({ companyId, companyCen, onSubmit, onCancel }: PurchaseFormProps) => {
    const {
        suppliers,
        warehouses,
        products,
        supplierCen,
        setSupplierCen,
        warehouseCen,
        setWarehouseCen,
        items,
        selectedProduct,
        setSelectedProduct,
        quantity,
        setQuantity,
        handleAddItem,
        handleRemoveItem
    } = usePurchaseForm(companyCen, companyId);
    const toast = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!supplierCen) {
            toast.warning("Debe seleccionar un proveedor");
            return;
        }
        if (!warehouseCen) {
            toast.warning("Debe seleccionar un almacén");
            return;
        }
        if (items.length === 0) {
            toast.warning("Debe agregar al menos un producto");
            return;
        }

        onSubmit({
            supplierCen,
            warehouseCen,
            items: items.map(({ productCen, quantity }) => ({ productCen, quantity }))
        });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-[#111827] p-6 rounded-xl border border-[#1f2937] text-white">
            <h2 className="text-xl font-bold mb-4">Nueva Orden de Compra</h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-gray-400 mb-1 text-sm">Proveedor</label>
                    <select 
                        className="w-full bg-[#1f2937] border border-[#374151] rounded-lg p-2.5 text-white"
                        value={supplierCen}
                        onChange={e => setSupplierCen(e.target.value)}
                        required
                    >
                        <option value="">Seleccione un proveedor</option>
                        {suppliers.map(s => (
                            <option key={s.supplierCen} value={s.supplierCen}>{s.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-gray-400 mb-1 text-sm">Almacén / Bodega Destino</label>
                    <select 
                        className="w-full bg-[#1f2937] border border-[#374151] rounded-lg p-2.5 text-white"
                        value={warehouseCen}
                        onChange={e => setWarehouseCen(e.target.value)}
                        required
                    >
                        <option value="" disabled>Seleccione una bodega</option>
                        {warehouses.map(w => (
                            <option key={w.warehouseCen} value={w.warehouseCen}>
                                {w.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="border-t border-[#374151] pt-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Agregar Productos</h3>
                {!warehouseCen && (
                    <p className="text-yellow-500 text-sm mb-4">Por favor, seleccione un almacén primero para ver los productos asociados.</p>
                )}
                <div className="flex gap-4 items-end mb-4">
                    <div className="flex-1">
                        <label className="block text-gray-400 mb-1 text-sm">Producto</label>
                        <select 
                            className="w-full bg-[#1f2937] border border-[#374151] rounded-lg p-2.5 text-white disabled:opacity-50"
                            value={selectedProduct}
                            onChange={e => setSelectedProduct(e.target.value)}
                            disabled={!warehouseCen}
                        >
                            <option value="">Seleccione un producto</option>
                            {products.map(p => (
                                <option key={p.productCen} value={p.productCen}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="w-32">
                        <label className="block text-gray-400 mb-1 text-sm">Cantidad</label>
                        <input 
                            type="number"
                            min="1"
                            className="w-full bg-[#1f2937] border border-[#374151] rounded-lg p-2.5 text-white disabled:opacity-50"
                            value={quantity}
                            onChange={e => setQuantity(Number(e.target.value))}
                            disabled={!warehouseCen}
                        />
                    </div>
                    <div>
                        <Button type="button" variant="primary" onClick={handleAddItem} disabled={!warehouseCen || !selectedProduct}>
                            Agregar
                        </Button>
                    </div>
                </div>

                {items.length > 0 && (
                    <div className="overflow-x-auto bg-[#1f2937] rounded-lg">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-[#374151] text-gray-300 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="p-3">Producto</th>
                                    <th className="p-3 text-right">Cantidad</th>
                                    <th className="p-3 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#374151]">
                                {items.map((item, idx) => (
                                    <tr key={idx}>
                                        <td className="p-3 text-gray-200">{item.name}</td>
                                        <td className="p-3 text-right text-gray-200">{item.quantity}</td>
                                        <td className="p-3 text-center">
                                            <button 
                                                type="button" 
                                                className="text-red-400 hover:text-red-300"
                                                onClick={() => handleRemoveItem(item.productCen)}
                                            >
                                                Quitar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="flex justify-end gap-3 border-t border-[#374151] pt-4">
                <Button type="button" variant="primary" onClick={onCancel}>
                    Cancelar
                </Button>
                <Button type="submit" variant="primary">
                    Guardar Orden
                </Button>
            </div>
        </form>
    );
};
