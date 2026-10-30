import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@project/components/ui/sonner';
import { ConfigProvider } from './lib/ConfigContext';
import CashierPage from './pages/CashierPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <ConfigProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CashierPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<CashierPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </ConfigProvider>
  );
}
