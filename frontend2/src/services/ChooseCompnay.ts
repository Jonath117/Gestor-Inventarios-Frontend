export const getCompanies = async () => {
    const response = await fetch("http://localhost:5153/api/company");

    if(!response.ok){
        throw new Error("Error al obtener las empresas");
    }
    return response.json();
}

