'use client';

import { useMemo } from 'react';
import { useVehicleData } from '@/lib/vehicle-data-provider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Vehicle } from '@/lib/data';

const TooltipStatContent = ({
  title,
  data,
}: {
  title: string;
  data: [string, number][];
}) => (
  <div>
    <p className="font-bold text-sm mb-2">{title}</p>
    {data && data.length > 0 ? (
      <ul className="space-y-1">
        {data.map(([item, count]) => (
          <li key={item} className="flex justify-between text-xs gap-4">
            <span>{item}</span>
            <span className="font-semibold">{count.toLocaleString()}</span>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-xs text-muted-foreground">No data available.</p>
    )}
  </div>
);

export default function SummaryStats() {
  const { vehicles, loading } = useVehicleData();

  const stats = useMemo(() => {
    if (loading || vehicles.length === 0) return {};

    const getTopItems = (key: keyof Vehicle, count: number) => {
      const counts = vehicles.reduce(
        (acc, vehicle) => {
          const item = vehicle[key];
          if (item !== null && item !== undefined && item !== 0 && String(item).trim() !== '') {
            acc[item] = (acc[item] || 0) + 1;
          }
          return acc;
        },
        {} as Record<string | number, number>
      );

      return Object.entries(counts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, count);
    };

    return {
      totalVehicles: vehicles.length,
      totalModels: new Set(vehicles.map((v) => v.model?.trim()).filter(Boolean))
        .size,
      totalCounties: new Set(
        vehicles.map((v) => v.county?.trim()).filter(Boolean)
      ).size,
      totalLegislativeDistricts: new Set(
        vehicles.map((v) => v.legislativeDistrict).filter((v) => v > 0)
      ).size,
      totalPostalCodes: new Set(
        vehicles.map((v) => v.postalCode).filter((v) => v > 0)
      ).size,
      topMakes: getTopItems('make', 3),
      topModels: getTopItems('model', 3),
      topCounties: getTopItems('county', 3),
      topDistricts: getTopItems('legislativeDistrict', 3),
      topPostalCodes: getTopItems('postalCode', 3),
    };
  }, [vehicles, loading]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-5">
        <Skeleton className="h-[124px] rounded-lg" />
        <Skeleton className="h-[124px] rounded-lg" />
        <Skeleton className="h-[124px] rounded-lg" />
        <Skeleton className="h-[124px] rounded-lg" />
        <Skeleton className="h-[124px] rounded-lg" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Vehicles',
      value: stats.totalVehicles,
      description: 'All registered vehicles',
      tooltipData: stats.topMakes,
      tooltipTitle: 'Top 3 Makes',
      className: 'bg-primary text-primary-foreground',
      textColor: 'text-primary-foreground/70'
    },
    {
      title: 'Unique Models',
      value: stats.totalModels,
      description: 'Total unique models',
      tooltipData: stats.topModels,
      tooltipTitle: 'Top 3 Models',
    },
    {
      title: 'Unique Counties',
      value: stats.totalCounties,
      description: 'Total unique counties',
      tooltipData: stats.topCounties,
      tooltipTitle: 'Top 3 Counties',
    },
    {
      title: 'Legislative Districts',
      value: stats.totalLegislativeDistricts,
      description: 'Total unique districts',
      tooltipData: stats.topDistricts,
      tooltipTitle: 'Top 3 Districts',
    },
    {
      title: 'Postal Codes',
      value: stats.totalPostalCodes,
      description: 'Total unique postal codes',
      tooltipData: stats.topPostalCodes,
      tooltipTitle: 'Top 3 Postal Codes',
    },
  ];

  return (
    <TooltipProvider>
      <div className="grid gap-4 md:grid-cols-5">
        {statCards.map((card) => (
          <Tooltip key={card.title}>
            <TooltipTrigger asChild>
              <Card className={card.className || ''}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold">
                    {card.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(card.value || 0).toLocaleString()}
                  </div>
                  <p className={`text-xs ${card.textColor || 'text-muted-foreground'}`}>
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>
              <TooltipStatContent
                title={card.tooltipTitle}
                data={card.tooltipData as [string, number][]}
              />
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
