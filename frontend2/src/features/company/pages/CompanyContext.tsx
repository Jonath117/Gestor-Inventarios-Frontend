import { createContext, useContext, useState, type ReactNode } from "react";

interface Company {
  id: number;
  name: string;
}

interface CompanyContextType {
  selectedCompany: Company | null;
  setSelectedCompany: (company: Company) => void; 
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider = ({ children }: { children: ReactNode }) => {
  const stored = localStorage.getItem("activeCompany");
  const [selectedCompany, setSelectedCompanyState] = useState<Company | null>(
    stored ? JSON.parse(stored) : null
  );
  const [isCollapsed, setIsCollapsed] = useState(false);

  const setSelectedCompany = (company: Company) => {
    localStorage.setItem("activeCompany", JSON.stringify(company)); 
    setSelectedCompanyState(company);                                
  };

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  return (
    <CompanyContext.Provider value={{ selectedCompany, setSelectedCompany, isCollapsed, toggleCollapse }}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const ctx = useContext(CompanyContext);
  if (!ctx) throw new Error("useCompany debe usarse dentro de CompanyProvider");
  return ctx;
};