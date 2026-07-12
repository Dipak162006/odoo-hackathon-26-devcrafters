import { useState } from 'react';
import { useApp } from '../context/AppContext';
import StatusBadge from '../components/StatusBadge';
import { Plus, Search, Calendar, MapPin, Compass, Navigation, X, CheckCircle, Trash } from 'lucide-react';

export default function Trips() {
  const {
    user,
    trips,
    vehicles,
    drivers,
    dispatchTrip,
    completeTrip,
    cancelTrip,
    addToast
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal States
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [activeTripId, setActiveTripId] = useState(null);

  // Form States - Create Dispatch
  const [routeSource, setRouteSource] = useState('');
  const [routeDest, setRouteDest] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedDriver, setSelectedDriver] = useState('');
  const [cargoWeight, setCargoWeight] = useState('');
  const [plannedDistance, setPlannedDistance] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [revenueInput, setRevenueInput] = useState('');

  // Form States - Complete Trip
  const [finalOdometer, setFinalOdometer] = useState('');
  const [fuelConsumed, setFuelConsumed] = useState('');
  const [fuelCost, setFuelCost] = useState('');

  // Access check
  const isDriverRole = user.role === 'Driver';
  const isManagerRole = user.role === 'Fleet Manager';
  const isSafetyRole = user.role === 'Safety Officer';
  const isAnalystRole = user.role === 'Financial Analyst';

  // Filter Available Vehicles (exclude In Shop / Retired / On Trip)
  const availableVehicles = vehicles.filter(v => v.status === 'active');

  // Filter Available Drivers (exclude Suspended / Expired / On Trip)
  const availableDrivers = drivers.filter(d => {
    const isLicenseValid = new Date(d.licenseExpiry) >= new Date();
    return d.status === 'active' && isLicenseValid;
  });

  // Filter & Search List
  const filteredTrips = trips
    .filter(t => {
      // Driver filter: If logged in as Driver, Anil Sharma can only see his own trips
      if (isDriverRole && t.driver !== user.name) {
        return false;
      }
      return true;
    })
    .filter(t => {
      const matchSearch =
        t.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.driver.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'All' || t.status === statusFilter;

      return matchSearch && matchStatus;
    });

  const handleDispatchSubmit = (e) => {
    e.preventDefault();
    if (!routeSource || !routeDest || !selectedVehicle || !selectedDriver || !cargoWeight || !plannedDistance || !departureTime || !revenueInput) {
      addToast('error', 'Please fill in all dispatch fields.');
      return;
    }

    const success = dispatchTrip({
      route: `${routeSource} → ${routeDest}`,
      vehicle: selectedVehicle,
      driver: selectedDriver,
      cargoWeight: parseFloat(cargoWeight),
      distance: `${plannedDistance} km`,
      departure: departureTime,
      revenue: `₹${revenueInput}`,
    });

    if (success) {
      setShowDispatchModal(false);
      // Reset form
      setRouteSource('');
      setRouteDest('');
      setSelectedVehicle('');
      setSelectedDriver('');
      setCargoWeight('');
      setPlannedDistance('');
      setDepartureTime('');
      setRevenueInput('');
    }
  };

  const openCompleteModal = (tripId) => {
    const tripObj = trips.find(t => t.id === tripId);
    if (!tripObj) return;

    // Prefill vehicle's current odometer mileage if available
    const vehicleObj = vehicles.find(v => v.regNo === tripObj.vehicle);
    const currentOdoNum = vehicleObj ? parseInt(vehicleObj.mileage.replace(/[^\d.]/g, '') || 0) : 0;
    
    setActiveTripId(tripId);
    setFinalOdometer((currentOdoNum + parseInt(tripObj.distance.replace(/[^\d.]/g, '') || 150)).toString());
    setFuelConsumed('');
    setFuelCost('');
    setShowCompleteModal(true);
  };

  const handleCompleteSubmit = (e) => {
    e.preventDefault();
    if (!finalOdometer) {
      addToast('error', 'Final odometer reading is required.');
      return;
    }

    // Verify odometer is greater than current
    const tripObj = trips.find(t => t.id === activeTripId);
    const vehicleObj = vehicles.find(v => v.regNo === tripObj.vehicle);
    const currentOdoNum = vehicleObj ? parseInt(vehicleObj.mileage.replace(/[^\d.]/g, '') || 0) : 0;
    const finalOdoNum = parseInt(finalOdometer);

    if (finalOdoNum <= currentOdoNum) {
      addToast('error', `Odometer reading must be higher than starting reading (${currentOdoNum} km).`);
      return;
    }

    const success = completeTrip(
      activeTripId,
      finalOdoNum,
      fuelConsumed ? parseFloat(fuelConsumed) : null,
      fuelCost ? parseFloat(fuelCost) : null
    );

    if (success) {
      setShowCompleteModal(false);
    }
  };

  return (
    <div className="animate-in">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h2>Trip Dispatching</h2>
          <p>Schedule dispatches, track active deliveries, and verify weight capacities</p>
        </div>
        <div className="page-header-actions">
          {isManagerRole && (
            <button className="btn btn-primary" onClick={() => setShowDispatchModal(true)}>
              <Plus /> Schedule Dispatch
            </button>
          )}
        </div>
      </div>

      {/* Stats Quickbar */}
      {!isDriverRole && (
        <div className="grid-3" style={{ marginBottom: 20 }}>
          <div className="card" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ padding: 10, background: 'var(--color-primary-light)', color: 'var(--color-primary)', borderRadius: 6 }}>
              <Navigation size={20} />
            </div>
            <div>
              <div className="text-overline">Running Trips</div>
              <div className="text-title" style={{ fontWeight: 700 }}>{trips.filter(t => t.status === 'in-transit').length}</div>
            </div>
          </div>
          <div className="card" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ padding: 10, background: 'var(--color-success-light)', color: 'var(--color-success)', borderRadius: 6 }}>
              <CheckCircle size={20} />
            </div>
            <div>
              <div className="text-overline">Completed</div>
              <div className="text-title" style={{ fontWeight: 700 }}>{trips.filter(t => t.status === 'completed').length}</div>
            </div>
          </div>
          <div className="card" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ padding: 10, background: 'var(--color-neutral-100)', color: 'var(--color-neutral-500)', borderRadius: 6 }}>
              <Compass size={20} />
            </div>
            <div>
              <div className="text-overline">Available Vehicles</div>
              <div className="text-title" style={{ fontWeight: 700 }}>{availableVehicles.length} / {vehicles.length}</div>
            </div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="table-toolbar">
          <div className="table-search">
            <Search />
            <input
              type="text"
              placeholder="Search source, destination, driver..."
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
              <option value="All">All Trips</option>
              <option value="in-transit">Running</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Trips Table */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Trip ID</th>
                <th>Route</th>
                <th>Vehicle</th>
                <th>Driver</th>
                <th>Cargo Details</th>
                <th>Date / Time</th>
                {!isDriverRole && !isSafetyRole && <th>Revenue</th>}
                <th>Status</th>
                {(isManagerRole || isDriverRole) && <th style={{ textAlign: 'right' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredTrips.length > 0 ? (
                filteredTrips.map(trip => (
                  <tr key={trip.id}>
                    <td style={{ fontWeight: 650 }}>{trip.id}</td>
                    <td style={{ fontWeight: 600 }}>{trip.route}</td>
                    <td>{trip.vehicle}</td>
                    <td>{trip.driver}</td>
                    <td>
                      <div style={{ fontSize: 13 }}>{trip.cargoWeight ? `${trip.cargoWeight} kg` : 'N/A'}</div>
                      <div className="text-caption">{trip.distance}</div>
                    </td>
                    <td>
                      <div>{trip.date}</div>
                      <div className="text-caption">Dep: {trip.departure} | Arr: {trip.arrival}</div>
                    </td>
                    {!isDriverRole && !isSafetyRole && (
                      <td style={{ fontWeight: 550, color: 'var(--color-success)' }}>{trip.revenue}</td>
                    )}
                    <td>
                      <StatusBadge status={trip.status} />
                    </td>
                    {(isManagerRole || (isDriverRole && trip.driver === user.name)) && (
                      <td style={{ textAlign: 'right' }}>
                        {trip.status === 'in-transit' && (
                          <div style={{ display: 'inline-flex', gap: 6 }}>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => openCompleteModal(trip.id)}
                            >
                              Complete
                            </button>
                            {isManagerRole && (
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => cancelTrip(trip.id)}
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        )}
                        {trip.status === 'pending' && isManagerRole && (
                          <div style={{ display: 'inline-flex', gap: 6 }}>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => {
                                // Dispatch a pending trip directly
                                const vehicleObj = vehicles.find(v => v.regNo === trip.vehicle);
                                const driverObj = drivers.find(d => d.name === trip.driver);
                                if (vehicleObj && driverObj) {
                                  dispatchTrip({
                                    route: trip.route,
                                    vehicle: trip.vehicle,
                                    driver: trip.driver,
                                    cargoWeight: trip.cargoWeight || 450,
                                    distance: trip.distance,
                                    departure: trip.departure,
                                    revenue: trip.revenue,
                                  });
                                } else {
                                  addToast('error', 'Cannot dispatch. Vehicle or driver assigned is no longer available.');
                                }
                              }}
                            >
                              Dispatch
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
                    No dispatches found matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- SCHEDULE DISPATCH MODAL --- */}
      {showDispatchModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-in" style={{ maxWidth: 580 }}>
            <div className="modal-header">
              <h3>Create Trip Dispatch</h3>
              <button className="modal-close" onClick={() => setShowDispatchModal(false)}><X /></button>
            </div>
            <form onSubmit={handleDispatchSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Source City <span className="required">*</span></label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Mumbai"
                      value={routeSource}
                      onChange={(e) => setRouteSource(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Destination City <span className="required">*</span></label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Pune"
                      value={routeDest}
                      onChange={(e) => setRouteDest(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Select Vehicle <span className="required">*</span></label>
                    <select
                      className="form-input"
                      value={selectedVehicle}
                      onChange={(e) => setSelectedVehicle(e.target.value)}
                      required
                    >
                      <option value="">-- Choose Available Vehicle --</option>
                      {availableVehicles.map(v => (
                        <option key={v.id} value={v.regNo}>
                          {v.regNo} ({v.make} {v.model} • Max: {v.maxCapacity || '5000 kg'})
                        </option>
                      ))}
                    </select>
                    <span className="text-caption">Only active/available vehicles shown.</span>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Select Driver <span className="required">*</span></label>
                    <select
                      className="form-input"
                      value={selectedDriver}
                      onChange={(e) => setSelectedDriver(e.target.value)}
                      required
                    >
                      <option value="">-- Choose Available Driver --</option>
                      {availableDrivers.map(d => (
                        <option key={d.id} value={d.name}>
                          {d.name} (Exp: {d.experience})
                        </option>
                      ))}
                    </select>
                    <span className="text-caption">Only active drivers with valid licenses shown.</span>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Cargo Weight (kg) <span className="required">*</span></label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="e.g. 450"
                      value={cargoWeight}
                      onChange={(e) => setCargoWeight(e.target.value)}
                      required
                    />
                    <span className="text-caption">Must not exceed selected vehicle capacity.</span>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Planned Distance (km) <span className="required">*</span></label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="e.g. 150"
                      value={plannedDistance}
                      onChange={(e) => setPlannedDistance(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Departure Time <span className="required">*</span></label>
                    <input
                      type="time"
                      className="form-input"
                      value={departureTime}
                      onChange={(e) => setDepartureTime(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Projected Revenue (₹) <span className="required">*</span></label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="e.g. 12000"
                      value={revenueInput}
                      onChange={(e) => setRevenueInput(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDispatchModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Dispatch Cargo</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- COMPLETE TRIP MODAL --- */}
      {showCompleteModal && (
        <div className="modal-overlay">
          <div className="modal-content animate-in">
            <div className="modal-header">
              <h3>Complete Trip Dispatch</h3>
              <button className="modal-close" onClick={() => setShowCompleteModal(false)}><X /></button>
            </div>
            <form onSubmit={handleCompleteSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Final Odometer Reading (km) <span className="required">*</span></label>
                  <input
                    type="number"
                    className="form-input"
                    value={finalOdometer}
                    onChange={(e) => setFinalOdometer(e.target.value)}
                    required
                  />
                  <span className="text-caption">Must be higher than the current vehicle odometer value.</span>
                </div>

                <div style={{ margin: '16px 0', borderTop: '1px solid var(--border-color-light)', paddingTop: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
                    Optional: Log Fuel Refill
                  </span>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Fuel Quantity Refilled (Liters)</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="e.g. 80"
                      value={fuelConsumed}
                      onChange={(e) => setFuelConsumed(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Total Fuel Cost (₹)</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="e.g. 7200"
                      value={fuelCost}
                      onChange={(e) => setFuelCost(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCompleteModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Complete Delivery</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
