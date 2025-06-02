export type TaskStatus = "pending" | "in-progress" | "completed";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
}
