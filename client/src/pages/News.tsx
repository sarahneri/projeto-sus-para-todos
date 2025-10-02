import { NewsCard } from "@/components/NewsCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function News() {
  const newsItems = [
    {
      id: "1",
      title: "Nova Campanha de Vacinação contra a Gripe",
      summary: "A Secretaria de Saúde anuncia o início da campanha de vacinação contra a gripe para idosos e grupos prioritários. Atendimento disponível em todas as unidades.",
      category: "Vacinação",
      date: "15 Jan 2025",
    },
    {
      id: "2",
      title: "Dicas para Prevenir Doenças Cardiovasculares",
      summary: "Especialistas compartilham orientações importantes sobre alimentação saudável, exercícios físicos e check-ups regulares para cuidar do coração.",
      category: "Prevenção",
      date: "12 Jan 2025",
    },
    {
      id: "3",
      title: "Novos Horários de Atendimento nos Hospitais",
      summary: "A partir desta semana, os hospitais de São Caetano do Sul ampliam horários de atendimento para melhor atender a população.",
      category: "Atendimento",
      date: "10 Jan 2025",
    },
    {
      id: "4",
      title: "Importância do Check-up Regular",
      summary: "Médicos reforçam a necessidade de realizar exames de rotina para detectar doenças precocemente e manter a saúde em dia.",
      category: "Saúde",
      date: "08 Jan 2025",
    },
    {
      id: "5",
      title: "Campanha de Conscientização sobre Diabetes",
      summary: "Ações educativas sobre prevenção e controle do diabetes serão realizadas nas unidades de saúde durante todo o mês.",
      category: "Prevenção",
      date: "05 Jan 2025",
    },
    {
      id: "6",
      title: "Novo Equipamento de Ressonância Magnética",
      summary: "Hospital Municipal recebe novo equipamento de última geração para exames de ressonância magnética, reduzindo tempo de espera.",
      category: "Tecnologia",
      date: "02 Jan 2025",
    },
  ];

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

        <div className="grid gap-8 md:grid-cols-2">
          {newsItems.map((news) => (
            <NewsCard key={news.id} {...news} />
          ))}
        </div>
      </div>
    </div>
  );
}
