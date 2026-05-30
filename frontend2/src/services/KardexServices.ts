import { createHeaders } from "./utils";
import { handleResponse } from "./utils";

const API_URL = import.meta.env.VITE_API_URL;

export const getKardex = async (companyCen: string, companyId: number, productCen: string, params: { warehouseCen?: string, from?: string, to?: string } = {}) => {
  const queryParams = new URLSearchParams();
  if (params.warehouseCen) queryParams.append("warehouseCen", params.warehouseCen);
  if (params.from) queryParams.append("from", params.from);
  if (params.to) queryParams.append("to", params.to);

  const url = `${API_URL}/inventory/companies/${companyCen}/products/${productCen}/kardex?${queryParams.toString()}`;

  const response = await fetch(url, {
    headers: createHeaders(companyId),
  });

  return handleResponse(response, "Error al obtener el kardex");
}