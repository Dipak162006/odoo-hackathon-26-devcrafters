export default function StatusBadge({ status }) {
  const map = {
    active: 'Active',
    inactive: 'Inactive',
    maintenance: 'Maintenance',
    'in-transit': 'In Transit',
    idle: 'Idle',
    pending: 'Pending',
    completed: 'Completed',
    cancelled: 'Cancelled',
    'in-progress': 'In Progress',
    approved: 'Approved',
    rejected: 'Rejected',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  };

  const className = status === 'in-progress' ? 'in-transit'
    : status === 'approved' ? 'completed'
    : status === 'rejected' ? 'cancelled'
    : status === 'high' ? 'inactive'
    : status === 'medium' ? 'maintenance'
    : status === 'low' ? 'idle'
    : status;

  return (
    <span className={`status-badge ${className}`}>
      <span className="dot" />
      {map[status] || status}
    </span>
  );
}
