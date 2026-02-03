'use client';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useVehicleData } from '@/lib/vehicle-data-provider';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo } from 'react';

export default function BaseMsrpChart() {
  const { vehicles, loading } = useVehicleData();

  const data = useMemo(() => {
    if (loading || vehicles.length === 0) return [];
    
    const msrps = vehicles
        .map(v => v.baseMsrp)
        .filter(msrp => msrp > 0);

    if (msrps.length === 0) return [];

    const maxMsrp = Math.max(...msrps);
    const binSize = 20000;
    const binCount = Math.ceil(maxMsrp / binSize);

    const bins = Array.from({ length: binCount }, (_, i) => {
        const min = i * binSize;
        const max = (i + 1) * binSize - 1;
        return {
            name: `$${(min/1000)}k-$${(max/1000)}k`,
            count: 0
        };
    });

    for (const msrp of msrps) {
        const binIndex = Math.floor(msrp / binSize);
        if (bins[binIndex]) {
            bins[binIndex].count++;
        }
    }

    const lastNonEmptyBinIndex = bins.findLastIndex(bin => bin.count > 0);
    return bins.slice(0, lastNonEmptyBinIndex + 1);

  }, [vehicles, loading]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Base MSRP Distribution</CardTitle>
        <CardDescription>Number of vehicles by their Manufacturer's Suggested Retail Price.</CardDescription>
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
                  formatter={(value) => [`${(value as number).toLocaleString()} vehicles`, 'Count']}
                  labelFormatter={(label) => `MSRP Range: ${label}`}
              />
              <Bar dataKey="count" name="Vehicles" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
