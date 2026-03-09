// ### Todo el inventario de la Empresa (US-05)
// GET http://localhost:5290/api/GetStock
// x-company-id: 1
// Accept: application/json

// ### Filtrado solo por la Bodega Central (US-06)
// GET http://localhost:5290/api/GetStock?warehouseId=1
// x-company-id: 1
// Accept: application/json

export const getStock = async (companyId: number, warehouseId?: number) => {
    const url = warehouseId
    //por que dos urls? 
        ? `http://localhost:5290/api/GetStock?warehouseId=${warehouseId}`
        : "http://localhost:5290/api/GetStock";
    
    const response = await fetch(url, {
        headers: {
            "x-company-id": companyId.toString(),
            "Accept": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Error al obtener el stock");
    }
    return response.json();
}



