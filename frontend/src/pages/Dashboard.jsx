import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Title, Tooltip, Legend, ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Truck, MapPin, Users, Wrench, Fuel, DollarSign, Calendar, Compass, AlertCircle } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    user,
    vehicles,
    drivers,
    trips,
    maintenance,
    fuelLogs,
    expenses,
    auditLogs
  } = useApp();

  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('All');

  // Filter vehicles for calculations
  const filteredVehicles = vehicleTypeFilter === 'All'
    ? vehicles
    : vehicles.filter(v => v.type === vehicleTypeFilter);

  // Dynamic calculations based on state
  const totalVehiclesCount = filteredVehicles.length;
  const activeTripsCount = trips.filter(t => t.status === 'in-transit').length;
  const activeDriversCount = drivers.filter(d => d.status === 'active' || d.status === 'in-transit').length;
  
  const totalFuelCost = fuelLogs.reduce((acc, curr) => {
    const val = parseInt(curr.totalCost.replace(/[^\d.]/g, '') || 0);
    return acc + val;
  }, 0);

  const dueMaintenanceCount = maintenance.filter(m => m.status === 'pending' || m.status === 'in-progress').length;
  
  const totalRevenue = trips.filter(t => t.status === 'completed').reduce((acc, curr) => {
    const val = parseInt(curr.revenue.replace(/[^\d.]/g, '') || 0);
    return acc + val;
  }, 0);

  // Fleet status breakdown
  const statusCounts = filteredVehicles.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, { active: 0, 'in-transit': 0, maintenance: 0, idle: 0, inactive: 0 });

  // Charts configurations
  const tripChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Trips Completed',
      data: [12, 19, 15, 22, 28, 18, 10],
      borderColor: '#0A6CFF',
      backgroundColor: 'rgba(10,108,255,0.05)',
      tension: 0.3,
      fill: true,
    }]
  };

  const fuelChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [{
      label: 'Fuel Spend (₹)',
      data: [65000, 72000, 80000, 78000, 85000, 92000, totalFuelCost > 0 ? totalFuelCost : 98000],
      backgroundColor: 'rgba(245, 158, 11, 0.85)',
      borderRadius: 4,
    }]
  };

  const doughnutData = {
    labels: ['Available (Active)', 'On Trip (In Transit)', 'In Shop (Maintenance)', 'Idle', 'Retired/Inactive'],
    datasets: [{
      data: [
        statusCounts.active || 0,
        statusCounts['in-transit'] || 0,
        statusCounts.maintenance || 0,
        statusCounts.idle || 0,
        statusCounts.inactive || 0,
      ],
      backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#6B7280', '#EF4444'],
      borderWidth: 0,
    }]
  };

  const userRole = user.role;

  // Custom driver-centric dashboard variables
  const driverTrips = trips.filter(t => t.driver === user.name);
  const driverActiveTrip = driverTrips.find(t => t.status === 'in-transit');
  const driverCompletedCount = driverTrips.filter(t => t.status === 'completed').length;
  const driverRating = drivers.find(d => d.name === user.name)?.rating || 5.0;

  return (
    <div className="animate-in">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h2>Dashboard Overview</h2>
          <p>Welcome back, {user.name} ({user.role})</p>
        </div>
        <div className="page-header-actions">
          {userRole === 'Fleet Manager' && (
            <>
              <button className="btn btn-secondary" onClick={() => navigate('/reports')}>
                Generate Reports
              </button>
              <button className="btn btn-primary" onClick={() => navigate('/trips')}>
                New Dispatch
              </button>
            </>
          )}
          {userRole === 'Driver' && (
            <>
              <button className="btn btn-secondary" onClick={() => navigate('/fuel')}>
                Log Fuel
              </button>
              <button className="btn btn-primary" onClick={() => navigate('/expenses')}>
                File Expense
              </button>
            </>
          )}
        </div>
      </div>

      {/* Driver Centric Dashboard UI */}
      {userRole === 'Driver' ? (
        <div style={{ marginBottom: 24 }}>
          <div className="stats-grid">
            <StatCard id="active-trips" label="Your Active Trips" value={driverActiveTrip ? '1' : '0'} trend="Normal" trendDir="up" period="Right now" variant="info" />
            <StatCard id="drivers" label="Your Completed Trips" value={driverCompletedCount.toString()} trend="+2" trendDir="up" period="this month" variant="success" />
            <StatCard id="vehicles" label="Your Driver Rating" value={`${driverRating} / 5.0`} trend="Excellent" trendDir="up" period="Safety rating" variant="primary" />
            <StatCard id="fuel-cost" label="Your Logged Fuel" value={`₹${fuelLogs.filter(f => f.driver === user.name).reduce((sum, f) => sum + parseInt(f.totalCost.replace(/[^\d.]/g, '') || 0), 0)}`} trend="Calculated" trendDir="up" period="This week" variant="warning" />
          </div>

          <div className="grid-2">
            {driverActiveTrip ? (
              <div className="card" style={{ padding: 20 }}>
                <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <Compass style={{ color: 'var(--color-primary)' }} /> Current Active Dispatch
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <label className="text-overline">Route</label>
                    <div className="text-title" style={{ fontWeight: 650 }}>{driverActiveTrip.route}</div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label className="text-overline">Vehicle Registration</label>
                      <div className="text-body">{driverActiveTrip.vehicle}</div>
                    </div>
                    <div>
                      <label className="text-overline">Scheduled Departure</label>
                      <div className="text-body">{driverActiveTrip.departure}</div>
                    </div>
                  </div>
                  <div>
                    <label className="text-overline">Planned Distance</label>
                    <div className="text-body">{driverActiveTrip.distance}</div>
                  </div>
                  <button className="btn btn-primary" onClick={() => navigate('/trips')} style={{ marginTop: 12 }}>
                    Update / Complete Trip
                  </button>
                </div>
              </div>
            ) : (
              <div className="card" style={{ padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <Compass size={40} style={{ color: 'var(--color-text-tertiary)', marginBottom: 12 }} />
                <h3>No Active Dispatch</h3>
                <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 4 }}>
                  You are currently off duty or waiting for a dispatch assignment.
                </p>
              </div>
            )}

            <div className="card" style={{ padding: 20 }}>
              <div className="card-title" style={{ marginBottom: 16 }}>Recent Notifications & Compliance alerts</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: 8, borderRadius: 6, background: 'var(--color-neutral-50)' }}>
                  <AlertCircle size={18} style={{ color: 'var(--color-warning)', flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 550 }}>Check License Validity</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Your license expires soon. Keep dispatch updated.</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: 8, borderRadius: 6, background: 'var(--color-neutral-50)' }}>
                  <Compass size={18} style={{ color: 'var(--color-info)', flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 550 }}>Submit Toll Receipts</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Remember to scan and submit toll expense receipts within 24 hours of completing a trip.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Manager / Safety / Finance Dashboard UI */
        <div>
          {/* Filters Bar */}
          <div className="card" style={{ padding: '12px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-text-secondary)' }}>Filter Fleet:</span>
              <select className="filter-select" value={vehicleTypeFilter} onChange={(e) => setVehicleTypeFilter(e.target.value)}>
                <option value="All">All Vehicle Types</option>
                <option value="Bus">Bus</option>
                <option value="Mini Bus">Mini Bus</option>
                <option value="Van">Van</option>
                <option value="SUV">SUV</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--color-text-secondary)' }}>
              <span>Total filtered: <strong>{totalVehiclesCount}</strong></span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            <StatCard id="vehicles" label="Total Fleet Vehicles" value={totalVehiclesCount.toString()} trend="+4" trendDir="up" period="vs last month" variant="primary" />
            <StatCard id="active-trips" label="Active Trips" value={activeTripsCount.toString()} trend="Running" trendDir="up" period="today" variant="info" />
            <StatCard id="drivers" label="Drivers On Duty" value={activeDriversCount.toString()} trend="Steady" trendDir="up" period="Active list" variant="success" />
            {userRole !== 'Safety Officer' && (
              <>
                <StatCard id="fuel-cost" label="Total Fuel Cost" value={`₹${(totalFuelCost/100000).toFixed(2)}L`} trend="+5.2%" trendDir="up" period="this week" variant="warning" />
                <StatCard id="revenue" label="Total Revenue (Completed)" value={`₹${(totalRevenue/100000).toFixed(2)}L`} trend="+12%" trendDir="up" period="this month" variant="success" />
              </>
            )}
            <StatCard id="maintenance" label="Due Maintenance" value={dueMaintenanceCount.toString()} trend="+3" trendDir="up" period="this week" variant="danger" />
          </div>

          {/* Charts Grid */}
          <div className="charts-grid">
            {userRole !== 'Safety Officer' ? (
              <div className="chart-card">
                <div className="chart-card-header">
                  <span className="chart-card-title">Weekly Trips & Productivity</span>
                </div>
                <div style={{ height: 220 }}>
                  <Line data={tripChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </div>
            ) : (
              <div className="chart-card">
                <div className="chart-card-header">
                  <span className="chart-card-title">Driver Onboarding Status</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span>Active Drivers</span>
                    <strong>{drivers.filter(d => d.status === 'active').length}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span>In-Transit Drivers</span>
                    <strong>{drivers.filter(d => d.status === 'in-transit').length}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span>Idle Drivers</span>
                    <strong>{drivers.filter(d => d.status === 'idle').length}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span>Suspended Drivers</span>
                    <strong>{drivers.filter(d => d.status === 'suspended').length}</strong>
                  </div>
                </div>
              </div>
            )}

            <div className="chart-card">
              <div className="chart-card-header">
                <span className="chart-card-title">Fleet Availability Status</span>
              </div>
              <div style={{ display: 'flex', height: 220, alignItems: 'center' }}>
                <div style={{ width: '45%' }}>
                  <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                </div>
                <div style={{ width: '55%', display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                    <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: '#10B981' }} />
                    <span>Available: {statusCounts.active}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                    <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: '#3B82F6' }} />
                    <span>In Transit: {statusCounts['in-transit']}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                    <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: '#F59E0B' }} />
                    <span>In Shop (Maintenance): {statusCounts.maintenance}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                    <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: '#6B7280' }} />
                    <span>Idle: {statusCounts.idle}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                    <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: '#EF4444' }} />
                    <span>Retired: {statusCounts.inactive}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid-2">
            {/* Live Activities */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">Live Dispatch Feed</span>
                <Link to="/trips" className="btn btn-ghost btn-sm" style={{ fontSize: 12 }}>View Trips</Link>
              </div>
              <div className="card-body no-pad" style={{ maxHeight: 300, overflowY: 'auto' }}>
                <div style={{ padding: '0 20px' }}>
                  {trips.slice(0, 5).map(trip => (
                    <div key={trip.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-color-light)' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 550 }}>{trip.route}</div>
                        <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                          Driver: {trip.driver} • Vehicle: {trip.vehicle}
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                        <StatusBadge status={trip.status} />
                        <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>{trip.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Audit Logs Quickview */}
            <div className="card">
              <div className="card-header">
                <span className="card-title">Recent Audit Logs</span>
                <Link to="/audit-logs" className="btn btn-ghost btn-sm" style={{ fontSize: 12 }}>View Audit Logs</Link>
              </div>
              <div className="card-body no-pad" style={{ maxHeight: 300, overflowY: 'auto' }}>
                <div style={{ padding: '0 20px' }}>
                  {auditLogs.slice(0, 5).map(log => (
                    <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-color-light)' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{log.action}</div>
                        <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                          {log.details}
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                        <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-primary)' }}>{log.user}</span>
                        <span style={{ fontSize: 10, color: 'var(--color-text-tertiary)' }}>{log.timestamp.split(' ')[1]}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
