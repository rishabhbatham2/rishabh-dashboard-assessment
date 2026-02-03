import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { suggestedArticles } from '@/lib/data';
import { ArrowRight } from 'lucide-react';

export default function SuggestedArticles() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Suggested for you</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {suggestedArticles.map((article) => (
          <div key={article.id} className="p-3 rounded-lg hover:bg-secondary transition-colors">
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">{article.tag}</span>
                <h3 className="font-semibold mt-1">{article.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{article.excerpt}</p>
              </div>
              <Button variant="ghost" size="icon" className="shrink-0 group">
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
