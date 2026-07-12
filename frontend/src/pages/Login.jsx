import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Zap, Shield, Key, Mail } from 'lucide-react';

export default function Login() {
  const { switchRole, addToast } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('error', 'Please fill in all fields.');
      return;
    }
    // Simple mock authentication
    switchRole('Fleet Manager'); // default to Manager for custom logins
    navigate('/');
  };

  const handleQuickLogin = (role) => {
    switchRole(role);
    navigate('/');
  };

  return (
    <div className="login-page animate-in">
      <div className="login-left">
        <div className="login-hero">
          <div className="sidebar-brand-icon" style={{ width: 48, height: 48, marginBottom: 24 }}>
            <Zap size={24} />
          </div>
          <h1>TransitOps</h1>
          <p>
            Digitized Transport Management ERP. Real-time fleet tracking, automated dispatching compliance, smart fuel logs, and expense audits.
          </p>
          <div className="login-features">
            <div className="login-feature">
              <div className="login-feature-icon">
                <Zap />
              </div>
              <span>Enforced Business Rules & Auto-Status Transitions</span>
            </div>
            <div className="login-feature">
              <div className="login-feature-icon">
                <Shield />
              </div>
              <span>Simulated Role-Based Access Control (RBAC)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-container">
          <h2>Welcome to TransitOps</h2>
          <p className="subtitle">Sign in to manage fleet operations</p>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--color-text-tertiary)' }} />
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: 38 }}
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Key size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--color-text-tertiary)' }} />
                <input
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: 38 }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '10px 16px', marginTop: 8 }}>
              Sign In
            </button>
          </form>

          <div style={{ margin: '24px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border-color)' }} />
            <span style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--color-text-tertiary)', fontWeight: 600, letterSpacing: '0.04em' }}>
              Or Switch Simulated Role
            </span>
            <div style={{ flex: 1, height: 1, background: 'var(--border-color)' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button className="quick-action-btn" onClick={() => handleQuickLogin('Fleet Manager')} style={{ justifyContent: 'center' }}>
              Fleet Manager
            </button>
            <button className="quick-action-btn" onClick={() => handleQuickLogin('Driver')} style={{ justifyContent: 'center' }}>
              Driver (Anil)
            </button>
            <button className="quick-action-btn" onClick={() => handleQuickLogin('Safety Officer')} style={{ justifyContent: 'center' }}>
              Safety Officer
            </button>
            <button className="quick-action-btn" onClick={() => handleQuickLogin('Financial Analyst')} style={{ justifyContent: 'center' }}>
              Financial Analyst
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
