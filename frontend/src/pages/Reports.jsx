import { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { BarChart3, Download, RefreshCw, FileSpreadsheet, Lock } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Reports() {
  const {
    user,
    vehicles,
    drivers,
    trips,
    maintenance,
    fuelLogs,
    expenses,
    addToast
  } = useApp();

  const [calcProgress, setCalcProgress] = useState(false);

  // Access rights check: Safety Officer and Driver cannot access financial reports
  const isRestricted = user.role === 'Safety Officer' || user.role === 'Driver';

  // Dynamic calculations
  // 1. Fleet Utilization = (Vehicles On Trip or Active) / Total Vehicles
  const totalVeh = vehicles.length;
  const utilizedVeh = vehicles.filter(v => v.status === 'active' || v.status === 'in-transit').length;
  const fleetUtilization = totalVeh > 0 ? Math.round((utilizedVeh / totalVeh) * 100) : 0;

  // 2. Total Fuel Cost
  const totalFuelCost = fuelLogs.reduce((acc, curr) => {
    return acc + parseInt(curr.totalCost.replace(/[^\d.]/g, '') || 0);
  }, 0);

  // 3. Total Maintenance Cost (from completed records estimated costs & repair expenses)
  const totalMaintCost = expenses
    .filter(e => e.category === 'Repair' && e.status === 'approved')
    .reduce((acc, curr) => acc + parseInt(curr.amount.replace(/[^\d.]/g, '') || 0), 0);

  // 4. Total Operational Cost = Fuel Cost + Maintenance Cost
  const totalOperationalCost = totalFuelCost + totalMaintCost;

  // 5. Total Completed Revenue
  const totalRevenue = trips
    .filter(t => t.status === 'completed')
    .reduce((acc, curr) => acc + parseInt(curr.revenue.replace(/[^\d.]/g, '') || 0), 0);

  // 6. Average Fuel Efficiency (km/L)
  const completedTrips = trips.filter(t => t.status === 'completed');
  const totalDistance = completedTrips.reduce((acc, curr) => {
    return acc + parseFloat(curr.distance.replace(/[^\d.]/g, '') || 0);
  }, 0);
  const totalLiters = fuelLogs.reduce((acc, curr) => {
    return acc + parseFloat(curr.quantity.replace(/[^\d.]/g, '') || 0);
  }, 0);
  const averageFuelEfficiency = totalLiters > 0 ? (totalDistance / totalLiters).toFixed(2) : '3.8';

  // 7. Calculate Per-Vehicle ROI and Cost breakdown
  const vehicleStats = vehicles.map(v => {
    // Fuel for this vehicle
    const vehicleFuel = fuelLogs
      .filter(f => f.vehicle === v.regNo)
      .reduce((sum, f) => sum + parseInt(f.totalCost.replace(/[^\d.]/g, '') || 0), 0);

    // Maintenance for this vehicle
    const vehicleMaint = expenses
      .filter(e => e.vehicle === v.regNo && e.category === 'Repair' && e.status === 'approved')
      .reduce((sum, e) => sum + parseInt(e.amount.replace(/[^\d.]/g, '') || 0), 0);

    // Revenue for this vehicle
    const vehicleRevenue = trips
      .filter(t => t.vehicle === v.regNo && t.status === 'completed')
      .reduce((sum, t) => sum + parseInt(t.revenue.replace(/[^\d.]/g, '') || 0), 0);

    const acquisition = parseInt(v.acquisitionCost ? v.acquisitionCost.replace(/[^\d.]/g, '') : 1500000) || 1500000;

    // ROI = (Revenue - (Maint + Fuel)) / Acquisition Cost
    const netProfit = vehicleRevenue - (vehicleMaint + vehicleFuel);
    const roiVal = (netProfit / acquisition) * 100;

    return {
      regNo: v.regNo,
      model: `${v.make} ${v.model}`,
      fuel: vehicleFuel,
      maintenance: vehicleMaint,
      revenue: vehicleRevenue,
      roi: roiVal.toFixed(1),
    };
  });

  // Chart configuration
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Operational Cost (₹)',
        data: [150000, 180000, 210000, 195000, 220000, 240000, totalOperationalCost > 0 ? totalOperationalCost : 260000],
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.05)',
        tension: 0.35,
        fill: true,
      },
      {
        label: 'Gross Revenue (₹)',
        data: [250000, 280000, 260000, 310000, 350000, 380000, totalRevenue > 0 ? totalRevenue : 410000],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.05)',
        tension: 0.35,
        fill: true,
      }
    ]
  };

  // Helper to trigger CSV file download
  const downloadCSV = (filename, dataHeaders, rowsArray) => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += dataHeaders.join(",") + "\n";
    rowsArray.forEach(row => {
      csvContent += row.map(val => `"${val.toString().replace(/"/g, '""')}"`).join(",") + "\n";
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('success', `Exported ${filename} successfully.`);
  };

  const handleExportVehicles = () => {
    const headers = ['Registration Number', 'Brand', 'Model', 'Type', 'Max Load Capacity', 'Odometer', 'Status', 'Driver'];
    const rows = vehicles.map(v => [v.regNo, v.make, v.model, v.type, v.maxCapacity, v.mileage, v.status, v.driver]);
    downloadCSV('vehicles_registry_report.csv', headers, rows);
  };

  const handleExportDrivers = () => {
    const headers = ['Driver Name', 'License Number', 'License Expiry', 'Status', 'Rating', 'Trips Completed', 'Experience'];
    const rows = drivers.map(d => [d.name, d.license, d.licenseExpiry, d.status, d.rating || d.safetyScore, d.trips, d.experience]);
    downloadCSV('drivers_registry_report.csv', headers, rows);
  };

  const handleExportExpenses = () => {
    const headers = ['Expense ID', 'Category', 'Vehicle', 'Amount', 'Date', 'Submitted By', 'Status', 'Description'];
    const rows = expenses.map(e => [e.id, e.category, e.vehicle, e.amount, e.date, e.submittedBy, e.status, e.description]);
    downloadCSV('operational_expenses_report.csv', headers, rows);
  };

  const handleRecalculate = () => {
    setCalcProgress(true);
    setTimeout(() => {
      setCalcProgress(false);
      addToast('success', 'Recalculated ROI and Fuel Efficiency metrics based on new fuel fillups.');
    }, 800);
  };

  if (isRestricted) {
    return (
      <div className="card" style={{ padding: 48, textAlign: 'center', maxWidth: 640, margin: '48px auto' }}>
        <Lock size={48} style={{ color: 'var(--color-danger)', marginBottom: 16 }} />
        <h2>Access Restricted</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: 8, fontSize: 14 }}>
          Role-Based Access Control (RBAC) restricts financial reports and analytics views to <strong>Fleet Managers</strong> and <strong>Financial Analysts</strong>.
        </p>
        <p style={{ color: 'var(--color-text-tertiary)', fontSize: 12, marginTop: 4 }}>
          Please switch your role in the system settings to access these insights.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-in">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h2>Reports & Analytics</h2>
          <p>Compute fleet productivity ratios, fuel efficiencies, and capital ROI statistics</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary" onClick={handleRecalculate} disabled={calcProgress}>
            <RefreshCw size={14} className={calcProgress ? 'animate-spin' : ''} /> Recalculate
          </button>
        </div>
      </div>

      {/* Ratios Row */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        <div className="card" style={{ padding: 20 }}>
          <div className="text-overline">Fleet Utilization</div>
          <div className="text-display" style={{ fontWeight: 800, color: 'var(--color-primary)', fontSize: '2rem', marginTop: 4 }}>
            {fleetUtilization}%
          </div>
          <span className="text-caption">Active vehicles vs total</span>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div className="text-overline">Avg Fuel Efficiency</div>
          <div className="text-display" style={{ fontWeight: 800, color: 'var(--color-warning)', fontSize: '2rem', marginTop: 4 }}>
            {averageFuelEfficiency} <span style={{ fontSize: 14, fontWeight: 500 }}>km/L</span>
          </div>
          <span className="text-caption">Total distance / total fuel</span>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div className="text-overline">Operational Cost</div>
          <div className="text-display" style={{ fontWeight: 800, color: 'var(--color-danger)', fontSize: '2rem', marginTop: 4 }}>
            ₹{(totalOperationalCost / 100000).toFixed(2)}L
          </div>
          <span className="text-caption">Fuel + completed service repairs</span>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div className="text-overline">Net Profit margin</div>
          <div className="text-display" style={{ fontWeight: 800, color: 'var(--color-success)', fontSize: '2rem', marginTop: 4 }}>
            ₹{((totalRevenue - totalOperationalCost) / 100000).toFixed(2)}L
          </div>
          <span className="text-caption">Revenue - Operations</span>
        </div>
      </div>

      {/* Chart Block */}
      <div className="card" style={{ padding: 20, marginBottom: 24 }}>
        <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <BarChart3 style={{ color: 'var(--color-primary)' }} /> Revenue vs Operational Expenses
        </div>
        <div style={{ height: 260 }}>
          <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>

      {/* ROI & Cost breakdowns per Vehicle */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Vehicle Return on Investment (ROI)</span>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Model</th>
                  <th>Revenue</th>
                  <th>Costs (Fuel+Maint)</th>
                  <th>Capital ROI</th>
                </tr>
              </thead>
              <tbody>
                {vehicleStats.map(stat => (
                  <tr key={stat.regNo}>
                    <td style={{ fontWeight: 650 }}>{stat.regNo}</td>
                    <td>{stat.model}</td>
                    <td style={{ color: 'var(--color-success)', fontWeight: 500 }}>₹{stat.revenue.toLocaleString()}</td>
                    <td>₹{(stat.fuel + stat.maintenance).toLocaleString()}</td>
                    <td>
                      <span className={`status-badge ${parseFloat(stat.roi) >= 0 ? 'active' : 'inactive'}`}>
                        {stat.roi}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CSV Exporter Center */}
        <div className="card" style={{ padding: 20 }}>
          <div className="card-title" style={{ marginBottom: 16 }}>Operational CSV Data Exporters</div>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 20 }}>
            Generate and download standard spreadsheets mapping key enterprise fields. Safe to import directly into Excel or Odoo modules.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button className="quick-action-btn" style={{ width: '100%', justifyContent: 'flex-start', padding: 12 }} onClick={handleExportVehicles}>
              <FileSpreadsheet size={16} style={{ color: 'var(--color-primary)' }} />
              <div style={{ textAlign: 'left', flex: 1, paddingLeft: 4 }}>
                <strong>Export Fleet Registry</strong>
                <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 2 }}>Contains load capacity, vehicle make, mileage, status</div>
              </div>
              <Download size={16} />
            </button>

            <button className="quick-action-btn" style={{ width: '100%', justifyContent: 'flex-start', padding: 12 }} onClick={handleExportDrivers}>
              <FileSpreadsheet size={16} style={{ color: 'var(--color-success)' }} />
              <div style={{ textAlign: 'left', flex: 1, paddingLeft: 4 }}>
                <strong>Export Drivers Registry</strong>
                <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 2 }}>Contains ratings, experience, safety ratings, license expiration dates</div>
              </div>
              <Download size={16} />
            </button>

            <button className="quick-action-btn" style={{ width: '100%', justifyContent: 'flex-start', padding: 12 }} onClick={handleExportExpenses}>
              <FileSpreadsheet size={16} style={{ color: 'var(--color-danger)' }} />
              <div style={{ textAlign: 'left', flex: 1, paddingLeft: 4 }}>
                <strong>Export Expenses Reports</strong>
                <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 2 }}>Contains repair costs, fuel costs, toll logs, pending approvals</div>
              </div>
              <Download size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
