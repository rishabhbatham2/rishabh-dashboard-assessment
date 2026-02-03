'use client';
import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useVehicleData } from '@/lib/vehicle-data-provider';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo } from 'react';

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

export default function VehiclesByModelPieChart() {
  const { vehicles, loading } = useVehicleData();

  const data = useMemo(() => {
    const modelCounts = vehicles.reduce((acc, vehicle) => {
      const model = vehicle.model?.trim();
      if (!model) return acc;
      acc[model] = (acc[model] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sortedModels = Object.keys(modelCounts)
      .map(name => ({
        name,
        value: modelCounts[name],
      }))
      .sort((a, b) => b.value - a.value);
    
    const top10 = sortedModels.slice(0, 10);
    const otherCount = sortedModels.slice(10).reduce((acc, model) => acc + model.value, 0);

    if (otherCount > 0) {
      return [...top10, { name: 'Other', value: otherCount }];
    }
    
    return top10;
  }, [vehicles]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Vehicle Models</CardTitle>
        <CardDescription>Distribution of top 10 registered EV models.</CardDescription>
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
                contentStyle={{
                  background: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 'var(--radius)'
                }}
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
