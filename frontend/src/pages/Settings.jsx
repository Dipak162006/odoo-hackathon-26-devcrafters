import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { User, Shield, Moon, Sun, CheckCircle, HelpCircle } from 'lucide-react';

export default function Settings() {
  const { user, switchRole, addToast } = useApp();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('transitops_dark_mode') === 'true';
  });

  // Apply class on load / toggle
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('transitops_dark_mode', darkMode.toString());
  }, [darkMode]);

  const rolesDetails = [
    {
      role: 'Fleet Manager',
      desc: 'Full administrator access. Oversees fleet registration, maintenance, dispatches drivers, and audits all expenses.',
      perms: ['CRUD Vehicles', 'CRUD Drivers', 'Dispatch Trips', 'Approve Expenses', 'Full Analytics & Reports']
    },
    {
      role: 'Driver',
      desc: 'Standard mobile view. Can log fuel, submit personal trip expenses, and mark their dispatched deliveries as completed.',
      perms: ['View Own Trips', 'Log Fuel fillups', 'File Personal Expenses']
    },
    {
      role: 'Safety Officer',
      desc: 'Compliance and safety focus. Audits drivers safety ratings, checks license expiry warnings, and schedules maintenance.',
      perms: ['View Vehicles/Drivers', 'Schedule Maintenance', 'Driver License Alerts']
    },
    {
      role: 'Financial Analyst',
      desc: 'Operational accounting view. Audits fuel cost expenditures, ROI ratios, and approves/rejects pending expense invoices.',
      perms: ['View Fuel/Expenses', 'Approve/Reject Invoices', 'Capital ROI Reports']
    }
  ];

  const handleToggleTheme = () => {
    setDarkMode(!darkMode);
    addToast('info', `Switched to ${!darkMode ? 'Dark' : 'Light'} Mode.`);
  };

  return (
    <div className="animate-in" style={{ maxWidth: 760, margin: '0 auto' }}>
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h2>Platform Settings</h2>
          <p>Configure simulated roles, toggle dark mode, and manage compliance rules</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* User profile card */}
        <div className="card" style={{ padding: 20 }}>
          <div className="card-title" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <User size={18} style={{ color: 'var(--color-primary)' }} /> Profile Information
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="sidebar-user-avatar" style={{ width: 56, height: 56, fontSize: '1.25rem' }}>
              {user.avatar}
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>{user.name}</h3>
              <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{user.email}</p>
              <span className="status-badge active" style={{ marginTop: 6 }}>
                Active Session
              </span>
            </div>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="card" style={{ padding: 20 }}>
          <div className="card-title" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            {darkMode ? <Moon size={18} style={{ color: 'var(--color-primary)' }} /> : <Sun size={18} style={{ color: 'var(--color-warning)' }} />}
            Display Appearance
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 600 }}>Dark Mode Toggle</h4>
              <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                Switch between high-contrast dark theme and clean light theme
              </p>
            </div>
            <button className="btn btn-secondary" onClick={handleToggleTheme} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {darkMode ? <Sun size={14} /> : <Moon size={14} />}
              {darkMode ? 'Light Theme' : 'Dark Theme'}
            </button>
          </div>
        </div>

        {/* RBAC Role Selector */}
        <div className="card" style={{ padding: 20 }}>
          <div className="card-title" style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Shield size={18} style={{ color: 'var(--color-primary)' }} /> Simulated Role-Based Access Control (RBAC)
          </div>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 20 }}>
            Switch roles dynamically to observe how the sidebar routes, dashboards, and operational features restrict or enable access.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {rolesDetails.map(item => {
              const isCurrent = user.role === item.role;
              return (
                <div
                  key={item.role}
                  onClick={() => switchRole(item.role)}
                  className={`card ${isCurrent ? 'active' : ''}`}
                  style={{
                    padding: 16,
                    cursor: 'pointer',
                    borderColor: isCurrent ? 'var(--color-primary)' : 'var(--border-color)',
                    background: isCurrent ? 'var(--color-primary-light)' : 'transparent',
                    transition: 'all var(--transition-fast)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: isCurrent ? 'var(--color-primary-hover)' : 'var(--color-text-primary)'
                      }}>
                        {item.role}
                      </span>
                      {isCurrent && <CheckCircle size={16} style={{ color: 'var(--color-primary)' }} />}
                    </div>
                    <span style={{ fontSize: 11, color: isCurrent ? 'var(--color-primary-hover)' : 'var(--color-text-secondary)', fontWeight: 550 }}>
                      {isCurrent ? 'Current Mode' : 'Click to Switch'}
                    </span>
                  </div>

                  <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                    {item.desc}
                  </p>

                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                    {item.perms.map(p => (
                      <span
                        key={p}
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: 4,
                          background: isCurrent ? 'rgba(10, 108, 255, 0.12)' : 'var(--color-neutral-100)',
                          color: isCurrent ? 'var(--color-primary-hover)' : 'var(--color-text-secondary)'
                        }}
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
