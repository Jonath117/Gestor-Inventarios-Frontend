import Sidebar from "../components/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useToast } from "../components/Toast";

const MainLayout = () => {
  const toast = useToast();
  const activeCompany = JSON.parse(localStorage.getItem("activeCompany") || "{}");
  const companyCen = activeCompany.companyCen;

  useEffect(() => {
    if (!companyCen) return;
    
    const API_URL = import.meta.env.VITE_API_URL;
    const eventSource = new EventSource(`${API_URL}/inventory/companies/${companyCen}/restock-events`);
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        toast.info(
          "Restock de Inventario", 
          `Se agregaron ${data.Cantidad} unidades al producto ${data.Producto}`
        );
      } catch (error) {
        console.error("Error parsing restock event:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE connection error", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [companyCen, toast]);

  return (
    <div className="flex h-screen bg-[#0d1117] overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;