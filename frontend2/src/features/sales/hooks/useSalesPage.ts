import { useEffect, useState } from "react";
import {
    getDailyTickets, createTicket, getSellableCatalog, getTicketItems,
    addItemToTicket, payTicket, sendToKds, assignWaiter, getWarehouses, updateTicketItem, removeTicketItem,
    getWaiters
} from "../../../services/SalesService";
import type { Ticket, SellableProduct, TicketItem, Warehouse, Waiter} from "../types/sales.types";
import { useToast } from "../../../components/Toast";

export const useSalesPage = () => {
    const activeCompany = JSON.parse(localStorage.getItem("activeCompany") || "{}");
    const companyId: number = activeCompany.id;
    const companyCen: string = activeCompany.companyCen;

    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [catalog, setCatalog] = useState<SellableProduct[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [ticketItems, setTicketItems] = useState<TicketItem[]>([]);
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [selectedWarehouseCen, setSelectedWarehouseCen] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [editingWaiter, setEditingWaiter] = useState(false);
    const [waiterInput, setWaiterInput] = useState("");

    const [waiters, setWaiters] = useState<Waiter[]>([]);

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
            const data = await getSellableCatalog(companyCen, companyId, selectedWarehouseCen);
            const list: SellableProduct[] = Array.isArray(data) ? data : (data?.data ?? data?.products ?? []);
            setCatalog(list);
        } catch (error: any) {
            toast.error("Error", error.message);
        }
    };

    const fetchWarehouses = async () => {
        try {
            const data = await getWarehouses(companyCen, companyId);
            const list: Warehouse[] = Array.isArray(data) ? data : (data?.data ?? data?.warehouses ?? []);
            setWarehouses(list);
            if (list.length > 0 && !selectedWarehouseCen) {
                setSelectedWarehouseCen(list[0].warehouseCen);
            }
        } catch {
            toast.error("Error", "No se pudieron cargar los almacenes");
        }
    };


    useEffect(() => {
        if (companyCen) {
            fetchTickets();
            fetchWarehouses();
            fetchWaiters();
        }
    }, [companyCen]);

    useEffect(() => {
        if (companyCen && selectedWarehouseCen) fetchCatalog();
    }, [companyCen, selectedWarehouseCen]);


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
        } catch {
            toast.error("Error", "No se pudieron cargar los ítems");
        }
    };

    const handleCloseTicket = () => {
        setSelectedTicket(null);
        setTicketItems([]);
    };

    const handleAddItem = async (product: SellableProduct) => {
        if (!selectedTicket) return;
        try {
            setLoading(true);
            
            await addItemToTicket(companyCen, companyId, selectedTicket.ticketCen, {
                productCen: product.productCen,
                quantity: 1,
            });

            const freshItems: TicketItem[] = await getTicketItems(companyCen, companyId, selectedTicket.ticketCen);
            
            setTicketItems(freshItems);

            const updatedTickets: Ticket[] = await getDailyTickets(companyCen, companyId);
            const updated = updatedTickets.find((t: { ticketCen: string; }) => t.ticketCen === selectedTicket.ticketCen) ?? selectedTicket;
            setSelectedTicket(updated);

            setTickets(updatedTickets);

            toast.success("Agregado", `${product.name} al ticket`);
        } catch (error: any) {
            toast.error("Error", error.message);
        } finally {
            setLoading(false);
        }
    };

        const handleUpdateItem = async (itemCen: string, quantity: number, note: string) => {
        if (!selectedTicket) return;
        try {
            setLoading(true);
            await updateTicketItem(companyCen, companyId, selectedTicket.ticketCen, itemCen, { quantity, note });

            const items = await getTicketItems(companyCen, companyId, selectedTicket.ticketCen);
            setTicketItems(items);
            const updatedTickets = await getDailyTickets(companyCen, companyId);
            const updated = updatedTickets.find((t: { ticketCen: string; }) => t.ticketCen === selectedTicket.ticketCen) ?? selectedTicket;
            setSelectedTicket(updated);

            setTickets(updatedTickets);

        } catch (error: any) {
            toast.error("Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveItem = async (itemCen: string) => {
        if (!selectedTicket) return;
        try {
            setLoading(true);
            await removeTicketItem(companyCen, companyId, selectedTicket.ticketCen, itemCen);

            const items = await getTicketItems(companyCen, companyId, selectedTicket.ticketCen);
            setTicketItems(items);
            const updatedTickets = await getDailyTickets(companyCen, companyId);
            const updated = updatedTickets.find((t: { ticketCen: string; }) => t.ticketCen === selectedTicket.ticketCen) ?? selectedTicket;
            setSelectedTicket(updated);

            setTickets(updatedTickets);

            toast.success("Ítem eliminado", "");
        } catch (error: any) {
            toast.error("Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePay = async () => {
        if (!selectedTicket) return;
        const confirmed = await toast.confirm("Procesar Pago", "¿Confirmar pago en efectivo?");
        if (!confirmed) return;
        
        try {
            setLoading(true);
            await payTicket(companyCen, companyId, selectedTicket.ticketCen, 1);
            
            toast.success("Éxito", "Ticket pagado y stock descontado");
            setSelectedTicket(null);
            setTicketItems([]);
            fetchTickets();
            
        } catch (error: any) {
            toast.error("Atencion", error.message); 
        } finally {
            setLoading(false);
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
                waiterName: responseData.waiterName || responseData.name || waiterInput.trim(),
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

    const fetchWaiters = async () => {
        try {
            const data = await getWaiters(companyCen, companyId);
            const list: Waiter[] = Array.isArray(data) ? data : (data?.data ?? data?.waiters ?? []);
            setWaiters(list);
        } catch {
            toast.error("Error", "No se pudieron cargar los meseros");
        }
    };

    const handleStartEditWaiter = () => {
        setEditingWaiter(true);
        setWaiterInput(selectedTicket?.waiterName || "");
    };

    const handleCancelEditWaiter = () => {
        setEditingWaiter(false);
        setWaiterInput("");
    };


    const handleChangeWarehouse = (warehouseCen: string) => {
        setSelectedWarehouseCen(warehouseCen);
        setSelectedTicket(null);
    };


    return {
        // State
        tickets,
        catalog,
        selectedTicket,
        ticketItems,
        warehouses,
        selectedWarehouseCen,
        loading,
        editingWaiter,
        waiterInput,
        setWaiterInput,
        waiters,
        // Handlers
        handleCreateTicket,
        handleSelectTicket,
        handleCloseTicket,
        handleAddItem,
        handlePay,
        handleSendKds,
        handleAssignWaiter,
        handleStartEditWaiter,
        handleCancelEditWaiter,
        handleChangeWarehouse,
        handleUpdateItem, 
        handleRemoveItem,
    };
};