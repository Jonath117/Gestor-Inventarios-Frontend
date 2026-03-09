/*
### US-08: Ver Kardex del Producto 1 (La Laptop)
GET http://localhost:5290/api/Kardex/1
x-company-id: 1
Accept: application/json

devuelve una lista delos movimientos
[
  {
    "id": 6,
    "date": "2026-02-28T07:48:27.926441",
    "movementType": "Ajuste",
    "quantity": 1.00,
    "previousStock": 7.00,
    "newStock": 8.00,
    "reason": "prueba notif",
    "reference": null,
    "wareHouseName": "Sucursal Norte"
  },
  {
    "id": 5,
    "date": "2026-02-28T07:36:55.167053",
    "movementType": "Ajuste",
    "quantity": 1.00,
    "previousStock": 6.00,
    "newStock": 7.00,
    "reason": "prueba 2",
    "reference": null,
    "wareHouseName": "Sucursal Norte"
  },
 */

export const getKardex = async (companyId: number, productId: number) => {
    const response = await fetch(`http://localhost:5290/api/Kardex/${productId}`, {
        headers: {
            "x-company-id": companyId.toString(),
            "Accept": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Error al obtener el kardex del producto");
    }
    return response.json();
}