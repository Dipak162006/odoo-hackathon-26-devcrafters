/* ── Mock Data for TransitOps ── */

export const MOCK_USER = {
  name: 'Rajesh Kumar',
  role: 'Fleet Manager',
  email: 'rajesh@transitops.io',
  avatar: 'RK',
};

export const DASHBOARD_STATS = [
  { id: 'vehicles', label: 'Total Vehicles', value: '248', trend: '+12', trendDir: 'up', period: 'vs last month', variant: 'primary' },
  { id: 'active-trips', label: 'Active Trips', value: '42', trend: '+8', trendDir: 'up', period: 'today', variant: 'info' },
  { id: 'drivers', label: 'Active Drivers', value: '186', trend: '-3', trendDir: 'down', period: 'vs yesterday', variant: 'success' },
  { id: 'fuel-cost', label: 'Fuel Cost', value: '₹4.2L', trend: '+5.2%', trendDir: 'up', period: 'this week', variant: 'warning' },
  { id: 'maintenance', label: 'Due Maintenance', value: '17', trend: '+4', trendDir: 'up', period: 'this week', variant: 'danger' },
  { id: 'revenue', label: 'Monthly Revenue', value: '₹28.5L', trend: '+14%', trendDir: 'up', period: 'vs last month', variant: 'success' },
];

export const VEHICLES = [
  { id: 'V-001', regNo: 'MH-12-AB-1234', type: 'Bus', make: 'Tata', model: 'Starbus', year: 2022, status: 'active', fuelType: 'Diesel', mileage: '45,230 km', driver: 'Anil Sharma', lastService: '2026-06-15', nextService: '2026-07-15', insurance: '2027-03-10' },
  { id: 'V-002', regNo: 'MH-12-CD-5678', type: 'Mini Bus', make: 'Ashok Leyland', model: 'Oyster', year: 2023, status: 'in-transit', fuelType: 'Diesel', mileage: '28,100 km', driver: 'Suresh Patil', lastService: '2026-06-20', nextService: '2026-07-20', insurance: '2027-05-22' },
  { id: 'V-003', regNo: 'MH-14-EF-9012', type: 'Van', make: 'Force', model: 'Traveller', year: 2021, status: 'maintenance', fuelType: 'Diesel', mileage: '67,500 km', driver: 'Unassigned', lastService: '2026-07-01', nextService: '2026-07-25', insurance: '2026-12-05' },
  { id: 'V-004', regNo: 'MH-04-GH-3456', type: 'Bus', make: 'Eicher', model: 'Skyline Pro', year: 2024, status: 'active', fuelType: 'CNG', mileage: '12,800 km', driver: 'Ravi Kumar', lastService: '2026-06-28', nextService: '2026-08-28', insurance: '2027-08-14' },
  { id: 'V-005', regNo: 'MH-12-IJ-7890', type: 'Bus', make: 'Tata', model: 'Ultra', year: 2023, status: 'idle', fuelType: 'Diesel', mileage: '38,900 km', driver: 'Unassigned', lastService: '2026-05-10', nextService: '2026-07-10', insurance: '2027-01-18' },
  { id: 'V-006', regNo: 'MH-03-KL-2345', type: 'SUV', make: 'Toyota', model: 'Innova', year: 2024, status: 'active', fuelType: 'Diesel', mileage: '8,400 km', driver: 'Manoj Singh', lastService: '2026-06-30', nextService: '2026-09-30', insurance: '2027-11-25' },
  { id: 'V-007', regNo: 'MH-12-MN-6789', type: 'Mini Bus', make: 'Ashok Leyland', model: 'MiTR', year: 2022, status: 'active', fuelType: 'Diesel', mileage: '52,100 km', driver: 'Prakash Joshi', lastService: '2026-07-05', nextService: '2026-08-05', insurance: '2026-09-30' },
  { id: 'V-008', regNo: 'MH-20-OP-1234', type: 'Bus', make: 'Tata', model: 'LP 913', year: 2020, status: 'inactive', fuelType: 'Diesel', mileage: '98,200 km', driver: 'Unassigned', lastService: '2026-03-15', nextService: 'Overdue', insurance: '2026-08-01' },
];

export const DRIVERS = [
  { id: 'D-001', name: 'Anil Sharma', phone: '+91 98765 43210', license: 'MH-DL-2022-4567', licenseExpiry: '2028-03-15', status: 'active', trips: 342, rating: 4.8, vehicle: 'MH-12-AB-1234', experience: '8 years', joinDate: '2019-04-10' },
  { id: 'D-002', name: 'Suresh Patil', phone: '+91 87654 32109', license: 'MH-DL-2021-8901', licenseExpiry: '2027-08-20', status: 'in-transit', trips: 278, rating: 4.6, vehicle: 'MH-12-CD-5678', experience: '6 years', joinDate: '2020-07-22' },
  { id: 'D-003', name: 'Ravi Kumar', phone: '+91 76543 21098', license: 'MH-DL-2023-2345', licenseExpiry: '2029-01-10', status: 'active', trips: 156, rating: 4.9, vehicle: 'MH-04-GH-3456', experience: '4 years', joinDate: '2022-01-15' },
  { id: 'D-004', name: 'Manoj Singh', phone: '+91 65432 10987', license: 'MH-DL-2020-6789', licenseExpiry: '2026-12-05', status: 'active', trips: 410, rating: 4.5, vehicle: 'MH-03-KL-2345', experience: '10 years', joinDate: '2017-09-03' },
  { id: 'D-005', name: 'Prakash Joshi', phone: '+91 54321 09876', license: 'MH-DL-2022-0123', licenseExpiry: '2028-06-30', status: 'active', trips: 290, rating: 4.7, vehicle: 'MH-12-MN-6789', experience: '7 years', joinDate: '2019-11-28' },
  { id: 'D-006', name: 'Vikas Yadav', phone: '+91 43210 98765', license: 'MH-DL-2021-4567', licenseExpiry: '2027-04-18', status: 'idle', trips: 198, rating: 4.3, vehicle: 'Unassigned', experience: '5 years', joinDate: '2021-03-14' },
];

export const TRIPS = [
  { id: 'T-001', route: 'Mumbai → Pune', vehicle: 'MH-12-AB-1234', driver: 'Anil Sharma', date: '2026-07-12', departure: '06:00', arrival: '10:30', status: 'completed', distance: '152 km', passengers: 42, revenue: '₹12,600' },
  { id: 'T-002', route: 'Pune → Nashik', vehicle: 'MH-12-CD-5678', driver: 'Suresh Patil', date: '2026-07-12', departure: '08:00', arrival: '–', status: 'in-transit', distance: '210 km', passengers: 38, revenue: '₹14,280' },
  { id: 'T-003', route: 'Mumbai → Goa', vehicle: 'MH-04-GH-3456', driver: 'Ravi Kumar', date: '2026-07-12', departure: '22:00', arrival: '–', status: 'pending', distance: '590 km', passengers: 44, revenue: '₹35,200' },
  { id: 'T-004', route: 'Pune → Mumbai', vehicle: 'MH-03-KL-2345', driver: 'Manoj Singh', date: '2026-07-11', departure: '14:00', arrival: '18:15', status: 'completed', distance: '152 km', passengers: 4, revenue: '₹3,200' },
  { id: 'T-005', route: 'Nashik → Aurangabad', vehicle: 'MH-12-MN-6789', driver: 'Prakash Joshi', date: '2026-07-11', departure: '07:30', arrival: '11:00', status: 'completed', distance: '190 km', passengers: 35, revenue: '₹11,400' },
  { id: 'T-006', route: 'Mumbai → Surat', vehicle: 'MH-12-AB-1234', driver: 'Anil Sharma', date: '2026-07-13', departure: '05:30', arrival: '–', status: 'pending', distance: '284 km', passengers: 40, revenue: '₹18,000' },
  { id: 'T-007', route: 'Pune → Kolhapur', vehicle: 'MH-12-IJ-7890', driver: 'Vikas Yadav', date: '2026-07-10', departure: '09:00', arrival: '14:00', status: 'cancelled', distance: '232 km', passengers: 0, revenue: '₹0' },
];

export const MAINTENANCE_RECORDS = [
  { id: 'M-001', vehicle: 'MH-14-EF-9012', type: 'Engine Overhaul', priority: 'high', status: 'in-progress', assignedTo: 'AutoCare Garage', scheduledDate: '2026-07-10', estimatedCost: '₹45,000', description: 'Complete engine overhaul due to unusual noise and power loss.' },
  { id: 'M-002', vehicle: 'MH-12-AB-1234', type: 'Oil Change', priority: 'medium', status: 'pending', assignedTo: 'Fleet Service Center', scheduledDate: '2026-07-15', estimatedCost: '₹3,500', description: 'Routine oil and filter change at 45,000 km interval.' },
  { id: 'M-003', vehicle: 'MH-12-IJ-7890', type: 'Brake Inspection', priority: 'high', status: 'pending', assignedTo: 'Speedfix Motors', scheduledDate: '2026-07-12', estimatedCost: '₹8,000', description: 'Front and rear brake pad replacement, disc inspection.' },
  { id: 'M-004', vehicle: 'MH-20-OP-1234', type: 'Full Service', priority: 'low', status: 'completed', assignedTo: 'AutoCare Garage', scheduledDate: '2026-07-05', estimatedCost: '₹12,000', description: 'Annual comprehensive vehicle inspection and service.' },
  { id: 'M-005', vehicle: 'MH-04-GH-3456', type: 'Tyre Replacement', priority: 'medium', status: 'pending', assignedTo: 'TyreMart', scheduledDate: '2026-07-18', estimatedCost: '₹24,000', description: 'Replace all 6 tyres with new radials.' },
];

export const FUEL_LOGS = [
  { id: 'F-001', vehicle: 'MH-12-AB-1234', driver: 'Anil Sharma', date: '2026-07-11', quantity: '120 L', rate: '₹89.50/L', totalCost: '₹10,740', odometer: '45,100 km', station: 'IOCL – Hinjewadi', fuelType: 'Diesel' },
  { id: 'F-002', vehicle: 'MH-12-CD-5678', driver: 'Suresh Patil', date: '2026-07-10', quantity: '95 L', rate: '₹89.50/L', totalCost: '₹8,502', odometer: '27,900 km', station: 'BPCL – Wakad', fuelType: 'Diesel' },
  { id: 'F-003', vehicle: 'MH-04-GH-3456', driver: 'Ravi Kumar', date: '2026-07-11', quantity: '40 kg', rate: '₹76.00/kg', totalCost: '₹3,040', odometer: '12,650 km', station: 'MNGL – Kothrud', fuelType: 'CNG' },
  { id: 'F-004', vehicle: 'MH-03-KL-2345', driver: 'Manoj Singh', date: '2026-07-09', quantity: '65 L', rate: '₹89.50/L', totalCost: '₹5,817', odometer: '8,200 km', station: 'HP – Baner', fuelType: 'Diesel' },
  { id: 'F-005', vehicle: 'MH-12-MN-6789', driver: 'Prakash Joshi', date: '2026-07-10', quantity: '110 L', rate: '₹89.50/L', totalCost: '₹9,845', odometer: '51,800 km', station: 'IOCL – Chinchwad', fuelType: 'Diesel' },
];

export const EXPENSES = [
  { id: 'E-001', category: 'Toll', vehicle: 'MH-12-AB-1234', amount: '₹1,250', date: '2026-07-11', submittedBy: 'Anil Sharma', status: 'approved', description: 'Mumbai-Pune Expressway toll charges' },
  { id: 'E-002', category: 'Parking', vehicle: 'MH-03-KL-2345', amount: '₹350', date: '2026-07-10', submittedBy: 'Manoj Singh', status: 'pending', description: 'Overnight parking at Pune station' },
  { id: 'E-003', category: 'Repair', vehicle: 'MH-14-EF-9012', amount: '₹4,500', date: '2026-07-08', submittedBy: 'Workshop', status: 'approved', description: 'Emergency radiator repair' },
  { id: 'E-004', category: 'Fine', vehicle: 'MH-12-IJ-7890', amount: '₹2,000', date: '2026-07-07', submittedBy: 'Vikas Yadav', status: 'rejected', description: 'Speeding fine on highway' },
  { id: 'E-005', category: 'Toll', vehicle: 'MH-12-CD-5678', amount: '₹800', date: '2026-07-12', submittedBy: 'Suresh Patil', status: 'pending', description: 'Pune-Nashik highway tolls' },
];

export const TRIP_CHART_DATA = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [{
    label: 'Trips Completed',
    data: [18, 24, 20, 28, 32, 22, 15],
    borderColor: '#0A6CFF',
    backgroundColor: 'rgba(10,108,255,0.08)',
    tension: 0.4,
    fill: true,
    pointBackgroundColor: '#0A6CFF',
    pointBorderColor: '#fff',
    pointBorderWidth: 2,
    pointRadius: 4,
    pointHoverRadius: 6,
  }],
};

export const FUEL_CHART_DATA = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  datasets: [{
    label: 'Fuel Cost (₹ Lakhs)',
    data: [3.2, 3.5, 3.8, 3.4, 4.0, 3.9, 4.2],
    backgroundColor: [
      'rgba(10,108,255,0.7)',
      'rgba(10,108,255,0.7)',
      'rgba(10,108,255,0.7)',
      'rgba(10,108,255,0.7)',
      'rgba(10,108,255,0.7)',
      'rgba(10,108,255,0.7)',
      'rgba(245,158,11,0.8)',
    ],
    borderRadius: 6,
    borderSkipped: false,
  }],
};

export const VEHICLE_STATUS_DATA = {
  labels: ['Active', 'In Transit', 'Maintenance', 'Idle', 'Inactive'],
  datasets: [{
    data: [142, 42, 17, 35, 12],
    backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#6B7280', '#EF4444'],
    borderWidth: 0,
    hoverOffset: 6,
  }],
};

export const REVENUE_CHART_DATA = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  datasets: [
    {
      label: 'Revenue',
      data: [22, 24, 21, 25, 27, 26, 28.5],
      borderColor: '#10B981',
      backgroundColor: 'rgba(16,185,129,0.08)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#10B981',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 4,
    },
    {
      label: 'Expenses',
      data: [18, 19, 17.5, 20, 21, 20.5, 22],
      borderColor: '#EF4444',
      backgroundColor: 'rgba(239,68,68,0.05)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#EF4444',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 4,
    },
  ],
};

export const RECENT_ACTIVITY = [
  { id: 1, text: 'Trip T-001 completed successfully (Mumbai → Pune)', time: '25 min ago', type: 'blue' },
  { id: 2, text: 'Maintenance alert: MH-14-EF-9012 engine overhaul in progress', time: '1 hr ago', type: 'yellow' },
  { id: 3, text: 'New driver Vikram Desai onboarded', time: '2 hrs ago', type: 'green' },
  { id: 4, text: 'Fuel log submitted by Anil Sharma (120L Diesel)', time: '3 hrs ago', type: 'blue' },
  { id: 5, text: 'Vehicle MH-20-OP-1234 marked inactive', time: '5 hrs ago', type: 'red' },
];

export const NOTIFICATIONS = [
  { id: 1, title: 'Maintenance Due', message: 'Vehicle MH-12-IJ-7890 brake inspection overdue by 2 days', type: 'warning', time: '10 min ago', read: false },
  { id: 2, title: 'Trip Completed', message: 'Trip T-001 Mumbai → Pune completed on time', type: 'success', time: '25 min ago', read: false },
  { id: 3, title: 'Insurance Expiring', message: 'Vehicle MH-20-OP-1234 insurance expires on Aug 1, 2026', type: 'danger', time: '1 hr ago', read: false },
  { id: 4, title: 'Expense Approved', message: 'Toll expense ₹1,250 for MH-12-AB-1234 approved', type: 'info', time: '2 hrs ago', read: true },
];
