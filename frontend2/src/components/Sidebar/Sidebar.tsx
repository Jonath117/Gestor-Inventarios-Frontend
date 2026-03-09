import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  UsersIcon,
  FolderIcon,
  CalendarIcon,
  DocumentDuplicateIcon,
  ChartPieIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  Squares2X2Icon, // Dashboard
  ArchiveBoxIcon

} from "@heroicons/react/24/outline";
import { useCompany } from "../../features/company/pages/CompanyContext.tsx";



const navigation = [
  { name: "Inicio", href: "/", icon: HomeIcon },
  { name: "Dashboard", href: "/dashboard", icon: Squares2X2Icon },
  { name: "Inventario", href: "/inventory", icon: ArchiveBoxIcon},
  { name: "Kardex", href: "/kardex", icon: ChartPieIcon },
  {name: "Movimientos", href: "/in-out", icon: DocumentDuplicateIcon },
];

const SideBar = () => {
  const { selectedCompany, isCollapsed, toggleCollapse } = useCompany();

  // No mostrar si no hay empresa en localStorage
  if (!selectedCompany) return null;

  return (
    <aside
      className={`
        flex flex-col h-screen bg-[#111827] text-white py-6 shrink-0
        transition-all duration-300 ease-in-out overflow-hidden
        ${isCollapsed ? "w-[68px] px-2" : "w-64 px-3"}
      `}
    >
      {/* Logo + botón colapsar */}
      <div className={`mb-8 flex items-center ${isCollapsed ? "justify-center" : "justify-between px-2"}`}>
        <svg
          className="w-8 h-8 text-indigo-400 shrink-0"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M6 24C6 14.059 14.059 6 24 6" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
          <path d="M42 24C42 33.941 33.941 42 24 42" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
          <path d="M24 6C33.941 6 42 14.059 42 24" stroke="#818cf8" strokeWidth="5" strokeLinecap="round" />
          <path d="M24 42C14.059 42 6 33.941 6 24" stroke="#818cf8" strokeWidth="5" strokeLinecap="round" />
        </svg>

        {!isCollapsed && (
          <button
            onClick={toggleCollapse}
            title="Colapsar menú"
            className="p-1.5 rounded-md text-gray-400 hover:bg-[#1a2232] hover:text-white transition-colors"
          >
            <ChevronDoubleLeftIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Botón expandir (solo en modo colapsado) */}
      {isCollapsed && (
        <div className="flex justify-center mb-5">
          <button
            onClick={toggleCollapse}
            title="Expandir menú"
            className="p-1.5 rounded-md text-gray-400 hover:bg-[#1a2232] hover:text-white transition-colors"
          >
            <ChevronDoubleRightIcon className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Empresa activa */}
      {!isCollapsed && (
        <div className="mx-2 mb-6 px-3 py-2 rounded-lg bg-[#1f2937] border border-[#374151]">
          <p className="text-xs text-gray-500 mb-0.5">Empresa activa</p>
          <p className="text-sm font-semibold text-white truncate">{selectedCompany.name}</p>
        </div>
      )}

      {/* Navegación */}
      <nav className="flex flex-col gap-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === "/"}
            title={isCollapsed ? item.name : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150
              ${isCollapsed ? "justify-center" : ""}
              ${isActive ? "bg-[#1f2937] text-white" : "text-gray-400 hover:bg-[#1a2232] hover:text-white"}`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? "text-white" : "text-gray-400"}`} />
                {!isCollapsed && (
                  <>
                    <span className="flex-1">{item.name}</span>
                    {"badge" in item && item.badge !== undefined && (
                      <span className="text-xs font-semibold bg-[#1a2232] border border-[#2d3748] text-gray-300 rounded-full px-2 py-0.5 min-w-[1.5rem] text-center">
                        
                      </span>
                    )}
                  </>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default SideBar;