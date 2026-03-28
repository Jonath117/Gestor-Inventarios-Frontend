import type { IUnitFormData } from "../features/units/types/Units";

const API_URL = import.meta.env.VITE_API_URL;

export const getUnits = async (companyId: number) => {
    const response = await fetch(`${API_URL}/Unit`, {
        headers: {
            "x-company-id": companyId.toString(),
            "Accept": "application/json",
        },
    });

    if (!response.ok) throw new Error("Error al cargar las unidades");
    if (response.status === 204) return [];

    return response.json();
}
export const createUnit = async (companyId: number, unitData: IUnitFormData) => {
    const response = await fetch(`${API_URL}/Unit`, {
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