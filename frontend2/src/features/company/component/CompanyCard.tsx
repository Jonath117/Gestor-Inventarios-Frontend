import { useNavigate } from "react-router-dom";
import { useCompany } from "../pages/CompanyContext";
import type { Company } from "../types/company";
import { BuildingOfficeIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface Props {
    company: Company;
}

export const CompanyCard = ({ company }: Props) => {
    const navigate = useNavigate();
    const { setSelectedCompany } = useCompany();

    const handleSelect = () => {
        setSelectedCompany(company);
        navigate("/dashboard");
    };

    return (
        <div 
            onClick={handleSelect}
            
            className="group flex items-center justify-between p-4 bg-[#111827] border border-[#1f2937] rounded-xl cursor-pointer hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300"
        >
            <div className="flex items-center gap-4">
                
                <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-colors">
                    <BuildingOfficeIcon className="w-6 h-6 text-indigo-400" />
                </div>
                
                <div>
                    <h2 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors">
                        {company.name}
                    </h2>
                    <p className="text-sm text-gray-400">
                        • Toca para ingresar
                    </p>
                </div>
            </div>

            <ChevronRightIcon className="w-6 h-6 text-gray-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
        </div>
    );
};