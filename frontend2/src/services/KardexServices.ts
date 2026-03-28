const API_URL = import.meta.env.VITE_API_URL;

export const getKardex = async (companyId: number, productId: number) => {
  const response = await fetch(`${API_URL}/Kardex/${productId}`, {
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