import type { IUnitCreate, IUnitUpdate } from "../features/units/types/Units";

const API_URL = import.meta.env.VITE_API_URL;

export const getUnits = async (companyCen: string, companyId: number) => {
    const response = await fetch(`${API_URL}/inventory/companies/${companyCen}/units`, {
        headers: {
            "x-company-id": companyId.toString(),
            "Accept": "application/json",
        },
    });

    if (!response.ok) throw new Error("Error al cargar las unidades");
    if (response.status === 204) return [];

    return response.json();
}

export const createUnit = async (companyCen: string, companyId: number, unitData: IUnitCreate) => {
    const response = await fetch(`${API_URL}/inventory/companies/${companyCen}/units`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-company-id": companyId.toString(),
        },
        body: JSON.stringify(unitData),
    });

    if (!response.ok) throw new Error("Error al crear la unidad");
    return response.json();
}

export const updateUnit = async (companyCen: string, companyId: number, unitData: IUnitUpdate) => {
    const response = await fetch(`${API_URL}/inventory/companies/${companyCen}/units/${unitData.unitCen}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "x-company-id": companyId.toString(),
        },
        body: JSON.stringify({ name: unitData.name, abbreviation: unitData.abbreviation }),
    });

    if (!response.ok) throw new Error("Error al actualizar la unidad");
    return response.json();
}