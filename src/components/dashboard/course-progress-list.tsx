import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ongoingCourses } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function CourseProgressList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Continue Learning</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {ongoingCourses.map((course) => {
            const courseImage = PlaceHolderImages.find(p => p.id === course.id);
            return (
                <div key={course.id} className="flex items-center gap-4">
                    <div className="relative h-16 w-24 flex-shrink-0">
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
                    <div className="flex-1 space-y-1">
                        <p className="font-medium leading-tight">{course.title}</p>
                        <div className="flex items-center gap-2">
                          <Progress value={course.progress} className="h-2 w-full" />
                          <span className="text-sm text-muted-foreground">{course.progress}%</span>
                        </div>
                    </div>
                </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
