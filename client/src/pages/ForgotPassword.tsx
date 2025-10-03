import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { KeyRound } from "lucide-react";

export default function ForgotPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-4">
              <KeyRound className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            Recuperar Senha
          </CardTitle>
          <CardDescription>
            Em breve você poderá recuperar sua senha de forma segura através do seu e-mail cadastrado.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Esta funcionalidade estará disponível em breve. Por enquanto, você pode agendar consultas sem fazer login.
          </p>
          <Link href="/login">
            <Button className="w-full" data-testid="button-back-to-login">
              Voltar para Login
            </Button>
          </Link>
          <Link href="/agendar">
            <Button variant="outline" className="w-full" data-testid="button-book-appointment">
              Agendar Consulta
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
