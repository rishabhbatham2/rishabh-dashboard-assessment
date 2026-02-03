'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import L from 'leaflet';
import { waCountyBoundaries } from '@/lib/wa-county-boundaries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useVehicleData } from '@/lib/vehicle-data-provider';
import { Skeleton } from '../ui/skeleton';
import { AlertCircle } from 'lucide-react';

export default function CountyChoroplethMap() {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);
    const legendRef = useRef<L.Control | null>(null);
    const { vehicles, loading } = useVehicleData();

    const vehicleCountsByCounty = useMemo(() => {
        if (loading || vehicles.length === 0) return { counts: {}, max: 0 };
        const counts: Record<string, number> = {};
        for (const vehicle of vehicles) {
            if (vehicle.county) {
                counts[vehicle.county] = (counts[vehicle.county] || 0) + 1;
            }
        }
        const max = Math.max(0, ...Object.values(counts));
        return { counts, max };
    }, [vehicles, loading]);

    useEffect(() => {
        if (mapRef.current && !mapInstance.current && !loading && waCountyBoundaries.features.length > 0) {
            mapInstance.current = L.map(mapRef.current, {
                center: [47.7511, -120.7401],
                zoom: 7,
                scrollWheelZoom: false,
            });

            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            }).addTo(mapInstance.current);

            const { counts, max } = vehicleCountsByCounty;

            function getColor(count: number) {
                if (count <= 0) return 'rgba(0,0,0,0)';
                const percentage = Math.sqrt(count) / Math.sqrt(max); // using sqrt for better distribution for skewed data
                const lightness = 90 - (percentage * 50);
                return `hsl(var(--primary-hue, 250), var(--primary-sat, 66%), ${lightness}%)`;
            }

            let geojsonLayer: L.GeoJSON;

            function onEachFeature(feature: any, layer: L.Layer) {
                const countyName = feature.properties.NAME;
                const count = counts[countyName] || 0;
                layer.bindTooltip(`
                    <div>
                        <strong>County:</strong> ${countyName}<br/>
                        <strong>Vehicles:</strong> ${count.toLocaleString()}
                    </div>
                `);
                
                layer.on({
                    mouseover: (e) => {
                        const targetLayer = e.target;
                        targetLayer.setStyle({ weight: 2, color: 'hsl(var(--ring))', fillOpacity: 0.9 });
                        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                            targetLayer.bringToFront();
                        }
                    },
                    mouseout: (e) => {
                        geojsonLayer.resetStyle(e.target);
                    }
                });
            }

            geojsonLayer = L.geoJSON(waCountyBoundaries as any, {
                style: (feature) => {
                    const countyName = feature?.properties.NAME;
                    const count = counts[countyName] || 0;
                    return {
                        fillColor: getColor(count),
                        weight: 0.5,
                        opacity: 1,
                        color: 'hsl(var(--border))',
                        fillOpacity: 0.7
                    };
                },
                onEachFeature: onEachFeature
            }).addTo(mapInstance.current);

            if (legendRef.current) {
                mapInstance.current.removeControl(legendRef.current);
            }
            const legend = new L.Control({ position: 'bottomright' });
            legend.onAdd = () => {
                const div = L.DomUtil.create("div", "info legend");
                const grades = [1, Math.round(max/8), Math.round(max/4), Math.round(max/2), max];
                div.innerHTML += '<strong>EV Count</strong><br>';
                for (let i = 0; i < grades.length; i++) {
                    const from = grades[i];
                    const to = grades[i + 1];
                    div.innerHTML +=
                        `<i style="background:${getColor(from)}"></i> ` +
                        from.toLocaleString() + (to ? `&ndash;${to.toLocaleString()}<br>` : '+');
                }
                return div;
            };
            legend.addTo(mapInstance.current);
            legendRef.current = legend;
        }
        
        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };

    }, [loading, vehicles, vehicleCountsByCounty]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>EV Registrations by County (Choropleth)</CardTitle>
                <CardDescription>
                    Choropleth map of EV registrations in Washington counties.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <Skeleton className="h-[400px] w-full rounded-lg" />
                ) : waCountyBoundaries.features.length === 0 ? (
                    <div className="h-[400px] w-full rounded-lg bg-muted flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                            <AlertCircle className="mx-auto h-12 w-12" />
                            <h3 className="mt-4 text-lg font-medium text-foreground">GeoJSON Data Missing</h3>
                            <p className="mt-1 text-sm">To display the county choropleth map, please provide GeoJSON data.</p>
                            <p className="mt-2 text-xs">Populate the `features` array in <code className="font-mono bg-background/50 p-1 rounded-sm">src/lib/wa-county-boundaries.ts</code>.</p>
                        </div>
                    </div>
                ) : (
                    <div ref={mapRef} className="h-[400px] w-full rounded-lg overflow-hidden" />
                )}
            </CardContent>
        </Card>
    );
}
