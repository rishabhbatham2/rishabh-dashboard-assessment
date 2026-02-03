'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import VehiclesByYearChart from '@/components/dashboard/vehicles-by-year-chart';
import { VehicleDataProvider } from '@/lib/vehicle-data-provider';
import { Skeleton } from '@/components/ui/skeleton';
import SummaryStats from '@/components/dashboard/summary-stats';
import { DataTable } from '@/components/table/data-table';
import VehiclesByModelPieChart from '@/components/dashboard/vehicles-by-model-pie-chart';
import VehiclesByMakePieChart from '@/components/dashboard/vehicles-by-make-pie-chart';
import VehiclesByLegislativeDistrictChart from '@/components/dashboard/vehicles-by-legislative-district-chart';
import ElectricRangeChart from '@/components/dashboard/electric-range-chart';
import DashboardLayoutManager, { type ChartVisibility } from '@/components/dashboard/dashboard-layout-manager';
import { useLayout } from '@/context/layout-context';
import CafvEligibilityChart from '@/components/dashboard/cafv-eligibility-chart';
import BaseMsrpChart from '@/components/dashboard/base-msrp-chart';

const DynamicWashingtonVectorMap = dynamic(
  () => import('@/components/dashboard/washington-vector-map'),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[492px] w-full rounded-lg" />,
  }
);

const DynamicCountyChoroplethMap = dynamic(
  () => import('@/components/dashboard/county-choropleth-map'),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[492px] w-full rounded-lg" />,
  }
);

const chartNames: Record<keyof ChartVisibility, string> = {
    vehiclesByYear: 'Vehicles by Year',
    vehiclesByLegislativeDistrict: 'Vehicles by Legislative District',
    vehiclesByMake: 'Vehicles by Make',
    vehiclesByModel: 'Vehicles by Model',
    electricRange: 'Electric Range Distribution',
    washingtonMap: 'EV Locations (Individual Dots)',
    countyChoroplethMap: 'EV Registrations by County (Choropleth)',
    cafvEligibility: 'CAFV Eligibility',
    baseMsrp: 'Base MSRP Distribution',
};

const initialVisibility: ChartVisibility = {
    vehiclesByYear: true,
    vehiclesByLegislativeDistrict: true,
    vehiclesByMake: true,
    vehiclesByModel: true,
    electricRange: true,
    washingtonMap: true,
    countyChoroplethMap: true,
    cafvEligibility: true,
    baseMsrp: true,
};

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [chartVisibility, setChartVisibility] = useState<ChartVisibility>(initialVisibility);
  const { setHeaderActions } = useLayout();
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if(isMounted) {
        setHeaderActions(
            <DashboardLayoutManager 
                visibility={chartVisibility}
                onVisibilityChange={setChartVisibility}
                chartNames={chartNames}
            />
        );
    }

    return () => {
      setHeaderActions(null)
    };
  }, [isMounted, chartVisibility, setChartVisibility, setHeaderActions]);

  return (
    <VehicleDataProvider>
      {!isMounted ? (
         <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold">Greetings! 👋</h1>
                    <p className="text-sm text-muted-foreground">Here is your electric vehicle dashboard.</p>
                </div>
            </div>
            <SummaryStats />
            <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
              <Skeleton className="h-[422px] w-full rounded-lg" />
              <Skeleton className="h-[422px] w-full rounded-lg" />
            </div>
             <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
              <Skeleton className="h-[422px] w-full rounded-lg" />
              <Skeleton className="h-[422px] w-full rounded-lg" />
            </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">Greetings! 👋</h1>
              <p className="text-sm text-muted-foreground">Here is your electric vehicle dashboard.</p>
            </div>
          </div>

          <SummaryStats />

          <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
            {chartVisibility.vehiclesByYear && <VehiclesByYearChart />}
            {chartVisibility.vehiclesByLegislativeDistrict && <VehiclesByLegislativeDistrictChart />}
          </div>
          
          <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
            {chartVisibility.vehiclesByMake && <VehiclesByMakePieChart />}
            {chartVisibility.vehiclesByModel && <VehiclesByModelPieChart />}
          </div>

          <div className="grid gap-8 md:grid-cols-1">
            {chartVisibility.electricRange && <ElectricRangeChart />}
          </div>

          <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
            {chartVisibility.cafvEligibility && <CafvEligibilityChart />}
            {chartVisibility.baseMsrp && <BaseMsrpChart />}
          </div>

          <div className="grid gap-8 md:grid-cols-1">
            {chartVisibility.washingtonMap && <DynamicWashingtonVectorMap />}
          </div>

          <div className="grid gap-8 md:grid-cols-1">
             {chartVisibility.countyChoroplethMap && <DynamicCountyChoroplethMap />}
          </div>
          
          <DataTable />
        </div>
      )}
    </VehicleDataProvider>
  );
}
