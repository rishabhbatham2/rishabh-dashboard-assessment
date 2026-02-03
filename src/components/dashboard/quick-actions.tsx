import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Dumbbell, Zap } from 'lucide-react';
import { Button } from '../ui/button';

export default function QuickActions() {
  return (
    <div className="space-y-4">
      <Card className="bg-primary/90 text-primary-foreground">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Zap className="h-6 w-6" />
            <p className="font-semibold">Daily Jogging</p>
          </div>
          <Button variant="ghost" size="icon"><ArrowRight className="h-5 w-5" /></Button>
        </CardContent>
      </Card>
      <Card className="bg-accent text-accent-foreground">
        <CardContent className="p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Dumbbell className="h-6 w-6" />
                    <p className="font-semibold">My Jogging</p>
                </div>
                <Button variant="ghost" size="icon" className="text-accent-foreground hover:bg-white/20 hover:text-accent-foreground"><ArrowRight className="h-5 w-5" /></Button>
            </div>
            <div className="mt-4 text-center">
                <p className="text-xs">Total Time</p>
                <p className="text-3xl font-bold">748 hr</p>
                <p className="text-xs">July</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
