import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Clock, MapPin, User, Phone, FileText, Edit, Trash2, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Appointment, Hospital, Specialty } from "@shared/schema";

export default function MyAppointments() {
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [editDate, setEditDate] = useState<Date | undefined>(undefined);
  const [editTime, setEditTime] = useState<string>("");

  const { data: appointments = [], isLoading: isLoadingAppointments } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments"],
  });

  const { data: hospitals = [] } = useQuery<Hospital[]>({
    queryKey: ["/api/hospitals"],
  });

  const { data: specialties = [] } = useQuery<Specialty[]>({
    queryKey: ["/api/specialties"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/appointments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      toast({
        title: "Agendamento cancelado",
        description: "Seu agendamento foi cancelado com sucesso.",
      });
      setDeleteDialogOpen(false);
      setSelectedAppointment(null);
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erro ao cancelar",
        description: "Não foi possível cancelar o agendamento. Tente novamente.",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return await apiRequest("PUT", `/api/appointments/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      toast({
        title: "Agendamento atualizado",
        description: "Seu agendamento foi atualizado com sucesso.",
      });
      setEditDialogOpen(false);
      setSelectedAppointment(null);
      setEditDate(undefined);
      setEditTime("");
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar o agendamento. Tente novamente.",
      });
    },
  });

  const handleDelete = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setDeleteDialogOpen(true);
  };

  const handleEdit = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setEditDate(new Date(appointment.appointmentDate));
    setEditTime(appointment.appointmentTime);
    setEditDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedAppointment) {
      deleteMutation.mutate(selectedAppointment.id);
    }
  };

  const confirmEdit = () => {
    if (selectedAppointment && editDate) {
      updateMutation.mutate({
        id: selectedAppointment.id,
        data: {
          appointmentDate: editDate.toISOString(),
          appointmentTime: editTime,
        },
      });
    }
  };

  const getHospitalName = (hospitalId: string) => {
    return hospitals.find((h) => h.id === hospitalId)?.name || "Hospital não encontrado";
  };

  const getSpecialtyName = (specialtyId: string) => {
    return specialties.find((s) => s.id === specialtyId)?.name || "Especialidade não encontrada";
  };

  const availableTimes = [
    "08:00", "09:00", "10:00", "11:00",
    "14:00", "15:00", "16:00", "17:00"
  ];

  if (isLoadingAppointments) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-muted-foreground">Carregando agendamentos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3">Meus Agendamentos</h1>
          <p className="text-xl text-muted-foreground">
            Visualize e gerencie suas consultas e exames agendados
          </p>
        </div>

        {appointments.length === 0 ? (
          <Card className="p-12 text-center">
            <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Nenhum agendamento encontrado</h3>
            <p className="text-lg text-muted-foreground">
              Você ainda não possui agendamentos. Agende sua primeira consulta ou exame!
            </p>
          </Card>
        ) : (
          <div className="grid gap-6">
            {appointments.map((appointment) => {
              const appointmentDate = new Date(appointment.appointmentDate);
              const isPast = appointmentDate < new Date();

              return (
                <Card key={appointment.id} className="overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${isPast ? 'bg-muted' : 'bg-primary/10'}`}>
                        <Calendar className={`h-6 w-6 ${isPast ? 'text-muted-foreground' : 'text-primary'}`} />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">
                          {appointment.serviceType}
                        </CardTitle>
                        <Badge variant={isPast ? "secondary" : "default"} className="mt-1">
                          {isPast ? "Realizado" : "Agendado"}
                        </Badge>
                      </div>
                    </div>
                    {!isPast && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(appointment)}
                          data-testid={`button-edit-${appointment.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(appointment)}
                          data-testid={`button-delete-${appointment.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-muted-foreground">Hospital</p>
                            <p className="text-base font-medium">{getHospitalName(appointment.hospitalId)}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <FileText className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-muted-foreground">Especialidade</p>
                            <p className="text-base font-medium">{getSpecialtyName(appointment.specialtyId)}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <User className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-muted-foreground">Paciente</p>
                            <p className="text-base font-medium">{appointment.patientName}</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <Calendar className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-muted-foreground">Data</p>
                            <p className="text-base font-medium">
                              {format(appointmentDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-muted-foreground">Horário</p>
                            <p className="text-base font-medium">{appointment.appointmentTime}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Phone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-muted-foreground">Telefone</p>
                            <p className="text-base font-medium">{appointment.patientPhone}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Dialog de Confirmação de Cancelamento */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent data-testid="dialog-delete-confirmation">
          <DialogHeader>
            <DialogTitle className="text-2xl">Cancelar Agendamento</DialogTitle>
            <DialogDescription className="text-base">
              Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="py-4 space-y-2">
              <p className="text-base">
                <strong>Tipo:</strong> {selectedAppointment.serviceType}
              </p>
              <p className="text-base">
                <strong>Data:</strong>{" "}
                {format(new Date(selectedAppointment.appointmentDate), "dd/MM/yyyy", { locale: ptBR })}
              </p>
              <p className="text-base">
                <strong>Horário:</strong> {selectedAppointment.appointmentTime}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              data-testid="button-cancel-delete"
            >
              Voltar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
              data-testid="button-confirm-delete"
            >
              {deleteMutation.isPending ? "Cancelando..." : "Confirmar Cancelamento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Edição */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl" data-testid="dialog-edit-appointment">
          <DialogHeader>
            <DialogTitle className="text-2xl">Editar Agendamento</DialogTitle>
            <DialogDescription className="text-base">
              Altere a data e horário do seu agendamento
            </DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label className="text-base">Data do Agendamento</Label>
                <CalendarComponent
                  mode="single"
                  selected={editDate}
                  onSelect={setEditDate}
                  disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                  locale={ptBR}
                  className="rounded-md border"
                  data-testid="calendar-edit"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-time" className="text-base">Horário</Label>
                <Select value={editTime} onValueChange={setEditTime}>
                  <SelectTrigger id="edit-time" data-testid="select-edit-time">
                    <SelectValue placeholder="Selecione o horário" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTimes.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              data-testid="button-cancel-edit"
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmEdit}
              disabled={!editDate || !editTime || updateMutation.isPending}
              data-testid="button-confirm-edit"
            >
              {updateMutation.isPending ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
