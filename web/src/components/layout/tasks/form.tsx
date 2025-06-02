"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Task } from "@/lib/api";
import type { TaskStatus } from "@/types/task";

interface TaskFormProps {
  task?: Task;
  onSubmit: (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
}

export function TaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [status, setStatus] = useState<TaskStatus>(task?.status || "pending");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("O título é obrigatório");
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      status,
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-t-4 border-t-sitblue-500 shadow-md">
      <CardHeader className="bg-gray-50">
        <CardTitle className="text-sitblue-500">
          {task ? "Editar Tarefa" : "Nova Tarefa"}
        </CardTitle>
        <CardDescription>
          {task
            ? "Atualize as informações da tarefa"
            : "Preencha os dados para criar uma nova tarefa"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sitblue-500">
              Título *
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título da tarefa"
              required
              aria-describedby="title-error"
              className="border-sitblue-100 focus-visible:ring-sitblue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sitblue-500">
              Descrição
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Digite uma descrição opcional"
              rows={3}
              className="border-sitblue-100 focus-visible:ring-sitblue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-sitblue-500">
              Status
            </Label>
            <Select
              value={status}
              onValueChange={(value: TaskStatus) => setStatus(value)}
            >
              <SelectTrigger
                id="status"
                className="border-sitblue-100 focus:ring-sitblue-500"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="in-progress">Em Progresso</SelectItem>
                <SelectItem value="completed">Concluída</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-sitorange-500 hover:bg-sitorange-600"
            >
              {task ? "Atualizar" : "Criar"} Tarefa
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 border-sitblue-500 text-sitblue-500 hover:bg-sitblue-50"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
