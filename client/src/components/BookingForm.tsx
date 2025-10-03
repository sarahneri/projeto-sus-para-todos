import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { ChevronLeft, ChevronRight, CheckCircle2, Building2, Stethoscope, User, CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import type { Hospital, Specialty } from "@shared/schema";

type BookingStep = 1 | 2 | 3 | 4 | 5;

export function BookingForm() {
  const { toast } = useToast();
  const [step, setStep] = useState<BookingStep>(1);
  const [hospital, setHospital] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientCPF, setPatientCPF] = useState("");
  const [patientBirth, setPatientBirth] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState("");

  const { data: hospitals = [], isLoading: hospitalsLoading } = useQuery<Hospital[]>({
    queryKey: ["/api/hospitals"],
  });

  const { data: specialties = [], isLoading: specialtiesLoading } = useQuery<Specialty[]>({
    queryKey: ["/api/specialties"],
  });

  const timeSlots = [
    "08:00", "09:00", "10:00", "11:00", 
    "14:00", "15:00", "16:00", "17:00"
  ];

  const handleNext = () => {
    if (step < 5) setStep((step + 1) as BookingStep);
  };

  const handleBack = () => {
    if (step > 1) setStep((step - 1) as BookingStep);
  };

  const createAppointment = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Falha ao criar agendamento");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Agendamento confirmado!",
        description: "Seu agendamento foi realizado com sucesso.",
      });
      setStep(1);
      setHospital("");
      setServiceType("");
      setSpecialty("");
      setPatientName("");
      setPatientCPF("");
      setPatientBirth("");
      setPatientPhone("");
      setSelectedDate(undefined);
      setSelectedTime("");
    },
    onError: () => {
      toast({
        title: "Erro ao agendar",
        description: "Não foi possível realizar o agendamento. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!selectedDate) return;

    createAppointment.mutate({
      hospitalId: hospital,
      specialtyId: specialty,
      serviceType,
      patientName,
      patientCPF,
      patientBirth,
      patientPhone,
      appointmentDate: selectedDate,
      appointmentTime: selectedTime,
    });
  };

  const isStepValid = () => {
    switch (step) {
      case 1: return hospital !== "";
      case 2: return serviceType !== "";
      case 3: return specialty !== "";
      case 4: return patientName && patientCPF && patientBirth && patientPhone;
      case 5: return selectedDate && selectedTime;
      default: return false;
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex items-center justify-between">
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-semibold ${
                s === step
                  ? "bg-primary text-primary-foreground"
                  : s < step
                  ? "bg-primary/20 text-primary"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {s < step ? <CheckCircle2 className="h-6 w-6" /> : s}
            </div>
            {s < 5 && <div className={`h-1 w-12 sm:w-24 ${s < step ? "bg-primary" : "bg-secondary"}`} />}
          </div>
        ))}
      </div>

      <Card className="p-8">
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <Building2 className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-semibold">Selecione o Hospital</h2>
            </div>
            {hospitalsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <RadioGroup value={hospital} onValueChange={setHospital}>
                {hospitals.map((h) => (
                  <Card
                    key={h.id}
                    className={`p-6 cursor-pointer hover-elevate active-elevate-2 ${
                      hospital === h.id ? "border-primary border-2" : ""
                    }`}
                    onClick={() => setHospital(h.id)}
                  >
                    <div className="flex items-start gap-4">
                      <RadioGroupItem value={h.id} id={h.id} data-testid={`radio-hospital-${h.id}`} />
                      <div className="flex-1">
                        <Label htmlFor={h.id} className="text-xl font-semibold cursor-pointer">
                          {h.name}
                        </Label>
                        <p className="text-lg text-muted-foreground mt-1">{h.address}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </RadioGroup>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <Stethoscope className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-semibold">Tipo de Atendimento</h2>
            </div>
            <RadioGroup value={serviceType} onValueChange={setServiceType}>
              <Card
                className={`p-6 cursor-pointer hover-elevate active-elevate-2 ${
                  serviceType === "consulta" ? "border-primary border-2" : ""
                }`}
                onClick={() => setServiceType("consulta")}
              >
                <div className="flex items-center gap-4">
                  <RadioGroupItem value="consulta" id="consulta" data-testid="radio-consulta" />
                  <Label htmlFor="consulta" className="text-xl font-semibold cursor-pointer">
                    Consulta Médica
                  </Label>
                </div>
              </Card>
              <Card
                className={`p-6 cursor-pointer hover-elevate active-elevate-2 ${
                  serviceType === "exame" ? "border-primary border-2" : ""
                }`}
                onClick={() => setServiceType("exame")}
              >
                <div className="flex items-center gap-4">
                  <RadioGroupItem value="exame" id="exame" data-testid="radio-exame" />
                  <Label htmlFor="exame" className="text-xl font-semibold cursor-pointer">
                    Exame Médico
                  </Label>
                </div>
              </Card>
            </RadioGroup>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold mb-6">Selecione a Especialidade</h2>
            {specialtiesLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-3">
                <Label htmlFor="specialty" className="text-lg">Especialidade</Label>
                <Select value={specialty} onValueChange={setSpecialty}>
                  <SelectTrigger className="h-14 text-lg" data-testid="select-specialty">
                    <SelectValue placeholder="Escolha uma especialidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {specialties.map((s) => (
                      <SelectItem key={s.id} value={s.id} className="text-lg">
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <User className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-semibold">Dados do Paciente</h2>
            </div>
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-lg">Nome Completo</Label>
                <Input
                  id="name"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Digite o nome completo"
                  className="h-14 text-lg"
                  data-testid="input-name"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="cpf" className="text-lg">CPF</Label>
                <Input
                  id="cpf"
                  value={patientCPF}
                  onChange={(e) => setPatientCPF(e.target.value)}
                  placeholder="000.000.000-00"
                  className="h-14 text-lg"
                  data-testid="input-cpf"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="birth" className="text-lg">Data de Nascimento</Label>
                <Input
                  id="birth"
                  type="date"
                  value={patientBirth}
                  onChange={(e) => setPatientBirth(e.target.value)}
                  className="h-14 text-lg"
                  data-testid="input-birth"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="phone" className="text-lg">Telefone</Label>
                <Input
                  id="phone"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  placeholder="(11) 00000-0000"
                  className="h-14 text-lg"
                  data-testid="input-phone"
                />
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <CalendarIcon className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-semibold">Escolha Data e Horário</h2>
            </div>
            <div className="flex flex-col items-center gap-8">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                locale={ptBR}
                className="rounded-xl border"
                disabled={(date) => date < new Date()}
              />
              {selectedDate && (
                <div className="w-full space-y-4">
                  <p className="text-xl font-medium">
                    Data selecionada: {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                  <div className="grid grid-cols-4 gap-3">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        className="h-12 text-lg"
                        onClick={() => setSelectedTime(time)}
                        data-testid={`button-time-${time}`}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-between gap-4">
          {step > 1 && (
            <Button variant="outline" size="lg" onClick={handleBack} className="h-12 px-8 text-lg" data-testid="button-back">
              <ChevronLeft className="mr-2 h-5 w-5" />
              Voltar
            </Button>
          )}
          <div className="flex-1" />
          {step < 5 ? (
            <Button
              size="lg"
              onClick={handleNext}
              disabled={!isStepValid()}
              className="h-12 px-8 text-lg"
              data-testid="button-next"
            >
              Continuar
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={!isStepValid()}
              className="h-12 px-8 text-lg"
              data-testid="button-submit"
            >
              Confirmar Agendamento
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
