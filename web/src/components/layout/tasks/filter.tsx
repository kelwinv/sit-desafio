"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TaskStatus } from "@/types/task";

interface TaskFilterProps {
  value: TaskStatus | "all";
  onValueChange: (value: TaskStatus | "all") => void;
}

export function TaskFilter({ value, onValueChange }: TaskFilterProps) {
  return (
    <div className="flex items-center space-x-2">
      <label
        htmlFor="status-filter"
        className="text-sm font-medium text-sitblue-500"
      >
        Filtrar por status:
      </label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger
          id="status-filter"
          className="w-[180px] border-sitblue-100 focus:ring-sitblue-500"
        >
          <SelectValue placeholder="Selecione o status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas</SelectItem>
          <SelectItem value="pending">Pendente</SelectItem>
          <SelectItem value="in-progress">Em Progresso</SelectItem>
          <SelectItem value="completed">Concluída</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
