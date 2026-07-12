import { useState } from 'react';
import { useApp } from '../context/AppContext';
import StatusBadge from '../components/StatusBadge';
import { Plus, Search, Calendar, Wrench, X, CheckCircle, Clock } from 'lucide-react';

export default function Maintenance() {
  const {
    user,
    maintenance,
    vehicles,
    scheduleMaintenance,
    completeMaintenance,
    addToast
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [activeMaintId, setActiveMaintId] = useState(null);

  // Form States - Schedule
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [maintType, setMaintType] = useState('Oil Change');
  const [priority, setPriority] = useState('medium');
  const [assignedTo, setAssignedTo] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [description, setDescription] = useState('');

  // Form States - Complete
  const [actualCost, setActualCost] = useState('');

  // Access checks
  const isManagerOrSafety = user.role === 'Fleet Manager' || user.role === 'Safety Officer';

  // Vehicles available for maintenance (exclude Retired, show others)
  const activeVehicles = vehicles.filter(v => v.status !== 'inactive' && v.status !== 'maintenance');

  // Filter & Search List
  const filteredMaintenance = maintenance.filter(m => {
    const matchSearch =
      m.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = statusFilter === 'All' || m.status === statusFilter;

    return matchSearch && matchStatus;
  });

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    if (!selectedVehicle || !maintType || !assignedTo || !estimatedCost || !description) {
      addToast('error', 'Please fill in all maintenance fields.');
      return;
    }

    const success = scheduleMaintenance({
      vehicle: selectedVehicle,
      type: maintType,
      priority,
      assignedTo,
      estimatedCost: `₹${estimatedCost}`,
      description,
    });

    if (success) {
      setShowAddModal(false);
      // Reset
      setSelectedVehicle('');
      setMaintType('Oil Change');
      setPriority('medium');
      setAssignedTo('');
      setEstimatedCost('');
      setDescription('');
    }
  };

  const openCompleteModal = (maintId) => {
    const maintObj = maintenance.find(m => m.id === maintId);
    if (!maintObj) return;

    setActiveMaintId(maintId);
    setActualCost(maintObj.estimatedCost.replace(/[^\d.]/g, ''));
    setShowCompleteModal(true);
  };

  const handleCompleteSubmit = (e) => {
    e.preventDefault();
    if (!actualCost) {
      addToast('error', 'Please enter actual maintenance cost.');
      return;
    }

    const success = completeMaintenance(activeMaintId, parseFloat(actualCost));
    if (success) {
      setShowCompleteModal(false);
    }
  };

  return (
    <div className="animate-in">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h2>Maintenance Log</h2>
          <p>Schedule routine services, track garage workloads, and record repair expenses</p>
        </div>
        <div className="page-header-actions">
          {isManagerOrSafety && (
            <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
              <Plus /> Schedule Service
            </button>
          )}
        </div>
      </div>

      {/* Quick stats grid */}
      <div className="grid-3" style={{ marginBottom: 20 }}>
        <div className="card" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ padding: 10, background: 'var(--color-danger-light)', color: 'var(--color-danger)', borderRadius: 6 }}>
            <Wrench size={20} />
          </div>
          <div>
            <div className="text-overline">In Shop Now</div>
            <div className="text-title" style={{ fontWeight: 700 }}>
              {maintenance.filter(m => m.status === 'in-progress').length}
            </div>
          </div>
        </div>
        <div className="card" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ padding: 10, background: 'var(--color-warning-light)', color: 'var(--color-warning)', borderRadius: 6 }}>
            <Clock size={20} />
          </div>
          <div>
            <div className="text-overline">Pending Schedule</div>
            <div className="text-title" style={{ fontWeight: 700 }}>
              {maintenance.filter(m => m.status === 'pending').length}
            </div>
          </div>
        </div>
        <div className="card" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ padding: 10, background: 'var(--color-success-light)', color: 'var(--color-success)', borderRadius: 6 }}>
            <CheckCircle size={20} />
          </div>
          <div>
            <div className="text-overline">Completed</div>
            <div className="text-title" style={{ fontWeight: 700 }}>
              {maintenance.filter(m => m.status === 'completed').length}
            </div>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="table-toolbar">
          <div className="table-search">
            <Search />
            <input
              type="text"
              placeholder="Search vehicle, type, garage..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="table-filters">
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="in-progress">In Shop</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Service Type</th>
                <th>Workshop / Garage</th>
                <th>Priority</th>
                <th>Scheduled Date</th>
                <th>Est. / Actual Cost</th>
                <th>Status</th>
                {isManagerOrSafety && <th style={{ textAlign: 'right' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredMaintenance.length > 0 ? (
                filteredMaintenance.map(record => (
                  <tr key={record.id}>
                    <td style={{ fontWeight: 650 }}>{record.vehicle}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{record.type}</div>
                      <div className="text-caption" style={{ maxWidth: 280, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} title={record.description}>
                        {record.description}
                      </div>
                    </td>
                    <td>{record.assignedTo}</td>
                    <td>
                      <span className={`status-badge ${record.priority}`}>
                        <span className="dot" />
                        {record.priority.toUpperCase()}
                      </span>
                    </td>
                    <td>{record.scheduledDate}</td>
                    <td style={{ fontWeight: 550 }}>{record.estimatedCost}</td>
                    <td>
                      <StatusBadge status={record.status} />
                    </td>
                    {isManagerOrSafety && (
                      <td style={{ textAlign: 'right' }}>
                        {record.status !== 'completed' && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => openCompleteModal(record.id)}
                          >
                            Mark Completed
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: 32 }}>
                    No maintenance records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- SCHEDULE MODAL --- */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-in" style={{ maxWidth: 540 }}>
            <div className="modal-header">
              <h3>Schedule Vehicle Maintenance</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}><X /></button>
            </div>
            <form onSubmit={handleScheduleSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Select Vehicle <span className="required">*</span></label>
                    <select
                      className="form-input"
                      value={selectedVehicle}
                      onChange={(e) => setSelectedVehicle(e.target.value)}
                      required
                    >
                      <option value="">-- Choose Vehicle --</option>
                      {activeVehicles.map(v => (
                        <option key={v.id} value={v.regNo}>
                          {v.regNo} ({v.make} {v.model})
                        </option>
                      ))}
                    </select>
                    <span className="text-caption">Selected vehicle will be marked In Shop.</span>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Priority</label>
                    <select
                      className="form-input"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Service Type <span className="required">*</span></label>
                    <select
                      className="form-input"
                      value={maintType}
                      onChange={(e) => setMaintType(e.target.value)}
                      required
                    >
                      <option value="Oil Change">Oil Change</option>
                      <option value="Brake Inspection">Brake Inspection</option>
                      <option value="Tyre Replacement">Tyre Replacement</option>
                      <option value="Engine Overhaul">Engine Overhaul</option>
                      <option value="Full Service">Full Service</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Assigned Workshop/Garage <span className="required">*</span></label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Speedfix Motors"
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Estimated Cost (₹) <span className="required">*</span></label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="e.g. 5000"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Work Description <span className="required">*</span></label>
                  <textarea
                    className="form-input"
                    rows="3"
                    placeholder="Describe maintenance issues..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Schedule Service</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- COMPLETE MODAL --- */}
      {showCompleteModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-in">
            <div className="modal-header">
              <h3>Complete Maintenance Service</h3>
              <button className="modal-close" onClick={() => setShowCompleteModal(false)}><X /></button>
            </div>
            <form onSubmit={handleCompleteSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Actual Maintenance Cost (₹) <span className="required">*</span></label>
                  <input
                    type="number"
                    className="form-input"
                    value={actualCost}
                    onChange={(e) => setActualCost(e.target.value)}
                    required
                  />
                  <span className="text-caption">This cost will be automatically logged under Repair Expenses.</span>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCompleteModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Complete Service</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
