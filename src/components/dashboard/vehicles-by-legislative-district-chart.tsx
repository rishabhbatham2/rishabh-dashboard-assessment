'use client';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, LabelList } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useVehicleData } from '@/lib/vehicle-data-provider';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo } from 'react';
import { Vehicle } from '@/lib/data';

const CustomTooltip = ({ active, payload, label, allVehicles }: { active?: boolean, payload?: any[], label?: string, allVehicles: Vehicle[] }) => {
  if (active && payload && payload.length && allVehicles) {
    const districtNumber = parseInt(label!.replace('District ', ''));
    
    const vehiclesInDistrict = allVehicles.filter((v: any) => v.legislativeDistrict === districtNumber);
    
    const topMakes = vehiclesInDistrict.reduce((acc: any, v: any) => {
      if (!v.make) return acc;
      acc[v.make] = (acc[v.make] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sortedMakes = Object.entries(topMakes)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 3);

    return (
      <div className="p-3 text-xs bg-background border rounded-lg shadow-lg max-w-xs">
        <p className="font-bold text-sm mb-2">{`${label}: ${payload[0].value.toLocaleString()} vehicles`}</p>
        <p className="font-semibold">Top 3 Makes:</p>
        <ul className="mt-1 space-y-1">
          {sortedMakes.map(([make, count]) => (
            <li key={make} className="flex justify-between">
              <span>{make}</span>
              <span className="font-semibold">{ (count as number).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return null;
};


export default function VehiclesByLegislativeDistrictChart() {
  const { vehicles, loading } = useVehicleData();

  const data = useMemo(() => {
    const districtCounts = vehicles.reduce((acc, vehicle) => {
      const district = vehicle.legislativeDistrict;
      if (!district || district === 0) return acc;
      acc[district] = (acc[district] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(districtCounts).map(district => ({
      name: `District ${district}`,
      count: districtCounts[district],
    })).sort((a, b) => b.count - a.count).slice(0, 15);
  }, [vehicles]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicles by Legislative District</CardTitle>
        <CardDescription>Top 15 districts with the most registered EVs.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[350px] w-full">
            <Skeleton className="h-full w-full" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data} layout="vertical" margin={{ left: 35 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={80} interval={0} />
              <Tooltip
                content={<CustomTooltip allVehicles={vehicles} />}
                cursor={{ fill: 'hsl(var(--muted))' }}
              />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]}>
                <LabelList dataKey="count" position="right" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
