import Sidebar from "../components/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#0d1117]">
      <Sidebar />
      <main className="flex-1 p-6bg-gray-100 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;