import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, ShieldCheck } from 'lucide-react';

export default function AuditLogs() {
  const { auditLogs } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = auditLogs.filter(log => {
    return (
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="animate-in">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h2>Security & Audit Logs</h2>
          <p>Read-only ledger of compliance checks, status changes, and dispatch workflows</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="table-toolbar">
          <div className="table-search">
            <Search />
            <input
              type="text"
              placeholder="Search audit trail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-success)' }}>
            <ShieldCheck size={16} /> Secure Immutable Ledger
          </div>
        </div>

        {/* Audit Table */}
        <div className="table-container">
          <table className="data-table" style={{ fontSize: 13 }}>
            <thead>
              <tr>
                <th style={{ width: '20%' }}>Timestamp</th>
                <th style={{ width: '25%' }}>Action / Event</th>
                <th style={{ width: '15%' }}>User</th>
                <th style={{ width: '40%' }}>Details / System Output</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map(log => (
                  <tr key={log.id}>
                    <td style={{ color: 'var(--color-text-secondary)' }}>{log.timestamp}</td>
                    <td style={{ fontWeight: 600 }}>{log.action}</td>
                    <td>
                      <span className="status-badge idle" style={{ fontWeight: 600 }}>
                        {log.user}
                      </span>
                    </td>
                    <td style={{ color: 'var(--color-text-secondary)', fontFamily: 'monospace', fontSize: 12 }}>
                      {log.details}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: 32 }}>
                    No audit records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
