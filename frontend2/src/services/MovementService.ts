// ### Ingreso de Producto (Compra)
// POST http://localhost:5290/api/Movement
// Content-Type: application/json
// x-company-id: 1

// {
//   "productId": 1,
//   "warehouseId": 1,
//   "movementType": "IN",
//   "quantity": 50,
//   "reference": "Factura FAC-9900",
//   "reason": "Compra mensual a distribuidor"
// }

// ### Salida de Producto (Venta)
// POST http://localhost:5290/api/Movement
// Content-Type: application/json
// x-company-id: 1

// {
//   "productId": 1,
//   "warehouseId": 1,
//   "movementType": "OUT",
//   "quantity": 2,
//   "reference": "Ticket T-0012",
//   "reason": "Venta al cliente final"
// }

export const registerMovement = async (
    companyId: number,
    productId: number,
    warehouseId: number,
    movementType: "IN" | "OUT",
    quantity: number,
    reference: string,
    reason: string
) => {
    const response = await fetch("http://localhost:5290/api/Movement", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-company-id": companyId.toString(),
        },
        body: JSON.stringify({
            productId,
            warehouseId,
            movementType,
            quantity,
            reference,
            reason,
        }),
    });

    if (!response.ok) {
        throw new Error("Error al registrar el movimiento");
    }
    return response.json();
}