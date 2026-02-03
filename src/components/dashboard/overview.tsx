'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { overviewChartData } from '@/lib/data';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Dot } from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white text-black p-2 rounded-lg shadow-lg">
        <p className="font-normal">{`${payload[0].value} Steps`}</p>
        <p className="text-sm">{label}</p>
      </div>
    );
  }

  return null;
};


export default function Overview() {
  return (
    <Card className="w-full bg-primary text-primary-foreground">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-light">Overview</CardTitle>
        <Select>
            <SelectTrigger className="w-[120px] bg-primary-foreground/10 border-0 text-primary-foreground">
                <SelectValue placeholder="Monthly" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
            </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={overviewChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSteps" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary-foreground))" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="hsl(var(--primary-foreground))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" stroke="hsl(var(--primary-foreground))" opacity={0.6} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'white', strokeWidth: 1, strokeDasharray: '3 3' }}/>
            <Area type="monotone" dataKey="steps" stroke="hsl(var(--primary-foreground))" strokeWidth={3} fill="url(#colorSteps)" >
                 <Dot r={0} activeDot={{ r: 6, fill: 'hsl(var(--accent))', stroke: 'white', strokeWidth: 2 }} />
            </Area>
          </AreaChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-center">
            <div>
                <p className="text-xs text-primary-foreground/80">Total Time</p>
                <p className="text-2xl font-light">748 Hr</p>
                <p className="text-xs text-primary-foreground/60">April</p>
            </div>
            <div>
                <p className="text-xs text-primary-foreground/80">Total Steps</p>
                <p className="text-2xl font-light">9,178 St</p>
                <p className="text-xs text-primary-foreground/60">April</p>
            </div>
            <div>
                <p className="text-xs text-primary-foreground/80">Target</p>
                <p className="text-2xl font-light">9,200 St</p>
                <p className="text-xs text-primary-foreground/60">April</p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
