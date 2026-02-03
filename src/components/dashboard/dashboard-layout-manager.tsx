'use client';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { LayoutGrid } from "lucide-react";
import { useState } from "react";

export type ChartVisibility = {
  vehiclesByYear: boolean;
  vehiclesByLegislativeDistrict: boolean;
  vehiclesByMake: boolean;
  vehiclesByModel: boolean;
  electricRange: boolean;
  washingtonMap: boolean;
  cafvEligibility: boolean;
  baseMsrp: boolean;
  countyChoroplethMap: boolean;
};

interface DashboardLayoutManagerProps {
  visibility: ChartVisibility;
  onVisibilityChange: (visibility: ChartVisibility) => void;
  chartNames: Record<keyof ChartVisibility, string>;
}

export default function DashboardLayoutManager({
  visibility,
  onVisibilityChange,
  chartNames
}: DashboardLayoutManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempVisibility, setTempVisibility] = useState(visibility);

  const handleSaveChanges = () => {
    onVisibilityChange(tempVisibility);
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
        setTempVisibility(visibility);
    }
    setIsOpen(open);
  }

  const handleCheckboxChange = (key: keyof ChartVisibility, checked: boolean) => {
    setTempVisibility(prev => ({ ...prev, [key]: checked }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <LayoutGrid className="h-4 w-4" />
          <span className="sr-only">Customize Layout</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Customize Dashboard</DialogTitle>
          <DialogDescription>
            Select the charts you want to display on your dashboard.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            {(Object.keys(chartNames) as Array<keyof ChartVisibility>).map((key) => (
                <div key={key} className="flex items-center space-x-2">
                    <Checkbox
                        id={key}
                        checked={tempVisibility[key]}
                        onCheckedChange={(checked) => handleCheckboxChange(key, !!checked)}
                    />
                    <Label htmlFor={key} className="font-normal cursor-pointer">
                        {chartNames[key]}
                    </Label>
                </div>
            ))}
        </div>
        <DialogFooter className="sm:justify-end">
          <div className="flex gap-2">
             <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
             <Button onClick={handleSaveChanges}>Save Changes</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
