import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Check } from "lucide-react";

const verifyEmailSchema = z.object({
  email: z.string().email("E-mail inválido"),
});

const resetPasswordSchema = z.object({
  newPassword: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
  confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type VerifyEmailData = z.infer<typeof verifyEmailSchema>;
type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

export default function ForgotPassword() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<"email" | "password">("email");
  const [userId, setUserId] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");

  const emailForm = useForm<VerifyEmailData>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  const passwordForm = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: async (data: VerifyEmailData) => {
      const res = await apiRequest("POST", "/api/auth/verify-email", data);
      return await res.json();
    },
    onSuccess: (response: any) => {
      setUserId(response.userId);
      setUserEmail(emailForm.getValues("email"));
      setStep("password");
      toast({
        title: "Email verificado!",
        description: "Agora você pode redefinir sua senha.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Email não encontrado",
        description: error.message || "Este email não está cadastrado no sistema.",
      });
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: ResetPasswordData) => {
      if (!userId) {
        throw new Error("ID do usuário não encontrado. Por favor, verifique o email novamente.");
      }
      const res = await apiRequest("POST", "/api/auth/reset-password", {
        userId,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Senha redefinida!",
        description: "Sua senha foi alterada com sucesso. Faça login com a nova senha.",
      });
      setLocation("/login");
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Erro ao redefinir senha",
        description: error.message || "Tente novamente mais tarde.",
      });
    },
  });

  const onVerifyEmail = (data: VerifyEmailData) => {
    verifyEmailMutation.mutate(data);
  };

  const onResetPassword = (data: ResetPasswordData) => {
    resetPasswordMutation.mutate(data);
  };

  const newPassword = passwordForm.watch("newPassword") || "";
  const passwordRequirements = useMemo(() => ({
    minLength: newPassword.length >= 8,
    hasUpperCase: /[A-Z]/.test(newPassword),
    hasLowerCase: /[a-z]/.test(newPassword),
    hasNumber: /[0-9]/.test(newPassword),
  }), [newPassword]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold text-center">
            {step === "email" ? "Recuperar Senha" : "Redefinir Senha"}
          </CardTitle>
          <CardDescription className="text-center">
            {step === "email" 
              ? "Digite seu e-mail para recuperar sua senha"
              : `Digite sua nova senha para ${userEmail}`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "email" ? (
            <Form {...emailForm}>
              <form onSubmit={emailForm.handleSubmit(onVerifyEmail)} className="space-y-6">
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="seu@email.com"
                          data-testid="input-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={verifyEmailMutation.isPending}
                  data-testid="button-verify-email"
                >
                  {verifyEmailMutation.isPending ? "Verificando..." : "Verificar Email"}
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...passwordForm} key="password-form">
              <form onSubmit={passwordForm.handleSubmit(onResetPassword)} className="space-y-4">
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nova Senha</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              placeholder="Digite sua nova senha"
                              data-testid="input-new-password"
                            />
                          </FormControl>
                          <FormDescription>
                            <div className="space-y-1 mt-2">
                              <div className={`flex items-center gap-2 text-xs ${passwordRequirements.minLength ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                                <Check className={`h-3 w-3 ${passwordRequirements.minLength ? 'opacity-100' : 'opacity-30'}`} data-testid="indicator-min-length" />
                                <span>Mínimo de 8 caracteres</span>
                              </div>
                              <div className={`flex items-center gap-2 text-xs ${passwordRequirements.hasUpperCase ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                                <Check className={`h-3 w-3 ${passwordRequirements.hasUpperCase ? 'opacity-100' : 'opacity-30'}`} data-testid="indicator-uppercase" />
                                <span>Pelo menos uma letra maiúscula</span>
                              </div>
                              <div className={`flex items-center gap-2 text-xs ${passwordRequirements.hasLowerCase ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                                <Check className={`h-3 w-3 ${passwordRequirements.hasLowerCase ? 'opacity-100' : 'opacity-30'}`} data-testid="indicator-lowercase" />
                                <span>Pelo menos uma letra minúscula</span>
                              </div>
                              <div className={`flex items-center gap-2 text-xs ${passwordRequirements.hasNumber ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                                <Check className={`h-3 w-3 ${passwordRequirements.hasNumber ? 'opacity-100' : 'opacity-30'}`} data-testid="indicator-number" />
                                <span>Pelo menos um número</span>
                              </div>
                            </div>
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Nova Senha</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="Digite novamente sua nova senha"
                          data-testid="input-confirm-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={resetPasswordMutation.isPending}
                  data-testid="button-reset-password"
                >
                  {resetPasswordMutation.isPending ? "Redefinindo..." : "Redefinir Senha"}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Lembrou sua senha?{" "}
            <Link 
              href="/login"
              className="text-primary font-medium hover:underline"
              data-testid="link-login"
            >
              Voltar para login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
