'use client';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useVehicleData } from '@/lib/vehicle-data-provider';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo } from 'react';

const WrappedAxisTick = (props: any) => {
  const { x, y, payload } = props;
  const { value } = payload;
  const maxCharsPerLine = 20;

  const wrapText = (text: string, maxLen: number) => {
    if (text.length <= maxLen) {
      return [text];
    }
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
        if (currentLine === '') {
            currentLine = word;
        } else if ((currentLine + ' ' + word).length > maxLen) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine += ' ' + word;
        }
    }
    if (currentLine) {
        lines.push(currentLine);
    }
    return lines;
  };
  
  const lines = wrapText(value, maxCharsPerLine);
  
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={12} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize={12}>
        {lines.map((line, index) => (
          <tspan x={0} dy={`${index * 1.2}em`} key={index}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
};


export default function CafvEligibilityChart() {
  const { vehicles, loading } = useVehicleData();

  const data = useMemo(() => {
    if (loading || vehicles.length === 0) return [];

    const eligibilityCounts = vehicles.reduce((acc, vehicle) => {
      const eligibility = vehicle.cafvEligibility || 'Unknown';
      acc[eligibility] = (acc[eligibility] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(eligibilityCounts).map(eligibility => ({
      name: eligibility,
      count: eligibilityCounts[eligibility],
    })).sort((a, b) => b.count - a.count);
  }, [vehicles, loading]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>CAFV Eligibility Distribution</CardTitle>
        <CardDescription>Distribution of vehicles by Clean Alternative Fuel Vehicle eligibility.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[350px] w-full">
            <Skeleton className="h-full w-full" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" interval={0} tick={<WrappedAxisTick />} height={60} />
              <YAxis allowDecimals={false} />
              <Tooltip
                  contentStyle={{
                      background: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 'var(--radius)'
                  }}
                  formatter={(value) => [`${(value as number).toLocaleString()} vehicles`, 'Count']}
                  labelFormatter={(label) => `Eligibility: ${label}`}
              />
              <Bar dataKey="count" name="Vehicles" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
