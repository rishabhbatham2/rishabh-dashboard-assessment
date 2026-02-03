'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useVehicleData } from '@/lib/vehicle-data-provider';
import { Skeleton } from '../ui/skeleton';

const parseLocation = (locationString: string): [number, number] | null => {
    if (!locationString) return null;
    const match = locationString.match(/POINT \(([-\d.]+) ([-\d.]+)\)/);
    if (match && match.length === 3) {
        return [parseFloat(match[2]), parseFloat(match[1])]; // Leaflet is [lat, lng]
    }
    return null;
};

export default function WashingtonVectorMap() {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);
    const { vehicles, loading } = useVehicleData();

    useEffect(() => {
        if (mapRef.current && !mapInstance.current && !loading && vehicles.length > 0) {
            mapInstance.current = L.map(mapRef.current, {
                center: [47.7511, -120.7401],
                zoom: 7,
                scrollWheelZoom: false,
            });

            L.tileLayer(
                'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
                {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                }
            ).addTo(mapInstance.current);

            vehicles.forEach((vehicle) => {
                if (vehicle.vehicleLocation) {
                    const latLng = parseLocation(vehicle.vehicleLocation);
                    if (latLng) {
                        L.circleMarker(latLng, {
                            radius: 1.5,
                            color: 'hsl(var(--primary))',
                            fillColor: 'hsl(var(--primary))',
                            fillOpacity: 0.6,
                            weight: 0,
                            interactive: true,
                        })
                        .bindTooltip(`
                            <strong>${vehicle.make} ${vehicle.model} (${vehicle.modelYear})</strong><br/>
                            County: ${vehicle.county}
                        `)
                        .addTo(mapInstance.current!);
                    }
                }
            });
        }
        
        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };

    }, [loading, vehicles]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>EV Locations</CardTitle>
                <CardDescription>
                    Map of individual EV registration locations. Each dot represents a vehicle.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <Skeleton className="h-[400px] w-full rounded-lg" />
                ) : (
                    <div ref={mapRef} className="h-[400px] w-full rounded-lg overflow-hidden" />
                )}
            </CardContent>
        </Card>
    );
}
