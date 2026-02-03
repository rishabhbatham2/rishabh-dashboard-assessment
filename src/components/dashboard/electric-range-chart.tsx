'use client';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useVehicleData } from '@/lib/vehicle-data-provider';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo } from 'react';

export default function ElectricRangeChart() {
  const { vehicles, loading } = useVehicleData();

  const data = useMemo(() => {
    if (loading || vehicles.length === 0) return [];
    
    const ranges = vehicles
        .map(v => v.electricRange)
        .filter(range => range > 0);

    if (ranges.length === 0) return [];

    const maxRange = Math.max(...ranges);
    const binSize = 50;
    const binCount = Math.ceil(maxRange / binSize);

    const bins = Array.from({ length: binCount }, (_, i) => {
        const min = i * binSize;
        const max = (i + 1) * binSize - 1;
        return {
            name: `${min} - ${max}`,
            count: 0
        };
    });

    for (const range of ranges) {
        const binIndex = Math.floor(range / binSize);
        if (bins[binIndex]) {
            bins[binIndex].count++;
        }
    }

    return bins;

  }, [vehicles, loading]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Electric Range Distribution</CardTitle>
        <CardDescription>Number of vehicles by electric range bins (in miles).</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[350px] w-full">
            <Skeleton className="h-full w-full" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data} margin={{ bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={50} interval="preserveStartEnd" />
              <YAxis allowDecimals={false} />
              <Tooltip
                  contentStyle={{
                      background: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 'var(--radius)'
                  }}
                  formatter={(value) => [`${value} vehicles`, 'Count']}
                  labelFormatter={(label) => `Range: ${label} mi`}
              />
              <Bar dataKey="count" name="Vehicles" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
