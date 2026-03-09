import { useEffect, useState } from "react";
import { CompanyList } from "../component/CompanyList";
import { getCompanies } from "../../../services/ChooseCompnay";
import type { Company } from "../types/company";

export const SelectedCompanyPages = () => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState<boolean>(true); 

    useEffect(() => {
        getCompanies()
            .then((data) => {
                setCompanies(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error al obtener las empresas:", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0d1117] flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-400 text-lg">Cargando tus empresas...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0d1117] flex flex-col items-center px-6 py-20">
            
            <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                    Selecciona una Empresa
                </h1>
                <p className="text-gray-400 mt-4 text-lg">
                    Elige la organización con la que deseas operar hoy.
                </p>
            </div>

            <div className="w-full">
                {companies.length > 0 ? (
                    <CompanyList companies={companies} />
                ) : (
                    <div className="max-w-xl mx-auto text-center p-8 bg-[#111827] border border-[#1f2937] rounded-xl mt-8">
                        <p className="text-gray-400">No hay empresas disponibles en este momento.</p>
                    </div>
                )}
            </div>
            
        </div>
    );
};