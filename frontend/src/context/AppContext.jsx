import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import * as mock from '../data/mockData';

const AppContext = createContext(null);

const ROLE_USERS = {
  'Fleet Manager': {
    name: 'Rajesh Kumar',
    role: 'Fleet Manager',
    email: 'rajesh@transitops.io',
    avatar: 'RK',
  },
  'Driver': {
    name: 'Anil Sharma',
    role: 'Driver',
    email: 'anil.sharma@transitops.io',
    avatar: 'AS',
  },
  'Safety Officer': {
    name: 'Sarah Jenkins',
    role: 'Safety Officer',
    email: 'sarah.j@transitops.io',
    avatar: 'SJ',
  },
  'Financial Analyst': {
    name: 'Amit Patel',
    role: 'Financial Analyst',
    email: 'amit.p@transitops.io',
    avatar: 'AP',
  },
};

export function AppProvider({ children }) {
  // Sidebar State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Active Role / User State
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('transitops_user');
    return saved ? JSON.parse(saved) : ROLE_USERS['Fleet Manager'];
  });

  // DB Entities States
  const [vehicles, setVehicles] = useState(() => {
    const saved = localStorage.getItem('transitops_vehicles');
    return saved ? JSON.parse(saved) : mock.VEHICLES;
  });

  const [drivers, setDrivers] = useState(() => {
    const saved = localStorage.getItem('transitops_drivers');
    return saved ? JSON.parse(saved) : mock.DRIVERS;
  });

  const [trips, setTrips] = useState(() => {
    const saved = localStorage.getItem('transitops_trips');
    return saved ? JSON.parse(saved) : mock.TRIPS;
  });

  const [maintenance, setMaintenance] = useState(() => {
    const saved = localStorage.getItem('transitops_maintenance');
    return saved ? JSON.parse(saved) : mock.MAINTENANCE_RECORDS;
  });

  const [fuelLogs, setFuelLogs] = useState(() => {
    const saved = localStorage.getItem('transitops_fuel_logs');
    return saved ? JSON.parse(saved) : mock.FUEL_LOGS;
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('transitops_expenses');
    return saved ? JSON.parse(saved) : mock.EXPENSES;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('transitops_notifications');
    return saved ? JSON.parse(saved) : mock.NOTIFICATIONS;
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('transitops_audit_logs');
    if (saved) return JSON.parse(saved);
    
    // Seed initial audit logs
    return [
      { id: 1, action: 'Platform initialized', user: 'System', timestamp: '2026-07-12 08:00:00', details: 'Initialized data from configuration' },
      { id: 2, action: 'Role changed', user: 'System', timestamp: '2026-07-12 08:05:00', details: 'Rajesh Kumar logged in as Fleet Manager' }
    ];
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('transitops_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('transitops_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem('transitops_drivers', JSON.stringify(drivers));
  }, [drivers]);

  useEffect(() => {
    localStorage.setItem('transitops_trips', JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    localStorage.setItem('transitops_maintenance', JSON.stringify(maintenance));
  }, [maintenance]);

  useEffect(() => {
    localStorage.setItem('transitops_fuel_logs', JSON.stringify(fuelLogs));
  }, [fuelLogs]);

  useEffect(() => {
    localStorage.setItem('transitops_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('transitops_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('transitops_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);


  // Toast API
  const addToast = useCallback((type, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);


  // Audit Logger Helper
  const logAction = useCallback((action, details) => {
    const newLog = {
      id: Date.now(),
      action,
      user: user.name,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      details,
    };
    setAuditLogs(prev => [newLog, ...prev]);
  }, [user]);

  // Sidebar Toggles
  const toggleSidebar = useCallback(() => setSidebarCollapsed(prev => !prev), []);
  const toggleMobileSidebar = useCallback(() => setSidebarMobileOpen(prev => !prev), []);

  // Switch Simulated Roles (RBAC Demonstration)
  const switchRole = useCallback((roleName) => {
    const newUser = ROLE_USERS[roleName];
    if (newUser) {
      setUser(newUser);
      logAction('Role changed', `Switched to role: ${roleName}`);
      addToast('success', `Switched to ${roleName} mode.`);
    }
  }, [addToast, logAction]);

  // Notification Operations
  const markNotificationRead = useCallback((id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const addNotification = useCallback((title, message, type) => {
    const newNotif = {
      id: Date.now(),
      title,
      message,
      type,
      time: 'Just now',
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
    addToast(type === 'danger' ? 'error' : type, `${title}: ${message}`);
  }, [addToast]);

  // --- CRUD ACTIONS & BUSINESS RULES ---

  // Vehicles
  const addVehicle = useCallback((vehicleData) => {
    // Unique check
    const isDuplicate = vehicles.some(v => v.regNo.toLowerCase() === vehicleData.regNo.toLowerCase());
    if (isDuplicate) {
      addToast('error', `Registration number ${vehicleData.regNo} already exists.`);
      return false;
    }
    const newVehicle = {
      id: `V-00${vehicles.length + 1}`,
      ...vehicleData,
      status: 'active',
      mileage: '0 km',
      lastService: new Date().toISOString().split('T')[0],
      nextService: 'Not scheduled',
    };
    setVehicles(prev => [...prev, newVehicle]);
    logAction('Register Vehicle', `Registered vehicle ${newVehicle.regNo} (${newVehicle.make} ${newVehicle.model})`);
    addToast('success', `Vehicle ${newVehicle.regNo} registered successfully.`);
    return true;
  }, [vehicles, addToast, logAction]);

  const updateVehicle = useCallback((updatedVehicle) => {
    setVehicles(prev => prev.map(v => v.id === updatedVehicle.id ? updatedVehicle : v));
    logAction('Update Vehicle', `Updated vehicle details for ${updatedVehicle.regNo}`);
    addToast('success', `Vehicle ${updatedVehicle.regNo} details updated.`);
    return true;
  }, [addToast, logAction]);

  // Drivers
  const addDriver = useCallback((driverData) => {
    const newDriver = {
      id: `D-00${drivers.length + 1}`,
      ...driverData,
      status: 'active',
      trips: 0,
      rating: 5.0,
      vehicle: 'Unassigned',
      joinDate: new Date().toISOString().split('T')[0],
    };
    setDrivers(prev => [...prev, newDriver]);
    logAction('Onboard Driver', `Onboarded driver ${newDriver.name}`);
    addToast('success', `Driver ${newDriver.name} onboarded successfully.`);
    return true;
  }, [drivers, addToast, logAction]);

  const updateDriver = useCallback((updatedDriver) => {
    setDrivers(prev => prev.map(d => d.id === updatedDriver.id ? updatedDriver : d));
    logAction('Update Driver', `Updated driver profile for ${updatedDriver.name}`);
    addToast('success', `Driver ${updatedDriver.name} profile updated.`);
    return true;
  }, [addToast, logAction]);

  // Trips & Scheduling
  const dispatchTrip = useCallback((tripData) => {
    // 1. Cargo weight check
    const vehicleObj = vehicles.find(v => v.regNo === tripData.vehicle);
    if (!vehicleObj) {
      addToast('error', `Selected vehicle not found.`);
      return false;
    }
    const maxCapacity = parseFloat(vehicleObj.maxCapacity || 5000); // default to 5000kg
    const cargoWeight = parseFloat(tripData.cargoWeight);
    if (cargoWeight > maxCapacity) {
      addToast('error', `Dispatch rejected: Cargo weight (${cargoWeight} kg) exceeds vehicle capacity (${maxCapacity} kg).`);
      return false;
    }

    // 2. Driver license check
    const driverObj = drivers.find(d => d.name === tripData.driver);
    if (!driverObj) {
      addToast('error', `Selected driver not found.`);
      return false;
    }
    const isExpired = new Date(driverObj.licenseExpiry) < new Date();
    if (isExpired) {
      addToast('error', `Dispatch rejected: Driver ${driverObj.name} has an expired driving license.`);
      return false;
    }
    if (driverObj.status === 'suspended') {
      addToast('error', `Dispatch rejected: Driver ${driverObj.name} is currently suspended.`);
      return false;
    }

    // 3. Driver & Vehicle availability check
    if (vehicleObj.status === 'in-transit' || vehicleObj.status === 'maintenance' || vehicleObj.status === 'retired') {
      addToast('error', `Dispatch rejected: Vehicle status is '${vehicleObj.status}'`);
      return false;
    }
    if (driverObj.status === 'in-transit' || driverObj.status === 'suspended') {
      addToast('error', `Dispatch rejected: Driver status is '${driverObj.status}'`);
      return false;
    }

    // Process Trip Creation
    const newTrip = {
      id: `T-00${trips.length + 1}`,
      ...tripData,
      date: new Date().toISOString().split('T')[0],
      status: 'in-transit',
      arrival: '–',
    };

    // Update statuses to "in-transit" / "On Trip"
    setVehicles(prev => prev.map(v => v.id === vehicleObj.id ? { ...v, status: 'in-transit', driver: driverObj.name } : v));
    setDrivers(prev => prev.map(d => d.id === driverObj.id ? { ...d, status: 'in-transit', vehicle: vehicleObj.regNo } : d));
    setTrips(prev => [newTrip, ...prev]);

    logAction('Dispatch Trip', `Dispatched Trip ${newTrip.id} (${newTrip.route}) with vehicle ${newTrip.vehicle} and driver ${newTrip.driver}`);
    addToast('success', `Trip ${newTrip.id} dispatched! Vehicle and driver status set to On Trip.`);
    return true;
  }, [trips, vehicles, drivers, addToast, logAction]);

  const completeTrip = useCallback((tripId, finalOdometer, fuelConsumedLiters, fuelCost) => {
    const tripObj = trips.find(t => t.id === tripId);
    if (!tripObj) return false;

    // Change status back to available
    setVehicles(prev => prev.map(v => {
      if (v.regNo === tripObj.vehicle) {
        return {
          ...v,
          status: 'active',
          mileage: `${finalOdometer} km`,
        };
      }
      return v;
    }));

    setDrivers(prev => prev.map(d => {
      if (d.name === tripObj.driver) {
        return {
          ...d,
          status: 'active',
          trips: d.trips + 1,
        };
      }
      return d;
    }));

    setTrips(prev => prev.map(t => t.id === tripId ? { ...t, status: 'completed', arrival: new Date().toLocaleTimeString().substring(0, 5) } : t));

    // Log Fuel consumed automatically if logged
    if (fuelConsumedLiters && fuelCost) {
      const newFuelLog = {
        id: `F-00${fuelLogs.length + 1}`,
        vehicle: tripObj.vehicle,
        driver: tripObj.driver,
        date: new Date().toISOString().split('T')[0],
        quantity: `${fuelConsumedLiters} L`,
        rate: `₹${(fuelCost / fuelConsumedLiters).toFixed(2)}/L`,
        totalCost: `₹${fuelCost}`,
        odometer: `${finalOdometer} km`,
        station: 'Auto-logged from completed trip',
        fuelType: 'Diesel',
      };
      setFuelLogs(prev => [newFuelLog, ...prev]);
    }

    logAction('Complete Trip', `Completed Trip ${tripId}. Driver and vehicle marked Available. Odo: ${finalOdometer} km`);
    addToast('success', `Trip ${tripId} completed successfully.`);
    return true;
  }, [trips, fuelLogs, addToast, logAction]);

  const cancelTrip = useCallback((tripId) => {
    const tripObj = trips.find(t => t.id === tripId);
    if (!tripObj) return false;

    setVehicles(prev => prev.map(v => v.regNo === tripObj.vehicle ? { ...v, status: 'active' } : v));
    setDrivers(prev => prev.map(d => d.name === tripObj.driver ? { ...d, status: 'active' } : d));
    setTrips(prev => prev.map(t => t.id === tripId ? { ...t, status: 'cancelled' } : t));

    logAction('Cancel Trip', `Cancelled Trip ${tripId}. Restored driver and vehicle to Available.`);
    addToast('info', `Trip ${tripId} has been cancelled.`);
    return true;
  }, [trips, addToast, logAction]);

  // Maintenance Records
  const scheduleMaintenance = useCallback((maintData) => {
    const vehicleObj = vehicles.find(v => v.regNo === maintData.vehicle);
    if (!vehicleObj) return false;

    const newRecord = {
      id: `M-00${maintenance.length + 1}`,
      ...maintData,
      status: 'in-progress',
      scheduledDate: new Date().toISOString().split('T')[0],
    };

    // Automatically set vehicle to In Shop (maintenance status)
    setVehicles(prev => prev.map(v => v.id === vehicleObj.id ? { ...v, status: 'maintenance' } : v));
    setMaintenance(prev => [newRecord, ...prev]);

    logAction('Schedule Maintenance', `Scheduled ${newRecord.type} for vehicle ${newRecord.vehicle}. Status updated to In Shop.`);
    addToast('warning', `Vehicle ${newRecord.vehicle} sent to shop for ${newRecord.type}.`);
    return true;
  }, [maintenance, vehicles, addToast, logAction]);

  const completeMaintenance = useCallback((maintId, actualCost) => {
    const maintObj = maintenance.find(m => m.id === maintId);
    if (!maintObj) return false;

    // Restore vehicle to Available (unless retired)
    setVehicles(prev => prev.map(v => {
      if (v.regNo === maintObj.vehicle) {
        return {
          ...v,
          status: 'active',
          lastService: new Date().toISOString().split('T')[0],
        };
      }
      return v;
    }));

    setMaintenance(prev => prev.map(m => m.id === maintId ? { ...m, status: 'completed', estimatedCost: `₹${actualCost}` } : m));

    // Automatically log this maintenance cost as an Expense
    const newExpense = {
      id: `E-00${expenses.length + 1}`,
      category: 'Repair',
      vehicle: maintObj.vehicle,
      amount: `₹${actualCost}`,
      date: new Date().toISOString().split('T')[0],
      submittedBy: 'Workshop Manager',
      status: 'approved',
      description: `${maintObj.type} - Completed repair work`,
    };
    setExpenses(prev => [newExpense, ...prev]);

    logAction('Complete Maintenance', `Completed service for ${maintObj.vehicle}. Restored status to Available.`);
    addToast('success', `Maintenance ${maintId} completed. Costs logged.`);
    return true;
  }, [maintenance, expenses, addToast, logAction]);

  // Fuel Logs
  const logFuel = useCallback((fuelData) => {
    const newLog = {
      id: `F-00${fuelLogs.length + 1}`,
      ...fuelData,
      date: new Date().toISOString().split('T')[0],
    };
    setFuelLogs(prev => [newLog, ...prev]);

    // Update vehicle odometer
    setVehicles(prev => prev.map(v => {
      if (v.regNo === fuelData.vehicle) {
        return { ...v, mileage: fuelData.odometer };
      }
      return v;
    }));

    // Auto-create associated expense for tracking
    const numericCost = fuelData.totalCost.replace(/[^\d.]/g, '');
    const newExpense = {
      id: `E-00${expenses.length + 1}`,
      category: 'Fuel',
      vehicle: fuelData.vehicle,
      amount: `₹${numericCost}`,
      date: new Date().toISOString().split('T')[0],
      submittedBy: fuelData.driver,
      status: 'approved', // Auto-approved for fuel
      description: `Fuel fill: ${fuelData.quantity} at ${fuelData.station}`,
    };
    setExpenses(prev => [newExpense, ...prev]);

    logAction('Log Fuel', `Logged ${fuelData.quantity} of fuel for vehicle ${fuelData.vehicle}`);
    addToast('success', `Fuel log saved & cost tracked.`);
    return true;
  }, [fuelLogs, expenses, addToast, logAction]);

  // Expenses
  const addExpense = useCallback((expenseData) => {
    const newExpense = {
      id: `E-00${expenses.length + 1}`,
      ...expenseData,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
    };
    setExpenses(prev => [newExpense, ...prev]);
    logAction('Submit Expense', `Submitted expense for ${newExpense.category} - ${newExpense.amount}`);
    addToast('success', `Expense report submitted and is pending approval.`);
    return true;
  }, [expenses, addToast, logAction]);

  const updateExpenseStatus = useCallback((expenseId, newStatus) => {
    setExpenses(prev => prev.map(e => e.id === expenseId ? { ...e, status: newStatus } : e));
    logAction('Approve/Reject Expense', `${newStatus === 'approved' ? 'Approved' : 'Rejected'} expense ${expenseId}`);
    addToast(newStatus === 'approved' ? 'success' : 'info', `Expense report ${expenseId} was ${newStatus}.`);
  }, [addToast, logAction]);


  const unreadCount = notifications.filter(n => !n.read).length;

  const value = {
    // UI states
    sidebarCollapsed,
    sidebarMobileOpen,
    toggleSidebar,
    toggleMobileSidebar,
    toasts,
    addToast,
    removeToast,
    
    // Auth / RBAC states
    user,
    switchRole,
    
    // DB tables
    vehicles,
    drivers,
    trips,
    maintenance,
    fuelLogs,
    expenses,
    notifications,
    auditLogs,
    unreadCount,
    markNotificationRead,
    addNotification,

    // CRUD actions
    addVehicle,
    updateVehicle,
    addDriver,
    updateDriver,
    dispatchTrip,
    completeTrip,
    cancelTrip,
    scheduleMaintenance,
    completeMaintenance,
    logFuel,
    addExpense,
    updateExpenseStatus,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
