import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';

export default function ScheduleCalendar() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Schedule</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center p-0">
        <Calendar
          mode="single"
          className="rounded-md"
        />
      </CardContent>
    </Card>
  );
}
