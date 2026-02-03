import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { activityData } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal } from 'lucide-react';

export default function ActivityCards() {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {activityData.map((activity) => (
        <Card key={activity.id} className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-2">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-muted">
                    <activity.icon className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                    <CardTitle className="text-lg font-bold">{activity.title}</CardTitle>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                </div>
            </div>
            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between my-4">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Progress</p>
                    <p className="text-2xl font-bold">{activity.progress}%</p>
                </div>
                <Badge variant="outline">{activity.daysLeft} days left</Badge>
            </div>
            <Progress value={activity.progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">{activity.progressText}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
