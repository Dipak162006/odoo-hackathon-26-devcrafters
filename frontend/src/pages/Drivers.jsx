import { useState } from 'react';
import { useApp } from '../context/AppContext';
import StatusBadge from '../components/StatusBadge';
import { Plus, Search, Eye, Edit, X, Star, Calendar, Phone, ShieldAlert } from 'lucide-react';

export default function Drivers() {
  const { user, drivers, addDriver, updateDriver, addToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentDriver, setCurrentDriver] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [license, setLicense] = useState('');
  const [licenseExpiry, setLicenseExpiry] = useState('');
  const [experience, setExperience] = useState('');
  const [safetyScore, setSafetyScore] = useState('5.0');
  const [status, setStatus] = useState('active');

  // Check role permissions
  const isManagerOrSafety = user.role === 'Fleet Manager' || user.role === 'Safety Officer';

  // License status check helper
  const getLicenseStatus = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { label: 'Expired', class: 'inactive', warning: true };
    if (diffDays <= 30) return { label: `Expiring in ${diffDays}d`, class: 'maintenance', warning: true };
    return { label: 'Valid', class: 'active', warning: false };
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone || !license || !licenseExpiry || !experience) {
      addToast('error', 'Please fill in all required fields.');
      return;
    }
    const success = addDriver({
      name,
      phone,
      license,
      licenseExpiry,
      experience: `${experience} years`,
      safetyScore: parseFloat(safetyScore) || 5.0,
      status: 'active',
    });
    if (success) {
      setShowAddModal(false);
    }
  };

  const openEditModal = (driverObj) => {
    setCurrentDriver(driverObj);
    setName(driverObj.name);
    setPhone(driverObj.phone);
    setLicense(driverObj.license);
    setLicenseExpiry(driverObj.licenseExpiry);
    setExperience(driverObj.experience.replace(/[^\d.]/g, ''));
    setSafetyScore(driverObj.safetyScore);
    setStatus(driverObj.status);
    setShowEditModal(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const updated = {
      ...currentDriver,
      name,
      phone,
      license,
      licenseExpiry,
      experience: `${experience} years`,
      safetyScore: parseFloat(safetyScore) || 5.0,
      status,
    };
    updateDriver(updated);
    setShowEditModal(false);
  };

  // Filter lists
  const filteredDrivers = drivers.filter(driverObj => {
    const matchSearch =
      driverObj.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driverObj.license.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driverObj.phone.includes(searchTerm);

    const matchStatus = statusFilter === 'All' || driverObj.status === statusFilter;

    return matchSearch && matchStatus;
  });

  return (
    <div className="animate-in">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h2>Driver Registry</h2>
          <p>Manage fleet driver profiles, license compliance, and safety scoring</p>
        </div>
        <div className="page-header-actions">
          {isManagerOrSafety && (
            <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
              <Plus /> Onboard Driver
            </button>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="table-toolbar">
          <div className="table-search">
            <Search />
            <input
              type="text"
              placeholder="Search driver name, license, contact..."
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
              <option value="active">Available</option>
              <option value="in-transit">On Trip</option>
              <option value="idle">Off Duty</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* Grid/Table */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Driver Name</th>
                <th>License Details</th>
                <th>License Expiry</th>
                <th>Experience</th>
                <th>Safety Score</th>
                <th>Contact</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDrivers.length > 0 ? (
                filteredDrivers.map(driverObj => {
                  const licInfo = getLicenseStatus(driverObj.licenseExpiry);
                  return (
                    <tr key={driverObj.id}>
                      <td style={{ fontWeight: 600 }}>{driverObj.name}</td>
                      <td>
                        <div style={{ fontSize: 13 }}>{driverObj.license}</div>
                      </td>
                      <td>
                        <span className={`status-badge ${licInfo.class}`}>
                          <span className="dot" />
                          {licInfo.label} ({driverObj.licenseExpiry})
                        </span>
                      </td>
                      <td>{driverObj.experience}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Star size={14} fill="#F59E0B" color="#F59E0B" />
                          <span style={{ fontWeight: 600 }}>{driverObj.rating || driverObj.safetyScore || '5.0'}</span>
                        </div>
                      </td>
                      <td>{driverObj.phone}</td>
                      <td>
                        <StatusBadge status={driverObj.status} />
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: 6 }}>
                          <button
                            className="btn btn-secondary btn-icon btn-sm"
                            title="View Details"
                            onClick={() => {
                              setCurrentDriver(driverObj);
                              setShowDetailModal(true);
                            }}
                          >
                            <Eye size={14} />
                          </button>
                          {(isManagerOrSafety || user.name === driverObj.name) && (
                            <button
                              className="btn btn-secondary btn-icon btn-sm"
                              title="Edit Driver"
                              onClick={() => openEditModal(driverObj)}
                            >
                              <Edit size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: 32 }}>
                    No drivers found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- ADD DRIVER MODAL --- */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-in">
            <div className="modal-header">
              <h3>Onboard Driver Profile</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}><X /></button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Full Name <span className="required">*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Ramesh Patel"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Phone Number <span className="required">*</span></label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="+91 XXXXX XXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Experience (Years) <span className="required">*</span></label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="e.g. 5"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">License Number <span className="required">*</span></label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="MH-DL-XXXX-YYYY"
                      value={license}
                      onChange={(e) => setLicense(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">License Expiry Date <span className="required">*</span></label>
                    <input
                      type="date"
                      className="form-input"
                      value={licenseExpiry}
                      onChange={(e) => setLicenseExpiry(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Safety Rating / Score (Out of 5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    className="form-input"
                    placeholder="5.0"
                    value={safetyScore}
                    onChange={(e) => setSafetyScore(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Onboard Driver</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT DRIVER MODAL --- */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-in">
            <div className="modal-header">
              <h3>Edit Driver Profile</h3>
              <button className="modal-close" onClick={() => setShowEditModal(false)}><X /></button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={name}
                    disabled={!isManagerOrSafety}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      className="form-input"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Experience (Years)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={experience}
                      disabled={!isManagerOrSafety}
                      onChange={(e) => setExperience(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">License Number</label>
                    <input
                      type="text"
                      className="form-input"
                      value={license}
                      disabled={!isManagerOrSafety}
                      onChange={(e) => setLicense(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">License Expiry Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={licenseExpiry}
                      disabled={!isManagerOrSafety}
                      onChange={(e) => setLicenseExpiry(e.target.value)}
                      required
                    />
                  </div>
                </div>
                {isManagerOrSafety && (
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Safety Rating / Score</label>
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="5"
                        className="form-input"
                        value={safetyScore}
                        onChange={(e) => setSafetyScore(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Status</label>
                      <select
                        className="form-input"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <option value="active">Available</option>
                        <option value="in-transit">On Trip</option>
                        <option value="idle">Off Duty</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- DETAIL VIEW MODAL --- */}
      {showDetailModal && currentDriver && (
        <div className="modal-overlay">
          <div className="modal-content animate-in" style={{ maxWidth: 560 }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="text-title" style={{ fontWeight: 700 }}>{currentDriver.name}</span>
                <StatusBadge status={currentDriver.status} />
              </div>
              <button className="modal-close" onClick={() => setShowDetailModal(false)}><X /></button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h3>Driver Profile Details</h3>
                <div className="detail-info-grid">
                  <div className="detail-info-item">
                    <label>Assigned Vehicle</label>
                    <p>{currentDriver.vehicle || 'Unassigned'}</p>
                  </div>
                  <div className="detail-info-item">
                    <label>License Number</label>
                    <p>{currentDriver.license}</p>
                  </div>
                  <div className="detail-info-item">
                    <label>License Expiry Date</label>
                    <p>{currentDriver.licenseExpiry}</p>
                  </div>
                  <div className="detail-info-item">
                    <label>Experience</label>
                    <p>{currentDriver.experience}</p>
                  </div>
                  <div className="detail-info-item">
                    <label>Contact Number</label>
                    <p>{currentDriver.phone}</p>
                  </div>
                  <div className="detail-info-item">
                    <label>Onboarding Date</label>
                    <p>{currentDriver.joinDate || '2019-04-10'}</p>
                  </div>
                </div>
              </div>

              {/* Compliance & Ratings Section */}
              <div className="detail-section" style={{ borderTop: '1px solid var(--border-color-light)', paddingTop: 16 }}>
                <h3>Compliance & Statistics</h3>
                <div className="detail-info-grid" style={{ gridTemplateColumns: '1fr 1.5fr' }}>
                  <div className="detail-info-item">
                    <label>Safety Rating</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                      <Star size={18} fill="#F59E0B" color="#F59E0B" />
                      <span style={{ fontSize: 16, fontWeight: 700 }}>{currentDriver.rating || currentDriver.safetyScore || '5.0'}</span>
                    </div>
                  </div>
                  <div className="detail-info-item">
                    <label>License Validity Status</label>
                    {new Date(currentDriver.licenseExpiry) < new Date() ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-danger)', fontSize: 13, marginTop: 4, fontWeight: 550 }}>
                        <ShieldAlert size={16} />
                        Expired License (Action Required)
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-success)', fontSize: 13, marginTop: 4, fontWeight: 550 }}>
                        Active & Valid
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowDetailModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
