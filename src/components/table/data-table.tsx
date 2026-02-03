'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useVehicleData } from '@/lib/vehicle-data-provider';
import { Vehicle } from '@/lib/data';
import { Skeleton } from '../ui/skeleton';
import { Car, Filter, Search, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { DialogTrigger } from '@radix-ui/react-dialog';

export function DataTable() {
  const { vehicles, loading } = useVehicleData();
  const [selectedVehicle, setSelectedVehicle] = React.useState<Vehicle | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = React.useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = React.useState(false);
  
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState('');
  
  const [filters, setFilters] = React.useState({
    make: '',
    modelYear: '',
    electricVehicleType: '',
  });
  const [tempFilters, setTempFilters] = React.useState(filters);

  const itemsPerPage = 10;

  const handleRowClick = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDetailModalOpen(true);
  };

  const makes = React.useMemo(() => [...new Set(vehicles.map(v => v.make).filter(Boolean))].sort(), [vehicles]);
  const modelYears = React.useMemo(() => [...new Set(vehicles.map(v => v.modelYear).filter(v => v > 0))].sort((a, b) => b - a), [vehicles]);
  const vehicleTypes = React.useMemo(() => [...new Set(vehicles.map(v => v.electricVehicleType).filter(Boolean))], [vehicles]);

  const filteredVehicles = React.useMemo(() => {
    return vehicles.filter(vehicle => {
        const searchMatch = `${vehicle.make} ${vehicle.model}`.toLowerCase().includes(searchTerm.toLowerCase());
        const makeMatch = filters.make ? vehicle.make === filters.make : true;
        const yearMatch = filters.modelYear ? vehicle.modelYear === Number(filters.modelYear) : true;
        const typeMatch = filters.electricVehicleType ? vehicle.electricVehicleType === filters.electricVehicleType : true;
        return searchMatch && makeMatch && yearMatch && typeMatch;
    });
  }, [vehicles, searchTerm, filters]);
  
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVehicles = filteredVehicles.slice(startIndex, endIndex);

  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));
  };
  
  const handleApplyFilters = () => {
    setFilters(tempFilters);
    setIsFilterModalOpen(false);
  };

  const handleClearFilters = () => {
      setFilters({ make: '', modelYear: '', electricVehicleType: '' });
      setTempFilters({ make: '', modelYear: '', electricVehicleType: '' });
  };

  const hasActiveFilters = filters.make || filters.modelYear || filters.electricVehicleType;

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);


  return (
    <>
      <Card>
        <CardHeader className="flex flex-row justify-between items-center gap-4">
            <h2 className="text-lg font-semibold shrink-0">Transactions</h2>
            <div className="flex items-center gap-2 w-full">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search transactions..." 
                        className="w-full pl-9 bg-muted border-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setTempFilters(filters)}>
                            <Filter className="mr-2 h-4 w-4" />
                            Filter
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Filter Transactions</DialogTitle>
                            <DialogDescription>
                                Refine the results based on the criteria below.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="make-filter" className="text-right">Make</Label>
                                <Select
                                    value={tempFilters.make}
                                    onValueChange={(value) => setTempFilters(prev => ({...prev, make: value === 'all' ? '' : value}))}
                                >
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select a make" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Makes</SelectItem>
                                        {makes.map(make => <SelectItem key={make} value={make}>{make}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="year-filter" className="text-right">Year</Label>
                                <Select
                                    value={tempFilters.modelYear}
                                    onValueChange={(value) => setTempFilters(prev => ({...prev, modelYear: value === 'all' ? '' : value}))}
                                >
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select a year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Years</SelectItem>
                                        {modelYears.map(year => <SelectItem key={year} value={String(year)}>{year}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="type-filter" className="text-right">Type</Label>
                                <Select
                                    value={tempFilters.electricVehicleType}
                                    onValueChange={(value) => setTempFilters(prev => ({...prev, electricVehicleType: value === 'all' ? '' : value}))}
                                >
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select a type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        {vehicleTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsFilterModalOpen(false)}>Cancel</Button>
                            <Button onClick={handleApplyFilters}>Apply Filters</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                        <X className="mr-2 h-4 w-4" />
                        Clear
                    </Button>
                )}
            </div>
        </CardHeader>
        <CardContent className="p-0">
            <Table>
            <TableBody>
                {loading ? (
                Array.from({ length: itemsPerPage }).map((_, i) => (
                    <TableRow key={i}>
                    <TableCell colSpan={3}>
                        <Skeleton className="h-12 w-full" />
                    </TableCell>
                    </TableRow>
                ))
                ) : (
                currentVehicles.map((vehicle) => (
                    <TableRow key={vehicle.vin} onClick={() => handleRowClick(vehicle)} className="cursor-pointer">
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-muted">
                                    <Car className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <div className="font-semibold">{vehicle.make} {vehicle.model}</div>
                                    <div className="text-sm text-muted-foreground">
                                        {vehicle.modelYear} &middot; {vehicle.electricVehicleType === 'Battery Electric Vehicle (BEV)' ? 'BEV' : 'PHEV'}
                                    </div>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="font-semibold">{vehicle.county}</div>
                            <div className="text-sm text-muted-foreground">{vehicle.city}, {vehicle.state}</div>
                        </TableCell>
                        <TableCell className="text-right">
                            <div className="font-semibold">{vehicle.baseMsrp > 0 ? `$${vehicle.baseMsrp.toLocaleString()}`: 'N/A'}</div>
                            <div className="text-sm text-muted-foreground">{vehicle.electricRange > 0 ? `${vehicle.electricRange} mi range` : 'N/A'}</div>
                        </TableCell>
                    </TableRow>
                ))
                )}
            </TableBody>
            </Table>
        </CardContent>
        <CardFooter className="flex items-center justify-between py-4">
            <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages > 0 ? totalPages : 1}
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={goToPreviousPage} disabled={currentPage === 1}>
                    Previous
                </Button>
                <Button variant="outline" size="sm" onClick={goToNextPage} disabled={currentPage === totalPages || totalPages === 0}>
                    Next
                </Button>
            </div>
        </CardFooter>
      </Card>

      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedVehicle?.make} {selectedVehicle?.model}</DialogTitle>
            <DialogDescription>
              Details for vehicle VIN: {selectedVehicle?.vin}
            </DialogDescription>
          </DialogHeader>
          {selectedVehicle && (
            <div className="grid gap-4 py-4 text-sm">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label>Make</Label>
                <span className="col-span-2 font-semibold">{selectedVehicle.make}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label>Model</Label>
                <span className="col-span-2 font-semibold">{selectedVehicle.model}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label>Year</Label>
                <span className="col-span-2 font-semibold">{selectedVehicle.modelYear}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label>Type</Label>
                <span className="col-span-2 font-semibold">{selectedVehicle.electricVehicleType}</span>
              </div>
               <div className="grid grid-cols-3 items-center gap-4">
                <Label>Range</Label>
                <span className="col-span-2 font-semibold">{selectedVehicle.electricRange} miles</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label>MSRP</Label>
                <span className="col-span-2 font-semibold">${selectedVehicle.baseMsrp.toLocaleString()}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label>County</Label>
                <span className="col-span-2 font-semibold">{selectedVehicle.county}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label>City</Label>
                <span className="col-span-2 font-semibold">{selectedVehicle.city}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
