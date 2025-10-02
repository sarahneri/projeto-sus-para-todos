import { NewsCard } from "../NewsCard";

export default function NewsCardExample() {
  return (
    <div className="p-8 max-w-md">
      <NewsCard
        id="1"
        title="Nova Campanha de Vacinação contra a Gripe"
        summary="A Secretaria de Saúde anuncia o início da campanha de vacinação contra a gripe para idosos e grupos prioritários."
        category="Vacinação"
        date="15 Jan 2025"
      />
    </div>
  );
}
