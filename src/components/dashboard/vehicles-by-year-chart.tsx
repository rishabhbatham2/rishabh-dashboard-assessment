'use client';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { useVehicleData } from '@/lib/vehicle-data-provider';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function VehiclesByYearChart() {
  const { vehicles, loading } = useVehicleData();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [filterType, setFilterType] = useState<string>('all');
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleFilterChange = (value: string) => {
    setFilterType(value);
    const currentYear = new Date().getFullYear();
    if (value === 'all') {
      setDateRange(undefined);
    } else if (value === 'last5') {
      setDateRange({
        from: new Date(currentYear - 4, 0, 1),
        to: new Date(currentYear, 11, 31),
      });
    } else if (value === 'last10') {
      setDateRange({
        from: new Date(currentYear - 9, 0, 1),
        to: new Date(currentYear, 11, 31),
      });
    } else if (value === 'custom') {
      setDateRange(undefined);
    }
  };

  const clearFilter = () => {
    setFilterType('all');
    setDateRange(undefined);
  };

  const dataByYear = useMemo(() => {
    let filteredVehicles = vehicles;

    if (dateRange?.from) {
      const startYear = dateRange.from.getFullYear();
      const endYear = dateRange.to
        ? dateRange.to.getFullYear()
        : new Date().getFullYear();

      filteredVehicles = vehicles.filter((vehicle) => {
        if (!vehicle.modelYear) return false;
        return vehicle.modelYear >= startYear && vehicle.modelYear <= endYear;
      });
    }

    const yearCounts = filteredVehicles.reduce((acc, vehicle) => {
      if (
        vehicle.modelYear &&
        vehicle.modelYear > 1990 &&
        vehicle.modelYear <= new Date().getFullYear()
      ) {
        acc[vehicle.modelYear] = (acc[vehicle.modelYear] || 0) + 1;
      }
      return acc;
    }, {} as Record<number, number>);

    return Object.keys(yearCounts)
      .map((year) => ({
        year: parseInt(year),
        count: yearCounts[parseInt(year)],
      }))
      .sort((a, b) => a.year - b.year);
  }, [vehicles, dateRange]);

  const getFilterDisplay = () => {
    if (dateRange?.from) {
      if (dateRange.to) {
        return `${format(dateRange.from, 'LLL d, yyyy')} - ${format(
          dateRange.to,
          'LLL d, yyyy'
        )}`;
      }
      return format(dateRange.from, 'LLL d, yyyy');
    }
    return 'Select a date range';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicles Registered by Year</CardTitle>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-2">
          <CardDescription>
            The number of electric vehicles registered each year.
          </CardDescription>
          <div className="flex items-center gap-2">
            <Select value={filterType} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select time frame" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="last5">Last 5 Years</SelectItem>
                <SelectItem value="last10">Last 10 Years</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>

            {filterType === 'custom' && (
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className="w-[260px] justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {getFilterDisplay()}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={(range) => {
                      setDateRange(range);
                      if (range?.from && range?.to) {
                        setPopoverOpen(false);
                      }
                    }}
                    initialFocus
                    numberOfMonths={2}
                    defaultMonth={
                      dateRange?.from ||
                      new Date(new Date().setFullYear(new Date().getFullYear() - 1))
                    }
                  />
                </PopoverContent>
              </Popover>
            )}

            {filterType !== 'all' && (
              <Button variant="ghost" size="icon" onClick={clearFilter}>
                <X className="h-4 w-4" />
                <span className="sr-only">Clear filter</span>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[350px] w-full">
            <Skeleton className="h-full w-full" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart
              data={dataByYear}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="year"
                name="Year"
                tickFormatter={(year) => year.toString()}
              />
              <YAxis allowDecimals={false} name="Vehicle Count" />
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                }}
                labelFormatter={(label) => `Year: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="count"
                name="Vehicles"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
