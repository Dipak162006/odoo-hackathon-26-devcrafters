import { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Search, Bell, Moon, Sun, Menu } from 'lucide-react';

const ROUTE_TITLES = {
  '/': ['Dashboard'],
  '/vehicles': ['Operations', 'Vehicles'],
  '/drivers': ['Operations', 'Drivers'],
  '/trips': ['Operations', 'Trips'],
  '/maintenance': ['Operations', 'Maintenance'],
  '/fuel': ['Finance', 'Fuel Logs'],
  '/expenses': ['Finance', 'Expenses'],
  '/reports': ['Insights', 'Reports'],
  '/analytics': ['Insights', 'Analytics'],
  '/settings': ['System', 'Settings'],
  '/notifications': ['System', 'Notifications'],
  '/audit-logs': ['System', 'Audit Logs'],
};

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { unreadCount, toggleMobileSidebar, addToast } = useApp();

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('transitops_dark_mode') === 'true';
  });

  // Track window resizing for mobile menu button
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync dark-mode theme class
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('transitops_dark_mode', darkMode.toString());
  }, [darkMode]);

  const toggleDarkMode = () => {
    const nextVal = !darkMode;
    setDarkMode(nextVal);
    addToast('info', `Switched to ${nextVal ? 'Dark' : 'Light'} Mode.`);
  };

  const pathKey = Object.keys(ROUTE_TITLES).find(key =>
    key === '/' ? location.pathname === '/' : location.pathname.startsWith(key)
  ) || '/';

  const breadcrumbs = ROUTE_TITLES[pathKey] || ['Dashboard'];

  return (
    <header className="navbar-top">
      <div className="navbar-left">
        {isMobile && (
          <button className="navbar-icon-btn" onClick={toggleMobileSidebar} id="mobile-menu-btn" style={{ marginRight: 8 }}>
            <Menu />
          </button>
        )}
        <nav className="navbar-breadcrumb">
          <Link to="/">Home</Link>
          {breadcrumbs.map((crumb, i) => (
            <span key={i}>
              <span className="separator">/</span>
              <span className={i === breadcrumbs.length - 1 ? 'current' : ''}>
                {crumb}
              </span>
            </span>
          ))}
        </nav>
      </div>

      <div className="navbar-search">
        <Search />
        <input type="text" placeholder="Search vehicles, drivers, trips… (⌘K)" />
      </div>

      <div className="navbar-right">
        <button className="navbar-icon-btn" onClick={toggleDarkMode} title="Toggle dark mode">
          {darkMode ? <Sun /> : <Moon />}
        </button>
        <button className="navbar-icon-btn" onClick={() => navigate('/notifications')} title="Notifications">
          <Bell />
          {unreadCount > 0 && <span className="notif-dot" />}
        </button>
      </div>
    </header>
  );
}
