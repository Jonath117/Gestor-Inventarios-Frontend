import { useSalesPage } from "../hooks/useSalesPage";
import { Button } from "../../../components/ButtonComponent";
import { CubeIcon, ReceiptPercentIcon, UserIcon, CreditCardIcon, PencilSquareIcon, CheckIcon, XMarkIcon, BuildingStorefrontIcon } from "@heroicons/react/24/outline";
import type { SellableProduct, Ticket, TicketItem, Waiter, Warehouse } from "../types/sales.types";
import { useState } from "react";


const WarehouseSelector = ({ warehouses, value, onChange, disabled }: {
    warehouses: Warehouse[];
    value: string;
    onChange: (cen: string) => void;
    disabled: boolean;
}) => (
    <div className="flex items-center gap-2">
        <BuildingStorefrontIcon className="w-6 h-6 text-indigo-400 shrink-0" />
        <select
            value={value}
            onChange={e => onChange(e.target.value)}
            disabled={disabled}
            className="flex-1 bg-[#0f172a] border border-[#374151] text-white text-xs rounded-lg px-2 py-1.5 outline-none focus:border-indigo-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {warehouses.length === 0 && <option value="" disabled>Sin almacenes disponibles</option>}
            {warehouses.map(w => (
                <option key={w.warehouseCen} value={w.warehouseCen}>{w.name}</option>
            ))}
        </select>
    </div>
);


const TicketCard = ({ ticket, isSelected, onSelect }: {
    ticket: Ticket;
    isSelected: boolean;
    onSelect: () => void;
}) => (
    <div
        onClick={onSelect}
        className={`p-3 rounded-xl border cursor-pointer transition-all ${isSelected ? 'bg-indigo-600/20 border-indigo-500/50 shadow-lg shadow-indigo-500/10' : 'bg-[#0f172a] border-[#1f2937] hover:border-[#374151]'}`}
    >
        <div className="flex justify-between items-start mb-1">
            <span className="text-white font-mono text-sm">{ticket.ticketCen}</span>
            <span className={`text-[13px] px-3 py-0.5 rounded-full ${ticket.status === 'Open' ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                {ticket.status}
            </span>
        </div>
        <div className="flex justify-between items-end">
            <span className="text-gray-500 text-xs">{new Date(ticket.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <span className="text-emerald-400 font-bold text-sm">Bs {ticket.total.toFixed(2)}</span>
        </div>
    </div>
);

const WaiterRow = ({ ticket, editing, waiterInput, loading, waiters,
     onStartEdit, onCancelEdit, onConfirm, onInputChange }: {
    ticket: Ticket;
    editing: boolean;
    waiterInput: string;
    loading: boolean;
    waiters: Waiter[];
    onStartEdit: () => void;
    onCancelEdit: () => void;
    onConfirm: () => void;
    onInputChange: (v: string) => void;
}) => (
editing ? (
        <div className="flex items-center gap-1 mt-1">
            <UserIcon className="w-3 h-3 text-gray-400 shrink-0" />
            <select
                autoFocus
                value={waiterInput}
                onChange={e => onInputChange(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") onConfirm(); if (e.key === "Escape") onCancelEdit(); }}
                className="bg-[#0f172a] border border-indigo-500/50 rounded px-2 py-0.5 text-xs text-white w-32 outline-none focus:border-indigo-400 cursor-pointer"
            >
                <option value="" disabled>Seleccionar...</option>
                {waiters.map(w => (
                    <option key={w.waiterCen} value={w.name}>
                        {w.name}
                    </option>
                ))}
            </select>
            <button onClick={onConfirm} disabled={loading || !waiterInput} className="p-0.5 text-emerald-400 hover:text-emerald-300 disabled:opacity-50">
                <CheckIcon className="w-4 h-4" />
            </button>
            <button onClick={onCancelEdit} className="p-0.5 text-gray-500 hover:text-gray-300">
                <XMarkIcon className="w-4 h-4" />
            </button>
        </div>
    ) : (
        <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
            <UserIcon className="w-4 h-4" />
            <span>{ticket.waiterName || "Sin mesero"}</span>
            {ticket.status === "Open" && (
                <button onClick={onStartEdit} className="text-indigo-400 hover:text-indigo-300 transition-colors" title="Asignar mesero">
                    <PencilSquareIcon className="w-4 h-4" />
                </button>
            )}
        </div>
    )
);

const TicketItemRow = ({ 
    item, onUpdate, onRemove, loading, selectedTicket
}: { 
    item: TicketItem; 
    onUpdate: (cen: string, qty: number, note: string) => void;
    onRemove: (cen: string) => void;
    loading: boolean;
    selectedTicket: Ticket | null;
}) => {
    const [isEditingNote, setIsEditingNote] = useState(false);
    const [noteText, setNoteText] = useState(item.note || "");

    const isOpen = selectedTicket?.status === 'Open';

    const handleSaveNote = () => {
        onUpdate(item.ticketItemCen, item.quantity, noteText);
        setIsEditingNote(false);
    };

    return (
        <tr className="border-b border-[#1f2937]/50 group">
            <td className="py-3 font-medium text-white w-2/5">
                {item.productName}
                {item.note && !isEditingNote && (
                    <div className="text-xs text-orange-400 mt-0.5 font-mono">Nota: {item.note}</div>
                )}
                {isEditingNote &&  isOpen &&(
                    <div className="flex items-center gap-2 mt-1">
                        <input
                            type="text"
                            autoFocus
                            value={noteText}
                            onChange={e => setNoteText(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') handleSaveNote(); if (e.key === 'Escape') setIsEditingNote(false); }}
                            placeholder="Ej. Sin cebolla..."
                            className="bg-[#0f172a] border border-orange-500/50 rounded px-2 py-1 text-xs text-white w-full outline-none focus:border-orange-400"
                        />
                        <button onClick={handleSaveNote} className="text-emerald-400 hover:text-emerald-300">
                            <CheckIcon className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </td>
            
            <td className="py-3 text-center">
                <div className="flex items-center justify-center gap-2">
                    <button 
                        onClick={() => item.quantity > 1 ? onUpdate(item.ticketItemCen, item.quantity - 1, item.note || "") : onRemove(item.ticketItemCen)} 
                        className="w-6 h-6 flex items-center justify-center bg-[#1f2937] rounded text-gray-400 hover:text-white hover:bg-rose-500 transition-colors"
                        disabled={loading || selectedTicket?.status !== 'Open'}
                    >-</button>
                    
                    <span 
                        className="w-6 text-center cursor-pointer hover:text-indigo-400 font-bold"
                        title={isOpen ? "Click para cambiar cantidad" : "No se puede cambiar la cantidad en un ticket cerrado"} 
                        onClick={() => {
                            if (!isOpen) return;
                            const qty = window.prompt(`¿Cuántas unidades de ${item.productName} deseas?`, item.quantity.toString());
                            if (qty !== null && !isNaN(Number(qty)) && Number(qty) > 0) {
                                onUpdate(item.ticketItemCen, Number(qty), item.note || "");
                            }
                        }}
                    >
                        {item.quantity}
                    </span>
                    
                    {/* Botón Más */}
                    <button 
                        onClick={() => onUpdate(item.ticketItemCen, item.quantity + 1, item.note || "")} 
                        className="w-6 h-6 flex items-center justify-center bg-[#1f2937] rounded text-gray-400 hover:text-white hover:bg-emerald-500 transition-colors"
                        disabled={loading || !isOpen}
                    >+</button>
                </div>
            </td>
            <td className="py-3 text-right text-gray-400">Bs {item.unitPrice.toFixed(2)}</td>
            <td className="py-3 text-right font-medium">Bs {item.subTotal.toFixed(2)}</td>
            
            {/* Acciones flotantes (Aparecen al pasar el mouse por la fila) */}
            <td className="py-3 text-right">
                {isOpen && (
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setIsEditingNote(!isEditingNote)} className="text-gray-500 hover:text-orange-400" title="Agregar nota">
                            <PencilSquareIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => onRemove(item.ticketItemCen)} className="text-gray-500 hover:text-rose-500" title="Descartar ítem">
                            <XMarkIcon className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </td>
        </tr>
    );
};

const ProductCard = ({ product, onAdd }: { product: SellableProduct; onAdd: () => void }) => (
    <div
        onClick={onAdd}
        className={`p-3 rounded-xl border border-[#1f2937] bg-[#0f172a] hover:bg-[#1f2937] cursor-pointer transition-colors group ${!product.isAvailable ? 'opacity-50 grayscale pointer-events-none' : ''}`}
    >
        <div className="flex justify-between items-start mb-1">
            <span className="text-white font-medium text-md group-hover:text-indigo-400">{product.name}</span>
            <span className="text-emerald-400 font-bold text-md">Bs {product.salePrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
            <span className="text-gray-500 text-md">{product.categoryName}</span>
            <span className={`text-md font-bold ${product.availableStock > 0 ? 'text-gray-400' : 'text-rose-400'}`}>
                Stock: {product.availableStock}
            </span>
        </div>
    </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

export const SalesPage = () => {
    const {
        tickets, catalog, selectedTicket, ticketItems,
        warehouses, selectedWarehouseCen, loading, waiters,
        editingWaiter, waiterInput, setWaiterInput,
        handleCreateTicket, handleSelectTicket, handleCloseTicket,
        handleAddItem, handlePay, handleSendKds,
        handleAssignWaiter, handleStartEditWaiter, handleCancelEditWaiter,
        handleChangeWarehouse, handleUpdateItem,
        handleRemoveItem,
    } = useSalesPage();

    return (
        <div className="p-6 grid grid-cols-12 gap-6 min-h-screen">

            {/* ── Tickets (left) ── */}
            <div className="col-span-3 bg-[#111827] border border-[#1f2937] rounded-2xl flex flex-col overflow-hidden">
                <div className="p-4 border-b border-[#1f2937] bg-[#1f2937]/30 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                        <h2 className="text-white font-bold">Tickets del Día</h2>
                        <Button variant="primary" size="sm" onClick={handleCreateTicket} loading={loading} disabled={!selectedWarehouseCen}>
                            + Nuevo
                        </Button>
                    </div>
                    <WarehouseSelector
                        warehouses={warehouses}
                        value={selectedWarehouseCen}
                        onChange={handleChangeWarehouse}
                        disabled={selectedTicket !== null}
                    />
                </div>
                <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2">
                    {tickets.map(t => (
                        <TicketCard
                            key={t.ticketCen}
                            ticket={t}
                            isSelected={selectedTicket?.ticketCen === t.ticketCen}
                            onSelect={() => handleSelectTicket(t)}
                        />
                    ))}
                </div>
            </div>

            {/* ── Ticket detail (center) ── */}
            <div className="col-span-6 bg-[#111827] border border-[#1f2937] rounded-2xl flex flex-col overflow-hidden shadow-2xl">
                {!selectedTicket ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                        <ReceiptPercentIcon className="w-16 h-16 mb-4 opacity-20" />
                        <p>Selecciona un ticket para comenzar</p>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="p-4 border-b border-[#1f2937] bg-[#1f2937]/30 flex justify-between items-center">
                            <div>
                                <div className="flex items-center gap-4">
                                    <h3 className="text-white font-bold">Ticket: {selectedTicket.ticketCen}</h3>
                                    <button onClick={handleCloseTicket} className="text-gray-500 hover:text-rose-400 transition-colors" title="Cerrar ticket">
                                        <XMarkIcon className="w-5 h-5" />
                                    </button>
                                </div>
                                <WaiterRow
                                    ticket={selectedTicket}
                                    editing={editingWaiter}
                                    waiterInput={waiterInput}
                                    loading={loading}
                                    waiters={waiters}
                                    onStartEdit={handleStartEditWaiter}
                                    onCancelEdit={handleCancelEditWaiter}
                                    onConfirm={handleAssignWaiter}
                                    onInputChange={setWaiterInput}
                                />
                            </div>
                            <span className="text-emerald-400 font-bold text-xl">Bs {selectedTicket.total.toFixed(2)}</span>
                        </div>

                        {/* Items table */}
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
                                    {ticketItems.map(item => (
                                        <TicketItemRow 
                                            key={item.ticketItemCen} 
                                            item={item} 
                                            onUpdate={handleUpdateItem} 
                                            onRemove={handleRemoveItem} 
                                            loading={loading}
                                            selectedTicket={selectedTicket}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer / totals */}
                        <div className="p-6 bg-[#0f172a] border-t border-[#1f2937]">
                            <div className="flex justify-between text-sm text-gray-400 mb-2">
                                <span>Subtotal</span><span>Bs {selectedTicket.subTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-400 mb-4">
                                <span>Impuestos (13%)</span><span>Bs {selectedTicket.taxAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold text-white mb-6">
                                <span>TOTAL</span>
                                <span className="text-emerald-400">Bs {selectedTicket.total.toFixed(2)}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Button variant="primary" size="md" fullWidth onClick={handleSendKds}
                                    disabled={loading || selectedTicket.status !== 'Open' || ticketItems.length === 0}>
                                    Enviar a Cocina
                                </Button>
                                <Button variant="success" size="md" fullWidth onClick={handlePay}
                                    disabled={loading || selectedTicket.status !== 'Open' || ticketItems.length === 0}>
                                    <div className="flex items-center justify-between w-full">
                                        <CreditCardIcon className="w-5 h-5 mr-3" />
                                        <span>Cobrar Cuenta</span>
                                    </div>
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* ── Catalog (right) ── */}
            <div className="col-span-3 bg-[#111827] border border-[#1f2937] rounded-2xl flex flex-col overflow-hidden">
                <div className="p-4 border-b border-[#1f2937] bg-[#1f2937]/30">
                    <h2 className="text-white font-bold flex items-center gap-2">
                        <CubeIcon className="w-4 h-4 text-indigo-400" />
                        Productos
                    </h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                    {catalog.map(p => (
                        <ProductCard key={p.productCen} product={p} onAdd={() => handleAddItem(p)} />
                    ))}
                </div>
            </div>

        </div>
    );
};