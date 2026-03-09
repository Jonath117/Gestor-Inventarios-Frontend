import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from './layout/MainLayout.tsx';
import { DashboardPage } from './features/dashboard/pages/inventoryDashboardPage.tsx';
import { SelectedCompanyPages } from './features/company/pages/SelectedCompanyPages.tsx';
import { CompanyProvider } from './features/company/pages/CompanyContext.tsx';
import { InventoryPage } from './features/inventory/pages/inventoryPage.tsx';
import { ToastProvider } from './components/Toast.tsx';
import { KardexPage } from './features/inventory-movements/pages/KardexPage.tsx';
import { MovementPage } from './features/in-out/pages/MovementPage.tsx';

function App() {

  return (
    <BrowserRouter>
    <CompanyProvider>
      <ToastProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<SelectedCompanyPages />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/kardex" element={<KardexPage />} />
            <Route path="/in-out" element={<MovementPage />} />
          </Route>
        </Routes>
      </ToastProvider>
    </CompanyProvider>
    </BrowserRouter>
  )
}

export default App
