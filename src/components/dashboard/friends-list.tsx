import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { friendsData } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { MessageSquare } from 'lucide-react';
import { Button } from '../ui/button';

export default function FriendsList() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Friends</CardTitle>
        <Button variant="link" className="text-muted-foreground">View All</Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="activities">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="online">Online</TabsTrigger>
          </TabsList>
          <TabsContent value="activities" className="space-y-4">
            {friendsData.map((friend) => {
                const friendImage = PlaceHolderImages.find(p => p.id === friend.id);
                return (
                    <div key={friend.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10">
                                {friendImage && (
                                    <Image
                                        src={friendImage.imageUrl}
                                        alt={friend.name}
                                        className="rounded-full object-cover"
                                        fill
                                        sizes="40px"
                                        data-ai-hint={friendImage.imageHint}
                                    />
                                )}
                                {friend.status === 'online' && (
                                    <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white" />
                                )}
                            </div>
                            <div>
                                <p className="font-semibold">{friend.name}</p>
                                <p className="text-sm text-muted-foreground">{friend.activity}</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon">
                            <MessageSquare className="h-5 w-5 text-muted-foreground" />
                        </Button>
                    </div>
                );
            })}
          </TabsContent>
          <TabsContent value="online">
            <p className="text-muted-foreground text-center py-8">No friends currently online.</p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
