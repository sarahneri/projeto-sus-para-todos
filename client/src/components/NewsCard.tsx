import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight } from "lucide-react";

interface NewsCardProps {
  id: string;
  title: string;
  summary: string;
  category: string;
  date: string;
  imageUrl?: string;
}

export function NewsCard({ id, title, summary, category, date, imageUrl }: NewsCardProps) {
  return (
    <Card className="overflow-hidden hover-elevate">
      {imageUrl && (
        <div className="aspect-video w-full overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <Badge variant="secondary" className="text-base" data-testid={`badge-category-${id}`}>
            {category}
          </Badge>
          <div className="flex items-center gap-2 text-base text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{date}</span>
          </div>
        </div>
        <h3 className="text-2xl font-semibold leading-tight" data-testid={`text-title-${id}`}>
          {title}
        </h3>
        <p className="text-lg text-muted-foreground leading-relaxed line-clamp-3" data-testid={`text-summary-${id}`}>
          {summary}
        </p>
        <Button variant="outline" className="w-full h-12 text-lg" data-testid={`button-read-${id}`}>
          Ler Mais
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </Card>
  );
}
