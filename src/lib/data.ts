export type Vehicle = {
  vin: string;
  county: string;
  city: string;
  state: string;
  postalCode: number;
  modelYear: number;
  make: string;
  model: string;
  electricVehicleType: 'Battery Electric Vehicle (BEV)' | 'Plug-in Hybrid Electric Vehicle (PHEV)';
  cafvEligibility: string;
  electricRange: number;
  baseMsrp: number;
  legislativeDistrict: number;
  dolVehicleId: number;
  vehicleLocation: string;
  electricUtility: string;
  censusTract: number;
};
