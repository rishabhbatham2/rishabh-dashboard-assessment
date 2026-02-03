'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Papa from 'papaparse';
import { Vehicle } from './data';

interface VehicleDataContextType {
  vehicles: Vehicle[];
  loading: boolean;
  error: string | null;
}

const VehicleDataContext = createContext<VehicleDataContextType | undefined>(undefined);

export function VehicleDataProvider({ children }: { children: ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/data/projects.csv');
        if (!response.ok) {
          throw new Error('Failed to fetch vehicle data from /data/projects.csv');
        }
        const csvText = await response.text();
        
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const parsedData = results.data as any[];
            const typedVehicles: Vehicle[] = parsedData.map(d => ({
              vin: d['VIN (1-10)'],
              county: d.County,
              city: d.City,
              state: d.State,
              postalCode: parseInt(d['Postal Code'], 10) || 0,
              modelYear: parseInt(d['Model Year'], 10) || 0,
              make: d.Make,
              model: d.Model,
              electricVehicleType: d['Electric Vehicle Type'],
              cafvEligibility: d['Clean Alternative Fuel Vehicle (CAFV) Eligibility'],
              electricRange: parseInt(d['Electric Range'], 10) || 0,
              baseMsrp: parseInt(d['Base MSRP'], 10) || 0,
              legislativeDistrict: parseInt(d['Legislative District'], 10) || 0,
              dolVehicleId: parseInt(d['DOL Vehicle ID'], 10) || 0,
              vehicleLocation: d['Vehicle Location'],
              electricUtility: d['Electric Utility'],
              censusTract: parseInt(d['2020 Census Tract'], 10) || 0,
            }));
            setVehicles(typedVehicles);
            setLoading(false);
          },
          error: (err: any) => {
            setError(err.message);
            setLoading(false);
          }
        });
      } catch (e: any) {
        setError(e.message);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <VehicleDataContext.Provider value={{ vehicles, loading, error }}>
      {children}
    </VehicleDataContext.Provider>
  );
}

export function useVehicleData() {
  const context = useContext(VehicleDataContext);
  if (context === undefined) {
    throw new Error('useVehicleData must be used within a VehicleDataProvider');
  }
  return context;
}
