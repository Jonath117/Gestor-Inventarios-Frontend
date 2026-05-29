const inventoryUrl = import.meta.env.VITE_API_URL;
const API_URL = import.meta.env.VITE_API_URL_SALES;

const createHeaders = (companyId: number, hasBody: boolean = false): HeadersInit => {
    const headers: Record<string, string> = {
        "x-company-id": companyId.toString(),
        "Accept": "application/json",
    };
    if (hasBody) {
        headers["Content-Type"] = "application/json";
    }
    return headers;
};

const handleResponse = async (response: Response, fallbackErrorMsg: string) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.detail || errorData?.title || errorData?.error || fallbackErrorMsg;
        throw new Error(errorMessage);
    }

    if (response.status === 204) return true;

    const text = await response.text();
    return text ? JSON.parse(text) : true;
};


// Ventas (Tickets)

export const getDailyTickets = async (companyCen: string, companyId: number) => {
    const response = await fetch(`${API_URL}/sales/companies/${companyCen}/tickets`, { 
        headers: createHeaders(companyId) 
    });
    return handleResponse(response, "Error al obtener tickets");
};

export const createTicket = async (companyCen: string, companyId: number, warehouseCen: string, waiterCen?: string) => {
    const response = await fetch(`${API_URL}/sales/companies/${companyCen}/tickets`, {
        method: "POST",
        headers: createHeaders(companyId, true),
        body: JSON.stringify({ waiterCen, warehouseCen })
    });
    return handleResponse(response, "Error al crear ticket");
};

export const payTicket = async (companyCen: string, companyId: number, ticketCen: string, paymentMethodId: number) => {
    const response = await fetch(`${API_URL}/sales/companies/${companyCen}/tickets/${ticketCen}/payment`, {
        method: "POST",
        headers: createHeaders(companyId, true),
        body: JSON.stringify({ paymentMethodId })
    });
    return handleResponse(response, "Error al procesar el pago");
};

export const assignWaiter = async (companyCen: string, companyId: number, ticketCen: string, waiterCen: string) => {
    const response = await fetch(`${API_URL}/sales/companies/${companyCen}/tickets/${ticketCen}/waiter`, {
        method: "PUT",
        headers: createHeaders(companyId, true),
        body: JSON.stringify({ waiterCen })
    });
    return handleResponse(response, "Error al asignar mesero");
};


// Items (Ticket Items)

export const getTicketItems = async (companyCen: string, companyId: number, ticketCen: string) => {
    const response = await fetch(`${API_URL}/sales/companies/${companyCen}/tickets/${ticketCen}/items`, { 
        headers: createHeaders(companyId) 
    });
    return handleResponse(response, "Error al obtener items");
};

export const addItemToTicket = async (companyCen: string, companyId: number, ticketCen: string, item: { productCen: string, quantity: number, note?: string }) => {
    const response = await fetch(`${API_URL}/sales/companies/${companyCen}/tickets/${ticketCen}/items`, {
        method: "POST",
        headers: createHeaders(companyId, true),
        body: JSON.stringify(item)
    });
    return handleResponse(response, "Error al agregar item");
};

export const updateTicketItem = async (companyCen: string, companyId: number, ticketCen: string, ticketItemCen: string, data: { quantity: number, note?: string }) => {
    const response = await fetch(`${API_URL}/sales/companies/${companyCen}/tickets/${ticketCen}/items/${ticketItemCen}`, {
        method: "PATCH",
        headers: createHeaders(companyId, true),
        body: JSON.stringify(data)
    });
    return handleResponse(response, "Error al actualizar ítem");
};

export const removeTicketItem = async (companyCen: string, companyId: number, ticketCen: string, ticketItemCen: string) => {
    const response = await fetch(`${API_URL}/sales/companies/${companyCen}/tickets/${ticketCen}/items/${ticketItemCen}`, {
        method: "DELETE",
        headers: createHeaders(companyId)
    });
    return handleResponse(response, "Error al eliminar ítem");
};


// Catalogo, Almacen y Meseros

export const getSellableCatalog = async (companyCen: string, companyId: number, warehouseCen?: string) => {
    const url = warehouseCen 
        ? `${API_URL}/sales/companies/${companyCen}/catalog/products?warehouseCen=${warehouseCen}`
        : `${API_URL}/sales/companies/${companyCen}/catalog/products`;

    const response = await fetch(url, { headers: createHeaders(companyId) });
    return handleResponse(response, "Error al obtener catálogo");
};

export const getWarehouses = async (companyCen: string, companyId: number) => {
    const response = await fetch(`${inventoryUrl}/inventory/companies/${companyCen}/warehouses`, { 
        headers: createHeaders(companyId) 
    });
    return handleResponse(response, "Error al obtener almacenes");
};

export const getWaiters = async (companyCen: string, companyId: number) => {
    const response = await fetch(`${API_URL}/sales/companies/${companyCen}/waiters`, { 
        headers: createHeaders(companyId) 
    });
    return handleResponse(response, "Error al obtener meseros");
};


// ─── Endpoints de KDS y Dashboards ───────────────────────────────────────────

export const sendToKds = async (companyCen: string, companyId: number, ticketCen: string) => {
    const response = await fetch(`${API_URL}/sales/companies/${companyCen}/tickets/${ticketCen}/send`, {
        method: "POST",
        headers: createHeaders(companyId) 
    });
    return handleResponse(response, "Error al enviar a cocina");
};

export const getKdsItems = async (companyCen: string, companyId: number, teamCen: string = "T-DEFAULT") => {
    const response = await fetch(`${API_URL}/sales/companies/${companyCen}/kds/teams/${teamCen}/items`, { 
        headers: createHeaders(companyId) 
    });
    return handleResponse(response, "Error al obtener items KDS");
};

export const updateKdsStatus = async (companyCen: string, companyId: number, ticketItemCen: string, status: string) => {
    const response = await fetch(`${API_URL}/sales/companies/${companyCen}/kds/items/${ticketItemCen}/status`, {
        method: "PATCH",
        headers: createHeaders(companyId, true),
        body: JSON.stringify({ status })
    });
    return handleResponse(response, "Error al actualizar estado KDS");
};

export const getDailySales = async (companyCen: string, companyId: number) => {
    const response = await fetch(`${API_URL}/sales/companies/${companyCen}/dashboard/daily-sales`, { 
        headers: createHeaders(companyId) 
    });
    return handleResponse(response, "Error al obtener ventas diarias");
};