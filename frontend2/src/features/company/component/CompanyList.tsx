import { CompanyCard } from "./CompanyCard";
import type { Company } from "../types/company";

interface Props {
    companies: Company[];
}

export const CompanyList = ({ companies }: Props) => {
    return (
        <div className="max-w-xl mx-auto mt-8 flex flex-col gap-3">
            {companies.map((company) => (
                <CompanyCard key={company.id} company={company} />
            ))}
        </div>
    );
};