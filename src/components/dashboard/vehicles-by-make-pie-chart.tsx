'use client';
import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useVehicleData } from '@/lib/vehicle-data-provider';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo } from 'react';
import { Vehicle } from '@/lib/data';

const COLORS = [
    'hsl(var(--chart-1))', 
    'hsl(var(--chart-2))', 
    'hsl(var(--chart-3))', 
    'hsl(var(--chart-4))', 
    'hsl(var(--chart-5))',
    'hsl(260, 80%, 70%)',
    'hsl(300, 85%, 65%)',
    'hsl(20, 75%, 65%)',
    'hsl(100, 70%, 55%)',
    'hsl(0, 0%, 60%)',
    'hsl(0, 0%, 80%)'
];

const CustomTooltip = ({ active, payload, allVehicles }: { active?: boolean, payload?: any[], allVehicles: Vehicle[] }) => {
    if (active && payload && payload.length && allVehicles) {
      const { name, value } = payload[0].payload;
  
      if (name === 'Other') {
        return (
          <div className="p-3 text-xs bg-background border rounded-lg shadow-lg">
            <p className="font-bold text-sm">Other Makes: {value.toLocaleString()}</p>
          </div>
        );
      }
      
      const vehiclesOfMake = allVehicles.filter((v: Vehicle) => v.make === name);
      
      const topModels = vehiclesOfMake.reduce((acc: any, v: any) => {
        if (!v.model) return acc;
        acc[v.model] = (acc[v.model] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
  
      const sortedModels = Object.entries(topModels)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 3);
  
      return (
        <div className="p-3 text-xs bg-background border rounded-lg shadow-lg max-w-xs">
          <p className="font-bold text-sm mb-2">{`${name}: ${value.toLocaleString()} vehicles`}</p>
          <p className="font-semibold">Top 3 Models:</p>
          <ul className="mt-1 space-y-1">
            {sortedModels.map(([model, count]) => (
              <li key={model} className="flex justify-between">
                <span>{model}</span>
                <span className="font-semibold">{(count as number).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    }
  
    return null;
  };

export default function VehiclesByMakePieChart() {
  const { vehicles, loading } = useVehicleData();

  const data = useMemo(() => {
    const makeCounts = vehicles.reduce((acc, vehicle) => {
      const make = vehicle.make?.trim();
      if (!make) return acc;
      acc[make] = (acc[make] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sortedMakes = Object.keys(makeCounts)
      .map(name => ({
        name,
        value: makeCounts[name],
      }))
      .sort((a, b) => b.value - a.value);
    
    const top10 = sortedMakes.slice(0, 10);
    const otherCount = sortedMakes.slice(10).reduce((acc, make) => acc + make.value, 0);

    if (otherCount > 0) {
      return [...top10, { name: 'Other', value: otherCount }];
    }
    
    return top10;
  }, [vehicles]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Vehicle Makes</CardTitle>
        <CardDescription>Distribution of top 10 registered EV makes.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[350px] w-full flex items-center justify-center">
            <Skeleton className="h-64 w-64 rounded-full" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Tooltip
                content={<CustomTooltip allVehicles={vehicles} />}
                cursor={{ fill: 'hsl(var(--muted))' }}
              />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
