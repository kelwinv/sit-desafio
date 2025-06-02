"use client";

import { useRouter } from "next/navigation";
import { apiClient, type Task } from "@/lib/api";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskForm } from "@/components/layout/tasks/form";

export default function NewTaskPage() {
  const router = useRouter();

  const handleSubmit = async (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      await apiClient.createTask(taskData);
      alert("Tarefa criada com sucesso!");
      router.push("/tasks");
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
      alert(error instanceof Error ? error.message : "Erro ao criar tarefa");
    }
  };

  const handleCancel = () => {
    router.push("/tasks");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/tasks")}
            className="text-sitblue-500 hover:text-sitblue-600 hover:bg-sitblue-50 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Tarefas
          </Button>

          <h1 className="text-3xl font-bold text-sitblue-500">Nova Tarefa</h1>
          <p className="text-muted-foreground">
            Preencha os dados para criar uma nova tarefa
          </p>
        </div>

        <TaskForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </div>
  );
}
