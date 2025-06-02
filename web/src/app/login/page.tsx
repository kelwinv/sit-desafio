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

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      return;
    }

    const success = await login(email, password);

    if (success) {
      router.push("/tasks");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md border-t-4 border-t-sitblue-500 shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckSquare className="h-12 w-12 text-sitorange-500" />
          </div>
          <CardTitle className="text-2xl text-sitblue-500">
            Entrar no TaskManager
          </CardTitle>
          <CardDescription>
            Entre com suas credenciais para acessar suas tarefas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertDescription className="text-red-600">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="Sua senha"
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
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Não tem uma conta?{" "}
              <Link
                href="/register"
                className="text-sitblue-500 hover:underline font-medium"
              >
                Cadastre-se
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gradient-to-r from-blue-100 to-orange-100">
            <div className="bg-gradient-to-r text-center from-blue-50 to-orange-50 rounded-xl p-4 border border-blue-100">
              <h3 className="text-sm font-bold text-slate-700 mb-2">
                🎯 Desenvolvido para SitTrade
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sistema completo de gerenciamento de tarefas desenvolvido como
                parte do processo seletivo. Implementa autenticação, CRUD,
                filtros avançados e interface responsiva.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
