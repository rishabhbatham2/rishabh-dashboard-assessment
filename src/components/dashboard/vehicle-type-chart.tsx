'use client';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useVehicleData } from '@/lib/vehicle-data-provider';
import { Skeleton } from '@/components/ui/skeleton';

export default function VehicleTypeChart() {
  const { vehicles, loading } = useVehicleData();

  const dataByType = vehicles.reduce((acc, vehicle) => {
    if (!vehicle.electricVehicleType) return acc;
    const type = vehicle.electricVehicleType === 'Battery Electric Vehicle (BEV)' ? 'BEV' : 'PHEV';
    const existing = acc.find((item) => item.name === type);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ name: type, count: 1 });
    }
    return acc;
  }, [] as { name: string; count: number }[]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle Types</CardTitle>
        <CardDescription>Distribution of BEV vs. PHEV.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[300px] w-full">
            <Skeleton className="h-full w-full" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataByType}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip
                  contentStyle={{
                      background: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 'var(--radius)'
                  }}
              />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
