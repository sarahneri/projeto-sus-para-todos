import { NewsCard } from "@/components/NewsCard";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { News } from "@shared/schema";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function News() {
  const { data: newsItems = [], isLoading } = useQuery<News[]>({
    queryKey: ["/api/news"],
  });

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Notícias de Saúde</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Fique por dentro das últimas novidades sobre saúde em São Caetano do Sul
          </p>
          
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar notícias..."
              className="h-14 pl-12 text-lg"
              data-testid="input-search-news"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {newsItems.map((news) => (
              <NewsCard
                key={news.id}
                id={news.id}
                title={news.title}
                summary={news.summary}
                category={news.category}
                date={format(new Date(news.publishedAt), "dd MMM yyyy", { locale: ptBR })}
                imageUrl={news.imageUrl || undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
