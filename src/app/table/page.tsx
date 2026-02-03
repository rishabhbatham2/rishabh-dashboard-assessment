'use client';

import { VehicleDataProvider } from '@/lib/vehicle-data-provider';
import { DataTable } from '@/components/table/data-table';
import SummaryStats from '@/components/dashboard/summary-stats';

export default function TablePage() {
  return (
    <VehicleDataProvider>
      <div className="space-y-8">
        <SummaryStats />
        <DataTable />
      </div>
    </VehicleDataProvider>
  );
}
