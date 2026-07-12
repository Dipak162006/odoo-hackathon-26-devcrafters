import { useApp } from '../context/AppContext';
import { Bell, Check, Trash2, AlertTriangle, AlertCircle, Info, CheckCircle2 } from 'lucide-react';

export default function Notifications() {
  const { notifications, markNotificationRead, addToast } = useApp();

  const handleMarkAllRead = () => {
    notifications.forEach(n => {
      if (!n.read) markNotificationRead(n.id);
    });
    addToast('success', 'All notifications marked as read.');
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'warning': return <AlertTriangle size={18} style={{ color: 'var(--color-warning)' }} />;
      case 'danger': return <AlertCircle size={18} style={{ color: 'var(--color-danger)' }} />;
      case 'success': return <CheckCircle2 size={18} style={{ color: 'var(--color-success)' }} />;
      default: return <Info size={18} style={{ color: 'var(--color-info)' }} />;
    }
  };

  return (
    <div className="animate-in" style={{ maxWidth: 720, margin: '0 auto' }}>
      <div className="page-header">
        <div className="page-header-left">
          <h2>Notifications Center</h2>
          <p>Monitor compliance alerts, expired licenses, and fleet maintenance warnings</p>
        </div>
        <div className="page-header-actions">
          {notifications.some(n => !n.read) && (
            <button className="btn btn-secondary btn-sm" onClick={handleMarkAllRead}>
              <Check size={14} /> Mark all read
            </button>
          )}
        </div>
      </div>

      <div className="card">
        {notifications.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {notifications.map(n => (
              <div
                key={n.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 14,
                  padding: '16px 20px',
                  borderBottom: '1px solid var(--border-color-light)',
                  background: n.read ? 'transparent' : 'rgba(10, 108, 255, 0.02)',
                  position: 'relative',
                  transition: 'background var(--transition-fast)'
                }}
              >
                {!n.read && (
                  <div
                    style={{
                      position: 'absolute',
                      left: 6,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 6,
                      height: 6,
                      background: 'var(--color-primary)',
                      borderRadius: '50%'
                    }}
                  />
                )}
                
                <div style={{
                  padding: 8,
                  borderRadius: 6,
                  background: 'var(--color-neutral-50)',
                  flexShrink: 0
                }}>
                  {getNotifIcon(n.type)}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: 14, fontWeight: n.read ? 600 : 700, color: 'var(--color-text-primary)' }}>
                      {n.title}
                    </h4>
                    <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>{n.time}</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 4, lineHeight: 1.4 }}>
                    {n.message}
                  </p>
                  {!n.read && (
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ padding: '2px 8px', fontSize: 11, marginTop: 8 }}
                      onClick={() => markNotificationRead(n.id)}
                    >
                      Dismiss Alert
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Bell />
            <h3>Your Inbox is Clean</h3>
            <p>You have no new alerts or notifications. Compliance checks are fully clear.</p>
          </div>
        )}
      </div>
    </div>
  );
}
