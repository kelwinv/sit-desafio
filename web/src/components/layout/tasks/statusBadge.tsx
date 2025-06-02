import { Badge } from "@/components/ui/badge";
import type { TaskStatus } from "@/types/task";

interface TaskStatusBadgeProps {
  status: TaskStatus;
}

const statusConfig = {
  pending: {
    label: "Pendente",
    variant: "outline" as const,
    className: "bg-white text-sitblue-500 border-sitblue-500",
  },
  "in-progress": {
    label: "Em Progresso",
    variant: "default" as const,
    className: "bg-sitblue-500 text-white",
  },
  completed: {
    label: "Concluída",
    variant: "secondary" as const,
    className: "bg-sitorange-500 text-white",
  },
};

export function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
}
