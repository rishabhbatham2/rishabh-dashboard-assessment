import data from './county-map-data.json';

export type CountyData = {
  county: string;
  vehicles: number;
  lat: number;
  lng: number;
};

export const countyMapData: CountyData[] = data.countyData;
