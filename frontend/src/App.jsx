import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import Drivers from './pages/Drivers';
import Trips from './pages/Trips';
import Maintenance from './pages/Maintenance';
import Finance from './pages/Finance';
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';
import AuditLogs from './pages/AuditLogs';
import Settings from './pages/Settings';

// Icons
import { X, Lock, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

// Simple Guard Component for RBAC
function RoleGuard({ allowedRoles, children }) {
  const { user } = useApp();
  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="card animate-in" style={{ padding: 48, textAlign: 'center', maxWidth: 600, margin: '64px auto' }}>
        <div style={{ display: 'inline-flex', padding: 14, background: 'var(--color-danger-light)', color: 'var(--color-danger)', borderRadius: '50%', marginBottom: 16 }}>
          <Lock size={32} />
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Access Restrained by RBAC</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: 8, fontSize: 14 }}>
          Your current simulated role is <strong>{user.role}</strong>, which does not have authorization to view this registry or analytics dashboard.
        </p>
        <p style={{ color: 'var(--color-text-tertiary)', fontSize: 12, marginTop: 4 }}>
          Please go to the Platform Settings or click your profile to switch roles.
        </p>
      </div>
    );
  }
  return children;
}

export default function App() {
  const { sidebarCollapsed, toasts, removeToast } = useApp();
  const location = useLocation();

  const isLoginPage = location.pathname === '/login';

  return (
    <div className="app-layout">
      {/* Conditionally show sidebar and top navbar */}
      {!isLoginPage && <Sidebar />}

      <main className={isLoginPage ? 'app-main-login' : `app-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {!isLoginPage && <Navbar />}
        
        <div className={isLoginPage ? '' : 'app-content'}>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Dashboard (All roles can see their customized view) */}
            <Route path="/" element={<Dashboard />} />

            {/* Vehicles (Manager, Safety, Analyst can view; Driver blocked) */}
            <Route path="/vehicles" element={
              <RoleGuard allowedRoles={['Fleet Manager', 'Safety Officer', 'Financial Analyst']}>
                <Vehicles />
              </RoleGuard>
            } />

            {/* Drivers (Manager, Safety, Analyst can view; Driver blocked) */}
            <Route path="/drivers" element={
              <RoleGuard allowedRoles={['Fleet Manager', 'Safety Officer', 'Financial Analyst']}>
                <Drivers />
              </RoleGuard>
            } />

            {/* Trips (All roles can view - Driver restricted inside component) */}
            <Route path="/trips" element={<Trips />} />

            {/* Maintenance (Manager, Safety, Analyst can view; Driver blocked) */}
            <Route path="/maintenance" element={
              <RoleGuard allowedRoles={['Fleet Manager', 'Safety Officer', 'Financial Analyst']}>
                <Maintenance />
              </RoleGuard>
            } />

            {/* Finance - Fuel & Expenses (All roles except Safety Officer) */}
            <Route path="/fuel" element={
              <RoleGuard allowedRoles={['Fleet Manager', 'Driver', 'Financial Analyst']}>
                <Finance />
              </RoleGuard>
            } />
            <Route path="/expenses" element={
              <RoleGuard allowedRoles={['Fleet Manager', 'Driver', 'Financial Analyst']}>
                <Finance />
              </RoleGuard>
            } />

            {/* Reports & Analytics (Manager & Analyst only) */}
            <Route path="/reports" element={
              <RoleGuard allowedRoles={['Fleet Manager', 'Financial Analyst']}>
                <Reports />
              </RoleGuard>
            } />
            <Route path="/analytics" element={
              <RoleGuard allowedRoles={['Fleet Manager', 'Financial Analyst']}>
                <Reports />
              </RoleGuard>
            } />

            {/* Notifications & Logs */}
            <Route path="/notifications" element={<Notifications />} />
            
            <Route path="/audit-logs" element={
              <RoleGuard allowedRoles={['Fleet Manager', 'Safety Officer', 'Financial Analyst']}>
                <AuditLogs />
              </RoleGuard>
            } />

            <Route path="/settings" element={<Settings />} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>

      {/* --- TOAST WIDGET SYSTEM --- */}
      <div className="toast-container">
        {toasts.map(toast => {
          const getToastIcon = () => {
            switch (toast.type) {
              case 'success': return <CheckCircle size={16} />;
              case 'error': return <AlertCircle size={16} />;
              case 'warning': return <AlertTriangle size={16} />;
              default: return <Info size={16} />;
            }
          };

          return (
            <div key={toast.id} className={`toast ${toast.type}`}>
              {getToastIcon()}
              <span>{toast.message}</span>
              <button className="toast-close" onClick={() => removeToast(toast.id)}>
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
