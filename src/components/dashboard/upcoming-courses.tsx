import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book, Clock } from 'lucide-react';
import { upcomingCourses } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';

export default function UpcomingCourses() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Courses</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {upcomingCourses.map((course) => {
          const courseImage = PlaceHolderImages.find(p => p.id === course.id);
          return (
            <div key={course.id} className="flex gap-4 items-center">
              <div className="relative h-20 w-20 flex-shrink-0">
                  {courseImage && (
                    <Image
                      src={courseImage.imageUrl}
                      alt={course.title}
                      className="rounded-lg object-cover"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      data-ai-hint={courseImage.imageHint}
                    />
                  )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold leading-tight">{course.title}</h3>
                <div className="text-sm text-muted-foreground flex items-center gap-4 mt-1">
                  <span className="flex items-center gap-1"><Book size={14} /> {course.lessons} lessons</span>
                  <span className="flex items-center gap-1"><Clock size={14} /> {course.duration}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <Badge variant="secondary" className="font-semibold text-base">${course.price}</Badge>
                  <Button variant="outline" size="sm">View Course</Button>
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  );
}
