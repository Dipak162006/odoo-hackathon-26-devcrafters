import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import StatusBadge from '../components/StatusBadge';
import { Plus, Search, Fuel, Receipt, X, Check, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Finance() {
  const {
    user,
    fuelLogs,
    expenses,
    vehicles,
    logFuel,
    addExpense,
    updateExpenseStatus,
    addToast
  } = useApp();

  const location = useLocation();
  const [activeTab, setActiveTab] = useState('fuel'); // 'fuel' or 'expenses'
  const [searchTerm, setSearchTerm] = useState('');

  // Sync tab with route path
  useEffect(() => {
    if (location.pathname.includes('expenses')) {
      setActiveTab('expenses');
    } else {
      setActiveTab('fuel');
    }
  }, [location.pathname]);


  // Modal States
  const [showFuelModal, setShowFuelModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  // Form States - Fuel
  const [fuelVehicle, setFuelVehicle] = useState('');
  const [fuelQty, setFuelQty] = useState('');
  const [fuelRate, setFuelRate] = useState('');
  const [fuelOdometer, setFuelOdometer] = useState('');
  const [fuelStation, setFuelStation] = useState('');

  // Form States - Expense
  const [expCategory, setExpCategory] = useState('Toll');
  const [expVehicle, setExpVehicle] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expDesc, setExpDesc] = useState('');

  // Access rights
  const isDriver = user.role === 'Driver';
  const isManagerOrAnalyst = user.role === 'Fleet Manager' || user.role === 'Financial Analyst';

  // Available vehicles list (active ones)
  const activeVehicles = vehicles.filter(v => v.status !== 'inactive');

  // Filter fuel logs (If Driver, only see Anil's)
  const filteredFuelLogs = fuelLogs
    .filter(log => {
      if (isDriver && log.driver !== user.name) return false;
      
      const matchSearch =
        log.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.station.toLowerCase().includes(searchTerm.toLowerCase());

      return matchSearch;
    });

  // Filter expenses (If Driver, only see Anil's)
  const filteredExpenses = expenses
    .filter(exp => {
      if (isDriver && exp.submittedBy !== user.name) return false;
      
      const matchSearch =
        exp.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());

      return matchSearch;
    });

  const handleFuelSubmit = (e) => {
    e.preventDefault();
    if (!fuelVehicle || !fuelQty || !fuelRate || !fuelOdometer || !fuelStation) {
      addToast('error', 'Please fill in all fuel fields.');
      return;
    }

    // Verify odometer is higher than vehicle current
    const vehicleObj = vehicles.find(v => v.regNo === fuelVehicle);
    const currentOdoNum = vehicleObj ? parseInt(vehicleObj.mileage.replace(/[^\d.]/g, '') || 0) : 0;
    const finalOdoNum = parseInt(fuelOdometer);

    if (finalOdoNum <= currentOdoNum) {
      addToast('error', `Odometer reading must be higher than current odometer (${currentOdoNum} km).`);
      return;
    }

    const totalCostVal = parseFloat(fuelQty) * parseFloat(fuelRate);

    const success = logFuel({
      vehicle: fuelVehicle,
      driver: user.name,
      quantity: `${fuelQty} L`,
      rate: `₹${fuelRate}/L`,
      totalCost: `₹${totalCostVal.toFixed(2)}`,
      odometer: `${fuelOdometer} km`,
      station: fuelStation,
      fuelType: vehicleObj ? vehicleObj.fuelType : 'Diesel',
    });

    if (success) {
      setShowFuelModal(false);
      // Reset
      setFuelVehicle('');
      setFuelQty('');
      setFuelRate('');
      setFuelOdometer('');
      setFuelStation('');
    }
  };

  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    if (!expVehicle || !expAmount || !expDesc) {
      addToast('error', 'Please fill in all expense fields.');
      return;
    }

    const success = addExpense({
      category: expCategory,
      vehicle: expVehicle,
      amount: `₹${expAmount}`,
      submittedBy: user.name,
      description: expDesc,
    });

    if (success) {
      setShowExpenseModal(false);
      // Reset
      setExpCategory('Toll');
      setExpVehicle('');
      setExpAmount('');
      setExpDesc('');
    }
  };

  return (
    <div className="animate-in">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h2>Finance Management</h2>
          <p>Log fuel fillups, track operational expenses, and audit expense approval receipts</p>
        </div>
        <div className="page-header-actions">
          {activeTab === 'fuel' && (isDriver || user.role === 'Fleet Manager') && (
            <button className="btn btn-primary" onClick={() => setShowFuelModal(true)}>
              <Plus /> Log Fuel fillup
            </button>
          )}
          {activeTab === 'expenses' && (isDriver || user.role === 'Fleet Manager') && (
            <button className="btn btn-primary" onClick={() => setShowExpenseModal(true)}>
              <Plus /> File Expense Report
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'fuel' ? 'active' : ''}`}
          onClick={() => { setActiveTab('fuel'); setSearchTerm(''); }}
        >
          Fuel fillup Logs
        </button>
        <button
          className={`tab-btn ${activeTab === 'expenses' ? 'active' : ''}`}
          onClick={() => { setActiveTab('expenses'); setSearchTerm(''); }}
        >
          General Expenses
        </button>
      </div>

      {/* Toolbar */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="table-toolbar">
          <div className="table-search">
            <Search />
            <input
              type="text"
              placeholder={activeTab === 'fuel' ? "Search vehicle, driver, station..." : "Search vehicle, category, submitter..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Dynamic Lists based on Tab */}
        {activeTab === 'fuel' ? (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Log ID</th>
                  <th>Vehicle</th>
                  <th>Driver Name</th>
                  <th>Date</th>
                  <th>Odometer Reading</th>
                  <th>Quantity (Liters)</th>
                  <th>Rate per Liter</th>
                  <th>Total Cost</th>
                  <th>Station</th>
                </tr>
              </thead>
              <tbody>
                {filteredFuelLogs.length > 0 ? (
                  filteredFuelLogs.map(log => (
                    <tr key={log.id}>
                      <td style={{ fontWeight: 650 }}>{log.id}</td>
                      <td style={{ fontWeight: 600 }}>{log.vehicle}</td>
                      <td>{log.driver}</td>
                      <td>{log.date}</td>
                      <td>{log.odometer}</td>
                      <td>{log.quantity}</td>
                      <td>{log.rate}</td>
                      <td style={{ fontWeight: 650, color: 'var(--color-warning)' }}>{log.totalCost}</td>
                      <td>{log.station}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', padding: 32 }}>
                      No fuel logs recorded.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Exp ID</th>
                  <th>Category</th>
                  <th>Vehicle</th>
                  <th>Cost Amount</th>
                  <th>Date</th>
                  <th>Submitted By</th>
                  <th>Description</th>
                  <th>Status</th>
                  {isManagerOrAnalyst && <th style={{ textAlign: 'right' }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.length > 0 ? (
                  filteredExpenses.map(exp => (
                    <tr key={exp.id}>
                      <td style={{ fontWeight: 650 }}>{exp.id}</td>
                      <td>
                        <span className="status-badge idle" style={{ fontWeight: 600 }}>{exp.category}</span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{exp.vehicle}</td>
                      <td style={{ fontWeight: 650, color: 'var(--color-danger)' }}>{exp.amount}</td>
                      <td>{exp.date}</td>
                      <td>{exp.submittedBy}</td>
                      <td>{exp.description}</td>
                      <td>
                        <StatusBadge status={exp.status} />
                      </td>
                      {isManagerOrAnalyst && (
                        <td style={{ textAlign: 'right' }}>
                          {exp.status === 'pending' && (
                            <div style={{ display: 'inline-flex', gap: 6 }}>
                              <button
                                className="btn btn-primary btn-sm btn-icon"
                                title="Approve"
                                onClick={() => updateExpenseStatus(exp.id, 'approved')}
                              >
                                <Check size={14} />
                              </button>
                              <button
                                className="btn btn-danger btn-sm btn-icon"
                                title="Reject"
                                onClick={() => updateExpenseStatus(exp.id, 'rejected')}
                              >
                                <X size={14} />
                              </button>
                            </div>
                          )}
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', padding: 32 }}>
                      No expenses reported.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- LOG FUEL MODAL --- */}
      {showFuelModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-in">
            <div className="modal-header">
              <h3>Log Fuel Refill</h3>
              <button className="modal-close" onClick={() => setShowFuelModal(false)}><X /></button>
            </div>
            <form onSubmit={handleFuelSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Select Vehicle <span className="required">*</span></label>
                  <select
                    className="form-input"
                    value={fuelVehicle}
                    onChange={(e) => setFuelVehicle(e.target.value)}
                    required
                  >
                    <option value="">-- Choose Vehicle --</option>
                    {activeVehicles.map(v => (
                      <option key={v.id} value={v.regNo}>
                        {v.regNo} ({v.make} {v.model})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Liters filled <span className="required">*</span></label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      placeholder="e.g. 120"
                      value={fuelQty}
                      onChange={(e) => setFuelQty(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Rate (₹ per Liter) <span className="required">*</span></label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      placeholder="e.g. 89.50"
                      value={fuelRate}
                      onChange={(e) => setFuelRate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Current Odometer (km) <span className="required">*</span></label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="e.g. 45200"
                    value={fuelOdometer}
                    onChange={(e) => setFuelOdometer(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Gas Station / Pump <span className="required">*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. IOCL - Hinjewadi"
                    value={fuelStation}
                    onChange={(e) => setFuelStation(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowFuelModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Fuel Log</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- FILE EXPENSE MODAL --- */}
      {showExpenseModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-in">
            <div className="modal-header">
              <h3>File Expense Report</h3>
              <button className="modal-close" onClick={() => setShowExpenseModal(false)}><X /></button>
            </div>
            <form onSubmit={handleExpenseSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Expense Category</label>
                    <select
                      className="form-input"
                      value={expCategory}
                      onChange={(e) => setExpCategory(e.target.value)}
                    >
                      <option value="Toll">Toll charges</option>
                      <option value="Parking">Parking fees</option>
                      <option value="Repair">Radiator/Emergency repairs</option>
                      <option value="Fine">Speeding/Violation Fines</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Select Vehicle <span className="required">*</span></label>
                    <select
                      className="form-input"
                      value={expVehicle}
                      onChange={(e) => setExpVehicle(e.target.value)}
                      required
                    >
                      <option value="">-- Choose Vehicle --</option>
                      {activeVehicles.map(v => (
                        <option key={v.id} value={v.regNo}>
                          {v.regNo} ({v.make} {v.model})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Amount (₹) <span className="required">*</span></label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="e.g. 1250"
                    value={expAmount}
                    onChange={(e) => setExpAmount(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Expense Description / Notes <span className="required">*</span></label>
                  <textarea
                    className="form-input"
                    rows="3"
                    placeholder="Provide details about receipts..."
                    value={expDesc}
                    onChange={(e) => setExpDesc(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowExpenseModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">File Report</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
