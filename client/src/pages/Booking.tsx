import { BookingForm } from "@/components/BookingForm";

export default function Booking() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Agendar Consulta ou Exame</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Preencha os dados abaixo para agendar seu atendimento nos hospitais de São Caetano do Sul
          </p>
        </div>
        <BookingForm />
      </div>
    </div>
  );
}
