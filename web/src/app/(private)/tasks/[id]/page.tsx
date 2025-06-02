"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiClient, type Task } from "@/lib/api";
import { ArrowLeft, Edit, Trash2, Loader2, AlertCircle } from "lucide-react";
import { TaskForm } from "@/components/layout/tasks/form";
import { TaskStatusBadge } from "@/components/layout/tasks/statusBadge";

interface TaskDetailsPageProps {
  params: {
    id: string;
  };
}

export default function TaskDetailsPage({ params }: TaskDetailsPageProps) {
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTask();
  }, [params.id]);

  const loadTask = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const taskData = await apiClient.getTask(params.id);
      setTask(taskData);
    } catch (error) {
      console.error("Erro ao carregar tarefa:", error);
      setError(
        error instanceof Error ? error.message : "Erro ao carregar tarefa"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  const handleEdit = async (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    if (!task) return;

    try {
      const updatedTask = await apiClient.updateTask(task.id, taskData);
      setTask(updatedTask);
      setIsEditing(false);
      alert("Tarefa atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      alert(
        error instanceof Error ? error.message : "Erro ao atualizar tarefa"
      );
    }
  };

  const handleDelete = async () => {
    if (!task || !confirm("Tem certeza que deseja excluir esta tarefa?"))
      return;

    try {
      await apiClient.deleteTask(task.id);
      alert("Tarefa excluída com sucesso!");
      router.push("/tasks");
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
      alert(error instanceof Error ? error.message : "Erro ao excluir tarefa");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-sitblue-500 mx-auto mb-4" />
            <p className="text-sitblue-500">Carregando tarefa...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.push("/tasks")}
              className="text-sitblue-500 hover:text-sitblue-600 hover:bg-sitblue-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Tarefas
            </Button>
          </div>

          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-600">
              {error || "Tarefa não encontrada"}
              <Button
                variant="outline"
                size="sm"
                onClick={loadTask}
                className="ml-2 h-6 text-xs"
              >
                Tentar novamente
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/tasks")}
            className="text-sitblue-500 hover:text-sitblue-600 hover:bg-sitblue-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Tarefas
          </Button>
        </div>

        <Card className="border-t-4 border-t-sitblue-500 shadow-md">
          <CardHeader className="bg-gray-50">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="space-y-2">
                <CardTitle className="text-2xl text-sitblue-500">
                  {task.title}
                </CardTitle>
                <TaskStatusBadge status={task.status} />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="border-sitblue-500 text-sitblue-500 hover:bg-sitblue-50"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {task.description && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2 text-sitblue-500">
                  Descrição
                </h3>
                <CardDescription className="text-base">
                  {task.description}
                </CardDescription>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2 text-sitblue-500">
                  Data de Criação
                </h3>
                <p className="text-muted-foreground">
                  {formatDate(task.createdAt)}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2 text-sitblue-500">
                  Última Atualização
                </h3>
                <p className="text-muted-foreground">
                  {formatDate(task.updatedAt)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-sitblue-500">
              Editar Tarefa
            </DialogTitle>
          </DialogHeader>
          <TaskForm
            task={task}
            onSubmit={handleEdit}
            onCancel={() => setIsEditing(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
