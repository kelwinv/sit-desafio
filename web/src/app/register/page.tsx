"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckSquare, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (!name || !email || !password || !confirmPassword) {
      setLocalError("Por favor, preencha todos os campos");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("As senhas não coincidem");
      return;
    }

    if (password.length < 6) {
      setLocalError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    const success = await register(name, email, password);

    if (success) {
      router.push("/tasks");
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md border-t-4 border-t-sitblue-500 shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckSquare className="h-12 w-12 text-sitorange-500" />
          </div>
          <CardTitle className="text-2xl text-sitblue-500">
            Criar Conta
          </CardTitle>
          <CardDescription>
            Crie sua conta para começar a gerenciar suas tarefas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {displayError && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertDescription className="text-red-600">
                {displayError}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sitblue-500">
                Nome completo
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo"
                required
                className="border-sitblue-100 focus-visible:ring-sitblue-500"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sitblue-500">
                E-mail
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="border-sitblue-100 focus-visible:ring-sitblue-500"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sitblue-500">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                className="border-sitblue-100 focus-visible:ring-sitblue-500"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sitblue-500">
                Confirmar senha
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme sua senha"
                required
                className="border-sitblue-100 focus-visible:ring-sitblue-500"
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-sitorange-500 hover:bg-sitorange-600"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando conta...
                </>
              ) : (
                "Criar Conta"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Já tem uma conta?{" "}
              <Link
                href="/login"
                className="text-sitblue-500 hover:underline font-medium"
              >
                Faça login
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
