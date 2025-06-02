"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Task } from "@/lib/api";
import { Eye, Edit, Trash2 } from "lucide-react";
import { TaskStatusBadge } from "./statusBadge";

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  return (
    <Card className="w-full border-t-4 border-t-sitblue-500 shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg text-sitblue-500 font-semibold">
              {task.title}
            </CardTitle>
            <TaskStatusBadge status={task.status} />
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-sitblue-500 hover:text-sitblue-600 hover:bg-sitblue-50"
              asChild
            >
              <Link
                href={`/tasks/${task.id}`}
                aria-label={`Ver detalhes da tarefa ${task.title}`}
              >
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-sitblue-500 hover:text-sitblue-600 hover:bg-sitblue-50"
              onClick={() => onEdit?.(task)}
              aria-label={`Editar tarefa ${task.title}`}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => onDelete?.(task.id)}
              aria-label={`Excluir tarefa ${task.title}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      {task.description && (
        <CardContent>
          <CardDescription className="text-sm">
            {task.description}
          </CardDescription>
          <div className="mt-4 text-xs text-muted-foreground">
            <p>Criada em: {formatDate(task.createdAt)}</p>
            <p>Atualizada em: {formatDate(task.updatedAt)}</p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
