import { CompanyCard } from "./CompanyCard";
import type { Company } from "../types/company";

interface Props {
    companies: any[];
}

export const CompanyList = ({ companies }: Props) => {
    return (
        <div className="max-w-xl mx-auto mt-8 flex flex-col gap-3">
            {companies.map((company) => (
                <CompanyCard key={company.companyCen} company={company} />
            ))}
        </div>
    );
};