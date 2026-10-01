import React, { createContext, useContext, useState, useEffect } from 'react';
import { warehouseService } from '../services/warehouseService';
import { itemService } from '../services/itemService';
import { vehicleService } from '../services/vehicleService';
import { driverService } from '../services/driverService';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [warehouses, setWarehouses] = useState([]);
  const [items, setItems] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshAllData = async () => {
    setLoading(true);
    try {
      const [whData, itemData, vehData, drvData] = await Promise.all([
        warehouseService.getAll().catch(() => []),
        itemService.getAll().catch(() => []),
        vehicleService.getAll().catch(() => []),
        driverService.getAll().catch(() => []),
      ]);
      setWarehouses(whData);
      setItems(itemData);
      setVehicles(vehData);
      setDrivers(drvData);
      setError(null);
    } catch (err) {
      console.error('Failed to load global application data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  const value = {
    warehouses,
    items,
    vehicles,
    drivers,
    loading,
    error,
    refreshAllData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
