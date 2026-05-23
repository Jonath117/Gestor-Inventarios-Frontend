import { useEffect, useState } from "react";
import { getDailyTickets, createTicket, getSellableCatalog, getTicketItems, addItemToTicket, payTicket, sendToKds, assignWaiter, getWarehouses } from "../../../services/SalesService";
import type { Ticket, SellableProduct, TicketItem, Warehouse } from "../types/sales.types";
import { Button } from "../../../components/ButtonComponent";
import { useToast } from "../../../components/Toast";
import { CubeIcon, ReceiptPercentIcon, UserIcon, CreditCardIcon, PencilSquareIcon, CheckIcon, XMarkIcon, BuildingStorefrontIcon } from "@heroicons/react/24/outline";

export const SalesPage = () => {
    const activeCompany = JSON.parse(localStorage.getItem("activeCompany") || "{}");
    const companyId = activeCompany.id;
    const companyCen = activeCompany.companyCen;

    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [catalog, setSellableCatalog] = useState<SellableProduct[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [ticketItems, setTicketItems] = useState<TicketItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingWaiter, setEditingWaiter] = useState(false);
    const [waiterInput, setWaiterInput] = useState("");
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [selectedWarehouseCen, setSelectedWarehouseCen] = useState<string>("");
    const toast = useToast();

    const fetchTickets = async () => {
        try {
            const data: Ticket[] = await getDailyTickets(companyCen, companyId);
            setTickets(data);
        } catch (error: any) {
            toast.error("Error", error.message);
        }
    };

    const fetchCatalog = async () => {
            try {
                const data: SellableProduct[] = await getSellableCatalog(companyCen, companyId, selectedWarehouseCen);
                setSellableCatalog(data);
            } catch (error: any) {
                toast.error("Error", error.message);
            }
        };

        useEffect(() => {
            if (companyCen) {
                fetchTickets();
                fetchWarehouses();
            }
        }, [companyCen]);

        useEffect(() => {
            if (companyCen && selectedWarehouseCen) {
                fetchCatalog();
            }
        }, [companyCen, selectedWarehouseCen]);

    const fetchWarehouses = async () => {
        try {
            const responseData = await getWarehouses(companyCen, companyId);
            
            const list: Warehouse[] = Array.isArray(responseData) 
                ? responseData 
                : (responseData?.data ?? responseData?.warehouses ?? []);
                
            setWarehouses(list);
            
            if (list.length > 0 && !selectedWarehouseCen) {
                setSelectedWarehouseCen(list[0].warehouseCen);
            }
        } catch (error: any) {
            toast.error("Error", "No se pudieron cargar los almacenes");
        }
    };

    useEffect(() => {
        if (companyCen) {
            fetchTickets();
            fetchCatalog();
            fetchWarehouses();
        }
    }, [companyCen]);

    const handleCreateTicket = async () => {
        if (!selectedWarehouseCen) {
            toast.error("Error", "Por favor selecciona un almacén para abrir el ticket.");
            return;
        }

        try {
            setLoading(true);
            
            const newTicket: Ticket = await createTicket(companyCen, companyId, selectedWarehouseCen);
            
            setTickets(prev => [newTicket, ...prev]);
            setSelectedTicket(newTicket);
            setTicketItems([]);
            toast.success("Éxito", "Ticket creado");
        } catch (error: any) {
            toast.error("Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectTicket = async (ticket: Ticket) => {
        setSelectedTicket(ticket);
        
        setSelectedWarehouseCen(ticket.warehouseCen); 
        
        try {
            const items: TicketItem[] = await getTicketItems(companyCen, companyId, ticket.ticketCen);
            setTicketItems(items);
        } catch (error: any) {
            toast.error("Error", "No se pudieron cargar los ítems");
        }
    };

    const handleAddItem = async (product: SellableProduct) => {
        if (!selectedTicket) return;
        try {
            setLoading(true);
            const newItem: TicketItem = await addItemToTicket(companyCen, companyId, selectedTicket.ticketCen, {
                productCen: product.productCen,
                quantity: 1
            });
            setTicketItems(prev => [...prev, newItem]);

            // Refresh ticket totals
            const updatedTickets: Ticket[] = await getDailyTickets(companyCen, companyId);
            const updated = updatedTickets.find(t => t.ticketCen === selectedTicket.ticketCen) ?? selectedTicket;
            setSelectedTicket(updated);

            toast.success("Agregado", `${product.name} al ticket`);
        } catch (error: any) {
            toast.error("Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePay = async () => {
        if (!selectedTicket) return;
        const confirmed = await toast.confirm("Procesar Pago", "¿Confirmar pago en efectivo?");
        if (confirmed) {
            try {
                setLoading(true);
                await payTicket(companyCen, companyId, selectedTicket.ticketCen, 1);
                toast.success("Éxito", "Ticket pagado y stock descontado");
                setSelectedTicket(null);
                setTicketItems([]);
                fetchTickets();
            } catch (error: any) {
                toast.error("Error en pago", error.message);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSendKds = async () => {
        if (!selectedTicket) return;
        try {
            setLoading(true);
            await sendToKds(companyCen, companyId, selectedTicket.ticketCen);
            toast.success("Cocina", "Comanda enviada correctamente");
        } catch (error: any) {
            toast.error("Error", error.message);
        } finally {
            setLoading(false);
        }
    };

const handleAssignWaiter = async () => {
        if (!selectedTicket || !waiterInput.trim()) return;
        try {
            setLoading(true);
            
            const responseData = await assignWaiter(companyCen, companyId, selectedTicket.ticketCen, waiterInput.trim());
            
            const updatedTicket: Ticket = {
                ...selectedTicket,
                waiterName: responseData.waiterName || responseData.name || waiterInput.trim() 
            };

            setSelectedTicket(updatedTicket);
            
            setTickets(prev => prev.map(t => t.ticketCen === updatedTicket.ticketCen ? updatedTicket : t));
            
            toast.success("Mesero", "Mesero asignado correctamente");
            setEditingWaiter(false);
            setWaiterInput("");
        } catch (error: any) {
            toast.error("Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 grid grid-cols-12 gap-6 h-[calc(100vh-100px)]">
            {/* Listado de Tickets (Izquierda) */}
            <div className="col-span-3 bg-[#111827] border border-[#1f2937] rounded-2xl flex flex-col overflow-hidden">
                <div className="p-4 border-b border-[#1f2937] bg-[#1f2937]/30 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                        <h2 className="text-white font-bold">Tickets del Día</h2>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={handleCreateTicket}
                            loading={loading}
                            disabled={!selectedWarehouseCen}
                        >
                            + Nuevo
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <BuildingStorefrontIcon className="w-4 h-4 text-indigo-400 shrink-0" />
                        <select
                                value={selectedWarehouseCen}
                                onChange={e => {
                                    setSelectedWarehouseCen(e.target.value);
                                    setSelectedTicket(null); 
                                }}
                                disabled={selectedTicket !== null} 
                                className="flex-1 bg-[#0f172a] border border-[#374151] text-white text-xs rounded-lg px-2 py-1.5 outline-none focus:border-indigo-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                            {warehouses.length === 0 && (
                                <option value="" disabled>Sin almacenes disponibles</option>
                            )}
                            {warehouses.map(w => (
                                <option key={w.warehouseCen} value={w.warehouseCen}>
                                    {w.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2">
                    {tickets.map(t => (
                        <div
                            key={t.ticketCen}
                            onClick={() => handleSelectTicket(t)}
                            className={`p-3 rounded-xl border cursor-pointer transition-all ${selectedTicket?.ticketCen === t.ticketCen ? 'bg-indigo-600/20 border-indigo-500/50 shadow-lg shadow-indigo-500/10' : 'bg-[#0f172a] border-[#1f2937] hover:border-[#374151]'}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-white font-mono text-sm">{t.ticketCen}</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${t.status === 'Open' ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                    {t.status}
                                </span>
                            </div>
                            <div className="flex justify-between items-end">
                                <span className="text-gray-500 text-xs">{new Date(t.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                <span className="text-emerald-400 font-bold text-sm">${t.total.toFixed(2)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Punto de Venta / Detalle Ticket (Centro) */}
            <div className="col-span-6 bg-[#111827] border border-[#1f2937] rounded-2xl flex flex-col overflow-hidden shadow-2xl">
                {!selectedTicket ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                        <ReceiptPercentIcon className="w-16 h-16 mb-4 opacity-20" />
                        <p>Selecciona un ticket para comenzar</p>
                    </div>
                ) : (
                    <>
                        <div className="p-4 border-b border-[#1f2937] bg-[#1f2937]/30 flex justify-between items-center">
                            <div>
                                <h3 className="text-white font-bold">Ticket: {selectedTicket.ticketCen}</h3>
                                {editingWaiter ? (
                                    <div className="flex items-center gap-1 mt-1">
                                        <UserIcon className="w-3 h-3 text-gray-400 shrink-0" />
                                        <input
                                            autoFocus
                                            value={waiterInput}
                                            onChange={e => setWaiterInput(e.target.value)}
                                            onKeyDown={e => { if (e.key === "Enter") handleAssignWaiter(); if (e.key === "Escape") { setEditingWaiter(false); setWaiterInput(""); } }}
                                            placeholder="Cód. mesero..."
                                            className="bg-[#0f172a] border border-indigo-500/50 rounded px-2 py-0.5 text-xs text-white w-32 outline-none focus:border-indigo-400"
                                        />
                                        <button onClick={handleAssignWaiter} disabled={loading} className="p-0.5 text-emerald-400 hover:text-emerald-300">
                                            <CheckIcon className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => { setEditingWaiter(false); setWaiterInput(""); }} className="p-0.5 text-gray-500 hover:text-gray-300">
                                            <XMarkIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                                        <UserIcon className="w-3 h-3" />
                                        <span>{selectedTicket.waiterName || "Sin mesero"}</span>
                                        {selectedTicket.status === "Open" && (
                                            <button
                                                onClick={() => { setEditingWaiter(true); setWaiterInput(selectedTicket.waiterName || ""); }}
                                                className="text-indigo-400 hover:text-indigo-300 transition-colors"
                                                title="Asignar mesero"
                                            >
                                                <PencilSquareIcon className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="text-right">
                                <span className="block text-emerald-400 font-bold text-xl">${selectedTicket.total.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4">
                            <table className="w-full text-sm">
                                <thead className="text-gray-500 border-b border-[#1f2937] uppercase text-[10px]">
                                    <tr>
                                        <th className="text-left pb-2">Producto</th>
                                        <th className="text-center pb-2">Cant</th>
                                        <th className="text-right pb-2">Precio</th>
                                        <th className="text-right pb-2">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-300 divide-y divide-[#1f2937]/50">
                                    {Object.values(
                                        ticketItems.reduce<Record<string, TicketItem>>((acc, item) => {
                                            if (acc[item.productCen]) {
                                                acc[item.productCen] = {
                                                    ...acc[item.productCen],
                                                    quantity: acc[item.productCen].quantity + item.quantity,
                                                    subTotal: acc[item.productCen].subTotal + item.subTotal,
                                                };
                                            } else {
                                                acc[item.productCen] = { ...item };
                                            }
                                            return acc;
                                        }, {})
                                    ).map(item => (
                                        <tr key={item.productCen}>
                                            <td className="py-3 font-medium text-white">{item.productName}</td>
                                            <td className="py-3 text-center">{item.quantity}</td>
                                            <td className="py-3 text-right text-gray-400">${item.unitPrice.toFixed(2)}</td>
                                            <td className="py-3 text-right font-medium">${item.subTotal.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="p-6 bg-[#0f172a] border-t border-[#1f2937]">
                            <div className="flex justify-between text-sm text-gray-400 mb-2">
                                <span>Subtotal</span>
                                <span>${selectedTicket.subTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-400 mb-4">
                                <span>Impuestos (13%)</span>
                                <span>${selectedTicket.taxAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold text-white mb-6">
                                <span>TOTAL</span>
                                <span className="text-emerald-400">${selectedTicket.total.toFixed(2)}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    fullWidth
                                    onClick={handleSendKds}
                                    disabled={loading || selectedTicket.status !== 'Open' || ticketItems.length === 0}
                                >
                                    Enviar a Cocina
                                </Button>
                                <Button
                                    variant="success"
                                    size="lg"
                                    fullWidth
                                    onClick={handlePay}
                                    disabled={loading || selectedTicket.status !== 'Open' || ticketItems.length === 0}
                                >
                                    <CreditCardIcon className="w-5 h-5 mr-2" />
                                    Cobrar Cuenta
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Catálogo de Productos (Derecha) */}
            <div className="col-span-3 bg-[#111827] border border-[#1f2937] rounded-2xl flex flex-col overflow-hidden">
                <div className="p-4 border-b border-[#1f2937] bg-[#1f2937]/30">
                    <h2 className="text-white font-bold flex items-center gap-2">
                        <CubeIcon className="w-4 h-4 text-indigo-400" />
                        Productos
                    </h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                    {catalog.map(p => (
                        <div
                            key={p.productCen}
                            onClick={() => handleAddItem(p)}
                            className={`p-3 rounded-xl border border-[#1f2937] bg-[#0f172a] hover:bg-[#1f2937] cursor-pointer transition-colors group ${!p.isAvailable ? 'opacity-50 grayscale pointer-events-none' : ''}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-white font-medium text-md group-hover:text-indigo-400">{p.name}</span>
                                <span className="text-emerald-400 font-bold text-md">${p.salePrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 text-md">{p.categoryName}</span>
                                <span className={`text-md font-bold ${p.availableStock > 0 ? 'text-gray-400' : 'text-rose-400'}`}>
                                    Stock: {p.availableStock}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};