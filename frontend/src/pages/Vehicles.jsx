import { useState } from 'react';
import { useApp } from '../context/AppContext';
import StatusBadge from '../components/StatusBadge';
import { Plus, Search, Eye, Edit, Trash, X, FileText, Upload } from 'lucide-react';

export default function Vehicles() {
  const { user, vehicles, addVehicle, updateVehicle, addToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortField, setSortField] = useState('regNo');
  const [sortOrder, setSortOrder] = useState('asc');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState(null);

  // Form states
  const [regNo, setRegNo] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [type, setType] = useState('Bus');
  const [maxCapacity, setMaxCapacity] = useState('');
  const [odometer, setOdometer] = useState('');
  const [acquisitionCost, setAcquisitionCost] = useState('');
  const [driver, setDriver] = useState('Unassigned');

  // Document mock upload state
  const [uploadedDocName, setUploadedDocName] = useState('');

  // Access rights check
  const isManagerOrSafety = user.role === 'Fleet Manager' || user.role === 'Safety Officer';
  const isFinancialAnalyst = user.role === 'Financial Analyst';

  // Handle Sort
  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === 'asc';
    setSortField(field);
    setSortOrder(isAsc ? 'desc' : 'asc');
  };

  // Sort and Filter Data
  const filteredVehicles = vehicles
    .filter(vehicle => {
      const matchSearch =
        vehicle.regNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.driver.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchStatus = statusFilter === 'All' || vehicle.status === statusFilter;
      const matchType = typeFilter === 'All' || vehicle.type === typeFilter;

      return matchSearch && matchStatus && matchType;
    })
    .sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      // Parse numerical fields
      if (sortField === 'maxCapacity') {
        aVal = parseFloat(a.maxCapacity) || 0;
        bVal = parseFloat(b.maxCapacity) || 0;
      } else if (sortField === 'mileage') {
        aVal = parseInt(a.mileage.replace(/[^\d.]/g, '')) || 0;
        bVal = parseInt(b.mileage.replace(/[^\d.]/g, '')) || 0;
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  // Actions
  const openAddModal = () => {
    setRegNo('');
    setMake('');
    setModel('');
    setType('Bus');
    setMaxCapacity('');
    setOdometer('');
    setAcquisitionCost('');
    setDriver('Unassigned');
    setShowAddModal(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!regNo || !make || !model || !maxCapacity || !odometer) {
      addToast('error', 'All fields except Acquisition Cost & Driver are required.');
      return;
    }
    const success = addVehicle({
      regNo,
      make,
      model,
      type,
      maxCapacity: `${maxCapacity} kg`,
      odometer: `${odometer} km`,
      acquisitionCost: acquisitionCost ? `₹${acquisitionCost}` : '₹0',
      driver,
    });
    if (success) {
      setShowAddModal(false);
    }
  };

  const openEditModal = (vehicle) => {
    setCurrentVehicle(vehicle);
    setRegNo(vehicle.regNo);
    setMake(vehicle.make);
    setModel(vehicle.model);
    setType(vehicle.type);
    setMaxCapacity(vehicle.maxCapacity.replace(/[^\d.]/g, ''));
    setOdometer(vehicle.mileage.replace(/[^\d.]/g, ''));
    setAcquisitionCost(vehicle.acquisitionCost ? vehicle.acquisitionCost.replace(/[^\d.]/g, '') : '');
    setDriver(vehicle.driver);
    setShowEditModal(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const updated = {
      ...currentVehicle,
      regNo,
      make,
      model,
      type,
      maxCapacity: `${maxCapacity} kg`,
      mileage: `${odometer} km`,
      acquisitionCost: acquisitionCost ? `₹${acquisitionCost}` : '₹0',
      driver,
    };
    updateVehicle(updated);
    setShowEditModal(false);
  };

  const openDetailModal = (vehicle) => {
    setCurrentVehicle(vehicle);
    setUploadedDocName('');
    setShowDetailModal(true);
  };

  const handleDocUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedDocName(file.name);
      addToast('success', `Document "${file.name}" uploaded and linked successfully.`);
    }
  };

  return (
    <div className="animate-in">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h2>Vehicle Registry</h2>
          <p>Maintain the master list of all vehicles in your fleet</p>
        </div>
        <div className="page-header-actions">
          {isManagerOrSafety && (
            <button className="btn btn-primary" onClick={openAddModal}>
              <Plus /> Register Vehicle
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
              placeholder="Search registration, brand, driver..."
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
              <option value="maintenance">In Shop</option>
              <option value="idle">Idle</option>
              <option value="inactive">Retired</option>
            </select>
            <select
              className="filter-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="Bus">Bus</option>
              <option value="Mini Bus">Mini Bus</option>
              <option value="Van">Van</option>
              <option value="SUV">SUV</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th className={sortField === 'regNo' ? 'sorted' : ''} onClick={() => handleSort('regNo')}>
                  Reg Number {sortField === 'regNo' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th className={sortField === 'make' ? 'sorted' : ''} onClick={() => handleSort('make')}>
                  Vehicle Name/Model {sortField === 'make' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th className={sortField === 'type' ? 'sorted' : ''} onClick={() => handleSort('type')}>
                  Type {sortField === 'type' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th className={sortField === 'maxCapacity' ? 'sorted' : ''} onClick={() => handleSort('maxCapacity')}>
                  Max Capacity {sortField === 'maxCapacity' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th className={sortField === 'mileage' ? 'sorted' : ''} onClick={() => handleSort('mileage')}>
                  Odometer {sortField === 'mileage' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th>Assigned Driver</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.length > 0 ? (
                filteredVehicles.map(vehicle => (
                  <tr key={vehicle.id}>
                    <td style={{ fontWeight: 600 }}>{vehicle.regNo}</td>
                    <td>{vehicle.make} {vehicle.model}</td>
                    <td>{vehicle.type}</td>
                    <td>{vehicle.maxCapacity || '5,000 kg'}</td>
                    <td>{vehicle.mileage}</td>
                    <td>{vehicle.driver}</td>
                    <td>
                      <StatusBadge status={vehicle.status} />
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button
                          className="btn btn-secondary btn-icon btn-sm"
                          title="View Details"
                          onClick={() => openDetailModal(vehicle)}
                        >
                          <Eye size={14} />
                        </button>
                        {isManagerOrSafety && (
                          <button
                            className="btn btn-secondary btn-icon btn-sm"
                            title="Edit Vehicle"
                            onClick={() => openEditModal(vehicle)}
                          >
                            <Edit size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: 32 }}>
                    No vehicles found matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- ADD MODAL --- */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-in">
            <div className="modal-header">
              <h3>Register Fleet Vehicle</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}><X /></button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Registration Number <span className="required">*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="MH-12-AB-1234"
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Make/Brand <span className="required">*</span></label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Tata, Ashok Leyland"
                      value={make}
                      onChange={(e) => setMake(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Model Name <span className="required">*</span></label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Starbus, oyster"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Vehicle Type</label>
                    <select
                      className="form-input"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                    >
                      <option value="Bus">Bus</option>
                      <option value="Mini Bus">Mini Bus</option>
                      <option value="Van">Van</option>
                      <option value="SUV">SUV</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Capacity (kg) <span className="required">*</span></label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="e.g. 5000"
                      value={maxCapacity}
                      onChange={(e) => setMaxCapacity(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Odometer (km) <span className="required">*</span></label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="e.g. 24000"
                      value={odometer}
                      onChange={(e) => setOdometer(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Acquisition Cost (₹)</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="e.g. 1500000"
                      value={acquisitionCost}
                      onChange={(e) => setAcquisitionCost(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Vehicle</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT MODAL --- */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-in">
            <div className="modal-header">
              <h3>Edit Vehicle Details</h3>
              <button className="modal-close" onClick={() => setShowEditModal(false)}><X /></button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Registration Number</label>
                  <input
                    type="text"
                    className="form-input"
                    value={regNo}
                    disabled
                  />
                  <span className="text-caption">Registration number cannot be changed.</span>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Make/Brand</label>
                    <input
                      type="text"
                      className="form-input"
                      value={make}
                      onChange={(e) => setMake(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Model Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Vehicle Type</label>
                    <select
                      className="form-input"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                    >
                      <option value="Bus">Bus</option>
                      <option value="Mini Bus">Mini Bus</option>
                      <option value="Van">Van</option>
                      <option value="SUV">SUV</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Capacity (kg)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={maxCapacity}
                      onChange={(e) => setMaxCapacity(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Odometer (km)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={odometer}
                      onChange={(e) => setOdometer(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Acquisition Cost (₹)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={acquisitionCost}
                      onChange={(e) => setAcquisitionCost(e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Assigned Driver</label>
                  <input
                    type="text"
                    className="form-input"
                    value={driver}
                    onChange={(e) => setDriver(e.target.value)}
                  />
                </div>
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
      {showDetailModal && currentVehicle && (
        <div className="modal-overlay">
          <div className="modal-content animate-in" style={{ maxWidth: 640 }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="text-title" style={{ fontWeight: 700 }}>{currentVehicle.regNo}</span>
                <StatusBadge status={currentVehicle.status} />
              </div>
              <button className="modal-close" onClick={() => setShowDetailModal(false)}><X /></button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h3>Vehicle Information</h3>
                <div className="detail-info-grid">
                  <div className="detail-info-item">
                    <label>Brand & Model</label>
                    <p>{currentVehicle.make} {currentVehicle.model}</p>
                  </div>
                  <div className="detail-info-item">
                    <label>Type</label>
                    <p>{currentVehicle.type}</p>
                  </div>
                  <div className="detail-info-item">
                    <label>Maximum Load Capacity</label>
                    <p>{currentVehicle.maxCapacity || '5,000 kg'}</p>
                  </div>
                  <div className="detail-info-item">
                    <label>Current Odometer</label>
                    <p>{currentVehicle.mileage}</p>
                  </div>
                  <div className="detail-info-item">
                    <label>Assigned Driver</label>
                    <p>{currentVehicle.driver}</p>
                  </div>
                  <div className="detail-info-item">
                    <label>Insurance Renewal Date</label>
                    <p>{currentVehicle.insurance || '2027-03-10'}</p>
                  </div>
                </div>
              </div>

              {/* Financial detail section (restricted to manager & analyst) */}
              {user.role !== 'Safety Officer' && (
                <div className="detail-section" style={{ borderTop: '1px solid var(--border-color-light)', paddingTop: 16 }}>
                  <h3>Financial Details</h3>
                  <div className="detail-info-grid">
                    <div className="detail-info-item">
                      <label>Acquisition Cost</label>
                      <p>{currentVehicle.acquisitionCost || '₹12,50,000'}</p>
                    </div>
                    <div className="detail-info-item">
                      <label>Last Service Date</label>
                      <p>{currentVehicle.lastService}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Document Manager */}
              <div className="detail-section" style={{ borderTop: '1px solid var(--border-color-light)', paddingTop: 16 }}>
                <h3>Document Manager</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--color-neutral-50)', borderRadius: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <FileText size={16} style={{ color: 'var(--color-primary)' }} />
                      <span style={{ fontSize: 13, fontWeight: 500 }}>insurance_policy_{currentVehicle.regNo}.pdf</span>
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>Valid</span>
                  </div>

                  {uploadedDocName && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--color-success-light)', borderRadius: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <FileText size={16} style={{ color: 'var(--color-success)' }} />
                        <span style={{ fontSize: 13, fontWeight: 500 }}>{uploadedDocName}</span>
                      </div>
                      <span style={{ fontSize: 11, color: 'var(--color-success)' }}>Uploaded</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                    <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                      <Upload size={14} /> Upload Compliance Document
                      <input type="file" style={{ display: 'none' }} accept=".pdf,.png,.jpg" onChange={handleDocUpload} />
                    </label>
                    <span className="text-caption">Upload Registration / Fitment certificates</span>
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
