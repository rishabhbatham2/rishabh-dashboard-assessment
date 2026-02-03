'use client';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, LabelList } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useVehicleData } from '@/lib/vehicle-data-provider';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo } from 'react';

export default function VehiclesByCountyChart() {
  const { vehicles, loading } = useVehicleData();

  const dataByCounty = useMemo(() => {
    const countyCounts = vehicles.reduce((acc, vehicle) => {
      const county = vehicle.county;
      if (!county) return acc;
      acc[county] = (acc[county] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(countyCounts).map(county => ({
      name: county,
      count: countyCounts[county],
    })).sort((a, b) => b.count - a.count).slice(0, 10); // top 10
  }, [vehicles]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicles by County</CardTitle>
        <CardDescription>Top 10 counties with the most registered EVs.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[350px] w-full">
            <Skeleton className="h-full w-full" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={dataByCounty} layout="vertical" margin={{ left: 25 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={80} interval={0} />
              <Tooltip
                  contentStyle={{
                      background: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 'var(--radius)'
                  }}
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
