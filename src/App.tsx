import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ClaimProvider } from './contexts/ClaimContext';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { DashboardPage } from './pages/DashboardPage';
import { ClaimDetailPage } from './pages/ClaimDetailPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SettingsPage } from './pages/SettingsPage';
import { ToastProvider } from './contexts/ToastContext';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <ClaimProvider>
          <Routes>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/claims" element={<Navigate to="/" replace />} />
              <Route path="/claims/:id" element={<ClaimDetailPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<div className="p-10 text-[#111111]">404 - Page Not Found</div>} />
            </Route>
          </Routes>
        </ClaimProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
