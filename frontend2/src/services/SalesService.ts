const inventoryUrl = import.meta.env.VITE_API_URL;
const API_URL = import.meta.env.VITE_API_URL_SALES;

export const getDailyTickets = async (companyCen: string, companyId: number) => {
    const response = await fetch(`${API_URL}/sales/companies/${companyCen}/tickets`, {
        headers: { "x-company-id": companyId.toString(), "Accept": "application/json" }
    });
    if (!response.ok) {
        const text = await response.text();
        try {
            const err = JSON.parse(text);
            throw new Error(err.error || "Error al obtener tickets");
        } catch (e) {
            throw new Error(text.substring(0, 100) + "...");
        }
    }
    return response.json(); 
};

export const createTicket = async (companyCen: string, companyId: number, warehouseCen: string, waiterCen?: string) => {
    const response = await fetch(`${API_URL}/sales/companies/${companyCen}/tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-company-id": companyId.toString() },
        body: JSON.stringify({ waiterCen, warehouseCen })
    });
    if (!response.ok) {
        const text = await response.text();
        try {
            const err = JSON.parse(text);
            throw new Error(err.error || "Error al crear ticket");
        } catch (e) {
            throw new Error(text.substring(0, 100) + "...");
        }
    }
    return response.json(); 
};

export const getTicketItems = async (companyCen: string, companyId: number, ticketCen: string) => {
    const response = await fetch(`${API_URL}/sales/companies/${companyCen}/tickets/${ticketCen}/items`, {
        headers: { "x-company-id": companyId.toString(), "Accept": "application/json" }
    });
    if (!response.ok) {
        const text = await response.text();
        try {
            const err = JSON.parse(text);
            throw new Error(err.error || "Error al obtener items");
        } catch (e) {
            throw new Error(text.substring(0, 100) + "...");
        }
    }
    return response.json(); 
};

export const addItemToTicket = async (companyCen: string, companyId: number, ticketCen: string, item: { productCen: string, quantity: number, note?: string }) => {
    const response = await fetch(`${API_URL}/sales/companies/${companyCen}/tickets/${ticketCen}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-company-id": companyId.toString() },
        body: JSON.stringify(item)
    });
    if (!response.ok) {
        const text = await response.text();
        try {
            const err = JSON.parse(text);
            throw new Error(err.error || "Error al agregar item");
        } catch (e) {
            throw new Error(text.substring(0, 100) + "...");
        }
    }
    return response.json();
};

export const payTicket = async (companyCen: string, companyId: number, ticketCen: string, paymentMethodId: number) => {
    const response = await fetch(`${API_URL}/sales/companies/${companyCen}/tickets/${ticketCen}/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-company-id": companyId.toString() },
        body: JSON.stringify({ paymentMethodId })
    });
    if (!response.ok) {
        const text = await response.text();
        try {
            const err = JSON.parse(text);
            throw new Error(err.error || "Error al procesar pago");
        } catch (e) {
            throw new Error(text.substring(0, 100) + "...");
        }
    }
    return response.json();
};

export const sendToKds = async (companyCen: string, companyId: number, ticketCen: string) => {
    const response = await fetch(`${API_URL}/sales/companies/${companyCen}/tickets/${ticketCen}/send`, {
        method: "POST",
        headers: { "x-company-id": companyId.toString() }
    });
    if (!response.ok) throw new Error("Error al enviar a cocina");
    return response.json();
};

export const getSellableCatalog = async (companyCen: string, companyId: number, warehouseCen?: string) => {
    const url = warehouseCen 
        ? `${API_URL}/sales/companies/${companyCen}/catalog/products?warehouseCen=${warehouseCen}`
        : `${API_URL}/sales/companies/${companyCen}/catalog/products`;

    const response = await fetch(url, {
        headers: { "x-company-id": companyId.toString(), "Accept": "application/json" }
    });
    if (!response.ok) throw new Error("Error al obtener catálogo");
    return response.json();
};

export const getKdsItems = async (companyCen: string, companyId: number, teamCen: string = "T-DEFAULT") => {
    const response = await fetch(`${API_URL}/sales/companies/${companyCen}/kds/teams/${teamCen}/items`, {
        headers: { "x-company-id": companyId.toString(), "Accept": "application/json" }
    });
    if (!response.ok) throw new Error("Error al obtener items KDS");
    return response.json();
};

export const updateKdsStatus = async (companyCen: string, companyId: number, ticketItemCen: string, status: string) => {
    const response = await fetch(`${API_URL}/sales/companies/${companyCen}/kds/items/${ticketItemCen}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-company-id": companyId.toString() },
        body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error("Error al actualizar estado KDS");
    return true;
};

export const getDailySales = async (companyCen: string, companyId: number) => {
    const response = await fetch(`${API_URL}/sales/companies/${companyCen}/dashboard/daily-sales`, {
        headers: { "x-company-id": companyId.toString(), "Accept": "application/json" }
    });
    if (!response.ok) throw new Error("Error al obtener ventas diarias");
    return response.json();
};

export const assignWaiter = async (companyCen: string, companyId: number, ticketCen: string, waiterCen: string) => {
    const response = await fetch(`${API_URL}/sales/companies/${companyCen}/tickets/${ticketCen}/waiter`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-company-id": companyId.toString() },
        body: JSON.stringify({ waiterCen })
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || "Error al asignar mesero");
    }
    return response.json();
};

export const getWarehouses = async (companyCen: string, companyId: number) => {
    const response = await fetch(`${inventoryUrl}/inventory/companies/${companyCen}/warehouses`, {
        headers: { "x-company-id": companyId.toString(), "Accept": "application/json" }
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || "Error al obtener almacenes");
    }
    return response.json();
};

export const updateTicketItem = async (companyCen: string, companyId: number, ticketCen: string, ticketItemCen: string, data: { quantity: number, note?: string }) => {
    const response = await fetch(`${API_URL}/sales/companies/${companyCen}/tickets/${ticketCen}/items/${ticketItemCen}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-company-id": companyId.toString() },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error("Error al actualizar ítem");
    return response.json();
};

export const removeTicketItem = async (companyCen: string, companyId: number, ticketCen: string, ticketItemCen: string) => {
    const response = await fetch(`${API_URL}/sales/companies/${companyCen}/tickets/${ticketCen}/items/${ticketItemCen}`, {
        method: "DELETE",
        headers: { "x-company-id": companyId.toString() }
    });
    if (!response.ok) throw new Error("Error al eliminar ítem");
    return true; 
};

//    [HttpGet]
//     public async Task<IActionResult> GetWaiters()
//     {
//         var waiters = await _mediator.Send(new GetWaitersQuery(_companyProvider.CompanyId));
//         return Ok(waiters);
//     }

// public record GetWaitersQuery(int CompanyId) : IRequest<IEnumerable<WaiterContractResponse>>;

// public class GetWaitersQueryHandler : IRequestHandler<GetWaitersQuery, IEnumerable<WaiterContractResponse>>
// {
//     public async Task<IEnumerable<WaiterContractResponse>> Handle(GetWaitersQuery request, CancellationToken cancellationToken)
//     {
//         return new List<WaiterContractResponse>
//         {
//             new WaiterContractResponse("W-001", "Juan Perez", true),
//             new WaiterContractResponse("W-002", "Maria Garcia", true),
//             new WaiterContractResponse("W-003", "Matias Molina", true)
//         };
//     }
// }

export const getWaiters = async (companyCen: string, companyId: number) => {
    const response = await fetch(`${API_URL}/sales/companies/${companyCen}/waiters`, {
        headers: { "x-company-id": companyId.toString(), "Accept": "application/json" }
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || "Error al obtener meseros");
    }
    return response.json();
};
