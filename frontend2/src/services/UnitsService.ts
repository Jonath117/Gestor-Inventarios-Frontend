import type { IUnitCreate, IUnitUpdate } from "../features/units/types/Units";
import { createHeaders } from "./utils";
import { handleResponse } from "./utils";

const API_URL = import.meta.env.VITE_API_URL;

export const getUnits = async (companyCen: string, companyId: number) => {
    const response = await fetch(`${API_URL}/inventory/companies/${companyCen}/units`, {
        headers: createHeaders(companyId),
    });

    return handleResponse(response, "Error al cargar las unidades");
}

export const createUnit = async (companyCen: string, companyId: number, unitData: IUnitCreate) => {
    const response = await fetch(`${API_URL}/inventory/companies/${companyCen}/units`, {
        method: "POST",
        headers: createHeaders(companyId, true),
        body: JSON.stringify(unitData),
    });

    return handleResponse(response, "Error al crear la unidad");
}

export const updateUnit = async (companyCen: string, companyId: number, unitData: IUnitUpdate) => {
    const response = await fetch(`${API_URL}/inventory/companies/${companyCen}/units/${unitData.unitCen}`, {
        method: "PUT",
        headers: createHeaders(companyId, true),
        body: JSON.stringify({ name: unitData.name, abbreviation: unitData.abbreviation }),
    });

    return handleResponse(response, "Error al actualizar la unidad");
}