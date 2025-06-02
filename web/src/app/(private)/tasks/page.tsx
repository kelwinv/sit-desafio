"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiClient, type Task } from "@/lib/api";
import { Plus, Search, Loader2, AlertCircle } from "lucide-react";
import { TaskStatus } from "@/types/task";
import { TaskCard } from "@/components/layout/tasks/card";
import { TaskFilter } from "@/components/layout/tasks/filter";
import { TaskForm } from "@/components/layout/tasks/form";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const tasksData = await apiClient.getTasks();
      setTasks(tasksData);
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error);
      setError(
        error instanceof Error ? error.message : "Erro ao carregar tarefas"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleCreateTask = async (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const newTask = await apiClient.createTask(taskData);
      setTasks((prev) => [newTask, ...prev]);
      setIsFormOpen(false);
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
      alert(error instanceof Error ? error.message : "Erro ao criar tarefa");
    }
  };

  const handleEditTask = async (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => {
    if (!editingTask) return;

    try {
      const updatedTask = await apiClient.updateTask(editingTask.id, taskData);
      setTasks((prev) =>
        prev.map((task) => (task.id === editingTask.id ? updatedTask : task))
      );
      setEditingTask(null);
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      alert(
        error instanceof Error ? error.message : "Erro ao atualizar tarefa"
      );
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Tem certeza que deseja excluir esta tarefa?")) return;

    try {
      await apiClient.deleteTask(taskId);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
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
            <p className="text-sitblue-500">Carregando tarefas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-bold text-sitblue-500">
              Minhas Tarefas
            </h1>
            <p className="text-muted-foreground">
              Gerencie suas tarefas de forma eficiente
            </p>
          </div>
          <Button
            onClick={() => setIsFormOpen(true)}
            className="bg-sitorange-500 hover:bg-sitorange-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Tarefa
          </Button>
        </div>

        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-600">
              {error}
              <Button
                variant="outline"
                size="sm"
                onClick={loadTasks}
                className="ml-2 h-6 text-xs"
              >
                Tentar novamente
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col sm:flex-row gap-4 bg-gray-50 p-4 rounded-lg">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar tarefas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-sitblue-100 focus-visible:ring-sitblue-500"
              aria-label="Buscar tarefas"
            />
          </div>
          <TaskFilter value={statusFilter} onValueChange={setStatusFilter} />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={setEditingTask}
                onDelete={handleDeleteTask}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-sitblue-500 text-lg">
                {searchTerm || statusFilter !== "all"
                  ? "Nenhuma tarefa encontrada com os filtros aplicados."
                  : "Você ainda não tem tarefas. Crie sua primeira tarefa!"}
              </p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-sitblue-500">Nova Tarefa</DialogTitle>
          </DialogHeader>
          <TaskForm
            onSubmit={handleCreateTask}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-sitblue-500">
              Editar Tarefa
            </DialogTitle>
          </DialogHeader>
          {editingTask && (
            <TaskForm
              task={editingTask}
              onSubmit={handleEditTask}
              onCancel={() => setEditingTask(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
