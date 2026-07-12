import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard, Truck, Users, MapPin, Wrench, Fuel,
  Receipt, BarChart3, FileText, Settings, Bell, Shield,
  ChevronLeft, ChevronRight, LogOut, Zap,
} from 'lucide-react';

const NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [
      { to: '/', icon: LayoutDashboard, label: 'Dashboard', roles: ['Fleet Manager', 'Driver', 'Safety Officer', 'Financial Analyst'] },
    ],
  },
  {
    label: 'Operations',
    items: [
      { to: '/vehicles', icon: Truck, label: 'Vehicles', roles: ['Fleet Manager', 'Safety Officer', 'Financial Analyst'] },
      { to: '/drivers', icon: Users, label: 'Drivers', roles: ['Fleet Manager', 'Safety Officer', 'Financial Analyst'] },
      { to: '/trips', icon: MapPin, label: 'Trips', roles: ['Fleet Manager', 'Driver', 'Safety Officer', 'Financial Analyst'] },
      { to: '/maintenance', icon: Wrench, label: 'Maintenance', roles: ['Fleet Manager', 'Safety Officer', 'Financial Analyst'] },
    ],
  },
  {
    label: 'Finance',
    items: [
      { to: '/fuel', icon: Fuel, label: 'Fuel Logs', roles: ['Fleet Manager', 'Driver', 'Financial Analyst'] },
      { to: '/expenses', icon: Receipt, label: 'Expenses', roles: ['Fleet Manager', 'Driver', 'Financial Analyst'] },
    ],
  },
  {
    label: 'Insights',
    items: [
      { to: '/reports', icon: FileText, label: 'Reports', roles: ['Fleet Manager', 'Financial Analyst'] },
      { to: '/analytics', icon: BarChart3, label: 'Analytics', roles: ['Fleet Manager', 'Financial Analyst'] },
    ],
  },
  {
    label: 'System',
    items: [
      { to: '/notifications', icon: Bell, label: 'Notifications', roles: ['Fleet Manager', 'Driver', 'Safety Officer', 'Financial Analyst'] },
      { to: '/audit-logs', icon: Shield, label: 'Audit Logs', roles: ['Fleet Manager', 'Safety Officer', 'Financial Analyst'] },
      { to: '/settings', icon: Settings, label: 'Settings', roles: ['Fleet Manager', 'Driver', 'Safety Officer', 'Financial Analyst'] },
    ],
  },
];

export default function Sidebar() {
  const { user, sidebarCollapsed, sidebarMobileOpen, toggleSidebar, toggleMobileSidebar, unreadCount } = useApp();
  const location = useLocation();

  const classes = [
    'sidebar',
    sidebarCollapsed ? 'collapsed' : '',
    sidebarMobileOpen ? 'mobile-open' : '',
  ].filter(Boolean).join(' ');

  // Filter sections and items based on role permissions
  const filteredSections = NAV_SECTIONS.map(section => {
    const allowedItems = section.items.filter(item => item.roles.includes(user.role));
    return { ...section, items: allowedItems };
  }).filter(section => section.items.length > 0);

  return (
    <>
      {sidebarMobileOpen && (
        <div
          className="sidebar-mobile-overlay"
          onClick={toggleMobileSidebar}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 99,
          }}
        />
      )}
      <aside className={classes}>
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <Zap size={20} />
          </div>
          <div className="sidebar-brand-text">
            <h1>TransitOps</h1>
            <span>Fleet Management</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {filteredSections.map(section => (
            <div key={section.label}>
              <div className="sidebar-section-label">{section.label}</div>
              {section.items.map(item => {
                const Icon = item.icon;
                const isActive = item.to === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.to);

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={`sidebar-link ${isActive ? 'active' : ''}`}
                    onClick={() => sidebarMobileOpen && toggleMobileSidebar()}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                    {item.label === 'Notifications' && unreadCount > 0 && (
                      <span className="badge-count">{unreadCount}</span>
                    )}
                  </NavLink>
                );
              })}

            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">{user.avatar}</div>
            <div className="sidebar-user-info">
              <span className="name">{user.name}</span>
              <span className="role">{user.role}</span>
            </div>
          </div>
          <button
            className="sidebar-link"
            onClick={toggleSidebar}
            style={{ marginTop: 4 }}
          >
            {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            <span>{sidebarCollapsed ? '' : 'Collapse'}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
